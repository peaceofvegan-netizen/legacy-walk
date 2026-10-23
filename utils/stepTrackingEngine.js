import { captureAccountSession, isAccountSessionEnded } from './accountStorage';
import { Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { AppState, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import { addMarathonSteps as commitMarathonSteps, getActiveMarathon } from './marathonStorage';
import { historyBatch, nextHistory, recordOwner } from './stepHistory';
import { count, localDateKey, reliableFix, verifyWindow } from './verifiedStepWindow';

export const STEP_STATS_KEY = '@legathon_step_stats';
export const STEP_ROUTER_KEY = '@legathon_step_router';
export const ACTIVE_DESTINATION_KEY = '@legathon_active_step_destination';
export const JOURNEY_REWARD_STEPS_KEY = '@legathon_journey_reward_steps';
export const MOVEMENT_FILTER_KEY = '@legathon_movement_filter';
export const STEPS_PER_MILE = 2000;
export const STEP_DESTINATIONS = { NONE: 'none', JOURNEY: 'journey', MARATHON: 'marathon' };
const iso = () => new Date().toISOString();
const destinationOf = value => ['journey', 'marathon'].includes(value) ? value : 'none';
export const stepsToMiles = steps => Number((count(steps) / 2000).toFixed(2));
export const stepsToCalories = steps => Math.round(count(steps) * 0.04);
let queue = Promise.resolve();
let runtime = null;
let status = Platform.OS === 'ios' ? 'Preparing walking history' : 'Start a Journey or Legathon to verify walking';

// All engine reads/writes share one queue. Capture the account before queuing.
function serialized(operation) {
  const account = captureAccountSession();
  const next = queue.then(async () => {
    account.assertCurrent();
    const value = await operation(account);
    account.assertCurrent();
    return value;
  });
  queue = next.catch(() => {});
  return next;
}
function parse(raw, fallback) {
  if (raw === null) return fallback;
  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Saved step data is invalid. Progress was not changed.');
  return value;
}
function normalize(value = {}) {
  const day = localDateKey();
  const sameDay = value.dateKey === day;
  const journey = count(value.journeyLifetimeSteps ?? value.lifetimeSteps ?? value.totalSteps);
  const today = sameDay ? count(value.todaySteps) : 0;
  return { ...value, schemaVersion: 4, dateKey: day, todaySteps: today,
    lifetimeSteps: journey, totalSteps: journey, journeyLifetimeSteps: journey,
    marathonLifetimeSteps: count(value.marathonLifetimeSteps),
    generalLifetimeSteps: count(value.generalLifetimeSteps),
    dailyHistory: value.dailyHistory || {},
    trackingStartedAt: Number.isFinite(value.trackingStartedAt) ? value.trackingStartedAt : Date.now(),
    liveSessionSteps: sameDay ? count(value.liveSessionSteps) : 0,
    miles: stepsToMiles(journey), milesWalked: stepsToMiles(journey),
    calories: stepsToCalories(today), caloriesBurned: stepsToCalories(today),
    dayStreak: count(value.dayStreak), journeyCredits: value.journeyCredits || {},
    router: value.router || {}, pendingCredit: value.pendingCredit || null,
    lastUpdated: value.lastUpdated || null };
}
async function write(account, value) {
  const result = normalize(value);
  result.lastUpdated = iso();
  await account.run(() => account.storage.setItem(STEP_STATS_KEY, JSON.stringify(result)));
  return result;
}
async function read(account) {
  const raw = await account.run(() => account.storage.getItem(STEP_STATS_KEY));
  const saved = parse(raw, {});
  let stats = normalize(saved);
  if (!raw || saved.dateKey !== stats.dateKey || saved.schemaVersion !== 4) stats = await write(account, stats);
  if (stats.pendingCredit) stats = await recover(account, stats);
  return stats;
}
async function mirror(account, stats) {
  // Mirrors are never read back as authoritative totals.
  try {
    await account.run(() => account.storage.multiSet([
      ['lifetimeSteps', String(stats.journeyLifetimeSteps)],
      ['LifetimeSteps', String(stats.journeyLifetimeSteps)],
      [JOURNEY_REWARD_STEPS_KEY, String(stats.journeyLifetimeSteps)],
      [STEP_ROUTER_KEY, JSON.stringify(stats.router)],
    ]));
  } catch (error) { if (isAccountSessionEnded(error)) throw error; console.warn('Step mirror refresh failed', error); }
}
function applyCredit(stats, transaction, amount) {
  const next = normalize(stats);
  if (transaction.dateKey === next.dateKey) {
    next.todaySteps += amount;
    next.liveSessionSteps += amount;
  }
  next.dailyHistory = { ...next.dailyHistory, [transaction.dateKey]: count(next.dailyHistory[transaction.dateKey]) + amount };
  if (transaction.destination === 'none') next.generalLifetimeSteps += amount;
  else if (transaction.destination === 'marathon') next.marathonLifetimeSteps += amount;
  else {
    next.journeyLifetimeSteps += amount;
    if (transaction.journeyId) {
      next.journeyCredits = { ...next.journeyCredits,
        [transaction.journeyId]: count(next.journeyCredits[transaction.journeyId]) + amount };
    }
  }
  if (transaction.historyEnd !== undefined) {
    // Daily counts include all accepted physical steps, including marathon overflow.
    const overflow = count(transaction.amount - amount);
    next.generalLifetimeSteps += overflow;
    next.dailyHistory[transaction.dateKey] += overflow;
    if (transaction.dateKey === next.dateKey) { next.todaySteps += overflow; next.liveSessionSteps += overflow; }
    next.history = nextHistory(next.history, transaction.historyEnd);
  }
  next.pendingCredit = null;
  return next;
}
async function recover(account, stats) {
  const tx = stats.pendingCredit;
  const result = await account.run(() => commitMarathonSteps(tx.amount, {
    creditId: tx.id, marathonId: tx.marathonId, historyCredit: tx.historyEnd !== undefined,
  }));
  if (!result?.saved) throw new Error(result?.reason || 'Marathon credit could not be saved. Retry sync.');
  const updated = await write(account, applyCredit(stats, tx, count(result.added)));
  await mirror(account, updated);
  return updated;
}
export function loadStepStats() { return serialized(read); }
export const getStepStats = loadStepStats;
export const getStepsStats = loadStepStats;
// Old screens cannot overwrite counters with stale full-object snapshots.
export async function saveStepStats() {
  return { saved: false, reason: 'use-verified-step-engine', error: new Error('Step totals are managed by the verified step engine.') };
}
export const setStepStats = saveStepStats;
export async function getCreditedTodaySteps() { return (await loadStepStats()).todaySteps; }
export async function getLifetimeSteps() { return (await loadStepStats()).journeyLifetimeSteps; }
export const getJourneyLifetimeSteps = getLifetimeSteps;
export const getJourneyRewardSteps = getLifetimeSteps;
export async function getMarathonLifetimeSteps() { return (await loadStepStats()).marathonLifetimeSteps; }
export async function getJourneyCreditedSteps(id) { return count((await loadStepStats()).journeyCredits[String(id)]); }
export async function isStepTrackingAvailable() { return Pedometer.isAvailableAsync(); }
// Diagnostic only: never import a whole day's device total into reward totals.
export async function getTodaySteps() {
  const end = new Date();
  const start = new Date(end); start.setHours(0, 0, 0, 0);
  const result = await Pedometer.getStepCountAsync(start, end);
  if (!Number.isFinite(result?.steps) || result.steps < 0) throw new Error('Device steps unavailable');
  return count(result.steps);
}
function stopRuntime() {
  const old = runtime;
  runtime = null;
  old?.pedometer?.remove(); old?.location?.remove(); old?.appState?.remove();
}
function resetWindow(rt) {
  rt.start = Date.now(); rt.base = rt.steps; rt.invalid = false;
  rt.fixes = rt.lastFix && reliableFix(rt.lastFix, rt.start) ? [rt.lastFix] : [];
}
export function stopStepVerification() { stopRuntime(); status = 'Tracking stopped'; }
export function getStepVerificationStatus() {
  if (runtime && !runtime.account.isCurrent()) { stopRuntime(); status = 'Tracking stopped'; }
  return status;
}
async function startRuntime(account) {
  if (runtime?.account.isCurrent()) return runtime;
  stopRuntime();
  const motion = await account.run(() => Pedometer.getPermissionsAsync());
  const location = await account.run(() => Location.getForegroundPermissionsAsync());
  if (!motion.granted || !location.granted) {
    status = 'Motion and precise location access are required to verify walking';
    return null;
  }
  if (!(await account.run(() => Pedometer.isAvailableAsync()))) {
    status = 'Step sensor unavailable'; return null;
  }
  const rt = { account, start: Date.now(), steps: 0, base: 0, lastReading: null,
    fixes: [], lastFix: null, blockedUntil: 0, invalid: false };
  runtime = rt;
  status = 'Verifying outdoor walking — keep the app open';
  try {
    rt.pedometer = Pedometer.watchStepCount(result => {
      if (runtime !== rt || !account.isCurrent()) { if (runtime === rt) stopRuntime(); return; }
      if (AppState.currentState !== 'active') { rt.invalid = true; return; }
      const reading = result?.steps;
      if (!Number.isFinite(reading) || reading < 0) { rt.invalid = true; return; }
      if (rt.lastReading !== null && reading >= rt.lastReading) rt.steps += reading - rt.lastReading;
      else rt.invalid = true; // First callback and counter resets establish a baseline only.
      rt.lastReading = reading;
    });
    rt.appState = AppState.addEventListener('change', state => {
      if (runtime !== rt) return;
      // No catch-up credit after background/lock. We lack interval-level evidence.
      rt.lastReading = null; rt.lastFix = null; resetWindow(rt);
      status = state === 'active' ? 'Verifying outdoor walking — keep the app open' : 'Verification paused while app is in background';
    });
    let startupTimer;
    const startup = Location.watchPositionAsync({ accuracy: Location.Accuracy.High,
      timeInterval: 1000, distanceInterval: 0 }, fix => {
      if (runtime !== rt || !account.isCurrent()) { if (runtime === rt) stopRuntime(); return; }
      if (AppState.currentState !== 'active') return;
      if (!reliableFix(fix, Date.now())) { rt.invalid = true; status = 'Waiting for precise GPS — steps unverified'; return; }
      if (fix.timestamp <= (rt.lastFix?.timestamp || 0)) return;
      rt.lastFix = fix;
      rt.fixes.push(fix);
      if (rt.fixes.length > 100) rt.fixes.shift();
      if (Number.isFinite(fix.coords.speed) && fix.coords.speed > 2.5) {
        rt.blockedUntil = Date.now() + 20000; rt.invalid = true;
        status = 'Vehicle-speed movement — steps paused';
      }
    });
    // Timeout cannot cancel the native request. Dispose a late subscription.
    startup.then(subscription => {
      if (runtime !== rt || !account.isCurrent()) subscription.remove();
    }, () => {});
    let subscription;
    try {
      subscription = await Promise.race([startup, new Promise((_, reject) => {
        startupTimer = setTimeout(() => reject(new Error('GPS startup timed out. Try again outdoors.')), 8000);
      })]);
    } finally { clearTimeout(startupTimer); }
    if (!account.isCurrent() || runtime !== rt) { subscription.remove(); account.assertCurrent(); return null; }
    rt.location = subscription;
    return rt;
  } catch (error) { if (runtime === rt) stopRuntime(); throw error; }
}
async function owner(account, stats) {
  const destination = destinationOf(await account.run(() => account.storage.getItem(ACTIVE_DESTINATION_KEY)));
  const active = destination === 'marathon' ? await account.run(() => getActiveMarathon()) : null;
  return { destination, owner: destination === 'none' ? null : destination,
    journeyActive: destination === 'journey', marathonActive: destination === 'marathon',
    legathonActive: destination === 'marathon', marathonId: active?.marathonId || active?.id || null,
    journeyId: stats.router?.journeyId || null };
}
export function getCurrentStepOwner() { return serialized(async account => owner(account, await read(account))); }
export async function getActiveStepDestination() { return (await getCurrentStepOwner()).destination; }
function activate(destination, journeyId) {
  return serialized(async account => {
    const stats = await read(account);
    const previous = await owner(account, stats);
    if (Platform.OS === 'ios' && !stats.history) stats.history = { cursor: stats.trackingStartedAt, owners: [{ at: stats.trackingStartedAt, ...previous }] };
    const nextId = journeyId ? String(journeyId) : stats.router.journeyId || null;
    if (previous.destination !== destination || nextId !== stats.router.journeyId) stopRuntime();
    stats.router = { ...stats.router, journeyId: nextId, lastDestination: destination };
    if (Platform.OS === 'ios') {
      const marathon = destination === 'marathon' ? await account.run(getActiveMarathon) : null;
      stats.history = recordOwner(stats.history, { at: Date.now(), destination, journeyId: nextId, marathonId: marathon?.marathonId || marathon?.id || null });
    }
    await write(account, stats);
    await account.run(() => account.storage.setItem(ACTIVE_DESTINATION_KEY, destination));
    if (destination === 'none') stopRuntime();
    return { saved: true, destination };
  });
}
export function activateJourneyTracking(journeyId) { return activate('journey', journeyId); }
export function activateMarathonTracking() { return activate('marathon'); }
export function deactivateStepTracking() { return activate('none'); }
export function pauseJourneyTracking(journeyId) {
  return serialized(async account => {
    const stats = await read(account);
    const current = await owner(account, stats);
    if (current.destination === 'journey' && current.journeyId === String(journeyId)) {
      stopRuntime();
      if (Platform.OS === 'ios') {
        stats.history = recordOwner(stats.history || {cursor: stats.trackingStartedAt, owners: [{at: stats.trackingStartedAt, ...current}]}, {at: Date.now(), destination: 'none', journeyId: null, marathonId: null});
        await write(account, stats);
      }
      await account.run(() => account.storage.setItem(ACTIVE_DESTINATION_KEY, 'none'));
    }
    return { saved: true };
  });
}

export function setActiveStepDestination(value) { return activate(destinationOf(value)); }
export function resetStepRouterBaseline({ discardHistory = false } = {}) {
  return serialized(async account => {
    stopRuntime();
    const stats = await read(account);
    stats.router = { journeyId: stats.router.journeyId || null };
    if (discardHistory) {
      stats.trackingStartedAt = Date.now();
      stats.history = {cursor: Date.now(), owners: [{at: Date.now(), ...(await owner(account, stats))}]};
    }
    await write(account, stats);
    return { reset: true, state: stats.router };
  });
}
export async function requestStepVerificationPermissions() {
  const account = captureAccountSession(); account.assertCurrent();
  const motion = await account.run(() => Pedometer.requestPermissionsAsync());
  if (Platform.OS === 'ios') return Boolean(motion.granted);
  const location = await account.run(() => Location.requestForegroundPermissionsAsync());
  return Boolean(motion.granted && location.granted);
}
async function community(account, amount) {
  try {
    const { data } = await account.run(() => supabase.auth.getSession());
    if (!data?.session?.user) return;
    for (let remaining = amount; remaining > 0; remaining -= 500) {
      const { error } = await account.run(() => supabase.rpc('credit_my_community_challenges', { p_steps: Math.min(remaining, 500) }));
      if (error) return; // Never automatically retry an uncertain server response.
    }
  } catch (error) { if (!isAccountSessionEnded(error)) console.warn('Community credit unavailable', error); }
}
async function syncHistory(account, stats, currentOwner) {
  stopRuntime();
  if (!stats.history) {
    stats.history = { cursor: stats.trackingStartedAt,
      owners: [{ at: stats.trackingStartedAt, ...currentOwner }] };
    stats = await write(account, stats);
  }
  // Recorded ownership is authoritative for intervals, even if a session has
  // changed since then. Future destination changes are saved by activate().
  const batch = await account.run(() => historyBatch(stats.history, Date.now()));
  let added = 0;
  for (const segment of batch.segments) {
    const tx = { id: `history-${segment.start}-${segment.end}`,
      amount: segment.steps, dateKey: segment.dateKey,
      destination: segment.destination, journeyId: segment.journeyId,
      marathonId: segment.marathonId, historyEnd: segment.end };
    if (tx.destination === 'marathon' && tx.marathonId && tx.amount > 0) {
      stats.pendingCredit = tx;
      stats = await write(account, stats);
      stats = await recover(account, stats);
    } else {
      if (tx.destination === 'marathon') tx.destination = 'none';
      stats = await write(account, applyCredit(stats, tx, tx.amount));
    }
    added += tx.amount;
  }
  await mirror(account, stats);
  status = batch.message;
  if (added) void community(account, added);
  const active = currentOwner.destination === 'marathon' ? await account.run(getActiveMarathon) : null;
  return { synced: true, routed: added > 0, added, delta: added, ...currentOwner,
    stats, reason: batch.reason, verificationStatus: status,
    completedNow: currentOwner.destination === 'marathon' && !active,
    historyPending: batch.pending };
}
export async function syncTodaySteps() {
  try {
    return await serialized(async account => {
      let stats = await read(account); // Rollover happens even with no sensor/owner.
      const currentOwner = await owner(account, stats);
      if (Platform.OS === 'ios') return syncHistory(account, stats, currentOwner);
      const empty = reason => ({ synced: true, routed: false, added: 0, delta: 0, ...currentOwner, reason });
      if (currentOwner.destination === 'none') { stopRuntime(); status = 'Start a Journey or Legathon to verify walking'; return empty('no-active-destination'); }
      if (AppState.currentState !== 'active') { if (runtime) resetWindow(runtime); return empty('background-unverified'); }
      const rt = await startRuntime(account);
      if (!rt) return empty('permissions-or-sensor-unavailable');
      const end = Date.now();
      if (end - rt.start < 10000) return empty('collecting-walking-evidence');
      const amount = count(rt.steps - rt.base);
      const check = rt.invalid ? { allowed: false, reason: 'sensor-or-gps-gap' } : verifyWindow({
        start: rt.start, end, steps: amount, fixes: rt.fixes, blockedUntil: rt.blockedUntil,
      });
      if (!check.allowed && ['movement-unverified', 'gps-unverified', 'no-new-steps'].includes(check.reason) && end - rt.start < 30000) {
        status = 'Verifying movement — steps not yet credited'; return empty(check.reason);
      }
      const sampleDay = localDateKey(new Date(rt.start));
      resetWindow(rt); // Rejected intervals can never leak into later credits.
      if (!check.allowed || sampleDay !== localDateKey()) {
        status = check.reason === 'vehicle-speed' || end < rt.blockedUntil
          ? 'Vehicle-speed movement — steps paused' : 'Walking unverified — move outdoors with precise GPS';
        return empty(check.reason);
      }
      const tx = { id: `${end}-${Math.random().toString(36).slice(2)}`, amount,
        dateKey: sampleDay, destination: currentOwner.destination,
        journeyId: currentOwner.journeyId, marathonId: currentOwner.marathonId };
      if (tx.destination === 'marathon' && !tx.marathonId) return empty('no-active-marathon');
      stats.router = { ...stats.router, lastDelta: amount, dateKey: sampleDay, lastUpdated: iso() };
      let result = null, credited = amount;
      if (tx.destination === 'marathon') {
        // Durable journal + idempotency in marathonStorage covers partial writes.
        stats.pendingCredit = tx;
        stats = await write(account, stats);
        const previous = stats.marathonLifetimeSteps;
        stats = await recover(account, stats);
        credited = stats.marathonLifetimeSteps - previous;
        result = await account.run(() => getActiveMarathon());
      } else {
        stats = await write(account, applyCredit(stats, tx, amount));
        await mirror(account, stats);
      }
      status = 'Walking verified';
      // Local progress is committed before best-effort community credit.
      void community(account, credited);
      return { synced: true, routed: true, added: credited, delta: credited, ...currentOwner,
        movement: check, stats, result, completedNow: tx.destination === 'marathon' && !result,
        reason: check.reason };
    });
  } catch (error) {
    if (!isAccountSessionEnded(error)) status = error.message || 'Step sync unavailable';
    return { synced: false, routed: false, added: 0, delta: 0, error };
  }
}
// Compatibility entry points no longer trust arbitrary screen-supplied deltas.
export async function addRegularJourneySteps() { return { saved: false, added: 0, reason: 'direct-credit-disabled-use-sync' }; }
export const addJourneySteps = addRegularJourneySteps;
export const addMarathonSteps = addRegularJourneySteps;
export const routePhysicalSteps = syncTodaySteps;
export function watchLiveSteps(onStepUpdate) {
  let disposed = false;
  const account = captureAccountSession();
  const tick = async () => {
    try {
      const stats = await account.run(loadStepStats);
      if (!disposed) onStepUpdate?.({ liveSteps: stats.todaySteps, verified: true });
    } catch (_) { /* Unmounted/account ended: no callback. */ }
  };
  const timer = setInterval(tick, 1500); void tick();
  return { remove() { disposed = true; clearInterval(timer); } };
}
export function stopLiveSteps(subscription) { subscription?.remove?.(); return true; }
export function getStepTrackingSnapshot() {
  return serialized(async account => {
    const stats = await read(account);
    return { ...stats, ...(await owner(account, stats)), stats, router: stats.router,
      journeyRewardSteps: stats.journeyLifetimeSteps, verificationStatus: getStepVerificationStatus(),
      pendingManualJourneySteps: 0, pendingManualMarathonSteps: 0 };
  });
}
export function resetStepTrackingEngine({ preserveJourneyLifetime = true, preserveMarathonLifetime = true } = {}) {
  return serialized(async account => {
    stopRuntime();
    const old = await read(account);
    const stats = await write(account, { dateKey: localDateKey(),
      journeyLifetimeSteps: preserveJourneyLifetime ? old.journeyLifetimeSteps : 0,
      marathonLifetimeSteps: preserveMarathonLifetime ? old.marathonLifetimeSteps : 0,
      generalLifetimeSteps: preserveJourneyLifetime ? old.generalLifetimeSteps : 0,
      journeyCredits: old.journeyCredits });
    await account.run(() => account.storage.setItem(ACTIVE_DESTINATION_KEY, 'none'));
    await mirror(account, stats);
    return { reset: true, journeyLifetimeSteps: stats.journeyLifetimeSteps, marathonLifetimeSteps: stats.marathonLifetimeSteps };
  });
}

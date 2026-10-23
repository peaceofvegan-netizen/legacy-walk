import { requireOptionalNativeModule } from 'expo-modules-core';
import { localDateKey } from './verifiedStepWindow';

const native = requireOptionalNativeModule('LegathonMotionHistory');
const DAY = 86400000;
// Activity history can lag sensor events. Leave a settling window before crediting.
export const HISTORY_DELAY_MS = 5 * 60000;
const MAX_BATCH_MS = 6 * 60 * 60 * 1000;

function timeout(promise) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Motion history timed out. Saved progress is unchanged; retry when the app is open.')), 20000);
  })]).finally(() => clearTimeout(timer));
}
export function recordOwner(history, event) {
  if (!Number.isFinite(event.at)) throw new Error('Invalid ownership time');
  const owners = [...history.owners];
  const last = owners[owners.length - 1];
  if (last && event.at < last.at) throw new Error('Phone clock moved backward. Check Date & Time settings.');
  if (!last || last.destination !== event.destination || last.journeyId !== event.journeyId || last.marathonId !== event.marathonId) {
    if (last?.at === event.at) owners.pop();
    owners.push(event);
  }
  return { ...history, owners };
}
export function nextHistory(history, cursor) {
  const before = history.owners.filter(o => o.at <= cursor).slice(-1);
  const after = history.owners.filter(o => o.at > cursor);
  return { ...history, cursor, owners: [...before, ...after] };
}
function walking(activity) {
  // Automotive takes priority even when Apple sets multiple flags (e.g. a car
  // stopped at a light). Unclassified/low-confidence movement earns no credit.
  return activity && !activity.automotive && !activity.cycling && !activity.unknown &&
    (activity.walking || activity.running) && activity.confidence >= 1;
}
export function planIntervals(start, end, activities, owners) {
  if (!Array.isArray(activities) || !Array.isArray(owners)) throw new Error('Invalid motion history');
  const events = [...activities].sort((a,b) => a.at - b.at);
  if (events.some(a => !Number.isFinite(a.at) || !Number.isFinite(a.confidence))) throw new Error('Invalid activity timestamp');
  const boundaries = new Set([start, end]);
  for (const event of [...events, ...owners]) if (event.at > start && event.at < end) boundaries.add(event.at);
  let midnight = new Date(start); midnight.setHours(24,0,0,0);
  while (midnight.getTime() < end) { boundaries.add(midnight.getTime()); midnight.setDate(midnight.getDate()+1); }
  const points = [...boundaries].sort((a,b) => a-b);
  return points.slice(0,-1).map((at,i) => {
    const activity = events.filter(e => e.at <= at).slice(-1)[0];
    const owner = owners.filter(o => o.at <= at).slice(-1)[0] || {destination:'none'};
    return { start: at, end: points[i+1], dateKey: localDateKey(new Date(at)),
      destination: owner.destination || 'none', journeyId: owner.journeyId || null,
      marathonId: owner.marathonId || null, accepted: Boolean(walking(activity)),
      reason: activity?.automotive ? 'vehicle' : walking(activity) ? 'walking' : 'unverified' };
  });
}
export async function historyBatch(history, now) {
  if (!native) throw new Error('Closed-app tracking needs the new iPhone build. Install the updated TestFlight build.');
  const available = await timeout(native.isAvailableAsync());
  if (!available) throw new Error('Motion history is unavailable on this device.');
  const start = history.cursor;
  if (!Number.isFinite(start) || start > now) throw new Error('Invalid step checkpoint or phone clock. Progress was not reset.');
  // Apple's historical retention is at most seven days. Keep a margin for
  // query latency and report a missing interval rather than fabricating steps.
  const earliest = now - 7 * DAY + 60000;
  if (start < earliest) return { segments: [{ start, end: earliest, dateKey: localDateKey(new Date(start)),
    destination: 'none', steps: 0 }], pending: true, reason: 'history-expired',
    message: 'Some walking history is older than Apple retains and could not be recovered.' };
  const end = Math.min(now - HISTORY_DELAY_MS, start + MAX_BATCH_MS);
  if (end <= start) return { segments: [], pending: false, reason: 'waiting-for-history',
    message: 'Motion tracking enabled — recent steps are syncing' };
  const activities = await timeout(native.getActivitiesAsync(start, end));
  if (!activities.length) throw new Error('Waiting for motion history. Allow Motion & Fitness access; no steps were reset.');
  const plan = planIntervals(start, end, activities, history.owners).slice(0,100);
  const segments = [];
  for (const interval of plan) {
    let steps = 0;
    if (interval.accepted) {
      const result = await timeout(native.getStepsAsync(interval.start, interval.end));
      if (!Number.isSafeInteger(result) || result < 0) throw new Error('Invalid pedometer history; checkpoint preserved.');
      steps = result;
    }
    segments.push({ ...interval, steps });
  }
  const pending = (segments[segments.length-1]?.end || start) < now - HISTORY_DELAY_MS;
  const vehicle = segments.some(s => s.reason === 'vehicle');
  return { segments, pending, reason: 'motion-history', message: pending
    ? 'Syncing saved walking history'
    : vehicle ? 'Walking synced — vehicle activity excluded'
    : 'Walking history synced — tracking continues with phone locked' };
}

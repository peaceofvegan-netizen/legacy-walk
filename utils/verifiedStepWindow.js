// Pure verification rules. GPS is evidence, not a guarantee of human walking.
export const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export const count = value => Number.isFinite(Number(value)) ? Math.max(0, Math.floor(Number(value))) : 0;
export function distanceMeters(a, b) {
  const r = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * r;
  const dLon = (b.longitude - a.longitude) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * r) * Math.cos(b.latitude * r) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function reliableFix(fix, now) {
  const c = fix?.coords;
  return Boolean(c && !fix.mocked && Number.isFinite(fix.timestamp) &&
    now - fix.timestamp <= 10000 && fix.timestamp <= now + 1000 &&
    Number.isFinite(c.latitude) && Math.abs(c.latitude) <= 90 &&
    Number.isFinite(c.longitude) && Math.abs(c.longitude) <= 180 &&
    Number.isFinite(c.accuracy) && c.accuracy >= 0 && c.accuracy <= 15);
}
export function verifyWindow({ start, end, steps, fixes, blockedUntil = 0 }) {
  const seconds = (end - start) / 1000;
  const reject = reason => ({ allowed: false, reason });
  if (localDateKey(new Date(start)) !== localDateKey(new Date(end))) return reject('new-day');
  if (seconds <= 0 || seconds > 35) return reject('tracking-gap');
  if (end < blockedUntil) return reject('vehicle-release-window');
  if (steps <= 0) return reject('no-new-steps');
  if (steps / seconds > 3.5) return reject('implausible-step-rate');
  if (fixes.length < 2 || !reliableFix(fixes[fixes.length - 1], end)) return reject('gps-unverified');
  const first = fixes[0], last = fixes[fixes.length - 1];
  if (first.timestamp > start + 5000 || last.timestamp < end - 5000) return reject('gps-gap');
  let previous = first;
  for (const fix of fixes) {
    if (!reliableFix(fix, fix.timestamp)) return reject('gps-unverified');
    if (fix.timestamp - previous.timestamp > 10000) return reject('gps-gap');
    const speed = fix.coords.speed;
    if (Number.isFinite(speed) && speed > 2.5) return reject('vehicle-speed');
    const dt = (fix.timestamp - previous.timestamp) / 1000;
    if (dt > 0) {
      const lowerDistance = Math.max(0, distanceMeters(previous.coords, fix.coords) - previous.coords.accuracy - fix.coords.accuracy);
      if (lowerDistance / dt > 2.5) return reject('vehicle-speed');
    }
    previous = fix;
  }
  const displacement = distanceMeters(first.coords, last.coords);
  // Require displacement beyond GPS uncertainty. Stationary shaking alone
  // cannot qualify. Short loops/treadmills may not qualify either.
  if (displacement < Math.max(3, first.coords.accuracy + last.coords.accuracy)) return reject('movement-unverified');
  if (displacement / seconds > 2.5) return reject('vehicle-speed');
  if (displacement / steps < 0.2 || displacement / steps > 1.8) return reject('step-distance-mismatch');
  return { allowed: true, reason: 'walking-verified', distance: displacement };
}

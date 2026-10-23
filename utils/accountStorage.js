import DeviceStorage from "@react-native-async-storage/async-storage";

// Auth tokens stay in the original Supabase storage. Only app data uses this
// namespace. Never adopt unowned, pre-upgrade data into a signed-in account.
const PREFIX = "@legathon/account/v1/";
let active = null;
const pending = new Set();
const deleted = new Set();

export class AccountSessionEnded extends Error {
  constructor() {
    super("This account session has ended.");
    this.name = "AccountSessionEnded";
  }
}
export function isAccountSessionEnded(error) {
  return error?.name === "AccountSessionEnded";
}
export function accountPrefix(userId) {
  if (!userId) throw new Error("An account ID is required.");
  return `${PREFIX}${encodeURIComponent(userId)}/`;
}
export function closeAccountStorage() {
  if (active) active.open = false;
  active = null;
}
export function openAccountStorage(userId) {
  if (!userId || deleted.has(userId)) throw new AccountSessionEnded();
  if (active?.userId === userId && active.open) return;
  closeAccountStorage();
  active = { userId, open: true };
}
export function markAccountDeleted(userId) {
  deleted.add(userId);
  if (active?.userId === userId) closeAccountStorage();
}
export async function settleAccountWrites() {
  // Calls admitted before revocation finish in their original namespace.
  // Revocation prevents any later call from being admitted.
  await Promise.allSettled([...pending]);
}
export async function removeAccountStorage(userId) {
  await settleAccountWrites();
  const prefix = accountPrefix(userId);
  const keys = (await DeviceStorage.getAllKeys()).filter(key => key.startsWith(prefix));
  if (keys.length) await DeviceStorage.multiRemove(keys);
}

export function captureAccountSession() {
  const session = active;
  const isCurrent = () => Boolean(session?.open && active === session);
  const assertCurrent = () => {
    if (!isCurrent()) throw new AccountSessionEnded();
  };
  const run = async operation => {
    assertCurrent();
    const task = Promise.resolve().then(() => { assertCurrent(); return operation(); });
    pending.add(task);
    task.then(() => pending.delete(task), () => pending.delete(task));
    const result = await task;
    assertCurrent();
    return result;
  };
  const prefix = session ? accountPrefix(session.userId) : "";
  const keyFor = key => {
    if (typeof key !== "string") throw new TypeError("Storage keys must be strings.");
    return prefix + key;
  };
  const perform = operation => {
    assertCurrent();
    const promise = Promise.resolve().then(() => {
      assertCurrent();
      return operation();
    });
    pending.add(promise);
    promise.then(() => pending.delete(promise), () => pending.delete(promise));
    return promise.then(value => { assertCurrent(); return value; });
  };
  const storage = {
    getItem: key => perform(() => DeviceStorage.getItem(keyFor(key))),
    setItem: (key, value) => perform(() => DeviceStorage.setItem(keyFor(key), value)),
    removeItem: key => perform(() => DeviceStorage.removeItem(keyFor(key))),
    multiGet: keys => perform(async () => {
      const pairs = await DeviceStorage.multiGet(keys.map(keyFor));
      return pairs.map(([key, value]) => [key.slice(prefix.length), value]);
    }),
    multiSet: pairs => perform(() => DeviceStorage.multiSet(pairs.map(([key, value]) => [keyFor(key), value]))),
    multiRemove: keys => perform(() => DeviceStorage.multiRemove(keys.map(keyFor))),
    getAllKeys: () => perform(async () => (await DeviceStorage.getAllKeys())
      .filter(key => key.startsWith(prefix)).map(key => key.slice(prefix.length))),
  };
  return { userId: session?.userId || null, isCurrent, assertCurrent, run, storage };
}

import { captureAccountSession, isAccountSessionEnded } from "./accountStorage";


const TRANSACTION_KEY = "legacywalk_wcoin_transactions";

export async function loadWCoinTransactions() {
  const _accountSession = captureAccountSession();
  const AsyncStorage = _accountSession.storage;

  try {
    _accountSession.assertCurrent();

  const saved = await _accountSession.run(async () => (AsyncStorage.getItem(TRANSACTION_KEY)));
  return saved ? JSON.parse(saved) : [];

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}

export async function addWCoinTransaction(transaction) {
  const _accountSession2 = captureAccountSession();
  const AsyncStorage = _accountSession2.storage;

  try {
    _accountSession2.assertCurrent();

  const current = await _accountSession2.run(async () => (loadWCoinTransactions()));

  const newTransaction = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString(),
    ...transaction,
  };

  const updated = [newTransaction, ...current];

  await _accountSession2.run(async () => (AsyncStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated))));

  return updated;

  } catch (accountError) {
    if (isAccountSessionEnded(accountError)) return;
    throw accountError;
  }
}
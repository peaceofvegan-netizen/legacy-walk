import AsyncStorage from "@react-native-async-storage/async-storage";

const TRANSACTION_KEY = "legacywalk_wcoin_transactions";

export async function loadWCoinTransactions() {
  const saved = await AsyncStorage.getItem(TRANSACTION_KEY);
  return saved ? JSON.parse(saved) : [];
}

export async function addWCoinTransaction(transaction) {
  const current = await loadWCoinTransactions();

  const newTransaction = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString(),
    ...transaction,
  };

  const updated = [newTransaction, ...current];

  await AsyncStorage.setItem(TRANSACTION_KEY, JSON.stringify(updated));

  return updated;
}
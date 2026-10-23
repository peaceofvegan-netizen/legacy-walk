import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";

export default function DeleteAccountSection() {
  const { deleteAccount: deleteAuthenticatedAccount } = useAuth();
  const runningRef = useRef(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteAccount() {
    if (runningRef.current) return;
    runningRef.current = true;
    setDeleting(true);
    // AuthProvider unmounts the signed-in screens, blocks stale operations,
    // calls the server, and then clears this account's entire namespace.
    await deleteAuthenticatedAccount();
  }

  function confirmDeletion() {
    if (runningRef.current) return;

    Alert.alert(
      "Delete Your Account?",
      "This permanently deletes your Legathon Walk account and its saved app records, including walking progress, rewards, and order history. This cannot be undone.\n\nDeleting your account does not cancel an Apple or Google subscription. Manage your subscription separately in your device’s subscription settings.",
      [
        {
          text: "Keep Account",
          style: "cancel",
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: deleteAccount,
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Account
      </Text>

      <Text style={styles.description}>
        Permanently delete your Legathon Walk account.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          deleting && styles.disabled,
        ]}
        onPress={confirmDeletion}
        disabled={deleting}
        accessibilityRole="button"
        accessibilityLabel="Delete account"
        accessibilityState={{
          disabled: deleting,
          busy: deleting,
        }}
        activeOpacity={0.8}
      >
        {deleting ? (
          <ActivityIndicator color="#FF8B95" />
        ) : (
          <Text style={styles.buttonText}>
            Delete Account
          </Text>
        )}
      </TouchableOpacity>

      {deleting && (
        <Text style={styles.progress}>
          Deleting your account. Keep the app open.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#713941",
    backgroundColor: "#171420",
    padding: 22,
    marginBottom: 24,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 10,
  },

  description: {
    color: "#AAB7CC",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
  },

  button: {
    minHeight: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: "#FF6574",
    backgroundColor: "rgba(255,70,90,0.10)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  buttonText: {
    color: "#FF8B95",
    fontSize: 17,
    fontWeight: "900",
    textAlign: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  progress: {
    color: "#AAB7CC",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 14,
  },
});
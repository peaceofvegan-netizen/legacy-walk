import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useAuth } from "../contexts/AuthContext";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert("Missing Info", "Enter your email and password.");
      return;
    }

    setLoading(true);

    const result =
      mode === "signin"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password);

    setLoading(false);

    if (result.error) {
      Alert.alert("Auth Error", result.error.message);
      return;
    }

    if (mode === "signup") {
      Alert.alert(
        "Account Created",
        "Check your email if confirmation is enabled."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.small}>LEGACY WALK</Text>

      <Text style={styles.title}>
        {mode === "signin" ? "Welcome Back" : "Create Your Account"}
      </Text>

      <Text style={styles.subtitle}>
        Sign in to save your walks, journeys, XP, reflections, and passport
        progress.
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#6B7280"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#6B7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        {loading ? (
          <ActivityIndicator color="#04110A" />
        ) : (
          <Text style={styles.buttonText}>
            {mode === "signin" ? "Sign In" : "Create Account"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
      >
        <Text style={styles.switchText}>
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05070C",
    justifyContent: "center",
    padding: 24,
  },
  small: {
    color: "#A6FFD2",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "900",
    marginBottom: 14,
  },
  subtitle: {
    color: "#A8B3C2",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#10151F",
    borderWidth: 1,
    borderColor: "#1F2A3D",
    color: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
  },
  switchButton: {
    marginTop: 18,
    alignItems: "center",
  },
  switchText: {
    color: "#A6FFD2",
    fontWeight: "900",
  },
});
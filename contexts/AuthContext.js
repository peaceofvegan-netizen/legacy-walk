import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import DeviceStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";
import {
  openAccountStorage, closeAccountStorage, settleAccountWrites,
  removeAccountStorage, markAccountDeleted, captureAccountSession,
} from "../utils/accountStorage";
import { loadStepStats, resetStepRouterBaseline, STEP_STATS_KEY } from "../utils/stepTrackingEngine";
import { logoutRevenueCatUser } from "../services/revenuecat";
import { removeLegacyAccountData } from "../utils/legacyAccountCleanup";

const AuthContext = createContext(null);
const LAST_ACCOUNT = "@legathon/account-last-user-v1";
const DELETION_PENDING = "@legathon/account-deletion-pending-v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [accountError, setAccountError] = useState("");
  const currentRef = useRef(null);
  const actionRef = useRef(false);
  const deletionRef = useRef(null);
  const mountedRef = useRef(true);
  const revisionRef = useRef(0);
  const transitionQueue = useRef(Promise.resolve());

  function displayError(error) {
    closeAccountStorage();
    if (!mountedRef.current) return;
    setUser(null);
    setSession(null);
    setAccountError(error?.message || "Unable to prepare account data. Please retry.");
    setLoadingAuth(false);
  }

  async function finishLocalDeletion(id) {
    markAccountDeleted(id);
    closeAccountStorage();
    await settleAccountWrites();
    await removeAccountStorage(id);
    await removeLegacyAccountData(id);
    await logoutRevenueCatUser();
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) throw error;
    await DeviceStorage.multiRemove([DELETION_PENDING, LAST_ACCOUNT]);
    currentRef.current = null;
    deletionRef.current = null;
  }

  // Do not await Supabase calls inside onAuthStateChange. Queue setup outside
  // its callback, and keep the signed-in screens unmounted until it finishes.
  function acceptSession(nextSession) {
    if (actionRef.current || !mountedRef.current) return;
    const nextId = nextSession?.user?.id || null;
    if (nextId && nextId === currentRef.current) {
      setSession(nextSession);
      setUser(nextSession.user);
      return;
    }
    const revision = ++revisionRef.current;
    closeAccountStorage();
    currentRef.current = null;
    setLoadingAuth(true);
    setAccountError("");
    const task = transitionQueue.current.catch(() => {}).then(async () => {
      await settleAccountWrites();
      if (!mountedRef.current || revision !== revisionRef.current) return;
      const pendingId = deletionRef.current || await DeviceStorage.getItem(DELETION_PENDING);
      if (pendingId) {
        actionRef.current = true;
        try { await finishLocalDeletion(pendingId); }
        finally { actionRef.current = false; }
        if (mountedRef.current) {
          setUser(null); setSession(null); setLoadingAuth(false);
        }
        return;
      }
      if (!nextId) {
        await logoutRevenueCatUser();
        await DeviceStorage.removeItem(LAST_ACCOUNT);
      } else {
        const lastId = await DeviceStorage.getItem(LAST_ACCOUNT);
        if (!mountedRef.current || revision !== revisionRef.current) return;
        await logoutRevenueCatUser();
        if (!mountedRef.current || revision !== revisionRef.current) return;
        openAccountStorage(nextId);
        // No fallback to old shared keys: their account owner is unknown.
        await loadStepStats();
        if (!(await captureAccountSession().storage.getItem(STEP_STATS_KEY))) {
          throw new Error("Unable to initialize account storage. Please retry.");
        }
        if (lastId !== nextId) {
          const reset = await resetStepRouterBaseline();
          if (!reset?.reset) throw new Error("Unable to initialize step tracking. Please retry.");
        }
        await DeviceStorage.setItem(LAST_ACCOUNT, nextId);
      }
      if (!mountedRef.current || revision !== revisionRef.current) return;
      currentRef.current = nextId;
      setSession(nextSession || null);
      setUser(nextSession?.user || null);
      setLoadingAuth(false);
    });
    transitionQueue.current = task.catch(error => {
      if (revision === revisionRef.current) displayError(error);
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    let receivedAuthEvent = false;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      receivedAuthEvent = true;
      acceptSession(next);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mountedRef.current || receivedAuthEvent) return;
      if (error) displayError(error);
      else acceptSession(data?.session || null);
    }).catch(displayError);
    return () => {
      mountedRef.current = false;
      revisionRef.current += 1;
      closeAccountStorage();
      listener?.subscription?.unsubscribe();
    };
  }, []);

  async function retryAccountSetup() {
    if (actionRef.current) return;
    setLoadingAuth(true);
    setAccountError("");
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      acceptSession(data?.session || null);
    } catch (error) { displayError(error); }
  }

  async function signUp(email, password, fullName = "") {
    const { data, error } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  }
  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (actionRef.current) return;
    actionRef.current = true;
    ++revisionRef.current;
    closeAccountStorage();
    setLoadingAuth(true);
    try {
      await settleAccountWrites();
      await logoutRevenueCatUser();
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      await DeviceStorage.removeItem(LAST_ACCOUNT);
      currentRef.current = null;
      setUser(null); setSession(null); setLoadingAuth(false);
    } catch (error) {
      currentRef.current = null;
      displayError(error);
      throw error;
    } finally { actionRef.current = false; }
  }

  async function deleteAccount() {
    if (actionRef.current) return;
    actionRef.current = true;
    ++revisionRef.current;
    const id = user?.id;
    const token = session?.access_token;
    let deleted = false;
    closeAccountStorage();
    setLoadingAuth(true);
    try {
      if (!id || !token) throw new Error("Please sign in before deleting your account.");
      await settleAccountWrites();
      const { data, error } = await supabase.functions.invoke("delete-account", {
        headers: { Authorization: `Bearer ${token}` },
        body: { confirmation: "DELETE" },
      });
      if (error) {
        let message = "Account deletion could not finish. Please retry or contact support.";
        try { message = (await error.context?.json())?.message || message; } catch {}
        throw new Error(message);
      }
      if (data?.success !== true) throw new Error(data?.message || "Account deletion could not finish.");
      deleted = true;
      deletionRef.current = id;
      markAccountDeleted(id);
      // Persist recovery intent before cleanup: reopening the app resumes it.
      await DeviceStorage.setItem(DELETION_PENDING, id);
      await finishLocalDeletion(id);
      setUser(null); setSession(null); setLoadingAuth(false);
      Alert.alert("Account Deleted", "Your Legathon Walk account has been deleted.");
    } catch (error) {
      currentRef.current = null;
      if (deleted) {
        displayError(new Error("Your account was deleted. Device cleanup needs to finish before another account can open. Tap Retry."));
      } else {
        actionRef.current = false;
        acceptSession(session);
        Alert.alert("Unable to Delete Account", error?.message || "Please try again.");
      }
    } finally { actionRef.current = false; }
  }

  return <AuthContext.Provider value={{ user, session, loadingAuth, accountError,
    retryAccountSetup, signUp, signIn, signOut, deleteAccount }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

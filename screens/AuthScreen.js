import React, { useMemo, useState } from "react";

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

// ============================================================
// TRANSLATIONS
// ============================================================

const TEXT = {
  en: {
    brand: "LEGATHON WALK",

    welcomeBack: "Welcome Back",
    createAccountTitle: "Create Your Account",

    subtitle:
      "Sign in to save your walks, journeys, XP, reflections, and passport progress.",

    signupSubtitle:
      "Create your Legathon Walk account to save your walks, journeys, XP, reflections, and passport progress.",

    email: "Email",
    password: "Password",

    signIn: "Sign In",
    createAccount: "Create Account",

    needAccount: "Need an account? Sign up",
    alreadyAccount: "Already have an account? Sign in",

    missingInfo: "Missing Info",
    enterCredentials: "Enter your email and password.",

    authError: "Authentication Error",

    accountCreated: "Account Created",
    checkEmail:
      "Check your email if confirmation is enabled.",
  },

  es: {
    brand: "LEGATHON WALK",

    welcomeBack: "Bienvenido de nuevo",
    createAccountTitle: "Crea tu cuenta",

    subtitle:
      "Inicia sesión para guardar tus caminatas, recorridos, XP, reflexiones y progreso del pasaporte.",

    signupSubtitle:
      "Crea tu cuenta de Legathon Walk para guardar tus caminatas, recorridos, XP, reflexiones y progreso del pasaporte.",

    email: "Correo electrónico",
    password: "Contraseña",

    signIn: "Iniciar sesión",
    createAccount: "Crear cuenta",

    needAccount: "¿Necesitas una cuenta? Regístrate",
    alreadyAccount: "¿Ya tienes una cuenta? Inicia sesión",

    missingInfo: "Falta información",
    enterCredentials:
      "Ingresa tu correo electrónico y contraseña.",

    authError: "Error de autenticación",

    accountCreated: "Cuenta creada",
    checkEmail:
      "Revisa tu correo electrónico si la confirmación está habilitada.",
  },

  fr: {
    brand: "LEGATHON WALK",

    welcomeBack: "Bon retour",
    createAccountTitle: "Créez votre compte",

    subtitle:
      "Connectez-vous pour enregistrer vos marches, parcours, XP, réflexions et progression du passeport.",

    signupSubtitle:
      "Créez votre compte Legathon Walk pour enregistrer vos marches, parcours, XP, réflexions et progression du passeport.",

    email: "E-mail",
    password: "Mot de passe",

    signIn: "Se connecter",
    createAccount: "Créer un compte",

    needAccount: "Besoin d'un compte ? Inscrivez-vous",
    alreadyAccount:
      "Vous avez déjà un compte ? Connectez-vous",

    missingInfo: "Informations manquantes",
    enterCredentials:
      "Saisissez votre e-mail et votre mot de passe.",

    authError: "Erreur d'authentification",

    accountCreated: "Compte créé",
    checkEmail:
      "Consultez votre e-mail si la confirmation est activée.",
  },

  de: {
    brand: "LEGATHON WALK",

    welcomeBack: "Willkommen zurück",
    createAccountTitle: "Konto erstellen",

    subtitle:
      "Melde dich an, um deine Spaziergänge, Journeys, XP, Reflexionen und deinen Passport-Fortschritt zu speichern.",

    signupSubtitle:
      "Erstelle dein Legathon-Walk-Konto, um deine Spaziergänge, Journeys, XP, Reflexionen und deinen Passport-Fortschritt zu speichern.",

    email: "E-Mail",
    password: "Passwort",

    signIn: "Anmelden",
    createAccount: "Konto erstellen",

    needAccount: "Noch kein Konto? Registrieren",
    alreadyAccount:
      "Bereits ein Konto? Anmelden",

    missingInfo: "Angaben fehlen",
    enterCredentials:
      "Gib deine E-Mail-Adresse und dein Passwort ein.",

    authError: "Authentifizierungsfehler",

    accountCreated: "Konto erstellt",
    checkEmail:
      "Überprüfe deine E-Mail, falls die Bestätigung aktiviert ist.",
  },

  pt: {
    brand: "LEGATHON WALK",

    welcomeBack: "Bem-vindo de volta",
    createAccountTitle: "Crie sua conta",

    subtitle:
      "Entre para salvar suas caminhadas, jornadas, XP, reflexões e progresso do passaporte.",

    signupSubtitle:
      "Crie sua conta Legathon Walk para salvar suas caminhadas, jornadas, XP, reflexões e progresso do passaporte.",

    email: "E-mail",
    password: "Senha",

    signIn: "Entrar",
    createAccount: "Criar conta",

    needAccount: "Precisa de uma conta? Cadastre-se",
    alreadyAccount:
      "Já tem uma conta? Entre",

    missingInfo: "Informações ausentes",
    enterCredentials:
      "Digite seu e-mail e sua senha.",

    authError: "Erro de autenticação",

    accountCreated: "Conta criada",
    checkEmail:
      "Verifique seu e-mail se a confirmação estiver ativada.",
  },

  ja: {
    brand: "LEGATHON WALK",

    welcomeBack: "おかえりなさい",
    createAccountTitle: "アカウントを作成",

    subtitle:
      "サインインして、歩行記録、Journey、XP、振り返り、パスポートの進捗を保存しましょう。",

    signupSubtitle:
      "Legathon Walkアカウントを作成して、歩行記録、Journey、XP、振り返り、パスポートの進捗を保存しましょう。",

    email: "メールアドレス",
    password: "パスワード",

    signIn: "サインイン",
    createAccount: "アカウントを作成",

    needAccount:
      "アカウントをお持ちでないですか？ 登録",
    alreadyAccount:
      "すでにアカウントをお持ちですか？ サインイン",

    missingInfo: "入力情報が不足しています",
    enterCredentials:
      "メールアドレスとパスワードを入力してください。",

    authError: "認証エラー",

    accountCreated: "アカウントを作成しました",
    checkEmail:
      "メール確認が有効な場合は、メールを確認してください。",
  },

  ko: {
    brand: "LEGATHON WALK",

    welcomeBack: "다시 오신 것을 환영합니다",
    createAccountTitle: "계정 만들기",

    subtitle:
      "로그인하여 걷기 기록, Journey, XP, 기록 및 패스포트 진행 상황을 저장하세요.",

    signupSubtitle:
      "Legathon Walk 계정을 만들어 걷기 기록, Journey, XP, 기록 및 패스포트 진행 상황을 저장하세요.",

    email: "이메일",
    password: "비밀번호",

    signIn: "로그인",
    createAccount: "계정 만들기",

    needAccount: "계정이 없으신가요? 가입하기",
    alreadyAccount:
      "이미 계정이 있으신가요? 로그인",

    missingInfo: "정보가 필요합니다",
    enterCredentials:
      "이메일과 비밀번호를 입력하세요.",

    authError: "인증 오류",

    accountCreated: "계정이 생성되었습니다",
    checkEmail:
      "이메일 확인 기능이 활성화되어 있다면 이메일을 확인하세요.",
  },

  zh: {
    brand: "LEGATHON WALK",

    welcomeBack: "欢迎回来",
    createAccountTitle: "创建账户",

    subtitle:
      "登录以保存你的步行记录、Journey、XP、心得和护照进度。",

    signupSubtitle:
      "创建 Legathon Walk 账户，以保存你的步行记录、Journey、XP、心得和护照进度。",

    email: "电子邮箱",
    password: "密码",

    signIn: "登录",
    createAccount: "创建账户",

    needAccount: "还没有账户？注册",
    alreadyAccount: "已有账户？登录",

    missingInfo: "信息不完整",
    enterCredentials:
      "请输入你的电子邮箱和密码。",

    authError: "身份验证错误",

    accountCreated: "账户已创建",
    checkEmail:
      "如果启用了电子邮件确认，请检查你的邮箱。",
  },

  it: {
    brand: "LEGATHON WALK",

    welcomeBack: "Bentornato",
    createAccountTitle: "Crea il tuo account",

    subtitle:
      "Accedi per salvare le tue camminate, Journey, XP, riflessioni e progressi del passaporto.",

    signupSubtitle:
      "Crea il tuo account Legathon Walk per salvare camminate, Journey, XP, riflessioni e progressi del passaporto.",

    email: "E-mail",
    password: "Password",

    signIn: "Accedi",
    createAccount: "Crea account",

    needAccount: "Non hai un account? Registrati",
    alreadyAccount:
      "Hai già un account? Accedi",

    missingInfo: "Informazioni mancanti",
    enterCredentials:
      "Inserisci la tua e-mail e la password.",

    authError: "Errore di autenticazione",

    accountCreated: "Account creato",
    checkEmail:
      "Controlla la tua e-mail se la conferma è attivata.",
  },

  ar: {
    brand: "LEGATHON WALK",

    welcomeBack: "مرحبًا بعودتك",
    createAccountTitle: "إنشاء حسابك",

    subtitle:
      "سجّل الدخول لحفظ المشي والرحلات ونقاط XP والتأملات وتقدم جواز السفر.",

    signupSubtitle:
      "أنشئ حساب Legathon Walk لحفظ المشي والرحلات ونقاط XP والتأملات وتقدم جواز السفر.",

    email: "البريد الإلكتروني",
    password: "كلمة المرور",

    signIn: "تسجيل الدخول",
    createAccount: "إنشاء حساب",

    needAccount: "ليس لديك حساب؟ سجّل الآن",
    alreadyAccount:
      "لديك حساب بالفعل؟ سجّل الدخول",

    missingInfo: "معلومات ناقصة",
    enterCredentials:
      "أدخل بريدك الإلكتروني وكلمة المرور.",

    authError: "خطأ في تسجيل الدخول",

    accountCreated: "تم إنشاء الحساب",
    checkEmail:
      "تحقق من بريدك الإلكتروني إذا كان تأكيد البريد مفعّلًا.",
  },
};

// ============================================================
// HELPERS
// ============================================================

function normalizeLanguage(language) {
  const code = String(language || "en")
    .trim()
    .toLowerCase()
    .split("-")[0];

  return TEXT[code] ? code : "en";
}

// ============================================================
// AUTH SCREEN
// ============================================================

export default function AuthScreen({
  language = "en",
}) {
  const { signIn, signUp } = useAuth();

  const languageCode = normalizeLanguage(language);
  const isRTL = languageCode === "ar";

  const t = useMemo(() => {
    return (key) =>
      TEXT[languageCode]?.[key] ??
      TEXT.en?.[key] ??
      key;
  }, [languageCode]);

  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  async function handleAuth() {
    if (!email.trim() || !password) {
      Alert.alert(
        t("missingInfo"),
        t("enterCredentials")
      );

      return;
    }

    try {
      setLoading(true);

      const result =
        mode === "signin"
          ? await signIn(
              email.trim(),
              password
            )
          : await signUp(
              email.trim(),
              password
            );

      if (result?.error) {
        Alert.alert(
          t("authError"),
          result.error.message
        );

        return;
      }

      if (mode === "signup") {
        Alert.alert(
          t("accountCreated"),
          t("checkEmail")
        );
      }
    } catch (error) {
      Alert.alert(
        t("authError"),
        error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.small,
          isRTL && styles.rtlText,
        ]}
      >
        {t("brand")}
      </Text>

      <Text
        style={[
          styles.title,
          isRTL && styles.rtlText,
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {mode === "signin"
          ? t("welcomeBack")
          : t("createAccountTitle")}
      </Text>

      <Text
        style={[
          styles.subtitle,
          isRTL && styles.rtlText,
        ]}
      >
        {mode === "signin"
          ? t("subtitle")
          : t("signupSubtitle")}
      </Text>

      {/* EMAIL */}

      <TextInput
        placeholder={t("email")}
        placeholderTextColor="#6B7280"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        returnKeyType="next"
        style={[
          styles.input,
          isRTL && styles.rtlInput,
        ]}
      />

      {/* PASSWORD */}

      <TextInput
        placeholder={t("password")}
        placeholderTextColor="#6B7280"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        textContentType={
          mode === "signin"
            ? "password"
            : "newPassword"
        }
        autoComplete={
          mode === "signin"
            ? "password"
            : "new-password"
        }
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        returnKeyType="done"
        onSubmitEditing={handleAuth}
        style={[
          styles.input,
          isRTL && styles.rtlInput,
        ]}
      />

      {/* MAIN BUTTON */}

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleAuth}
        disabled={loading}
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator
            color="#04110A"
          />
        ) : (
          <Text
            style={styles.buttonText}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {mode === "signin"
              ? t("signIn")
              : t("createAccount")}
          </Text>
        )}
      </TouchableOpacity>

      {/* SWITCH SIGN IN / SIGN UP */}

      <TouchableOpacity
        style={styles.switchButton}
        disabled={loading}
        accessibilityRole="button"
        onPress={() => {
          setMode((currentMode) =>
            currentMode === "signin"
              ? "signup"
              : "signin"
          );
        }}
      >
        <Text
          style={[
            styles.switchText,
            isRTL && styles.rtlText,
          ]}
          numberOfLines={2}
          adjustsFontSizeToFit
        >
          {mode === "signin"
            ? t("needAccount")
            : t("alreadyAccount")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

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
    letterSpacing: 2,
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 14,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#A6FFD2",
    borderRadius: 18,
    minHeight: 54,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#04110A",
    fontWeight: "900",
    fontSize: 16,
    textAlign: "center",
  },

  switchButton: {
    marginTop: 18,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  switchText: {
    color: "#A6FFD2",
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },

  rtlInput: {
    writingDirection: "rtl",
    textAlign: "right",
  },
});
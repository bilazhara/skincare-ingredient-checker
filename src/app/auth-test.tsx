import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type AuthMode = "login" | "register";

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FeedbackState {
  type: "success" | "error" | "info";
  message: string;
}

export default function AuthTest() {
  const router = useRouter();
  const { user, session, isLoading: isAuthLoading } = useAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  // Helper validasi input
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const trimmedEmail = email.trim();

    // 1. Validasi Email
    if (!trimmedEmail) {
      newErrors.email = "Email wajib diisi.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = "Format email tidak valid (contoh: nama@domain.com).";
      }
    }

    // 2. Validasi Password
    if (!password) {
      newErrors.password = "Kata sandi wajib diisi.";
    } else if (password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter.";
    }

    // 3. Validasi Konfirmasi Password (hanya saat Register)
    if (mode === "register") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi kata sandi tidak cocok.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Bersihkan error per field saat user mengetik
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({});
    setFeedback(null);
    setPassword("");
    setConfirmPassword("");
  };

  // 1. Fitur Register
  const handleRegister = async () => {
    if (!validateForm()) {
      setFeedback({
        type: "error",
        message: "Silakan perbaiki kesalahan input pada formulir.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("already registered")) {
          msg = "Email ini sudah terdaftar. Silakan login atau gunakan email lain.";
        }
        setFeedback({ type: "error", message: `❌ Registrasi gagal: ${msg}` });
        return;
      }

      if (data.session) {
        setFeedback({
          type: "success",
          message: "✅ Pendaftaran berhasil! Akun langsung aktif dan berhasil login.",
        });
        setPassword("");
        setConfirmPassword("");
      } else {
        setFeedback({
          type: "info",
          message:
            "✅ Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi atau coba login.",
        });
        switchMode("login");
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";
      setFeedback({ type: "error", message: `❌ Error: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  // 2. Fitur Login
  const handleLogin = async () => {
    if (!validateForm()) {
      setFeedback({
        type: "error",
        message: "Silakan perbaiki kesalahan input pada formulir.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        let msg = error.message;
        if (msg.includes("Invalid login credentials")) {
          msg = "Email atau kata sandi salah. Silakan periksa kembali data Anda.";
        } else if (msg.includes("Email not confirmed")) {
          msg = "Email belum dikonfirmasi. Periksa kotak masuk email Anda.";
        }
        setFeedback({ type: "error", message: `❌ Login gagal: ${msg}` });
        return;
      }

      setFeedback({
        type: "success",
        message: `✅ Login berhasil! Selamat datang, ${data.user.email ?? "Pengguna"}.`,
      });
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";
      setFeedback({ type: "error", message: `❌ Error: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  // 3. Fitur Logout
  const handleLogout = async () => {
    setLoading(true);
    setFeedback(null);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setFeedback({ type: "error", message: `❌ Logout gagal: ${error.message}` });
        return;
      }
      setFeedback({
        type: "success",
        message: "✅ Anda telah berhasil logout dari aplikasi.",
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak terduga.";
      setFeedback({ type: "error", message: `❌ Error: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← KEMBALI KE BERANDA</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Modul 4: Fitur Authentication</Text>
          <Text style={styles.subtitle}>
            Register, Login, Logout, Validasi Input, dan Loading State dengan Supabase
          </Text>

          {/* Status Session & AuthContext */}
          <View style={styles.statusBox}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>STATUS AUTENTIKASI</Text>
              <View
                style={[
                  styles.badge,
                  user ? styles.badgeActive : styles.badgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    user ? styles.badgeTextActive : styles.badgeTextInactive,
                  ]}
                >
                  {isAuthLoading
                    ? "MEMERIKSA..."
                    : user
                    ? "AKTIF (LOGGED IN)"
                    : "BELUM MASUK"}
                </Text>
              </View>
            </View>

            <Text style={styles.statusText}>
              <Text style={styles.bold}>User: </Text>
              {user?.email ?? "(belum ada sesi aktif)"}
            </Text>
            {user?.id ? (
              <Text style={styles.statusSubText}>
                <Text style={styles.bold}>UID: </Text>
                {user.id}
              </Text>
            ) : null}
            <Text style={styles.statusSubText}>
              <Text style={styles.bold}>Penyimpanan Token: </Text>
              {session ? "SecureStore (Tersimpan)" : "Kosong"}
            </Text>
          </View>

          {/* Feedback Message */}
          {feedback && (
            <View
              style={[
                styles.feedbackBox,
                feedback.type === "success" && styles.feedbackSuccess,
                feedback.type === "error" && styles.feedbackError,
                feedback.type === "info" && styles.feedbackInfo,
              ]}
            >
              <Text
                style={[
                  styles.feedbackText,
                  feedback.type === "success" && styles.feedbackTextSuccess,
                  feedback.type === "error" && styles.feedbackTextError,
                  feedback.type === "info" && styles.feedbackTextInfo,
                ]}
              >
                {feedback.message}
              </Text>
            </View>
          )}

          {/* Jika User Sudah Login */}
          {user ? (
            <View style={styles.loggedInSection}>
              <View style={styles.userInfoCard}>
                <Text style={styles.welcomeText}>
                  Selamat datang, <Text style={styles.bold}>{user.email}</Text>!
                </Text>
                <Text style={styles.userInfoDetail}>
                  Sesi login Anda tersimpan secara aman di perangkat via SecureStore.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.button, styles.logoutButton]}
                onPress={handleLogout}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#D32F2F" />
                    <Text style={styles.logoutButtonText}>Sedang Keluar...</Text>
                  </View>
                ) : (
                  <Text style={styles.logoutButtonText}>[ LOGOUT / KELUAR ]</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            /* Jika User Belum Login -> Formulir Auth */
            <View style={styles.formSection}>
              {/* Tab Switcher: Login vs Register */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    mode === "login" && styles.tabButtonActive,
                  ]}
                  onPress={() => switchMode("login")}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.tabText,
                      mode === "login" && styles.tabTextActive,
                    ]}
                  >
                    MASUK (LOGIN)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    mode === "register" && styles.tabButtonActive,
                  ]}
                  onPress={() => switchMode("register")}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.tabText,
                      mode === "register" && styles.tabTextActive,
                    ]}
                  >
                    DAFTAR (REGISTER)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Field Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Email <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.email ? styles.inputError : null,
                  ]}
                  placeholder="contoh: user@gmail.com"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>⚠️ {errors.email}</Text>
                ) : null}
              </View>

              {/* Field Password */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.inputLabel}>
                    Kata Sandi <Text style={styles.required}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <Text style={styles.toggleText}>
                      {showPassword ? "Sembunyikan" : "Tampilkan"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    errors.password ? styles.inputError : null,
                  ]}
                  placeholder="Minimal 6 karakter"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={handlePasswordChange}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                {errors.password ? (
                  <Text style={styles.errorText}>⚠️ {errors.password}</Text>
                ) : null}
              </View>

              {/* Field Confirm Password (Hanya saat Register) */}
              {mode === "register" && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>
                      Konfirmasi Kata Sandi <Text style={styles.required}>*</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      <Text style={styles.toggleText}>
                        {showConfirmPassword ? "Sembunyikan" : "Tampilkan"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword ? styles.inputError : null,
                    ]}
                    placeholder="Ulangi kata sandi Anda"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                  {errors.confirmPassword ? (
                    <Text style={styles.errorText}>
                      ⚠️ {errors.confirmPassword}
                    </Text>
                  ) : null}
                </View>
              )}

              {/* Submit Button dengan Loading Indicator */}
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  loading && styles.buttonDisabled,
                ]}
                onPress={mode === "login" ? handleLogin : handleRegister}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>
                      {mode === "login"
                        ? "Sedang Masuk..."
                        : "Sedang Mendaftar..."}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>
                    {mode === "login" ? "[ MASUK ]" : "[ DAFTAR AKUN BARU ]"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F4F8F4",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  backButtonText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    padding: 24,
    borderWidth: 2,
    borderColor: "#2E7D32",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 13,
    color: "#4A7C59",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  statusBox: {
    padding: 14,
    backgroundColor: "#F1F8E9",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTitle: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontWeight: "bold",
    fontSize: 13,
    color: "#2E7D32",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeActive: {
    backgroundColor: "#C8E6C9",
  },
  badgeInactive: {
    backgroundColor: "#EEEEEE",
  },
  badgeText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 11,
    fontWeight: "bold",
  },
  badgeTextActive: {
    color: "#1B5E20",
  },
  badgeTextInactive: {
    color: "#757575",
  },
  statusText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 13,
    color: "#333333",
    marginTop: 4,
  },
  statusSubText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
    color: "#555555",
    marginTop: 2,
  },
  bold: {
    fontWeight: "bold",
    color: "#1B5E20",
  },
  feedbackBox: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: "#E8F5E9",
    borderColor: "#81C784",
  },
  feedbackError: {
    backgroundColor: "#FFEBEE",
    borderColor: "#E57373",
  },
  feedbackInfo: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFE082",
  },
  feedbackText: {
    fontSize: 13,
    lineHeight: 18,
  },
  feedbackTextSuccess: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  feedbackTextError: {
    color: "#C62828",
    fontWeight: "bold",
  },
  feedbackTextInfo: {
    color: "#F57F17",
    fontWeight: "bold",
  },
  loggedInSection: {
    marginTop: 10,
    gap: 16,
  },
  userInfoCard: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 6,
    padding: 16,
  },
  welcomeText: {
    fontSize: 15,
    color: "#333333",
    marginBottom: 6,
  },
  userInfoDetail: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },
  formSection: {
    gap: 14,
  },
  tabContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F4F8F4",
  },
  tabButtonActive: {
    backgroundColor: "#2E7D32",
  },
  tabText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 12,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  inputGroup: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 13,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  required: {
    color: "#D32F2F",
  },
  toggleText: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#2E7D32",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 14,
    color: "#333333",
    backgroundColor: "#FAFAFA",
  },
  inputError: {
    borderColor: "#D32F2F",
    backgroundColor: "#FFF8F8",
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginTop: 2,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#2E7D32",
    marginTop: 6,
  },
  submitButtonText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1.5,
    borderColor: "#D32F2F",
  },
  logoutButtonText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#D32F2F",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

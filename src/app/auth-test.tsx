import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function AuthTest() {
  const { user, session, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("Belum ada aksi");

  const run = async (action: () => Promise<string>) => {
    if (busy) return;
    setBusy(true);
    try {
      setStatus(await action());
    } catch (e) {
      setStatus("❌ " + String(e));
    } finally {
      setBusy(false);
    }
  };

  const signUp = () =>
    run(async () => {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) return "❌ " + error.message;
      if (!data.session) return "⚠️ Akun dibuat, perlu konfirmasi email.";
      return "✅ Daftar berhasil";
    });

  const signIn = () =>
    run(async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return error ? "❌ " + error.message : "✅ Login berhasil";
    });

  const signOut = () =>
    run(async () => {
      const { error } = await supabase.auth.signOut();
      return error ? "❌ " + error.message : "✅ Logout berhasil";
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>AuthContext Test</Text>

        <View style={styles.box}>
          <Text style={styles.bold}>AuthContext Status</Text>
          <Text style={styles.line}>isLoading: {String(isLoading)}</Text>
          <Text style={styles.line}>
            User: {user?.email ?? "(belum login)"}
          </Text>
          <Text style={styles.line}>
            Session: {session ? "aktif" : "tidak ada"}
          </Text>
        </View>

        <View style={styles.box}>
          <Text style={styles.bold}>{status}</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        {busy && <ActivityIndicator color="#2E7D32" />}

        <TouchableOpacity
          style={styles.button}
          onPress={signUp}
          disabled={busy}
        >
          <Text style={styles.buttonText}>[ SIGN UP ]</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={signIn}
          disabled={busy}
        >
          <Text style={styles.buttonText}>[ LOGIN ]</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={signOut}
          disabled={busy}
        >
          <Text style={styles.buttonText}>[ LOGOUT ]</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8F4",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },
  box: {
    marginTop: 16,
    padding: 15,
    backgroundColor: "#F1F8E9",
    borderRadius: 5,
  },
  bold: { color: "#2E7D32", fontWeight: "bold" },
  line: { marginTop: 8, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 4,
    padding: 12,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "bold",
  },
});

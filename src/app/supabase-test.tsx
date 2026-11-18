
import { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

const TOKEN_KEY = "skincare_test_token";
const TEST_TOKEN = "SKINCARE_TEST_123";

export default function SupabaseTest() {
  const [status, setStatus] = useState(
    "Belum dilakukan pengujian"
  );

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  // Testing koneksi Supabase
  const testConnection = async () => {
    setLoading(true);

    try {
      const url =
        process.env.EXPO_PUBLIC_SUPABASE_URL;

      const key =
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${url}/auth/v1/settings`,
        {
          headers: {
            apikey: key!,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const { error } =
        await supabase.auth.getSession();

      if (error) throw error;

      setStatus(
        "✅ Berhasil terhubung ke Supabase!"
      );
    } catch (error) {
      setStatus("❌ " + String(error));
    } finally {
      setLoading(false);
    }
  };

  // Menjalankan operasi SecureStore
  const runSecureStore = async (
    action: () => Promise<void>
  ) => {
    if (Platform.OS === "web") {
      setStatus(
        "⚠️ SecureStore harus diuji di Android/iOS."
      );
      return;
    }

    try {
      await action();
    } catch (error) {
      setStatus("❌ " + String(error));
    }
  };

  // Menyimpan token
  const saveToken = () =>
    runSecureStore(async () => {
      await SecureStore.setItemAsync(
        TOKEN_KEY,
        TEST_TOKEN
      );

      setStatus("✅ Token berhasil disimpan");
    });

  // Mengambil token
  const loadToken = () =>
    runSecureStore(async () => {
      const savedToken =
        await SecureStore.getItemAsync(TOKEN_KEY);

      setToken(savedToken ?? "");

      setStatus(
        savedToken
          ? "✅ Token berhasil diambil"
          : "⚠️ Tidak ada token tersimpan"
      );
    });

  // Menghapus token
  const deleteToken = () =>
    runSecureStore(async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken("");
      setStatus("✅ Token berhasil dihapus");
    });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Supabase & SecureStore Test
        </Text>

        <Text style={styles.subtitle}>
          Skincare Ingredient Checker
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={testConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "CONNECTING..."
              : "[ TEST CONNECTION ]"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={saveToken}
        >
          <Text style={styles.buttonText}>
            [ SAVE TOKEN ]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={loadToken}
        >
          <Text style={styles.buttonText}>
            [ LOAD TOKEN ]
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={deleteToken}
        >
          <Text style={styles.buttonText}>
            [ DELETE TOKEN ]
          </Text>
        </TouchableOpacity>

        <View style={styles.result}>
          <Text style={styles.status}>{status}</Text>

          <Text style={styles.token}>
            Token: {token || "(kosong)"}
          </Text>
        </View>
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
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    color: "#777",
    marginVertical: 12,
  },
  button: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 4,
    padding: 12,
    marginVertical: 6,
  },
  buttonText: {
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "bold",
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#F1F8E9",
    borderRadius: 5,
  },
  status: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  token: {
    marginTop: 10,
    color: "#333",
  },
});

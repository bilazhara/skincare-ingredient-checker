import { useRouter } from "expo-router";
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

import {
  searchIngredientsWithPromise,
  validateIngredientKeyword,
} from "../services/ingredientApi";
import type { Ingredient } from "../types/ingredient";

export default function ApiTest() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("niacinamide");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handler uji Promise berhasil (.then & resolve)
  const handleTestSuccess = () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setIngredients([]);

    // Menerapkan fungsi .then(), .resolve(), dan .reject()
    validateIngredientKeyword(keyword)
      .then((validKeyword) => {
        // searchIngredientsWithPromise mengembalikan Promise dengan resolve/reject
        return searchIngredientsWithPromise(validKeyword);
      })
      .then((result) => {
        setIngredients(result);
        setSuccessMessage(`Berhasil mengambil ${result.length} ingredients!`);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan saat memproses data."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handler uji Promise gagal (.catch & reject)
  const handleTestReject = () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    setIngredients([]);

    // Sengaja memicu reject() dengan mengirim keyword kosong
    validateIngredientKeyword("")
      .then((validKeyword) => {
        return searchIngredientsWithPromise(validKeyword);
      })
      .then((result) => {
        setIngredients(result);
      })
      .catch((err: unknown) => {
        // Ditangkap oleh .catch() dari pemanggilan reject()
        const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(`[Simulasi Reject Berhasil Ditangkap oleh .catch()]: ${errMsg}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← KEMBALI</Text>
      </TouchableOpacity>

      <Text style={styles.title}>External API & Promise Test</Text>
      <Text style={styles.subtitle}>
        Pengujian fungsi .then(), .resolve(), dan .reject()
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Keyword Pencarian:</Text>
        <TextInput
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Contoh: niacinamide"
          placeholderTextColor="#888"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleTestSuccess}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test (.then & resolve)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonReject]}
          onPress={handleTestReject}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test (.catch & reject)</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#284F3B" />
          <Text style={styles.loadingText}>Memproses Promise...</Text>
        </View>
      )}

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {!!successMessage && (
        <View style={styles.successBox}>
          <Text style={styles.success}>{successMessage}</Text>
        </View>
      )}

      {ingredients.map((item, index) => (
        <View key={item.id ? `${item.id}-${index}` : index.toString()} style={styles.card}>
          <Text style={styles.name}>{item.inci_name}</Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Function: </Text>
            {Array.isArray(item.functions) && item.functions.length > 0
              ? item.functions.join(", ")
              : (item.function ?? "Tidak tersedia")}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>CAS: </Text>
            {item.cas_number ?? "Tidak tersedia"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Description: </Text>
            {item.description ?? "Tidak tersedia"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
    gap: 12,
    backgroundColor: "#F5F8F5",
    flexGrow: 1,
  },
  backButton: {
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#284F3B",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  inputContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#284F3B",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#90C695",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#284F3B",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#2E7D32",
  },
  buttonReject: {
    backgroundColor: "#C62828",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  loadingContainer: {
    paddingVertical: 14,
    alignItems: "center",
    gap: 6,
  },
  loadingText: {
    color: "#284F3B",
    fontSize: 13,
  },
  errorBox: {
    backgroundColor: "#FFEBEE",
    borderLeftWidth: 4,
    borderLeftColor: "#C62828",
    padding: 12,
    borderRadius: 6,
  },
  error: {
    color: "#C62828",
    fontSize: 13,
    fontWeight: "500",
  },
  successBox: {
    backgroundColor: "#E8F5E9",
    borderLeftWidth: 4,
    borderLeftColor: "#2E7D32",
    padding: 12,
    borderRadius: 6,
  },
  success: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 13,
  },
  card: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C8DFC8",
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#284F3B",
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: "bold",
    color: "#438A5E",
  },
  detailText: {
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
  },
});

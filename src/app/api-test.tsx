
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { searchIngredients } from "../services/ingredientApi";
import type { Ingredient } from "../types/ingredient";

export default function ApiTest() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTest = async () => {
    setLoading(true);
    setError("");
    setIngredients([]);

    try {
      const result = await searchIngredients("niacinamide");
      setIngredients(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>External API Test</Text>
      <Text style={styles.subtitle}>
        CosIng Checker - Niacinamide
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleTest}>
        <Text style={styles.buttonText}>Test API</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#628C75" />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && ingredients.length > 0 && (
        <Text style={styles.success}>
          Berhasil mengambil {ingredients.length} ingredients!
        </Text>
      )}

      {ingredients.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.name}>{item.inci_name}</Text>
          <Text>Function: {item.function ?? "Tidak tersedia"}</Text>
          <Text>CAS: {item.cas_number ?? "Tidak tersedia"}</Text>
          <Text>
            Description: {item.description ?? "Tidak tersedia"}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    gap: 12,
    backgroundColor: "#F5F8F5",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#284F3B",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    backgroundColor: "#628C75",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  success: {
    color: "green",
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    gap: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#284F3B",
  },
});

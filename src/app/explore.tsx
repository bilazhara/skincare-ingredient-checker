import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getLocalIngredients } from "../data";
import styles from "../styles";
import type { Ingredient } from "../types";

export default function Explore() {
  const router = useRouter();
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadData = () => {
    setLoading(true);
    setError("");

    // Menerapkan fungsi .then(), .resolve(), dan .reject()
    getLocalIngredients()
      .then((data) => {
        setIngredientList(data);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat daftar bahan."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Daftar Bahan</Text>

        {loading && (
          <View style={{ paddingVertical: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={[styles.selectedText, { marginTop: 8 }]}>
              Memuat data bahan...
            </Text>
          </View>
        )}

        {!!error && (
          <View style={{ paddingVertical: 12 }}>
            <Text style={{ color: "#D32F2F", marginBottom: 8 }}>{error}</Text>
            <TouchableOpacity
              style={[styles.checkButton, { paddingVertical: 8 }]}
              onPress={loadData}
            >
              <Text style={styles.checkButtonText}>[ COBA LAGI ]</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading &&
          !error &&
          ingredientList.map((item) => (
            <View key={item.id} style={{ marginBottom: 12 }}>
              <Text style={styles.boldText}>{item.name}</Text>
              <Text style={styles.selectedText}>{item.function}</Text>
              {item.note ? (
                <Text style={styles.selectedText}>⚠️ {item.note}</Text>
              ) : null}
            </View>
          ))}

        {/* Menerapkan fungsi router.back() */}
        <TouchableOpacity
          style={[styles.checkButton, { marginTop: 16 }]}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.checkButtonText}>[ KEMBALI ]</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

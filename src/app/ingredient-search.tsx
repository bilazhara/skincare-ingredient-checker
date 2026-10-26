
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { searchIngredients } from "../services/ingredientApi";
import type { Ingredient } from "../types/ingredient";

export default function IngredientSearch() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const keyword = search.trim();

    if (!keyword) {
      setError("Masukkan nama ingredient terlebih dahulu.");
      setIngredients([]);
      return;
    }

    setLoading(true);
    setError("");
    setIngredients([]);
    setHasSearched(true);

    try {
      const data = await searchIngredients(keyword);
      setIngredients(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data dari API."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderIngredient = ({ item }: { item: Ingredient }) => (
    <View style={styles.card}>
      <Text style={styles.ingredientName}>
        {item.inci_name}
      </Text>

      <Text style={styles.label}>Function:</Text>
      <Text style={styles.value}>
        {item.functions.length > 0
          ? item.functions.join(", ")
          : item.function ?? "Tidak tersedia"}
      </Text>

      <Text style={styles.label}>CAS Number:</Text>
      <Text style={styles.value}>
        {item.cas_number ?? "Tidak tersedia"}
      </Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>
        {item.description ?? "Tidak tersedia"}
      </Text>

      <Text style={styles.label}>Restriction:</Text>
      <Text style={styles.value}>
        {item.restriction ?? "Tidak ada informasi pembatasan"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← KEMBALI</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          Ingredient Information
        </Text>

        <Text style={styles.subtitle}>
          Cari informasi bahan skincare dari External API.
        </Text>

        <Text style={styles.source}>
          Data Source: CosIng Checker API
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Niacinamide"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[
            styles.searchButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleSearch}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            [ CARI INGREDIENT ]
          </Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.messageContainer}>
          <ActivityIndicator size="large" color="#438A5E" />
          <Text style={styles.infoText}>
            Mengambil data dari API...
          </Text>
        </View>
      )}

      {!!error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!loading && !error && hasSearched && (
        <Text style={styles.resultCount}>
          Ditemukan {ingredients.length} ingredient
          {ingredients.length !== 1 ? "s" : ""}.
        </Text>
      )}

      {!loading &&
        !error &&
        hasSearched &&
        ingredients.length === 0 && (
          <Text style={styles.infoText}>
            Tidak ada bahan yang cocok dengan pencarian.
          </Text>
        )}

      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderIngredient}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <Text style={styles.footer}>
            Informasi ingredient bukan merupakan diagnosis
            medis atau jaminan keamanan penggunaan produk.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9F5",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#D5E8D5",
  },
  backButton: {
    marginBottom: 18,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#2E7D32",
    fontWeight: "bold",
    fontSize: 13,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#285B38",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
  },
  source: {
    fontSize: 12,
    color: "#438A5E",
    marginTop: 8,
  },
  searchContainer: {
    padding: 20,
    gap: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#90C695",
    borderRadius: 8,
    padding: 12,
    color: "#285B38",
    fontSize: 15,
  },
  searchButton: {
    padding: 14,
    backgroundColor: "#438A5E",
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  messageContainer: {
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    color: "#666666",
    textAlign: "center",
    padding: 12,
  },
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    padding: 14,
  },
  resultCount: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C8DFC8",
    borderRadius: 10,
    padding: 16,
    gap: 5,
  },
  ingredientName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#285B38",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#438A5E",
    marginTop: 6,
  },
  value: {
    fontSize: 13,
    color: "#444444",
    lineHeight: 20,
  },
  footer: {
    fontSize: 11,
    color: "#777777",
    textAlign: "center",
    marginTop: 15,
  },
});

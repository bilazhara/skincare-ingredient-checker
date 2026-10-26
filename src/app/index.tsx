
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { combinations, ingredients } from "../data";
import styles from "../styles";
import type { CombineResult, Ingredient } from "../types";
import { checkCombination } from "../utils";

// Custom function: info tampilan hasil
const getStatus = (r?: CombineResult) => {
  if (r === "good")
    return {
      label: "AMAN DIPAKAI BARENG",
      icon: "✅",
      color: "#2E7D32",
      bg: "#F1F8F1",
    };

  if (r === "caution")
    return {
      label: "HATI-HATI",
      icon: "⚠️",
      color: "#F57C00",
      bg: "#FFF8EE",
    };

  if (r === "avoid")
    return {
      label: "HINDARI",
      icon: "❌",
      color: "#D32F2F",
      bg: "#FDF1F1",
    };

  return {
    label: "BELUM ADA DATA",
    icon: "❔",
    color: "#777777",
    bg: "#F5F5F5",
  };
};

export default function Index() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selected1, setSelected1] = useState<string | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);
  const [isResultMode, setIsResultMode] = useState(false);

  const [result, setResult] = useState<
    ReturnType<typeof checkCombination>
  >(undefined);

  const filteredIngredients = ingredients.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const isCekDisabled = !selected1 || !selected2;

  useEffect(() => {
    if (selected1 && selected2) {
      const hasilKombinasi = checkCombination(
        combinations,
        selected1,
        selected2
      );

      setResult(hasilKombinasi);
    } else {
      setResult(undefined);
    }
  }, [selected1, selected2]);

  const status = getStatus(result?.result);

  const handleSelectIngredient = (name: string) => {
    if (selected1 === name) {
      setSelected1(null);
      return;
    }

    if (selected2 === name) {
      setSelected2(null);
      return;
    }

    if (!selected1) {
      setSelected1(name);
    } else if (!selected2) {
      setSelected2(name);
    }
  };

  const handleCheck = () => {
    if (isCekDisabled) return;
    setIsResultMode(true);
  };

  const handleReset = () => {
    setSelected1(null);
    setSelected2(null);
    setSearch("");
    setIsResultMode(false);
    setResult(undefined);
  };

  const renderTag = (item: Ingredient) => {
    const isSelected =
      selected1 === item.name || selected2 === item.name;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.tag,
          isSelected && styles.tagSelected,
        ]}
        onPress={() => handleSelectIngredient(item.name)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.tagText,
            isSelected && styles.tagTextSelected,
          ]}
        >
          [ {item.name} ]
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardContainer}>
          <Text style={styles.title}>
            Skincare Ingredient Checker
          </Text>

          {!isResultMode ? (
            <>
              <Text style={styles.subtitle}>
                Pilih 2 bahan untuk dicek
              </Text>

              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari bahan..."
                  placeholderTextColor="#777"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              <View style={styles.selectedSection}>
                <Text style={styles.selectedText}>
                  Bahan 1:{" "}
                  <Text style={styles.boldText}>
                    {selected1 || "(belum dipilih)"}
                  </Text>
                </Text>

                <Text style={styles.selectedText}>
                  Bahan 2:{" "}
                  <Text style={styles.boldText}>
                    {selected2 || "(belum dipilih)"}
                  </Text>
                </Text>
              </View>

              <View style={styles.tagsContainer}>
                {filteredIngredients.map(renderTag)}
              </View>

              <TouchableOpacity
                style={[
                  styles.checkButton,
                  isCekDisabled && styles.checkButtonDisabled,
                ]}
                disabled={isCekDisabled}
                onPress={handleCheck}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.checkButtonText,
                    isCekDisabled &&
                      styles.checkButtonTextDisabled,
                  ]}
                >
                  [ CEK ]
                </Text>
              </TouchableOpacity>

              {/* Fitur baru: External API */}
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  { marginTop: 12 },
                ]}
                onPress={() =>
                  router.push("/ingredient-search")
                }
                activeOpacity={0.8}
              >
                <Text style={styles.checkButtonText}>
                  [ CARI INFO INGREDIENT ]
                </Text>
              </TouchableOpacity>

              {/* Navigasi Explore menggunakan Link */}
              <Link href="/explore" asChild>
                <TouchableOpacity
                  style={StyleSheet.flatten([
                    styles.checkButton,
                    { marginTop: 12 },
                  ])}
                  activeOpacity={0.8}
                >
                  <Text style={styles.checkButtonText}>
                    [ EXPLORE ]
                  </Text>
                </TouchableOpacity>
              </Link>

              {/* Navigasi menggunakan router.replace */}
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  { marginTop: 8 },
                ]}
                onPress={() => router.replace("/explore")}
                activeOpacity={0.8}
              >
                <Text style={styles.checkButtonText}>
                  [ BUKA EXPLORE ]
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.selectedSection,
                  {
                    marginTop: 12,
                    marginBottom: 20,
                  },
                ]}
              >
                <Text style={styles.selectedText}>
                  Bahan 1:{" "}
                  <Text style={styles.boldText}>
                    {selected1}
                  </Text>
                </Text>

                <Text style={styles.selectedText}>
                  Bahan 2:{" "}
                  <Text style={styles.boldText}>
                    {selected2}
                  </Text>
                </Text>
              </View>

              <View
                style={[
                  styles.resultCard,
                  {
                    borderLeftColor: status.color,
                    backgroundColor: status.bg,
                  },
                ]}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultIcon}>
                    {status.icon}
                  </Text>

                  <Text
                    style={[
                      styles.resultLabel,
                      { color: status.color },
                    ]}
                  >
                    {status.label}
                  </Text>
                </View>

                <Text style={styles.resultIngredients}>
                  {selected1} + {selected2}
                </Text>

                <Text style={styles.resultNote}>
                  {result
                    ? result.note
                    : "Kombinasi ini belum tersedia."}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkButton,
                  { marginTop: 24 },
                ]}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.checkButtonText}>
                  [ CEK LAGI / RESET ]
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

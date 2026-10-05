import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ingredients, combinations } from "../data";
import { checkCombination } from "../utils";
import { Ingredient, CombineResult } from "../types";
import { styles } from "../styles";

const resultColor = (r?: CombineResult): string => {
  if (r === "good") return "#2E7D32";
  if (r === "caution") return "#F57C00";
  if (r === "avoid") return "#D32F2F";
  return "#777777";
};

const resultLabel = (r?: CombineResult): string => {
  if (r === "good") return "AMAN DIPAKAI BARENG";
  if (r === "caution") return "HATI-HATI";
  if (r === "avoid") return "HINDARI";
  return "BELUM ADA DATA";
};

export default function Index() {
  const [first, setFirst] = useState<string | null>(null);
  const [second, setSecond] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const result =
    first && second ? checkCombination(combinations, first, second) : undefined;

  const pick = (name: string) => {
    setChecked(false);
    if (!first) setFirst(name);
    else if (!second && name !== first) setSecond(name);
  };

  const reset = () => {
    setFirst(null);
    setSecond(null);
    setChecked(false);
  };

  const renderChip = (item: Ingredient) => (
    <Pressable key={item.id} style={styles.chip} onPress={() => pick(item.name)}>
      <Text style={styles.chipText}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardContainer}>
          {/* Judul Aplikasi */}
          <Text style={styles.title}>Skincare Ingredient Checker</Text>

          {!isResultMode || !status ? (
            <>
              {/* Subtitle Instruksi */}
              <Text style={styles.subtitle}>Pilih 2 bahan untuk dicek</Text>

              {/* Kolom Pencarian */}
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Cari bahan..."
                  placeholderTextColor="#777"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>

              {/* Status Bahan Terpilih */}
              <View style={styles.selectedSection}>
                <Text style={styles.selectedText}>
                  Bahan 1:{' '}
                  <Text style={styles.boldText}>
                    {selected1 || '(belum dipilih)'}
                  </Text>
                </Text>

                <Text style={styles.selectedText}>
                  Bahan 2:{' '}
                  <Text style={styles.boldText}>
                    {selected2 || '(belum dipilih)'}
                  </Text>
                </Text>
              </View>

              {/* Daftar Tag Bahan */}
              <View style={styles.tagsContainer}>
                {filteredIngredients.map((item) => {
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
                })}
              </View>

              {/* Tombol Cek */}
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
                    isCekDisabled && styles.checkButtonTextDisabled,
                  ]}
                >
                  [         CEK         ]
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Status Bahan yang Dicek */}
              <View
                style={[
                  styles.selectedSection,
                  { marginTop: 12, marginBottom: 20 },
                ]}
              >
                <Text style={styles.selectedText}>
                  Bahan 1:{' '}
                  <Text style={styles.boldText}>{selected1}</Text>
                </Text>

                <Text style={styles.selectedText}>
                  Bahan 2:{' '}
                  <Text style={styles.boldText}>{selected2}</Text>
                </Text>
              </View>

              {/* Kotak Hasil Cek Sesuai Sketsa 2 */}
              <View
                style={[
                  styles.resultCard,
                  {
                    borderLeftColor: status.borderColor,
                    backgroundColor: status.bgColor,
                  },
                ]}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultIcon}>{status.icon}</Text>

                  <Text
                    style={[
                      styles.resultLabel,
                      { color: status.borderColor },
                    ]}
                  >
                    {status.label}
                  </Text>
                </View>

                <Text style={styles.resultIngredients}>
                  {selected1} + {selected2}
                </Text>

                <Text style={styles.resultNote}>{status.note}</Text>
              </View>

              {/* Tombol Cek Ulang / Kembali */}
              <TouchableOpacity
                style={[
                  styles.checkButton,
                  { marginTop: 24 },
                ]}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <Text style={styles.checkButtonText}>
                  [     CEK LAGI / RESET     ]
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

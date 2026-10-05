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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Skincare Ingredient Checker</Text>
      <Text style={styles.subtitle}>Pilih 2 bahan untuk dicek</Text>

      <Text style={styles.selected}>Bahan 1: {first ?? "(belum dipilih)"}</Text>
      <Text style={styles.selected}>Bahan 2: {second ?? "(belum dipilih)"}</Text>

      <View style={styles.chipRow}>{ingredients.map(renderChip)}</View>

      <Pressable
        style={[styles.button, { opacity: first && second ? 1 : 0.5 }]}
        onPress={() => first && second && setChecked(true)}
      >
        <Text style={styles.buttonText}>CEK</Text>
      </Pressable>
      <Pressable style={styles.resetButton} onPress={reset}>
        <Text>RESET</Text>
      </Pressable>

      {checked && first && second && (
        <View
          style={[
            styles.resultCard,
            { borderLeftColor: resultColor(result?.result) },
          ]}
        >
          <Text
            style={[styles.resultTitle, { color: resultColor(result?.result) }]}
          >
            {resultLabel(result?.result)}
          </Text>
          <Text style={styles.resultNote}>
            {first} + {second}
          </Text>
          <Text style={styles.resultNote}>
            {result ? result.note : "Kombinasi ini belum tersedia."}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

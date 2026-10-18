import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ingredients } from "../data";
import styles from "../styles";

export default function Explore() {
  const router = useRouter();

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

        {ingredients.map((item) => (
          <View key={item.id} style={{ marginBottom: 12 }}>
            <Text style={styles.boldText}>{item.name}</Text>
            <Text style={styles.selectedText}>{item.function}</Text>
            {item.note ? (
              <Text style={styles.selectedText}>⚠️ {item.note}</Text>
            ) : null}
          </View>
        ))}

        {/* 1. Menerapkan fungsi router.back() */}
        <TouchableOpacity
          style={[styles.checkButton, { marginTop: 16 }]}
          onPress={handleBack}
          activeOpacity={0.8}
        >
          <Text style={styles.checkButtonText}>[ KEMBALI (back) ]</Text>
        </TouchableOpacity>

        {/* 2. Menerapkan 1 fungsi expo-router lainnya: router.replace() */}
        <TouchableOpacity
          style={[styles.checkButton, { marginTop: 8 }]}
          onPress={() => router.replace("/")}
          activeOpacity={0.8}
        >
          <Text style={styles.checkButtonText}>[ KE BERANDA (replace) ]</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
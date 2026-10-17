import { ScrollView, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ingredients } from "../data";
import styles from "../styles";

export default function Explore() {
  const router = useRouter();

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

        <Text style={styles.checkButtonText} onPress={() => router.back()}>
          [ KEMBALI ]
        </Text>
      </View>
    </ScrollView>
  );
}
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ingredients, combinations } from '../data';
import { checkCombination } from '../utils';
import { Combination } from '../types';

export default function Index() {
  const [search, setSearch] = useState('');
  const [selected1, setSelected1] = useState<string | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);
  const [result, setResult] = useState<Combination | 'no_data' | null>(null);

  // Filter daftar bahan berdasarkan input pencarian
  const filteredIngredients = useMemo(() => {
    if (!search.trim()) return ingredients;
    return ingredients.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  // Fungsi toggle / pilih bahan
  const handleSelectIngredient = (name: string) => {
    // Jika bahan ini sedang dipilih di slot 1, batalkan
    if (selected1 === name) {
      setSelected1(null);
      setResult(null);
      return;
    }
    // Jika bahan ini sedang dipilih di slot 2, batalkan
    if (selected2 === name) {
      setSelected2(null);
      setResult(null);
      return;
    }

    // Jika belum dipilih: isi slot 1 jika kosong, atau slot 2
    if (!selected1) {
      setSelected1(name);
      setResult(null);
    } else if (!selected2) {
      setSelected2(name);
      setResult(null);
    } else {
      // Jika dua-duanya sudah terisi, ganti slot 2
      setSelected2(name);
      setResult(null);
    }
  };

  // Cek kombinasi
  const handleCheck = () => {
    if (!selected1 || !selected2) return;
    const comb = checkCombination(combinations, selected1, selected2);
    if (comb) {
      setResult(comb);
    } else {
      setResult('no_data');
    }
  };

  const handleReset = () => {
    setSelected1(null);
    setSelected2(null);
    setResult(null);
    setSearch('');
  };

  const getStatusBadge = () => {
    if (!result) return null;
    if (result === 'no_data') {
      return {
        icon: 'ℹ️',
        label: 'BELUM ADA DATA SPESIFIK',
        borderColor: '#9E9E9E',
        bgColor: '#F9F9F9',
        note: 'Kombinasi ini belum tercatat dalam database. Coba lakukan patch test terlebih dahulu.',
      };
    }
    switch (result.result) {
      case 'good':
        return {
          icon: '✅',
          label: 'AMAN DIPAKAI BARENG',
          borderColor: '#2E7D32',
          bgColor: '#F1F8F1',
          note: result.note,
        };
      case 'caution':
        return {
          icon: '⚠️',
          label: 'PERLU HATI-HATI',
          borderColor: '#F57C00',
          bgColor: '#FFF8E1',
          note: result.note,
        };
      case 'avoid':
        return {
          icon: '❌',
          label: 'HINDARI BERSAMAAN',
          borderColor: '#D32F2F',
          bgColor: '#FFEBEE',
          note: result.note,
        };
    }
  };

  const status = getStatusBadge();
  const isCekDisabled = !selected1 || !selected2;
  const isResultMode = Boolean(result && status);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.cardContainer}>
          {/* Judul Aplikasi */}
          <Text style={styles.title}>Skincare Ingredient Checker</Text>

          {!isResultMode || !status ? (
            /* TAMPILAN AWAL (Gambar 1) */
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
                  Bahan 1: <Text style={styles.boldText}>{selected1 || '(belum dipilih)'}</Text>
                </Text>
                <Text style={styles.selectedText}>
                  Bahan 2: <Text style={styles.boldText}>{selected2 || '(belum dipilih)'}</Text>
                </Text>
              </View>

              {/* Daftar Tag Bahan */}
              <View style={styles.tagsContainer}>
                {filteredIngredients.map((item) => {
                  const isSelected = selected1 === item.name || selected2 === item.name;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.tag, isSelected && styles.tagSelected]}
                      onPress={() => handleSelectIngredient(item.name)}
                      activeOpacity={0.7}>
                      <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                        [ {item.name} ]
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Tombol Cek */}
              <TouchableOpacity
                style={[styles.checkButton, isCekDisabled && styles.checkButtonDisabled]}
                disabled={isCekDisabled}
                onPress={handleCheck}
                activeOpacity={0.8}>
                <Text style={[styles.checkButtonText, isCekDisabled && styles.checkButtonTextDisabled]}>
                  [         CEK         ]
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            /* TAMPILAN HASIL (Gambar 2) */
            <>
              {/* Status Bahan yang Dicek */}
              <View style={[styles.selectedSection, { marginTop: 12, marginBottom: 20 }]}>
                <Text style={styles.selectedText}>
                  Bahan 1: <Text style={styles.boldText}>{selected1}</Text>
                </Text>
                <Text style={styles.selectedText}>
                  Bahan 2: <Text style={styles.boldText}>{selected2}</Text>
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
                ]}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultIcon}>{status.icon}</Text>
                  <Text style={[styles.resultLabel, { color: status.borderColor }]}>
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
                style={[styles.checkButton, { marginTop: 24 }]}
                onPress={handleReset}
                activeOpacity={0.8}>
                <Text style={styles.checkButtonText}>
                  [     CEK LAGI / RESET     ]
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAF7',
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#2E7D32', // Garis hijau utama
    borderRadius: 8,
    padding: 24,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20', // Warna hijau tua untuk judul
    marginBottom: 16,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    color: '#2E7D32',
    marginBottom: 20,
    textAlign: 'left',
  },
  searchBox: {
    borderWidth: 1.5,
    borderColor: '#2E7D32', // Garis hijau untuk input cari bahan
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    marginBottom: 20,
    backgroundColor: '#FBFCFB',
  },
  searchInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    color: '#1B5E20',
  },
  selectedSection: {
    marginBottom: 20,
    gap: 6,
    padding: 10,
    backgroundColor: '#F1F8F1',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  selectedText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    color: '#2E7D32',
  },
  boldText: {
    fontWeight: '700',
    color: '#1B5E20',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  tag: {
    borderWidth: 1.5,
    borderColor: '#4CAF50', // Garis hijau untuk tag bahan
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  tagSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
  },
  tagText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  tagTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  checkButton: {
    borderWidth: 2,
    borderColor: '#2E7D32', // Garis hijau untuk tombol CEK
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    marginBottom: 8,
  },
  checkButtonDisabled: {
    borderColor: '#C8E6C9',
    backgroundColor: '#F9FBF9',
  },
  checkButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    letterSpacing: 1.2,
  },
  checkButtonTextDisabled: {
    color: '#A5D6A7',
  },
  resultCard: {
    borderWidth: 1.5,
    borderColor: '#2E7D32', // Garis hijau untuk card hasil
    borderLeftWidth: 8, // Garis tebal di sebelah kiri
    borderRadius: 6,
    padding: 16,
    marginTop: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  resultIcon: {
    fontSize: 18,
  },
  resultLabel: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  resultIngredients: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 8,
  },
  resultNote: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Ingredient } from "../types/ingredient";
import { delay } from "../utils/delay";
import { searchIngredients } from "./ingredientApi";

const HISTORY_KEY = "ingredient_search_history";

// CUSTOM ASYNC FUNCTION
// Kalau API gagal, coba lagi sampai maxRetry kali dengan jeda.
export async function searchIngredientsWithRetry(
  keyword: string,
  maxRetry: number = 2,
): Promise<Ingredient[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetry; attempt++) {
    try {
      return await searchIngredients(keyword);
    } catch (error) {
      lastError = error;
      if (attempt < maxRetry) {
        await delay(500 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

// PRE-BUILT ASYNC (AsyncStorage): ambil riwayat pencarian
export async function getSearchHistory(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading search history:", error);
    return [];
  }
}

// PRE-BUILT ASYNC (AsyncStorage): simpan riwayat (maks 10, tanpa duplikat)
export async function saveSearchHistory(keyword: string): Promise<void> {
  try {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    const history = await getSearchHistory();
    const updated = [
      trimmed,
      ...history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, 10);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving search history:", error);
  }
}

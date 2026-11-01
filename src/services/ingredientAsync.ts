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
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

// PRE-BUILT ASYNC (AsyncStorage): simpan riwayat (maks 10, tanpa duplikat)
export async function saveSearchHistory(keyword: string): Promise<void> {
  const history = await getSearchHistory();
  const updated = [
    keyword,
    ...history.filter((item) => item !== keyword),
  ].slice(0, 10);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

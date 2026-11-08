import {
  Ingredient,
  IngredientApiResponse,
} from "../types/ingredient";

const BASE_URL = "https://cosingchecker.com/api/v1";

/**
 * Validasi keyword menggunakan Promise.resolve() dan Promise.reject()
 */
export function validateIngredientKeyword(keyword: string): Promise<string> {
  const trimmed = keyword.trim();
  if (!trimmed) {
    return Promise.reject(new Error("Keyword pencarian tidak boleh kosong."));
  }
  return Promise.resolve(trimmed);
}

/**
 * MENGGUNAKAN FUNGSI new Promise(), resolve(), reject(), DAN .then()
 * Mengambil data ingredient dari CosIng Checker API.
 */
export function searchIngredientsWithPromise(
  query: string
): Promise<Ingredient[]> {
  return new Promise((resolve, reject) => {
    const keyword = query.trim();

    if (!keyword) {
      // Input kosong: panggil reject()
      return reject(new Error("Keyword pencarian tidak boleh kosong."));
    }

    fetch(`${BASE_URL}/ingredients/?q=${encodeURIComponent(keyword)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Gagal mengambil data dari server. Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((data: IngredientApiResponse) => {
        if (!data || !Array.isArray(data.results)) {
          // Format tidak sesuai: panggil reject()
          return reject(new Error("Format respons API tidak valid."));
        }
        // Berhasil mendapatkan data: panggil resolve()
        resolve(data.results);
      })
      .catch((error: unknown) => {
        // Terjadi kegagalan jaringan/request: panggil reject()
        reject(
          error instanceof Error
            ? error
            : new Error("Terjadi kesalahan saat memproses data API.")
        );
      });
  });
}

export async function searchIngredients(
  query: string
): Promise<Ingredient[]> {
  const keyword = query.trim();

  if (!keyword) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/ingredients/?q=${encodeURIComponent(keyword)}`
    );

    if (!response.ok) {
      throw new Error(
        `Gagal mengambil data. Status: ${response.status}`
      );
    }

    const data: IngredientApiResponse = await response.json();

    if (!Array.isArray(data.results)) {
      throw new Error("Format respons API tidak valid");
    }

    const ingredients: Ingredient[] = data.results;

    return ingredients;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
}

export async function getIngredientByName(
  name: string
): Promise<Ingredient | null> {
  const ingredients = await searchIngredients(name);

  const ingredient = ingredients.find(
    (item) =>
      item.inci_name.toLowerCase() === name.trim().toLowerCase()
  );

  return ingredient ?? null;
}

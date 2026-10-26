
import {
    Ingredient,
    IngredientApiResponse,
} from "../types/ingredient";

const BASE_URL = "https://cosingchecker.com/api/v1";

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

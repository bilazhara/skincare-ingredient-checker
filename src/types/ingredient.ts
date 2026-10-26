
export interface Ingredient {
  id: number;
  slug: string;
  url: string;
  ref_number: string;
  inci_name: string;
  inn_name: string | null;
  ph_eur_name: string | null;
  cas_number: string | null;
  ec_number: string | null;
  description: string | null;
  restriction: string | null;
  function: string | null;
  update_date: string;
  functions: string[];
}

export interface IngredientApiResponse {
  count: number;
  num_pages: number;
  page: number;
  per_page: number;
  next: string | null;
  previous: string | null;
  results: Ingredient[];
}

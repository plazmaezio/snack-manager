export const ingredientTypeOptions = {
  CEREALS_AND_DERIVATIVES: "Cereals and derivatives",
  TUBERS: "Tubers",
  VEGETABLES: "Vegetables",
  FRUIT: "Fruit",
  DAIRY_PRODUCTS: "Dairy products",
  MEAT: "Meat",
  FISH: "Fish",
  EGGS: "Eggs",
  LEGUMES: "Legumes",
  FATS_AND_OILS: "Fats and oils",
} as const;
export type IngredientType = keyof typeof ingredientTypeOptions;

export const ingredientAllergenOptions = {
  NONE: "None",
  GLUTEN_CONTAINING_CEREALS: "Gluten-containing cereals",
  NUTS: "Nuts",
  CRUSTACEANS: "Crustaceans",
  CELERY: "Celery",
  EGGS: "Eggs",
  MUSTARD: "Mustard",
  FISH: "Fish",
  SESAME_SEEDS: "Sesame seeds",
  PEANUTS: "Peanuts",
  SULPHITES: "Sulphites",
  SOYBEANS: "Soybeans",
  LUPINS: "Lupins",
  MILK_AND_MILK_PRODUCTS: "Milk and milk products",
  MOLLUSCS: "Molluscs",
} as const;
export type IngredientAllergen = keyof typeof ingredientAllergenOptions;
 
export interface IngredientResponse {
  readonly id: string;
  /** * Ingredient name.
   * @pattern ^[A-Za-z\s]+$ (Letters and spaces only)
   */
  name: string;
  type: IngredientType;
  allergen: IngredientAllergen;
}

export type IngredientRequest = Omit<IngredientResponse, "id">;

export type IngredientType =
  | "CEREALS_AND_DERIVATIVES"
  | "TUBERS"
  | "VEGETABLES"
  | "FRUIT"
  | "DAIRY_PRODUCTS"
  | "MEAT"
  | "FISH"
  | "EGGS"
  | "LEGUMES"
  | "FATS_AND_OILS";

export type IngredientAllergen =
  | "NONE"
  | "GLUTEN_CONTAINING_CEREALS"
  | "NUTS"
  | "CRUSTACEANS"
  | "CELERY"
  | "EGGS"
  | "MUSTARD"
  | "FISH"
  | "SESAME_SEEDS"
  | "PEANUTS"
  | "SULPHITES"
  | "SOYBEANS"
  | "LUPINS"
  | "MILK_AND_MILK_PRODUCTS"
  | "MOLLUSCS";

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

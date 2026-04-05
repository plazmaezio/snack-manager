export interface DishResponse {
  readonly id: string;
  /** * Dish name.
   * @pattern ^[A-Za-z\s]+$ (Letters and spaces only)
   */
  name: string;
  ingredientNames: string[];
  price: number;
  readonly imageUrl: string;
}

export type DishRequest = Omit<DishResponse, "id" | "imageUrl">;

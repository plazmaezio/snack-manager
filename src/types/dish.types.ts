interface DishData {
  /** * Dish name.
   * @pattern ^[A-Za-z\s]+$ (Letters and spaces only)
   */
  name: string;
  ingredientNames: string[];
  price: number;
}

export interface DishResponse extends DishData {
  readonly id: string;
  readonly imageUrl: string;
}

export interface DishRequest {
  dish: DishData;
  image?: File | null;
}

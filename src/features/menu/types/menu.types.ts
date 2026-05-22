export interface DailyMenuResponse {
  readonly id: string;
  date: string;
  meatDishName?: string;
  fishDishName?: string;
  vegetarianDishName?: string;
}

export type DailyMenuRequest = Omit<DailyMenuResponse, "id">;

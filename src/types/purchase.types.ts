export interface PurchaseResponse {
  readonly id: string;
  clientUsername: string;
  dishName: string;
  date: string;
}

export type PurchaseRequest = Omit<PurchaseResponse, "id">;

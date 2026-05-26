import { api } from "../../../shared/services/api";
import type {
  PurchaseRequest,
  PurchaseResponse,
} from "../types/purchase.types";

const createPurchase = async (
  purchaseData: PurchaseRequest[],
): Promise<PurchaseResponse[]> => {
  const placedOrdersResponse: PurchaseResponse[] = [];
  try {
    for (const item of purchaseData) {
      if (!item.clientUsername || !item.dishName || !item.date) {
        console.error("Invalid purchase data:", item);
        throw new Error("Missing required purchase fields");
      }
      placedOrdersResponse.push(
        await api.post<PurchaseResponse>("/purchases", item),
      );
    }
  } catch (err) {
    // cancel all the purchased commands if any of them fails
    for (const order of placedOrdersResponse) {
      try {
        await api.delete(`/purchases/${order.id}`);
      } catch (deleteErr) {
        console.error(
          `Failed to rollback purchase with id ${order.id}:`,
          deleteErr instanceof Error ? deleteErr.message : deleteErr,
        );
      }
    }
    throw new Error(
      err instanceof Error ? err.message : "Failed to create purchase",
    );
  }
  return placedOrdersResponse;
};

const getPurchases = async (): Promise<PurchaseResponse[]> => {
  try {
    return await api.get<PurchaseResponse[]>("/purchases");
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch purchases",
    );
  }
};

const getPurchasesByClientId = async (
  clientId: string,
): Promise<PurchaseResponse[]> => {
  try {
    return await api.get<PurchaseResponse[]>(`/purchases/by-client/${clientId}`);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch client purchases",
    );
  }
};

const getPurchasesByClientIdForClient = async (
  clientId: string,
): Promise<PurchaseResponse[]> => {
  try {
    return await api.get<PurchaseResponse[]>(`/purchases/client/${clientId}`);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch client purchases",
    );
  }
};

const getPurchasesByDate = async (date: string): Promise<PurchaseResponse[]> => {
  try {
    return await api.get<PurchaseResponse[]>(`/purchases/date/${date}`);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch purchases by date",
    );
  }
};

const getPurchaseById = async (id: string): Promise<PurchaseResponse> => {
  try {
    return await api.get<PurchaseResponse>(`/purchases/${id}`);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to fetch purchase",
    );
  }
};

const deletePurchase = async (id: string): Promise<void> => {
  try {
    await api.delete(`/purchases/${id}`);
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Failed to delete purchase",
    );
  }
};

export {
  createPurchase,
  getPurchases,
  getPurchasesByClientId,
  getPurchasesByClientIdForClient,
  getPurchasesByDate,
  getPurchaseById,
  deletePurchase,
};

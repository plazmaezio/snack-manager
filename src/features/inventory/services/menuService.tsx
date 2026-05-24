import { api } from "../../../shared/services/api";
import type {
DailyMenuRequest,
DailyMenuResponse,
} from "../../daily-menu/types";

const fetchMenusService = async (): Promise<DailyMenuResponse[]> => {
try {
return await api.get<DailyMenuResponse[]>("/menus");
} catch {
throw new Error("Failed to fetch menus");
}
};

const fetchMenuByDateService = async (
date: string,
): Promise<DailyMenuResponse | null> => {
try {
return await api.get<DailyMenuResponse>(`/menus/by-date/${date}`);
} catch (err: any) {
if (err?.status === 404) {
return null;
}

throw new Error("Failed to fetch menu by date");
}
};

const createMenuService = async (
values: DailyMenuRequest,
): Promise<DailyMenuResponse> => {
try {
return await api.post<DailyMenuResponse>("/menus", values);
} catch {
throw new Error("Failed to create menu");
}
};

const updateMenuService = async (
id: string,
values: DailyMenuRequest,
): Promise<DailyMenuResponse> => {
try {
return await api.put<DailyMenuResponse>(`/menus/${id}`, values);
} catch {
throw new Error("Failed to update menu");
}
};

const deleteMenuService = async (id: string): Promise<void> => {
try {
await api.delete(`/menus/${id}`);
} catch {
throw new Error("Failed to delete menu");
}
};

export {
createMenuService,
deleteMenuService,
fetchMenuByDateService,
fetchMenusService,
updateMenuService,
};
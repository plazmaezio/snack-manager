import { useEffect, useState } from "react";
import CentralizedList from "../../../shared/components/CentralizedList";
import { MenuCreateModal } from "./MenuCreateModal";
import { MenuEditModal } from "./MenuEditModal";
import type { DailyMenuResponse, DailyMenuRequest } from "../../menu/types/menu.types.ts";
import {
  createMenuService,
  deleteMenuService,
  fetchMenusService,
  updateMenuService,
} from "../services/MenuService.ts";

class MenuModel implements DailyMenuResponse {
  id = "";
  date = "";
  meatDishName?: string | undefined;
  fishDishName?: string | undefined;
  vegetarianDishName?: string | undefined;
}

const MenusManager = () => {
  const [menus, setMenus] = useState<DailyMenuResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const data = await fetchMenusService();
        setMenus(data);
      } catch (e) {
        setError("Failed to load menus");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleCreate = async (values: DailyMenuRequest) => {
    try {
      const response = await createMenuService(values);
      setMenus((prev) => [...prev, response]);
      setError(null);
    } catch (e) {
      setError("Failed to create menu");
    }
  };

  const handleUpdate = async (id: string, values: DailyMenuRequest) => {
    try {
      const updatedMenu = await updateMenuService(id, values);
      setMenus((current: DailyMenuResponse[]) =>
        current.map((m) => (m.id === id ? updatedMenu : m)),
      );
      setError(null);
    } catch (e) {
      setError("Failed to update menu");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteMenuService(id)));
      setMenus((prev) => prev.filter((m) => !ids.includes(m.id)));
      setError(null);
    } catch (e) {
      setError("Failed to delete menus");
    }
  };

  return (
    <div className="space-y-8">
      {(loading || error) && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          {loading && <span>Loading menus...</span>}
          {error && (
            <span className={loading ? "ml-3 text-red-500" : "text-red-500"}>
              {error}
            </span>
          )}
        </div>
      )}

      <CentralizedList
        data={menus}
        model={MenuModel}
        sortFields={["date"]}
        defaultSortField="date"
        searchFields={["date", "meatDishName", "fishDishName", "vegetarianDishName"]}
        renderCreateModal={(onClose) => (
          <MenuCreateModal
            onSubmit={(values) => {
              handleCreate(values);
              onClose();
            }}
            onClose={onClose}
          />
        )}
        renderEditModal={(item, onClose) => (
          <MenuEditModal
            initialValues={{
              date: item.date,
              meatDishName: item.meatDishName,
              fishDishName: item.fishDishName,
              vegetarianDishName: item.vegetarianDishName,
            }}
            onSubmit={(values) => {
              handleUpdate(item.id, values);
              onClose();
            }}
            onClose={onClose}
          />
        )}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MenusManager;

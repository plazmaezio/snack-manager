import { useEffect, useState } from "react";
import CentralizedList from "./CentralizedList";
import { DishCreateModal } from "./DishCreateModal";
import { DishEditModal } from "./DishEditModal";
import type { DishRequest, DishResponse } from "../types";
import { api } from "../services/api";

class DishModel implements DishResponse {
  id = "";
  name = "";
  ingredientNames: string[] = [];
  price = 0;
  imageUrl = "";
}

const DishManager = () => {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const data = await api.get<DishResponse[]>("/dishes");
        setDishes(data);
      } catch {
        setError("Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const handleCreateDish = async (values: DishRequest) => {
    try {
      const response = await api.post<DishResponse>("/dishes", values);
      setDishes((prev) => [...prev, response]);
      setError(null);
    } catch {
      setError("Failed to create dish");
    }
  };

  const handleUpdateDish = async (dishId: string, values: DishRequest) => {
    try {
      await api.put<DishResponse>(`/dishes/${dishId}`, values);
      setDishes((current) =>
        current.map((dish) =>
          dish.id === dishId
            ? {
                ...dish,
                ...values.dish,
                ...(values.imageUrl ? { imageUrl: values.imageUrl } : {}),
              }
            : dish,
        ),
      );
      setError(null);
    } catch {
      setError("Failed to update dish");
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/dishes/${id}`)));
      setDishes((prev) => prev.filter((dish) => !ids.includes(dish.id)));
      setError(null);
    } catch {
      setError("Failed to delete dishes");
    }
  };

  return (
    <div className="space-y-8">
      {(loading || error) && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          {loading && <span>Loading dishes...</span>}
          {error && (
            <span className={loading ? "ml-3 text-red-500" : "text-red-500"}>
              {error}
            </span>
          )}
        </div>
      )}

      <CentralizedList
        data={dishes}
        model={DishModel}
        sortFields={["name", "price", "ingredientNames"]}
        defaultSortField="name"
        searchFields={["name", "ingredientNames", "imageUrl", "price"]}
        fieldFormatters={{
          ingredientNames: (value) =>
            Array.isArray(value) ? value.join(", ") : String(value),
        }}
        renderCreateModal={(onClose) => (
          <DishCreateModal
            onSubmit={(values) => {
              handleCreateDish(values);
              onClose();
            }}
            onClose={onClose}
          />
        )}
        renderEditModal={(item, onClose) => (
          <DishEditModal
            initialValues={{
              dish: {
                name: item.name,
                ingredientNames: item.ingredientNames,
                price: item.price,
              },
              imageUrl: item.imageUrl,
            }}
            onSubmit={(values) => {
              handleUpdateDish(item.id, values);
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

export default DishManager;

import { useEffect, useState } from "react";
import CentralizedList from "./CentralizedList";
import { DishCreateModal } from "./DishCreateModal";
import { DishEditModal } from "./DishEditModal";
import type { DishRequest, DishResponse, IngredientResponse } from "../types";
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
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [availableIngredients, setAvailableIngredients] = useState<IngredientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDishes = async () => {
      setLoading(true);
      try {
        const data = (await api.get("/dishes")) as DishResponse[];
        setDishes(data);

        // fetch image URLs for each dish
        try {
          const entries = await Promise.all(
            data.map(async (d) => {
              try {
                const res = (await api.get(
                  `/dishes/${d.id}/image-url`,
                )) as { url: string };
                const url = res?.url ?? d.imageUrl ?? "";
                return [d.id, url] as const;
              } catch {
                return [d.id, d.imageUrl ?? ""] as const;
              }
            }),
          );

          setImageUrls(Object.fromEntries(entries));
        } catch {
          // ignore image fetching errors
        }
      } catch (e) {
        setError("Failed to load dishes");
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();

    const fetchIngredients = async () => {
      try {
        const data = (await api.get("/ingredients")) as IngredientResponse[];
        setAvailableIngredients(data ?? []);
      } catch {
        // ignore ingredient fetch errors
      }
    };

    fetchIngredients();
  }, []);

  const handleCreateDish = async (values: DishRequest) => {
    try {
      const formData = new FormData();
      formData.append(
        "dish",
        new Blob([JSON.stringify(values.dish)], { type: "application/json" }),
      );

      if (values.image) {
        formData.append("image", values.image);
      }

      const response = await api.post<DishResponse>("/dishes", formData);
      setDishes((prev) => [...prev, response]);
      setError(null);
    } catch {
      setError("Failed to create dish");
    }
  };

  const handleUpdateDish = async (dishId: string, values: DishRequest) => {
    try {
      const formData = new FormData();
      formData.append(
        "dish",
        new Blob([JSON.stringify(values.dish)], { type: "application/json" }),
      );

      if (values.image) {
        formData.append("image", values.image);
      }

      await api.put<DishResponse>(`/dishes/${dishId}`, formData);
      setDishes((current) =>
        current.map((dish) =>
          dish.id === dishId
            ? {
                ...dish,
                ...values.dish,
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

  const displayedDishes = dishes.map((d) => ({
    ...d,
    ingredientNames: Array.isArray(d.ingredientNames)
      ? Array.from(new Set(d.ingredientNames))
      : d.ingredientNames,
  }));

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
        data={displayedDishes}
        model={DishModel}
        sortFields={["name", "price", "ingredientNames"]}
        defaultSortField="name"
        searchFields={["name", "ingredientNames", "imageUrl", "price"]}
        fieldFormatters={{
          ingredientNames: (value) =>
            Array.isArray(value) ? value.join(", ") : String(value),
          imageUrl: (_value, item) => {
            const src = imageUrls[item.id] || item.imageUrl || "";
          
            if (!src) {
              return <div className="h-12 w-12 rounded bg-ui-border" />;
            }

            return (
              <img
                src={src}
                alt={item.name}
                className="h-12 w-12 object-cover rounded"
              />
            );
          },
        }}
        renderCreateModal={(onClose) => (
          <DishCreateModal
            onSubmit={(values) => {
              handleCreateDish(values);
              onClose();
            }}
            onClose={onClose}
            availableIngredients={availableIngredients}
          />
        )}
        renderEditModal={(item, onClose) => (
          <DishEditModal
            initialValues={{
              dish: {
                name: item.name,
                ingredientNames: Array.isArray(item.ingredientNames)
                  ? Array.from(new Set(item.ingredientNames))
                  : item.ingredientNames,
                price: item.price,
              },
            }}
            onSubmit={(values) => {
              handleUpdateDish(item.id, values);
              onClose();
            }}
            onClose={onClose}
            availableIngredients={availableIngredients}
          />
        )}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DishManager;

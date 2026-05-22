import { useEffect, useState } from "react";
import CentralizedList from "../../../shared/components/CentralizedList";
import { DishCreateModal } from "./DishCreateModal";
import { DishEditModal } from "./DishEditModal";

import { api } from "../../../shared/services/api";
import type { DishRequest, DishResponse } from "../types/dish.types";
import type { IngredientResponse } from "../types/ingredient.types";

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
      const requestBody = values.image
        ? (() => {
            const formData = new FormData();
            formData.append(
              "dish",
              new Blob([JSON.stringify(values.dish)], { type: "application/json" }),
            );
            formData.append("image", values.image);
            return formData;
          })()
        : values.dish;

      const response = await api.post<DishResponse>("/dishes", requestBody);
      setDishes((prev) => [...prev, response]);
      // attempt to fetch the resolved image URL for the new dish and cache-bust it
      try {
        const res = (await api.get(`/dishes/${response.id}/image-url`)) as { url: string };
        setImageUrls((prev) => ({
          ...prev,
          [response.id]: (res?.url ?? response.imageUrl ?? "") + "?cb=" + Date.now(),
        }));
      } catch {
        // ignore image fetch errors
      }
      setError(null);
      window.location.reload();
    } catch {
      setError("Failed to create dish");
    }
  };

  const handleUpdateDish = async (dishId: string, values: DishRequest) => {
    try {
      const requestBody = values.image
        ? (() => {
            const formData = new FormData();
            formData.append(
              "dish",
              new Blob([JSON.stringify(values.dish)], { type: "application/json" }),
            );
            formData.append("image", values.image);
            return formData;
          })()
        : values.dish;

      const response = await api.put<DishResponse>(`/dishes/${dishId}`, requestBody);

      setDishes((current) =>
        current.map((dish) => (dish.id === dishId ? response : dish)),
      );

      if (response && response.id) {
        if (response.imageUrl) {
          // backend returned an image URL — attach cache-buster to force reload
          setImageUrls((prev) => ({
            ...prev,
            [response.id]: response.imageUrl + "?cb=" + Date.now(),
          }));
        } else if (values.image) {
          // if we uploaded an image but backend didn't return a URL, try to fetch it
          try {
            const res = (await api.get(`/dishes/${response.id}/image-url`)) as { url: string };
            setImageUrls((prev) => ({
              ...prev,
              [response.id]: (res?.url ?? prev[response.id] ?? "") + "?cb=" + Date.now(),
            }));
          } catch {
            // ignore image fetch errors
          }
        }
      }

      setError(null);
      window.location.reload();
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
        sortFields={["name", "price"]}
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
                // send the raw imageUrl from the dish data (no cached/rewritten URL)
                imageUrl: item.imageUrl ?? "",
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

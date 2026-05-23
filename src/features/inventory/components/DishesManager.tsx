import { useEffect, useState } from "react";
import CentralizedList from "../../../shared/components/CentralizedList";
import { DishCreateModal } from "./DishCreateModal";
import { DishEditModal } from "./DishEditModal";

import { api } from "../../../shared/services/api";
import type { DishRequest, DishResponse, IngredientResponse } from "../types";
import {
  fetchAndMapDishImages,
  fetchDishesService,
} from "../../../shared/services/dishService";
import { getIngredientsService } from "../../../shared/services/ingredientService";

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
  const [availableIngredients, setAvailableIngredients] = useState<
    IngredientResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const fetchDishes = async () => {
    try {
      const data: DishResponse[] = await fetchDishesService();
      setDishes(data);
      const urlMap = await fetchAndMapDishImages(data);
      setImageUrls(urlMap);
    } catch (e) {
      setErrors((prev) => [...prev, "Failed to load dishes data."]);
    }
  };

  const fetchIngredients = async () => {
    try {
      const data = await getIngredientsService();
      setAvailableIngredients(data ?? []);
    } catch (e) {
      setErrors((prev) => [...prev, "Failed to load ingredients inventory."]);
    }
  };

  const loadAllInitialData = async () => {
    setLoading(true);
    setErrors([]);

    await Promise.all([fetchDishes(), fetchIngredients()]);

    setLoading(false);
  };

  useEffect(() => {
    loadAllInitialData();
  }, []);

  const handleCreateDish = async (values: DishRequest) => {
    try {
      const requestBody = values.image
        ? (() => {
            const formData = new FormData();
            formData.append(
              "dish",
              new Blob([JSON.stringify(values.dish)], {
                type: "application/json",
              }),
            );
            formData.append("image", values.image);
            return formData;
          })()
        : values.dish;

      const response = await api.post<DishResponse>("/dishes", requestBody);
      setDishes((prev) => [...prev, response]);

      try {
        const res = (await api.get(`/dishes/${response.id}/image-url`)) as {
          url: string;
        };
        setImageUrls((prev) => ({
          ...prev,
          [response.id]:
            (res?.url ?? response.imageUrl ?? "") + "?cb=" + Date.now(),
        }));
      } catch {
        // ignore image fetch errors
      }
      setErrors([]);
      window.location.reload();
    } catch {
      setErrors((prev) => [...prev, "Failed to create dish."]);
    }
  };

  const handleUpdateDish = async (dishId: string, values: DishRequest) => {
    try {
      const requestBody = values.image
        ? (() => {
            const formData = new FormData();
            formData.append(
              "dish",
              new Blob([JSON.stringify(values.dish)], {
                type: "application/json",
              }),
            );
            formData.append("image", values.image);
            return formData;
          })()
        : values.dish;

      const response = await api.put<DishResponse>(
        `/dishes/${dishId}`,
        requestBody,
      );

      setDishes((current) =>
        current.map((dish) => (dish.id === dishId ? response : dish)),
      );

      if (response && response.id) {
        if (response.imageUrl) {
          setImageUrls((prev) => ({
            ...prev,
            [response.id]: response.imageUrl + "?cb=" + Date.now(),
          }));
        } else if (values.image) {
          try {
            const res = (await api.get(`/dishes/${response.id}/image-url`)) as {
              url: string;
            };
            setImageUrls((prev) => ({
              ...prev,
              [response.id]:
                (res?.url ?? prev[response.id] ?? "") + "?cb=" + Date.now(),
            }));
          } catch {
            // ignore image fetch errors
          }
        }
      }

      setErrors([]);
      window.location.reload();
    } catch {
      setErrors((prev) => [...prev, "Failed to update dish."]);
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/dishes/${id}`)));
      setDishes((prev) => prev.filter((dish) => !ids.includes(dish.id)));
      setErrors([]);
    } catch {
      setErrors((prev) => [...prev, "Failed to delete dishes."]);
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
      {(loading || errors.length > 0) && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text space-y-1">
          {loading && <div>Loading dishes and inventory dependencies...</div>}
          {errors.length > 0 && (
            <ul className="list-disc list-inside text-red-500 space-y-0.5">
              {errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
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

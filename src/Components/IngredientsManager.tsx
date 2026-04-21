import { useEffect, useState } from "react";
import CentralizedList from "../components/CentralizedList";
import { IngredientCreateModal } from "../components/IngredientCreateModal";
import { IngredientEditModal } from "../components/IngredientEditModal";
import type {
  IngredientAllergen,
  IngredientRequest,
  IngredientResponse,
  IngredientType,
} from "../types";
import { ingredientAllergenOptions, ingredientTypeOptions } from "../types";
import { api } from "../services/api";

class IngredientModel implements IngredientResponse {
  id = "";
  name = "";
  type: IngredientType = "VEGETABLES";
  allergen: IngredientAllergen = "NONE";
}

const IngredientsManager = () => {
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);
      try {
        const data = (await api.get("/ingredients")) as IngredientResponse[];
        setIngredients(data);
      } catch (e) {
        setError("Failed to load ingredients");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);
  const handleCreateIngredient = async (values: IngredientRequest) => {
    try {
      const response = (await api.post(
        "/ingredients",
        values,
      )) as IngredientResponse;
      setIngredients((prev) => [...prev, response]);
      setError(null);
    } catch (e) {
      setError("Failed to create ingredient");
    }
  };

  const handleUpdateIngredient = (
    ingredientId: string,
    values: IngredientRequest,
  ) => {
    try {
      api.put(`/ingredients/${ingredientId}`, values);
      setIngredients((current: IngredientResponse[]) =>
        current.map((ingredient: IngredientResponse) =>
          ingredient.id === ingredientId
            ? { ...ingredient, ...values }
            : ingredient,
        ),
      );
      setError(null);
    } catch (e) {
      setError("Failed to update ingredient");
    }
  };
  const handleDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => api.delete(`/ingredients/${id}`)));
      setIngredients((prev) => prev.filter((i) => !ids.includes(i.id)));
      setError(null);
    } catch (e) {
      setError("Failed to delete ingredients");
    }
  };

  return (
    <div className="space-y-8">
      {(loading || error) && (
        <div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
          {loading && <span>Loading ingredients...</span>}
          {error && (
            <span className={loading ? "ml-3 text-red-500" : "text-red-500"}>
              {error}
            </span>
          )}
        </div>
      )}

      <CentralizedList
        data={ingredients}
        model={IngredientModel}
        sortFields={["name", "type", "allergen"]}
        defaultSortField="name"
        searchFields={["name", "type", "allergen"]}
        fieldFormatters={{
          type: (value) => ingredientTypeOptions[value] ?? String(value),
          allergen: (value) =>
            ingredientAllergenOptions[value] ?? String(value),
        }}
        renderCreateModal={(onClose) => (
          <IngredientCreateModal
            onSubmit={(values) => {
              handleCreateIngredient(values);
              onClose();
            }}
            onClose={onClose}
          />
        )}
        renderEditModal={(item, onClose) => (
          <IngredientEditModal
            initialValues={{
              name: item.name,
              type: item.type,
              allergen: item.allergen,
            }}
            onSubmit={(values) => {
              handleUpdateIngredient(item.id, values);
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

export default IngredientsManager;

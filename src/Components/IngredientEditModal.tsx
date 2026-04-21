import { useState, type FormEvent } from "react";
import type {
  IngredientAllergen,
  IngredientRequest,
  IngredientType,
} from "../types";
import { ingredientTypeOptions, ingredientAllergenOptions } from "../types";
import { formatName, namePattern, nameTitle } from "../utils/nameFormatting.ts";

type IngredientEditModalProps = {
  initialValues: IngredientRequest;
  onSubmit: (values: IngredientRequest) => void;
  onClose: () => void;
};

export const IngredientEditModal = ({
  initialValues,
  onSubmit,
  onClose,
}: IngredientEditModalProps) => {
  const [name, setName] = useState(initialValues.name);
  const [type, setType] = useState<IngredientType>(initialValues.type);
  const [allergen, setAllergen] = useState<IngredientAllergen>(
    initialValues.allergen,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ name: formatName(name), type, allergen });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl overflow-hidden"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">
          Edit ingredient
        </h2>
        <div className="flex-1 overflow-y-auto scrollbar-themed pr-1">
          <label
            htmlFor="ingredient-name"
            className="mb-1 block font-medium text-main-text"
          >
            Name
          </label>
          <input
            id="ingredient-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={(event) => setName(formatName(event.target.value))}
            placeholder="Enter ingredient name"
            required
            pattern={namePattern}
            title={nameTitle}
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label className="mb-2 block font-medium text-main-text">Type</label>
          <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
            <div className="max-h-32 overflow-y-auto scrollbar-themed p-3">
              <div className="flex flex-wrap gap-2">
                {(
                  Object.entries(ingredientTypeOptions) as [
                    IngredientType,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className="rounded-full py-2 px-4 text-sm font-medium transition"
                    style={
                      type === value
                        ? { backgroundColor: "var(--accent)", color: "white" }
                        : {
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-h)",
                            border: "1px solid var(--ui-border)",
                          }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="mb-2 block font-medium text-main-text">
            Allergen
          </label>
          <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
            <div className="max-h-32 overflow-y-auto scrollbar-themed p-3">
              <div className="flex flex-wrap gap-2">
                {(
                  Object.entries(ingredientAllergenOptions) as [
                    IngredientAllergen,
                    string,
                  ][]
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAllergen(value)}
                    className="rounded-full py-2 px-4 text-sm font-medium transition"
                    style={
                      allergen === value
                        ? { backgroundColor: "var(--accent)", color: "white" }
                        : {
                            backgroundColor: "var(--input-bg)",
                            color: "var(--text-h)",
                            border: "1px solid var(--ui-border)",
                          }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row bg-main-bg pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-ui-border bg-(--input-bg) px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

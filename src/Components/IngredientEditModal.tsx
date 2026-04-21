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
        className="w-full max-w-lg rounded-3xl border border-ui-border bg-main-bg p-6 text-left shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">
          Edit ingredient
        </h2>
        <p className="mb-6 text-sm text-main-text">
          Keep the record fields aligned with the shared list component.
        </p>

        {/* --- NAME INPUT --- */}
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
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => setName(formatName(e.target.value))}
          placeholder="Enter ingredient name"
          required
          pattern={namePattern}
          title={nameTitle}
          className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none focus:border-brand"
        />

        {/* --- TYPE SECTION --- */}
        <label className="mb-2 block font-medium text-main-text">Type</label>
        {/* WRAPPER 1: Clips the corners */}
        <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
          {/* INNER 2: Handles the scrollbar */}
          <div className="max-h-48 overflow-y-auto scrollbar-themed p-3">
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
                  className={`rounded-full py-2 px-4 text-sm font-medium transition border ${
                    type === value
                      ? "bg-brand text-white border-brand"
                      : "bg-(--input-bg) text-main-text border-ui-border hover:border-brand/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- ALLERGEN SECTION --- */}
        <label className="mb-2 block font-medium text-main-text">
          Allergen
        </label>
        {/* WRAPPER 1: Clips the corners */}
        <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
          {/* INNER 2: Handles the scrollbar */}
          <div className="max-h-48 overflow-y-auto scrollbar-themed p-3">
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
                  className={`rounded-full py-2 px-4 text-sm font-medium transition border ${
                    allergen === value
                      ? "bg-brand text-white border-brand"
                      : "bg-(--input-bg) text-main-text border-ui-border hover:border-brand/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

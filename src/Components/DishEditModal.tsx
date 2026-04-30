import { useState, type FormEvent } from "react";
import type { DishRequest } from "../types";
import { formatName, namePattern, nameTitle } from "../utils/nameFormatting.ts";

type DishEditModalProps = {
  initialValues: DishRequest;
  onSubmit: (values: DishRequest) => void;
  onClose: () => void;
  selectedIngredients?: string[];
};

export const DishEditModal = ({
  initialValues,
  onSubmit,
  onClose,
  selectedIngredients = [],
}: DishEditModalProps) => {
  const [name, setName] = useState(initialValues.dish.name);
  const [ingredientNames, setIngredientNames] = useState<string[]>(
    initialValues.dish.ingredientNames,
  );
  const [price, setPrice] = useState<number>(initialValues.dish.price);
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      dish: {
        name: formatName(name),
        ingredientNames,
        price,
      },
      imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <form
   
        className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">Edit dish</h2>

        <div className="flex-1 overflow-y-auto scrollbar-themed pr-1">
          <label
            htmlFor="dish-name"
            className="mb-1 block font-medium text-main-text"
          >
            Name
          </label>
          <input
            id="dish-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={(event) => setName(formatName(event.target.value))}
            placeholder="Enter dish name"
            required
            pattern={namePattern}
            title={nameTitle}
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label
            htmlFor="dish-ingredients"
            className="mb-1 block font-medium text-main-text"
          >
            Ingredient names
          </label>
          <input
            id="dish-ingredients"
            type="text"
            placeholder="Enter ingredient names separated by commas"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label className="mb-2 block font-medium text-main-text">
            Selected ingredients
          </label>
          <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
            <div className="max-h-40 min-h-30 overflow-y-auto scrollbar-themed p-4">
              <div className="flex flex-wrap gap-3">
                {selectedIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    className="rounded-full py-2.5 px-5 text-sm font-medium transition"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      color: "var(--text-h)",
                      border: "1px solid var(--ui-border)",
                    }}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label
            htmlFor="dish-price"
            className="mb-1 block font-medium text-main-text"
          >
            Price
          </label>
          <input
            id="dish-price"
            type="number"
            value={price}
            onChange={(event) => setPrice(parseFloat(event.target.value) || 0)}
            min="0"
            step="0.01"
            placeholder="Enter dish price"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label
            htmlFor="dish-image-url"
            className="mb-1 block font-medium text-main-text"
          >
            Image URL
          </label>
          <input
            id="dish-image-url"
            type="text"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            placeholder="Enter image URL"
            className="mb-2 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 bg-main-bg pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-ui-border bg-(--input-bg) px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
          >
            Close
          </button>
          <button
            type="button"
            className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
};

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { DishRequest, IngredientResponse } from "../types";
import { formatName, namePattern, nameTitle } from "../utils/nameFormatting.ts";

type DishCreateModalProps = {
  onSubmit: (values: DishRequest) => void;
  onClose: () => void;
  selectedIngredients?: string[];
  availableIngredients?: IngredientResponse[];
};

export const DishCreateModal = ({
  onSubmit,
  onClose,
  availableIngredients = [],
}: DishCreateModalProps) => {
  const [name, setName] = useState("");
  const [ingredientNames, setIngredientNames] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] ?? null);
  };

  const openImagePicker = () => {
    if (!imageInputRef.current) return;
    imageInputRef.current.value = "";
    imageInputRef.current.click();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return;

    const payload: DishRequest = {
      dish: {
        name: formatName(name),
        ingredientNames,
        price: parsedPrice,
      },
    };

    if (image) {
      payload.image = image;
    }

    onSubmit(payload);
  };

  const addIngredient = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    // only allow ingredients from availableIngredients
    if (!availableIngredients.find((a) => a.name === trimmed)) return;
    setIngredientNames((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setIngredientInput("");
  };

  const handleIngredientKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient(ingredientInput);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">
          Create dish
        </h2>

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
            value={ingredientInput}
            onChange={(event) => setIngredientInput(event.target.value)}
            onKeyDown={handleIngredientKey}
            placeholder="Type ingredient and press Enter or pick below"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          {/* suggestions */}
          <div className="mb-3 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto overflow-y-hidden scrollbar-themed p-4">
              <div className="flex flex-nowrap gap-2 whitespace-nowrap">
                {availableIngredients
                  .filter((a) => !ingredientNames.includes(a.name))
                  .filter((a) =>
                    ingredientInput ? a.name.toLowerCase().includes(ingredientInput.toLowerCase()) : true,
                  )
                  .map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => addIngredient(a.name)}
                  className="shrink-0 rounded-full py-2 px-3 text-sm font-medium transition border border-green-500/40 bg-green-500/10 text-green-700 hover:bg-green-500/20 hover:border-green-500/60 dark:text-green-300"
                >
                  {a.name}
                </button>
              ))}
              </div>
            </div>
          </div>

          <label className="mb-2 block font-medium text-main-text">
            Selected ingredients
          </label>
           <div className="mb-4 rounded-2xl border border-ui-border overflow-hidden">
            <div className="max-h-40 min-h-30 overflow-y-auto scrollbar-themed p-4">
              <div className="flex flex-wrap gap-3">
                {ingredientNames.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    onClick={() =>
                      setIngredientNames((prev) => prev.filter((i) => i !== ingredient))
                    }
                    className="rounded-full py-2.5 px-5 text-sm font-medium transition border border-red-500/40 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:border-red-500/60 dark:text-red-300"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {ingredientNames.length > 0 && (
            <button
              type="button"
              onClick={() => setIngredientNames([])}
              className="mb-4 w-full rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 dark:text-red-300"
            >
              Clear all ingredients
            </button>
          )}

          <label
            htmlFor="dish-price"
            className="mb-1 block font-medium text-main-text"
          >
            Price
          </label>
          <input
            id="dish-price"
            type="text"
            value={price}
            onChange={(event) => {
              const next = event.target.value;
              if (/^\d*(\.\d*)?$/.test(next)) {
                setPrice(next);
              }
            }}
            inputMode="decimal"
            pattern="^\d+(\.\d+)?$"
            required
            title="Price must be greater than 0"
            placeholder="Enter dish price"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label
            htmlFor="dish-image"
            className="mb-1 block font-medium text-main-text"
          >
            Image
          </label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {!image ? (
            <button
              type="button"
              onClick={openImagePicker}
              className="mb-4 flex w-full items-center justify-center rounded-full border border-ui-border bg-input-bg px-4 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
            >
              Add image
            </button>
          ) : (
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openImagePicker}
                className="rounded-full py-2.5 px-5 text-sm font-medium transition flex-1 cursor-pointer truncate bg-input-bg text-main-text border border-ui-border hover:border-brand hover:text-brand"
              >
                {image.name}
              </button>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="rounded-full py-2.5 px-5 text-sm font-medium transition flex-1 border border-red-500/40 bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:text-red-300"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 bg-main-bg pt-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-ui-border bg-input-bg px-5 py-2.5 text-sm font-medium text-main-text transition hover:border-brand hover:text-brand"
          >
            Close
          </button>
          <button
            type="submit"
            className="w-full rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
          >
            Create dish
          </button>
        </div>
      </form>
    </div>
  );
};

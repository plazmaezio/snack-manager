import { useMemo, useState, type FormEvent } from "react";
import type { DailyMenuRequest } from "../../daily-menu/types";

type MenuCategory = "MEAT" | "FISH" | "VEGETABLES";

type MenuDishOption = {
  name: string;
  category: MenuCategory;
};

type MenuCreateModalProps = {
  onSubmit: (values: DailyMenuRequest) => void;
  onClose: () => void;
  validateMenuPayload: (values: DailyMenuRequest) => string | null;
  availableDishes: MenuDishOption[];
};

const categoryMeta: Record<
  MenuCategory,
  {
    title: string;
    help: string;
    activeClass: string;
    baseClass: string;
    selectedClass: string;
  }
> = {
  MEAT: {
    title: "Meat",
    help: "Pick one meat dish.",
    activeClass: "text-red-700 dark:text-red-300",
    baseClass:
      "bg-red-50 text-red-800 border-red-200 hover:border-red-300 dark:bg-red-950/35 dark:text-red-200 dark:border-red-800/60",
    selectedClass:
      "bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300 ring-offset-2 ring-offset-main-bg",
  },
  FISH: {
    title: "Fish",
    help: "Pick one fish dish.",
    activeClass: "text-amber-700 dark:text-amber-300",
    baseClass:
      "bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300 dark:bg-amber-950/35 dark:text-amber-200 dark:border-amber-800/60",
    selectedClass:
      "bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300 ring-offset-2 ring-offset-main-bg",
  },
  VEGETABLES: {
    title: "Veggies",
    help: "Pick one vegetarian/other dish.",
    activeClass: "text-emerald-700 dark:text-emerald-300",
    baseClass:
      "bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300 dark:bg-emerald-950/35 dark:text-emerald-200 dark:border-emerald-800/60",
    selectedClass:
      "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300 ring-offset-2 ring-offset-main-bg",
  },
};

export const MenuCreateModal = ({
  onSubmit,
  onClose,
  validateMenuPayload,
  availableDishes,
}: MenuCreateModalProps) => {
  const [date, setDate] = useState("");
  const [meatDishName, setMeatDishName] = useState("");
  const [fishDishName, setFishDishName] = useState("");
  const [vegetarianDishName, setVegetarianDishName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const groupedDishes = useMemo(
    () => ({
      MEAT: availableDishes.filter((dish) => dish.category === "MEAT"),
      FISH: availableDishes.filter((dish) => dish.category === "FISH"),
      VEGETABLES: availableDishes.filter((dish) => dish.category === "VEGETABLES"),
    }),
    [availableDishes],
  );

  const selectedByCategory: Record<MenuCategory, string> = {
    MEAT: meatDishName,
    FISH: fishDishName,
    VEGETABLES: vegetarianDishName,
  };

  const updateSelection = (category: MenuCategory, nextName: string) => {
    if (category === "MEAT") {
      setMeatDishName(nextName);
      return;
    }

    if (category === "FISH") {
      setFishDishName(nextName);
      return;
    }

    setVegetarianDishName(nextName);
  };

  const handleDishClick = (category: MenuCategory, dishName: string) => {
    const current = selectedByCategory[category];
    updateSelection(category, current === dishName ? "" : dishName);
    setValidationError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date) return;

    if (!meatDishName && !fishDishName && !vegetarianDishName) {
      setValidationError("Select at least one dish before saving.");
      return;
    }

    const payload: DailyMenuRequest = {
      date,
      meatDishName: meatDishName || undefined,
      fishDishName: fishDishName || undefined,
      vegetarianDishName: vegetarianDishName || undefined,
    };

    const error = validateMenuPayload(payload);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">Create menu</h2>

        <p className="mb-4 text-sm text-main-text/80">
          Choose dishes by type. Click once to select, click again to clear.
          Only one dish can be selected in each type.
        </p>

        <div className="flex-1 overflow-y-auto scrollbar-themed pr-1">
          <label className="mb-1 block font-medium text-main-text">Date</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          {(Object.keys(categoryMeta) as MenuCategory[]).map((category) => {
            const meta = categoryMeta[category];
            const dishes = groupedDishes[category];
            const selectedName = selectedByCategory[category];

            return (
              <div key={category} className="mb-4 rounded-2xl border border-ui-border bg-(--input-bg) p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className={`text-base font-semibold ${meta.activeClass}`}>
                    {meta.title}
                  </h3>
                  <span className="text-xs text-main-text/70">{meta.help}</span>
                </div>

                {selectedName && (
                  <p className="mb-3 text-xs text-main-text/70">
                    Selected: <span className="font-semibold">{selectedName}</span>
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {dishes.length === 0 ? (
                    <span className="text-sm text-main-text/70">No dishes available.</span>
                  ) : (
                    dishes.map((dish) => {
                      const isSelected = selectedName === dish.name;
                      return (
                        <button
                          key={dish.name}
                          type="button"
                          onClick={() => handleDishClick(category, dish.name)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            isSelected ? meta.selectedClass : meta.baseClass
                          }`}
                        >
                          {dish.name}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}

          {validationError && (
            <p className="mb-4 text-sm text-red-500">{validationError}</p>
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
            Create menu
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuCreateModal;

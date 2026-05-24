import { useMemo, useState, type FormEvent } from "react";
import type { DailyMenuRequest } from "../../daily-menu/types";

type MenuCategory = "MEAT" | "FISH" | "VEGETABLES";

type MenuDishOption = {
name: string;
category: MenuCategory;
ingredientNames: string[];
};

type MenuEditModalProps = {
initialValues: DailyMenuRequest;
onSubmit: (values: DailyMenuRequest) => void;
onClose: () => void;
validateMenuPayload: (values: DailyMenuRequest) => string | null;
availableDishes: MenuDishOption[];
};

const categoryMeta: Record<
MenuCategory,
{
label: string;
help: string;
activeClass: string;
baseClass: string;
selectedClass: string;
}
> = {
MEAT: {
label: "Meat",
help: "Red cards",
activeClass: "bg-red-600 text-white border-red-600 shadow-md",
baseClass:
"bg-red-50 text-red-800 border-red-200 hover:border-red-300 dark:bg-red-950/35 dark:text-red-200 dark:border-red-800/60",
selectedClass:
"bg-red-600 text-white border-red-600 shadow-md ring-2 ring-red-300 ring-offset-2 ring-offset-main-bg",
},
FISH: {
label: "Fish",
help: "Amber cards",
activeClass: "bg-amber-500 text-white border-amber-500 shadow-md",
baseClass:
"bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300 dark:bg-amber-950/35 dark:text-amber-200 dark:border-amber-800/60",
selectedClass:
"bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-300 ring-offset-2 ring-offset-main-bg",
},
VEGETABLES: {
label: "Veggies",
help: "Green cards",
activeClass: "bg-emerald-600 text-white border-emerald-600 shadow-md",
baseClass:
"bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-300 dark:bg-emerald-950/35 dark:text-emerald-200 dark:border-emerald-800/60",
selectedClass:
"bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300 ring-offset-2 ring-offset-main-bg",
},
};

export const MenuEditModal = ({
initialValues,
onSubmit,
onClose,
validateMenuPayload,
availableDishes,
}: MenuEditModalProps) => {
const [date, setDate] = useState(initialValues.date);
const [activeCategory, setActiveCategory] = useState<MenuCategory>(
initialValues.meatDishName
? "MEAT"
: initialValues.fishDishName
? "FISH"
: "VEGETABLES",
);
const [meatDishName, setMeatDishName] = useState(initialValues.meatDishName ?? "");
const [fishDishName, setFishDishName] = useState(initialValues.fishDishName ?? "");
const [vegetarianDishName, setVegetarianDishName] = useState(
initialValues.vegetarianDishName ?? "",
);
const [validationError, setValidationError] = useState<string | null>(null);

const visibleDishes = useMemo(
() => availableDishes.filter((dish) => dish.category === activeCategory),
[activeCategory, availableDishes],
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

const handleDishClick = (dish: MenuDishOption) => {
const current = selectedByCategory[activeCategory];
updateSelection(activeCategory, current === dish.name ? "" : dish.name);
setValidationError(null);
};

const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();
if (!date) return;

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
<h2 className="mb-2 text-2xl font-semibold text-heading">Edit menu</h2>

<p className="mb-4 text-sm text-main-text/80">
Pick a category, then click a dish card. Clicking the same card again
clears it. Picking another dish in the same category replaces the
current selection.
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

<div className="mb-4 grid gap-3 sm:grid-cols-3">
{(Object.entries(selectedByCategory) as [MenuCategory, string][]).map(
([category, selectedName]) => {
const meta = categoryMeta[category];

return (
<button
key={category}
type="button"
onClick={() => setActiveCategory(category)}
className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
activeCategory === category
? meta.activeClass
: "bg-(--input-bg) text-main-text border-ui-border hover:border-brand"
}`}
>
<span className="block text-xs uppercase tracking-[0.2em] opacity-80">
{meta.label}
</span>
<span className="mt-1 block truncate">
{selectedName || `No ${meta.label.toLowerCase()} dish selected`}
</span>
</button>
);
},
)}
</div>

<div className="mb-4 rounded-2xl border border-ui-border bg-(--input-bg) p-4">
<div className="mb-3 flex flex-wrap gap-2">
{(Object.keys(categoryMeta) as MenuCategory[]).map((category) => {
const meta = categoryMeta[category];

return (
<button
key={category}
type="button"
onClick={() => setActiveCategory(category)}
className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
activeCategory === category
? meta.activeClass
: "bg-main-bg text-main-text border-ui-border hover:border-brand"
}`}
>
{meta.label}
</button>
);
})}
</div>

<p className="text-sm text-main-text/80">
{categoryMeta[activeCategory].help}. The list below shows only dishes
for the selected category.
</p>

<div className="mt-4 rounded-2xl border border-ui-border overflow-hidden">
<div className="max-h-80 overflow-y-auto scrollbar-themed p-3">
{visibleDishes.length === 0 ? (
<p className="py-8 text-center text-sm text-main-text/70">
No dishes available for this category.
</p>
) : (
<div className="grid gap-3 sm:grid-cols-2">
{visibleDishes.map((dish) => {
const meta = categoryMeta[dish.category];
const isSelected = selectedByCategory[dish.category] === dish.name;

return (
<button
key={dish.name}
type="button"
onClick={() => handleDishClick(dish)}
className={`rounded-2xl border p-4 text-left transition ${
isSelected ? meta.selectedClass : meta.baseClass
}`}
>
<div className="flex items-start justify-between gap-3">
<div>
<p className="font-semibold">{dish.name}</p>
<p className="mt-1 text-xs uppercase tracking-[0.18em] opacity-75">
{meta.label}
</p>
</div>
{isSelected && (
<span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">
Selected
</span>
)}
</div>
<p className="mt-3 text-xs opacity-80">
{dish.ingredientNames.join(", ")}
</p>
</button>
);
})}
</div>
)}
</div>
</div>
</div>

{validationError && <p className="mb-4 text-sm text-red-500">{validationError}</p>}
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
Save changes
</button>
</div>
</form>
</div>
);
};

export default MenuEditModal;
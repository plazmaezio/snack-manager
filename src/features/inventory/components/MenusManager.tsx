import { useEffect, useMemo, useState } from "react";
import CentralizedList from "../../../shared/components/CentralizedList";
import { MenuCreateModal } from "./MenuCreateModal";
import { MenuEditModal } from "./MenuEditModal";
import type { DailyMenuResponse, DailyMenuRequest } from "../../daily-menu/types";
import type { DishResponse, IngredientResponse, IngredientType } from "../types";
import { fetchDishesService } from "../../../shared/services/dishService.tsx";
import { getIngredientsService } from "../../../shared/services/ingredientService.tsx";
import {
createMenuService,
deleteMenuService,
fetchMenusService,
updateMenuService,
} from "../services/menuService.tsx";


class MenuModel implements DailyMenuResponse {
id = "";
date = "";
meatDishName?: string | undefined;
fishDishName?: string | undefined;
vegetarianDishName?: string | undefined;
}

type MenuCategory = "MEAT" | "FISH" | "VEGETABLES";

type MenuDishOption = {
name: string;
category: MenuCategory;
};

const MenusManager = () => {
const [menus, setMenus] = useState<DailyMenuResponse[]>([]);
const [dishes, setDishes] = useState<DishResponse[]>([]);
const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
const [menusLoading, setMenusLoading] = useState(false);
const [catalogLoading, setCatalogLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const loading = menusLoading || catalogLoading;

useEffect(() => {
const fetchMenus = async () => {
setMenusLoading(true);
try {
const data = await fetchMenusService();
setMenus(data);
} catch (e) {
setError("Failed to load menus");
} finally {
setMenusLoading(false);
}
};

fetchMenus();
}, []);

useEffect(() => {
const fetchCatalog = async () => {
setCatalogLoading(true);
try {
const [fetchedDishes, fetchedIngredients] = await Promise.all([
fetchDishesService(),
getIngredientsService(),
]);

setDishes(fetchedDishes);
setIngredients(fetchedIngredients);
} catch (e) {
setError("Failed to load dishes or ingredients");
} finally {
setCatalogLoading(false);
}
};

fetchCatalog();
}, []);

const ingredientTypeByName = useMemo(
() =>
new Map(
ingredients.map((ingredient) => [ingredient.name.toLowerCase(), ingredient.type]),
),
[ingredients],
);

const menuDishes = useMemo<MenuDishOption[]>(() => {
const getCategory = (dish: DishResponse): MenuCategory => {
const types = new Set<IngredientType>(
dish.ingredientNames
.map((ingredientName) => ingredientTypeByName.get(ingredientName.toLowerCase()))
.filter((type): type is IngredientType => Boolean(type)),
);

if (types.has("MEAT")) return "MEAT";
if (types.has("FISH")) return "FISH";
return "VEGETABLES";
};

return dishes.map((dish) => ({
name: dish.name,
category: getCategory(dish),
}));
}, [dishes, ingredientTypeByName]);

const getDishValidationError = (
dishName: string | undefined,
expectedCategory: MenuCategory,
) => {
if (!dishName) return null;

const dish = menuDishes.find((item) => item.name.toLowerCase() === dishName.toLowerCase());
if (!dish) {
return `Dish "${dishName}" does not exist`;
}

if (dish.category !== expectedCategory) {
return `Dish "${dish.name}" must be selected as ${expectedCategory.toLowerCase()}`;
}

return null;
};

const validateMenuPayload = (values: DailyMenuRequest) => {
if (!menuDishes.length || !ingredients.length) {
return "Menu validation data is still loading";
}

if (!values.meatDishName && !values.fishDishName && !values.vegetarianDishName) {
return "Select at least one dish before saving.";
}

return (
getDishValidationError(values.meatDishName, "MEAT") ||
getDishValidationError(values.fishDishName, "FISH") ||
getDishValidationError(values.vegetarianDishName, "VEGETABLES")
);
};

const handleCreate = async (values: DailyMenuRequest) => {
try {
const error = validateMenuPayload(values);
if (error) {
setError(error);
return;
}

const response = await createMenuService(values);
setMenus((prev) => [...prev, response]);
setError(null);
} catch (e) {
setError("Failed to create menu");
}
};

const handleUpdate = async (id: string, values: DailyMenuRequest) => {
try {
const error = validateMenuPayload(values);
if (error) {
setError(error);
return;
}

const updatedMenu = await updateMenuService(id, values);
setMenus((current: DailyMenuResponse[]) =>
current.map((m) => (m.id === id ? updatedMenu : m)),
);
setError(null);
} catch (e) {
setError("Failed to update menu");
}
};

const handleDelete = async (ids: string[]) => {
try {
await Promise.all(ids.map((id) => deleteMenuService(id)));
setMenus((prev) => prev.filter((m) => !ids.includes(m.id)));
setError(null);
} catch (e) {
setError("Failed to delete menus");
}
};

return (
<div className="space-y-8">
{(loading || error) && (
<div className="rounded-2xl border border-ui-border bg-(--input-bg) px-4 py-3 text-sm text-main-text">
{loading && <span>Loading menus...</span>}
{error && (
<span className={loading ? "ml-3 text-red-500" : "text-red-500"}>
{error}
</span>
)}
</div>
)}

<CentralizedList
data={menus}
model={MenuModel}
sortFields={["date"]}
defaultSortField="date"
searchFields={["date", "meatDishName", "fishDishName", "vegetarianDishName"]}
renderCreateModal={(onClose) => (
<MenuCreateModal
availableDishes={menuDishes}
validateMenuPayload={validateMenuPayload}
onSubmit={(values: DailyMenuRequest) => {
handleCreate(values);
onClose();
}}
onClose={onClose}
/>
)}
renderEditModal={(item, onClose) => (
<MenuEditModal
availableDishes={menuDishes}
validateMenuPayload={validateMenuPayload}
initialValues={{
date: item.date,
meatDishName: item.meatDishName,
fishDishName: item.fishDishName,
vegetarianDishName: item.vegetarianDishName,
}}
onSubmit={(values: DailyMenuRequest) => {
handleUpdate(item.id, values);
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

export default MenusManager;
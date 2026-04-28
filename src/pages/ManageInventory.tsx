import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IngredientsManager from "../components/IngredientsManager";
 import DishesManager from "../components/DishesManager";
// import WeeklyMenu from "../components/WeeklyMenu";

const sections = ["ingredients", "dishes", "menu"] as const;
type ManageInventorySection = (typeof sections)[number];

const isManageInventorySection = (
  value: string | undefined,
): value is ManageInventorySection =>
  typeof value === "string" &&
  sections.includes(value as ManageInventorySection);

const ManageInventory = () => {
  const { section } = useParams();
  const navigate = useNavigate();

  const activeSection: ManageInventorySection = isManageInventorySection(
    section,
  )
    ? section
    : "ingredients";

  useEffect(() => {
    document.title = "Manage Inventory - Snack Manager";

    if (!isManageInventorySection(section)) {
      navigate("/manage-inventory/ingredients", { replace: true });
    }
  }, [navigate, section]);

  const buttonClass = (value: ManageInventorySection) =>
    `flex-1 px-4 py-3 text-sm font-semibold transition ${
      activeSection === value
        ? "bg-brand text-white"
        : "bg-(--input-bg) text-main-text hover:text-brand"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="rounded-full border border-ui-border bg-main-bg/90 p-1 shadow-[0px_0px_10px_0px] shadow-black/10 dark:shadow-black/30">
          <div className="flex overflow-hidden rounded-full">
            <button
              type="button"
              onClick={() => navigate("/manage-inventory/ingredients")}
              className={buttonClass("ingredients")}
            >
              Ingredients
            </button>
            <button
              type="button"
              onClick={() => navigate("/manage-inventory/dishes")}
              className={buttonClass("dishes")}
            >
              Dishes
            </button>
            <button
              type="button"
              onClick={() => navigate("/manage-inventory/menu")}
              className={buttonClass("menu")}
            >
              Menu
            </button>
          </div>
        </section>

        {activeSection === "ingredients" && <IngredientsManager />}
         {activeSection === "dishes" && <DishesManager />}
        {/*{activeSection === "menu" && <WeeklyMenu />} */}
      </div>
    </div>
  );
};

export default ManageInventory;

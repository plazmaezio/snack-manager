import { useEffect, useState } from "react";
import { api } from "../../../shared/services/api";
import DailyMenuDish from "./DailyMenuDish";
import { useCart } from "../../cart/contexts/CartContext";
import type { DishResponse } from "../../inventory/types";
import type { DailyMenuResponse } from "../types";
import { Link } from "react-router-dom";

interface DailyMenuProps {
  day: string;
  date: Date;
  isPast: boolean;
  isToday: boolean;
  dishes: DishResponse[];
}

// no mock data — rely on API-provided menus and dishes

const DailyMenuContainer = ({
  day,
  date,
  isPast,
  isToday,
  dishes,
}: DailyMenuProps) => {
  const [menu, setMenu] = useState<DailyMenuResponse | null>(null);
  const { addDish } = useCart();

  // use only real dishes
  const allDishes = [...dishes];
  const getDish = (name?: string) =>
    allDishes.find((d) => d.name === name) ?? null;

  useEffect(() => {
    const formatted = date.toISOString().split("T")[0];

    api
      .get<DailyMenuResponse>(`/menus/by-date/${formatted}`)
      .then((response) => {
        setMenu(response);
      })
      .catch((error) => {
        if (error.status === 404) {
              setMenu(null);
            } else {
          console.error("Error fetching menu:", error);
        }
      });
  }, [date]);

  const meatDish = getDish(menu?.meatDishName);
  const fishDish = getDish(menu?.fishDishName);
  const vegetarianDish = getDish(menu?.vegetarianDishName);

  // whole-menu add and menu total removed — per-dish adds are available

  return (
    <div
      className={`${isPast ? "opacity-50" : ""} pl-3`}
      style={{ borderLeft: `4px solid var(--color-brand, #3b82f6)` }}
    >
      <h4
        className={`text-lg font-medium mb-2 ${isToday ? "text-brand font-bold" : ""}`}
      >
        {day}
        <br />
        <span className="text-sm font-normal opacity-70">
          (
          {date.toLocaleDateString("en-US", { day: "numeric", month: "short" })}
          )
        </span>
      </h4>

      {/* Today's Dishes */}
      {menu ? (
        <div className="space-y-2">
          {meatDish && (
            <div className="flex items-center justify-between">
              <Link to={`/menu/${meatDish.id}`} className="block hover:underline flex-1">
                <DailyMenuDish dish={meatDish} />
              </Link>
              {isToday && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addDish(meatDish);
                  }}
                  aria-label={`Add ${meatDish.name} to cart`}
                  className="ml-2 p-2 rounded hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <circle cx="7" cy="19" r="2" />
                    <circle cx="17" cy="19" r="2" />
                  </svg>
                </button>
              )}
            </div>
          )}
          {fishDish && (
            <div className="flex items-center justify-between">
              <Link to={`/menu/${fishDish.id}`} className="block hover:underline flex-1">
                <DailyMenuDish dish={fishDish} />
              </Link>
              {isToday && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addDish(fishDish);
                  }}
                  aria-label={`Add ${fishDish.name} to cart`}
                  className="ml-2 p-2 rounded hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <circle cx="7" cy="19" r="2" />
                    <circle cx="17" cy="19" r="2" />
                  </svg>
                </button>
              )}
            </div>
          )}
          {vegetarianDish && (
            <div className="flex items-center justify-between">
              <Link to={`/menu/${vegetarianDish.id}`} className="block hover:underline flex-1">
                <DailyMenuDish dish={vegetarianDish} />
              </Link>
              {isToday && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addDish(vegetarianDish);
                  }}
                  aria-label={`Add ${vegetarianDish.name} to cart`}
                  className="ml-2 p-2 rounded hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <circle cx="7" cy="19" r="2" />
                    <circle cx="17" cy="19" r="2" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Menu total removed */}
        </div>
      ) : (
        <p className="text-sm opacity-50">No menu available for this day</p>
      )}

      {/* whole-menu Add to Cart removed */}
    </div>
  );
};

export default DailyMenuContainer;

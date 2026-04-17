import { useEffect, useState } from "react";
import type { DailyMenuResponse, DishResponse } from "../types";
import { api } from "../services/api";
import DailyMenuDish from "./DailyMenuDish";
import { MENU_DISCOUNT } from "../config/dailyMenu";

interface DailyMenuProps {
  day: string;
  date: Date;
  isPast: boolean;
  isToday: boolean;
  dishes: DishResponse[];
}

// to do: mock data, so delete when api is ready
const mockMenu: DailyMenuResponse = {
  id: "1",
  date: "",
  meatDishName: "Grilled Chicken",
  fishDishName: "Baked Salmon",
  vegetarianDishName: "Veggie Stir-fry",
};
// mock: delete when api is ready
const mockDishes: DishResponse[] = [
  {
    id: "1",
    name: "Grilled Chicken",
    ingredientNames: ["Chicken", "Garlic", "Lemon"],
    price: 8.99,
    imageUrl: "",
  },
  {
    id: "2",
    name: "Baked Salmon",
    ingredientNames: ["Salmon", "Lemon", "Herbs"],
    price: 12.99,
    imageUrl: "",
  },
  {
    id: "3",
    name: "Veggie Stir-fry",
    ingredientNames: ["Bell Peppers", "Broccoli", "Tofu"],
    price: 7.99,
    imageUrl: "",
  },
];

const DailyMenuContainer = ({
  day,
  date,
  isPast,
  isToday,
  dishes,
}: DailyMenuProps) => {
  const [menu, setMenu] = useState<DailyMenuResponse | null>(mockMenu);

  // merge real dishes with mocks, getDish looks in both
  const allDishes = [...dishes, ...mockDishes];
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
          // to do: when api return something, change to setMenu(null)
          setMenu(mockMenu);
        } else {
          console.error("Error fetching menu:", error);
        }
      });
  }, [date]);

  const meatDish = getDish(menu?.meatDishName);
  const fishDish = getDish(menu?.fishDishName);
  const vegetarianDish = getDish(menu?.vegetarianDishName);

  const calculateMenuPrice = (): number => {
    let price = 0;
    if (meatDish && meatDish.price >= 0) {
      price += meatDish.price;
    }

    if (fishDish && fishDish.price >= 0) {
      price += fishDish.price;
    }

    if (vegetarianDish && vegetarianDish.price >= 0) {
      price += vegetarianDish.price;
    }

    return Number((price * MENU_DISCOUNT).toFixed(2));
  };

  return (
    <div className={`${isPast ? "opacity-50" : ""}`}>
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
          {meatDish && <DailyMenuDish dish={meatDish} />}
          {fishDish && <DailyMenuDish dish={fishDish} />}
          {vegetarianDish && <DailyMenuDish dish={vegetarianDish} />}

          <p className="text-sm font-semibold mt-2">
            Menu total:{" "}
            <span className="text-brand">${calculateMenuPrice()}</span>
          </p>
        </div>
      ) : (
        <p className="text-sm opacity-50">No menu available for this day</p>
      )}

      {/* Add to cart button */}
      {isToday && (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default DailyMenuContainer;

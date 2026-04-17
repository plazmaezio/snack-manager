import type { DishResponse } from "../types";
import { MENU_DISCOUNT } from "../config/dailyMenu";

interface DailyMenuDishProps {
  dish: DishResponse;
}

const DailyMenuDish = ({ dish }: DailyMenuDishProps) => {
  const discountedPrice = (dish.price * MENU_DISCOUNT).toFixed(2);

  return (
    <div>
      <h5>{dish.name}</h5>
      <p>
        <span className="line-through opacity-50 text-sm">
          ${dish.price.toFixed(2)}
        </span>{" "}
        <span className="text-brand font-semibold">${discountedPrice}</span>
      </p>
    </div>
  );
};

export default DailyMenuDish;

import type { DishResponse } from "../../inventory/types";

interface DailyMenuDishProps {
  dish: DishResponse;
}

const DailyMenuDish = ({ dish }: DailyMenuDishProps) => {
  return (
    <div>
      <h5>{dish.name}</h5>
      <p>
        <span className="text-brand font-semibold">€{dish.price.toFixed(2)}</span>
      </p>
    </div>
  );
};

export default DailyMenuDish;

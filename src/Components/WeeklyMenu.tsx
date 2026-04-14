import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { DishResponse } from "../types";
import DailyMenuContainer from "./DailyMenuContainer";

const WeeklyMenu = () => {
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayIndex = DAYS.indexOf(today);
  const [dishes, setDishes] = useState<DishResponse[]>([]);

  useEffect(() => {
    api.get<DishResponse[]>("/dishes").then(setDishes);
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Weekly Menu</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6">
        {DAYS.map((day, index) => {
          const date = new Date();
          date.setDate(date.getDate() + (index - todayIndex)); // offset from today

          return (
            <DailyMenuContainer
              key={day}
              day={day}
              date={date}
              isPast={index < todayIndex}
              isToday={day === today}
              dishes={dishes}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyMenu;

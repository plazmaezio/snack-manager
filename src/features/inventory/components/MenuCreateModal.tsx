import { useState, type FormEvent } from "react";
import type { DailyMenuRequest } from "../../menu/types/menu.types.ts";
import { formatName } from "../../../shared/utils/nameFormatting.ts";

type MenuCreateModalProps = {
  onSubmit: (values: DailyMenuRequest) => void;
  onClose: () => void;
};

export const MenuCreateModal = ({ onSubmit, onClose }: MenuCreateModalProps) => {
  const [date, setDate] = useState("");
  const [meatDishName, setMeatDishName] = useState("");
  const [fishDishName, setFishDishName] = useState("");
  const [vegetarianDishName, setVegetarianDishName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const payload: DailyMenuRequest = {
      date,
      meatDishName: meatDishName ? formatName(meatDishName) : undefined,
      fishDishName: fishDishName ? formatName(fishDishName) : undefined,
      vegetarianDishName: vegetarianDishName ? formatName(vegetarianDishName) : undefined,
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-main-bg/70 px-4 py-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-ui-border bg-main-bg p-5 text-left shadow-xl"
      >
        <h2 className="mb-2 text-2xl font-semibold text-heading">Create menu</h2>

        <div className="flex-1 overflow-y-auto scrollbar-themed pr-1">
          <label className="mb-1 block font-medium text-main-text">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label className="mb-1 block font-medium text-main-text">Meat dish name</label>
          <input
            type="text"
            value={meatDishName}
            onChange={(e) => setMeatDishName(e.target.value)}
            placeholder="Optional"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label className="mb-1 block font-medium text-main-text">Fish dish name</label>
          <input
            type="text"
            value={fishDishName}
            onChange={(e) => setFishDishName(e.target.value)}
            placeholder="Optional"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />

          <label className="mb-1 block font-medium text-main-text">Vegetarian dish name</label>
          <input
            type="text"
            value={vegetarianDishName}
            onChange={(e) => setVegetarianDishName(e.target.value)}
            placeholder="Optional"
            className="mb-4 w-full rounded-full border border-ui-border bg-(--input-bg) px-4 py-2.5 text-main-text outline-none transition focus:border-brand"
          />
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

import { useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../../types/cart.types";
import type { IngredientResponse, DishResponse } from "../../types";
import {
  getItemKey,
  getItemName,
  getItemPrice,
  getMenuDishNames,
  getMenuDishIds,
} from "../../types/cart.helpers";
import AllergenBadges from "./AllergenBadges";
import IngredientList from "./IngredientList";

interface CartItemCardProps {
  item: CartItem;
  dishes: DishResponse[];
  resolveIngredients: (names: string[]) => IngredientResponse[];
  getDishByName: (name: string) => DishResponse | undefined;
  separateIngredientsByAllergen: (ingredients: IngredientResponse[]) => {
    withAllergens: IngredientResponse[];
    withoutAllergens: IngredientResponse[];
  };
  menuIngredients: IngredientResponse[];
  loadingIngredients: boolean;
  isUpdating: boolean;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
  displayQuantity: number;
}

const CartItemCard = ({
  item,
  dishes,
  resolveIngredients,
  separateIngredientsByAllergen,
  menuIngredients,
  loadingIngredients,
  isUpdating,
  onRemove,
  onQuantityChange,
  displayQuantity,
}: CartItemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const key = getItemKey(item);
  const menuDishNames = getMenuDishNames(item);
  const resolvedIngredients =
    item.type === "dish" ? resolveIngredients(item.dish.ingredientNames) : [];

  return (
    <div className="bg-main-bg border border-ui-border rounded-lg overflow-hidden hover:border-brand transition-colors">
      {/* Header */}
      <div className="p-4 flex gap-4 items-start">
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="shrink-0 text-brand hover:opacity-80 transition-opacity pt-1"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold">
            {item.type === "dish" ? (
              <Link
                to={`/menu/${item.dish.id}`}
                className="hover:underline transition-colors"
              >
                {getItemName(item)}
              </Link>
            ) : (
              getItemName(item)
            )}
          </h3>

          {item.type === "dish" && !loadingIngredients && (
            <AllergenBadges ingredients={resolvedIngredients} />
          )}

          {item.type === "menu" && (
            <div>
              <p className="text-xs text-main-text mt-1 opacity-70 mb-1">
                {getMenuDishIds(item, dishes).map(({ name, id }, idx, arr) => (
                  <span key={id}>
                    <Link
                      to={`/menu/${id}`}
                      className="hover:underline transition-colors"
                    >
                      {name}
                    </Link>
                    {idx < arr.length - 1 && " · "}
                  </span>
                ))}
              </p>
              {!loadingIngredients && (
                <AllergenBadges ingredients={menuIngredients} />
              )}
            </div>
          )}

          <p className="text-lg font-bold text-brand mt-2">
            {getItemPrice(item).toFixed(2)}€ each
          </p>
        </div>

        {/* Quantity + remove */}
        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => onRemove(key)}
            className="p-2 rounded transition-colors text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 rounded-md bg-form-bg">
            <button
              onClick={() => onQuantityChange(key, displayQuantity - 1)}
              disabled={displayQuantity <= 1}
              className="p-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded hover:bg-brand/20 hover:text-brand"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-sm min-w-10 text-center text-brand">
              {displayQuantity}
            </span>
            <button
              onClick={() => onQuantityChange(key, displayQuantity + 1)}
              className="p-1 transition-all rounded hover:bg-brand/20 hover:text-brand"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 ml-9 space-y-3 border-t border-ui-border pt-3">
          {item.type === "dish" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-brand opacity-80">
                Ingredients
              </p>
              {loadingIngredients ? (
                <div className="flex items-center gap-2 text-xs opacity-50">
                  <Loader className="w-3 h-3 animate-spin" /> Loading...
                </div>
              ) : (
                <IngredientList ingredients={resolvedIngredients} />
              )}
            </div>
          )}

          {item.type === "menu" && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-brand opacity-80">
                Includes
              </p>
              <ul className="space-y-3">
                {menuDishNames.map((dishName) => {
                  const dish = dishes.find(
                    (d) => d.name.toLowerCase() === dishName.toLowerCase(),
                  );
                  const dishIngredients = dish
                    ? resolveIngredients(dish.ingredientNames)
                    : [];
                  const { withAllergens, withoutAllergens } =
                    separateIngredientsByAllergen(dishIngredients);

                  return (
                    <li
                      key={dishName}
                      className="space-y-1.5 border-l-2 border-brand pl-3"
                    >
                      {dish ? (
                        <Link
                          to={`/menu/${dish?.id}`}
                          className="hover:underline transition-colors text-heading font-medium"
                        >
                          {dishName}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium text-heading">
                          {dishName}
                        </p>
                      )}

                      {dish &&
                        dishIngredients.length === 0 &&
                        !loadingIngredients && (
                          <p className="text-xs text-main-text opacity-50">
                            No ingredient info available
                          </p>
                        )}

                      {withAllergens.length > 0 && (
                        <IngredientList ingredients={withAllergens} />
                      )}

                      {withoutAllergens.length > 0 && (
                        <IngredientList ingredients={withoutAllergens} />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Subtotal */}
      <div className="px-4 py-3 border-t border-ui-border text-right bg-form-bg">
        <p className="text-sm flex items-center justify-end gap-2 text-main-text">
          Subtotal:{" "}
          <span className="font-bold text-brand">
            {(getItemPrice(item) * item.quantity).toFixed(2)}€
          </span>
          {isUpdating && <Loader className="w-3 h-3 animate-spin text-brand" />}
        </p>
      </div>
    </div>
  );
};

export default CartItemCard;

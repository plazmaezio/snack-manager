import {
  ingredientAllergenOptions,
  type IngredientResponse,
} from "../../types";

interface IngredientListProps {
  ingredients: IngredientResponse[];
}

const IngredientList = ({ ingredients }: IngredientListProps) => (
  <ul className="space-y-1 mt-2">
    {ingredients.map((ingredient) => {
      const hasAllergen = ingredient.allergen !== "NONE";
      return (
        <li key={ingredient.id} className="text-xs flex items-center gap-1.5">
          {hasAllergen && <span className="font-bold text-yellow-600">!</span>}
          <span className="text-main-text">
            {ingredient.name}
            {hasAllergen && (
              <span className="text-yellow-700">
                {" "}
                ({ingredientAllergenOptions[ingredient.allergen]})
              </span>
            )}
          </span>
        </li>
      );
    })}
  </ul>
);

export default IngredientList;

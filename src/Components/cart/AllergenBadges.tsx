import {
  ingredientAllergenOptions,
  type IngredientResponse,
} from "../../types";

interface AllergenBadgesProps {
  ingredients: IngredientResponse[];
}

const AllergenBadges = ({ ingredients }: AllergenBadgesProps) => {
  const allergens = ingredients
    .filter((i) => i.allergen !== "NONE")
    .map((i) => ingredientAllergenOptions[i.allergen]);

  if (allergens.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-1">
      <span className="text-xs text-brand font-semibold uppercase tracking-wide">
        Allergens:
      </span>
      <ul className="space-y-1">
        {allergens.map((a) => (
          <li
            key={a}
            className="text-xs pl-3 border-l-2 border-yellow-500 text-yellow-700"
          >
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllergenBadges;

import { useNavigate } from "react-router-dom";
import type { DishResponse } from "../../inventory/types";

interface DishCardProps {
  dish: DishResponse;
  imageUrl: string;
}

const DishCard = ({ dish, imageUrl }: DishCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/menu/${dish.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer transform transition-all duration-300 hover:scale-105 group"
    >
      <div className="bg-form-bg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Dish Image */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-linear-to-br from-accent-bg to-form-bg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-accent opacity-30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Dish Info */}
        <div className="p-4 flex flex-col grow">
          {/* Name */}
          <h3 className="text-lg sm:text-xl font-bold text-heading mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {dish.name}
          </h3>

          {/* Ingredients Preview */}
          <div className="mb-4 grow">
            <p className="text-xs sm:text-sm text-main-text opacity-75 mb-2">
              Ingredients:
            </p>
            <div className="flex flex-wrap gap-1">
              {dish.ingredientNames.slice(0, 3).map((ingredient, idx) => (
                <span
                  key={idx}
                  className="inline-block px-2 py-1 text-xs rounded-full bg-accent-bg text-accent border border-accent-border"
                >
                  {ingredient}
                </span>
              ))}
              {dish.ingredientNames.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-accent-bg text-accent border border-accent-border">
                  +{dish.ingredientNames.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-ui-border">
            <span className="text-xl sm:text-2xl font-bold text-accent">
              €{dish.price.toFixed(2)}
            </span>
            <button className="px-3 py-2 sm:px-4 sm:py-2 bg-accent text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { DishResponse } from "../../inventory/types";
import { fetchDishesService } from "../../../shared/services/dishService";

const DishDetail = () => {
  const { dishId } = useParams<{ dishId: string }>();
  const navigate = useNavigate();
  const [dish, setDish] = useState<DishResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Dish Details - Snack Manager";
  }, []);

  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        const dishes = await fetchDishesService();
        const foundDish = dishes.find((d) => d.id === dishId);

        if (!foundDish) {
          setError("Dish not found");
          return;
        }

        setDish(foundDish);
      } catch (err) {
        setError("Failed to load dish details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [dishId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
        <div className="animate-pulse">
          <div className="h-96 bg-form-bg rounded-lg mb-6"></div>
          <div className="h-8 bg-form-bg rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-form-bg rounded w-1/3 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-form-bg rounded w-full"></div>
            <div className="h-4 bg-form-bg rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error || "Dish not found"}</p>
        </div>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 min-h-[calc(100vh-80px)]">
      {/* Back Button */}
      <button
        onClick={() => navigate("/menu")}
        className="mb-6 flex items-center gap-2 text-accent hover:opacity-75 transition-opacity font-semibold"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Menu
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dish Image */}
        <div className="flex items-center justify-center">
          <div className="w-full aspect-square rounded-lg overflow-hidden bg-linear-to-br from-accent-bg to-form-bg shadow-lg">
            {dish.imageUrl ? (
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-accent opacity-30"
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
        </div>

        {/* Dish Details */}
        <div className="flex flex-col justify-between">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-3">
              {dish.name}
            </h1>
            <p className="text-3xl font-bold text-accent">
              €{dish.price.toFixed(2)}
            </p>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-heading mb-4">
              Ingredients
            </h2>
            <div className="space-y-2">
              {dish.ingredientNames.map((ingredient, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-accent-bg rounded-lg border border-accent-border"
                >
                  <svg
                    className="w-5 h-5 text-accent shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-heading font-medium">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
              Add to Cart
            </button>
            <button className="px-6 py-3 bg-form-bg border border-ui-border text-heading rounded-lg font-bold hover:bg-accent-bg transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;

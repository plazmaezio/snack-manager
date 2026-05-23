import type { DishResponse } from "../../inventory/types";
import DishCard from "../components/DishCard";

interface MenuGridProps {
  loading: boolean;
  error: string | null;
  filteredDishes: DishResponse[];
  totalDishesCount: number;
  hasActiveFilters: boolean;
  imageUrls: Record<string, string>;
  onClearFilters: () => void;
}

const MenuGrid = ({
  loading,
  error,
  filteredDishes,
  totalDishesCount,
  hasActiveFilters,
  imageUrls,
  onClearFilters,
}: MenuGridProps) => {
  // 1. Loading Skeleton Layout State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-56 bg-form-bg rounded-lg mb-4"></div>
            <div className="h-6 bg-form-bg rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-form-bg rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Exception / API Error State
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  // 3. No Results / Empty State
  if (filteredDishes.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-16 h-16 mx-auto text-main-text opacity-30 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-2xl font-bold text-heading mb-2">
          No dishes found
        </h3>
        <p className="text-main-text mb-6">
          {hasActiveFilters
            ? "Try adjusting your search query or loosening your filters."
            : "Come back later for more delicious options!"}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  // 4. Content Content-Ready Delivery View State
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDishes.map((dish) => {
          const fallbackUrl = imageUrls[dish.id] || dish.imageUrl || "";
          return <DishCard key={dish.id} dish={dish} imageUrl={fallbackUrl} />;
        })}
      </div>

      <div className="mt-8 text-center text-main-text text-sm">
        Showing <strong>{filteredDishes.length}</strong> of{" "}
        <strong>{totalDishesCount}</strong> dishes
      </div>
    </>
  );
};

export default MenuGrid;

import { useState } from "react";

interface MenuFiltersProps {
  selectedAllergens: string[];
  selectedTypes: string[];
  onToggleAllergen: (allergen: string) => void;
  onToggleType: (type: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  allergenOptions: Record<string, string>;
  typeOptions: Record<string, string>;
}

const MenuFilters = ({
  selectedAllergens,
  selectedTypes,
  onToggleAllergen,
  onToggleType,
  onClearFilters,
  hasActiveFilters,
  allergenOptions,
  typeOptions,
}: MenuFiltersProps) => {
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);
  const [showTypeFilter, setShowTypeFilter] = useState(false);

  return (
    <div className="mb-6">
      {/* Buttons Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Exclude Allergens Trigger */}
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={() => {
              setShowAllergenFilter(!showAllergenFilter);
              setShowTypeFilter(false);
            }}
            className={`w-full sm:w-auto px-4 py-2 border rounded-lg font-semibold transition-colors flex items-center justify-center sm:justify-start gap-2 ${
              selectedAllergens.length > 0
                ? "bg-amber-50 border-amber-300 text-amber-800"
                : "bg-form-bg border-ui-border text-heading hover:bg-accent-bg"
            }`}
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Exclude Allergens{" "}
            {selectedAllergens.length > 0 && `(${selectedAllergens.length})`}
          </button>

          {showAllergenFilter && (
            <div className="absolute top-full left-0 mt-2 bg-form-bg border border-ui-border rounded-lg shadow-lg p-4 w-64 z-20 sm:w-72">
              <div className="text-xs font-semibold text-main-text uppercase tracking-wider mb-2">
                Hide dishes containing:
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {Object.entries(allergenOptions)
                  .filter(([key]) => key !== "NONE")
                  .map(([key, value]) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 p-2 hover:bg-red-50/50 rounded cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAllergens.includes(key)}
                        onChange={() => onToggleAllergen(key)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-heading text-sm group-hover:text-red-700">
                        {value}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter by Category Trigger */}
        <div className="relative flex-1 sm:flex-none">
          <button
            onClick={() => {
              setShowTypeFilter(!showTypeFilter);
              setShowAllergenFilter(false);
            }}
            className={`w-full sm:w-auto px-4 py-2 border rounded-lg font-semibold transition-colors flex items-center justify-center sm:justify-start gap-2 ${
              selectedTypes.length > 0
                ? "bg-blue-50 border-blue-300 text-blue-800"
                : "bg-form-bg border-ui-border text-heading hover:bg-accent-bg"
            }`}
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter by Category{" "}
            {selectedTypes.length > 0 && `(${selectedTypes.length})`}
          </button>

          {showTypeFilter && (
            <div className="absolute top-full left-0 mt-2 bg-form-bg border border-ui-border rounded-lg shadow-lg p-4 w-64 z-20 sm:w-72">
              <div className="text-xs font-semibold text-main-text uppercase tracking-wider mb-2">
                Show categories:
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {Object.entries(typeOptions).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-2 hover:bg-blue-50/50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(key)}
                      onChange={() => onToggleType(key)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-heading text-sm">{value}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors flex items-center justify-center gap-2"
          >
            Reset All
          </button>
        )}
      </div>

      {/* Active Rules Badges Grid */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-main-text uppercase mr-1">
            Active Rules:
          </span>

          {selectedAllergens.map((allergen) => (
            <div
              key={allergen}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-sm text-amber-800"
            >
              <span className="font-medium">
                No {allergenOptions[allergen]}
              </span>
              <button
                onClick={() => onToggleAllergen(allergen)}
                className="text-amber-500 hover:text-amber-800 font-bold ml-1 text-base leading-none"
              >
                &times;
              </button>
            </div>
          ))}

          {selectedTypes.map((type) => (
            <div
              key={type}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-800"
            >
              <span className="font-medium">{typeOptions[type]}</span>
              <button
                onClick={() => onToggleType(type)}
                className="text-blue-500 hover:text-blue-800 font-bold ml-1 text-base leading-none"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuFilters;

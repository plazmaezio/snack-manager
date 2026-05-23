interface MenuSearchProps {
  value: string;
  onChange: (val: string) => void;
}

const MenuSearch = ({ value, onChange }: MenuSearchProps) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-main-text opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search dishes..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 sm:py-4 bg-form-bg border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all text-heading placeholder-main-text"
        />
      </div>
    </div>
  );
};

export default MenuSearch;

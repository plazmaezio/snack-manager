import { Link } from "react-router-dom";

const MenuHeader = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-heading mb-2">
          Menu
        </h1>
        <p className="text-main-text">
          Explore our delicious selection of snacks and meals
        </p>
      </div>

      <div className="mb-4 relative z-10">
        <Link
          to="/"
          className="text-sm sm:text-base font-semibold text-brand underline hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            View Today's Daily Menu
            <svg
              className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </Link>
      </div>
    </>
  );
};

export default MenuHeader;

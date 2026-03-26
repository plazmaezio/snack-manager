import StarRating from "./StarRating";

const SnackItem = ({ name, rating }: { name: string; rating: number }) => {
  return (
    <div className="flex flex-col p-4 border border-(--border) rounded-xl min-h-45 w-full max-w-75 mx-auto bg-(--bg) transition-all hover:shadow-md">
      {/* Image/Icon Area */}
      <div className="flex-1 flex items-center justify-center text-4xl mb-4">
        {/* TODO: Replace with actual image or icon */}
        🍪
      </div>

      {/*The Bottom Container */}
      <div className="mt-auto flex flex-col items-center gap-2">
        {/* The Name: Responsive sizing and clamping */}
        <h2
          className="text-lg font-bold text-(--text-h) text-center 
                       leading-tight line-clamp-2 overflow-hidden
                       md:text-xl sm:text-base"
        >
          {name}
        </h2>

        {/* The Star Rating */}
        <StarRating rating={rating} />
      </div>
    </div>
  );
};

export default SnackItem;

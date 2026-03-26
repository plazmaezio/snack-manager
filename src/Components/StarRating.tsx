import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
}

const StarRating = ({ rating }: StarRatingProps) => {
  const percentage = (rating / 5) * 100;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative inline-block">
        {/* Background Stars (Empty) */}
        <div className="flex text-(--border)">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="currentColor" stroke="none" />
          ))}
        </div>

        {/* Foreground Stars (Filled) - Clipped by percentage */}
        <div
          className="absolute top-0 left-0 flex text-yellow-400 overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              fill="currentColor"
              stroke="none"
              className="shrink-0"
            />
          ))}
        </div>
      </div>

      {/* The numeric value under the stars */}
      <span className="text-xs font-mono text-(--text)">
        {rating % 1 === 0 ? rating.toFixed(1) : Number(rating.toString())}
      </span>
    </div>
  );
};

export default StarRating;

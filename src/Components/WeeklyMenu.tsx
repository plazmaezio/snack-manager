import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import type { DishResponse } from "../types";
import DailyMenuContainer from "./DailyMenuContainer";

const WeeklyMenu = () => {
  const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayIndex = DAYS.indexOf(today);
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(todayIndex);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    api.get<DishResponse[]>("/dishes").then(setDishes);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth =
        carousel.querySelector(".carousel-item")?.clientWidth || 240;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.max(0, Math.min(newIndex, DAYS.length - 1)));

      // Check if we can scroll left/right
      setCanScrollLeft(scrollLeft > 0);
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      setCanScrollRight(scrollLeft < maxScroll - 10);
    };

    carousel.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-scroll to current day on mount
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Give DOM time to render items
    const timer = setTimeout(() => {
      const itemWidth =
        carousel.querySelector(".carousel-item")?.clientWidth || 240;
      const gap = 24; // gap between items (1.5rem = 24px)
      const isDesktop = window.innerWidth >= 768;

      let scrollTarget = todayIndex * (itemWidth + gap);

      // On desktop, position current day in left-center area to avoid right edge cutoff
      if (isDesktop) {
        const visibleItems = Math.floor(
          carousel.clientWidth / (itemWidth + gap),
        );
        const offsetItems = Math.max(0, Math.min(1, visibleItems - 2));
        scrollTarget = Math.max(
          0,
          scrollTarget - offsetItems * (itemWidth + gap),
        );
      }

      carousel.scrollLeft = scrollTarget;
    }, 100);

    return () => clearTimeout(timer);
  }, [todayIndex]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Weekly Menu</h3>

      <div className="carousel-wrapper">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="carousel-arrow carousel-arrow-left"
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Carousel Container */}
        <div className="carousel-container" ref={carouselRef}>
          <div className="carousel-track">
            {DAYS.map((day, index) => {
              const date = new Date();
              date.setDate(date.getDate() + (index - todayIndex)); // offset from today

              return (
                <div key={day} className="carousel-item">
                  <DailyMenuContainer
                    day={day}
                    date={date}
                    isPast={index < todayIndex}
                    isToday={day === today}
                    dishes={dishes}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="carousel-arrow carousel-arrow-right"
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Scroll Indicators (Mobile) */}
      <div className="carousel-indicators">
        {DAYS.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === activeIndex ? "active" : ""}`}
            onClick={() => {
              if (carouselRef.current) {
                const itemWidth =
                  carouselRef.current.querySelector(".carousel-item")
                    ?.clientWidth || 240;
                carouselRef.current.scrollTo({
                  left: itemWidth * index,
                  behavior: "smooth",
                });
              }
            }}
            aria-label={`Go to ${DAYS[index]}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WeeklyMenu;

import { useEffect } from "react";
import WeeklyMenu from "./components/WeeklyMenu";

const Home = () => {
  useEffect(() => {
    document.title = "Snack Manager";
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <main>
        {/* Slogan */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Snack bar</h1>
          <h2 className="text-2xl font-semibold opacity-80">
            The best snack bar in town
          </h2>
        </div>

        <hr className="mb-6" />

        <WeeklyMenu />
      </main>
    </div>
  );
};

export default Home;

import { useEffect } from "react";
import WeeklyMenu from "../components/WeeklyMenu";

const Home = () => {
  useEffect(() => {
    document.title = "Snack Manager";
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <main className="mb-10">
        {/* Slogan */}
        <h1 className="text-3xl font-bold mb-2">Snack bar</h1>
        <h2 className="text-2xl font-semibold mb-6 opacity-80">
          The best snack bar in town
        </h2>

        {/* Daily Menu Container (all 7 days) */}
        <WeeklyMenu />
      </main>
    </div>
  );
};

export default Home;

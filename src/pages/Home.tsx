import { useEffect } from "react";
import WeeklyMenu from "../components/WeeklyMenu";
import { Link } from "react-router-dom";

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

        {/* Menu section */}
        <div className="text-center mb-4">
          <Link
            to="/menu"
            className="inline-block text-brand underline hover:opacity-80 transition-opacity text-sm sm:text-base"
          >
            ▶ Click here to see the whole menu ◀
          </Link>
        </div>

        <WeeklyMenu />
      </main>
    </div>
  );
};

export default Home;

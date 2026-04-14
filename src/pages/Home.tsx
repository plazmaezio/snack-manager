import { useEffect } from "react";
import SnackItem from "../components/SnackItem";

const Home = () => {
  useEffect(() => {
    document.title = "Snack Manager";
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <main className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Snack bar</h1>
        <h2 className="text-2xl font-semibold mb-6 opacity-80">
          The best snack bar in town
        </h2>

        <div className="grid max-[450px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <SnackItem name="Pastel de Nata" rating={4.96} />
          <SnackItem name="Bifana" rating={4.2} />
          <SnackItem name="Sumol" rating={4.8} />
          <SnackItem
            name="Very long snack name that exceeds the container width"
            rating={3.5}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;

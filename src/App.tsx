import "./App.css";
import SnackItem from "./components/SnackItem";

const App = () => {
  return (
    <>
      <h1 className="text-3xl font-bold">Snack bar</h1>

      <h2 className="text-2xl font-bold">The best snack bar in town</h2>

      <div className="grid max-[450px]:grid-cols-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        <SnackItem name="Pastel de Nata" rating={4.96} />
        <SnackItem name="Bifana" rating={4.2} />
        <SnackItem name="Sumol" rating={4.8} />
        <SnackItem
          name="Very long snack name that might overflow"
          rating={3.5}
        />
      </div>
    </>
  );
};

export default App;

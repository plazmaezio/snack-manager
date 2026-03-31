import "./App.css";
import Home from "./pages/Home";
import { useTheme } from "./contexts/ThemeContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      {/* Navigation */}
      <header className="flex justify-between items-center mb-10">
        <h1>
          Theme: <span className="text-brand uppercase">{theme}</span>
        </h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-brand text-white rounded-md cursor-pointer"
        >
          Toggle Mode
        </button>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

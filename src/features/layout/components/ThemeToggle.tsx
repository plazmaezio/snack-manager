interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 bg-main-bg border border-ui-border rounded-md hover:border-brand transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

export default ThemeToggle;

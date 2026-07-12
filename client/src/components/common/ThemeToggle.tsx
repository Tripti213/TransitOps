import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex h-8 w-14 items-center rounded-full border border-[var(--border)] bg-[var(--canvas)] px-1 transition-colors"
    >
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] shadow-sm transition-transform duration-200 ease-out"
        style={{ transform: isDark ? "translateX(22px)" : "translateX(0)" }}
      >
        {isDark ? <FiMoon size={13} /> : <FiSun size={13} />}
      </span>
    </button>
  );
}
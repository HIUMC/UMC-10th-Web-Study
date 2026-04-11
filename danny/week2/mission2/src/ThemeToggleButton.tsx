import { useTheme } from "./context/ThemeProvider";
import clsx from "clsx";

export default function ThemeToggleButton() {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={clsx("px-4 py-2 mt-4 rounded-md transition-all", {
        "bg-black text-white": !isLightMode,
        "bg-neutral-300 text-black": isLightMode,
      })}
    >
      {isLightMode ? "🌙 다크 모드" : "🌞 라이트 모드"}
    </button>
  );
}

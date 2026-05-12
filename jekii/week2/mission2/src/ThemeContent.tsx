import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
  const { theme, toggleTheme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;
  return (
    <div
      className={clsx("p-4 h-dvh", isLightMode ? "bg-white" : "bg-gray-800")}
    >
      <h1
        className={clsx(
          "text-wxl font-bold",
          isLightMode ? "text-black" : "text-white",
        )}
      >
        ThemeContent
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Culpa
        voluptatum eum earum inventore ab fugit dolore quaerat saepe mollitia
        amet, perspiciatis consequatur excepturi impedit odio. Laboriosam dicta
        ea eius soluta.
      </p>
    </div>
  );
}

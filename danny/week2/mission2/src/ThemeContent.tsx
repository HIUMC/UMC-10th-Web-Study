import clsx from "clsx";
import { useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
  const { isLightMode } = useTheme();

  return (
    <div
      className={clsx(
        "p-4 h-dvh w-full",
        isLightMode ? "bg-white" : "bg-gray-800",
      )}
    >
      <h1
        className={clsx(
          "text-wxl font-bold",
          isLightMode ? "text-black" : "text-white",
        )}
      >
        Theme Content
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptate
        fugit tenetur iure quae dolorem dignissimos quia quis hic odio
        laudantium, molestias unde laboriosam, et doloribus assumenda
        repellendus corrupti pariatur porro.
      </p>
    </div>
  );
}

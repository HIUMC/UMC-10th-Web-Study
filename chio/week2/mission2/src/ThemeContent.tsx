import clsx from "clsx";
import { THEME, useTheme } from "./context/ThemeProvider";

export default function ThemeContent() {
    const { theme, toggleTheme} = useTheme();

    const isLigtMode = theme=== THEME.LIGHT;

    return <div className={clsx('p-4 h-dvh w-full', isLigtMode ? 'bg-white':'bg-gray-800')}>Themecontet</div>
}
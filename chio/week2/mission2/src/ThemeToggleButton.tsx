import { THEME, useTheme } from "./context/ThemeProvider";
import clsx from 'clsx';

export default function ThemeToggleButton() {
    const {theme, toggleTheme} = useTheme();
    const isLigtMode = theme=== THEME.LIGHT;


    return <button onClick={toggleTheme} className={clsx('px-4 py-2 mt-4 rounded=md transition-all', {
        'bg-black text-white' : !isLigtMode,
        'bg-white text-black': isLigtMode,
    })}>{isLigtMode ? '다크' : '라이트'}</button>
}
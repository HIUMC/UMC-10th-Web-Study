import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';

export default function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        'p-4 h-full min-h-screen',
        isLightMode ? 'bg-white text-black' : 'bg-gray-800 text-white'
      )}
    >
      ThemeContent
    </div>
  );
}
//파일 변경
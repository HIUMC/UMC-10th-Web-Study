import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";

export enum THEME {
  LIGHT = "light",
  DARK = "dark",
}

type TTheme = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT,
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): IThemeContext => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error(
      "useTheme는 반드시 ThemeProvider 내부에서 사용되어야 합니다.",
    );
  }
  return context;
};

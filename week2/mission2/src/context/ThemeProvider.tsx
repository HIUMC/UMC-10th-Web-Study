import { createContext, type PropsWithChildren, useState, useContext } from "react";

export enum THEME {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

export type Theme = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

  const toggleTheme = (): void => {
    setTheme((prevTheme): Theme =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
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
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
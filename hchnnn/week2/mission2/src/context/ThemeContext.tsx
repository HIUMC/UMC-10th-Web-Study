import { createContext, useContext, useState, ReactNode } from 'react';


type Theme = 'LIGHT' | 'DARK';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('LIGHT');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'LIGHT' ? 'DARK' : 'LIGHT'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
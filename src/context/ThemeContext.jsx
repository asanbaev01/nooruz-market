import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

/* ====== LOCALSTORAGE KEY ====== */
const LS_THEME_KEY = 'nooruz_theme';

export const ThemeProvider = ({ children }) => {
  /* ====== Баштапкы тема (LocalStorage → система → light) ====== */
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;

      /* Система темасын текшерүү */
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  /* ====== HTML'ге class кошуу/алуу ====== */
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(LS_THEME_KEY, theme);
    } catch (err) {
      console.warn('Theme save error:', err);
    }
  }, [theme]);

  /* ====== Теманы которуу ====== */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  /* ====== Теманы орнотуу ====== */
  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setLightTheme,
    setDarkTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};





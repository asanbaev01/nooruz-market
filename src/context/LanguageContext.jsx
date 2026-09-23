import React, { createContext, useContext, useState, useEffect } from 'react';
import { ky } from '../locales/ky';
import { ru } from '../locales/ru';
import { en } from '../locales/en';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

/* ====== LOCALSTORAGE KEY ====== */
const LS_LANG_KEY = 'nooruz_lang';

/* ====== ТИЛДЕР ====== */
export const LANGUAGES = {
  ky: { code: 'ky', name: 'Кыргызча', flag: '🇰🇬', short: 'KY' },
  ru: { code: 'ru', name: 'Русский', flag: '🇷🇺', short: 'RU' },
  en: { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN' },
};

/* ====== КОТОРМОЛОР ====== */
const TRANSLATIONS = { ky, ru, en };

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_LANG_KEY);
      if (saved && TRANSLATIONS[saved]) return saved;

      /* Браузер тилин аныктоо */
      const browserLang = navigator.language?.split('-')[0];
      if (TRANSLATIONS[browserLang]) return browserLang;

      return 'ky'; // Демейки — кыргызча
    } catch {
      return 'ky';
    }
  });

  /* ====== LOCALSTORAGE SYNC ====== */
  useEffect(() => {
    try {
      localStorage.setItem(LS_LANG_KEY, language);
      document.documentElement.lang = language;
    } catch (err) {
      console.warn('Language save error:', err);
    }
  }, [language]);

  /* ====== КОТОРМО ФУНКЦИЯСЫ ====== */
  const t = (path) => {
    if (!path) return '';
    const keys = path.split('.');
    let value = TRANSLATIONS[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        /* Эгер котормо табылбаса — кыргызчадан алуу */
        let fallback = TRANSLATIONS.ky;
        for (const k of keys) {
          if (fallback && typeof fallback === 'object' && k in fallback) {
            fallback = fallback[k];
          } else {
            return path; // Акыркы вариант — path кайтаруу
          }
        }
        return fallback;
      }
    }

    return value || path;
  };

  /* ====== ТИЛДИ ӨЗГӨРТҮҮ ====== */
  const changeLanguage = (code) => {
    if (TRANSLATIONS[code]) setLanguage(code);
  };

  const value = {
    language,
    changeLanguage,
    t,
    languages: LANGUAGES,
    currentLanguage: LANGUAGES[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};


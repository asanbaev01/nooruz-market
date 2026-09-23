import React, { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiCheck, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* Сырттан басканда жабуу */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const current = languages[language];
  const langList = Object.values(languages);

  return (
    <>
      <style>{`
        .lang-dropdown {
          animation: langDropIn .3s cubic-bezier(.34,1.56,.64,1);
          transform-origin: top right;
        }
        @keyframes langDropIn {
          0% { opacity: 0; transform: translateY(-10px) scale(.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .lang-item {
          transition: all .25s ease;
        }
        .lang-item:hover {
          background: rgba(16,185,129,.08);
          transform: translateX(4px);
        }
        .lang-btn {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .lang-btn:hover {
          transform: scale(1.05);
          background: rgba(16,185,129,.1);
        }
        .lang-btn:active {
          transform: scale(.95);
        }
        .lang-btn .lang-flag {
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .lang-btn:hover .lang-flag {
          transform: rotate(-10deg) scale(1.15);
        }
        .lang-chevron {
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .lang-chevron.open {
          transform: rotate(180deg);
        }
      `}</style>

      <div className="relative" ref={dropdownRef}>
        {/* ====== КНОПКА ====== */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lang-btn flex items-center gap-1.5 px-2.5 py-2 rounded-full bg-gray-100 hover:bg-emerald-50 text-gray-700 font-semibold text-sm"
          aria-label="Тил тандоо"
          title={current?.name}
        >
          <span className="lang-flag text-base leading-none">{current?.flag}</span>
          <span className="text-xs font-bold">{current?.short}</span>
          <FiChevronDown
            className={`lang-chevron text-xs ${isOpen ? 'open' : ''}`}
          />
        </button>

        {/* ====== DROPDOWN ====== */}
        {isOpen && (
          <div className="lang-dropdown absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden min-w-[180px] z-[100]">
            {/* Header */}
            <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 flex items-center gap-2">
              <FiGlobe className="text-emerald-600 text-sm" />
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                Тил тандоо
              </p>
            </div>

            {/* Тилдер */}
            <div className="py-1">
              {langList.map((lang) => {
                const isActive = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`lang-item w-full flex items-center gap-3 px-4 py-2.5 text-left ${
                      isActive ? 'bg-emerald-50/60' : ''
                    }`}
                  >
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <div className="flex-grow min-w-0">
                      <p className={`text-sm font-semibold ${isActive ? 'text-emerald-700' : 'text-gray-800'}`}>
                        {lang.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase">
                        {lang.short}
                      </p>
                    </div>
                    {isActive && (
                      <FiCheck className="text-emerald-600 text-base flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LanguageSwitcher;
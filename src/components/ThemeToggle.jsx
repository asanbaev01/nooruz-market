import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      <style>{`
        .theme-toggle {
          position: relative;
          width: 56px;
          height: 30px;
          border-radius: 999px;
          background: linear-gradient(135deg, #FEF3C7, #FDE68A);
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
          overflow: hidden;
          border: none;
          padding: 0;
          box-shadow: inset 0 2px 4px rgba(0,0,0,.08);
        }
        .theme-toggle.dark {
          background: linear-gradient(135deg, #1E293B, #334155);
          box-shadow: inset 0 2px 4px rgba(0,0,0,.4);
        }
        .theme-toggle:hover {
          transform: scale(1.05);
        }
        .theme-toggle:active {
          transform: scale(.95);
        }

        /* ====== Кыймылдаган бөлүк ====== */
        .theme-toggle-knob {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 8px rgba(0,0,0,.2);
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          z-index: 2;
        }
        .theme-toggle.dark .theme-toggle-knob {
          left: calc(100% - 27px);
          background: #0F172A;
        }

        /* ====== Иконкалар ====== */
        .theme-toggle-icon {
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          color: #F59E0B;
        }
        .theme-toggle.dark .theme-toggle-icon {
          color: #FDE68A;
        }

        /* ====== Жылдыздар (dark) ====== */
        .theme-toggle-star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: white;
          opacity: 0;
          transition: opacity .5s ease;
        }
        .theme-toggle.dark .theme-toggle-star {
          opacity: 1;
        }
        @keyframes twinkle {
          0%, 100% { opacity: .4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .theme-toggle.dark .theme-toggle-star {
          animation: twinkle 2s ease-in-out infinite;
        }

        /* ====== Бул bulut (light) ====== */
        .theme-toggle-cloud {
          position: absolute;
          width: 8px;
          height: 5px;
          border-radius: 999px;
          background: white;
          opacity: .8;
          transition: opacity .5s ease;
        }
        .theme-toggle.dark .theme-toggle-cloud {
          opacity: 0;
        }

        /* ====== Rotation эффект ====== */
        @keyframes sunSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes moonGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(253,230,138,.6)); }
          50% { filter: drop-shadow(0 0 8px rgba(253,230,138,.9)); }
        }
        .theme-toggle:not(.dark) .theme-toggle-icon {
          animation: sunSpin 12s linear infinite;
        }
        .theme-toggle.dark .theme-toggle-icon {
          animation: moonGlow 3s ease-in-out infinite;
        }
      `}</style>

      <button
        onClick={toggleTheme}
        className={`theme-toggle ${isDark ? 'dark' : ''}`}
        aria-label={isDark ? 'Жарык режим' : 'Караңгы режим'}
        title={isDark ? 'Жарык режим' : 'Караңгы режим'}
      >
        {/* Жылдыздар (dark) */}
        <span className="theme-toggle-star" style={{ top: '8px', left: '12px' }} />
        <span className="theme-toggle-star" style={{ top: '16px', left: '20px', animationDelay: '.5s' }} />
        <span className="theme-toggle-star" style={{ top: '10px', left: '30px', animationDelay: '1s' }} />

        {/* Bulut (light) */}
        <span className="theme-toggle-cloud" style={{ top: '8px', right: '10px' }} />
        <span className="theme-toggle-cloud" style={{ top: '16px', right: '18px', width: '6px', height: '4px' }} />

        {/* Кыймылдаган бөлүк */}
        <div className="theme-toggle-knob">
          {isDark ? (
            <FiMoon className="theme-toggle-icon text-sm" />
          ) : (
            <FiSun className="theme-toggle-icon text-sm" />
          )}
        </div>
      </button>
    </>
  );
};

export default ThemeToggle;
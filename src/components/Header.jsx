import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiFeather,
  FiShield,
  FiGrid,
  FiInfo,
  FiTruck,
  FiGift,
  FiGlobe,
  FiSun,
  FiMoon,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ onCartClick, onAuthClick, onProfileClick, onAdminClick, onSearch }) => {
  const { cartCount, isLoggedIn, currentUser, isAdmin } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cartCount);
  const headerRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (cartCount !== prevCartCount) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      setPrevCartCount(cartCount);
      return () => clearTimeout(timer);
    }
  }, [cartCount, prevCartCount]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileMenu(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (mobileMenu) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenu]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleUserClick = () => {
    if (isLoggedIn) onProfileClick?.();
    else onAuthClick?.();
  };

  const navLinks = [
    { name: t('nav.products'), href: '#products-section', icon: FiGrid },
    { name: t('nav.about'), href: '#about-section', icon: FiInfo },
    { name: t('nav.delivery'), href: '#delivery-section', icon: FiTruck },
    { name: t('nav.promo'), href: '#promo-section', icon: FiGift },
  ];

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  return (
    <>
      {/* ========== KEYFRAMES (тек анимация үчүн) ========== */}
      <style>{`
        @keyframes headerTopShine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 4px 24px -6px rgba(16,185,129,0.2); }
          50% { box-shadow: 0 4px 36px -6px rgba(16,185,129,0.4); }
        }
        @keyframes logoShine {
          0%, 60% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: .5; }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes badgePop {
          0% { transform: scale(.5); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes cartBounce {
          0% { transform: scale(1) rotate(0); }
          25% { transform: scale(1.4) rotate(-15deg); }
          50% { transform: scale(.9) rotate(10deg); }
          75% { transform: scale(1.2) rotate(-5deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes onlinePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @keyframes adminShine {
          0%, 70% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileItemIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Утилита-класстар (Tailwind жетпеген жерлерде) */
        .header-top-shine {
          background-size: 200% 100%;
          animation: headerTopShine 4s linear infinite;
        }
        .header-scrolled-glow {
          animation: headerGlow 3.5s ease-in-out infinite;
        }
        .logo-shine::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
          transform: translateX(-150%) skewX(-20deg);
          animation: logoShine 3.5s ease-in-out infinite;
        }
        .dot-pulse { animation: dotPulse 2s ease-in-out infinite; }
        .badge-pulse { animation: badgePulse 2s ease-in-out infinite; }
        .badge-pop { animation: badgePop .5s cubic-bezier(.34,1.56,.64,1); }
        .cart-bounce { animation: cartBounce .6s cubic-bezier(.34,1.56,.64,1); }
        .online-dot-pulse { animation: onlinePulse 2s ease-in-out infinite; }
        .admin-shine::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%);
          transform: translateX(-150%) skewX(-20deg);
          animation: adminShine 3s ease-in-out infinite;
        }
        .mobile-menu-anim { animation: mobileMenuIn .4s cubic-bezier(.34,1.56,.64,1); }
        .mobile-item-anim { animation: mobileItemIn .4s cubic-bezier(.34,1.56,.64,1) both; }

        /* Search focus width */
        .search-input:focus { width: 18rem !important; }

        /* Burger open */
        .burger-open .burger-line:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .burger-open .burger-line:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }
        .burger-open .burger-line:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }
      `}</style>

      <header
        ref={headerRef}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          backdrop-blur-xl backdrop-saturate-150
          ${scrolled ? 'h-16 header-scrolled-glow' : 'h-20'}
          ${isDark
            ? 'bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-emerald-950/30 border-b border-emerald-500/20'
            : 'bg-gradient-to-br from-white/85 via-white/75 to-emerald-50/60 border-b border-emerald-500/10'
          }
        `}
      >
        {/* Top shine bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500 via-emerald-700 via-emerald-500 to-transparent opacity-80 header-top-shine" />

        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex justify-between items-center gap-4">

          {/* ========== LOGO ========== */}
          <a
            href="#"
            className="flex items-center gap-2.5 no-underline transition-transform duration-500 ease-out hover:scale-[1.03] group"
            aria-label="Nooruz Market"
          >
            {/* Icon box */}
            <div className={`
              relative w-11 h-11 rounded-xl overflow-hidden
              bg-gradient-to-br from-emerald-500 to-emerald-700
              flex items-center justify-center text-white
              shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
              transition-all duration-500 ease-out
              group-hover:rotate-[-8deg] group-hover:scale-110
              group-hover:shadow-[0_8px_24px_-2px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.4)]
              logo-shine
            `}>
              <FiFeather className="text-[22px] relative z-10 transition-transform duration-500 group-hover:rotate-[360deg]" />
            </div>

            {/* Text */}
            <div className="flex items-center">
              <span className={`
                text-xl font-extrabold tracking-tight
                bg-clip-text text-transparent
                ${isDark
                  ? 'bg-gradient-to-br from-white to-emerald-400'
                  : 'bg-gradient-to-br from-slate-900 to-emerald-700'
                }
              `}>
                Nooruz
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 dot-pulse" />
            </div>
          </a>

          {/* ========== NAV ========== */}
          <nav className="hidden md:flex gap-1 items-center">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className={`
                    group relative px-3.5 py-2 text-sm font-semibold
                    rounded-lg transition-all duration-300 ease-out
                    bg-transparent border-0 cursor-pointer overflow-hidden
                    ${isDark
                      ? 'text-slate-400 hover:text-emerald-400'
                      : 'text-slate-500 hover:text-emerald-700'
                    }
                    hover:-translate-y-0.5
                  `}
                  style={{ animation: `mobileItemIn .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.08}s both` }}
                >
                  {/* Hover bg */}
                  <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Text */}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="text-sm transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
                    {link.name}
                  </span>

                  {/* Underline */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3/5 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out" />
                </button>
              );
            })}
          </nav>

          {/* ========== ACTIONS ========== */}
          <div className="flex items-center gap-1.5">

            {/* Search */}
            <div className="relative hidden sm:block group">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t('search.placeholder')}
                className={`
                  search-input
                  w-48 focus:w-72
                  px-4 py-2.5 pl-10
                  text-[13px] rounded-xl outline-none
                  border border-transparent
                  transition-all duration-400 ease-out
                  ${isDark
                    ? 'bg-slate-800/70 text-slate-200 placeholder:text-slate-500 focus:bg-slate-800 focus:border-emerald-500'
                    : 'bg-slate-100/70 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500'
                  }
                  focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12),0_4px_16px_-4px_rgba(16,185,129,0.3)]
                `}
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-slate-400 pointer-events-none transition-all duration-300 group-focus-within:text-emerald-500 group-focus-within:-rotate-12 group-focus-within:scale-110" />
            </div>

            <LanguageSwitcher />
            <ThemeToggle />

            {/* Admin */}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className={`
                  relative hidden sm:flex w-10 h-10 rounded-xl
                  items-center justify-center text-white
                  bg-gradient-to-br from-emerald-500 to-emerald-700
                  border-0 cursor-pointer overflow-hidden
                  shadow-[0_4px_16px_-4px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]
                  transition-all duration-400 ease-out
                  hover:-translate-y-0.5 hover:scale-105
                  hover:shadow-[0_8px_24px_-4px_rgba(16,185,129,0.7),inset_0_1px_0_rgba(255,255,255,0.4)]
                  admin-shine
                `}
                aria-label="Админ панель"
                title="Админ панель"
              >
                <FiShield className="text-xl relative z-10 transition-transform duration-400 hover:rotate-[15deg] hover:scale-110" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={onCartClick}
              className={`
                group relative w-10 h-10 rounded-xl
                flex items-center justify-center
                bg-transparent border-0 cursor-pointer
                overflow-hidden
                transition-all duration-400 ease-out
                hover:-translate-y-0.5
                hover:shadow-[0_6px_20px_-6px_rgba(16,185,129,0.4)]
                ${isDark ? 'text-emerald-400' : 'text-emerald-700'}
                ${cartBounce ? 'cart-bounce' : ''}
              `}
              aria-label={t('header.cart')}
            >
              {/* Hover bg */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 scale-0 group-hover:scale-100 transition-transform duration-400 ease-out" />

              <FiShoppingCart className="text-xl relative z-10 transition-transform duration-400 group-hover:scale-115" />

              {cartCount > 0 && (
                <span className={`
                  absolute top-1 right-1 min-w-[18px] h-[18px] px-1
                  rounded-full text-[10px] font-extrabold text-white
                  flex items-center justify-center
                  bg-gradient-to-br from-emerald-500 to-emerald-700
                  border-2 ${isDark ? 'border-slate-900' : 'border-white'}
                  shadow-[0_2px_8px_rgba(16,185,129,0.5)]
                  badge-pulse
                  ${cartBounce ? 'badge-pop' : ''}
                `}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <button
              onClick={handleUserClick}
              className={`
                group relative w-10 h-10 rounded-xl
                flex items-center justify-center
                bg-transparent border-0 cursor-pointer
                overflow-hidden
                transition-all duration-400 ease-out
                hover:-translate-y-0.5
                hover:shadow-[0_6px_20px_-6px_rgba(16,185,129,0.4)]
                ${isDark ? 'text-emerald-400' : 'text-emerald-700'}
              `}
              aria-label={isLoggedIn ? t('header.profile') : t('header.login')}
              title={isLoggedIn ? currentUser?.name : t('header.login')}
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-700/5 scale-0 group-hover:scale-100 transition-transform duration-400 ease-out" />

              {isLoggedIn ? (
                <>
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="relative z-10 w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.15)] transition-all duration-400 group-hover:shadow-[0_0_0_5px_rgba(16,185,129,0.25)] group-hover:scale-108"
                    />
                  ) : (
                    <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-[13px] font-extrabold shadow-[0_0_0_3px_rgba(16,185,129,0.15)] transition-all duration-400 group-hover:shadow-[0_0_0_5px_rgba(16,185,129,0.25)] group-hover:scale-108">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className={`absolute bottom-1 right-1 z-20 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 ${isDark ? 'border-slate-900' : 'border-white'} online-dot-pulse`} />
                </>
              ) : (
                <FiUser className="text-xl relative z-10 transition-transform duration-400 group-hover:scale-115" />
              )}
            </button>

            {/* Bell */}
            {isLoggedIn && <NotificationBell />}

            {/* Burger */}
            <button
              className={`
                md:hidden w-10 h-10 rounded-xl
                flex flex-col items-center justify-center gap-1.5
                bg-transparent border-0 cursor-pointer
                ${isDark ? 'text-emerald-400' : 'text-emerald-700'}
                ${mobileMenu ? 'burger-open' : ''}
              `}
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Меню"
            >
              <span className={`burger-line w-5 h-0.5 rounded-full transition-all duration-400 ${isDark ? 'bg-emerald-400' : 'bg-emerald-700'}`} />
              <span className={`burger-line w-5 h-0.5 rounded-full transition-all duration-400 ${isDark ? 'bg-emerald-400' : 'bg-emerald-700'}`} />
              <span className={`burger-line w-5 h-0.5 rounded-full transition-all duration-400 ${isDark ? 'bg-emerald-400' : 'bg-emerald-700'}`} />
            </button>
          </div>
        </div>

        {/* ========== MOBILE MENU ========== */}
        {mobileMenu && (
          <div className={`
            md:hidden px-4 py-4 space-y-2
            backdrop-blur-xl border-t shadow-2xl
            max-h-[calc(100vh-80px)] overflow-y-auto
            mobile-menu-anim
            ${isDark
              ? 'bg-slate-900/98 border-emerald-500/25'
              : 'bg-white/98 border-emerald-500/15'
            }
          `}>
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className={`
                    mobile-item-anim
                    flex items-center gap-3 w-full text-left
                    px-4 py-3.5 rounded-xl
                    text-[15px] font-semibold
                    bg-transparent border-0 cursor-pointer
                    transition-all duration-350 ease-out
                    ${isDark
                      ? 'text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 hover:translate-x-1.5'
                      : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-500/8 hover:translate-x-1.5'
                    }
                  `}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <Icon className="text-lg text-emerald-500 flex-shrink-0" />
                  {link.name}
                </button>
              );
            })}

            {/* Admin mobile */}
            {isAdmin && (
              <button
                onClick={() => {
                  onAdminClick?.();
                  setMobileMenu(false);
                }}
                className={`
                  mobile-item-anim
                  flex items-center justify-center gap-3 w-full
                  px-4 py-3.5 rounded-xl
                  text-white font-semibold
                  bg-gradient-to-r from-emerald-500 to-emerald-700
                  border-0 cursor-pointer
                  shadow-[0_4px_16px_-4px_rgba(16,185,129,0.5)]
                  transition-all duration-350 ease-out
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_24px_-4px_rgba(16,185,129,0.7)]
                `}
                style={{ animationDelay: '0.25s' }}
              >
                <FiShield className="text-lg" />
                Админ панель
              </button>
            )}

            {/* Lang */}
            <div
              className={`
                mobile-item-anim
                flex items-center justify-between
                px-4 py-3.5 rounded-xl
                ${isDark ? 'text-slate-300' : 'text-slate-700'}
              `}
              style={{ animationDelay: '0.3s' }}
            >
              <span className="flex items-center gap-3 font-semibold text-[15px]">
                <FiGlobe className="text-lg text-emerald-500" />
                Тил / Язык
              </span>
              <LanguageSwitcher />
            </div>

            {/* Theme */}
            <div
              className={`
                mobile-item-anim
                flex items-center justify-between
                px-4 py-3.5 rounded-xl
                ${isDark ? 'text-slate-300' : 'text-slate-700'}
              `}
              style={{ animationDelay: '0.36s' }}
            >
              <span className="flex items-center gap-3 font-semibold text-[15px]">
                {isDark ? <FiMoon className="text-lg text-emerald-500" /> : <FiSun className="text-lg text-emerald-500" />}
                {isDark ? 'Караңгы режим' : 'Жарык режим'}
              </span>
              <ThemeToggle />
            </div>

            {/* Profile */}
            {isLoggedIn && (
              <button
                onClick={() => {
                  onProfileClick?.();
                  setMobileMenu(false);
                }}
                className={`
                  mobile-item-anim
                  flex items-center gap-3 w-full text-left
                  px-4 py-3.5 rounded-xl
                  font-semibold text-[15px]
                  bg-gradient-to-br from-emerald-500/10 to-emerald-700/5
                  border-0 cursor-pointer
                  text-emerald-700
                  transition-all duration-350
                  hover:translate-x-1.5
                `}
                style={{ animationDelay: '0.42s' }}
              >
                <FiUser className="text-lg text-emerald-500" />
                {t('header.myProfile')}
              </button>
            )}

            {/* Search mobile */}
            <div className="relative sm:hidden pt-2 mobile-item-anim" style={{ animationDelay: '0.48s' }}>
              <FiSearch className="absolute left-4 top-1/2 translate-y-1.5 text-slate-400 text-base pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={t('search.placeholder')}
                className={`
                  w-full px-4 py-3 pl-11
                  text-sm rounded-xl outline-none
                  border border-transparent
                  transition-all duration-400
                  ${isDark
                    ? 'bg-slate-800 text-slate-200 placeholder:text-slate-500 focus:border-emerald-500'
                    : 'bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white'
                  }
                  focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)]
                `}
              />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import NotificationBell from './NotificationBell';
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiFeather,
  FiBell,
  FiShield,
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
  const [logoHover, setLogoHover] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
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

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      onProfileClick?.();
    } else {
      onAuthClick?.();
    }
  };

  const navLinks = [
    { name: t('nav.products'), href: '#products-section', icon: '🥗' },
    { name: t('nav.about'), href: '#about-section', icon: '✨' },
    { name: t('nav.delivery'), href: '#delivery-section', icon: '🚚' },
    { name: t('nav.promo'), href: '#promo-section', icon: '🎁' },
  ];

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  return (
    <>
      <style>{`
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-3deg); }
        }
        @keyframes logoSpin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.15); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .logo-icon {
          animation: logoFloat 3s ease-in-out infinite;
          transition: color .4s ease;
        }
        .logo-icon:hover {
          animation: logoSpin .8s cubic-bezier(.34,1.56,.64,1);
          color: #22E8B0;
        }
        .nav-link {
          position: relative;
          transition: color .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 2px;
          background: linear-gradient(90deg, #7C6CFF, #22E8B0);
          border-radius: 2px;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .nav-link:hover::after { transform: scaleX(1); }
        @keyframes searchGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,108,255,.35); }
          50% { box-shadow: 0 0 0 8px rgba(124,108,255,0); }
        }
        .search-input { transition: all .4s cubic-bezier(.34,1.56,.64,1); }
        .search-input:focus {
          animation: searchGlow 2s ease-out infinite;
          transform: scale(1.03);
        }
        .search-icon { transition: all .4s cubic-bezier(.34,1.56,.64,1); }
        .search-wrap:focus-within .search-icon {
          transform: rotate(-15deg) scale(1.15);
          color: #7C6CFF;
        }
        @keyframes cartBounce {
          0% { transform: scale(1) rotate(0); }
          25% { transform: scale(1.35) rotate(-12deg); }
          50% { transform: scale(.9) rotate(8deg); }
          75% { transform: scale(1.15) rotate(-4deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cart-bounce { animation: cartBounce .6s cubic-bezier(.34,1.56,.64,1); }
        @keyframes cartIdle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .cart-icon:hover { animation: cartIdle .5s ease-in-out infinite; }
        @keyframes badgePop {
          0% { transform: scale(.5); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .cart-badge { animation: badgePulse 2s ease-in-out infinite; }
        .cart-badge.pop {
          animation: badgePop .5s cubic-bezier(.34,1.56,.64,1), badgePulse 2s ease-in-out infinite .5s;
        }
        .icon-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative;
        }
        .icon-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: rgba(124,108,255,.12);
          transform: scale(0);
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
          z-index: 0;
        }
        .icon-btn:hover::before { transform: scale(1.4); }
        .icon-btn:hover svg { transform: scale(1.15) rotate(6deg); }
        .icon-btn svg {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          z-index: 1;
        }
        @keyframes userNod {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        .user-btn:hover .user-icon { animation: userNod .6s ease-in-out; }
        @keyframes adminPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.5); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        .admin-btn {
          animation: adminPulse 2.5s ease-in-out infinite;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white !important;
        }
        .admin-btn:hover svg {
          transform: scale(1.15) rotate(15deg) !important;
        }
        .burger-line {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          transform-origin: center;
        }
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
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileItemIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .mobile-menu { animation: slideDown .4s cubic-bezier(.34,1.56,.64,1); }
        .mobile-menu .mobile-item {
          animation: mobileItemIn .4s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 4px 20px -4px rgba(124,108,255,.15); }
          50% { box-shadow: 0 4px 30px -4px rgba(124,108,255,.3); }
        }
        .header-scrolled { animation: headerGlow 3s ease-in-out infinite; }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .shine-wrap { position: relative; overflow: hidden; }
        .shine-wrap::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          animation: shine 4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes onlinePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.6); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        .online-dot {
          animation: onlinePulse 2s ease-in-out infinite;
        }
        .header-bg-light { background: rgba(255,255,255,0.9); }
        .header-bg-light.scrolled { background: rgba(255,255,255,0.95); }
        .header-bg-dark {
          background: rgba(15,23,42,0.9);
          border-color: rgba(51,65,85,0.5) !important;
        }
        .header-bg-dark.scrolled { background: rgba(15,23,42,0.95); }
        .search-input { background: #F3F4F6; }
        .dark .search-input {
          background: #1E293B;
          color: #E2E8F0;
        }
        .dark .search-input::placeholder { color: #64748B; }
        .dark .mobile-menu {
          background: #1E293B !important;
          border-color: #334155 !important;
        }
        .dark .mobile-menu .mobile-item { color: #E2E8F0; }
        .dark .mobile-menu .mobile-item:hover {
          background: rgba(16,185,129,0.1);
          color: #10B981;
        }
        .dark .nav-link { color: #94A3B8; }
        .dark .nav-link:hover { color: #10B981; }
      `}</style>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 border-b border-black/10 
          transition-all duration-500 ${scrolled ? 'h-16 header-scrolled' : 'h-20'} 
          ${isDark ? 'header-bg-dark' : 'header-bg-light'} 
          ${scrolled ? 'scrolled' : ''}`}
        style={{ backdropFilter: 'blur(16px)' }}
      >
        <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">

          {/* LOGO */}
          <a
            href="#"
            className="text-2xl font-bold text-primary flex items-center gap-2 
              hover:scale-105 transition-transform duration-300 shine-wrap"
            onMouseEnter={() => setLogoHover(true)}
            onMouseLeave={() => setLogoHover(false)}
          >
            <FiFeather className="text-3xl logo-icon" />
            <span className="relative">
              Nooruz Market
              <span
                className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-primary to-green-400 
                  transition-all duration-500"
                style={{ width: logoHover ? '100%' : '0%' }}
              />
            </span>
          </a>

          {/* NAV */}
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link, i) => (
              <button
                key={link.name}
                onMouseEnter={() => setHoveredLink(i)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => scrollTo(link.href)}
                className="nav-link text-base font-medium"
                style={{
                  transform: hoveredLink === i ? 'translateY(-2px)' : 'translateY(0)',
                  animation: `mobileItemIn .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.08}s both`,
                  color: isDark ? undefined : '#4B5563',
                }}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <div className="relative hidden sm:block search-wrap">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t('search.placeholder')}
                className="search-input border-none rounded-full px-5 py-2.5 pl-10 
                  focus:ring-2 focus:ring-primary w-48 lg:w-64 text-sm outline-none"
                style={{ width: searchFocused ? '20rem' : '' }}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg search-icon pointer-events-none" />
            </div>

            <LanguageSwitcher />
            <ThemeToggle />

            {/* АДМИН БАСКЫЧЫ */}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="admin-btn icon-btn relative p-2 rounded-full shadow-lg hidden sm:flex items-center justify-center"
                aria-label="Админ панель"
                title="Админ панель"
              >
                <FiShield className="text-xl" />
              </button>
            )}

            {/* Cart */}
            <button
              onClick={onCartClick}
              className={`icon-btn relative p-2 text-primary ${cartBounce ? 'cart-bounce' : ''}`}
              aria-label={t('header.cart')}
            >
              <FiShoppingCart className="text-2xl cart-icon" />
              {cartCount > 0 && (
                <span
                  className={`cart-badge ${cartBounce ? 'pop' : ''} 
                    absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 
                    rounded-full flex items-center justify-center font-bold`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <button
              onClick={handleUserClick}
              className="icon-btn user-btn relative p-2 text-primary"
              aria-label={isLoggedIn ? t('header.profile') : t('header.login')}
              title={isLoggedIn ? currentUser?.name : t('header.login')}
            >
              {isLoggedIn ? (
                <>
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-emerald-500"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="online-dot absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </>
              ) : (
                <FiUser className="text-2xl user-icon" />
              )}
            </button>

            {/* ✅ BELL — NotificationBell компоненти */}
            {isLoggedIn && <NotificationBell />}

            {/* Burger */}
            <button
              className={`md:hidden p-2 text-primary icon-btn ${mobileMenu ? 'burger-open' : ''}`}
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Меню"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <span className="burger-line w-full h-0.5 bg-primary rounded-full" />
                <span className="burger-line w-full h-0.5 bg-primary rounded-full" />
                <span className="burger-line w-full h-0.5 bg-primary rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="mobile-menu md:hidden border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
            {navLinks.map((link, i) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href)}
                className="mobile-item block w-full text-left py-3 px-3 
                  rounded-lg font-medium transition-all duration-300 flex items-center gap-3"
                style={{
                  animationDelay: `${i * 0.08}s`,
                  color: isDark ? undefined : '#374151',
                }}
              >
                <span className="text-xl">{link.icon}</span>
                {link.name}
              </button>
            ))}

            {/* Admin (mobile) */}
            {isAdmin && (
              <button
                onClick={() => {
                  onAdminClick?.();
                  setMobileMenu(false);
                }}
                className="mobile-item w-full text-left py-3 px-3 text-white bg-gradient-to-r from-red-500 to-red-600 
                  rounded-lg font-medium flex items-center gap-3 shadow-md"
                style={{ animationDelay: '0.2s' }}
              >
                <FiShield className="text-xl" />
                Админ панель
              </button>
            )}

            <div
              className="mobile-item flex items-center justify-between py-3 px-3 rounded-lg"
              style={{ animationDelay: '0.28s' }}
            >
              <span
                className="flex items-center gap-3 font-medium"
                style={{ color: isDark ? '#E2E8F0' : '#374151' }}
              >
                🌐 Тил / Язык / Lang
              </span>
              <LanguageSwitcher />
            </div>

            <div
              className="mobile-item flex items-center justify-between py-3 px-3 rounded-lg"
              style={{ animationDelay: '0.36s' }}
            >
              <span
                className="flex items-center gap-3 font-medium"
                style={{ color: isDark ? '#E2E8F0' : '#374151' }}
              >
                {isDark ? '🌙' : '☀️'}
                {isDark ? 'Караңгы режим' : 'Жарык режим'}
              </span>
              <ThemeToggle />
            </div>

            {isLoggedIn && (
              <button
                onClick={() => {
                  onProfileClick?.();
                  setMobileMenu(false);
                }}
                className="mobile-item w-full text-left py-3 px-3 text-primary bg-primary/5 
                  rounded-lg font-medium flex items-center gap-3"
                style={{ animationDelay: '0.44s' }}
              >
                <FiUser className="text-xl" />
                {t('header.myProfile')}
              </button>
            )}

            <div className="mobile-item relative sm:hidden pt-2" style={{ animationDelay: '0.52s' }}>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder={t('search.placeholder')}
                className="search-input w-full border-none rounded-full px-5 py-2.5 pl-10 
                  focus:ring-2 focus:ring-primary text-sm outline-none"
              />
              <FiSearch className="absolute left-3 top-[18px] text-gray-400 text-lg" />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
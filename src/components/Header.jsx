import React, { useState, useEffect } from 'react';
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiFeather } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Header = ({ onCartClick, onAuthClick, onSearch }) => {
  const { cartCount, isLoggedIn, currentUser } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };

  const navLinks = [
    { name: 'Азыктар', href: '#products-section' },
    { name: 'Биз жөнүндө', href: '#about-section' },
    { name: 'Жеткирилүү', href: '#delivery-section' },
    { name: 'Акциялар', href: '#promo-section' },
  ];

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-black/10 transition-all duration-300 ${scrolled ? 'h-16 shadow-md' : 'h-20'}`}
      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-primary flex items-center gap-2 hover:scale-105 transition-transform">
          <FiFeather className="text-3xl" />
          Nooruz Market
        </a>

        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.href)}
              className="text-base text-gray-600 hover:text-primary transition-all font-medium"
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Издөө..."
              className="bg-gray-100 border-none rounded-full px-5 py-2.5 pl-10 focus:ring-2 focus:ring-primary w-48 lg:w-64 transition-all text-sm outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400 text-lg" />
          </div>

          <button onClick={onCartClick} className="relative p-2 text-primary hover:scale-110 transition-transform" aria-label="Корзина">
            <FiShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={onAuthClick} className="p-2 text-primary hover:scale-110 transition-transform" aria-label="Профиль" title={isLoggedIn ? currentUser?.name : 'Кирүү'}>
            <FiUser className="text-2xl" />
          </button>

          <button className="md:hidden p-2 text-primary" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => scrollTo(link.href)} className="block w-full text-left py-2 text-gray-700 hover:text-primary font-medium">
              {link.name}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
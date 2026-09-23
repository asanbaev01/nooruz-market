import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiTrendingUp, FiStar, FiShoppingCart, FiHeart, FiAward,
  FiChevronRight, FiZap, FiArrowUpRight,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const BestSellers = ({ onProductClick }) => {
  const { products, addToCart, isFavorite, toggleFavorite } = useApp();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* ====== SCROLL ANIMATION ====== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  /* ====== ЭҢ КӨП САТЫЛГАН 6 ТОВАР ====== */
  const bestSellers = useMemo(() => {
    if (!products?.length) return [];
    return [...products]
      .filter((p) => p.inStock)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);
  }, [products]);

  if (bestSellers.length === 0) return null;

  /* ====== BADGE (TOP #1, #2, #3) ====== */
  const getBadge = (index) => {
    if (index === 0) return { label: '🥇 №1', bg: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/50' };
    if (index === 1) return { label: '🥈 №2', bg: 'from-gray-300 to-gray-400', shadow: 'shadow-gray-400/50' };
    if (index === 2) return { label: '🥉 №3', bg: 'from-orange-400 to-amber-600', shadow: 'shadow-orange-500/50' };
    return null;
  };

  return (
    <>
      <style>{`
        /* ====== SECTION ENTRY ====== */
        @keyframes bsSectionIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bs-section {
          opacity: 0;
        }
        .bs-section.visible {
          opacity: 1;
          animation: bsSectionIn .8s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== TITLE ====== */
        @keyframes bsTitleIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bsIconPulse {
          0%, 100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.15) rotate(-8deg); }
        }
        .bs-title {
          animation: bsTitleIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }
        .bs-title-icon {
          animation: bsIconPulse 2.5s ease-in-out infinite;
        }

        /* ====== FIRE FLICKER ====== */
        @keyframes fireFlicker {
          0%, 100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 8px #f97316); }
          50% { opacity: .8; transform: scale(1.1); filter: drop-shadow(0 0 16px #f97316); }
        }
        .fire-icon {
          animation: fireFlicker 1.5s ease-in-out infinite;
        }

        /* ====== GRADIENT LINE ====== */
        @keyframes bsLineExpand {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }
        .bs-line {
          animation: bsLineExpand .8s cubic-bezier(.34,1.56,.64,1) .3s both;
        }

        /* ====== CARD ENTRY (stagger) ====== */
        @keyframes bsCardIn {
          0% { opacity: 0; transform: translateY(40px) scale(.9) rotate(-2deg); }
          60% { transform: translateY(-8px) scale(1.03) rotate(1deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
        }
        .bs-card {
          opacity: 0;
        }
        .bs-card.visible {
          opacity: 1;
          animation: bsCardIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== CARD HOVER ====== */
        .bs-card-inner {
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .bs-card:hover .bs-card-inner {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px -20px rgba(16,185,129,.4);
        }

        /* Shine effect */
        .bs-card-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-150%) skewX(-20deg);
          pointer-events: none;
          z-index: 5;
        }
        .bs-card:hover .bs-card-inner::before {
          animation: bsShine 1s ease-out;
        }
        @keyframes bsShine {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(500%) skewX(-20deg); }
        }

        /* ====== IMAGE ====== */
        .bs-image {
          transition: transform .7s cubic-bezier(.34,1.56,.64,1);
        }
        .bs-card:hover .bs-image {
          transform: scale(1.15) rotate(-3deg);
        }

        /* ====== RANK BADGE (TOP 1/2/3) ====== */
        @keyframes rankPulse {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.08) rotate(3deg); }
        }
        .bs-rank {
          animation: rankPulse 2.5s ease-in-out infinite;
          z-index: 10;
        }
        .bs-card:hover .bs-rank {
          animation: none;
          transform: scale(1.15) rotate(0deg);
        }

        /* ====== POPULARITY BAR ====== */
        .bs-popularity-bar {
          position: relative;
          overflow: hidden;
        }
        .bs-popularity-fill {
          animation: bsBarFill 1.5s cubic-bezier(.34,1.56,.64,1) both;
        }
        @keyframes bsBarFill {
          from { width: 0; }
        }

        /* ====== CART BUTTON ====== */
        .bs-cart-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .bs-cart-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-100%);
          transition: transform .6s ease;
        }
        .bs-cart-btn:hover::before {
          transform: translateX(100%);
        }
        .bs-cart-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.5);
        }
        .bs-cart-btn:active {
          transform: scale(.95);
        }
        .bs-cart-btn:hover svg {
          transform: rotate(-12deg) scale(1.15);
        }
        .bs-cart-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== FAVORITE BUTTON ====== */
        @keyframes bsHeartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.2); }
        }
        .bs-fav-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .bs-fav-btn:hover {
          transform: scale(1.15);
          background: #fee2e2 !important;
        }
        .bs-fav-btn.faved {
          color: #ef4444;
          fill: #ef4444;
          animation: bsHeartBeat .8s ease-in-out;
        }

        /* ====== "ХИТ" BADGE ====== */
        @keyframes hitPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.6); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        .bs-hit-badge {
          animation: hitPulse 2s ease-in-out infinite;
        }

        /* ====== "ВСЕ ТОВАРЫ" КНОПКА ====== */
        @keyframes bsAllBtnIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bs-all-btn {
          animation: bsAllBtnIn .8s cubic-bezier(.34,1.56,.64,1) .6s both;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .bs-all-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 20px 40px -12px rgba(16,185,129,.5);
        }
        .bs-all-btn:hover svg {
          transform: translateX(6px);
        }
        .bs-all-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== BACKGROUND DECORATION ====== */
        @keyframes bsBlobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.15); }
        }
        .bs-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: .15;
          pointer-events: none;
          animation: bsBlobFloat 10s ease-in-out infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`bs-section relative py-24 bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden ${visible ? 'visible' : ''}`}
      >
        {/* ====== BACKGROUND BLOBS ====== */}
        <div className="bs-blob bg-orange-400 w-96 h-96 -top-32 -left-32" />
        <div className="bs-blob bg-red-400 w-80 h-80 -bottom-32 -right-32" style={{ animationDelay: '3s' }} />
        <div className="bs-blob bg-yellow-400 w-64 h-64 top-1/2 left-1/2" style={{ animationDelay: '5s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* ====== TITLE ====== */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 mb-4">
              <FiZap className="text-orange-500 fire-icon" />
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
                Хит сатуулар
              </span>
              <FiZap className="text-orange-500 fire-icon" />
            </div>

            <h2 className="bs-title text-4xl md:text-5xl font-bold flex items-center justify-center gap-3 text-gray-800">
              <FiTrendingUp className="text-orange-500 text-4xl bs-title-icon" />
              Эң көп сатылгандар
            </h2>

            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="bs-line h-[3px] bg-gradient-to-r from-transparent to-orange-500 rounded-full" />
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" style={{ animationDelay: '.2s' }} />
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" style={{ animationDelay: '.4s' }} />
              <span className="bs-line h-[3px] bg-gradient-to-l from-transparent to-orange-500 rounded-full" />
            </div>

            <p className="bs-title text-gray-500 mt-4 max-w-2xl mx-auto" style={{ animationDelay: '.15s' }}>
              🔥 Кардарлардын эң көп тандоосу — мыкты сапаттын белгиси
            </p>
          </div>

          {/* ====== PRODUCTS GRID ====== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((product, i) => {
              const rank = getBadge(i);
              const faved = isFavorite(product.id || product._id);
              const popularity = product.popularity || 0;

              return (
                <div
                  key={product.id || product._id}
                  className={`bs-card ${visible ? 'visible' : ''}`}
                  style={{ animationDelay: visible ? `${i * 0.1}s` : '0s' }}
                >
                  <div className="bs-card-inner bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-orange-200 cursor-pointer">

                    {/* IMAGE */}
                    <div
                      className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden"
                      onClick={() => onProductClick?.(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="bs-image w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                      {/* RANK BADGE */}
                      {rank && (
                        <div className={`bs-rank absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r ${rank.bg} text-white font-black text-sm shadow-lg ${rank.shadow}`}>
                          {rank.label}
                        </div>
                      )}

                      {/* HIT BADGE */}
                      {popularity >= 90 && !rank && (
                        <div className="bs-hit-badge absolute top-4 left-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-black text-xs shadow-lg">
                          🔥 ХИТ
                        </div>
                      )}

                      {/* FAVORITE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                        className={`bs-fav-btn absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-gray-400 shadow-lg ${
                          faved ? 'faved' : ''
                        }`}
                        aria-label="Тандалма"
                      >
                        <FiHeart className="text-lg" />
                      </button>

                      {/* PRODUCT BADGE */}
                      {product.badge && (
                        <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-gray-700 shadow-md">
                          {product.badgeText || product.badge}
                        </div>
                      )}
                    </div>

                    {/* INFO */}
                    <div className="p-5">
                      {/* Title */}
                      <h3
                        className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 hover:text-orange-600 transition-colors"
                        onClick={() => onProductClick?.(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`text-xs ${
                                star <= Math.floor(product.rating || 0)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {(product.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({product.reviews || 0})
                        </span>
                      </div>

                      {/* Popularity bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-orange-600 flex items-center gap-1">
                            <FiTrendingUp className="text-xs" />
                            Популярдуулук
                          </span>
                          <span className="text-gray-500">{popularity}%</span>
                        </div>
                        <div className="bs-popularity-bar h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="bs-popularity-fill h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                            style={{ width: `${popularity}%` }}
                          />
                        </div>
                      </div>

                      {/* Price + Cart */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-emerald-600">
                            {product.price?.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">сом</span>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {product.originalPrice} сом
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, false);
                          }}
                          className="bs-cart-btn w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg"
                          aria-label="Себетке кошуу"
                        >
                          <FiShoppingCart className="text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ====== "БАРДЫГЫН КӨРҮҮ" КНОПКА ====== */}
          <div className="text-center mt-12">
            <button
              onClick={() => {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bs-all-btn inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl"
            >
              <FiAward className="text-xl" />
              Бардык товарларды көрүү
              <FiChevronRight className="text-xl" />
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default BestSellers;
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FiTrendingUp, FiStar, FiShoppingCart, FiHeart, FiAward,
  FiChevronRight, FiZap, FiUser, FiPackage,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const BestSellers = ({ onProductClick }) => {
  const { products, addToCart, isFavorite, toggleFavorite } = useApp();
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

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

  const bestSellers = useMemo(() => {
    if (!products?.length) return [];
    return [...products]
      .filter((p) => p.inStock)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 6);
  }, [products]);

  if (bestSellers.length === 0) return null;

  const getRank = (index) => {
    if (index === 0) return { label: '№1', emoji: '🥇', bg: 'from-yellow-400 to-amber-500' };
    if (index === 1) return { label: '№2', emoji: '🥈', bg: 'from-gray-300 to-gray-500' };
    if (index === 2) return { label: '№3', emoji: '🥉', bg: 'from-orange-400 to-amber-600' };
    return null;
  };

  return (
    <>
      <style>{`
        /* ============================================================
           SECTION
           ============================================================ */
        @keyframes bsSectionIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bs-section { opacity: 0; }
        .bs-section.visible {
          opacity: 1;
          animation: bsSectionIn .6s ease-out both;
        }

        /* ============================================================
           TITLE
           ============================================================ */
        @keyframes bsTitleIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .bs-title-anim { animation: bsTitleIn .5s ease-out both; }
        .bs-icon-pulse { animation: iconPulse 3s ease-in-out infinite; }

        @keyframes bsLineExpand {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }
        .bs-line { animation: bsLineExpand .6s ease-out .2s both; }

        /* ============================================================
           CARD ENTRY
           ============================================================ */
        @keyframes bsCardIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .bs-card { opacity: 0; }
        .bs-card.visible {
          opacity: 1;
          animation: bsCardIn .5s ease-out both;
        }

        /* ============================================================
           CARD INNER — ProductCard СТИЛИНДЕ
           ============================================================ */
        .bs-card-inner {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          background: #ffffff;
        }
        .bs-card:hover .bs-card-inner {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(16,185,129,.2);
          border-color: rgba(16,185,129,.3);
        }

        /* ============================================================
           IMAGE
           ============================================================ */
        .bs-image {
          transition: transform .5s ease;
        }
        .bs-card:hover .bs-image {
          transform: scale(1.05);
        }

        /* ============================================================
           RANK BADGE
           ============================================================ */
        .bs-rank {
          transition: transform .3s ease;
        }
        .bs-card:hover .bs-rank {
          transform: scale(1.05);
        }

        /* ============================================================
           POPULARITY BAR
           ============================================================ */
        @keyframes bsBarFill { from { width: 0; } }
        .bs-popularity-fill {
          animation: bsBarFill 1s ease-out both;
        }

        /* ============================================================
           CART BUTTON
           ============================================================ */
        .bs-cart-btn {
          transition: all .3s ease;
        }
        .bs-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px -8px rgba(16,185,129,.5);
        }
        .bs-cart-btn:active {
          transform: scale(.95);
        }
        .bs-cart-btn:hover svg {
          transform: rotate(-8deg) scale(1.08);
        }
        .bs-cart-btn svg {
          transition: transform .3s ease;
        }

        /* ============================================================
           FAVORITE BUTTON
           ============================================================ */
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          30% { transform: scale(1.2); }
          60% { transform: scale(1); }
        }
        .bs-fav-btn {
          transition: all .3s ease;
        }
        .bs-fav-btn:hover {
          transform: scale(1.1);
        }
        .bs-fav-btn.faved {
          color: #ef4444;
          fill: #ef4444;
          animation: heartBeat .5s ease-in-out;
        }

        /* ============================================================
           ALL BUTTON
           ============================================================ */
        @keyframes bsAllBtnIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bs-all-btn {
          animation: bsAllBtnIn .5s ease-out .3s both;
          transition: all .3s ease;
        }
        .bs-all-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -12px rgba(16,185,129,.4);
        }
        .bs-all-btn:active {
          transform: scale(.97);
        }
        .bs-all-btn:hover svg:last-child {
          transform: translateX(4px);
        }
        .bs-all-btn svg {
          transition: transform .3s ease;
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`bs-section relative py-16 ${visible ? 'visible' : ''}`}
        style={{ background: '#FAFBFC' }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* ====== TITLE ====== */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-3">
              <FiZap className="text-emerald-500 text-xs" />
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Хит сатуулар
              </span>
              <FiZap className="text-emerald-500 text-xs" />
            </div>

            <h2 className="bs-title-anim text-2xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3 flex-wrap">
              <FiTrendingUp className="text-emerald-500 text-3xl bs-icon-pulse" />
              Эң көп сатылгандар
            </h2>

            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="bs-line h-[2px] bg-gradient-to-r from-transparent to-emerald-500 rounded-full" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="bs-line h-[2px] bg-gradient-to-l from-transparent to-emerald-500 rounded-full" />
            </div>

            <p className="bs-title-anim text-gray-500 mt-3 max-w-xl mx-auto text-sm" style={{ animationDelay: '.1s' }}>
              Кардарлардын эң көп тандоосу — мыкты сапаттын белгиси
            </p>
          </div>

          {/* ====== PRODUCTS GRID ====== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bestSellers.map((product, i) => {
              const rank = getRank(i);
              const faved = isFavorite(product.id || product._id);
              const popularity = product.popularity || 0;
              const sellerName = product.seller || product.seller?.name || 'Nooruz Market';

              return (
                <div
                  key={product.id || product._id}
                  className={`bs-card ${visible ? 'visible' : ''}`}
                  style={{ animationDelay: visible ? `${i * 0.06}s` : '0s' }}
                >
                  <div className="bs-card-inner bg-white rounded-2xl overflow-hidden border-2 border-gray-100 cursor-pointer">

                    {/* ====== IMAGE ====== */}
                    <div
                      className="relative h-48 bg-gray-50 overflow-hidden"
                      onClick={() => onProductClick?.(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="bs-image w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* RANK BADGE */}
                      {rank && (
                        <div className={`bs-rank absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-br ${rank.bg} text-white font-bold text-xs shadow-md flex items-center gap-1`}>
                          <span>{rank.emoji}</span>
                          <span>{rank.label}</span>
                        </div>
                      )}

                      {/* HIT BADGE */}
                      {popularity >= 90 && !rank && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-red-500 text-white font-bold text-[10px] shadow-md">
                          🔥 ХИТ
                        </div>
                      )}

                      {/* FAVORITE */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                        className={`bs-fav-btn absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center text-gray-400 shadow-sm ${
                          faved ? 'faved' : ''
                        }`}
                        aria-label="Тандалма"
                      >
                        <FiHeart className="text-sm" />
                      </button>

                      {/* SALE/RETAIL BADGES (ProductCard стилинде) */}
                      <div className="absolute bottom-3 right-3 flex gap-1">
                        {(product.saleType === 'both' || product.saleType === 'wholesale') && (
                          <span className="px-2 py-1 rounded-md bg-yellow-500 text-white text-[9px] font-bold shadow-sm">
                            ОПТОМ
                          </span>
                        )}
                        {(product.saleType === 'both' || product.saleType === 'retail') && (
                          <span className="px-2 py-1 rounded-md bg-emerald-500 text-white text-[9px] font-bold shadow-sm">
                            РОЗНИЦА
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ====== INFO ====== */}
                    <div className="p-4">
                      {/* Title */}
                      <h3
                        className="text-base font-bold text-gray-800 mb-1.5 line-clamp-1 hover:text-emerald-600 transition-colors"
                        onClick={() => onProductClick?.(product)}
                      >
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-2">
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
                        <span className="text-xs text-gray-600 font-semibold">
                          {(product.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({product.reviews || 0})
                        </span>
                      </div>

                      {/* Seller */}
                      <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
                        <FiUser className="text-emerald-500 text-xs" />
                        <span className="truncate">{sellerName}</span>
                      </div>

                      {/* Popularity bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] font-semibold mb-1">
                          <span className="text-emerald-600 flex items-center gap-1">
                            <FiTrendingUp className="text-xs" />
                            Популярдуулук
                          </span>
                          <span className="text-gray-500">{popularity}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="bs-popularity-fill h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                            style={{ width: `${popularity}%` }}
                          />
                        </div>
                      </div>

                      {/* Price + Cart */}
                      <div className="flex items-end justify-between pt-2 border-t border-gray-100">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-emerald-600">
                              {product.price?.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">сом</span>
                          </div>
                          {product.originalPrice && (
                            <p className="text-[11px] text-gray-400 line-through">
                              {product.originalPrice} сом
                            </p>
                          )}
                          {product.wholesalePrice && (
                            <p className="text-[10px] text-yellow-600 font-semibold">
                              Оптом: {product.wholesalePrice} сом
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, false);
                          }}
                          className="bs-cart-btn w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-md"
                          aria-label="Себетке кошуу"
                        >
                          <FiShoppingCart className="text-base" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ====== "БАРДЫК ТОВАРЛАР" КНОПКА ====== */}
          <div className="text-center mt-10">
            <button
              onClick={() => {
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bs-all-btn inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md"
            >
              <FiAward className="text-base" />
              Бардык товарларды көрүү
              <FiChevronRight className="text-base" />
            </button>
          </div>

        </div>
      </section>
    </>
  );
};

export default BestSellers;
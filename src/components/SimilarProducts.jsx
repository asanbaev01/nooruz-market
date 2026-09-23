import React, { useMemo, useRef, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiStar,
  FiHeart,
  FiTrendingUp,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const SimilarProducts = ({ currentProduct, onProductClick }) => {
  const { products, addToCart, isFavorite, toggleFavorite, showToast } = useApp();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  /* ====== ОКШОШ ТОВАРЛАРДЫ ТАБУУ (АКЫЛДУУ АЛГОРИТМ) ====== */
  const similarProducts = useMemo(() => {
    if (!currentProduct || !products?.length) return [];

    const currentId = currentProduct.id || currentProduct._id;
    const currentPrice = currentProduct.price || 0;
    const currentCategory = currentProduct.category;

    /* Ар бир товарга "окшоштук упайын" эсептейбиз */
    const scored = products
      .filter((p) => (p.id || p._id) !== currentId) // өзүн алып салуу
      .map((p) => {
        let score = 0;

        /* 1. Категория окшоштугу (+50 упай) */
        if (p.category === currentCategory) score += 50;

        /* 2. Баа жакындыгы (эң көп +30 упай) */
        const priceDiff = Math.abs(p.price - currentPrice);
        const priceRatio = priceDiff / Math.max(currentPrice, 1);
        if (priceRatio <= 0.2) score += 30;
        else if (priceRatio <= 0.5) score += 20;
        else if (priceRatio <= 1) score += 10;

        /* 3. Сатуучу окшоштугу (+15 упай) */
        if (p.seller && p.seller === currentProduct.seller) score += 15;

        /* 4. Badge окшоштугу (+10 упай) */
        if (p.badge && p.badge === currentProduct.badge) score += 10;

        /* 5. Популярдуулук (+10 упай) */
        if (p.popularity > 70) score += 10;
        else if (p.popularity > 40) score += 5;

        /* 6. Камыпада бар (+5 упай) */
        if (p.inStock) score += 5;

        return { ...p, _score: score };
      })
      .filter((p) => p._score > 20) // өтө начар окшоштуктарды алып салуу
      .sort((a, b) => b._score - a._score) // эң жакындары жогору
      .slice(0, 8); // 8 товар гана

    return scored;
  }, [currentProduct, products]);

  /* ====== СКРОЛЛ БАШКАРУУ ====== */
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(updateScrollButtons, 400);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, false);
  };

  const handleToggleFavorite = (product, e) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  if (similarProducts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes similarIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardSlideIn {
          0% { opacity: 0; transform: translateX(20px) scale(.95); }
          60% { transform: translateX(-4px) scale(1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes arrowPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .similar-section { animation: similarIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .similar-card {
          animation: cardSlideIn .5s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .similar-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.35);
        }
        .similar-card:hover img {
          transform: scale(1.1) rotate(-3deg);
        }
        .similar-card img {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .similar-scroll {
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .similar-scroll::-webkit-scrollbar { display: none; }
        .similar-arrow {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .similar-arrow:hover {
          transform: scale(1.15);
          background: #10B981;
          color: white;
        }
        .similar-arrow:active {
          transform: scale(.9);
        }
        .similar-cart-btn {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .similar-cart-btn:hover {
          transform: scale(1.15);
          background: #10B981;
          color: white;
        }
        .similar-cart-btn:active {
          transform: scale(.9);
        }
        .similar-fav-btn {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .similar-fav-btn:hover {
          transform: scale(1.15);
        }
        .similar-fav-btn.faved {
          color: #ef4444;
          fill: #ef4444;
        }
      `}</style>

      <div className="similar-section mt-6 bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
        {/* ====== HEADER ====== */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <FiTrendingUp className="text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800 leading-tight">
                Муну менен алышат
              </h3>
              <p className="text-[11px] text-gray-500">
                Окшош товарлар ({similarProducts.length})
              </p>
            </div>
          </div>

          {/* Arrows (desktop) */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="similar-arrow w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              aria-label="Артка"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="similar-arrow w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              aria-label="Алдыга"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* ====== PRODUCTS SCROLLER ====== */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="similar-scroll flex gap-3 overflow-x-auto pb-1"
        >
          {similarProducts.map((product, i) => {
            const faved = isFavorite(product.id || product._id);
            return (
              <div
                key={product.id || product._id}
                onClick={() => onProductClick?.(product)}
                className="similar-card flex-shrink-0 w-[160px] bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Image */}
                <div className="relative h-[110px] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-500 text-white shadow">
                      {product.badgeText || product.badge}
                    </span>
                  )}

                  {/* Favorite */}
                  <button
                    onClick={(e) => handleToggleFavorite(product, e)}
                    className={`similar-fav-btn absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-gray-400 shadow ${
                      faved ? 'faved' : ''
                    }`}
                    aria-label="Тандалма"
                  >
                    <FiHeart className="text-xs" />
                  </button>

                  {/* Add to cart (hover) */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="similar-cart-btn absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg"
                    aria-label="Себетке"
                  >
                    <FiShoppingCart className="text-sm" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-1 mb-1">
                    {product.name}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <FiStar className="text-yellow-400 fill-yellow-400 text-[10px]" />
                    <span className="text-[10px] text-gray-500 font-medium">
                      {(product.rating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className="text-[10px] text-gray-400">
                      {product.reviews || 0}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-600 text-sm">
                      {product.price?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400">сом</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <p className="text-[10px] text-gray-400 text-center mt-3">
          💡 Сыдырып көрүңүз — дагы {similarProducts.length} товар
        </p>
      </div>
    </>
  );
};

export default SimilarProducts;
import React, { useState } from 'react';
import { FiShoppingCart, FiStar, FiPackage, FiHome, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ProductCard = ({ product, onDetail }) => {
  const { addToCart } = useApp();
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedWholesale, setAddedWholesale] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const renderStars = () => Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(product.rating);
    return (
      <FiStar
        key={i}
        className="star-icon"
        style={{
          fill: filled ? '#006948' : 'none',
          color: filled ? '#006948' : '#d1d5db',
          animationDelay: `${i * 0.06}s`,
        }}
      />
    );
  });

  const badgeClass = {
    new: 'bg-primary text-white',
    hit: 'bg-gray-900 text-white',
    sale: 'bg-red-600 text-white',
    popular: 'bg-gray-200 text-primary',
    organic: 'bg-green-200 text-green-900',
  }[product.badge] || '';

  const handleAddToCart = (e, wholesale) => {
    e.stopPropagation();
    addToCart(product, wholesale);
    if (wholesale) {
      setAddedWholesale(true);
      setTimeout(() => setAddedWholesale(false), 1200);
    } else {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1200);
    }
  };

  return (
    <>
      <style>{`
        /* ====== CARD ENTRY ====== */
        @keyframes cardEnter {
          0% { opacity: 0; transform: translateY(30px) scale(.96); }
          60% { transform: translateY(-6px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .product-card {
          animation: cardEnter .6s cubic-bezier(.34,1.56,.64,1) both;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .5s cubic-bezier(.34,1.56,.64,1),
                      border-color .4s ease;
          will-change: transform;
        }
        .product-card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 25px 50px -15px rgba(124,108,255,.35);
          border-color: rgba(124,108,255,.4);
        }

        /* ====== SHINE OVERLAY ====== */
        .product-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-150%) skewX(-20deg);
          transition: transform 1s ease;
          pointer-events: none;
          z-index: 5;
        }
        .product-card:hover::before {
          transform: translateX(600%) skewX(-20deg);
        }

        /* ====== BADGE ====== */
        @keyframes badgeIn {
          0% { opacity: 0; transform: translateX(-20px) scale(.7); }
          60% { transform: translateX(2px) scale(1.08); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .product-badge {
          animation: badgeIn .5s cubic-bezier(.34,1.56,.64,1) .1s both,
                     badgePulse 2.5s ease-in-out infinite 0.6s;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
          will-change: transform;
        }
        .product-card:hover .product-badge {
          transform: scale(1.12);
        }

        /* ====== STOCK STATUS ====== */
        .stock-status {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .product-card:hover .stock-status {
          transform: translateX(-4px);
        }

        /* ====== SALE TYPE TAGS ====== */
        @keyframes tagSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sale-tag {
          animation: tagSlideIn .4s cubic-bezier(.34,1.56,.64,1) both;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .product-card:hover .sale-tag {
          transform: translateX(-4px) scale(1.05);
        }

        /* ====== IMAGE ====== */
        .product-image-wrap {
          position: relative;
          overflow: hidden;
        }
        .product-image {
          transition: transform .8s cubic-bezier(.22,1,.36,1),
                      filter .5s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.15) rotate(-2deg);
          filter: brightness(1.05);
        }

        /* Image placeholder */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .img-placeholder {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        /* ====== TITLE ====== */
        .product-title {
          transition: color .3s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .product-card:hover .product-title {
          color: #7C6CFF;
          transform: translateX(2px);
        }

        /* ====== STARS ====== */
        @keyframes starPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .star-icon {
          animation: starPop .4s cubic-bezier(.34,1.56,.64,1) both;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
          width: 14px;
          height: 14px;
        }
        .product-card:hover .star-icon {
          transform: scale(1.15) rotate(-10deg);
        }

        /* ====== SELLER ROW ====== */
        .seller-row {
          transition: color .3s ease, transform .3s ease;
        }
        .seller-row svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .product-card:hover .seller-row {
          color: #7C6CFF;
          transform: translateX(2px);
        }
        .product-card:hover .seller-row svg {
          transform: rotate(-12deg) scale(1.15);
        }

        /* ====== PRICE ====== */
        @keyframes priceGlow {
          0%, 100% { text-shadow: 0 0 0 transparent; }
          50% { text-shadow: 0 0 12px rgba(124,108,255,.5); }
        }
        .product-price {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .product-card:hover .product-price {
          transform: scale(1.08);
          animation: priceGlow 2s ease-in-out infinite;
        }

        /* ====== CART BUTTONS ====== */
        .cart-btn {
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-100%);
          transition: transform .6s ease;
        }
        .cart-btn:hover::before {
          transform: translateX(100%);
        }
        .cart-btn:hover {
          transform: translateY(-3px) scale(1.1);
          box-shadow: 0 10px 20px -6px rgba(0,0,0,.3);
        }
        .cart-btn:active {
          transform: scale(.9);
        }
        .cart-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          z-index: 1;
        }
        .cart-btn:hover svg {
          transform: rotate(-12deg) scale(1.15);
        }

        /* Added state */
        @keyframes addedPulse {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          60% { transform: scale(.95); }
          100% { transform: scale(1); }
        }
        .cart-btn.added {
          animation: addedPulse .8s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-btn.added::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #10B981;
          color: white;
          font-weight: bold;
          font-size: 18px;
          border-radius: inherit;
          animation: addedPulse .8s cubic-bezier(.34,1.56,.64,1);
          z-index: 2;
        }

        /* ====== FLOATING PARTICLES ====== */
        @keyframes particleRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: .8; }
          80% { opacity: .8; }
          100% { transform: translateY(-80px) scale(1.3); opacity: 0; }
        }
        .card-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          animation: particleRise 6s linear infinite;
          z-index: 3;
        }
        .product-card:hover .card-particle {
          opacity: .6;
        }

        /* ====== CONFETTI (on add to cart) ====== */
        @keyframes confettiBurst {
          0% { transform: translate(0, 0) scale(1) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          animation: confettiBurst .8s cubic-bezier(.22,1,.36,1) forwards;
          z-index: 10;
        }
      `}</style>

      <div
        className="product-card bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col relative cursor-pointer"
        onClick={() => onDetail(product)}
      >
        {/* Particles inside card (visible on hover) */}
        <span
          className="card-particle w-1.5 h-1.5 bg-purple-400"
          style={{ left: '15%', bottom: '10%', animationDelay: '0s' }}
        />
        <span
          className="card-particle w-1 h-1 bg-green-400"
          style={{ left: '70%', bottom: '20%', animationDelay: '2s' }}
        />
        <span
          className="card-particle w-1.5 h-1.5 bg-yellow-400"
          style={{ left: '40%', bottom: '5%', animationDelay: '4s' }}
        />

        {/* Badge */}
        <div className="absolute top-4 left-4 z-10">
          {product.badge && (
            <span className={`product-badge text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeClass}`}>
              {product.badgeText}
            </span>
          )}
        </div>

        {/* Stock + Sale type */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1">
          <span
            className={`stock-status text-xs flex items-center gap-1 ${
              product.inStock ? 'text-primary' : 'text-red-500'
            }`}
          >
            {product.inStock ? <FiCheckCircle /> : <FiXCircle />}
            {product.inStock ? 'Бар' : 'Жок'}
          </span>
          <div className="flex gap-1">
            {(product.saleType === 'both' || product.saleType === 'wholesale') && (
              <span className="sale-tag bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ animationDelay: '.2s' }}>
                Оптом
              </span>
            )}
            {(product.saleType === 'both' || product.saleType === 'retail') && (
              <span className="sale-tag bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ animationDelay: '.3s' }}>
                Розница
              </span>
            )}
          </div>
        </div>

        {/* Image */}
        <div className={`product-image-wrap h-48 mb-4 rounded-lg ${!imgLoaded ? 'img-placeholder' : 'bg-gray-100'}`}>
          <img
            src={product.image}
            alt={product.name}
            className="product-image w-full h-full object-cover"
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        </div>

        {/* Title */}
        <h3 className="product-title font-semibold text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {renderStars()}
          <span className="text-xs ml-1 text-gray-500">({product.reviews})</span>
        </div>

        {/* Seller */}
        <div className="seller-row text-xs text-gray-400 mb-2 flex items-center gap-1">
          <FiHome /> {product.seller}
        </div>

        {/* Price + Buttons */}
        <div className="mt-auto flex justify-between items-center">
          <div>
            <span className="product-price text-xl font-bold text-primary block">
              {product.price} сом
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through block">
                {product.originalPrice} сом
              </span>
            )}
            {product.wholesalePrice && (
              <span className="text-xs text-yellow-600 font-medium block">
                Оптом: {product.wholesalePrice} сом
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {product.wholesalePrice && (
              <button
                onClick={(e) => handleAddToCart(e, true)}
                className={`cart-btn bg-yellow-500/10 text-yellow-600 p-3 rounded-lg hover:bg-yellow-500 hover:text-white ${
                  addedWholesale ? 'added' : ''
                }`}
                title="Оптом кошуу"
              >
                <FiPackage />
              </button>
            )}
            <button
              onClick={(e) => handleAddToCart(e, false)}
              className={`cart-btn bg-primary/10 text-primary p-3 rounded-lg hover:bg-primary hover:text-white ${
                addedToCart ? 'added' : ''
              }`}
              title="Себетке кошуу"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>

        {/* Confetti (visible during added) */}
        {addedToCart && (
          <>
            <span className="confetti-piece bg-primary" style={{ top: '50%', right: '10%', '--tx': '-40px', '--ty': '-30px' }} />
            <span className="confetti-piece bg-yellow-500" style={{ top: '50%', right: '10%', '--tx': '-20px', '--ty': '-50px' }} />
            <span className="confetti-piece bg-green-500" style={{ top: '50%', right: '10%', '--tx': '20px', '--ty': '-40px' }} />
            <span className="confetti-piece bg-red-500" style={{ top: '50%', right: '10%', '--tx': '40px', '--ty': '-20px' }} />
            <span className="confetti-piece bg-purple-500" style={{ top: '50%', right: '10%', '--tx': '-30px', '--ty': '20px' }} />
            <span className="confetti-piece bg-pink-500" style={{ top: '50%', right: '10%', '--tx': '30px', '--ty': '30px' }} />
          </>
        )}
      </div>
    </>
  );
};

export default ProductCard;
import React, { useState, useEffect } from 'react';
import { FiX, FiShoppingCart, FiPackage, FiStar, FiCheckCircle, FiXCircle, FiMapPin, FiAward, FiHeart, FiShare2 } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import ProductReviews from './ProductReviews';
import SimilarProducts from './SimilarProducts';
import ShareModal from './ShareModal';

const ProductDetailModal = ({ product, onClose, onProductChange }) => {
  const { addToCart, showToast } = useApp();
  const [addedRetail, setAddedRetail] = useState(false);
  const [addedWholesale, setAddedWholesale] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [faved, setFaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (product) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [product]);

  /* Товар өзгөргөндө галереяны башына кайтаруу */
  useEffect(() => {
    setActiveImage(0);
    setAddedRetail(false);
    setAddedWholesale(false);
  }, [product]);

  if (!product) return null;

  const renderStars = () => Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(product.rating);
    return (
      <FiStar
        key={i}
        className="detail-star"
        style={{
          fill: filled ? '#006948' : 'none',
          color: filled ? '#006948' : '#d1d5db',
          animationDelay: `${i * 0.08}s`,
          width: '18px',
          height: '18px',
        }}
      />
    );
  });

  const handleAdd = (wholesale) => {
    addToCart(product, wholesale);
    if (wholesale) {
      setAddedWholesale(true);
      setTimeout(() => setAddedWholesale(false), 1400);
    } else {
      setAddedRetail(true);
      setTimeout(() => setAddedRetail(false), 1400);
    }
  };

  const handleSimilarProductClick = (newProduct) => {
    if (onProductChange) {
      onProductChange(newProduct);
    }
  };

  /* ====== САТУУЧУ АТЫН ТАЗАЛОО ====== */
  const getSellerName = () => {
    if (!product.seller) return 'Белгисиз';
    /* Эгер ID сыяктуу узун болсо — "Сатуучу" деп көрсөтөбүз */
    if (product.seller.length > 20) return 'Nooruz Market';
    return product.seller;
  };

  const images = [product.image, product.image, product.image];

  return (
    <>
      <style>{`
        /* ====== OVERLAY ====== */
        @keyframes overlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        .detail-overlay {
          animation: overlayIn .4s ease-out both;
          overflow-y: auto !important;
        }

        /* ====== MODAL ENTRANCE ====== */
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(.9) translateY(30px); }
          60% { transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .detail-modal {
          animation: modalIn .55s cubic-bezier(.34,1.56,.64,1) both;
          will-change: transform;
          margin-top: 20px;
          margin-bottom: 20px;
        }

        /* ====== STICKY CLOSE (X баскычы дайым көрүнөт) ====== */
        .detail-sticky-close {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          margin: -24px -24px 16px -24px;
          padding-left: 24px;
          padding-right: 24px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-radius: 24px 24px 0 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        /* ====== GLASS SHINE ====== */
        .detail-modal::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-150%) skewX(-20deg);
          pointer-events: none;
          z-index: 10;
        }

        /* ====== BACKGROUND BLOBS ====== */
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.15); }
        }
        .detail-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: .12;
          pointer-events: none;
          animation: blobMove 10s ease-in-out infinite;
        }

        /* ====== CLOSE BUTTON ====== */
        .detail-close {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          flex-shrink: 0;
        }
        .detail-close:hover {
          transform: rotate(90deg) scale(1.15);
          color: #ef4444;
          background: #fee2e2;
        }

        /* ====== MAIN IMAGE ====== */
        .detail-main-image-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          background: #f3f4f6;
        }
        .detail-main-image {
          transition: transform .7s cubic-bezier(.34,1.56,.64,1);
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ====== THUMBNAILS (оңдолду) ====== */
        .detail-thumb {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          background: #f3f4f6;
          border: 2px solid transparent;
          flex-shrink: 0;
          position: relative;
        }
        .detail-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .detail-thumb:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 10px 20px -8px rgba(0, 105, 72, .4);
        }
        .detail-thumb.active {
          border-color: #006948;
          box-shadow: 0 0 0 3px rgba(0, 105, 72, .2);
        }

        /* ====== STARS ====== */
        @keyframes starPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .detail-star {
          animation: starPop .5s cubic-bezier(.34,1.56,.64,1) both;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .detail-star:hover {
          transform: scale(1.3) rotate(-12deg);
        }

        /* ====== PRICE ====== */
        .detail-price {
          display: inline-block;
        }

        /* ====== INFO CARDS ====== */
        @keyframes cardSlideIn {
          0% { opacity: 0; transform: translateX(-20px); }
          60% { transform: translateX(2px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .detail-info-card {
          animation: cardSlideIn .5s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .detail-info-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px -8px rgba(0, 105, 72, .3);
        }

        /* ====== CART BUTTONS ====== */
        .detail-cart-btn {
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .detail-cart-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-100%);
          transition: transform .7s ease;
        }
        .detail-cart-btn:hover::before {
          transform: translateX(100%);
        }
        .detail-cart-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 30px -10px rgba(0,0,0,.3);
        }
        .detail-cart-btn:active {
          transform: scale(.96);
        }

        /* Added state */
        @keyframes addedPulse {
          0% { transform: scale(1); }
          30% { transform: scale(1.08); }
          60% { transform: scale(.97); }
          100% { transform: scale(1); }
        }
        .detail-cart-btn.added {
          animation: addedPulse .8s cubic-bezier(.34,1.56,.64,1);
          background: #10B981 !important;
        }

        /* ====== HEART ====== */
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.25); }
          50% { transform: scale(1); }
          75% { transform: scale(1.15); }
        }
        .detail-heart {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .detail-heart:hover {
          transform: scale(1.15);
        }
        .detail-heart.faved {
          color: #ef4444;
          fill: #ef4444;
          animation: heartBeat .8s ease-in-out;
        }

        /* ====== CONFETTI ====== */
        @keyframes confettiBurst {
          0% { transform: translate(0, 0) scale(1) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          animation: confettiBurst 1s cubic-bezier(.22,1,.36,1) forwards;
          z-index: 20;
        }

        /* ====== FEATURE PULSE ====== */
        @keyframes pulseCheck {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,232,176,.4); }
          50% { box-shadow: 0 0 0 8px rgba(34,232,176,0); }
        }
        .in-stock-pulse {
          animation: pulseCheck 2.5s ease-in-out infinite;
        }

        /* ====== MOBILE ====== */
        @media (max-width: 640px) {
          .detail-sticky-close {
            margin: -24px -24px 12px -24px;
            padding: 10px 24px;
          }
          .detail-thumb {
            width: 64px;
            height: 64px;
          }
        }
      `}</style>

      <div
        className="detail-overlay fixed inset-0 z-[65] flex items-start justify-center px-4 bg-black/40 backdrop-blur-sm py-4"
        onClick={onClose}
      >
        <div
          className="detail-modal relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background blobs */}
          <div className="detail-blob bg-purple-500 w-64 h-64 -top-20 -right-20" />
          <div className="detail-blob bg-green-400 w-48 h-48 -bottom-20 -left-20" style={{ animationDelay: '3s' }} />

          {/* ============================================================
              ✅ STICKY CLOSE BAR — ДАЙЫМ КӨРҮНӨТ
              ============================================================ */}
          <div className="detail-sticky-close">
            {/* Сол жак: Heart + Share */}
            <div className="flex gap-2">
              <button
                onClick={() => setFaved(!faved)}
                className={`detail-heart w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${
                  faved ? 'faved' : 'text-gray-400'
                }`}
                aria-label="Тандалмаларга кошуу"
              >
                <FiHeart className="text-lg" />
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="detail-heart w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary"
                aria-label="Бөлүшүү"
              >
                <FiShare2 className="text-lg" />
              </button>
            </div>

            {/* Оң жак: X (жабуу) */}
            <button
              onClick={onClose}
              className="detail-close w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-100"
              aria-label="Жабуу"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ====== LEFT: GALLERY ====== */}
            <div className="space-y-4">
              <div className="detail-main-image-wrap h-64 md:h-80">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="detail-main-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full uppercase bg-primary text-white shadow-lg z-10">
                    {product.badgeText || product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`detail-thumb ${activeImage === i ? 'active' : ''}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=IMG';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* ====== RIGHT: INFO ====== */}
            <div className="space-y-5">

              {/* Title + Badge */}
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  {product.badge && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-primary text-white">
                      {product.badgeText || product.badge}
                    </span>
                  )}
                </div>

                {/* Sale type tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(product.saleType === 'both' || product.saleType === 'wholesale') && (
                    <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">Оптом</span>
                  )}
                  {(product.saleType === 'both' || product.saleType === 'retail') && (
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Розница</span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  {renderStars()}
                  <span className="text-sm text-gray-500">({product.reviews || 0} оюн)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-3xl font-bold text-primary">
                    {product.price} сом
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {product.originalPrice} сом
                    </span>
                  )}
                  {product.wholesalePrice && (
                    <span className="text-yellow-600 font-bold text-lg">
                      Оптом: {product.wholesalePrice} сом
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Info cards */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="detail-info-card bg-gray-50 p-3 rounded-xl" style={{ animationDelay: '.1s' }}>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <FiMapPin /> Өлкө
                  </span>
                  <p className="font-bold">{product.origin || 'Кыргызстан'}</p>
                </div>
                <div className="detail-info-card bg-gray-50 p-3 rounded-xl" style={{ animationDelay: '.2s' }}>
                  <span className="text-gray-500 text-xs flex items-center gap-1">
                    <FiAward /> Салмагы
                  </span>
                  <p className="font-bold">{product.weight || '—'}</p>
                </div>
                <div className="detail-info-card bg-gray-50 p-3 rounded-xl" style={{ animationDelay: '.3s' }}>
                  <span className="text-gray-500 text-xs">Статус</span>
                  <p className={`font-bold flex items-center gap-1 ${
                    product.inStock ? 'text-primary' : 'text-red-500'
                  } ${product.inStock ? 'in-stock-pulse' : ''}`}>
                    {product.inStock ? <FiCheckCircle /> : <FiXCircle />}
                    {product.inStock ? 'Камыпада бар' : 'Жок'}
                  </p>
                </div>
                <div className="detail-info-card bg-gray-50 p-3 rounded-xl" style={{ animationDelay: '.4s' }}>
                  <span className="text-gray-500 text-xs">Сатуучу</span>
                  <p className="font-bold truncate">{getSellerName()}</p>
                </div>
              </div>

              {/* Cart buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleAdd(false)}
                  className={`detail-cart-btn flex-1 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                    addedRetail ? 'added' : ''
                  }`}
                >
                  <FiShoppingCart /> Розница
                </button>
                {product.wholesalePrice && (
                  <button
                    onClick={() => handleAdd(true)}
                    className={`detail-cart-btn flex-1 bg-yellow-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                      addedWholesale ? 'added' : ''
                    }`}
                  >
                    <FiPackage /> Оптом
                  </button>
                )}
              </div>

              {/* Confetti */}
              {addedRetail && (
                <>
                  <span className="confetti-piece bg-primary" style={{ top: '80%', left: '30%', '--tx': '-40px', '--ty': '-60px' }} />
                  <span className="confetti-piece bg-yellow-500" style={{ top: '80%', left: '30%', '--tx': '40px', '--ty': '-70px' }} />
                  <span className="confetti-piece bg-green-500" style={{ top: '80%', left: '30%', '--tx': '-60px', '--ty': '-20px' }} />
                  <span className="confetti-piece bg-red-500" style={{ top: '80%', left: '30%', '--tx': '60px', '--ty': '-30px' }} />
                  <span className="confetti-piece bg-purple-500" style={{ top: '80%', left: '30%', '--tx': '0px', '--ty': '-80px' }} />
                  <span className="confetti-piece bg-pink-500" style={{ top: '80%', left: '30%', '--tx': '-80px', '--ty': '-50px' }} />
                </>
              )}
            </div>
          </div>

          {/* ОКШОШ ТОВАРЛАР */}
          <div className="relative z-10 mt-6">
            <SimilarProducts
              currentProduct={product}
              onProductClick={handleSimilarProductClick}
            />
          </div>

          {/* ПИКИРЛЕР */}
          <div className="relative z-10 mt-6">
            <ProductReviews productId={product.id || product._id} />
          </div>

        </div>
      </div>

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductDetailModal;
import React, { useState, useEffect, useRef } from 'react';
import {
  FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiShoppingCart,
  FiCreditCard, FiTruck, FiShield, FiTag, FiAward,
  FiChevronRight, FiPackage, FiGift, FiCheck, FiStar, FiHeart
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, removeFromCart, changeQuantity, clearCart } = useApp();
  const [removingIds, setRemovingIds] = useState([]);
  const [bouncingId, setBouncingId] = useState(null);
  const [ripples, setRipples] = useState({});
  const [confetti, setConfetti] = useState(false);
  const [prevTotal, setPrevTotal] = useState(cartTotal);

  /* ====== FREE DELIVERY THRESHOLD ====== */
  const FREE_DELIVERY_FROM = 1500;
  const progress = Math.min((cartTotal / FREE_DELIVERY_FROM) * 100, 100);
  const remaining = Math.max(FREE_DELIVERY_FROM - cartTotal, 0);
  const isFreeDelivery = remaining === 0 && cartTotal > 0;

  /* ====== CONFETTI TRIGGER ====== */
  useEffect(() => {
    if (isFreeDelivery && prevTotal < FREE_DELIVERY_FROM && cartTotal >= FREE_DELIVERY_FROM) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2500);
    }
    setPrevTotal(cartTotal);
  }, [cartTotal, isFreeDelivery, prevTotal]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleRemove = (id, isWholesale) => {
    const key = `${id}-${isWholesale}`;
    setRemovingIds((prev) => [...prev, key]);
    setTimeout(() => {
      removeFromCart(id, isWholesale);
      setRemovingIds((prev) => prev.filter((k) => k !== key));
    }, 400);
  };

  const handleQuantity = (id, isWholesale, delta, e) => {
    const key = `${id}-${isWholesale}`;
    setBouncingId(key);
    setTimeout(() => setBouncingId(null), 450);
    
    /* Ripple effect */
    if (e) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rippleId = Date.now();
      setRipples(prev => ({ ...prev, [`${key}-${rippleId}`]: { x, y, key, id: rippleId } }));
      setTimeout(() => {
        setRipples(prev => {
          const copy = { ...prev };
          delete copy[`${key}-${rippleId}`];
          return copy;
        });
      }, 600);
    }
    
    changeQuantity(id, isWholesale, delta);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* ====== SPARKLE PARTICLES ====== */
  const sparks = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));

  return (
    <>
      <style>{`
        /* ============================================================
           OVERLAY
           ============================================================ */
        @keyframes overlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(14px); }
        }
        .cart-overlay { animation: overlayIn .5s ease-out both; }

        /* ============================================================
           SIDEBAR ENTRANCE
           ============================================================ */
        @keyframes sidebarIn {
          0% { transform: translateX(100%) scale(.95); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .cart-sidebar {
          animation: sidebarIn .6s cubic-bezier(.34,1.56,.64,1) both;
          will-change: transform;
        }

        /* ============================================================
           BACKGROUND DECORATION - ANIMATED BLOBS
           ============================================================ */
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.15); }
          66% { transform: translate(30px, -20px) scale(.95); }
        }
        .cart-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: .15;
          pointer-events: none;
          animation: blobFloat 14s ease-in-out infinite;
        }

        /* ============================================================
           SPARKLE PARTICLES
           ============================================================ */
        @keyframes sparkFloat {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          20% { opacity: 1; transform: translateY(-10px) scale(1); }
          100% { transform: translateY(-80px) scale(0); opacity: 0; }
        }
        .spark {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, #34d399 0%, #10b981 50%, transparent 100%);
          pointer-events: none;
          animation: sparkFloat linear infinite;
        }

        /* ============================================================
           HEADER ICON
           ============================================================ */
        @keyframes bagPulse {
          0%, 100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.12) rotate(-6deg); }
        }
        .cart-bag-icon { animation: bagPulse 3s ease-in-out infinite; }

        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 8px 20px -6px rgba(16,185,129,.5), 0 0 0 0 rgba(16,185,129,.4); }
          50% { box-shadow: 0 8px 20px -6px rgba(16,185,129,.6), 0 0 0 12px rgba(16,185,129,0); }
        }
        .icon-glow { animation: iconGlow 2.5s ease-in-out infinite; }

        /* ============================================================
           CLOSE BUTTON
           ============================================================ */
        .cart-close {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-close:hover {
          transform: rotate(90deg) scale(1.15);
          color: #ef4444;
          background: #fee2e2;
          box-shadow: 0 6px 16px -4px rgba(239,68,68,.4);
        }

        /* ============================================================
           EMPTY STATE
           ============================================================ */
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes emptyFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ringPulse {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .cart-empty-icon { animation: emptyFloat 4s ease-in-out infinite; }
        .cart-empty-text { animation: emptyFade .7s cubic-bezier(.34,1.56,.64,1) .2s both; }
        .empty-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid #10b981;
          animation: ringPulse 2.5s ease-out infinite;
        }

        /* ============================================================
           CART ITEM
           ============================================================ */
        @keyframes itemIn {
          0% { opacity: 0; transform: translateX(50px) scale(.85); }
          60% { transform: translateX(-6px) scale(1.03); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes itemOut {
          0% { opacity: 1; transform: translateX(0) scale(1); max-height: 220px; }
          40% { opacity: .5; transform: translateX(60px) scale(.9); }
          100% { opacity: 0; transform: translateX(140px) scale(.6); max-height: 0; padding: 0; margin: 0; }
        }
        .cart-item {
          animation: itemIn .55s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          border: 1.5px solid rgba(16, 185, 129, 0.12);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.03),
            0 2px 4px -1px rgba(0, 0, 0, 0.02),
            inset 0 1px 0 rgba(255,255,255,.8);
          position: relative;
          overflow: hidden;
        }
        .cart-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #10b981, #34d399, #10b981);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-item:hover::before { transform: scaleY(1); }
        .cart-item.removing {
          animation: itemOut .4s ease-in forwards;
          pointer-events: none;
        }
        .cart-item:hover {
          transform: translateY(-3px) scale(1.01);
          box-shadow: 
            0 20px 35px -12px rgba(16,185,129,.3),
            0 0 0 1px rgba(16,185,129,.3),
            inset 0 1px 0 rgba(255,255,255,.8);
          border-color: rgba(16,185,129,.4) !important;
        }

        /* ============================================================
           IMAGE WITH GRADIENT RING
           ============================================================ */
        .cart-item-img-wrap {
          position: relative;
          border-radius: 14px;
          padding: 2px;
          background: linear-gradient(135deg, #10b981, #34d399, #6ee7b7, #10b981);
          background-size: 300% 300%;
          transition: background-position .6s ease;
        }
        .cart-item:hover .cart-item-img-wrap {
          background-position: 100% 100%;
        }
        .cart-item-img {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
          border-radius: 12px;
        }
        .cart-item:hover .cart-item-img {
          transform: scale(1.12) rotate(-5deg);
        }

        /* ============================================================
           QUANTITY BUTTONS
           ============================================================ */
        .qty-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          border: 1.5px solid #e2e8f0;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.03);
          position: relative;
          overflow: hidden;
        }
        .qty-btn:hover {
          transform: scale(1.12) translateY(-1px);
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
          border-color: #10B981;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }
        .qty-btn:active { transform: scale(.88); }
        .qty-btn.bounce { animation: qtyBounce .45s cubic-bezier(.34,1.56,.64,1); }
        @keyframes qtyBounce {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.35); }
          70% { transform: scale(.88); }
        }

        /* ============================================================
           RIPPLE EFFECT
           ============================================================ */
        @keyframes rippleAnim {
          0% { transform: scale(0); opacity: .6; }
          100% { transform: scale(3); opacity: 0; }
        }
        .ripple {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,.7);
          pointer-events: none;
          animation: rippleAnim .6s ease-out forwards;
        }

        /* ============================================================
           TRASH BUTTON
           ============================================================ */
        .trash-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          border: 1.5px solid #fecaca;
          background: #fff;
        }
        .trash-btn:hover {
          transform: scale(1.18) rotate(-10deg);
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-color: #ef4444;
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
        }
        .trash-btn:active { transform: scale(.88); }

        /* ============================================================
           CHECKOUT BUTTON - PREMIUM
           ============================================================ */
        .checkout-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%);
          background-size: 200% 200%;
          animation: gradientShift 4s ease infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .checkout-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 120px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-180%) skewX(-20deg);
          animation: shimmerSlide 3s ease-in-out infinite;
        }
        @keyframes shimmerSlide {
          0%, 100% { transform: translateX(-180%) skewX(-20deg); }
          50% { transform: translateX(450%) skewX(-20deg); }
        }
        .checkout-btn:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 
            0 24px 48px -12px rgba(16,185,129,.7),
            0 0 0 3px rgba(16,185,129,.2);
        }
        .checkout-btn:active { transform: scale(.96) translateY(-1px); }
        .checkout-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .checkout-btn:hover svg:last-child {
          transform: translateX(6px);
        }
        .checkout-btn:hover svg:first-child {
          transform: rotate(-8deg) scale(1.15);
        }

        /* ============================================================
           CLEAR BUTTON
           ============================================================ */
        .clear-btn {
          transition: all .3s ease;
        }
        .clear-btn:hover {
          transform: translateY(-2px);
          color: #ef4444;
          background: #fef2f2;
          box-shadow: 0 4px 12px -4px rgba(239,68,68,.3);
        }
        .clear-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .clear-btn:hover svg { transform: rotate(-18deg) scale(1.2); }

        /* ============================================================
           PROGRESS BAR
           ============================================================ */
        @keyframes progressFill {
          from { width: 0; }
        }
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .progress-fill {
          animation: progressFill 1.2s ease-out both;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 12px rgba(16,185,129,.5), inset 0 1px 0 rgba(255,255,255,.3);
        }
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 50px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
          animation: progressShine 2s ease-in-out infinite;
        }

        /* ============================================================
           BADGE
           ============================================================ */
        @keyframes badgePop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.35) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cart-count-badge {
          animation: badgePop .55s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 4px 12px rgba(16,185,129,.5);
        }

        /* ============================================================
           SCROLLBAR
           ============================================================ */
        .cart-items-scroll::-webkit-scrollbar { width: 6px; }
        .cart-items-scroll::-webkit-scrollbar-track { 
          background: transparent; 
          margin: 8px 0;
        }
        .cart-items-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(16,185,129,.3), rgba(16,185,129,.5));
          border-radius: 3px;
        }
        .cart-items-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(16,185,129,.6), rgba(16,185,129,.8));
        }

        /* ============================================================
           FEATURE ITEM
           ============================================================ */
        .feature-item {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .feature-item:hover {
          transform: translateY(-3px);
        }
        .feature-item:hover .feature-icon {
          transform: scale(1.2) rotate(-10deg);
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
          box-shadow: 0 6px 16px rgba(16,185,129,.4);
        }
        .feature-icon {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ============================================================
           TOTAL SECTION
           ============================================================ */
        @keyframes shimmerText {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .total-price {
          background: linear-gradient(90deg, #059669 0%, #10b981 25%, #6ee7b7 50%, #10b981 75%, #059669 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 3s linear infinite;
          filter: drop-shadow(0 2px 4px rgba(16,185,129,.2));
        }
        .total-box {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%);
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
          box-shadow: 
            0 4px 6px -1px rgba(16,185,129,.1),
            inset 0 1px 0 rgba(255,255,255,.9);
          position: relative;
          overflow: hidden;
        }
        .total-box::before {
          content: '';
          position: absolute;
          top: -50%; right: -50%;
          width: 100%; height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,.4) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ============================================================
           CONFETTI
           ============================================================ */
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
          position: fixed;
          top: 0;
          width: 8px;
          height: 8px;
          pointer-events: none;
          z-index: 100;
          animation: confettiFall linear forwards;
        }

        /* ============================================================
           GLASSMORPHISM HEADER/FOOTER
           ============================================================ */
        .glass-header {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
        }
      `}</style>

      {/* ====== CONFETTI ====== */}
      {confetti && (
        <>
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'][Math.floor(Math.random() * 5)],
                animationDuration: `${2 + Math.random() * 1.5}s`,
                animationDelay: `${Math.random() * 0.5}s`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </>
      )}

      {/* ====== OVERLAY ====== */}
      <div
        className={`fixed inset-0 bg-black/50 z-[55] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto cart-overlay' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ====== SIDEBAR ====== */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-white via-white to-emerald-50/50 z-[60] shadow-2xl flex flex-col transition-transform duration-500 overflow-hidden ${
          isOpen ? 'translate-x-0 cart-sidebar' : 'translate-x-full'
        }`}
      >
        {/* ====== DECORATION BLOBS ====== */}
        <div className="cart-blob bg-emerald-400 w-64 h-64 -top-24 -left-24" />
        <div className="cart-blob bg-green-400 w-56 h-56 -bottom-24 -right-24" style={{ animationDelay: '4s' }} />
        <div className="cart-blob bg-teal-400 w-48 h-48 top-1/2 left-1/3" style={{ animationDelay: '8s' }} />

        {/* ====== SPARKLE PARTICLES ====== */}
        {sparks.map((s) => (
          <div
            key={s.id}
            className="spark"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}

        {/* ====== HEADER ====== */}
        <div className="relative z-10 px-6 py-5 border-b border-gray-100/80 glass-header">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="icon-glow w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-white">
                <FiShoppingBag className="text-xl cart-bag-icon" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Сиздин себет
                  {itemCount > 0 && (
                    <span className="cart-count-badge text-xs font-bold bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-2.5 py-1 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </h2>
                {cart.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {cart.length} түрдүү товар
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="cart-close w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50"
              aria-label="Жабуу"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* ====== PROGRESS BAR (FREE DELIVERY) ====== */}
          {cart.length > 0 && (
            <div className={`mt-4 p-3.5 rounded-2xl border shadow-sm transition-all duration-500 ${
              isFreeDelivery 
                ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-300 shadow-emerald-200/50' 
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100/80'
            }`}>
              {remaining > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-2.5">
                    <FiTruck className="text-sm" />
                    <span>Акысыз жеткирүүгө <strong className="text-emerald-800">{remaining.toLocaleString()} сом</strong> калды</span>
                  </div>
                  <div className="h-2.5 bg-emerald-100/80 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="progress-fill h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-emerald-300">
                    <FiCheck className="text-xs" />
                  </div>
                  <span>Сизге акысыз жеткирүү! 🎉</span>
                  <FiStar className="text-amber-400 ml-auto animate-pulse" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* ====== ITEMS ====== */}
        <div className="cart-items-scroll flex-grow overflow-y-auto px-6 py-5 flex flex-col gap-3 relative z-10">

          {cart.length === 0 ? (
            /* ====== EMPTY STATE ====== */
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="cart-empty-icon relative mb-8">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-50 flex items-center justify-center shadow-inner">
                  <FiShoppingBag className="text-6xl text-emerald-400" />
                  <div className="empty-ring" />
                  <div className="empty-ring" style={{ animationDelay: '1.25s' }} />
                </div>
                <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-emerald-400 opacity-60 animate-pulse" />
                <span className="absolute bottom-4 left-0 w-2 h-2 rounded-full bg-green-400 opacity-60 animate-pulse" style={{ animationDelay: '.5s' }} />
                <FiStar className="absolute top-0 left-2 text-amber-400 text-sm animate-pulse" />
                <FiHeart className="absolute bottom-0 right-2 text-rose-400 text-sm animate-pulse" style={{ animationDelay: '.8s' }} />
              </div>

              <h3 className="cart-empty-text text-xl font-bold text-gray-800 mb-2">
                Себет азырынча бош
              </h3>
              <p className="cart-empty-text text-sm text-gray-500 max-w-xs mb-6" style={{ animationDelay: '.3s' }}>
                Азыктарды кошуп, сатып алууну баштаңыз
              </p>

              <button
                onClick={onClose}
                className="cart-empty-text inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-transform"
                style={{ animationDelay: '.4s' }}
              >
                <FiShoppingCart className="text-base" />
                Азыктарга өтүү
                <FiChevronRight className="text-base" />
              </button>
            </div>
          ) : (
            /* ====== CART ITEMS ====== */
            cart.map((item, i) => {
              const key = `${item.id || item._id}-${item.isWholesale}`;
              const isRemoving = removingIds.includes(key);

              return (
                <div
                  key={key}
                  className={`cart-item flex items-center gap-3.5 p-3.5 rounded-2xl ${
                    isRemoving ? 'removing' : ''
                  }`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* Image with gradient ring */}
                  <div className="relative flex-shrink-0">
                    <div className="cart-item-img-wrap w-[68px] h-[68px]">
                      <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-img w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    {/* Wholesale badge */}
                    {item.isWholesale && (
                      <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md shadow-amber-300/50">
                        OPT
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 truncate mb-1.5">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-emerald-600 font-extrabold text-sm">
                        {item.price?.toLocaleString()} сом
                      </p>
                      <span className="text-[10px] text-gray-400 font-bold">×</span>
                      <span className="text-sm font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{item.quantity}</span>
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      item.isWholesale
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.isWholesale ? '📦 Оптом' : '🛒 Розница'}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={(e) => handleQuantity(item.id || item._id, item.isWholesale, -1, e)}
                      className={`qty-btn w-8 h-8 rounded-full flex items-center justify-center text-gray-600 ${
                        bouncingId === key ? 'bounce' : ''
                      }`}
                      aria-label="Азайтуу"
                    >
                      <FiMinus className="text-xs" />
                      {Object.values(ripples).filter(r => r.key === key).map(r => (
                        <span key={r.id} className="ripple" style={{ left: r.x - 10, top: r.y - 10 }} />
                      ))}
                    </button>
                    <button
                      onClick={(e) => handleQuantity(item.id || item._id, item.isWholesale, 1, e)}
                      className={`qty-btn w-8 h-8 rounded-full flex items-center justify-center text-gray-600 ${
                        bouncingId === key ? 'bounce' : ''
                      }`}
                      aria-label="Көбөйтүү"
                    >
                      <FiPlus className="text-xs" />
                      {Object.values(ripples).filter(r => r.key === key).map(r => (
                        <span key={r.id} className="ripple" style={{ left: r.x - 10, top: r.y - 10 }} />
                      ))}
                    </button>
                    <button
                      onClick={() => handleRemove(item.id || item._id, item.isWholesale)}
                      className="trash-btn w-8 h-8 rounded-full text-red-500 flex items-center justify-center ml-1"
                      aria-label="Өчүрүү"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ====== FOOTER ====== */}
        {cart.length > 0 && (
          <div className="relative z-10 border-t border-gray-100 glass-header shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
            {/* ====== FEATURES ROW ====== */}
            <div className="px-6 pt-4 pb-3 flex justify-center gap-5 text-[10px]">
              <div className="feature-item flex items-center gap-1.5 text-gray-500 cursor-default">
                <div className="feature-icon w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <FiShield className="text-xs" />
                </div>
                <span className="font-semibold">Кепилдик</span>
              </div>
              <div className="feature-item flex items-center gap-1.5 text-gray-500 cursor-default">
                <div className="feature-icon w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <FiTruck className="text-xs" />
                </div>
                <span className="font-semibold">Тез жеткирүү</span>
              </div>
              <div className="feature-item flex items-center gap-1.5 text-gray-500 cursor-default">
                <div className="feature-icon w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <FiAward className="text-xs" />
                </div>
                <span className="font-semibold">Сапат</span>
              </div>
            </div>

            {/* ====== TOTAL ====== */}
            <div className="px-6 pb-5">
              <div className="total-box flex justify-between items-center mb-4 p-4 rounded-2xl border border-emerald-200/50">
                <div className="relative z-10">
                  <p className="text-xs text-emerald-700 font-bold mb-0.5">Жалпы сумма</p>
                  <p className="text-[11px] text-emerald-600/70 font-medium">
                    {itemCount} товар үчүн
                  </p>
                </div>
                <div className="text-right relative z-10">
                  <p className="total-price text-3xl font-black leading-none">
                    {cartTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-700 font-bold mt-0.5">сом</p>
                </div>
              </div>

              {/* ====== CHECKOUT BUTTON ====== */}
              <button
                onClick={onCheckout}
                className="checkout-btn w-full text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-base"
              >
                <FiCreditCard className="text-xl" />
                <span>Буйрутма берүү</span>
                <FiChevronRight className="text-xl" />
              </button>

              {/* ====== CLEAR BUTTON ====== */}
              <button
                onClick={clearCart}
                className="clear-btn w-full mt-3 text-gray-500 text-xs flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold"
              >
                <FiTrash2 className="text-sm" />
                Себетти тазалоо
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
import React, { useState, useEffect } from 'react';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, removeFromCart, changeQuantity, clearCart } = useApp();
  const [removingIds, setRemovingIds] = useState([]);
  const [bouncingId, setBouncingId] = useState(null);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Remove анимациясы менен */
  const handleRemove = (id, isWholesale) => {
    const key = `${id}-${isWholesale}`;
    setRemovingIds((prev) => [...prev, key]);
    setTimeout(() => {
      removeFromCart(id, isWholesale);
      setRemovingIds((prev) => prev.filter((k) => k !== key));
    }, 350);
  };

  /* Quantity өзгөргөндө bounce */
  const handleQuantity = (id, isWholesale, delta) => {
    const key = `${id}-${isWholesale}`;
    setBouncingId(key);
    setTimeout(() => setBouncingId(null), 400);
    changeQuantity(id, isWholesale, delta);
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* ====== INLINE ANIMATIONS CSS ====== */}
      <style>{`
        /* ====== OVERLAY ====== */
        @keyframes overlayFadeIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        .cart-overlay {
          animation: overlayFadeIn .35s ease-out both;
        }

        /* ====== SIDEBAR ENTRANCE ====== */
        @keyframes sidebarIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-sidebar {
          animation: sidebarIn .5s cubic-bezier(.34,1.56,.64,1) both;
          will-change: transform;
        }

        /* ====== HEADER ICON ====== */
        @keyframes bagPulse {
          0%, 100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.12) rotate(-8deg); }
        }
        .cart-bag-icon {
          animation: bagPulse 2.5s ease-in-out infinite;
        }

        /* ====== CLOSE BUTTON ====== */
        .cart-close {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-close:hover {
          transform: rotate(90deg) scale(1.15);
          color: #ef4444;
        }

        /* ====== EMPTY STATE ====== */
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-14px) rotate(3deg); }
        }
        @keyframes emptyFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cart-empty-icon {
          animation: emptyFloat 4s ease-in-out infinite;
        }
        .cart-empty-text {
          animation: emptyFade .6s cubic-bezier(.34,1.56,.64,1) .2s both;
        }

        /* ====== CART ITEM ENTRY (stagger) ====== */
        @keyframes itemIn {
          0% { opacity: 0; transform: translateX(40px) scale(.9); }
          60% { transform: translateX(-4px) scale(1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes itemOut {
          0% { opacity: 1; transform: translateX(0) scale(1); max-height: 200px; }
          60% { opacity: .3; transform: translateX(60px) scale(.9); }
          100% { opacity: 0; transform: translateX(120px) scale(.7); max-height: 0; padding: 0; margin: 0; }
        }
        .cart-item {
          animation: itemIn .5s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-item.removing {
          animation: itemOut .35s ease-in forwards;
          pointer-events: none;
        }
        .cart-item:hover {
          transform: translateX(-4px);
          box-shadow: 0 8px 20px -8px rgba(124,108,255,.25);
        }

        /* ====== IMAGE ====== */
        .cart-item-img {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .cart-item:hover .cart-item-img {
          transform: scale(1.08) rotate(-3deg);
        }

        /* ====== QUANTITY BUTTONS ====== */
        .qty-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .qty-btn:hover {
          transform: scale(1.15);
          background: #7C6CFF;
          color: white;
          border-color: #7C6CFF;
        }
        .qty-btn:active {
          transform: scale(.9);
        }
        .qty-btn.bounce {
          animation: qtyBounce .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes qtyBounce {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.3); }
          70% { transform: scale(.9); }
        }

        /* ====== TRASH BUTTON ====== */
        .trash-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .trash-btn:hover {
          transform: scale(1.15) rotate(-8deg);
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }
        .trash-btn:active {
          transform: scale(.9);
        }

        /* ====== TOTAL ROW ====== */
        @keyframes totalPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .cart-total-value {
          animation: totalPulse 2.5s ease-in-out infinite;
          transition: color .3s ease;
        }

        /* ====== CHECKOUT BUTTON ====== */
        .checkout-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .checkout-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-100%);
          transition: transform .7s ease;
        }
        .checkout-btn:hover::before {
          transform: translateX(100%);
        }
        .checkout-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 30px -10px rgba(124,108,255,.5);
        }
        .checkout-btn:active {
          transform: scale(.97);
        }
        .checkout-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .checkout-btn:hover svg {
          transform: translateX(4px) rotate(-8deg);
        }

        /* ====== CLEAR BUTTON ====== */
        .clear-btn {
          transition: all .3s ease;
        }
        .clear-btn:hover {
          transform: translateY(-2px);
          color: #ef4444;
        }
        .clear-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .clear-btn:hover svg {
          transform: rotate(-15deg) scale(1.15);
        }

        /* ====== BADGE COUNT ====== */
        @keyframes badgePop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .cart-count-badge {
          animation: badgePop .5s cubic-bezier(.34,1.56,.64,1);
          transition: transform .3s ease;
        }
        .cart-count-badge.pulse {
          animation: badgePop .5s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== SCROLLBAR ====== */
        .cart-items-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .cart-items-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .cart-items-scroll::-webkit-scrollbar-thumb {
          background: rgba(124,108,255,.3);
          border-radius: 3px;
        }
        .cart-items-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(124,108,255,.6);
        }

        /* ====== BACKGROUND DECORATION ====== */
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.15); }
        }
        .cart-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: .15;
          pointer-events: none;
          animation: blobMove 10s ease-in-out infinite;
        }
      `}</style>

      {/* ====== OVERLAY ====== */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto cart-overlay' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* ====== SIDEBAR ====== */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col transition-transform duration-500 overflow-hidden ${
          isOpen ? 'translate-x-0 cart-sidebar' : 'translate-x-full'
        }`}
      >
        {/* Background decorations */}
        <div className="cart-blob bg-purple-500 w-48 h-48 -top-20 -left-20" />
        <div className="cart-blob bg-green-400 w-40 h-40 -bottom-20 -right-20" style={{ animationDelay: '3s' }} />

        {/* ====== HEADER ====== */}
        <div className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FiShoppingBag className="text-primary cart-bag-icon" />
            Сиздин себет
            {itemCount > 0 && (
              <span className="cart-count-badge px-3 py-0.5 bg-primary text-white text-sm font-bold rounded-full">
                {itemCount}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="cart-close text-gray-400 p-2 rounded-full hover:bg-red-50"
            aria-label="Жабуу"
          >
            <FiX className="text-3xl" />
          </button>
        </div>

        {/* ====== ITEMS ====== */}
        <div className="cart-items-scroll flex-grow overflow-y-auto px-8 py-6 flex flex-col gap-4 relative z-10">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiShoppingBag className="text-7xl mb-4 opacity-20 cart-empty-icon" />
              <p className="text-lg font-medium cart-empty-text">Себет азырынча бош</p>
              <p className="text-sm opacity-60 mt-1 cart-empty-text" style={{ animationDelay: '.3s' }}>
                Азыктарды кошуп, сатып алууну баштаңыз
              </p>
            </div>
          ) : (
            cart.map((item, i) => {
              const key = `${item.id}-${item.isWholesale}`;
              const isRemoving = removingIds.includes(key);

              return (
                <div
                  key={key}
                  className={`cart-item flex items-center gap-4 p-4 bg-gray-50 rounded-xl ${
                    isRemoving ? 'removing' : ''
                  }`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    {/* Wholesale badge */}
                    {item.isWholesale && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                        OPT
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-sm truncate">{item.name}</h4>
                    <p className="text-primary font-bold text-sm">
                      {item.price} сом × {item.quantity}
                    </p>
                    <span
                      className={`inline-block mt-1 text-xs font-semibold ${
                        item.isWholesale ? 'text-yellow-600' : 'text-primary'
                      }`}
                    >
                      {item.isWholesale ? '📦 Оптом' : '🛒 Розница'}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => changeQuantity(item._id, -1)}
                      className={`qty-btn w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center ${
                        bouncingId === key ? 'bounce' : ''
                      }`}
                      aria-label="Азайтуу"
                    >
                      <FiMinus className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleQuantity(item.id, item.isWholesale, 1)}
                      className={`qty-btn w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center ${
                        bouncingId === key ? 'bounce' : ''
                      }`}
                      aria-label="Көбөйтүү"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id, item.isWholesale)}
                      className="trash-btn w-8 h-8 rounded-full border border-red-300 text-red-500 flex items-center justify-center"
                      aria-label="Өчүрүү"
                    >
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ====== FOOTER ====== */}
        {cart.length > 0 && (
          <div className="relative z-10 border-t border-gray-100 px-8 py-6 bg-white">
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg font-semibold text-gray-600">Жалпы сумма:</span>
              <span className="cart-total-value text-2xl font-bold text-primary">
                {cartTotal.toLocaleString()} сом
              </span>
            </div>

            <button
              onClick={onCheckout}
              className="checkout-btn w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-3"
            >
              <FiCreditCard className="text-xl" />
              Буйрутма берүү
            </button>

            <button
              onClick={clearCart}
              className="clear-btn w-full mt-4 text-gray-500 text-sm flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-red-50"
            >
              <FiTrash2 className="text-sm" />
              Себетти тазалоо
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;
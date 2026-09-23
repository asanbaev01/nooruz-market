import React, { useState, useEffect, useRef } from 'react';
import {
  FiBell, FiX, FiCheck, FiTrash2, FiPackage, FiCheckCircle,
  FiTruck, FiXCircle, FiInfo, FiShoppingBag, FiGift,
} from 'react-icons/fi';
import { useNotifications } from '../context/NotificationContext';

/* ====== ICON ТАНДОО ====== */
const TYPE_CONFIG = {
  order_created: { icon: FiShoppingBag, color: 'bg-blue-100 text-blue-600', emoji: '🛒' },
  order_confirmed: { icon: FiPackage, color: 'bg-purple-100 text-purple-600', emoji: '📦' },
  order_shipped: { icon: FiTruck, color: 'bg-yellow-100 text-yellow-600', emoji: '🚚' },
  order_delivered: { icon: FiCheckCircle, color: 'bg-emerald-100 text-emerald-600', emoji: '✅' },
  order_cancelled: { icon: FiXCircle, color: 'bg-red-100 text-red-600', emoji: '❌' },
  promo: { icon: FiGift, color: 'bg-pink-100 text-pink-600', emoji: '🎁' },
  info: { icon: FiInfo, color: 'bg-gray-100 text-gray-600', emoji: 'ℹ️' },
};

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* Сырттан басканда жабуу */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNotificationClick = (notif) => {
    if (!notif.read) markAsRead(notif.id);
  };

  return (
    <>
      <style>{`
        @keyframes bellRing {
          0%, 100% { transform: rotate(0); }
          15% { transform: rotate(-15deg); }
          30% { transform: rotate(12deg); }
          45% { transform: rotate(-10deg); }
          60% { transform: rotate(8deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes bellPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,.6); }
          50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        @keyframes notifBadgePop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes dropdownIn {
          0% { opacity: 0; transform: translateY(-10px) scale(.95); }
          60% { transform: translateY(2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notifItemIn {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: .7; }
        }

        .bell-icon-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative;
        }
        .bell-icon-btn:hover {
          transform: scale(1.1);
        }
        .bell-icon-btn:hover svg {
          animation: bellRing .8s ease-in-out;
          transform-origin: top center;
        }
        .bell-icon-btn.has-unread {
          animation: bellPulse 2s ease-in-out infinite;
        }

        .notif-badge {
          animation: notifBadgePop .5s cubic-bezier(.34,1.56,.64,1);
        }

        .notif-dropdown {
          animation: dropdownIn .4s cubic-bezier(.34,1.56,.64,1);
          transform-origin: top right;
        }

        .notif-item {
          animation: notifItemIn .4s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          position: relative;
        }
        .notif-item:hover {
          transform: translateX(4px);
        }
        .notif-item.unread {
          background: linear-gradient(90deg, rgba(16,185,129,.08), transparent);
        }
        .notif-item.unread::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #10B981, #059669);
          border-radius: 0 3px 3px 0;
        }

        .notif-scroll::-webkit-scrollbar { width: 5px; }
        .notif-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 3px;
        }

        .empty-icon-float {
          animation: emptyFloat 3s ease-in-out infinite;
        }

        .notif-action-btn {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .notif-action-btn:hover {
          transform: scale(1.15);
        }
        .notif-action-btn:active {
          transform: scale(.9);
        }

        .delete-notif-btn {
          opacity: 0;
          transition: opacity .3s ease;
        }
        .notif-item:hover .delete-notif-btn {
          opacity: 1;
        }
      `}</style>

      <div className="relative" ref={dropdownRef}>
        {/* ====== BELL БАСКЫЧЫ ====== */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bell-icon-btn icon-btn relative p-2 text-primary hidden sm:flex ${
            unreadCount > 0 ? 'has-unread' : ''
          }`}
          aria-label="Билдирүүлөр"
          title="Билдирүүлөр"
        >
          <FiBell className="text-2xl" />
          {unreadCount > 0 && (
            <span className="notif-badge absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* ====== DROPDOWN ====== */}
        {isOpen && (
          <div className="notif-dropdown absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]">

            {/* HEADER */}
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiBell className="text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-800">
                  Билдирүүлөр
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="notif-action-btn text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded-lg hover:bg-emerald-50 flex items-center gap-1"
                    title="Баарын окуу"
                  >
                    <FiCheck className="text-xs" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="notif-action-btn text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 flex items-center gap-1"
                    title="Баарын өчүрүү"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="notif-action-btn text-gray-400 hover:text-red-500 p-1 rounded-full"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* CONTENT */}
            <div className="notif-scroll max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="empty-icon-float w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <FiBell className="text-3xl text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    Билдирүү жок
                  </p>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    Жаңы билдирүүлөр ушул жерде көрүнөт
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notif, i) => {
                    const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
                    const Icon = config.icon;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`notif-item cursor-pointer p-4 flex gap-3 ${
                          notif.read ? 'bg-white hover:bg-gray-50' : 'unread'
                        }`}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            config.color
                          }`}
                        >
                          <Icon className="text-lg" />
                        </div>

                        {/* Content */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <p
                              className={`text-sm font-bold truncate ${
                                notif.read ? 'text-gray-600' : 'text-gray-800'
                              }`}
                            >
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1" style={{ animation: 'dotPulse 2s ease-in-out infinite' }} />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1.5">
                            {notif.createdAtFormatted}
                          </p>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          className="delete-notif-btn w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center flex-shrink-0 transition-colors"
                          title="Өчүрүү"
                        >
                          <FiX className="text-xs" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
                <p className="text-[10px] text-gray-400">
                  {notifications.length} билдирүү • {unreadCount} окулбаган
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationBell;
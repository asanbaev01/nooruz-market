import React, { useState, useEffect } from 'react';
import {
  FiMessageCircle,
  FiX,
  FiPhone,
  FiMail,
  FiSend,
} from 'react-icons/fi';
import { FaWhatsapp, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const FloatingContact = () => {
  const { showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowButton(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHasNewMessage(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!showButton) return null;

  const contacts = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      desc: 'Тез жооп беребиз',
      icon: FaWhatsapp,
      color: 'from-green-400 to-green-600',
      href: 'https://wa.me/996700123456?text=Саламатсызбы! Nooruz Marketтен суроом бар.',
      badge: 'Онлайн',
    },
    {
      id: 'telegram',
      name: 'Telegram',
      desc: 'Канал жана бот',
      icon: FaTelegramPlane,
      color: 'from-sky-400 to-sky-600',
      href: 'https://t.me/nooruzmarket',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Жаңылыктар',
      icon: FaInstagram,
      color: 'from-pink-500 to-purple-600',
      href: 'https://instagram.com/nooruzmarket',
    },
    {
      id: 'phone',
      name: 'Телефон',
      desc: '+996 700 123 456',
      icon: FiPhone,
      color: 'from-emerald-400 to-emerald-600',
      href: 'tel:+996700123456',
    },
    {
      id: 'email',
      name: 'Email',
      desc: 'info@nooruz.market',
      icon: FiMail,
      color: 'from-blue-400 to-indigo-600',
      href: 'mailto:info@nooruz.market',
    },
  ];

  const handleContactClick = (contact) => {
    if (contact.id === 'whatsapp') {
      showToast('WhatsApp ачылууда...', 'success');
    } else if (contact.id === 'telegram') {
      showToast('Telegram ачылууда...', 'success');
    }
    setIsOpen(false);
  };

  return (
    <>
      <style>{`
        /* ====== MAIN BUTTON ====== */
        @keyframes contactBtnIn {
          0% { opacity: 0; transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.15) rotate(10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes contactPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, .6),
                        0 10px 30px -10px rgba(34, 197, 94, .5);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(34, 197, 94, 0),
                        0 10px 30px -10px rgba(34, 197, 94, .5);
          }
        }
        @keyframes contactFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .contact-fab {
          animation: contactBtnIn .6s cubic-bezier(.34,1.56,.64,1) both,
                     contactFloat 3s ease-in-out 1s infinite;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .contact-fab:not(.open) {
          animation: contactBtnIn .6s cubic-bezier(.34,1.56,.64,1) both,
                     contactFloat 3s ease-in-out 1s infinite,
                     contactPulse 2.5s ease-in-out infinite;
        }
        .contact-fab:hover {
          transform: scale(1.1) !important;
        }
        .contact-fab:active {
          transform: scale(.95);
        }
        .contact-fab.open .fab-icon {
          transform: rotate(90deg);
        }
        .fab-icon {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== NOTIFICATION DOT ====== */
        @keyframes notifBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        .notif-dot {
          animation: notifBounce 1.5s ease-in-out infinite;
        }
        @keyframes notifRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .notif-ring {
          animation: notifRing 1.8s ease-out infinite;
        }

        /* ====== MENU ====== */
        @keyframes menuIn {
          0% { opacity: 0; transform: translateY(20px) scale(.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes menuOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(20px) scale(.9); }
        }
        .contact-menu {
          animation: menuIn .4s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== ITEM ====== */
        @keyframes itemIn {
          0% { opacity: 0; transform: translateX(30px) scale(.8); }
          60% { transform: translateX(-4px) scale(1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .contact-item {
          animation: itemIn .5s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .contact-item:hover {
          transform: translateX(-6px) scale(1.02);
          box-shadow: 0 15px 30px -10px rgba(0,0,0,.15);
        }
        .contact-item:active {
          transform: translateX(-3px) scale(.98);
        }
        .contact-item:hover .item-icon {
          transform: rotate(-12deg) scale(1.15);
        }
        .item-icon {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== HEADER ====== */
        @keyframes headerIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .menu-header {
          animation: headerIn .4s ease-out .1s both;
        }

        /* ====== OVERLAY ====== */
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .contact-overlay {
          animation: overlayIn .3s ease-out both;
        }

        /* ====== SCROLLBAR ====== */
        .contact-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .contact-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 2px;
        }
        .contact-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(16,185,129,.6);
        }
      `}</style>

      {/* ====== OVERLAY (mobile үчүн) ====== */}
      {isOpen && (
        <div
          className="contact-overlay fixed inset-0 bg-black/30 backdrop-blur-sm z-[88] sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ====== CONTAINER ====== */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 max-h-[calc(100vh-3rem)]">

        {/* ====== CONTACT MENU ====== */}
        {isOpen && (
          <div className="contact-menu bg-white rounded-3xl shadow-2xl overflow-hidden w-[300px] sm:w-[330px] border border-gray-100 max-h-[70vh] flex flex-col">

            {/* Header */}
            <div className="menu-header bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-4 relative overflow-hidden flex-shrink-0">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-2">
                    <FiMessageCircle />
                    Байланышуу
                  </h3>
                  <p className="text-white/80 text-[11px] mt-0.5">
                    Биз жардам берүүгө даярбыз
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-all"
                  aria-label="Жабуу"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Online status */}
              <div className="relative mt-2.5 flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-2.5 py-1 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="notif-ring absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300" />
                </span>
                <span className="text-white text-[11px] font-semibold">
                  Азыр онлайн
                </span>
              </div>
            </div>

            {/* Contacts list (scroll болушу мүмкүн) */}
            <div className="contact-scroll p-2.5 space-y-1.5 overflow-y-auto flex-grow">
              {contacts.map((contact, i) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.id}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleContactClick(contact)}
                    className="contact-item flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 group"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`item-icon w-10 h-10 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                      <Icon className="text-lg" />
                    </div>

                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                        {contact.name}
                        {contact.badge && (
                          <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                            {contact.badge}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {contact.desc}
                      </p>
                    </div>

                    <FiSend className="text-gray-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-sm" />
                  </a>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center flex-shrink-0">
              <p className="text-[11px] text-gray-500">
                🕐 Иш убактысы: <span className="font-semibold text-gray-700">09:00 - 21:00</span>
              </p>
            </div>
          </div>
        )}

        {/* ====== MAIN BUTTON (FAB) ====== */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`contact-fab ${isOpen ? 'open' : ''} relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl flex items-center justify-center flex-shrink-0`}
          aria-label={isOpen ? 'Жабуу' : 'Байланышуу'}
        >
          {isOpen ? (
            <FiX className="text-xl sm:text-2xl fab-icon" />
          ) : (
            <>
              <FiMessageCircle className="text-xl sm:text-2xl fab-icon" />
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full notif-dot border-2 border-white" />
              )}
            </>
          )}
        </button>

      </div>
    </>
  );
};

export default FloatingContact;
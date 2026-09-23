import React, { useState, useEffect } from 'react';
import {
  FiX,
  FiCopy,
  FiCheck,
  FiShare2,
  FiLink,
} from 'react-icons/fi';
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const ShareModal = ({ isOpen, onClose, product }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* Copied state reset */
  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen || !product) return null;

  /* ====== ШИЛТЕМЕ ЖАСОО ====== */
  const productUrl = `${window.location.origin}/product/${product.id || product._id}`;
  const shareTitle = `${product.name} — Nooruz Market`;
  const shareText = `🔥 ${product.name}\n💰 Баасы: ${product.price} сом\n\nNooruz Market'тен алыңыз! 🌱`;

  /* ====== WHATSAPP ====== */
  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`;
    window.open(url, '_blank');
    showToast('WhatsApp ачылууда...', 'success');
  };

  /* ====== TELEGRAM ====== */
  const handleTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    showToast('Telegram ачылууда...', 'success');
  };

  /* ====== FACEBOOK ====== */
  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    showToast('Facebook ачылууда...', 'success');
  };

  /* ====== TWITTER ====== */
  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
    showToast('Twitter ачылууда...', 'success');
  };

  /* ====== INSTAGRAM (көчүрүү) ====== */
  const handleInstagram = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${productUrl}`);
      setCopied(true);
      showToast('📋 Шилтеме көчүрүлдү! Instagram\'га киргизиңиз', 'success');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      showToast('Көчүрүү мүмкүн болбоду', 'error');
    }
  };

  /* ====== ШИЛТЕМЕНИ КӨЧҮРҮҮ ====== */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      showToast('✅ Шилтеме көчүрүлдү!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      /* Эски браузерлер үчүн fallback */
      const textarea = document.createElement('textarea');
      textarea.value = productUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      showToast('✅ Шилтеме көчүрүлдү!', 'success');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  /* ====== NATIVE SHARE (мобилдик) ====== */
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: productUrl,
        });
        showToast('Бөлүшүү ийгиликтүү!', 'success');
      } catch (err) {
        /* Колдонуучу жокко чыгарса — эч нерсе кылбайбыз */
        if (err.name !== 'AbortError') {
          console.warn('Share error:', err);
        }
      }
    } else {
      showToast('Бул браузер native share колдобойт', 'info');
    }
  };

  /* ====== БАРДЫК БАЙЛАНЫШТАР ====== */
  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'from-green-400 to-green-600',
      bg: 'bg-green-500',
      onClick: handleWhatsApp,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: FaTelegramPlane,
      color: 'from-sky-400 to-sky-600',
      bg: 'bg-sky-500',
      onClick: handleTelegram,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-600',
      onClick: handleFacebook,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      color: 'from-pink-500 to-purple-600',
      bg: 'bg-pink-500',
      onClick: handleInstagram,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: FaTwitter,
      color: 'from-sky-400 to-blue-500',
      bg: 'bg-sky-400',
      onClick: handleTwitter,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes shareOverlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes shareModalIn {
          0% { opacity: 0; transform: translateY(30px) scale(.9); }
          60% { transform: translateY(-6px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shareItemIn {
          0% { opacity: 0; transform: translateY(15px) scale(.9); }
          60% { transform: translateY(-3px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes copyPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .share-overlay-anim { animation: shareOverlayIn .35s ease-out both; }
        .share-modal-anim { animation: shareModalIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .share-item-anim { animation: shareItemIn .5s cubic-bezier(.34,1.56,.64,1) both; }

        .share-close {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .share-close:hover {
          transform: rotate(90deg) scale(1.15);
          color: #ef4444;
        }

        .share-item {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .share-item:hover {
          transform: translateY(-6px) scale(1.05);
        }
        .share-item:hover .share-item-icon {
          transform: rotate(-10deg) scale(1.15);
        }
        .share-item:active {
          transform: scale(.95);
        }
        .share-item-icon {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        .copy-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .copy-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px -8px rgba(16,185,129,.5);
        }
        .copy-btn:active {
          transform: scale(.97);
        }
        .copy-btn.copied {
          animation: copyPulse .5s cubic-bezier(.34,1.56,.64,1);
          background: #10B981 !important;
        }

        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.15); }
        }
        .share-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(50px);
          opacity: .15;
          pointer-events: none;
          animation: blobFloat 6s ease-in-out infinite;
        }
      `}</style>

      {/* OVERLAY */}
      <div
        className="share-overlay-anim fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* MODAL */}
        <div
          className="share-modal-anim bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background blobs */}
          <div className="share-blob bg-emerald-400 w-40 h-40 -top-10 -right-10" />
          <div className="share-blob bg-purple-400 w-32 h-32 -bottom-10 -left-10" style={{ animationDelay: '2s' }} />

          {/* HEADER */}
          <div className="relative z-10 flex justify-between items-center px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <FiShare2 className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Бөлүшүү
                </h2>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                  {product.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="share-close w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50"
              aria-label="Жабуу"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* PRODUCT PREVIEW */}
          <div className="relative z-10 px-6 pt-5">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold text-sm text-gray-800 truncate">
                  {product.name}
                </p>
                <p className="text-emerald-600 font-bold text-sm">
                  {product.price?.toLocaleString()} сом
                </p>
              </div>
            </div>
          </div>

          {/* SHARE OPTIONS */}
          <div className="relative z-10 px-6 py-5">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Тандаңыз
            </p>

            <div className="grid grid-cols-5 gap-3 mb-5">
              {shareOptions.map((option, i) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={option.onClick}
                    className="share-item-anim share-item flex flex-col items-center gap-2"
                    style={{ animationDelay: `${i * 0.06}s` }}
                    aria-label={option.name}
                  >
                    <div className={`share-item-icon w-12 h-12 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="text-xl" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">
                      {option.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* COPY LINK */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Же шилтемени көчүрүңүз
              </p>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <FiLink className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={productUrl}
                    readOnly
                    className="w-full pl-10 pr-3 py-3 rounded-xl border-2 border-gray-200 outline-none text-xs bg-gray-50 text-gray-600 font-mono"
                  />
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`copy-btn ${copied ? 'copied' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'} text-white px-4 rounded-xl font-bold text-sm shadow-lg flex items-center gap-1.5 min-w-[100px] justify-center`}
                >
                  {copied ? (
                    <>
                      <FiCheck className="text-base" />
                      Даяр!
                    </>
                  ) : (
                    <>
                      <FiCopy className="text-base" />
                      Көчүрүү
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* NATIVE SHARE (mobil үчүн) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="share-item-anim w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform"
                style={{ animationDelay: '0.35s' }}
              >
                <FiShare2 className="text-lg" />
                Дагы бөлүшүү жолдору...
              </button>
            )}
          </div>

          {/* FOOTER HINT */}
          <div className="relative z-10 px-6 pb-5">
            <p className="text-[10px] text-center text-gray-400">
              💡 Досторуңузга бөлүшүп, аларга да жагымдуу баада сунуштаңыз!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
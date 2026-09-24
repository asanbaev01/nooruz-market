import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiMoreVertical, FiPlusSquare, FiCheck } from 'react-icons/fi';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwa_dismissed_at');
    if (dismissed) {
      const daysSince = (Date.now() - Number(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const fallbackTimer = setTimeout(() => {
      setShowBanner(true);
    }, 2000);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
      localStorage.setItem('pwa_installed', 'true');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      /* ✅ Alert ордуна — кооз модал */
      setShowInstructions(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa_dismissed_at', Date.now().toString());
  };

  return (
    <>
      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translateY(100px) scale(.95); }
          60% { transform: translateY(-4px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pwaIconPulse {
          0%, 100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.1) rotate(-5deg); }
        }
        @keyframes pwaGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.5); }
          50% { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
        }
        @keyframes instructionIn {
          0% { opacity: 0; transform: scale(.9) translateY(20px); }
          60% { transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        .pwa-banner {
          animation: pwaSlideUp .6s cubic-bezier(.34,1.56,.64,1) both;
        }
        .pwa-icon {
          animation: pwaIconPulse 2.5s ease-in-out infinite;
        }
        .pwa-install-btn {
          animation: pwaGlow 2.5s ease-in-out infinite;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .pwa-install-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-100%);
          transition: transform .7s ease;
        }
        .pwa-install-btn:hover::before {
          transform: translateX(100%);
        }
        .pwa-install-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.6);
        }
        .pwa-install-btn:active {
          transform: scale(.97);
        }
        .pwa-dismiss-btn {
          transition: all .3s ease;
        }
        .pwa-dismiss-btn:hover {
          transform: rotate(90deg) scale(1.15);
          color: #ef4444;
        }

        /* Instructions modal */
        .instructions-modal {
          animation: instructionIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        .instruction-step {
          animation: stepIn .4s cubic-bezier(.34,1.56,.64,1) both;
        }
        .bounce-arrow {
          animation: bounceArrow 1.5s ease-in-out infinite;
        }
      `}</style>

      {/* ====== MAIN BANNER ====== */}
      {showBanner && !installed && !showInstructions && (
        <div className="pwa-banner fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[70] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" />

          <div className="p-4 flex items-start gap-3">
            <div className="pwa-icon w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <FiDownload className="text-xl" />
            </div>

            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-sm text-gray-800 mb-0.5">
                📱 Nooruz Market колдонмосун орнотуңуз
              </h4>
              <p className="text-xs text-gray-500 mb-3">
                Тез жүктөө, оффлайн иштөө, башкы экранга кошуу
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="pwa-install-btn flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-4 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <FiDownload className="text-sm" />
                  Орнотуу
                </button>
                <button
                  onClick={handleDismiss}
                  className="pwa-dismiss-btn w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center"
                  aria-label="Жабуу"
                >
                  <FiX className="text-base" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====== INSTRUCTIONS MODAL ====== */}
      {showInstructions && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="instructions-modal bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <FiDownload className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Колдонмону орнотуу</h3>
                    <p className="text-xs opacity-90">3 жөнөкөй кадам</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:rotate-90"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            {/* Steps */}
            <div className="p-6 space-y-4">
              {/* Step 1 */}
              <div className="instruction-step flex gap-4" style={{ animationDelay: '0.1s' }}>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg">
                    1
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-gray-800 mb-1">
                    Браузердин менюсун ачыңыз
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Жогорку оң бурчта <strong>⋮</strong> (үч чекит) басыңыз
                  </p>
                  <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                    <FiMoreVertical className="text-gray-400" />
                    <span className="text-xs text-gray-600">Меню баскычы</span>
                    <span className="bounce-arrow text-emerald-500">↑</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="instruction-step flex gap-4" style={{ animationDelay: '0.2s' }}>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-gray-800 mb-1">
                    "Орнотуу" же "Башкы экранга кошуу"
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Менюдөн ушул пунктту табыңыз
                  </p>
                  <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-2">
                    <FiPlusSquare className="text-purple-500" />
                    <span className="text-xs text-gray-600">Башкы экранга кошуу</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="instruction-step flex gap-4" style={{ animationDelay: '0.3s' }}>
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-sm text-gray-800 mb-1">
                    "Кошуу" басыңыз
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Колдонмо башкы экранда пайда болот
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 flex items-center gap-2">
                    <FiCheck className="text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-semibold">
                      Даяр! Ийгиликтүү орнотулду
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
              >
                Түшүндүм, рахмат!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
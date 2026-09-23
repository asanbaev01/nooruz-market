import React, { useState, useEffect, useRef } from 'react';
import { FiTag, FiZap, FiPackage, FiArrowRight, FiCopy, FiCheck, FiGift, FiTrendingUp } from 'react-icons/fi';

const PromoSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  /* Scroll'до көрүнүү */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const promos = [
    {
      type: 'primary',
      icon: FiZap,
      title: 'Жаңы жылдык супер акция!',
      subtitle: 'Бардык товарларга 20% арзандатуу',
      code: 'NOORUZ20',
      tag: 'HOT 🔥',
      tagColor: 'bg-red-500',
    },
    {
      type: 'white',
      icon: FiGift,
      title: 'Багыттама сунушу',
      subtitle: 'Досту чакырып, биргелешип сатып алууга 500 сом бонус алыңыз!',
      action: 'Толугураак',
    },
    {
      type: 'gold',
      icon: FiPackage,
      title: 'Оптом сатып алуу!',
      subtitle: 'Көп алсаңыз, арзан',
      code: '10% дан 30%',
      tag: 'BEST 💎',
      tagColor: 'bg-gray-900',
    },
  ];

  return (
    <>
      <style>{`
        /* ====== SECTION ENTRY ====== */
        @keyframes sectionIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .promo-section {
          opacity: 0;
        }
        .promo-section.visible {
          opacity: 1;
          animation: sectionIn .8s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== TITLE ====== */
        @keyframes titleIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes titleIconRotate {
          0%, 100% { transform: rotate(0) scale(1); }
          50% { transform: rotate(-15deg) scale(1.15); }
        }
        .promo-title {
          animation: titleIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }
        .promo-title-icon {
          animation: titleIconRotate 2.5s ease-in-out infinite;
        }

        /* ====== UNDERLINE DOTS ====== */
        @keyframes lineExpand {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }
        .promo-title-line {
          animation: lineExpand .8s cubic-bezier(.34,1.56,.64,1) .3s both;
        }
        @keyframes dotBlink {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .promo-dot {
          animation: dotBlink 1.8s ease-in-out infinite;
        }
        .promo-dot:nth-child(2) { animation-delay: .2s; }
        .promo-dot:nth-child(3) { animation-delay: .4s; }

        /* ====== CARD ENTRY (stagger) ====== */
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(40px) scale(.92) rotateX(-10deg); }
          60% { transform: translateY(-8px) scale(1.02) rotateX(3deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }
        .promo-card {
          opacity: 0;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .5s cubic-bezier(.34,1.56,.64,1);
          will-change: transform;
        }
        .promo-card.visible {
          opacity: 1;
          animation: cardIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== CARD HOVER ====== */
        .promo-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 30px 60px -20px rgba(0,0,0,.4);
        }

        /* ====== SHINE PASS ====== */
        .promo-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-150%) skewX(-20deg);
          pointer-events: none;
          z-index: 5;
        }
        .promo-card:hover::before {
          animation: shineMove 1.2s ease-out;
        }
        @keyframes shineMove {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(800%) skewX(-20deg); }
        }

        /* ====== BACKGROUND GLOW PULSE ====== */
        @keyframes bgGlow {
          0%, 100% { opacity: .5; transform: scale(1); }
          50% { opacity: .75; transform: scale(1.1); }
        }
        .promo-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
          animation: bgGlow 6s ease-in-out infinite;
          pointer-events: none;
        }

        /* ====== ICON ROTATE ====== */
        .promo-icon {
          transition: transform .6s cubic-bezier(.34,1.56,.64,1);
        }
        .promo-card:hover .promo-icon {
          transform: rotate(-15deg) scale(1.15);
        }

        /* ====== TAG ====== */
        @keyframes tagFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes tagPop {
          0% { opacity: 0; transform: scale(.5) rotate(-20deg); }
          60% { transform: scale(1.15) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        .promo-tag {
          animation: tagPop .6s cubic-bezier(.34,1.56,.64,1) .5s both,
                     tagFloat 3s ease-in-out infinite 1.2s;
          box-shadow: 0 8px 20px -6px rgba(0,0,0,.3);
          z-index: 3;
        }

        /* ====== PROMO CODE BOX ====== */
        .promo-code-box {
          position: relative;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .promo-code-box:hover {
          transform: scale(1.05) translateY(-2px);
          box-shadow: 0 10px 25px -8px rgba(0,0,0,.3);
        }
        .promo-code-box:active {
          transform: scale(.98);
        }
        .promo-code-text {
          transition: all .3s ease;
        }
        .promo-code-box:hover .promo-code-text {
          letter-spacing: 2px;
        }

        /* Copy icon animation */
        @keyframes copyPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .copy-icon {
          animation: copyPop .4s cubic-bezier(.34,1.56,.64,1);
          transition: transform .3s ease;
        }
        .promo-code-box:hover .copy-icon {
          transform: scale(1.15);
        }

        /* ====== ACTION BUTTON ====== */
        .promo-action-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative;
        }
        .promo-action-btn::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -2px;
          height: 2px;
          background: #7C6CFF;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .35s cubic-bezier(.34,1.56,.64,1);
        }
        .promo-action-btn:hover::after {
          transform: scaleX(1);
        }
        .promo-action-btn:hover {
          transform: translateX(6px);
        }
        .promo-action-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .promo-action-btn:hover svg {
          transform: translateX(6px);
        }

        /* ====== FLOATING PARTICLES ====== */
        @keyframes particleRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: .8; }
          80% { opacity: .8; }
          100% { transform: translateY(-100px) scale(1.3); opacity: 0; }
        }
        .promo-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleRise 6s linear infinite;
          z-index: 2;
        }

        /* ====== CONFETTI (copy success) ====== */
        @keyframes confettiBurst {
          0% { transform: translate(0, 0) scale(1) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg); opacity: 0; }
        }
        .copy-confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          animation: confettiBurst .9s cubic-bezier(.22,1,.36,1) forwards;
          z-index: 20;
        }

        /* ====== BG WAVE DECORATION ====== */
        @keyframes waveMove {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-30px); }
        }
        .promo-wave {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          opacity: .05;
          animation: waveMove 12s ease-in-out infinite;
        }
      `}</style>

      <section
        id="promo-section"
        ref={sectionRef}
        className={`promo-section relative py-24 bg-gradient-to-r from-primary/5 via-white to-primary/5 overflow-hidden ${
          visible ? 'visible' : ''
        }`}
      >
        {/* ====== BACKGROUND DECORATIONS ====== */}
        <div className="promo-wave w-96 h-96 bg-primary -top-20 -left-20" />
        <div className="promo-wave w-80 h-80 bg-green-500 -bottom-20 -right-20" style={{ animationDelay: '4s' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          {/* ====== TITLE ====== */}
          <div className="text-center mb-12">
            <h2 className="promo-title text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
              <FiTag className="text-primary text-3xl md:text-4xl promo-title-icon" />
              Акциялар жана сунуштар
            </h2>

            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="promo-title-line h-[3px] bg-gradient-to-r from-transparent to-primary rounded-full" />
              <span className="promo-dot w-2 h-2 rounded-full bg-primary" />
              <span className="promo-dot w-2 h-2 rounded-full bg-primary" />
              <span className="promo-dot w-2 h-2 rounded-full bg-primary" />
              <span className="promo-title-line h-[3px] bg-gradient-to-l from-transparent to-primary rounded-full" />
            </div>
          </div>

          {/* ====== CARDS ====== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {promos.map((promo, i) => {
              const Icon = promo.icon;
              const isPrimary = promo.type === 'primary';
              const isGold = promo.type === 'gold';
              const isWhite = promo.type === 'white';

              return (
                <div
                  key={i}
                  className={`promo-card p-8 rounded-3xl shadow-xl ${
                    isPrimary
                      ? 'bg-gradient-to-br from-primary to-primary-light text-white'
                      : isGold
                      ? 'bg-gradient-to-br from-yellow-500 to-yellow-300 text-gray-900'
                      : 'bg-white border border-gray-100'
                  } ${visible ? 'visible' : ''}`}
                  style={{ animationDelay: visible ? `${i * 0.15}s` : '0s' }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Background glow */}
                  <div
                    className={`promo-glow w-40 h-40 ${
                      isPrimary
                        ? 'bg-white/30 -top-10 -right-10'
                        : isGold
                        ? 'bg-white/50 -bottom-10 -left-10'
                        : 'bg-primary/20 -top-10 -left-10'
                    }`}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  />

                  {/* Particles */}
                  <span
                    className={`promo-particle w-2 h-2 ${
                      isPrimary ? 'bg-white/40' : isGold ? 'bg-white/60' : 'bg-primary/40'
                    }`}
                    style={{ left: '15%', bottom: '10%', animationDelay: `${i * 0.4}s` }}
                  />
                  <span
                    className={`promo-particle w-1.5 h-1.5 ${
                      isPrimary ? 'bg-white/30' : isGold ? 'bg-white/50' : 'bg-green-400/60'
                    }`}
                    style={{ left: '70%', bottom: '20%', animationDelay: `${i * 0.8}s` }}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">

                        {/* Tag */}
                        {promo.tag && (
                          <span className={`promo-tag inline-block text-xs font-bold px-3 py-1 rounded-full ${promo.tagColor} text-white mb-3`}>
                            {promo.tag}
                          </span>
                        )}

                        {/* Title */}
                        <h3 className={`text-lg font-semibold mb-2 ${isWhite ? 'text-gray-800' : ''}`}>
                          {promo.title}
                        </h3>

                        {/* Subtitle */}
                        <p className={`text-lg ${isPrimary || isGold ? 'opacity-90' : 'text-gray-600 text-sm'}`}>
                          {promo.subtitle}
                        </p>

                        {/* Code box (copyable) */}
                        {promo.code && (
                          <div className="mt-4">
                            <div
                              onClick={() => handleCopy(promo.code)}
                              className={`promo-code-box inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                                isPrimary || isGold
                                  ? 'bg-white/20 hover:bg-white/30'
                                  : 'bg-primary/10 hover:bg-primary/20'
                              }`}
                            >
                              <span className={`promo-code-text text-sm font-bold tracking-wider ${
                                isPrimary || isGold ? 'text-white' : 'text-primary'
                              }`}>
                                {promo.code}
                              </span>
                              {copiedCode ? (
                                <FiCheck className="copy-icon text-sm text-green-500" />
                              ) : (
                                <FiCopy className={`copy-icon text-sm ${
                                  isPrimary || isGold ? 'text-white/80' : 'text-primary/80'
                                }`} />
                              )}
                            </div>
                            <p className={`text-xs mt-2 ${
                              isPrimary || isGold ? 'opacity-60' : 'text-gray-400'
                            }`}>
                              {copiedCode ? 'Көчүрүлдү!' : 'Басып көчүрүңүз'}
                            </p>

                            {/* Confetti on copy */}
                            {copiedCode && (
                              <>
                                <span className="copy-confetti bg-white" style={{ top: '50%', left: '20%', '--tx': '-30px', '--ty': '-40px' }} />
                                <span className="copy-confetti bg-yellow-400" style={{ top: '50%', left: '20%', '--tx': '30px', '--ty': '-50px' }} />
                                <span className="copy-confetti bg-green-400" style={{ top: '50%', left: '20%', '--tx': '-20px', '--ty': '-20px' }} />
                                <span className="copy-confetti bg-purple-400" style={{ top: '50%', left: '20%', '--tx': '40px', '--ty': '-30px' }} />
                              </>
                            )}
                          </div>
                        )}

                        {/* Action button */}
                        {promo.action && (
                          <button className="promo-action-btn mt-4 text-primary font-bold text-sm flex items-center gap-2">
                            {promo.action} <FiArrowRight className="text-sm" />
                          </button>
                        )}
                      </div>

                      {/* Icon */}
                      <Icon
                        className={`promo-icon text-5xl flex-shrink-0 ${
                          isPrimary ? 'opacity-60' : isGold ? 'opacity-70' : 'opacity-50 text-primary'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default PromoSection;
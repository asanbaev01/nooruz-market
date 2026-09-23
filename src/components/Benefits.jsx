import React, { useState, useEffect, useRef } from 'react';
import { FiDollarSign, FiZap, FiFeather, FiPackage } from 'react-icons/fi';

const Benefits = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  /* Scroll'до көрүнүү анимациясы */
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

  const items = [
    { 
      icon: FiDollarSign, 
      title: 'Эң арзан баалар', 
      desc: 'Түз жеткирүүчүлөрдөн', 
      color: 'primary',
      gradient: 'from-purple-500 to-indigo-500',
      glow: 'rgba(124,108,255,.5)'
    },
    { 
      icon: FiZap, 
      title: 'Тез жеткирүү', 
      desc: '30 мүнөттүн ичинде', 
      color: 'primary',
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'rgba(255,200,87,.5)'
    },
    { 
      icon: FiFeather, 
      title: '100% Табигый', 
      desc: 'Химиясыз балгын азыктар', 
      color: 'primary',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'rgba(34,232,176,.5)'
    },
    { 
      icon: FiPackage, 
      title: 'Оптом жана розница', 
      desc: 'Бардык көлөмдөр', 
      color: 'gold',
      gradient: 'from-yellow-500 to-amber-500',
      glow: 'rgba(255,200,87,.5)'
    },
  ];

  return (
    <>
      {/* ====== INLINE ANIMATIONS CSS ====== */}
      <style>{`
        /* ====== SECTION ENTRY ====== */
        @keyframes sectionSlideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .benefits-section {
          opacity: 0;
        }
        .benefits-section.visible {
          opacity: 1;
          animation: sectionSlideUp .8s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== CARD ENTRY (stagger) ====== */
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(40px) scale(.9) rotateX(-15deg); }
          60% { transform: translateY(-6px) scale(1.02) rotateX(4deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }
        .benefit-card {
          opacity: 0;
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .benefit-card.visible {
          opacity: 1;
          animation: cardIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== CARD HOVER ====== */
        .benefit-card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 25px 50px -15px var(--glow-color);
        }
        .benefit-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--glow-color) 0%, transparent 50%);
          opacity: 0;
          transition: opacity .5s ease;
          pointer-events: none;
        }
        .benefit-card:hover::before {
          opacity: .08;
        }

        /* Shine effect on hover */
        .benefit-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent);
          transform: translateX(-100%) skewX(-20deg);
          transition: transform .8s ease;
          pointer-events: none;
        }
        .benefit-card:hover::after {
          transform: translateX(400%) skewX(-20deg);
        }

        /* ====== ICON CIRCLE ====== */
        .benefit-icon-circle {
          position: relative;
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
        }
        .benefit-icon-circle::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: inherit;
          transform: scale(1);
          transition: transform .6s cubic-bezier(.34,1.56,.64,1);
          opacity: .3;
        }
        .benefit-card:hover .benefit-icon-circle::before {
          transform: scale(1.8);
          opacity: 0;
        }
        .benefit-card:hover .benefit-icon-circle {
          transform: rotate(-10deg) scale(1.15);
        }

        /* ====== ICON ITSELF ====== */
        .benefit-icon {
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          z-index: 1;
        }
        .benefit-card:hover .benefit-icon {
          transform: rotate(15deg) scale(1.1);
        }

        /* ====== TITLE ====== */
        .benefit-title {
          transition: color .3s ease, transform .3s ease;
        }
        .benefit-card:hover .benefit-title {
          color: var(--primary-color);
          transform: translateX(2px);
        }

        /* ====== DESCRIPTION ====== */
        .benefit-desc {
          transition: opacity .3s ease, transform .3s ease;
        }
        .benefit-card:hover .benefit-desc {
          opacity: 1;
          transform: translateX(2px);
        }

        /* ====== BOTTOM BORDER GLOW ====== */
        .benefit-card .bottom-border {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--gradient-from), var(--gradient-to));
          transform: scaleX(1);
          transform-origin: left;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .benefit-card:hover .bottom-border {
          transform: scaleX(1.15);
          filter: brightness(1.2);
        }

        /* ====== FLOATING PARTICLES ====== */
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) rotate(0); opacity: .3; }
          50% { transform: translateY(-15px) rotate(180deg); opacity: .6; }
        }
        .benefit-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 4s ease-in-out infinite;
        }

        /* ====== NUMBER BACKGROUND ====== */
        @keyframes numberFade {
          0%, 100% { opacity: .04; transform: scale(1); }
          50% { opacity: .08; transform: scale(1.1); }
        }
        .benefit-number {
          position: absolute;
          top: -10px; right: 8px;
          font-size: 90px;
          font-weight: 900;
          line-height: 1;
          animation: numberFade 5s ease-in-out infinite;
          pointer-events: none;
          user-select: none;
        }

        /* ====== FLOATING BADGE ====== */
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .benefit-badge {
          position: absolute;
          top: -8px; right: -8px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          color: white;
          animation: badgeFloat 3s ease-in-out infinite;
          box-shadow: 0 4px 12px -2px rgba(0,0,0,.3);
          z-index: 2;
        }
      `}</style>

      <section 
        ref={sectionRef}
        className={`benefits-section max-w-7xl mx-auto px-6 -mt-16 relative z-20 ${visible ? 'visible' : ''}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {items.map((b, i) => {
            const Icon = b.icon;
            const isGold = b.color === 'gold';
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={i}
                className={`benefit-card bg-white p-6 rounded-2xl shadow-xl flex items-center gap-5 
                  ${visible ? 'visible' : ''}`}
                style={{
                  '--glow-color': b.glow,
                  '--primary-color': isGold ? '#F59E0B' : '#7C6CFF',
                  '--gradient-from': isGold ? '#F59E0B' : '#7C6CFF',
                  '--gradient-to': isGold ? '#FBBF24' : '#22E8B0',
                  animationDelay: visible ? `${i * 0.12}s` : '0s',
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating number background */}
                <span 
                  className={`benefit-number ${isGold ? 'text-yellow-500' : 'text-primary'}`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  0{i + 1}
                </span>

                {/* Floating badge for gold */}
                {isGold && (
                  <span 
                    className="benefit-badge bg-gradient-to-r from-yellow-500 to-amber-500"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  >
                    ⭐ VIP
                  </span>
                )}

                {/* Particle decorations */}
                <span 
                  className={`benefit-particle w-2 h-2 ${isGold ? 'bg-yellow-400' : 'bg-purple-400'}`}
                  style={{ 
                    top: '20%', 
                    right: '10%',
                    animationDelay: `${i * 0.4}s` 
                  }} 
                />
                <span 
                  className={`benefit-particle w-1.5 h-1.5 ${isGold ? 'bg-yellow-300' : 'bg-green-400'}`}
                  style={{ 
                    bottom: '20%', 
                    left: '15%',
                    animationDelay: `${i * 0.7}s` 
                  }} 
                />

                {/* Icon circle */}
                <div 
                  className={`benefit-icon-circle w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 relative
                    ${isGold 
                      ? 'bg-yellow-500/10 text-yellow-600' 
                      : 'bg-primary/10 text-primary'
                    }`}
                >
                  <Icon className="benefit-icon text-3xl" />
                </div>

                {/* Text */}
                <div className="relative z-10">
                  <h3 className={`benefit-title font-semibold mb-0.5 ${isGold ? 'text-yellow-700' : 'text-gray-800'}`}>
                    {b.title}
                  </h3>
                  <p className="benefit-desc text-sm text-gray-500">
                    {b.desc}
                  </p>
                </div>

                {/* Bottom gradient border */}
                <div className="bottom-border" />
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Benefits;
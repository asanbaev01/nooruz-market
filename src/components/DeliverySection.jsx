import React, { useState, useEffect, useRef } from 'react';
import {
  FiClock,
  FiDollarSign,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiTrendingUp,
  FiMap,
  FiNavigation,
} from 'react-icons/fi';

const DeliverySection = ({ onOpenMap }) => {
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
      icon: FiClock,
      title: 'Тез жеткирүү',
      desc: 'Бишкек шаары боюнча 30 мүнөттө, районборборлордо 2 күндө жеткиребиз.',
      border: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-500/10',
      text: 'text-purple-600',
      numColor: 'text-purple-500',
      glow: 'rgba(124,108,255,.35)',
      particle1: 'bg-purple-400',
      particle2: 'bg-indigo-400',
      tag: '30 мүн',
      tagColor: 'bg-purple-500',
    },
    {
      icon: FiDollarSign,
      title: 'Төлөм ыкмалары',
      desc: 'Колма-кол, карта менен же банк которуу аркылуу төлөй аласыз.',
      border: 'from-yellow-500 to-amber-500',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-600',
      numColor: 'text-yellow-500',
      glow: 'rgba(255,200,87,.4)',
      particle1: 'bg-yellow-400',
      particle2: 'bg-amber-400',
      tag: '3 түрдүү',
      tagColor: 'bg-yellow-500',
    },
    {
      icon: FiPackage,
      title: 'Акысыз кайтаруу',
      desc: 'Сапатына көңүлүңүз толбосо, 7 күндүн ичинде акчаңызды кайтарабыз.',
      border: 'from-green-500 to-emerald-500',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600',
      numColor: 'text-emerald-500',
      glow: 'rgba(34,232,176,.35)',
      particle1: 'bg-green-400',
      particle2: 'bg-emerald-400',
      tag: '7 күн',
      tagColor: 'bg-emerald-500',
    },
  ];

  return (
    <>
      {/* ====== INLINE ANIMATIONS CSS ====== */}
      <style>{`
        /* ====== SECTION ENTRY ====== */
        @keyframes sectionIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .delivery-section {
          opacity: 0;
        }
        .delivery-section.visible {
          opacity: 1;
          animation: sectionIn .8s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== TITLE ====== */
        @keyframes titleIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes titleIconPulse {
          0%, 100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.15) rotate(-8deg); }
        }
        .delivery-title {
          animation: titleIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }
        .delivery-title-icon {
          animation: titleIconPulse 2.5s ease-in-out infinite;
        }

        /* ====== UNDERLINE DOTS ====== */
        @keyframes lineExpand {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }
        .title-line {
          animation: lineExpand .8s cubic-bezier(.34,1.56,.64,1) .3s both;
        }
        @keyframes dotBlink {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .delivery-dot {
          animation: dotBlink 1.8s ease-in-out infinite;
        }
        .delivery-dot:nth-child(2) { animation-delay: .2s; }
        .delivery-dot:nth-child(3) { animation-delay: .4s; }

        /* ====== CARD ENTRY (stagger) ====== */
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(50px) scale(.9); }
          60% { transform: translateY(-8px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .delivery-card {
          opacity: 0;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .5s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          will-change: transform;
        }
        .delivery-card.visible {
          opacity: 1;
          animation: cardIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== CARD HOVER ====== */
        .delivery-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 30px 60px -20px var(--glow-color);
        }
        .delivery-card .overlay-gradient {
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, var(--glow-color) 0%, transparent 60%);
          opacity: 0;
          transition: opacity .5s ease;
          pointer-events: none;
        }
        .delivery-card:hover .overlay-gradient {
          opacity: .6;
        }

        /* ====== SHINE ====== */
        .delivery-card .shine {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-100%) skewX(-20deg);
          transition: transform .9s ease;
          pointer-events: none;
          z-index: 3;
        }
        .delivery-card:hover .shine {
          transform: translateX(500%) skewX(-20deg);
        }

        /* ====== ICON CIRCLE ====== */
        .delivery-icon-circle {
          position: relative;
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          z-index: 2;
        }
        .delivery-icon-circle::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: currentColor;
          transform: scale(1);
          transition: transform .7s cubic-bezier(.34,1.56,.64,1), opacity .7s;
          opacity: .18;
          z-index: -1;
        }
        .delivery-card:hover .delivery-icon-circle {
          transform: rotate(-10deg) scale(1.12);
        }
        .delivery-card:hover .delivery-icon-circle::before {
          transform: scale(1.9);
          opacity: 0;
        }

        /* Icon itself */
        .delivery-icon {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .delivery-card:hover .delivery-icon {
          transform: rotate(15deg) scale(1.1);
        }

        /* ====== TITLE & DESC ====== */
        .delivery-title-text {
          transition: color .3s ease, transform .3s ease;
        }
        .delivery-desc {
          transition: transform .3s ease;
        }
        .delivery-card:hover .delivery-title-text {
          transform: translateY(-2px);
        }
        .delivery-card:hover .delivery-desc {
          transform: translateY(-2px);
        }

        /* ====== BOTTOM GRADIENT BORDER ====== */
        .delivery-card .bottom-border {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 4px;
          border-radius: 0 0 1.5rem 1.5rem;
          transition: filter .5s ease;
        }
        .delivery-card:hover .bottom-border {
          filter: brightness(1.2);
          height: 5px;
        }

        /* ====== FLOATING TAG ====== */
        @keyframes tagFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        .delivery-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          color: white;
          animation: tagFloat 3s ease-in-out infinite;
          box-shadow: 0 8px 20px -6px rgba(0,0,0,.3);
          z-index: 4;
          letter-spacing: .5px;
        }

        /* ====== FLOATING NUMBER ====== */
        @keyframes numberFade {
          0%, 100% { opacity: .05; transform: scale(1); }
          50% { opacity: .1; transform: scale(1.08); }
        }
        .delivery-number {
          position: absolute;
          top: 4px;
          left: 20px;
          font-size: 64px;
          font-weight: 900;
          line-height: 1;
          animation: numberFade 5s ease-in-out infinite;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        /* ====== PARTICLES ====== */
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) rotate(0); opacity: .4; }
          50% { transform: translateY(-14px) rotate(180deg); opacity: .8; }
        }
        .delivery-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 4s ease-in-out infinite;
          z-index: 1;
        }

        /* ====== FEATURE BADGE (bottom) ====== */
        .delivery-features {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed rgba(0,0,0,.08);
          opacity: 0;
          transform: translateY(8px);
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
        }
        .delivery-card:hover .delivery-features {
          opacity: 1;
          transform: translateY(0);
        }
        .delivery-features svg {
          color: #22E8B0;
        }

        /* ====== ЖАҢЫ: MAP CTA ====== */
        @keyframes mapCtaIn {
          0% { opacity: 0; transform: translateY(30px) scale(.95); }
          60% { transform: translateY(-4px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes mapIconFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        @keyframes mapIconPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.4), 0 15px 30px -10px rgba(16,185,129,.6); }
          50% { box-shadow: 0 0 0 15px rgba(16,185,129,0), 0 15px 30px -10px rgba(16,185,129,.6); }
        }
        @keyframes navPing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .map-cta-wrap {
          animation: mapCtaIn .8s cubic-bezier(.34,1.56,.64,1) .7s both;
        }
        .map-cta-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .map-cta-btn::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-150%) skewX(-20deg);
          transition: transform .9s ease;
        }
        .map-cta-btn:hover::before {
          transform: translateX(600%) skewX(-20deg);
        }
        .map-cta-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 25px 50px -15px rgba(16,185,129,.6);
        }
        .map-cta-btn:active {
          transform: translateY(-2px) scale(.98);
        }
        .map-cta-icon {
          animation: mapIconFloat 3s ease-in-out infinite;
        }
        .map-cta-btn:hover .map-cta-icon {
          animation: none;
          transform: rotate(-10deg) scale(1.15);
        }
        .nav-ping {
          animation: navPing 1.8s ease-out infinite;
        }

        /* ====== MOBILE ====== */
        @media (max-width: 768px) {
          .delivery-number { font-size: 48px; }
          .delivery-tag { padding: 4px 10px; font-size: 10px; }
        }
      `}</style>

      <section
        id="delivery-section"
        ref={sectionRef}
        className={`delivery-section py-24 bg-white ${visible ? 'visible' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-6">

          {/* ====== TITLE ====== */}
          <div className="text-center mb-16">
            <h2 className="delivery-title text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
              <FiPackage className="text-primary text-3xl md:text-4xl delivery-title-icon" />
              Жеткирилүү шарттары
            </h2>

            <div className="flex justify-center items-center gap-2 mt-4">
              <span className="title-line h-[3px] bg-gradient-to-r from-transparent to-primary rounded-full" />
              <span className="delivery-dot w-2 h-2 rounded-full bg-primary" />
              <span className="delivery-dot w-2 h-2 rounded-full bg-primary" />
              <span className="delivery-dot w-2 h-2 rounded-full bg-primary" />
              <span className="title-line h-[3px] bg-gradient-to-l from-transparent to-primary rounded-full" />
            </div>

            <p className="delivery-title mt-4 text-gray-500 max-w-2xl mx-auto" style={{ animationDelay: '.15s' }}>
              Биз сизге ыңгайлуу, тез жана ишенимдүү жеткирүүнү камсыз кылабыз
            </p>
          </div>

          {/* ====== CARDS ====== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, i) => {
              const Icon = item.icon;

              return (
                <div
                  key={i}
                  className={`delivery-card bg-gray-50 p-8 rounded-3xl shadow-lg text-center border-b-4 ${
                    visible ? 'visible' : ''
                  }`}
                  style={{
                    '--glow-color': item.glow,
                    animationDelay: visible ? `${i * 0.15}s` : '0s',
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Background gradient overlay */}
                  <div className="overlay-gradient" />

                  {/* Shine effect */}
                  <div className="shine" />

                  {/* Floating number */}
                  <span className={`delivery-number ${item.numColor}`}>
                    0{i + 1}
                  </span>

                  {/* Floating tag */}
                  <span className={`delivery-tag ${item.tagColor}`}>
                    {item.tag}
                  </span>

                  {/* Particles */}
                  <span
                    className={`delivery-particle w-2 h-2 ${item.particle1}`}
                    style={{
                      top: '25%',
                      right: '15%',
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                  <span
                    className={`delivery-particle w-1.5 h-1.5 ${item.particle2}`}
                    style={{
                      bottom: '25%',
                      left: '18%',
                      animationDelay: `${i * 0.6}s`,
                    }}
                  />

                  {/* Icon circle */}
                  <div
                    className={`delivery-icon-circle w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 relative ${item.bg} ${item.text}`}
                  >
                    <Icon className="delivery-icon text-4xl" />
                  </div>

                  {/* Text */}
                  <h3 className={`delivery-title-text text-lg font-semibold mb-3 relative z-10 ${item.text}`}>
                    {item.title}
                  </h3>
                  <p className="delivery-desc text-sm text-gray-600 relative z-10 leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Bottom features */}
                  <div className="delivery-features relative z-10">
                    <FiCheckCircle className="text-sm" />
                    <span className="text-xs text-gray-500 font-medium">Ишенимдүү кызмат</span>
                  </div>

                  {/* Bottom gradient border */}
                  <div className={`bottom-border bg-gradient-to-r ${item.border}`} />
                </div>
              );
            })}
          </div>

          {/* ====== БАТТОМ INFO BAR ====== */}
          <div
            className={`mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } transition-all duration-700`}
            style={{ transitionDelay: '.6s' }}
          >
            <div className="flex items-center gap-2">
              <FiTruck className="text-primary" />
              <span>Бишкек боюнча акысыз жеткирүү</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" />
              <span>1000+ ийгиликтүү жеткирүү</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-500" />
              <span>Кепилдик менен</span>
            </div>
          </div>

          {/* ============================================================
              ЖАҢЫ: ЖЕТКИРҮҮ КАРТАСЫНЫН БАСКЫЧЫ
              ============================================================ */}
          {onOpenMap && (
            <div className="map-cta-wrap mt-12 flex justify-center">
              <button
                onClick={onOpenMap}
                className="map-cta-btn group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-5 rounded-2xl font-bold text-base shadow-2xl flex items-center gap-4 relative"
              >
                {/* Icon */}
                <div className="map-cta-icon w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                  <FiMap className="text-2xl" />
                </div>

                {/* Text */}
                <div className="text-left">
                  <p className="text-base font-bold leading-tight">
                    Жеткирүү картасын көрүү
                  </p>
                  <p className="text-xs opacity-90 font-normal leading-tight mt-0.5">
                    Кайсы райондорго жеткиребиз
                  </p>
                </div>

                {/* Navigation icon + ping */}
                <div className="relative flex-shrink-0">
                  <FiNavigation className="text-xl opacity-90" />
                  <span className="nav-ping absolute inset-0 rounded-full border-2 border-white/50" />
                </div>
              </button>
            </div>
          )}
          {/* ============================================================ */}

        </div>
      </section>
    </>
  );
};

export default DeliverySection;
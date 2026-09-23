import React, { useState, useEffect, useRef } from 'react';
import { FiCheckCircle, FiTruck, FiHeadphones, FiStar, FiAward, FiHeart } from 'react-icons/fi';

const AboutSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState(null);

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

  const features = [
    { icon: FiCheckCircle, text: 'Сертификатталган', color: 'emerald' },
    { icon: FiTruck, text: 'Тез жеткирүү', color: 'blue' },
    { icon: FiHeadphones, text: '24/7 колдоо', color: 'purple' },
  ];

  const stats = [
    { icon: FiStar, value: '4.9', label: 'Рейтинг', color: 'yellow' },
    { icon: FiAward, value: '+22', label: 'Сатуучулар', color: 'primary' },
    { icon: FiHeart, value: '5K+', label: 'Кардарлар', color: 'pink' },
  ];

  return (
    <>
      {/* ====== INLINE ANIMATIONS CSS ====== */}
      <style>{`
        /* ====== SCROLL REVEAL ====== */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(50px) scale(.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes badgePop {
          0% { opacity: 0; transform: scale(.3) rotate(-20deg); }
          60% { transform: scale(1.15) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-14px) rotate(-2deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        /* Visibility states */
        .reveal { opacity: 0; }
        .reveal.visible { opacity: 1; }

        /* ====== BACKGROUND DECORATIONS ====== */
        @keyframes blobPulse {
          0%, 100% { transform: scale(1); opacity: .35; }
          50% { transform: scale(1.15); opacity: .5; }
        }
        .about-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: blobPulse 8s ease-in-out infinite;
          pointer-events: none;
        }

        /* ====== FEATURE PILLS ====== */
        .feature-pill {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .feature-pill::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(124,108,255,.08), transparent);
          transform: translateX(-100%);
          transition: transform .6s cubic-bezier(.34,1.56,.64,1);
        }
        .feature-pill:hover::before {
          transform: translateX(100%);
        }
        .feature-pill:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 12px 30px -12px rgba(124,108,255,.35);
        }
        .feature-pill:hover .feature-icon {
          transform: rotate(-12deg) scale(1.15);
          color: #22E8B0;
        }
        .feature-icon {
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== IMAGE CARD ====== */
        .about-image-wrap {
          position: relative;
          transition: transform .6s cubic-bezier(.34,1.56,.64,1);
        }
        .about-image-wrap:hover {
          transform: translateY(-8px) rotate(-1deg);
        }
        .about-image-wrap img {
          transition: transform .8s cubic-bezier(.22,1,.36,1);
        }
        .about-image-wrap:hover img {
          transform: scale(1.08);
        }
        .about-image-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: linear-gradient(135deg, transparent 40%, rgba(124,108,255,.15));
          opacity: 0;
          transition: opacity .5s ease;
          pointer-events: none;
        }
        .about-image-wrap:hover::after {
          opacity: 1;
        }

        /* ====== FLOATING STATS BADGES ====== */
        .float-badge {
          position: absolute;
          border-radius: 1.5rem;
          box-shadow: 0 20px 45px -18px rgba(0,0,0,.35);
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
          overflow: hidden;
        }
        .float-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.3), transparent 60%);
          opacity: 0;
          transition: opacity .4s ease;
        }
        .float-badge:hover::before {
          opacity: 1;
        }
        .float-badge:hover {
          transform: scale(1.12) rotate(0) !important;
          box-shadow: 0 25px 55px -18px rgba(0,0,0,.45);
        }
        .float-badge .badge-num {
          display: inline-block;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .float-badge:hover .badge-num {
          transform: scale(1.15);
        }

        /* ====== ICON PULSE ====== */
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .about-title-icon {
          animation: iconPulse 2.5s ease-in-out infinite;
        }

        /* ====== GRADIENT TEXT ====== */
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .about-gradient-text {
          background: linear-gradient(90deg, #7C6CFF, #22E8B0, #7C6CFF);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease infinite;
        }

        /* ====== EYEBROW PILL ====== */
        @keyframes eyebrowGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,108,255,.4); }
          50% { box-shadow: 0 0 0 10px rgba(124,108,255,0); }
        }
        .about-eyebrow {
          animation: eyebrowGlow 2.5s ease-out infinite;
        }

        /* ====== DOT SEPARATOR ====== */
        @keyframes dotBlink {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .dot-blink {
          animation: dotBlink 1.6s ease-in-out infinite;
        }
        .dot-blink:nth-child(2) { animation-delay: .2s; }
        .dot-blink:nth-child(3) { animation-delay: .4s; }
      `}</style>

      <section 
        id="about-section" 
        ref={sectionRef}
        className="relative py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
      >
        {/* ====== BACKGROUND DECORATIONS ====== */}
        <div className="about-blob bg-purple-400 w-96 h-96 -top-20 -left-20" />
        <div className="about-blob bg-green-300 w-80 h-80 bottom-0 right-0" style={{ animationDelay: '2s' }} />
        <div className="about-blob bg-yellow-300 w-64 h-64 top-1/2 left-1/3" style={{ animationDelay: '4s', opacity: .2 }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            {/* ====== LEFT: TEXT ====== */}
            <div className="space-y-6">

              {/* Eyebrow */}
              <span 
                className={`about-eyebrow inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
                  bg-primary/10 text-primary text-sm font-semibold reveal ${visible ? 'visible' : ''}`}
                style={{ animation: visible ? 'fadeUp .6s cubic-bezier(.34,1.56,.64,1) both, eyebrowGlow 2.5s ease-out infinite 1s' : 'none' }}
              >
                <span className="w-2 h-2 rounded-full bg-primary dot-blink" />
                Биз жөнүндө
              </span>

              {/* Title */}
              <h2 
                className={`text-4xl md:text-5xl font-bold text-primary leading-tight reveal ${visible ? 'visible' : ''}`}
                style={{ animation: visible ? 'fadeUp .7s cubic-bezier(.34,1.56,.64,1) .1s both' : 'none' }}
              >
                Nooruz Market —{' '}
                <span className="about-gradient-text">сапат жана ишеним</span>
              </h2>

              {/* Description 1 */}
              <p 
                className={`text-lg text-gray-600 leading-relaxed reveal ${visible ? 'visible' : ''}`}
                style={{ animation: visible ? 'fadeUp .7s cubic-bezier(.34,1.56,.64,1) .2s both' : 'none' }}
              >
                Nooruz Market — Кыргызстандын эң мыкты айыл чарба өндүрүүчүлөрүнүн жана фермерлеринин азыктарын бир платформада чогулткан онлайн-маркет.
              </p>

              {/* Description 2 */}
              <p 
                className={`text-lg text-gray-600 leading-relaxed reveal ${visible ? 'visible' : ''}`}
                style={{ animation: visible ? 'fadeUp .7s cubic-bezier(.34,1.56,.64,1) .3s both' : 'none' }}
              >
                Биздин максат — ар бир үй-бүлөгө таза, пайдалуу жана арзан азыктарды жеткирүү.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-4 pt-4">
                {features.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className={`feature-pill flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm 
                        reveal ${visible ? 'visible' : ''}`}
                      style={{ 
                        animation: visible ? `fadeUp .6s cubic-bezier(.34,1.56,.64,1) ${0.4 + i * 0.1}s both` : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon className="feature-icon text-primary text-2xl" />
                      <span className="font-bold">{item.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 pt-6">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 reveal ${visible ? 'visible' : ''}`}
                      style={{ animation: visible ? `fadeUp .6s cubic-bezier(.34,1.56,.64,1) ${0.7 + i * 0.1}s both` : 'none' }}
                    >
                      <Icon className="text-primary text-2xl" />
                      <div>
                        <p className="text-xl font-bold text-primary">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ====== RIGHT: IMAGE ====== */}
            <div 
              className="relative reveal"
              style={{ 
                perspective: '1200px',
                animation: visible ? 'fadeRight .9s cubic-bezier(.34,1.56,.64,1) .3s both' : 'none'
              }}
            >
              <div className="about-image-wrap bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" 
                  alt="About" 
                  className="w-full h-72 md:h-96 object-cover" 
                />
              </div>

              {/* Bottom-right badge — сатуучулар */}
              <div 
                className="float-badge -bottom-6 -right-6 bg-yellow-500 p-4 reveal"
                onMouseEnter={() => setHoveredBadge('sellers')}
                onMouseLeave={() => setHoveredBadge(null)}
                style={{ 
                  animation: visible 
                    ? `badgePop .7s cubic-bezier(.34,1.56,.64,1) .8s both, floatB 4s ease-in-out 1.5s infinite`
                    : 'none'
                }}
              >
                <span className="badge-num text-white font-bold text-2xl block">+22</span>
                <p className="text-white/80 text-xs">Сатуучулар</p>
              </div>

              {/* Top-left badge — таза азыктар */}
              <div 
                className="float-badge -top-6 -left-6 bg-primary p-4 reveal"
                onMouseEnter={() => setHoveredBadge('quality')}
                onMouseLeave={() => setHoveredBadge(null)}
                style={{ 
                  animation: visible 
                    ? `badgePop .7s cubic-bezier(.34,1.56,.64,1) 1s both, floatA 5s ease-in-out 1.7s infinite`
                    : 'none'
                }}
              >
                <span className="badge-num text-white font-bold text-2xl block">100%</span>
                <p className="text-white/80 text-xs">Таза азыктар</p>
              </div>

              {/* NEW: Left-middle badge — delivery time */}
              <div 
                className="float-badge top-1/2 -left-10 bg-green-500 p-3 reveal hidden md:block"
                onMouseEnter={() => setHoveredBadge('delivery')}
                onMouseLeave={() => setHoveredBadge(null)}
                style={{ 
                  animation: visible 
                    ? `badgePop .7s cubic-bezier(.34,1.56,.64,1) 1.2s both, floatC 4.5s ease-in-out 2s infinite`
                    : 'none'
                }}
              >
                <div className="flex items-center gap-2">
                  <FiTruck className="text-white text-xl" />
                  <div>
                    <p className="text-white font-bold text-sm">30 мүн</p>
                    <p className="text-white/80 text-[10px]">Жеткирүү</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;
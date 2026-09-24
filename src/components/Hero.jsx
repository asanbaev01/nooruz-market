import React, { useState, useEffect, useRef } from 'react';
import { FiArrowRight, FiBriefcase, FiStar, FiTrendingUp, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ onShopNow, onStartSelling }) => {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });
  };

  const stats = [
    { icon: FiShoppingBag, value: '5K+', label: t('hero.stat1') },
    { icon: FiStar, value: '4.9', label: t('hero.stat2') },
    { icon: FiTrendingUp, value: '+22', label: t('hero.stat3') },
  ];

  return (
    <>
      <style>{`
        @keyframes heroIn { from { opacity: 0; } to { opacity: 1; } }
        .hero-section { opacity: 0; }
        .hero-section.visible { opacity: 1; animation: heroIn 1s ease-out both; }
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.08) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .hero-bg-image { animation: kenBurns 20s ease-in-out infinite; }
        @keyframes gradientPulse {
          0%, 100% { opacity: .5; }
          50% { opacity: .7; }
        }
        .hero-gradient-overlay { animation: gradientPulse 6s ease-in-out infinite; }
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(50px) scale(.95); }
          60% { transform: translateY(-10px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hero-card {
          opacity: 0;
          animation: cardIn 1s cubic-bezier(.34,1.56,.64,1) .2s both;
          transition: transform .6s cubic-bezier(.34,1.56,.64,1), box-shadow .6s;
          will-change: transform;
        }
        .hero-card.visible { opacity: 1; }
        .hero-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 40px 80px -20px rgba(0,0,0,.6);
        }
        @keyframes glassShine {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        .hero-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
          transform: translateX(-150%) skewX(-20deg);
          pointer-events: none;
          border-radius: inherit;
        }
        .hero-card:hover::before { animation: glassShine 1.5s ease-out; }
        @keyframes cornerPulse {
          0%, 100% { opacity: .4; transform: scale(1); }
          50% { opacity: .8; transform: scale(1.1); }
        }
        .hero-corner {
          position: absolute;
          width: 40px; height: 40px;
          border: 2px solid rgba(124,108,255,.5);
          border-radius: 8px;
          animation: cornerPulse 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes titleIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-title { opacity: 0; animation: titleIn .9s cubic-bezier(.34,1.56,.64,1) .4s both; }
        @keyframes shimmerText {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ffffff 0%, #22E8B0 30%, #7C6CFF 50%, #22E8B0 70%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerText 4s linear infinite;
          filter: drop-shadow(0 2px 8px rgba(124,108,255,.3));
        }
        @keyframes descIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-desc { opacity: 0; animation: descIn .9s cubic-bezier(.34,1.56,.64,1) .55s both; }
        .hero-btn {
          opacity: 0;
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .hero-btn.visible { opacity: 1; animation: titleIn .8s cubic-bezier(.34,1.56,.64,1) both; }
        .hero-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-100%);
          transition: transform .8s ease;
        }
        .hero-btn:hover::before { transform: translateX(100%); }
        .hero-btn:hover { transform: translateY(-3px) scale(1.03); }
        .hero-btn:active { transform: scale(.97); }
        .hero-btn svg { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .hero-btn:hover svg { transform: translateX(5px); }
        @keyframes badgeFloatA {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes badgeFloatB {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(-2deg); }
        }
        .hero-float-badge {
          position: absolute;
          border-radius: 1rem;
          backdrop-filter: blur(12px);
          box-shadow: 0 12px 30px -8px rgba(0,0,0,.4);
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
          z-index: 20;
          cursor: pointer;
        }
        .hero-float-badge:hover { transform: scale(1.1) rotate(0) !important; }
        .hero-float-badge.badge-a { animation: badgeFloatA 4s ease-in-out infinite; }
        .hero-float-badge.badge-b { animation: badgeFloatB 5s ease-in-out infinite; }
        @keyframes statIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-stat { opacity: 0; }
        .hero-stat.visible { opacity: 1; animation: statIn .6s cubic-bezier(.34,1.56,.64,1) both; }
        .hero-stat-icon { transition: all .4s cubic-bezier(.34,1.56,.64,1); }
        .hero-stat:hover .hero-stat-icon { transform: rotate(-15deg) scale(1.15); color: #22E8B0; }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: .6; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        @keyframes scrollFade {
          0%, 100% { opacity: .3; }
          50% { opacity: .8; }
        }
        .scroll-indicator { animation: scrollBounce 2s ease-in-out infinite; }
        .scroll-indicator-dot { animation: scrollFade 1.5s ease-in-out infinite; }
        @keyframes particleRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: .8; }
          80% { opacity: .8; }
          100% { transform: translateY(-200px) scale(1.3); opacity: 0; }
        }
        .hero-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleRise 8s linear infinite;
        }
        @keyframes beamRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .light-beam {
          position: absolute;
          background: linear-gradient(to bottom, transparent, rgba(124,108,255,.15), transparent);
          width: 2px; height: 100%;
          pointer-events: none;
          animation: beamRotate 30s linear infinite;
          transform-origin: center;
        }
        @keyframes tagPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,232,176,.5); }
          50% { box-shadow: 0 0 0 8px rgba(34,232,176,0); }
        }
        .hero-tag { animation: tagPulse 2.5s ease-in-out infinite; }
      `}</style>

      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className={`hero-section relative h-[600px] md:h-[680px] flex items-center overflow-hidden ${visible ? 'visible' : ''}`}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600"
            alt="Fresh vegetables"
            className="hero-bg-image w-full h-full object-cover brightness-[.65]"
            style={{ transform: `translateY(${scrollY * 0.3}px) scale(1.1)` }}
          />
          <div className="hero-gradient-overlay absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="light-beam" style={{ left: '15%' }} />
          <div className="light-beam" style={{ left: '45%', animationDelay: '10s' }} />
          <div className="light-beam" style={{ left: '75%', animationDelay: '20s' }} />

          <span className="hero-particle w-2 h-2 bg-purple-400" style={{ left: '10%', bottom: '20%', animationDelay: '0s' }} />
          <span className="hero-particle w-1.5 h-1.5 bg-green-400" style={{ left: '30%', bottom: '10%', animationDelay: '2s' }} />
          <span className="hero-particle w-2.5 h-2.5 bg-yellow-300" style={{ left: '60%', bottom: '30%', animationDelay: '4s' }} />
          <span className="hero-particle w-1 h-1 bg-white" style={{ left: '80%', bottom: '15%', animationDelay: '6s' }} />
          <span className="hero-particle w-2 h-2 bg-purple-300" style={{ left: '50%', bottom: '25%', animationDelay: '3s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div
            className="hero-card relative max-w-2xl bg-white/10 backdrop-blur-xl p-10 md:p-12 rounded-3xl border border-white/20 shadow-2xl"
            style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)` }}
          >
            <span className="hero-corner top-3 left-3 border-t-2 border-l-2 rounded-tl-lg" />
            <span className="hero-corner top-3 right-3 border-t-2 border-r-2 rounded-tr-lg" style={{ animationDelay: '.5s' }} />
            <span className="hero-corner bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg" style={{ animationDelay: '1s' }} />
            <span className="hero-corner bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg" style={{ animationDelay: '1.5s' }} />

            {/* ✅ КОТОРУЛГАН BADGE */}
            <div className="hero-tag inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-4">
              <FiCheckCircle className="text-sm" />
              {t('hero.verifiedBadge')}
            </div>

            {/* ✅ КОТОРУЛГАН TITLE */}
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="shimmer-text">{t('hero.title')}</span>
            </h1>

            {/* ✅ КОТОРУЛГАН DESC */}
            <p className="hero-desc text-lg text-white/90 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* ✅ КОТОРУЛГАН BUTTONS */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={onShopNow}
                className="hero-btn visible bg-primary text-white px-10 py-4 rounded-xl font-bold shadow-lg flex items-center gap-3 group"
                style={{ animationDelay: '.7s' }}
              >
                {t('hero.shopNow')}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onStartSelling}
                className="hero-btn visible bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/30 flex items-center gap-2 border border-white/20"
                style={{ animationDelay: '.85s' }}
              >
                <FiBriefcase /> {t('hero.startSelling')}
              </button>
            </div>

            {/* ✅ КОТОРУЛГАН STATS */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-white/15">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className={`hero-stat flex items-center gap-3 ${visible ? 'visible' : ''}`}
                    style={{ animationDelay: `${1 + i * 0.1}s` }}
                  >
                    <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                      <Icon className="hero-stat-icon text-primary text-lg" />
                    </span>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">{stat.value}</p>
                      <p className="text-white/60 text-xs mt-1">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* FLOATING BADGES */}
        <div className="hero-float-badge badge-a hidden lg:block bg-white/95 backdrop-blur p-4 rounded-2xl top-[15%] right-[8%]" style={{ animationDelay: '.3s' }}>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <FiCheckCircle className="text-emerald-600 text-xl" />
            </span>
            <div>
              <p className="text-gray-800 font-bold text-sm">{t('hero.floatBadge1Title')}</p>
              <p className="text-gray-500 text-xs">{t('hero.floatBadge1Sub')}</p>
            </div>
          </div>
        </div>

        <div className="hero-float-badge badge-b hidden lg:block bg-white/95 backdrop-blur p-4 rounded-2xl bottom-[15%] right-[12%]" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <FiTrendingUp className="text-purple-600 text-xl" />
            </span>
            <div>
              <p className="text-gray-800 font-bold text-sm">{t('hero.floatBadge2Title')}</p>
              <p className="text-gray-500 text-xs">{t('hero.floatBadge2Sub')}</p>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 scroll-indicator flex flex-col items-center gap-2 text-white/60 z-10">
          <span className="text-xs">{t('hero.scroll')}</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
            <span className="scroll-indicator-dot w-1.5 h-2 rounded-full bg-white" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
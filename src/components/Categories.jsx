import React, { useState, useEffect, useRef } from 'react';
import { FiGrid, FiCheck, FiStar } from 'react-icons/fi';
import { categories } from '../data/products';

const Categories = ({ onSelect, selected }) => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [pressedId, setPressedId] = useState(null);

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

  const handleClick = (id) => {
    setPressedId(id);
    setTimeout(() => setPressedId(null), 500);
    onSelect(id);
  };

  return (
    <>
      {/* ====== INLINE ANIMATIONS CSS ====== */}
      <style>{`
        /* ====== SECTION ENTRY ====== */
        @keyframes sectionIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .categories-section {
          opacity: 0;
        }
        .categories-section.visible {
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
        .categories-title {
          animation: titleIn .7s cubic-bezier(.34,1.56,.64,1) both;
        }
        .categories-title-icon {
          animation: titleIconPulse 2.5s ease-in-out infinite;
        }

        /* ====== GRADIENT LINE ====== */
        @keyframes lineExpand {
          from { width: 0; opacity: 0; }
          to { width: 80px; opacity: 1; }
        }
        .title-line {
          animation: lineExpand .8s cubic-bezier(.34,1.56,.64,1) .3s both;
        }

        /* ====== CATEGORY ITEM ENTRY (stagger) ====== */
        @keyframes catIn {
          0% { opacity: 0; transform: translateY(30px) scale(.8); }
          60% { transform: translateY(-6px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cat-item {
          opacity: 0;
        }
        .cat-item.visible {
          opacity: 1;
          animation: catIn .6s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== CIRCLE HOVER ====== */
        .cat-circle-wrap {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .cat-item:hover .cat-circle-wrap {
          transform: translateY(-12px) scale(1.05);
        }

        /* ====== CIRCLE ITSELF ====== */
        .cat-circle {
          position: relative;
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 8px 20px -10px rgba(124,108,255,.2);
        }
        .cat-item:hover .cat-circle {
          box-shadow: 0 20px 40px -12px rgba(124,108,255,.5);
          border-color: #7C6CFF;
        }

        /* Ripple pulse ring */
        @keyframes ripplePulse {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .cat-circle::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #7C6CFF;
          opacity: 0;
          pointer-events: none;
        }
        .cat-item:hover .cat-circle::before {
          animation: ripplePulse 1.6s ease-out infinite;
        }

        /* ====== IMAGE ====== */
        .cat-image {
          transition: transform .7s cubic-bezier(.34,1.56,.64,1);
        }
        .cat-item:hover .cat-image {
          transform: scale(1.18) rotate(-4deg);
        }

        /* ====== GLOW OVERLAY ====== */
        @keyframes glowShine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        .cat-circle::after {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 40px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
          transform: translateX(-100%) skewX(-20deg);
          pointer-events: none;
          z-index: 2;
        }
        .cat-item:hover .cat-circle::after {
          animation: glowShine .8s ease-out;
        }

        /* ====== SELECTED STATE ====== */
        .cat-item.selected .cat-circle {
          border-color: #7C6CFF;
          box-shadow: 0 0 0 4px rgba(124,108,255,.15), 0 20px 40px -12px rgba(124,108,255,.5);
          transform: scale(1.05);
        }
        .cat-item.selected .cat-circle-wrap {
          transform: translateY(-8px);
        }

        /* Selected checkmark */
        @keyframes checkPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .cat-check {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #7C6CFF;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px -4px rgba(124,108,255,.6);
          animation: checkPop .5s cubic-bezier(.34,1.56,.64,1);
          z-index: 3;
        }

        /* ====== PRESSED STATE ====== */
        @keyframes pressPop {
          0% { transform: scale(1); }
          50% { transform: scale(.9); }
          100% { transform: scale(1); }
        }
        .cat-item.pressed .cat-circle {
          animation: pressPop .5s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== LABEL ====== */
        .cat-label {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .cat-item:hover .cat-label {
          color: #7C6CFF;
          transform: translateY(-2px);
          letter-spacing: .3px;
        }
        .cat-item.selected .cat-label {
          color: #7C6CFF;
          font-weight: 700;
        }

        /* ====== NUMBER BADGE ====== */
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-3px) scale(1.05); }
        }
        .cat-badge {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(124,108,255,.1);
          color: #7C6CFF;
          font-size: 10px;
          font-weight: 700;
          animation: badgeFloat 3s ease-in-out infinite;
          z-index: 3;
        }
        .cat-item:hover .cat-badge {
          background: #7C6CFF;
          color: white;
        }

        /* ====== BACKGROUND PARTICLES ====== */
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) rotate(0); opacity: .3; }
          50% { transform: translateY(-12px) rotate(180deg); opacity: .7; }
        }
        .cat-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 4s ease-in-out infinite;
        }

        /* ====== TITLE UNDERLINE DOT ====== */
        @keyframes dotBlink {
          0%, 100% { opacity: .3; transform: scale(.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        .cat-dot {
          animation: dotBlink 1.8s ease-in-out infinite;
        }
        .cat-dot:nth-child(2) { animation-delay: .2s; }
        .cat-dot:nth-child(3) { animation-delay: .4s; }
      `}</style>

      <section
        ref={sectionRef}
        className={`categories-section py-24 max-w-7xl mx-auto px-6 ${
          visible ? 'visible' : ''
        }`}
      >
        {/* ====== TITLE ====== */}
        <div className="text-center mb-12">
          <h2 className="categories-title text-3xl font-bold flex items-center justify-center gap-3">
            <FiGrid className="text-primary text-3xl categories-title-icon" />
            Азыктар категориясы
          </h2>

          {/* Underline dots */}
          <div className="flex justify-center items-center gap-2 mt-4">
            <span className="title-line h-[3px] bg-gradient-to-r from-transparent to-primary rounded-full" />
            <span className="cat-dot w-2 h-2 rounded-full bg-primary" />
            <span className="cat-dot w-2 h-2 rounded-full bg-primary" />
            <span className="cat-dot w-2 h-2 rounded-full bg-primary" />
            <span className="title-line h-[3px] bg-gradient-to-l from-transparent to-primary rounded-full" />
          </div>
        </div>

        {/* ====== CATEGORIES ====== */}
        <div className="flex flex-wrap justify-center gap-8">
          {categories.map((cat, i) => {
            const isSelected = selected === cat.id;
            const isPressed = pressedId === cat.id;
            const isHovered = hoveredId === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleClick(cat.id)}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`cat-item flex flex-col items-center gap-3 cursor-pointer group ${
                  visible ? 'visible' : ''
                } ${isSelected ? 'selected' : ''} ${isPressed ? 'pressed' : ''}`}
                style={{
                  animationDelay: visible ? `${i * 0.08}s` : '0s',
                }}
              >
                {/* Circle wrap */}
                <div className="cat-circle-wrap relative">
                  {/* Circle */}
                  <div
                    className={`cat-circle w-24 h-24 rounded-full flex items-center justify-center 
                      overflow-hidden border-2 relative
                      ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-white bg-gray-100'
                      }`}
                  >
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="cat-image w-full h-full object-cover"
                      />
                    ) : (
                      <FiGrid className="text-3xl text-primary" />
                    )}

                    {/* Count badge */}
                    <span className="cat-badge">
                      {cat.count || '🥗'}
                    </span>

                    {/* Particles */}
                    <span
                      className="cat-particle w-1.5 h-1.5 bg-purple-400"
                      style={{
                        top: '15%',
                        right: '15%',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                    <span
                      className="cat-particle w-1 h-1 bg-green-400"
                      style={{
                        bottom: '20%',
                        left: '15%',
                        animationDelay: `${i * 0.6}s`,
                      }}
                    />
                  </div>

                  {/* Selected checkmark */}
                  {isSelected && (
                    <span className="cat-check">
                      <FiCheck className="text-sm" />
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`cat-label text-sm text-center font-medium ${
                    isSelected ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {cat.name}
                </span>

                {/* Small star for selected */}
                {isSelected && (
                  <FiStar className="text-yellow-500 text-xs -mt-1" fill="currentColor" />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Categories;
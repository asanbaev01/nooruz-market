import React from 'react';
import { FiArrowRight, FiBriefcase } from 'react-icons/fi';

const Hero = ({ onShopNow, onStartSelling }) => {
  return (
    <section className="relative h-[600px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600" alt="Fresh vegetables" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-2xl bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 shadow-2xl">
          <h1 className="text-5xl font-bold text-white mb-6 shimmer-text">Жаңы түшүм - Жаңы сапаты</h1>
          <p className="text-lg text-white/90 mb-8 leading-relaxed">
            Таза жана балгын азыктар өрөөндүн эң мыкты чарбаларынан! Ар бир үйгө табигый даам тартуулайбыз.
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={onShopNow} className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-3 group">
              Азыр сатып алуу
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={onStartSelling} className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:scale-105 hover:bg-white/30 transition-all flex items-center gap-2">
              <FiBriefcase /> Сатуу баштоо
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
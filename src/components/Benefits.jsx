import React from 'react';
import { FiDollarSign, FiZap, FiFeather, FiPackage } from 'react-icons/fi';

const Benefits = () => {
  const items = [
    { icon: FiDollarSign, title: 'Эң арзан баалар', desc: 'Түз жеткирүүчүлөрдөн', color: 'primary' },
    { icon: FiZap, title: 'Тез жеткирүү', desc: '30 мүнөттүн ичинде', color: 'primary' },
    { icon: FiFeather, title: '100% Табигый', desc: 'Химиясыз балгын азыктар', color: 'primary' },
    { icon: FiPackage, title: 'Оптом жана розница', desc: 'Бардык көлөмдөр', color: 'gold' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {items.map((b, i) => {
          const Icon = b.icon;
          const isGold = b.color === 'gold';
          return (
            <div key={i} className={`bg-white p-6 rounded-2xl shadow-xl flex items-center gap-5 border-b-4 hover-lift ${isGold ? 'border-yellow-500' : 'border-primary'}`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isGold ? 'bg-yellow-500/10 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                <Icon className="text-3xl" />
              </div>
              <div>
                <h3 className="font-semibold mb-0.5">{b.title}</h3>
                <p className="text-sm text-gray-500">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Benefits;
import React from 'react';
import { FiCheckCircle, FiTruck, FiHeadphones } from 'react-icons/fi';

const AboutSection = () => {
  return (
    <section id="about-section" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">Биз жөнүндө</span>
            <h2 className="text-4xl font-bold text-primary">Nooruz Market — сапат жана ишеним</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Nooruz Market — Кыргызстандын эң мыкты айыл чарба өндүрүүчүлөрүнүн жана фермерлеринин азыктарын бир платформада чогулткан онлайн-маркет.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Биздин максат — ар бир үй-бүлөгө таза, пайдалуу жана арзан азыктарды жеткирүү.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              {[
                { icon: FiCheckCircle, text: 'Сертификатталган' },
                { icon: FiTruck, text: 'Тез жеткирүү' },
                { icon: FiHeadphones, text: '24/7 колдоо' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm">
                  <item.icon className="text-primary text-2xl" />
                  <span className="font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover-lift">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800" alt="About" className="w-full h-72 object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-yellow-500 p-4 rounded-2xl shadow-lg">
              <span className="text-white font-bold text-2xl">+22</span>
              <p className="text-white/80 text-xs">Сатуучулар</p>
            </div>
            <div className="absolute -top-6 -left-6 bg-primary p-4 rounded-2xl shadow-lg">
              <span className="text-white font-bold text-2xl">100%</span>
              <p className="text-white/80 text-xs">Таза азыктар</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
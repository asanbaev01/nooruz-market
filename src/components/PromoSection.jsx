import React from 'react';
import { FiTag, FiZap, FiPackage, FiArrowRight } from 'react-icons/fi';

const PromoSection = () => {
  return (
    <section id="promo-section" className="py-24 bg-gradient-to-r from-primary/5 via-white to-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
          <FiTag className="text-primary text-3xl" /> Акциялар жана сунуштар
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-primary to-primary-light p-8 rounded-3xl shadow-xl text-white hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Жаңы жылдык супер акция!</h3>
                <p className="text-lg opacity-90">Бардык товарларга 20% арзандатуу</p>
                <p className="text-sm opacity-75 mt-4">Код: <span className="font-bold bg-white/20 px-4 py-1.5 rounded-full">NOORUZ20</span></p>
              </div>
              <FiZap className="text-5xl opacity-50" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl hover-lift border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-600">
                <FiZap className="text-3xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Багыттама сунушу</h3>
                <p className="text-sm text-gray-600">Досту чакырып, биргелешип сатып алууга 500 сом бонус алыңыз!</p>
                <button className="mt-4 text-primary font-bold text-sm hover:underline flex items-center gap-1">
                  Толугураак <FiArrowRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-300 p-8 rounded-3xl shadow-xl text-gray-900 hover:scale-[1.02] transition-all">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Оптом сатып алуу!</h3>
                <p className="text-lg opacity-90">Көп алсаңыз, арзан</p>
                <p className="text-sm opacity-75 mt-4">10% дан 30% чейин <span className="font-bold bg-white/20 px-4 py-1.5 rounded-full">арзандатуу</span></p>
              </div>
              <FiPackage className="text-5xl opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
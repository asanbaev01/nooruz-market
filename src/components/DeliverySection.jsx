import React from 'react';
import { FiClock, FiDollarSign, FiPackage } from 'react-icons/fi';

const DeliverySection = () => {
  const items = [
    { icon: FiClock, title: 'Тез жеткирүү', desc: 'Бишкек шаары боюнча 30 мүнөттө, районборборлордо 2 күндө жеткиребиз.', border: 'border-primary', color: 'primary' },
    { icon: FiDollarSign, title: 'Төлөм ыкмалары', desc: 'Колма-кол, карта менен же банк которуу аркылуу төлөй аласыз.', border: 'border-yellow-500', color: 'gold' },
    { icon: FiPackage, title: 'Акысыз кайтаруу', desc: 'Сапатына көңүлүңүз толбосо, 7 күндүн ичинде акчаңызды кайтарабыз.', border: 'border-primary', color: 'primary' },
  ];

  return (
    <section id="delivery-section" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
          <FiPackage className="text-primary text-3xl" /> Жеткирилүү шарттары
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const Icon = item.icon;
            const isGold = item.color === 'gold';
            return (
              <div key={i} className={`bg-gray-50 p-8 rounded-3xl shadow-lg hover-lift text-center border-b-4 ${item.border}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isGold ? 'bg-yellow-500/10 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                  <Icon className="text-4xl" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DeliverySection;
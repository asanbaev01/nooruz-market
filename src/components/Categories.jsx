import React from 'react';
import { FiGrid } from 'react-icons/fi';
import { categories } from '../data/products';

const Categories = ({ onSelect, selected }) => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
        <FiGrid className="text-primary text-3xl" />
        Азыктар категориясы
      </h2>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat) => (
          <div key={cat.id} onClick={() => onSelect(cat.id)} className="flex flex-col items-center gap-3 cursor-pointer group">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-inner group-hover:shadow-xl group-hover:-translate-y-2 transition-all overflow-hidden border-2 ${selected === cat.id ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-white bg-gray-100'}`}>
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              ) : (
                <FiGrid className="text-3xl text-primary" />
              )}
            </div>
            <span className={`text-sm text-center font-medium transition-colors ${selected === cat.id ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
import React from 'react';
import { FiShoppingCart, FiStar, FiPackage, FiHome, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ProductCard = ({ product, onDetail }) => {
  const { addToCart } = useApp();

  const renderStars = () => Array.from({ length: 5 }, (_, i) => (
    <FiStar key={i} style={{ fill: i < Math.floor(product.rating) ? '#006948' : 'none', color: i < Math.floor(product.rating) ? '#006948' : '#d1d5db' }} />
  ));

  const badgeClass = {
    new: 'bg-primary text-white',
    hit: 'bg-gray-900 text-white',
    sale: 'bg-red-600 text-white',
    popular: 'bg-gray-200 text-primary',
    organic: 'bg-green-200 text-green-900',
  }[product.badge] || '';

  return (
    <div className="product-card bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden cursor-pointer" onClick={() => onDetail(product)}>
      <div className="absolute top-4 left-4 z-10">
        {product.badge && <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeClass}`}>{product.badgeText}</span>}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1">
        <span className={`text-xs flex items-center gap-1 ${product.inStock ? 'text-primary' : 'text-red-500'}`}>
          {product.inStock ? <FiCheckCircle /> : <FiXCircle />}
          {product.inStock ? 'Бар' : 'Жок'}
        </span>
        <div className="flex gap-1">
          {(product.saleType === 'both' || product.saleType === 'wholesale') && <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Оптом</span>}
          {(product.saleType === 'both' || product.saleType === 'retail') && <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">Розница</span>}
        </div>
      </div>

      <div className="h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" loading="lazy" />
      </div>

      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>

      <div className="flex items-center gap-1 mb-2">
        {renderStars()}
        <span className="text-xs ml-1 text-gray-500">({product.reviews})</span>
      </div>

      <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <FiHome /> {product.seller}
      </div>

      <div className="mt-auto flex justify-between items-center">
        <div>
          <span className="text-xl font-bold text-primary">{product.price} сом</span>
          {product.originalPrice && <span className="text-xs text-gray-400 line-through block">{product.originalPrice} сом</span>}
          {product.wholesalePrice && <span className="text-xs text-yellow-600 font-medium block">Оптом: {product.wholesalePrice} сом</span>}
        </div>
        <div className="flex gap-2">
          {product.wholesalePrice && (
            <button onClick={(e) => { e.stopPropagation(); addToCart(product, true); }} className="bg-yellow-500/10 text-yellow-600 p-3 rounded-lg hover:bg-yellow-500 hover:text-white transition-all active:scale-90" title="Оптом кошуу">
              <FiPackage />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); addToCart(product, false); }} className="bg-primary/10 text-primary p-3 rounded-lg hover:bg-primary hover:text-white transition-all active:scale-90">
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React from 'react';
import { FiX, FiShoppingCart, FiPackage, FiStar, FiCheckCircle, FiXCircle, FiMapPin, FiAward } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useApp();
  if (!product) return null;

  const renderStars = () => Array.from({ length: 5 }, (_, i) => (
    <FiStar key={i} style={{ fill: i < Math.floor(product.rating) ? '#006948' : 'none', color: i < Math.floor(product.rating) ? '#006948' : '#d1d5db' }} />
  ));

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 shadow-2xl animate-fade-scale" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-all hover:rotate-90 duration-300">
            <FiX className="text-3xl" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-gray-100">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border-2 ${i === 1 ? 'border-primary' : 'border-transparent'}`}>
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-2xl font-bold">{product.name}</h2>
                {product.badge && <span className="text-xs font-bold px-3 py-1 rounded-full uppercase bg-primary text-white">{product.badgeText}</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {(product.saleType === 'both' || product.saleType === 'wholesale') && <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">Оптом</span>}
                {(product.saleType === 'both' || product.saleType === 'retail') && <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">Розница</span>}
              </div>

              <div className="flex items-center gap-2 mb-3">
                {renderStars()}
                <span className="text-sm text-gray-500">({product.reviews} оюн)</span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-3xl font-bold text-primary">{product.price} сом</span>
                {product.originalPrice && <span className="text-sm text-gray-400 line-through">{product.originalPrice} сом</span>}
                {product.wholesalePrice && <span className="text-yellow-600 font-bold text-lg">Оптом: {product.wholesalePrice} сом</span>}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 text-xs flex items-center gap-1"><FiMapPin /> Өлкө</span>
                <p className="font-bold">{product.origin}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 text-xs flex items-center gap-1"><FiAward /> Салмагы</span>
                <p className="font-bold">{product.weight}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 text-xs">Статус</span>
                <p className={`font-bold flex items-center gap-1 ${product.inStock ? 'text-primary' : 'text-red-500'}`}>
                  {product.inStock ? <FiCheckCircle /> : <FiXCircle />}
                  {product.inStock ? 'Камыпада бар' : 'Жок'}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-500 text-xs">Сатуучу</span>
                <p className="font-bold">{product.seller}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { addToCart(product, false); onClose(); }} className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                <FiShoppingCart /> Розница
              </button>
              {product.wholesalePrice && (
                <button onClick={() => { addToCart(product, true); onClose(); }} className="flex-1 bg-yellow-500 text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                  <FiPackage /> Оптом
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
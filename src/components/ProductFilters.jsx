import React from 'react';
import { FiFilter, FiDollarSign, FiPackage, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';

const ProductFilters = ({ saleType, onSaleTypeChange, activeFilters, onFilterChange, priceFilter, onPriceChange, stockFilter, onStockToggle, sellerFilter, onSellerToggle, onReset }) => {
  const filterItems = [
    { id: 'all', label: 'Бардык азыктар' },
    { id: 'sale', label: 'Акциядагылар' },
    { id: 'new', label: 'Жаңы келгендер' },
    { id: 'popular', label: 'Популярдуу' },
    { id: 'organic', label: 'Табигый' },
  ];

  const saleTypes = [
    { id: 'all', label: 'Бардыгы', Icon: null },
    { id: 'wholesale', label: 'Оптом', Icon: FiPackage },
    { id: 'retail', label: 'Розница', Icon: FiShoppingCart },
  ];

  return (
    <aside className="hidden lg:block space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiRefreshCw className="text-primary text-sm" /> Сатуу түрү
        </h3>
        <div className="flex gap-2">
          {saleTypes.map((t) => {
            const Icon = t.Icon;
            return (
              <button key={t.id} onClick={() => onSaleTypeChange(t.id)} className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border-2 transition-all flex items-center justify-center gap-1 ${saleType === t.id ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'}`}>
                {Icon && <Icon className="text-sm" />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiFilter className="text-primary text-sm" /> Категориялар
        </h3>
        <div className="space-y-3">
          {filterItems.map((f) => (
            <label key={f.id} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={activeFilters[f.id] || false} onChange={() => onFilterChange(f.id)} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary" />
              <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{f.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiDollarSign className="text-primary text-sm" /> Баасы (сом)
        </h3>
        <input type="range" min="0" max="5000" step="50" value={priceFilter} onChange={(e) => onPriceChange(parseInt(e.target.value))} className="w-full accent-primary" />
        <div className="flex justify-between mt-3 text-sm text-gray-500 font-bold">
          <span>0 сом</span>
          <span>{priceFilter} сом</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiPackage className="text-primary text-sm" /> Статус
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Камыпада бар</span>
            <button onClick={onStockToggle} className={`w-11 h-6 rounded-full transition-all relative ${stockFilter ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: stockFilter ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Сатуучулардан</span>
            <button onClick={onSellerToggle} className={`w-11 h-6 rounded-full transition-all relative ${sellerFilter ? 'bg-primary' : 'bg-gray-300'}`}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style={{ transform: sellerFilter ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
          </div>
        </div>
      </div>

      <button onClick={onReset} className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md">
        <FiRefreshCw className="text-sm" /> Фильтрлерди тазалоо
      </button>
    </aside>
  );
};

export default ProductFilters;
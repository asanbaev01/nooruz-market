import React, { useState } from 'react';
import { FiFilter, FiDollarSign, FiPackage, FiRefreshCw, FiShoppingCart, FiCheck } from 'react-icons/fi';

const ProductFilters = ({ saleType, onSaleTypeChange, activeFilters, onFilterChange, priceFilter, onPriceChange, stockFilter, onStockToggle, sellerFilter, onSellerToggle, onReset }) => {
  const [resetting, setResetting] = useState(false);

  const filterItems = [
    { id: 'all', label: 'Бардык азыктар', icon: '🥗' },
    { id: 'sale', label: 'Акциядагылар', icon: '🔥' },
    { id: 'new', label: 'Жаңы келгендер', icon: '✨' },
    { id: 'popular', label: 'Популярдуу', icon: '⭐' },
    { id: 'organic', label: 'Табигый', icon: '🌿' },
  ];

  const saleTypes = [
    { id: 'all', label: 'Бардыгы', Icon: null },
    { id: 'wholesale', label: 'Оптом', Icon: FiPackage },
    { id: 'retail', label: 'Розница', Icon: FiShoppingCart },
  ];

  const handleReset = () => {
    setResetting(true);
    onReset();
    setTimeout(() => setResetting(false), 700);
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <>
      <style>{`
        /* ====== SIDEBAR ENTRY ====== */
        @keyframes sidebarIn {
          0% { opacity: 0; transform: translateX(-20px); }
          60% { transform: translateX(4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .filters-sidebar {
          animation: sidebarIn .6s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== FILTER CARD ====== */
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(20px) scale(.97); }
          60% { transform: translateY(-3px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .filter-card {
          animation: cardIn .55s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .filter-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -15px rgba(124,108,255,.3);
          border-color: rgba(124,108,255,.3);
        }

        /* ====== HEADING ====== */
        .filter-heading {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .filter-card:hover .filter-heading {
          color: #7C6CFF;
          transform: translateX(3px);
        }
        .filter-heading svg {
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .filter-card:hover .filter-heading svg {
          transform: rotate(-15deg) scale(1.15);
          color: #22E8B0;
        }

        /* ====== SALE TYPE BUTTONS ====== */
        .sale-type-btn {
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .sale-type-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.3), transparent);
          transform: translateX(-100%);
          transition: transform .6s ease;
        }
        .sale-type-btn:hover::before {
          transform: translateX(100%);
        }
        .sale-type-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 8px 20px -8px rgba(124,108,255,.4);
        }
        .sale-type-btn:active {
          transform: scale(.95);
        }
        .sale-type-btn.active {
          animation: typeActive .5s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 8px 20px -6px rgba(124,108,255,.5);
        }
        @keyframes typeActive {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .sale-type-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .sale-type-btn:hover svg {
          transform: rotate(-12deg) scale(1.15);
        }

        /* ====== CHECKBOX ====== */
        .filter-checkbox-wrap {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          padding: 4px 6px;
          border-radius: 8px;
        }
        .filter-checkbox-wrap:hover {
          background: rgba(124,108,255,.05);
          transform: translateX(4px);
        }
        .filter-checkbox {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          background: white;
          flex-shrink: 0;
        }
        .filter-checkbox:hover {
          border-color: #7C6CFF;
          transform: scale(1.1);
        }
        .filter-checkbox:checked {
          background: linear-gradient(135deg, #7C6CFF, #5D4CE0);
          border-color: #7C6CFF;
          transform: scale(1.05);
        }
        .filter-checkbox:checked::after {
          content: '✓';
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          font-weight: bold;
          animation: checkPop .35s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes checkPop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }

        .filter-label {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .filter-checkbox-wrap:hover .filter-label {
          color: #7C6CFF;
          transform: translateX(2px);
        }
        .filter-checkbox-wrap.checked .filter-label {
          color: #7C6CFF;
          font-weight: 600;
        }

        /* ====== RANGE SLIDER ====== */
        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(90deg, #7C6CFF 0%, #7C6CFF var(--range-progress, 0%), #e5e7eb var(--range-progress, 0%), #e5e7eb 100%);
          outline: none;
          cursor: pointer;
          transition: all .3s ease;
        }
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C6CFF, #22E8B0);
          cursor: pointer;
          box-shadow: 0 4px 12px -4px rgba(124,108,255,.6);
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          border: 3px solid white;
        }
        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          box-shadow: 0 6px 18px -4px rgba(124,108,255,.8);
        }
        .range-slider::-webkit-slider-thumb:active {
          transform: scale(1.35);
        }
        .range-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7C6CFF, #22E8B0);
          cursor: pointer;
          box-shadow: 0 4px 12px -4px rgba(124,108,255,.6);
          border: 3px solid white;
        }

        @keyframes priceValueUpdate {
          0% { transform: scale(1); color: #7C6CFF; }
          50% { transform: scale(1.15); color: #22E8B0; }
          100% { transform: scale(1); color: #7C6CFF; }
        }
        .price-value {
          display: inline-block;
          animation: priceValueUpdate .4s cubic-bezier(.34,1.56,.64,1);
          font-weight: 700;
          color: #7C6CFF;
        }

        /* ====== TOGGLE SWITCH ====== */
        .toggle-switch {
          position: relative;
          width: 48px;
          height: 26px;
          border-radius: 13px;
          background: #d1d5db;
          cursor: pointer;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          border: none;
          padding: 0;
          overflow: hidden;
        }
        .toggle-switch::before {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .3s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,.15);
          z-index: 1;
        }
        .toggle-switch:hover::before {
          box-shadow: 0 4px 10px rgba(0,0,0,.25);
        }
        .toggle-switch.on {
          background: linear-gradient(135deg, #7C6CFF, #5D4CE0);
          box-shadow: 0 4px 12px -4px rgba(124,108,255,.5);
        }
        .toggle-switch.on::before {
          transform: translateX(22px);
        }
        .toggle-switch:active::before {
          width: 26px;
        }
        .toggle-switch.on:active::before {
          transform: translateX(16px);
          width: 26px;
        }

        /* Toggle glow ring */
        @keyframes toggleGlow {
          0%, 100% { box-shadow: 0 4px 12px -4px rgba(124,108,255,.5), 0 0 0 0 rgba(124,108,255,.4); }
          50% { box-shadow: 0 4px 12px -4px rgba(124,108,255,.5), 0 0 0 8px rgba(124,108,255,0); }
        }
        .toggle-switch.on {
          animation: toggleGlow 2.5s ease-in-out infinite;
        }

        .toggle-row {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          padding: 4px 6px;
          border-radius: 8px;
        }
        .toggle-row:hover {
          background: rgba(124,108,255,.05);
        }
        .toggle-label {
          transition: color .3s ease;
        }
        .toggle-row:hover .toggle-label {
          color: #7C6CFF;
        }

        /* ====== RESET BUTTON ====== */
        .reset-btn {
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          background: linear-gradient(135deg, #7C6CFF, #8A6FFF);
        }
        .reset-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-100%);
          transition: transform .8s ease;
        }
        .reset-btn:hover::before {
          transform: translateX(100%);
        }
        .reset-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 15px 30px -10px rgba(124,108,255,.6);
        }
        .reset-btn:active {
          transform: scale(.97);
        }
        .reset-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .reset-btn:hover svg {
          transform: rotate(-180deg);
        }
        .reset-btn.resetting svg {
          animation: spin .7s linear;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ====== ACTIVE FILTERS BADGE ====== */
        @keyframes badgePop {
          0% { transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .active-count-badge {
          animation: badgePop .5s cubic-bezier(.34,1.56,.64,1);
          transition: transform .3s ease;
        }
        .active-count-badge.pulse {
          animation: badgePulse 2s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        /* ====== FLOATING PARTICLES ====== */
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) rotate(0); opacity: .3; }
          50% { transform: translateY(-8px) rotate(180deg); opacity: .6; }
        }
        .filter-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 4s ease-in-out infinite;
        }
      `}</style>

      <aside className="filters-sidebar hidden lg:block space-y-6">

        {/* ====== SALE TYPE ====== */}
        <div className="filter-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden" style={{ animationDelay: '.05s' }}>
          <span className="filter-particle w-1.5 h-1.5 bg-purple-400 top-4 right-6" />
          <h3 className="filter-heading font-semibold mb-4 flex items-center gap-2">
            <FiRefreshCw className="text-primary text-sm" />
            Сатуу түрү
          </h3>
          <div className="flex gap-2">
            {saleTypes.map((t) => {
              const Icon = t.Icon;
              return (
                <button
                  key={t.id}
                  onClick={() => onSaleTypeChange(t.id)}
                  className={`sale-type-btn flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border-2 flex items-center justify-center gap-1 ${
                    saleType === t.id
                      ? 'active bg-primary text-white border-primary'
                      : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  {Icon && <Icon className="text-sm" />}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ====== CATEGORIES ====== */}
        <div className="filter-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden" style={{ animationDelay: '.15s' }}>
          <span className="filter-particle w-1 h-1 bg-green-400 top-6 left-4" />

          <div className="flex items-center justify-between mb-4">
            <h3 className="filter-heading font-semibold flex items-center gap-2">
              <FiFilter className="text-primary text-sm" />
              Категориялар
            </h3>
            {activeFilterCount > 0 && (
              <span className="active-count-badge pulse bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="space-y-2">
            {filterItems.map((f, i) => {
              const isChecked = activeFilters[f.id] || false;
              return (
                <label
                  key={f.id}
                  className={`filter-checkbox-wrap flex items-center gap-3 cursor-pointer ${
                    isChecked ? 'checked' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onFilterChange(f.id)}
                    className="filter-checkbox"
                  />
                  <span className="text-sm font-medium text-gray-600 filter-label">
                    {f.label}
                  </span>
                  <span className="ml-auto text-xs opacity-60">{f.icon}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ====== PRICE ====== */}
        <div className="filter-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden" style={{ animationDelay: '.25s' }}>
          <span className="filter-particle w-1.5 h-1.5 bg-yellow-400 bottom-6 right-4" />

          <h3 className="filter-heading font-semibold mb-4 flex items-center gap-2">
            <FiDollarSign className="text-primary text-sm" />
            Баасы (сом)
          </h3>

          <input
            type="range"
            min="0"
            max="5000"
            step="50"
            value={priceFilter}
            onChange={(e) => onPriceChange(parseInt(e.target.value))}
            className="range-slider"
            style={{ '--range-progress': `${(priceFilter / 5000) * 100}%` }}
          />

          <div className="flex justify-between mt-3 text-sm text-gray-500 font-bold">
            <span>0 сом</span>
            <span className="price-value" key={priceFilter}>
              {priceFilter.toLocaleString()} сом
            </span>
          </div>
        </div>

        {/* ====== STATUS TOGGLES ====== */}
        <div className="filter-card bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden" style={{ animationDelay: '.35s' }}>
          <span className="filter-particle w-1 h-1 bg-purple-300 top-8 right-8" />

          <h3 className="filter-heading font-semibold mb-4 flex items-center gap-2">
            <FiPackage className="text-primary text-sm" />
            Статус
          </h3>

          <div className="flex flex-col gap-3">
            <div className="toggle-row flex items-center justify-between">
              <span className="text-sm text-gray-600 toggle-label">
                Камыпада бар
              </span>
              <button
                onClick={onStockToggle}
                className={`toggle-switch ${stockFilter ? 'on' : ''}`}
                aria-label="Камыпада бар"
              />
            </div>
            <div className="toggle-row flex items-center justify-between">
              <span className="text-sm text-gray-600 toggle-label">
                Сатуучулардан
              </span>
              <button
                onClick={onSellerToggle}
                className={`toggle-switch ${sellerFilter ? 'on' : ''}`}
                aria-label="Сатуучулардан"
              />
            </div>
          </div>
        </div>

        {/* ====== RESET BUTTON ====== */}
        <button
          onClick={handleReset}
          className={`reset-btn w-full text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md ${
            resetting ? 'resetting' : ''
          }`}
        >
          <FiRefreshCw className="text-sm" />
          Фильтрлерди тазалоо
        </button>
      </aside>
    </>
  );
};

export default ProductFilters;
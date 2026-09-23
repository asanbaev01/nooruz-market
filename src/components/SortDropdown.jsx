import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiTrendingUp, FiDollarSign, FiTag, FiType, FiCheck } from 'react-icons/fi';

const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dropdownRef = useRef(null);

  const options = [
    { id: 'popular', label: 'Популярдуулугу боюнча', icon: FiTrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'price-asc', label: 'Арзан баалар', icon: FiDollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'price-desc', label: 'Жогорку баалар', icon: FiTag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'name', label: 'Аты боюнча', icon: FiType, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const current = options.find((o) => o.id === value) || options[0];
  const CurrentIcon = current.icon;

  /* Close on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const handleSelect = (id) => {
    onChange(id);
    setOpen(false);
    setHoveredIndex(null);
  };

  return (
    <>
      <style>{`
        /* ====== WRAPPER ====== */
        .sort-dropdown {
          position: relative;
          min-width: 240px;
          user-select: none;
        }

        /* ====== TRIGGER BUTTON ====== */
        .sort-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 2px solid rgba(16, 185, 129, .25);
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 14px;
          font-weight: 600;
          color: #065f46;
          cursor: pointer;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          box-shadow: 0 2px 8px -2px rgba(16, 185, 129, .1);
          outline: none;
        }
        .sort-trigger:hover {
          border-color: #10B981;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -8px rgba(16, 185, 129, .35);
        }
        .sort-trigger.open {
          border-color: #10B981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, .15), 0 8px 20px -8px rgba(16, 185, 129, .35);
        }
        .sort-trigger:active {
          transform: scale(.98);
        }

        /* Current icon */
        .sort-trigger-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .sort-trigger:hover .sort-trigger-icon {
          transform: scale(1.1) rotate(-8deg);
        }

        /* Chevron */
        .sort-chevron {
          margin-left: auto;
          color: #059669;
          transition: transform .35s cubic-bezier(.34,1.56,.64,1);
          flex-shrink: 0;
        }
        .sort-chevron.open {
          transform: rotate(180deg);
        }

        /* ====== DROPDOWN MENU ====== */
        @keyframes menuIn {
          0% { opacity: 0; transform: translateY(-8px) scale(.96); }
          60% { transform: translateY(2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sort-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border: 1px solid rgba(16, 185, 129, .2);
          border-radius: 16px;
          box-shadow: 0 20px 45px -15px rgba(0, 0, 0, .2), 0 0 0 1px rgba(16, 185, 129, .05);
          overflow: hidden;
          z-index: 50;
          animation: menuIn .35s cubic-bezier(.34,1.56,.64,1) both;
          padding: 6px;
        }

        /* ====== MENU ITEM ====== */
        .sort-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          transition: all .25s cubic-bezier(.34,1.56,.64,1);
          text-align: left;
          position: relative;
          overflow: hidden;
        }
        .sort-item:hover {
          background: rgba(16, 185, 129, .08);
          color: #065f46;
          transform: translateX(3px);
        }
        .sort-item.active {
          background: rgba(16, 185, 129, .12);
          color: #059669;
        }
        .sort-item::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #10B981;
          transform: scaleY(0);
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .sort-item.active::before {
          transform: scaleY(1);
        }

        .sort-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .sort-item:hover .sort-item-icon {
          transform: scale(1.12) rotate(-8deg);
        }

        .sort-item-label {
          flex: 1;
        }

        /* Checkmark */
        @keyframes checkPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .sort-check {
          color: #10B981;
          animation: checkPop .35s cubic-bezier(.34,1.56,.64,1);
          flex-shrink: 0;
        }

        /* ====== MOBILE ====== */
        @media (max-width: 640px) {
          .sort-dropdown {
            min-width: 200px;
          }
          .sort-trigger {
            padding: 9px 12px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="sort-dropdown" ref={dropdownRef}>
        {/* ====== TRIGGER ====== */}
        <button
          type="button"
          className={`sort-trigger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={`sort-trigger-icon ${current.bg} ${current.color}`}>
            <CurrentIcon className="text-base" />
          </span>
          <span className="truncate">{current.label}</span>
          <FiChevronDown className={`sort-chevron text-lg ${open ? 'open' : ''}`} />
        </button>

        {/* ====== MENU ====== */}
        {open && (
          <div className="sort-menu" role="listbox">
            {options.map((option) => {
              const Icon = option.icon;
              const isActive = value === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`sort-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(option.id)}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className={`sort-item-icon ${option.bg} ${option.color}`}>
                    <Icon className="text-base" />
                  </span>
                  <span className="sort-item-label">{option.label}</span>
                  {isActive && <FiCheck className="sort-check text-lg" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SortDropdown;
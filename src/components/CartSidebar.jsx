import React from 'react';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, removeFromCart, changeQuantity, clearCart } = useApp();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl p-8 flex flex-col transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiShoppingBag className="text-primary" />
            Сиздин себет
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-all hover:rotate-90 duration-300">
            <FiX className="text-3xl" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiShoppingBag className="text-7xl mb-4 opacity-20" />
              <p className="text-lg font-medium">Себет азырынча бош</p>
              <p className="text-sm opacity-60 mt-1">Азыктарды кошуп, сатып алууну баштаңыз</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.isWholesale}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-grow">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-primary font-bold">{item.price} сом x {item.quantity}</p>
                  <span className={`text-xs font-semibold ${item.isWholesale ? 'text-yellow-600' : 'text-primary'}`}>
                    {item.isWholesale ? 'Оптом' : 'Розница'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => changeQuantity(item.id, item.isWholesale, -1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all">
                    <FiMinus className="text-sm" />
                  </button>
                  <button onClick={() => changeQuantity(item.id, item.isWholesale, 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all">
                    <FiPlus className="text-sm" />
                  </button>
                  <button onClick={() => removeFromCart(item.id, item.isWholesale)} className="w-8 h-8 rounded-full border border-red-300 text-red-500 flex items-center justify-center hover:bg-red-50 transition-all">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Жалпы сумма:</span>
            <span className="text-2xl font-bold text-primary">{cartTotal} сом</span>
          </div>
          <button onClick={onCheckout} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-xl">
            Буйрутма берүү
          </button>
          {cart.length > 0 && (
            <button onClick={clearCart} className="w-full mt-3 text-gray-500 text-sm hover:text-red-500 transition-colors flex items-center justify-center gap-2">
              <FiTrash2 className="text-sm" />
              Себетти тазалоо
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ToastContainer = () => {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-l-4 border-primary animate-slide-up">
          <FiCheckCircle className="text-green-400 text-xl" />
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
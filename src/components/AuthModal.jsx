import React, { useState } from 'react';
import { FiX, FiUser, FiLogOut, FiShoppingCart, FiBriefcase } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { isLoggedIn, currentUser, login, logout } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email жана сыр сөз толтуруңуз!'); return; }

    if (isRegister) {
      if (!name) { setError('Аты-жөнүңүздү жазыңыз!'); return; }
      const users = JSON.parse(localStorage.getItem('nooruz_users') || '[]');
      if (users.find((u) => u.email === email)) { setError('Бул email менен катталган аккаунт бар!'); return; }
      users.push({ email, password, name, role });
      localStorage.setItem('nooruz_users', JSON.stringify(users));
      login(email, name, role);
      setEmail(''); setPassword(''); setName(''); setRole('buyer');
      onClose();
    } else {
      const users = JSON.parse(localStorage.getItem('nooruz_users') || '[]');
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        login(email, user.name, user.role);
        setEmail(''); setPassword('');
        onClose();
      } else { setError('Email же сыр сөз туура эмес!'); }
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-fade-scale" onClick={(e) => e.stopPropagation()}>
        {isLoggedIn ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FiUser className="text-primary" /> Профиль
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-all hover:rotate-90 duration-300">
                <FiX className="text-3xl" />
              </button>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <FiUser className="text-3xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{currentUser?.name}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
                <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${currentUser?.role === 'seller' ? 'bg-yellow-100 text-yellow-700' : 'bg-primary/10 text-primary'}`}>
                  {currentUser?.role === 'seller' ? 'Сатуучу' : 'Сатып алуучу'}
                </span>
              </div>
            </div>
            <button onClick={() => { logout(); onClose(); }} className="w-full mt-4 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
              <FiLogOut /> Чыгуу
            </button>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FiUser className="text-primary" />
                {isRegister ? 'Катталуу' : 'Кирүү'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-all hover:rotate-90 duration-300">
                <FiX className="text-3xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Email дареги</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Сыр сөз</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
              </div>
              {isRegister && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Аты-жөнүңүз</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Акылбек Асанов" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-2">Ролуңузду тандаңыз</label>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setRole('buyer')} className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${role === 'buyer' ? 'bg-primary text-white border-primary' : 'border-primary/30 text-primary hover:border-primary'}`}>
                        <FiShoppingCart /> Сатып алуучу
                      </button>
                      <button type="button" onClick={() => setRole('seller')} className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${role === 'seller' ? 'bg-primary text-white border-primary' : 'border-primary/30 text-primary hover:border-primary'}`}>
                        <FiBriefcase /> Сатуучу
                      </button>
                    </div>
                  </div>
                </>
              )}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
                {isRegister ? 'Катталуу' : 'Кирүү'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-sm text-gray-500 hover:text-primary transition-colors">
                {isRegister ? 'Аккаунт бар? ' : 'Аккаунт жок? '}
                <span className="font-bold text-primary">{isRegister ? 'Кирүү' : 'Катталуу'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
import React, { useState, useEffect } from 'react';
import {
  FiX, FiUser, FiLogOut, FiShoppingCart, FiBriefcase,
  FiCheck, FiMail, FiLock, FiUserPlus
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { isLoggedIn, currentUser, login, register, logout } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Modal ачылганда талааларды тазалоо */
  useEffect(() => {
    if (isOpen) {
      setError('');
      setEmail('');
      setPassword('');
      setName('');
      setRole('buyer');
      setLoading(false);
    }
  }, [isOpen]);

  /* Error чыкканда shake */
  useEffect(() => {
    if (error) {
      setShakeError(true);
      const t = setTimeout(() => setShakeError(false), 500);
      return () => clearTimeout(t);
    }
  }, [error]);

  if (!isOpen) return null;

  /* ====== FORM SUBMIT ====== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        /* ====== КАТТОО ====== */
        if (!name.trim()) {
          setError('Аты-жөнүңүздү жазыңыз');
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          setError('Email жазыңыз');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Пароль кеминде 6 белги');
          setLoading(false);
          return;
        }

        const result = await register(name.trim(), email.trim(), password, role);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Каттоо ийгиликсиз');
        }
      } else {
        /* ====== КИРҮҮ ====== */
        if (!email.trim() || !password) {
          setError('Email жана пароль жазыңыз');
          setLoading(false);
          return;
        }

        const result = await login(email.trim(), password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || 'Email же пароль туура эмес');
        }
      }
    } catch (err) {
      setError(err.message || 'Ката кетти');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ====== INLINE ANIMATIONS CSS ====== */}
      <style>{`
        @keyframes overlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        .auth-overlay { animation: overlayIn .35s ease-out both; }

        @keyframes modalIn {
          0% { opacity: 0; transform: scale(.85) translateY(30px); }
          60% { transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes modalShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .auth-modal { animation: modalIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .auth-modal.shake { animation: modalShake .45s ease-in-out; }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.15) rotate(-8deg); }
        }
        .auth-title-icon { animation: iconPulse 2.5s ease-in-out infinite; }

        .auth-close { transition: all .4s cubic-bezier(.34,1.56,.64,1); }
        .auth-close:hover { transform: rotate(90deg) scale(1.15); color: #ef4444; }

        .auth-field { transition: transform .3s cubic-bezier(.34,1.56,.64,1); }
        .auth-field:focus-within { transform: translateY(-2px); }

        @keyframes inputGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.35); }
          50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
        }
        .auth-input { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .auth-input:focus { animation: inputGlow 2s ease-out infinite; transform: scale(1.01); }
        .auth-input::placeholder { transition: transform .3s ease, opacity .3s ease; }
        .auth-input:focus::placeholder { transform: translateX(4px); opacity: .6; }

        .auth-label { transition: color .3s ease, transform .3s ease; display: inline-block; }
        .auth-field:focus-within .auth-label { color: #10B981; transform: translateX(4px); }

        .role-btn { transition: all .4s cubic-bezier(.34,1.56,.64,1); position: relative; overflow: hidden; }
        .role-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(16,185,129,.15), transparent);
          transform: scale(0); border-radius: inherit;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .role-btn:hover::before { transform: scale(1); }
        .role-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 25px -10px rgba(16,185,129,.4); }
        .role-btn.active { animation: roleActive .5s cubic-bezier(.34,1.56,.64,1); }
        @keyframes roleActive {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .role-btn svg { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .role-btn:hover svg { transform: rotate(-12deg) scale(1.15); }

        .auth-submit {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative; overflow: hidden;
        }
        .auth-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-100%); transition: transform .7s ease;
        }
        .auth-submit:hover::before { transform: translateX(100%); }
        .auth-submit:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 15px 30px -10px rgba(16,185,129,.5); }
        .auth-submit:active { transform: scale(.97); }
        .auth-submit svg { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .auth-submit:hover svg { transform: translateX(4px); }

        @keyframes errorIn {
          0% { opacity: 0; transform: translateY(-8px) scale(.9); }
          60% { transform: translateY(2px) scale(1.03); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .auth-error { animation: errorIn .4s cubic-bezier(.34,1.56,.64,1); }

        .auth-switch-link { transition: all .3s ease; }
        .auth-switch-link:hover { transform: translateY(-1px); }

        @keyframes profileIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-view { animation: profileIn .5s cubic-bezier(.34,1.56,.64,1); }

        .profile-avatar { animation: avatarPulse 3s ease-in-out infinite; transition: transform .5s cubic-bezier(.34,1.56,.64,1); }
        .profile-avatar:hover { transform: scale(1.1) rotate(-6deg); }
        @keyframes avatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.3); }
          50% { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
        }

        @keyframes badgePop {
          0% { transform: scale(.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .role-badge { animation: badgePop .5s cubic-bezier(.34,1.56,.64,1) .3s both; }

        .logout-btn { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .logout-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 25px -10px rgba(239,68,68,.5); }
        .logout-btn svg { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        .logout-btn:hover svg { transform: translateX(4px); }

        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.15); }
        }
        .modal-blob {
          position: absolute; border-radius: 50%; filter: blur(40px);
          opacity: .25; pointer-events: none;
          animation: blobMove 6s ease-in-out infinite;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="auth-overlay fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className={`auth-modal ${shakeError ? 'shake' : ''} relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decorations */}
          <div className="modal-blob bg-emerald-400 w-40 h-40 -top-10 -right-10" />
          <div className="modal-blob bg-green-300 w-32 h-32 -bottom-10 -left-10" style={{ animationDelay: '2s' }} />

          {isLoggedIn ? (
            /* ====== PROFILE VIEW ====== */
            <div className="relative z-10 profile-view">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiUser className="text-primary auth-title-icon" /> Профиль
                </h2>
                <button onClick={onClose} className="auth-close text-gray-400" aria-label="Жабуу">
                  <FiX className="text-3xl" />
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="profile-avatar w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="text-3xl" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg truncate">{currentUser?.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
                    <FiMail className="text-xs flex-shrink-0" />
                    <span className="truncate">{currentUser?.email}</span>
                  </p>
                  <span className={`role-badge inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${
                    currentUser?.role === 'seller'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {currentUser?.role === 'seller' ? '🏪 Сатуучу' : '🛒 Сатып алуучу'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { logout(); onClose(); }}
                className="logout-btn w-full mt-4 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-600 hover:text-white flex items-center justify-center gap-2"
              >
                <FiLogOut /> Чыгуу
              </button>
            </div>
          ) : (
            /* ====== LOGIN/REGISTER VIEW ====== */
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiUser className="text-primary auth-title-icon" />
                  {isRegister ? 'Катталуу' : 'Кирүү'}
                </h2>
                <button onClick={onClose} className="auth-close text-gray-400" aria-label="Жабуу">
                  <FiX className="text-3xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div className="auth-field">
                  <label className="auth-label text-sm font-medium text-gray-600 block mb-1">
                    Email дареги
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="auth-input w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="auth-field">
                  <label className="auth-label text-sm font-medium text-gray-600 block mb-1">
                    Сыр сөз
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="auth-input w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      disabled={loading}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                    />
                  </div>
                </div>

                {isRegister && (
                  <>
                    {/* Name */}
                    <div className="auth-field" style={{ animation: 'fadeUp .4s cubic-bezier(.34,1.56,.64,1) both' }}>
                      <label className="auth-label text-sm font-medium text-gray-600 block mb-1">
                        Аты-жөнүңүз
                      </label>
                      <div className="relative">
                        <FiUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Акылбек Асанов"
                          className="auth-input w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          disabled={loading}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Role selection */}
                    <div className="auth-field" style={{ animation: 'fadeUp .4s cubic-bezier(.34,1.56,.64,1) .1s both' }}>
                      <label className="auth-label text-sm font-medium text-gray-600 block mb-2">
                        Ролуңузду тандаңыз
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setRole('buyer')}
                          className={`role-btn flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 ${
                            role === 'buyer'
                              ? 'active bg-primary text-white border-primary shadow-lg'
                              : 'border-primary/30 text-primary hover:border-primary'
                          }`}
                          disabled={loading}
                        >
                          <FiShoppingCart /> Сатып алуучу
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole('seller')}
                          className={`role-btn flex-1 py-3 px-4 rounded-xl border-2 font-medium flex items-center justify-center gap-2 ${
                            role === 'seller'
                              ? 'active bg-primary text-white border-primary shadow-lg'
                              : 'border-primary/30 text-primary hover:border-primary'
                          }`}
                          disabled={loading}
                        >
                          <FiBriefcase /> Сатуучу
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <p className="auth-error text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="auth-submit w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      {isRegister ? 'Катталууда...' : 'Кирүүдө...'}
                    </>
                  ) : (
                    <>
                      {isRegister ? <FiUserPlus /> : <FiCheck />}
                      {isRegister ? 'Катталуу' : 'Кирүү'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => { setIsRegister(!isRegister); setError(''); }}
                  className="auth-switch-link text-sm text-gray-500 hover:text-primary"
                  disabled={loading}
                >
                  {isRegister ? 'Аккаунт бар? ' : 'Аккаунт жок? '}
                  <span className="font-bold text-primary">
                    {isRegister ? 'Кирүү' : 'Катталуу'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;
import React, { useState, useEffect } from 'react';
import {
  FiX, FiUser, FiLogOut, FiShoppingBag, FiHeart, FiUser as FiUserIcon,
  FiMail, FiPhone, FiMapPin, FiPackage, FiClock, FiCheckCircle,
  FiTruck, FiXCircle, FiChevronRight, FiTrash2, FiAward, FiGift,
  FiTrendingUp, FiTrendingDown, FiUsers, FiCopy, FiCheck,
  FiShare2, FiUserPlus, FiDollarSign, FiSend, FiCreditCard,   // ✅ FiCreditCard КОШУЛДУ
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useOrder } from '../context/OrderContext';
import { useLoyalty, LOYALTY_RULES } from '../context/LoyaltyContext';
import { useReferral, REFERRAL_RULES } from '../context/ReferralContext';
import { useCashback, CASHBACK_RULES } from '../context/CashbackContext';  // ✅ ЖАҢЫ

/* ====== TABS (КЭШБЭК КОШУЛДУ) ====== */
const TABS = [
  { id: 'orders', label: 'Буйрутмалар', icon: FiPackage },
  { id: 'favorites', label: 'Тандалмалар', icon: FiHeart },
  { id: 'loyalty', label: 'Упайлар', icon: FiAward },
  { id: 'cashback', label: 'Кэшбэк', icon: FiCreditCard },   // ✅ ЖАҢЫ
  { id: 'friends', label: 'Достор', icon: FiUsers },
  { id: 'info', label: 'Маалымат', icon: FiUserIcon },
];

const STATUS_CONFIG = {
  'Кабыл алынды': { color: 'text-blue-600 bg-blue-50', icon: FiClock },
  'Жолдо': { color: 'text-yellow-600 bg-yellow-50', icon: FiTruck },
  'Жеткирилди': { color: 'text-green-600 bg-green-50', icon: FiCheckCircle },
  'Жокко чыгарылды': { color: 'text-red-600 bg-red-50', icon: FiXCircle },
};

const TIMELINE_STEPS = [
  { id: 'Кабыл алынды', label: 'Кабыл алынды', icon: FiClock, desc: 'Буйрутмаңыз иштетилүүдө' },
  { id: 'Жолдо', label: 'Жолдо', icon: FiTruck, desc: 'Курьер жолдо' },
  { id: 'Жеткирилди', label: 'Жеткирилди', icon: FiCheckCircle, desc: 'Буйрутмаңыз жетти' },
];

const getStatusIndex = (status) => {
  if (status === 'Жокко чыгарылды') return -1;
  return TIMELINE_STEPS.findIndex((s) => s.id === status);
};

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, logout, favorites, toggleFavorite, showToast, addToCart } = useApp();
  const { orders, removeOrder } = useOrder();
  const { points, history } = useLoyalty();
  const { myCode, friends, bonusBalance, generateMyCode, getReferralLink, rules } = useReferral();
  // ✅ ЖАҢЫ
  const {
    balance: cashbackBalance,
    history: cashbackHistory,
    totalEarned: cashbackEarned,
    totalSpent: cashbackSpent,
    rules: cashbackRules,
  } = useCashback();

  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser && !myCode) {
      generateMyCode(currentUser.name);
    }
  }, [isOpen, currentUser, myCode, generateMyCode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (selectedOrder) setSelectedOrder(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, selectedOrder]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('orders');
      setSelectedOrder(null);
    }
  }, [isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleCopyLink = async () => {
    const link = getReferralLink();
    if (!link) {
      showToast('Шилтеме жок', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      showToast('✅ Шилтеме көчүрүлдү!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast('Көчүрүү мүмкүн болбоду', 'error');
    }
  };

  const handleShare = async (platform) => {
    const link = getReferralLink();
    const text = `🎁 Nooruz Market'ке кошул! Менин шилтемем менен ${rules.FRIEND_DISCOUNT} сом арзандатуу ал:\n\n${link}`;

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({ title: 'Nooruz Market', text, url: link });
        return;
      } catch (err) {
        if (err.name !== 'AbortError') console.warn(err);
        return;
      }
    }

    let url = '';
    if (platform === 'whatsapp') url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    else if (platform === 'telegram') url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;

    if (url) window.open(url, '_blank');
  };

  const orderCount = orders.length;
  const favoriteCount = favorites.length;

  return (
    <>
      <style>{`
        @keyframes profileOverlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes profileModalIn {
          0% { opacity: 0; transform: scale(.9) translateY(30px); }
          60% { transform: scale(1.01) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tabContentIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes itemSlideIn {
          from { opacity: 0; transform: translateX(-15px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes avatarFloat {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.3); }
          50% { box-shadow: 0 0 0 15px rgba(16,185,129,0); }
        }
        @keyframes pointsPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes coinFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes shineMove {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        @keyframes giftBounce {
          0%, 100% { transform: scale(1) rotate(-5deg); }
          50% { transform: scale(1.15) rotate(5deg); }
        }
        @keyframes copyPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes friendIn {
          0% { opacity: 0; transform: translateX(-20px) scale(.9); }
          60% { transform: translateX(4px) scale(1.02); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .profile-overlay-anim { animation: profileOverlayIn .35s ease-out both; }
        .profile-modal-anim { animation: profileModalIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .tab-content-anim { animation: tabContentIn .4s cubic-bezier(.34,1.56,.64,1) both; }
        .list-item-anim { animation: itemSlideIn .4s cubic-bezier(.34,1.56,.64,1) both; }
        .profile-avatar-anim {
          animation: avatarFloat 3s ease-in-out infinite;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .profile-avatar-anim:hover { transform: scale(1.1) rotate(-6deg); }
        .profile-close { transition: all .4s cubic-bezier(.34,1.56,.64,1); }
        .profile-close:hover { transform: rotate(90deg) scale(1.15); color: #ef4444; }
        .profile-tab {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          position: relative;
        }
        .profile-tab:hover { transform: translateY(-2px); }
        .profile-tab.active {
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
          box-shadow: 0 10px 25px -10px rgba(16,185,129,.5);
        }
        .profile-order-item {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .profile-order-item:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 20px -8px rgba(16,185,129,.25);
          border-color: #10B981;
        }
        .profile-fav-item { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .profile-fav-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -10px rgba(16,185,129,.3);
        }
        .profile-fav-item img { transition: transform .5s cubic-bezier(.34,1.56,.64,1); }
        .profile-fav-item:hover img { transform: scale(1.08) rotate(-3deg); }
        .logout-btn-anim { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .logout-btn-anim:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px -10px rgba(239,68,68,.5);
        }
        .logout-btn-anim:hover svg { transform: translateX(4px); }
        .logout-btn-anim svg { transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.15); }
        }
        .profile-blob {
          position: absolute; border-radius: 50%; filter: blur(50px);
          opacity: .2; pointer-events: none;
          animation: blobMove 7s ease-in-out infinite;
        }
        .profile-scroll::-webkit-scrollbar { width: 6px; }
        .profile-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 3px;
        }
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .empty-icon-anim { animation: emptyFloat 3s ease-in-out infinite; }

        .loyalty-card {
          position: relative;
          overflow: hidden;
        }
        .loyalty-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 80px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-150%) skewX(-20deg);
          animation: shineMove 4s ease-in-out infinite;
          pointer-events: none;
        }
        .coin-float { animation: coinFloat 3s ease-in-out infinite; }
        .points-pulse { animation: pointsPulse 2.5s ease-in-out infinite; }

        .history-item {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .history-item:hover { transform: translateX(4px); }

        /* ========== REFERRAL ========== */
        .ref-card {
          position: relative;
          overflow: hidden;
        }
        .ref-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          transform: translateX(-150%) skewX(-20deg);
          animation: shineMove 4s ease-in-out infinite;
          pointer-events: none;
        }
        .gift-bounce { animation: giftBounce 2.5s ease-in-out infinite; }

        .ref-code-box {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .ref-code-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.4);
        }

        .copy-btn { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .copy-btn:hover { transform: scale(1.05); }
        .copy-btn:active { transform: scale(.95); }
        .copy-btn.copied { animation: copyPop .5s cubic-bezier(.34,1.56,.64,1); }

        .share-btn { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .share-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 25px -8px rgba(0,0,0,.25);
        }

        .friend-item { animation: friendIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .friend-item:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 20px -8px rgba(16,185,129,.25);
        }
        .badge-float { animation: badgeFloat 2.5s ease-in-out infinite; }
      `}</style>

      <div
        className="profile-overlay-anim fixed inset-0 bg-black/50 backdrop-blur-sm z-[85] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="profile-modal-anim bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="profile-blob bg-emerald-400 w-40 h-40 -top-10 -right-10" />
          <div className="profile-blob bg-pink-300 w-32 h-32 -bottom-10 -left-10" style={{ animationDelay: '2s' }} />

          {/* HEADER */}
          <div className="relative z-10 px-7 pt-7 pb-5 border-b border-gray-100 bg-gradient-to-br from-emerald-50 to-white">
            <button
              onClick={onClose}
              className="profile-close absolute top-6 right-6 text-gray-400 p-2 rounded-full hover:bg-red-50"
            >
              <FiX className="text-2xl" />
            </button>

            <div className="flex items-center gap-4">
              <div className="profile-avatar-anim w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white border-4 border-white shadow-xl overflow-hidden flex-shrink-0">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-3xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-800 truncate">{currentUser?.name}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 truncate">
                  <FiMail className="text-xs flex-shrink-0" />
                  <span className="truncate">{currentUser?.email}</span>
                </p>
                <span className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                  currentUser?.role === 'seller'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {currentUser?.role === 'seller' ? '🏪 Сатуучу' : '🛒 Сатып алуучу'}
                </span>
              </div>

              {points > 0 && (
                <div className="points-pulse hidden sm:flex flex-col items-center bg-gradient-to-br from-yellow-400 to-amber-500 text-white rounded-2xl px-4 py-2 shadow-lg">
                  <FiAward className="text-lg mb-0.5" />
                  <span className="text-lg font-bold leading-none">{points}</span>
                  <span className="text-[9px] font-semibold opacity-90">упай</span>
                </div>
              )}
            </div>
          </div>

          {/* TABS */}
          <div className="relative z-10 px-7 pt-5 pb-3">
            <div className="flex gap-2 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const count = tab.id === 'orders' ? orderCount
                  : tab.id === 'favorites' ? favoriteCount
                  : tab.id === 'loyalty' ? points
                  : tab.id === 'cashback' ? cashbackBalance   // ✅ ЖАҢЫ
                  : tab.id === 'friends' ? friends.length
                  : 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`profile-tab flex-1 min-w-fit py-2.5 px-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap ${
                      isActive ? 'active' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="text-base" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    {count > 0 && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CONTENT */}
          <div className="profile-scroll flex-grow overflow-y-auto px-7 pb-6 relative z-10">

            {/* ========== ORDERS ========== */}
            {activeTab === 'orders' && (
              <div className="tab-content-anim">
                {orders.length === 0 ? (
                  <EmptyState icon={FiPackage} title="Буйрутма жок" subtitle="Азыктарды себетке кошуп, биринчи буйрутмаңызды бериңиз" />
                ) : (
                  <div className="space-y-3 mt-2">
                    {orders.map((order, i) => {
                      const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Кабыл алынды'];
                      const StatusIcon = statusCfg.icon;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="profile-order-item list-item-anim bg-white border-2 border-gray-100 rounded-2xl p-4"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-gray-800 text-sm">
                                №{order.id.split('-')[1] || order.id}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{order.createdAt}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusCfg.color}`}>
                              <StatusIcon className="text-xs" />
                              {order.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                              {order.items?.length || 0} товар
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-600">
                                {order.total?.toLocaleString()} сом
                              </span>
                              <FiChevronRight className="text-gray-400" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ========== FAVORITES ========== */}
            {activeTab === 'favorites' && (
              <div className="tab-content-anim">
                {favorites.length === 0 ? (
                  <EmptyState icon={FiHeart} title="Тандалма жок" subtitle="Жаккан товарларды жүрөкчөгө басып сактаңыз" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {favorites.map((fav, i) => (
                      <div
                        key={fav._id || fav.id}
                        className="profile-fav-item list-item-anim bg-white border-2 border-gray-100 rounded-2xl p-3 flex gap-3"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                          <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="font-bold text-sm text-gray-800 truncate">{fav.name}</p>
                            <p className="text-emerald-600 font-bold text-sm mt-0.5">
                              {fav.price?.toLocaleString()} сом
                            </p>
                          </div>
                          <div className="flex gap-1.5 mt-1">
                            <button
                              onClick={() => addToCart(fav, false)}
                              className="flex-1 text-xs bg-emerald-500 text-white py-1.5 rounded-lg font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                            >
                              <FiShoppingBag className="text-xs" />
                              Кошуу
                            </button>
                            <button
                              onClick={() => toggleFavorite(fav)}
                              className="text-xs bg-red-50 text-red-500 px-2.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ========== LOYALTY ========== */}
            {activeTab === 'loyalty' && (
              <div className="tab-content-anim space-y-4 mt-2">
                <div className="loyalty-card bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-2xl relative">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="coin-float w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <FiAward className="text-3xl" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold opacity-90">Сиздин упайыңыз</p>
                        <p className="text-[10px] opacity-80">Nooruz Market Loyalty</p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black">{points.toLocaleString()}</span>
                      <span className="text-lg font-bold opacity-90">упай</span>
                    </div>

                    <p className="text-xs opacity-90">
                      💰 Бул {points.toLocaleString()} сом арзандатууга барабар
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <FiGift className="text-yellow-500" />
                    Кантип иштейт?
                  </h3>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 font-bold">1.</span>
                      <p>Ар бир <strong>100 сом</strong> сатып алуудан <strong>{LOYALTY_RULES.EARN_RATE * 100} упай</strong> аласыз</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 font-bold">2.</span>
                      <p>Упайларды кийинки буйрутмада колдоно аласыз</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 font-bold">3.</span>
                      <p>Буйрутманын <strong>{LOYALTY_RULES.MAX_REDEEM_PERCENT}%</strong> га чейин упай менен төлөсө болот</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <FiClock className="text-emerald-500" />
                    Упай тарыхы
                  </h3>

                  {history.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FiAward className="text-4xl mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Азырынча тарых жок</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="history-item flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.type === 'earn' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {item.type === 'earn' ? <FiTrendingUp className="text-lg" /> : <FiTrendingDown className="text-lg" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.description}</p>
                            <p className="text-[10px] text-gray-400">{item.date}</p>
                          </div>
                          <span className={`font-bold text-sm flex-shrink-0 ${
                            item.type === 'earn' ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            {item.amount > 0 ? '+' : ''}{item.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========== CASHBACK (ЖАҢЫ) ========== */}
            {activeTab === 'cashback' && (
              <div className="tab-content-anim space-y-4 mt-2">

                {/* BIG CASHBACK CARD */}
                <div className="loyalty-card bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 rounded-3xl p-6 text-white shadow-2xl relative">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="coin-float w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <FiCreditCard className="text-3xl" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold opacity-90">Кэшбэк балансыңыз</p>
                        <p className="text-[10px] opacity-80">Nooruz Market Cashback</p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-black">{cashbackBalance.toLocaleString()}</span>
                      <span className="text-lg font-bold opacity-90">сом</span>
                    </div>

                    <p className="text-xs opacity-90">
                      💰 Ар бир буйрутмадан {cashbackRules.EARN_RATE * 100}% кайтарылат
                    </p>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FiTrendingUp className="text-emerald-600" />
                      <span className="text-xs font-semibold text-emerald-700">Топтолгон</span>
                    </div>
                    <p className="text-xl font-bold text-emerald-700">
                      +{cashbackEarned.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">бардык убакытта</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FiTrendingDown className="text-orange-600" />
                      <span className="text-xs font-semibold text-orange-700">Колдонулган</span>
                    </div>
                    <p className="text-xl font-bold text-orange-700">
                      -{cashbackSpent.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-orange-600 mt-0.5">бардык убакытта</p>
                  </div>
                </div>

                {/* HOW IT WORKS */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <FiGift className="text-emerald-500" />
                    Кантип иштейт?
                  </h3>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">1.</span>
                      <p>Ар бир буйрутмадан <strong>{cashbackRules.EARN_RATE * 100}%</strong> кэшбэк аласыз</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">2.</span>
                      <p>Кэшбэк балансыңызда топтолот</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">3.</span>
                      <p>Кийинки буйрутмада <strong>{cashbackRules.MAX_REDEEM_PERCENT}%</strong> га чейин колдонсо болот</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">4.</span>
                      <p>Эң аз колдонуу: <strong>{cashbackRules.MIN_REDEEM} сом</strong></p>
                    </div>
                  </div>
                </div>

                {/* HISTORY */}
                <div>
                  <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                    <FiClock className="text-emerald-500" />
                    Кэшбэк тарыхы
                  </h3>

                  {cashbackHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <FiCreditCard className="text-4xl mx-auto mb-2 opacity-30" />
                      <p className="text-xs">Азырынча тарых жок</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {cashbackHistory.map((item) => (
                        <div
                          key={item.id}
                          className="history-item flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl"
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.type === 'earn' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                          }`}>
                            {item.type === 'earn' ? <FiTrendingUp className="text-lg" /> : <FiTrendingDown className="text-lg" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{item.description}</p>
                            <p className="text-[10px] text-gray-400">{item.date}</p>
                          </div>
                          <span className={`font-bold text-sm flex-shrink-0 ${
                            item.type === 'earn' ? 'text-emerald-600' : 'text-orange-600'
                          }`}>
                            {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ========== FRIENDS (РЕФЕРАЛ) ========== */}
            {activeTab === 'friends' && (
              <div className="tab-content-anim space-y-4 mt-2">

                {/* BIG REFERRAL CARD */}
                <div className="ref-card bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-6 text-white shadow-2xl">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="gift-bounce w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                        <FiGift className="text-3xl" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold opacity-90">Рефералдык программа</p>
                        <p className="text-[10px] opacity-80">Досторуңузду чакырыңыз</p>
                      </div>
                    </div>

                    <p className="text-sm font-semibold mb-1">Ар бир дос үчүн аласыз:</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-black">+{rules.BONUS_PER_FRIEND}</span>
                      <span className="text-lg font-bold opacity-90">сом</span>
                    </div>

                    <p className="text-xs opacity-90">
                      💰 Жалпы балансыңыз: <strong>{bonusBalance} сом</strong>
                    </p>
                  </div>
                </div>

                {/* REFERRAL CODE */}
                <div className="ref-code-box bg-white border-2 border-dashed border-emerald-300 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                      <FiShare2 className="text-emerald-500" />
                      Сиздин реферал кодуңуз
                    </h3>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <div className="flex-grow bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl px-4 py-3 flex items-center justify-center border-2 border-emerald-200">
                      <span className="font-mono font-black text-lg text-emerald-700 tracking-wider">
                        {myCode || 'ЖҮКТӨЛҮҮДӨ...'}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`copy-btn ${copied ? 'copied bg-emerald-600' : 'bg-emerald-500'} text-white px-4 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 min-w-[100px]`}
                    >
                      {copied ? (
                        <>
                          <FiCheck className="text-lg" />
                          Даяр!
                        </>
                      ) : (
                        <>
                          <FiCopy className="text-lg" />
                          Көчүрүү
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 text-center">
                    💡 Шилтемени досторуңузга жөнөтүңүз — алар {rules.FRIEND_DISCOUNT} сом арзандатуу алышат
                  </p>
                </div>

                {/* SHARE BUTTONS */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="share-btn bg-gradient-to-br from-green-400 to-green-600 text-white p-4 rounded-2xl font-bold shadow-lg flex flex-col items-center gap-2"
                  >
                    <FiSend className="text-2xl" />
                    <span className="text-xs">WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleShare('telegram')}
                    className="share-btn bg-gradient-to-br from-sky-400 to-sky-600 text-white p-4 rounded-2xl font-bold shadow-lg flex flex-col items-center gap-2"
                  >
                    <FiSend className="text-2xl" />
                    <span className="text-xs">Telegram</span>
                  </button>

                  <button
                    onClick={() => handleShare('native')}
                    className="share-btn bg-gradient-to-br from-purple-400 to-purple-600 text-white p-4 rounded-2xl font-bold shadow-lg flex flex-col items-center gap-2"
                  >
                    <FiShare2 className="text-2xl" />
                    <span className="text-xs">Дагы</span>
                  </button>
                </div>

                {/* FRIENDS LIST */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                      <FiUsers className="text-emerald-500" />
                      Чакырылган достор
                    </h3>
                    {friends.length > 0 && (
                      <span className="badge-float text-xs font-bold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                        {friends.length}
                      </span>
                    )}
                  </div>

                  {friends.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl">
                      <FiUserPlus className="text-5xl mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-semibold text-gray-600">Азырынча дос чакырган жоксуз</p>
                      <p className="text-xs mt-1 max-w-xs mx-auto">
                        Жогорку шилтемени досторуңузга жөнөтүп, {rules.BONUS_PER_FRIEND} сом бонус алыңыз
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {friends.map((friend, i) => (
                        <div
                          key={friend.id}
                          className="friend-item flex items-center gap-3 p-3 bg-white border-2 border-purple-100 rounded-xl"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                            {friend.name?.charAt(0)?.toUpperCase() || 'F'}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{friend.name}</p>
                            <p className="text-[10px] text-gray-400">{friend.date}</p>
                          </div>
                          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full flex-shrink-0">
                            <FiDollarSign className="text-xs" />
                            <span className="text-xs font-bold">+{friend.bonus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RULES */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                  <h3 className="font-bold text-sm text-purple-800 mb-3 flex items-center gap-2">
                    <FiAward className="text-purple-600" />
                    Кантип иштейт?
                  </h3>
                  <div className="space-y-2 text-xs text-purple-700">
                    <p><strong>1.</strong> Реферал шилтемеңизди досторуңузга жөнөтүңүз</p>
                    <p><strong>2.</strong> Досуңуз шилтеме аркылуу кирип, каттоодон өтөт</p>
                    <p><strong>3.</strong> Досуңуз <strong>{rules.FRIEND_DISCOUNT} сом</strong> арзандатуу алат</p>
                    <p><strong>4.</strong> Сиз <strong>{rules.BONUS_PER_FRIEND} сом</strong> бонус аласыз</p>
                    <p><strong>5.</strong> Бонусту кийинки буйрутмада колдоно аласыз</p>
                  </div>
                </div>

              </div>
            )}

            {/* ========== INFO ========== */}
            {activeTab === 'info' && (
              <div className="tab-content-anim space-y-3 mt-2">
                <InfoRow icon={FiUserIcon} label="Аты-жөнү" value={currentUser?.name} />
                <InfoRow icon={FiMail} label="Email" value={currentUser?.email} />
                <InfoRow icon={FiPhone} label="Телефон" value={currentUser?.phone || 'Көрсөтүлгөн эмес'} />
                <InfoRow icon={FiMapPin} label="Дарек" value={currentUser?.address || 'Көрсөтүлгөн эмес'} />

                <div className="pt-3">
                  <button
                    onClick={handleLogout}
                    className="logout-btn-anim w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-600 hover:text-white flex items-center justify-center gap-2"
                  >
                    <FiLogOut /> Аккаунттан чыгуу
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRemove={() => {
            removeOrder(selectedOrder.id);
            setSelectedOrder(null);
            showToast('Буйрутма өчүрүлдү', 'info');
          }}
        />
      )}
    </>
  );
};

/* ====== InfoRow ====== */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
      <Icon />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm font-bold text-gray-800 truncate">{value}</p>
    </div>
  </div>
);

/* ====== EmptyState ====== */
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 empty-icon-anim">
      <Icon className="text-4xl opacity-40" />
    </div>
    <p className="text-lg font-semibold text-gray-600">{title}</p>
    <p className="text-sm opacity-70 mt-1 text-center max-w-xs">{subtitle}</p>
  </div>
);

/* ====== OrderTimeline ====== */
const OrderTimeline = ({ status }) => {
  const currentIndex = getStatusIndex(status);
  const isCancelled = status === 'Жокко чыгарылды';

  if (isCancelled) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
          <FiXCircle className="text-2xl" />
        </div>
        <div>
          <p className="font-bold text-red-800">Буйрутма жокко чыгарылды</p>
          <p className="text-xs text-red-600 mt-0.5">Кошумча маалымат алуу үчүн биз менен байланышыңыз</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 rounded-2xl p-5 mb-4 border border-emerald-100">
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
          <FiPackage className="text-emerald-500" />
          Буйрутманын абалы
        </h4>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {TIMELINE_STEPS.length}
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full transition-all duration-1000"
            style={{ width: `${(currentIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="relative flex justify-between">
          {TIMELINE_STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const isDone = i < currentIndex;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isCurrent
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg scale-110'
                      : isDone
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-white border-2 border-gray-200 text-gray-300'
                  }`}
                >
                  {isDone ? <FiCheckCircle className="text-lg" /> : <Icon className="text-lg" />}
                </div>

                <div className="text-center">
                  <p className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className={`text-[10px] mt-0.5 max-w-[90px] ${
                    isCurrent ? 'text-emerald-600 font-medium' : 'text-gray-400'
                  }`}>
                    {isCurrent ? step.desc : isDone ? 'Аткарылды' : 'Күтүлүүдө'}
                  </p>
                </div>

                {isCurrent && (
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Азыр
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ====== OrderDetailModal ====== */
const OrderDetailModal = ({ order, onClose, onRemove }) => {
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Кабыл алынды'];
  const StatusIcon = statusCfg.icon;

  return (
    <>
      <style>{`
        @keyframes orderDetailIn {
          0% { opacity: 0; transform: scale(.9); }
          60% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .order-detail-anim { animation: orderDetailIn .4s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="order-detail-anim bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
            <div>
              <h3 className="font-bold text-lg">Буйрутма №{order.id.split('-')[1] || order.id}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{order.createdAt}</p>
            </div>
            <button onClick={onClose} className="profile-close text-gray-400 p-2 rounded-full hover:bg-red-50">
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="profile-scroll flex-grow overflow-y-auto px-6 py-5">
            <OrderTimeline status={order.status} />

            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 ${statusCfg.color}`}>
              <StatusIcon />
              <span className="font-bold text-sm">{order.status}</span>
            </div>

            <h4 className="font-bold text-sm text-gray-700 mb-3">
              Товарлар ({order.items?.length || 0})
            </h4>
            <div className="space-y-2 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.price?.toLocaleString()} сом × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-emerald-600 flex-shrink-0">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {order.customer && (
              <>
                <h4 className="font-bold text-sm text-gray-700 mb-3">Жеткирүү</h4>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <FiUserIcon className="text-emerald-600 flex-shrink-0" />
                    <span className="font-medium">{order.customer.name}</span>
                  </p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FiPhone className="text-emerald-600 flex-shrink-0" />
                    <span>{order.customer.phone}</span>
                  </p>
                  <p className="flex items-start gap-2 text-gray-700">
                    <FiMapPin className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{order.customer.address}</span>
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-between items-center bg-emerald-50 rounded-xl p-4 mb-4">
              <span className="text-sm text-gray-600 font-medium">
                {order.paymentMethod === 'cash' ? '💵 Накталай' : '💳 Карта менен'}
              </span>
              <span className="font-bold text-emerald-600 text-lg">
                {order.total?.toLocaleString()} сом
              </span>
            </div>

            {order.comment && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-3">
                <span className="font-semibold text-gray-700">Комментарий: </span>
                {order.comment}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={onRemove}
              className="w-full text-red-500 text-sm py-2.5 rounded-xl hover:bg-red-50 font-medium flex items-center justify-center gap-2"
            >
              <FiTrash2 /> Буйрутманы өчүрүү
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
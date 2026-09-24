import React, { useState, useEffect, useMemo } from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';
import {
  FiX, FiPackage, FiShoppingBag, FiUsers, FiBarChart2, FiTag,
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiTrendingUp, FiDollarSign,
  FiCheckCircle, FiXCircle, FiClock, FiTruck, FiChevronRight,
  FiSave, FiAlertCircle, FiActivity, FiZap, FiStar, FiUpload,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useOrder } from '../context/OrderContext';
import { productApi, categoryApi, orderApi, userApi } from '../api';

/* ============================================================
   ЖАРДАМЧЫ ФУНКЦИЯЛАР
   ============================================================ */
const getCategoryName = (category) => {
  if (!category) return '—';
  if (typeof category === 'object') {
    return category.name || category.slug || category._id || '—';
  }
  return category;
};

const getCategoryId = (category) => {
  if (!category) return '';
  if (typeof category === 'object') {
    return category._id || category.id || '';
  }
  return category;
};

/* ====== ФОТО ЖҮКТӨӨ ФУНКЦИЯЛАРЫ ====== */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const validateImage = (file, maxSizeMB = 2) => {
  if (!file) return { valid: false, error: 'Файл тандалган жок' };

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Бул файл сүрөт эмес' };
  }

  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: `Файл өтө чоң (макс: ${maxSizeMB}MB)` };
  }

  return { valid: true };
};

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: FiBarChart2, gradient: 'from-blue-500 to-indigo-600' },
  { id: 'products', label: 'Товарлар', icon: FiPackage, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'orders', label: 'Буйрутмалар', icon: FiShoppingBag, gradient: 'from-purple-500 to-pink-600' },
  { id: 'categories', label: 'Категориялар', icon: FiTag, gradient: 'from-orange-500 to-red-600' },
  { id: 'users', label: 'Колдонуучулар', icon: FiUsers, gradient: 'from-cyan-500 to-blue-600' },
];

const STATUS_OPTIONS = ['Кабыл алынды', 'Жолдо', 'Жеткирилди', 'Жокко чыгарылды'];
const STATUS_COLORS = {
  'Кабыл алынды': 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-300',
  'Жолдо': 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-700 border-yellow-300',
  'Жеткирилди': 'bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-700 border-emerald-300',
  'Жокко чыгарылды': 'bg-gradient-to-r from-red-100 to-pink-200 text-red-700 border-red-300',
};

const AdminPanel = ({ isOpen, onClose }) => {
  const { products, categories, loadProducts, loadCategories, showToast, currentUser } = useApp();
  const { orders, loadOrders } = useOrder();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [productModal, setProductModal] = useState(null);
  const [categoryModal, setCategoryModal] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [searchProduct, setSearchProduct] = useState('');
  const [searchOrder, setSearchOrder] = useState('');
  const [searchUser, setSearchUser] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (productModal) setProductModal(null);
        else if (categoryModal) setCategoryModal(null);
        else if (orderDetail) setOrderDetail(null);
        else if (deleteConfirm) setDeleteConfirm(null);
        else onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, productModal, categoryModal, orderDetail, deleteConfirm, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'users') {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeTab]);

  const filteredProducts = useMemo(() => {
    if (!searchProduct) return products;
    const q = searchProduct.toLowerCase();
    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) || p.seller?.toLowerCase().includes(q)
    );
  }, [products, searchProduct]);

  const filteredOrders = useMemo(() => {
    if (!searchOrder) return orders;
    const q = searchOrder.toLowerCase();
    return orders.filter((o) =>
      o.id?.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.phone?.includes(q)
    );
  }, [orders, searchOrder]);

  const filteredUsers = useMemo(() => {
    if (!searchUser) return users;
    const q = searchUser.toLowerCase();
    return users.filter((u) =>
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, searchUser]);

  if (!isOpen) return null;

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
  };

  const handleSaveProduct = async (data) => {
    try {
      if (productModal.mode === 'create') {
        await productApi.create(data);
        showToast('🎉 Товар кошулду!', 'success');
      } else {
        await productApi.update(data.id || data._id, data);
        showToast('✅ Товар оңдолду!', 'success');
      }
      await loadProducts();
      setProductModal(null);
    } catch (err) {
      showToast(err.message || 'Ката кетти', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productApi.delete(id);
      showToast('🗑️ Товар өчүрүлдү', 'info');
      await loadProducts();
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err.message || 'Ката кетти', 'error');
    }
  };

  const handleSaveCategory = async (data) => {
    try {
      if (categoryModal.mode === 'create') {
        await categoryApi.create(data);
        showToast('🎉 Категория кошулду!', 'success');
      } else {
        await categoryApi.update(data.id || data._id, data);
        showToast('✅ Категория оңдолду!', 'success');
      }
      await loadCategories();
      setCategoryModal(null);
    } catch (err) {
      showToast(err.message || 'Ката кетти', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryApi.delete(id);
      showToast('🗑️ Категория өчүрүлдү', 'info');
      await loadCategories();
      setDeleteConfirm(null);
    } catch (err) {
      showToast(err.message || 'Ката кетти', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderApi.updateStatus(orderId, status);
      showToast(`📦 Статус: ${status}`, 'success');
      await loadOrders();
      setOrderDetail(null);
    } catch (err) {
      showToast(err.message || 'Ката кетти', 'error');
    }
  };

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const res = await userApi.getAll();
      if (res.success) setUsers(res.data);
    } catch (err) {
      console.error('Users load error:', err);
      showToast('Колдонуучуларды жүктөө катасы', 'error');
    } finally {
      setLoadingUsers(false);
    }
  }

  return (
    <>
      <style>{`
        /* ============================================================
           АНИМАЦИЯЛАР
           ============================================================ */
        @keyframes adminOverlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes adminPanelIn {
          0% { opacity: 0; transform: scale(.96) translateY(30px); }
          60% { transform: scale(1.005) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px) scale(.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(.5) rotate(-10deg); }
          60% { transform: scale(1.1) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(.85) translateY(40px); }
          60% { transform: scale(1.02) translateY(-6px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 currentColor; }
          50% { transform: scale(1.05); box-shadow: 0 0 0 8px transparent; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px -5px currentColor; }
          50% { box-shadow: 0 0 30px 0 currentColor; }
        }

        /* ============================================================
           ЖАЛПЫ
           ============================================================ */
        .admin-overlay { animation: adminOverlayIn .4s ease-out both; }
        .admin-panel { animation: adminPanelIn .6s cubic-bezier(.34,1.56,.64,1) both; }
        .admin-modal { animation: modalIn .5s cubic-bezier(.34,1.56,.64,1) both; }

        /* ============================================================
           SIDEBAR TABS
           ============================================================ */
        .admin-tab {
          position: relative;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          overflow: hidden;
        }
        .admin-tab::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #10B981, #059669);
          transform: scaleY(0);
          transform-origin: center;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
          border-radius: 0 4px 4px 0;
        }
        .admin-tab:hover::before { transform: scaleY(1); }
        .admin-tab:hover { transform: translateX(6px); }
        .admin-tab.active {
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
          box-shadow: 0 10px 25px -8px rgba(16,185,129,.5);
          transform: translateX(4px);
        }
        .admin-tab.active::before { transform: scaleY(1); }
        .admin-tab.active svg {
          animation: bounce .8s ease-in-out infinite;
        }

        /* ============================================================
           STAT CARDS
           ============================================================ */
        .stat-card {
          position: relative;
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255,255,255,.4) 50%,
            transparent 70%
          );
          transform: translateX(-100%);
          transition: transform .8s ease;
          pointer-events: none;
        }
        .stat-card:hover::before {
          transform: translateX(100%);
        }
        .stat-card:hover {
          transform: translateY(-10px) scale(1.03);
          box-shadow: 0 30px 60px -20px rgba(16,185,129,.4);
        }
        .stat-card:hover .stat-icon {
          animation: popIn .5s cubic-bezier(.34,1.56,.64,1);
          transform: rotate(-10deg) scale(1.15);
        }
        .stat-icon {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        /* ============================================================
           ADMIN ROWS
           ============================================================ */
        .admin-row {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          position: relative;
        }
        .admin-row::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #10B981, #059669);
          transform: scaleY(0);
          transition: transform .3s ease;
        }
        .admin-row:hover::after { transform: scaleY(1); }
        .admin-row:hover {
          background: linear-gradient(90deg, rgba(16,185,129,.08), rgba(16,185,129,.02)) !important;
          transform: translateX(4px);
        }

        /* ============================================================
           ADMIN CARDS (категориялар)
           ============================================================ */
        .admin-card {
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .admin-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #10B981, #059669, #10B981);
          background-size: 200% 100%;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .5s cubic-bezier(.34,1.56,.64,1);
        }
        .admin-card:hover::before {
          transform: scaleX(1);
          animation: shimmer 2s linear infinite;
        }
        .admin-card:hover {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 25px 50px -20px rgba(16,185,129,.4);
        }
        .admin-card:hover .admin-card-icon {
          transform: rotate(-15deg) scale(1.15);
          filter: drop-shadow(0 8px 16px rgba(16,185,129,.5));
        }
        .admin-card-icon {
          transition: all .5s cubic-bezier(.34,1.56,.64,1);
        }

        /* ============================================================
           INPUTS
           ============================================================ */
        .admin-input {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          background: linear-gradient(135deg, #ffffff, #f9fafb);
        }
        .admin-input:hover {
          border-color: rgba(16,185,129,.4) !important;
          transform: translateY(-1px);
        }
        .admin-input:focus {
          border-color: #10B981 !important;
          box-shadow: 0 0 0 4px rgba(16,185,129,.15), 0 8px 20px -8px rgba(16,185,129,.3);
          transform: translateY(-2px);
          background: #ffffff;
        }

        /* ============================================================
           BUTTONS
           ============================================================ */
        .btn-create {
          position: relative;
          overflow: hidden;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .btn-create::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent);
          transform: translateX(-150%) skewX(-20deg);
          transition: transform .7s ease;
        }
        .btn-create:hover::before {
          transform: translateX(400%) skewX(-20deg);
        }
        .btn-create:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 20px 40px -12px rgba(16,185,129,.6);
        }
        .btn-create:active {
          transform: translateY(-2px) scale(.98);
        }
        .btn-create svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .btn-create:hover svg {
          transform: rotate(90deg) scale(1.15);
        }

        /* ============================================================
           ACTION BUTTONS
           ============================================================ */
        .btn-edit {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .btn-edit:hover {
          transform: scale(1.15) rotate(-8deg);
          box-shadow: 0 10px 20px -5px rgba(59,130,246,.6);
        }
        .btn-edit:active { transform: scale(.9); }

        .btn-delete {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .btn-delete:hover {
          transform: scale(1.15) rotate(8deg);
          box-shadow: 0 10px 20px -5px rgba(239,68,68,.6);
          animation: pulse .6s ease-in-out infinite;
        }
        .btn-delete:active { transform: scale(.9); }

        /* ============================================================
           STATUS BADGES
           ============================================================ */
        .status-badge {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          border: 1px solid transparent;
        }
        .status-badge:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 16px -5px rgba(0,0,0,.15);
        }

        /* ============================================================
           HEADER ICON
           ============================================================ */
        .header-icon {
          animation: float 3s ease-in-out infinite, glow 2.5s ease-in-out infinite;
        }

        /* ============================================================
           SCROLLBAR
           ============================================================ */
        .admin-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
        .admin-scroll::-webkit-scrollbar-track {
          background: rgba(16,185,129,.05);
          border-radius: 5px;
        }
        .admin-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #10B981, #059669);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .admin-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #059669, #047857);
          background-clip: content-box;
        }

        /* ============================================================
           STAGGER ANIMATIONS
           ============================================================ */
        .stagger-1 { animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1) .05s both; }
        .stagger-2 { animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1) .1s both; }
        .stagger-3 { animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1) .15s both; }
        .stagger-4 { animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1) .2s both; }
        .stagger-5 { animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1) .25s both; }
        .stagger-6 { animation: fadeInUp .6s cubic-bezier(.34,1.56,.64,1) .3s both; }

        /* ============================================================
           GRADIENT TEXT
           ============================================================ */
        .gradient-text {
          background: linear-gradient(135deg, #10B981, #059669, #10B981);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* ============================================================
           PULSE DOT
           ============================================================ */
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: .6; }
        }
        .pulse-dot {
          position: relative;
        }
        .pulse-dot::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: currentColor;
          animation: pulseDot 2s ease-in-out infinite;
          opacity: .5;
        }

        /* ============================================================
           FILE UPLOAD
           ============================================================ */
        .file-upload-label {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .file-upload-label:hover {
          transform: translateY(-2px);
          border-color: #10B981 !important;
          background: rgba(16,185,129,.15) !important;
          box-shadow: 0 8px 20px -8px rgba(16,185,129,.4);
        }
        .file-upload-label:active {
          transform: scale(.98);
        }
      `}</style>

      <div className="admin-overlay fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div
          className="admin-panel bg-gray-50 rounded-3xl w-full max-w-7xl h-[92vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ====== HEADER ====== */}
          <div className="bg-gradient-to-r from-white via-emerald-50/30 to-white border-b border-gray-100 px-6 py-4 flex justify-between items-center flex-shrink-0 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 left-1/3 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="header-icon w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-xl">
                <FiBarChart2 className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Админ панель</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <FiActivity className="text-emerald-500 animate-pulse" />
                  {currentUser?.name || 'Администратор'} • {new Date().toLocaleDateString('ky-KG')}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-400 hover:rotate-90 hover:scale-110"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* ====== BODY ====== */}
          <div className="flex-grow flex overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-60 bg-gradient-to-b from-white via-emerald-50/20 to-white border-r border-gray-100 flex-shrink-0 py-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 animate-pulse" />

              <div className="px-4 mb-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Меню
                </p>
              </div>

              {TABS.map((tab, i) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`admin-tab w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold ${
                      isActive
                        ? 'active text-white'
                        : 'text-gray-600 hover:bg-emerald-50/50'
                    }`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <Icon className="text-lg flex-shrink-0" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-white shadow-lg animate-pulse" />
                    )}
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FiZap className="text-yellow-300 animate-pulse" />
                    <p className="text-[10px] font-bold uppercase opacity-90">Status</p>
                  </div>
                  <p className="text-xs font-bold">✅ Online</p>
                </div>
              </div>
            </aside>

            {/* CONTENT */}
            <main className="flex-grow overflow-y-auto admin-scroll p-6">

              {/* ====== DASHBOARD ====== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      icon={FiPackage}
                      label="Товарлар"
                      value={stats.totalProducts}
                      color="from-blue-400 to-blue-600"
                      bgColor="bg-blue-100"
                      delay={0}
                    />
                    <StatCard
                      icon={FiShoppingBag}
                      label="Буйрутмалар"
                      value={stats.totalOrders}
                      color="from-purple-400 to-purple-600"
                      bgColor="bg-purple-100"
                      delay={0.1}
                    />
                    <StatCard
                      icon={FiUsers}
                      label="Колдонуучулар"
                      value={stats.totalUsers}
                      color="from-emerald-400 to-emerald-600"
                      bgColor="bg-emerald-100"
                      delay={0.2}
                    />
                    <StatCard
                      icon={FiDollarSign}
                      label="Киреше"
                      value={stats.totalRevenue.toLocaleString()}
                      suffix="сом"
                      color="from-yellow-400 to-amber-600"
                      bgColor="bg-yellow-100"
                      delay={0.3}
                    />
                  </div>

                  <div className="stagger-2 bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition-shadow duration-500">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FiClock className="text-emerald-500" />
                        Акыркы буйрутмалар
                        <span className="pulse-dot w-2 h-2 rounded-full bg-emerald-500" />
                      </h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-1 group"
                      >
                        Баары
                        <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <FiPackage className="text-5xl text-gray-200 mx-auto mb-3" />
                        <p className="text-sm text-gray-400">Азырынча буйрутма жок</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {orders.slice(0, 5).map((order, i) => (
                          <div
                            key={order.id}
                            className="admin-row flex items-center gap-3 p-3 rounded-xl"
                            style={{ animationDelay: `${i * 0.05}s` }}
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-md">
                              <FiPackage />
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">
                                №{order.id?.split('-')[1] || order.id}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {order.customer?.name || 'Белгисиз'}
                              </p>
                            </div>
                            <span className={`status-badge text-xs font-bold px-3 py-1.5 rounded-full border ${
                              STATUS_COLORS[order.status] || STATUS_COLORS['Кабыл алынды']
                            }`}>
                              {order.status}
                            </span>
                            <span className="font-bold text-sm text-emerald-600">
                              {order.total?.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATUS_OPTIONS.map((status, i) => {
                      const count = orders.filter((o) => o.status === status).length;
                      return (
                        <div
                          key={status}
                          className={`stagger-${i + 3} bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-400`}
                        >
                          <p className="text-xs text-gray-500 font-semibold mb-1">{status}</p>
                          <p className="text-2xl font-bold gradient-text">{count}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* ✅ АНАЛИТИКА */}
                  <div className="stagger-5">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FiTrendingUp className="text-emerald-500" />
                      Аналитика
                    </h2>
                    <AnalyticsDashboard
                      orders={orders}
                      products={products}
                      users={users}
                    />
                  </div>

                </div>
              )}

              {/* ====== PRODUCTS ====== */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                    <div className="relative flex-grow max-w-md">
                      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        placeholder="Товар издөө..."
                        className="admin-input w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                      />
                    </div>
                    <button
                      onClick={() => setProductModal({ mode: 'create', data: {} })}
                      className="btn-create bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                    >
                      <FiPlus /> Жаңы товар
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto admin-scroll">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-emerald-50/30 border-b border-gray-100">
                          <tr>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Товар</th>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Категория</th>
                            <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Баасы</th>
                            <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Статус</th>
                            <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Аракеттер</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-16">
                                <FiPackage className="text-5xl text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400">Товар табылган жок</p>
                              </td>
                            </tr>
                          ) : (
                            filteredProducts.map((p, i) => (
                              <tr
                                key={p.id || p._id}
                                className="admin-row border-b border-gray-50"
                                style={{ animationDelay: `${i * 0.03}s` }}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-transparent hover:ring-emerald-400 transition-all">
                                      {p.image ? (
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                          <FiPackage />
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-gray-800 truncate max-w-[200px]">{p.name}</p>
                                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.seller || '—'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200">
                                    {getCategoryName(p.category)}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="font-bold gradient-text">
                                    {p.price?.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-1">сом</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {p.inStock ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 px-3 py-1.5 rounded-full border border-emerald-200">
                                      <FiCheckCircle className="text-xs" /> Бар
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-gradient-to-r from-red-50 to-pink-50 px-3 py-1.5 rounded-full border border-red-200">
                                      <FiXCircle className="text-xs" /> Жок
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => setProductModal({ mode: 'edit', data: p })}
                                      className="btn-edit w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                                      title="Оңдоо"
                                    >
                                      <FiEdit2 className="text-sm" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm({ type: 'product', id: p.id || p._id, name: p.name })}
                                      className="btn-delete w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                                      title="Өчүрүү"
                                    >
                                      <FiTrash2 className="text-sm" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ====== ORDERS ====== */}
              {activeTab === 'orders' && (
                <div>
                  <div className="relative mb-4 max-w-md">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchOrder}
                      onChange={(e) => setSearchOrder(e.target.value)}
                      placeholder="Буйрутма издөө (№, ат, телефон)..."
                      className="admin-input w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                    />
                  </div>

                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto admin-scroll">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-purple-50/30 border-b border-gray-100">
                          <tr>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">№</th>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Кардар</th>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Товар</th>
                            <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Сумма</th>
                            <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Статус</th>
                            <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Аракеттер</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="text-center py-16">
                                <FiShoppingBag className="text-5xl text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-400">Буйрутма табылган жок</p>
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((o, i) => (
                              <tr
                                key={o.id}
                                className="admin-row border-b border-gray-50"
                                style={{ animationDelay: `${i * 0.03}s` }}
                              >
                                <td className="px-4 py-3">
                                  <p className="font-mono text-xs font-bold text-gray-800">
                                    #{o.id?.split('-')[1] || o.id?.slice(0, 8)}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">{o.createdAt}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <p className="font-semibold text-gray-800 truncate max-w-[150px]">
                                    {o.customer?.name || '—'}
                                  </p>
                                  <p className="text-xs text-gray-500">{o.customer?.phone || '—'}</p>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-3 py-1.5 rounded-full font-medium border border-gray-200">
                                    {o.items?.length || 0} товар
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="font-bold gradient-text">
                                    {o.total?.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-1">сом</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`status-badge text-xs font-bold px-3 py-1.5 rounded-full border ${
                                    STATUS_COLORS[o.status] || STATUS_COLORS['Кабыл алынды']
                                  }`}>
                                    {o.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => setOrderDetail(o)}
                                    className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6 flex items-center justify-center"
                                    title="Көрүү"
                                  >
                                    <FiChevronRight className="text-sm" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ====== CATEGORIES ====== */}
              {activeTab === 'categories' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <FiTag className="text-emerald-500" />
                      Категориялар
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                        {categories.length}
                      </span>
                    </h3>
                    <button
                      onClick={() => setCategoryModal({ mode: 'create', data: {} })}
                      className="btn-create bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2"
                    >
                      <FiPlus /> Жаңы категория
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((c, i) => (
                      <div
                        key={c.id || c._id}
                        className="admin-card bg-white rounded-2xl p-4 shadow-sm group"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="admin-card-icon w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl shadow-md">
                            {c.icon || '📦'}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => setCategoryModal({ mode: 'edit', data: c })}
                              className="btn-edit w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                              title="Оңдоо"
                            >
                              <FiEdit2 className="text-xs" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'category', id: c.id || c._id, name: c.name })}
                              className="btn-delete w-7 h-7 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                              title="Өчүрүү"
                            >
                              <FiTrash2 className="text-xs" />
                            </button>
                          </div>
                        </div>
                        <p className="font-bold text-gray-800 text-sm truncate">{c.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <FiPackage className="text-[10px]" />
                          {products.filter((p) => getCategoryId(p.category) === (c.id || c._id)).length} товар
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====== USERS ====== */}
              {activeTab === 'users' && (
                <div>
                  <div className="relative mb-4 max-w-md">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                      placeholder="Колдонуучу издөө..."
                      className="admin-input w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                    />
                  </div>

                  {loadingUsers ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mb-3" />
                      <p className="text-gray-400 text-sm">Жүктөлүүдө...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-16">
                      <FiUsers className="text-5xl text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400">Колдонуучу табылган жок</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-cyan-50/30 border-b border-gray-100">
                          <tr>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Колдонуучу</th>
                            <th className="text-left px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Email</th>
                            <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Роль</th>
                            <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs uppercase tracking-wider">Каттоо</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u, i) => (
                            <tr
                              key={u._id || u.id}
                              className="admin-row border-b border-gray-50"
                              style={{ animationDelay: `${i * 0.03}s` }}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-emerald-100">
                                    {u.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <span className="font-semibold text-gray-800">{u.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-600 text-xs font-mono">{u.email}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                                  u.role === 'admin' ? 'bg-gradient-to-r from-red-100 to-pink-200 text-red-700 border-red-300'
                                    : u.role === 'seller' ? 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-700 border-yellow-300'
                                    : 'bg-gradient-to-r from-emerald-100 to-green-200 text-emerald-700 border-emerald-300'
                                }`}>
                                  {u.role === 'admin' ? '👑 Админ' : u.role === 'seller' ? '🏪 Сатуучу' : '🛒 Сатып алуучу'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right text-xs text-gray-500">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ky-KG') : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </main>
          </div>
        </div>
      </div>

      {/* ====== MODALS ====== */}
      {productModal && (
        <ProductFormModal
          mode={productModal.mode}
          initialData={productModal.data}
          onClose={() => setProductModal(null)}
          onSave={handleSaveProduct}
          categories={categories}
        />
      )}

      {categoryModal && (
        <CategoryFormModal
          mode={categoryModal.mode}
          initialData={categoryModal.data}
          onClose={() => setCategoryModal(null)}
          onSave={handleSaveCategory}
        />
      )}

      {orderDetail && (
        <OrderDetailAdminModal
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          data={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm.type === 'product') handleDeleteProduct(deleteConfirm.id);
            else if (deleteConfirm.type === 'category') handleDeleteCategory(deleteConfirm.id);
          }}
        />
      )}
    </>
  );
};

/* ============================================================
   STAT CARD
   ============================================================ */
const StatCard = ({ icon: Icon, label, value, suffix, color, delay = 0 }) => (
  <div
    className="stat-card bg-white rounded-2xl p-5 shadow-sm"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className={`stat-icon w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg mb-3`}>
      <Icon className="text-xl" />
    </div>
    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
    <p className="text-2xl font-bold text-gray-800 mt-1">
      {value}
      {suffix && <span className="text-xs text-gray-500 ml-1">{suffix}</span>}
    </p>
  </div>
);

/* ============================================================
   PRODUCT FORM MODAL (ФОТО ЖҮКТӨӨ КОШУЛГАН)
   ============================================================ */
const ProductFormModal = ({ mode, initialData, onClose, onSave, categories }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    originalPrice: initialData.originalPrice || '',
    wholesalePrice: initialData.wholesalePrice || '',
    image: initialData.image || '',
    category: getCategoryId(initialData.category),
    seller: initialData.seller || '',
    origin: initialData.origin || '',
    weight: initialData.weight || '',
    inStock: initialData.inStock !== false,
    saleType: initialData.saleType || 'retail',
    badge: initialData.badge || '',
    badgeText: initialData.badgeText || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  /* ====== ФАЙЛ ЖҮКТӨӨ ====== */
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImage(file, 2);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setForm((p) => ({ ...p, image: base64 }));
    } catch (err) {
      alert('Сүрөт жүктөө катасы');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      price: Number(form.price) || 0,
      originalPrice: Number(form.originalPrice) || undefined,
      wholesalePrice: Number(form.wholesalePrice) || undefined,
    };
    if (mode === 'edit') data.id = initialData.id || initialData._id;
    await onSave(data);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-[adminOverlayIn_.3s_ease-out]"
      onClick={onClose}
    >
      <div
        className="admin-modal bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/50 to-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <FiPlus className="text-emerald-500" />
                Жаңы товар кошуу
              </>
            ) : (
              <>
                <FiEdit2 className="text-blue-500" />
                Товарды оңдоо
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all hover:rotate-90"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto admin-scroll p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Аталышы *</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                placeholder="Мисалы: Алма"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Сүрөттөмө</label>
              <textarea
                name="description" value={form.description} onChange={handleChange} rows="2"
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Баа (сом) *</label>
              <input
                type="number" name="price" value={form.price} onChange={handleChange} required
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Эски баа</label>
              <input
                type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Оптом баа</label>
              <input
                type="number" name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Салмагы</label>
              <input
                type="text" name="weight" value={form.weight} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                placeholder="1 кг"
              />
            </div>

            {/* ====== ✅ СҮРӨТ ЖҮКТӨӨ ====== */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">
                Сүрөт
              </label>

              {/* Preview */}
              {form.image && (
                <div className="relative mb-3 w-full h-48 rounded-xl overflow-hidden border-2 border-emerald-200 shadow-md">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image: '' })}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
                  >
                    <FiX className="text-base" />
                  </button>
                </div>
              )}

              {/* File Upload */}
              <label
                className={`file-upload-label flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 text-emerald-700 font-bold text-sm cursor-pointer transition-all ${
                  uploading ? 'opacity-50 cursor-wait' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    Жүктөлүүдө...
                  </>
                ) : (
                  <>
                    <FiUpload className="text-lg" />
                    📷 Файлдан жүктөө
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>

              {/* URL Input */}
              <div className="mt-3">
                <p className="text-[11px] text-gray-400 mb-1.5 ml-1">
                  Же шилтеме жазыңыз:
                </p>
                <input
                  type="text" name="image" value={form.image} onChange={handleChange}
                  className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>
            {/* ============================================ */}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Категория</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              >
                <option value="">Тандаңыз</option>
                {categories.map((c) => (
                  <option key={c.id || c._id} value={c.id || c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Сатуучу</label>
              <input
                type="text" name="seller" value={form.seller} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Өлкө</label>
              <input
                type="text" name="origin" value={form.origin} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                placeholder="Кыргызстан"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Сатуу түрү</label>
              <select
                name="saleType" value={form.saleType} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              >
                <option value="retail">Розница</option>
                <option value="wholesale">Оптом</option>
                <option value="both">Экөө тең</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Badge</label>
              <select
                name="badge" value={form.badge} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              >
                <option value="">Жок</option>
                <option value="sale">Акция</option>
                <option value="new">Жаңы</option>
                <option value="popular">Популярдуу</option>
                <option value="organic">Табигый</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Badge текст</label>
              <input
                type="text" name="badgeText" value={form.badgeText} onChange={handleChange}
                className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
                placeholder="АКЦИЯ"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox" name="inStock" checked={form.inStock} onChange={handleChange}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                  Кампада бар
                </span>
              </label>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 border-2 border-gray-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            Жокко чыгаруу
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-create flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FiSave /> {saving ? 'Сакталууда...' : 'Сактоо'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   CATEGORY FORM MODAL
   ============================================================ */
const CategoryFormModal = ({ mode, initialData, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    icon: initialData.icon || '📦',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form };
    if (mode === 'edit') data.id = initialData.id || initialData._id;
    await onSave(data);
    setSaving(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="admin-modal bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 to-white">
          <h2 className="font-bold text-lg flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <FiPlus className="text-orange-500" />
                Жаңы категория
              </>
            ) : (
              <>
                <FiEdit2 className="text-blue-500" />
                Категорияны оңдоо
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all hover:rotate-90"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Аталышы *</label>
            <input
              type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="admin-input w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm"
              placeholder="Мисалы: Жашылчалар"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Иконка (emoji)</label>
            <input
              type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="admin-input w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-3xl text-center"
              maxLength={4}
            />
          </div>
        </form>

        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 border-2 border-gray-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            Жокко чыгаруу
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="btn-create flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50"
          >
            {saving ? 'Сакталууда...' : 'Сактоо'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ORDER DETAIL ADMIN MODAL
   ============================================================ */
const OrderDetailAdminModal = ({ order, onClose, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    if (newStatus === order.status) return;
    setUpdating(true);
    await onUpdateStatus(order.id, newStatus);
    setUpdating(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="admin-modal bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50">
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FiShoppingBag className="text-emerald-500" />
              Буйрутма #{order.id?.split('-')[1] || order.id}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{order.createdAt}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all hover:rotate-90"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto admin-scroll p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block uppercase tracking-wider">
              Статусту өзгөртүү
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`py-2.5 px-3 rounded-xl font-semibold text-xs transition-all duration-300 ${
                    newStatus === s
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {newStatus !== order.status && (
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-create w-full mt-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg disabled:opacity-50"
              >
                {updating ? 'Жаңыланууда...' : `Статусту "${newStatus}" кылуу`}
              </button>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 space-y-2 text-sm border border-gray-100">
            <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <FiUsers className="text-emerald-500" />
              Кардар
            </p>
            <p className="text-gray-600">👤 {order.customer?.name}</p>
            <p className="text-gray-600">📞 {order.customer?.phone}</p>
            <p className="text-gray-600">📍 {order.customer?.address}</p>
          </div>

          <div>
            <p className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
              <FiPackage className="text-emerald-500" />
              Товарлар ({order.items?.length || 0})
            </p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.price} сом × {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm gradient-text">
                    {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <span className="text-sm font-bold text-gray-700">Жалпы:</span>
            <span className="font-bold text-emerald-600 text-xl gradient-text">
              {order.total?.toLocaleString()} сом
            </span>
          </div>

          {order.comment && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
              💬 {order.comment}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   DELETE CONFIRM
   ============================================================ */
const DeleteConfirmModal = ({ data, onClose, onConfirm }) => (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[120] flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="admin-modal bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-pink-200 text-red-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
        <FiAlertCircle className="text-4xl" />
      </div>
      <h3 className="font-bold text-xl text-gray-800 mb-2">Өчүрүүнү тастыктоо</h3>
      <p className="text-sm text-gray-500 mb-6">
        <span className="font-bold text-gray-800">"{data.name}"</span> өчүрүлөт.
        <br />
        <span className="text-xs text-red-500 mt-1 block">⚠️ Бул аракетти артка кайтаруу мүмкүн эмес.</span>
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-95"
        >
          Жок
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 hover:shadow-red-500/50"
        >
          Ооба, өчүрүү
        </button>
      </div>
    </div>
  </div>
);

export default AdminPanel;
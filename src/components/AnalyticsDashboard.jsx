import React, { useMemo } from 'react';
import {
  FiTrendingUp, FiTrendingDown, FiBarChart2, FiPieChart,
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiAward,
} from 'react-icons/fi';

/* ====== ЖАРДАМЧЫ: КҮНДҮ АЛУУ ====== */
const getOrderDate = (order) => {
  if (!order) return null;

  /* 1. order.date (ISO форматында) */
  if (order.date) {
    const d = new Date(order.date);
    if (!isNaN(d.getTime())) return d;
  }

  /* 2. order.createdAt (ISO) */
  if (order.createdAt) {
    const d = new Date(order.createdAt);
    if (!isNaN(d.getTime())) return d;
  }

  /* 3. order.timestamp (number) */
  if (order.timestamp) {
    const d = new Date(order.timestamp);
    if (!isNaN(d.getTime())) return d;
  }

  return null;
};

const AnalyticsDashboard = ({ orders = [], products = [], users = [] }) => {
  /* ====== КҮНҮМДҮК САТУУ (акыркы 7 күн) ====== */
  const dailySales = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayLabel = date.toLocaleDateString('ky-KG', { weekday: 'short' });

      /* ✅ Коопсуз салыштыруу */
      const dayOrders = orders.filter((o) => {
        const orderDate = getOrderDate(o);
        if (!orderDate) return false;
        return orderDate >= date && orderDate < nextDay;
      });

      const total = dayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
      days.push({ label: dayLabel, total, count: dayOrders.length });
    }

    return days;
  }, [orders]);

  const maxDailySale = Math.max(...dailySales.map((d) => d.total), 1);

  /* ====== ЭҢ КӨП САТЫЛГАН ТОВАРЛАР ====== */
  const topProducts = useMemo(() => {
    const productCount = {};

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const key = item.name || item.id;
        if (!key) return;
        if (!productCount[key]) {
          productCount[key] = {
            name: item.name || 'Белгисиз',
            image: item.image,
            quantity: 0,
            revenue: 0,
          };
        }
        productCount[key].quantity += Number(item.quantity) || 0;
        productCount[key].revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
      });
    });

    return Object.values(productCount)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  const maxQuantity = Math.max(...topProducts.map((p) => p.quantity), 1);

  /* ====== КАТЕГОРИЯЛАР БОЮНЧА ====== */
  const categoryStats = useMemo(() => {
    const stats = {};
    let total = 0;

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const product = products.find(
          (p) => p.id === item.id || p._id === item.id || p.name === item.name
        );
        if (!product) return;

        const catName = product.category || 'Башка';
        const catKey = typeof catName === 'object' ? catName.name : catName;

        if (!stats[catKey]) stats[catKey] = 0;
        stats[catKey] += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        total += (Number(item.price) || 0) * (Number(item.quantity) || 0);
      });
    });

    return Object.entries(stats)
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders, products]);

  /* ====== СТАТУС БОЮНЧА ====== */
  const statusStats = useMemo(() => {
    const stats = {
      'Кабыл алынды': 0,
      'Жолдо': 0,
      'Жеткирилди': 0,
      'Жокко чыгарылды': 0,
    };
    orders.forEach((o) => {
      if (stats[o.status] !== undefined) stats[o.status]++;
    });
    return stats;
  }, [orders]);

  const totalOrders = orders.length || 1;

  /* ====== ЖАЛПЫ СТАТИСТИКА ====== */
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  /* ====== АКЫРКЫ 7 КҮНДҮН ӨСҮШҮ ====== */
  const recentGrowth = useMemo(() => {
    const last7 = dailySales.reduce((sum, d) => sum + d.total, 0);

    const prev7Days = orders.filter((o) => {
      const orderDate = getOrderDate(o);
      if (!orderDate) return false;
      const daysAgo = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo >= 7 && daysAgo < 14;
    });

    const prev7 = prev7Days.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    if (prev7 === 0) return last7 > 0 ? 100 : 0;
    return Math.round(((last7 - prev7) / prev7) * 100);
  }, [orders, dailySales]);

  return (
    <>
      <style>{`
        @keyframes chartBarGrow {
          from { height: 0; opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes chartFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progressFill {
          from { width: 0; }
        }

        .chart-bar {
          animation: chartBarGrow 1s cubic-bezier(.34,1.56,.64,1) both;
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .chart-bar:hover {
          filter: brightness(1.2);
          transform: scaleY(1.05);
          transform-origin: bottom;
        }
        .chart-bar:hover .chart-tooltip {
          opacity: 1;
          transform: translateY(0) translateX(-50%);
        }
        .chart-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateY(8px) translateX(-50%);
          opacity: 0;
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          pointer-events: none;
          white-space: nowrap;
          z-index: 10;
        }

        .analytics-card {
          animation: chartFadeIn .6s cubic-bezier(.34,1.56,.64,1) both;
        }

        .progress-bar-fill {
          animation: progressFill 1.2s cubic-bezier(.34,1.56,.64,1) both;
        }

        .top-product-item {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
        }
        .top-product-item:hover {
          transform: translateX(6px);
          background: linear-gradient(90deg, rgba(16,185,129,.08), transparent);
        }
        .top-product-item:hover .top-product-img {
          transform: scale(1.1) rotate(-5deg);
        }
        .top-product-img {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
      `}</style>

      <div className="space-y-6">

        {/* ====== ЖОГОРКУ СТАТИСТИКА ====== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="analytics-card bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FiDollarSign className="text-xl" />
                </div>
                <p className="text-xs font-semibold opacity-90">Жалпы киреше</p>
              </div>
              <p className="text-3xl font-black mb-1">
                {totalRevenue.toLocaleString()}
                <span className="text-sm font-bold opacity-80 ml-1">сом</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs">
                {recentGrowth >= 0 ? (
                  <>
                    <FiTrendingUp className="text-green-200" />
                    <span className="font-bold text-green-100">+{recentGrowth}%</span>
                  </>
                ) : (
                  <>
                    <FiTrendingDown className="text-red-200" />
                    <span className="font-bold text-red-100">{recentGrowth}%</span>
                  </>
                )}
                <span className="opacity-70">акыркы 7 күн</span>
              </div>
            </div>
          </div>

          <div className="analytics-card bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden" style={{ animationDelay: '.1s' }}>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FiShoppingBag className="text-xl" />
                </div>
                <p className="text-xs font-semibold opacity-90">Жалпы буйрутмалар</p>
              </div>
              <p className="text-3xl font-black mb-1">{totalOrders}</p>
              <p className="text-xs opacity-90">
                Орточо чек: <strong>{Math.round(avgOrder).toLocaleString()} сом</strong>
              </p>
            </div>
          </div>

          <div className="analytics-card bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden" style={{ animationDelay: '.2s' }}>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FiAward className="text-xl" />
                </div>
                <p className="text-xs font-semibold opacity-90">Ийгилик деңгээли</p>
              </div>
              <p className="text-3xl font-black mb-1">
                {Math.round((statusStats['Жеткирилди'] / totalOrders) * 100)}%
              </p>
              <p className="text-xs opacity-90">
                {statusStats['Жеткирилди']} ийгиликтүү буйрутма
              </p>
            </div>
          </div>
        </div>

        {/* ====== КҮНҮМДҮК САТУУ ГРАФИГИ ====== */}
        <div className="analytics-card bg-white rounded-2xl p-6 shadow-sm" style={{ animationDelay: '.3s' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <FiBarChart2 className="text-emerald-500" />
                Күнүмдүк сатуу
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Акыркы 7 күн</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Жалпы</p>
              <p className="font-bold text-emerald-600">
                {dailySales.reduce((s, d) => s + d.total, 0).toLocaleString()} сом
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-48 mb-4">
            {dailySales.map((day, i) => {
              const height = (day.total / maxDailySale) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
                  <div
                    className="chart-bar w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-400 relative min-h-[4px]"
                    style={{
                      height: `${Math.max(height, 2)}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div className="chart-tooltip bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
                      {day.total.toLocaleString()} сом
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-gray-500">{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====== ЭКИ КОЛОНКА ====== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="analytics-card bg-white rounded-2xl p-6 shadow-sm" style={{ animationDelay: '.4s' }}>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
              <FiAward className="text-orange-500" />
              Эң көп сатылгандар
            </h3>

            {topProducts.length === 0 ? (
              <div className="text-center py-12">
                <FiPackage className="text-5xl text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Маалымат жок</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, i) => {
                  const percent = (product.quantity / maxQuantity) * 100;
                  return (
                    <div
                      key={i}
                      className="top-product-item flex items-center gap-3 p-2 rounded-xl"
                    >
                      <div className="relative flex-shrink-0">
                        <div className="top-product-img w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FiPackage />
                            </div>
                          )}
                        </div>
                        <span className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md ${
                          i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500' :
                          i === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                          i === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-600' :
                          'bg-gray-400'
                        }`}>
                          {i + 1}
                        </span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-emerald-600">
                            {product.quantity} даана
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {product.revenue.toLocaleString()} сом
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="progress-bar-fill h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="analytics-card bg-white rounded-2xl p-6 shadow-sm" style={{ animationDelay: '.5s' }}>
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
              <FiPieChart className="text-purple-500" />
              Категориялар боюнча
            </h3>

            {categoryStats.length === 0 ? (
              <div className="text-center py-12">
                <FiPieChart className="text-5xl text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Маалымат жок</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((cat, i) => {
                  const colors = [
                    'from-emerald-400 to-emerald-600',
                    'from-blue-400 to-blue-600',
                    'from-purple-400 to-purple-600',
                    'from-orange-400 to-orange-600',
                    'from-pink-400 to-pink-600',
                  ];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-700">
                          {cat.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-800">
                            {cat.value.toLocaleString()} сом
                          </span>
                          <span className="text-xs text-gray-400">
                            ({cat.percent.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`progress-bar-fill h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`}
                          style={{
                            width: `${cat.percent}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ====== СТАТУС БОЮНЧА ====== */}
        <div className="analytics-card bg-white rounded-2xl p-6 shadow-sm" style={{ animationDelay: '.6s' }}>
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-5">
            <FiShoppingBag className="text-blue-500" />
            Буйрутма статустары
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusStats).map(([status, count], i) => {
              const colors = {
                'Кабыл алынды': { bg: 'from-blue-50 to-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
                'Жолдо': { bg: 'from-yellow-50 to-amber-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
                'Жеткирилди': { bg: 'from-emerald-50 to-green-100', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
                'Жокко чыгарылды': { bg: 'from-red-50 to-pink-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
              };
              const color = colors[status] || colors['Кабыл алынды'];
              const percent = (count / totalOrders) * 100;

              return (
                <div
                  key={status}
                  className={`bg-gradient-to-br ${color.bg} rounded-2xl p-4 border ${color.border}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${color.dot} animate-pulse`} />
                    <p className={`text-xs font-semibold ${color.text}`}>{status}</p>
                  </div>
                  <p className="text-3xl font-black text-gray-800">{count}</p>
                  <p className={`text-xs mt-1 ${color.text}`}>
                    {percent.toFixed(0)}% жалпыдан
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </>
  );
};

export default AnalyticsDashboard;
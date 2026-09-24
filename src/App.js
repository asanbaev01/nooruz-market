import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import BestSellers from './components/BestSellers';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductDetailModal from './components/ProductDetailModal';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ToastContainer from './components/ToastContainer';
import AboutSection from './components/AboutSection';
import DeliverySection from './components/DeliverySection';
import PromoSection from './components/PromoSection';
import Footer from './components/Footer';
import SortDropdown from './components/SortDropdown';
import CheckoutModal from './components/CheckoutModal';
import FloatingContact from './components/FloatingContact';
import DeliveryMap from './components/DeliveryMap';
import AdminPanel from './components/AdminPanel';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ProductsGridSkeleton } from './components/Skeletons';
import { useApp } from './context/AppContext';
import { useOrder } from './context/OrderContext';
import LiveChat from './components/LiveChat';
import { FiHome, FiX, FiArrowUp, FiSliders, FiSearch, FiPackage } from 'react-icons/fi';

function App() {
  const { isLoggedIn, showToast, products, cartTotal, loading: appLoading } = useApp();
  const { openCheckout } = useOrder();

  /* ====== UI STATES ====== */
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ====== FILTER STATES ====== */
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saleType, setSaleType] = useState('all');
  const [activeFilters, setActiveFilters] = useState({
    all: true, sale: false, new: false, popular: false, organic: false,
  });
  const [priceFilter, setPriceFilter] = useState(5000);
  const [stockFilter, setStockFilter] = useState(true);
  const [sellerFilter, setSellerFilter] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedCount, setDisplayedCount] = useState(12);

  const searchInputRef = useRef(null);
  const productsSectionRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (e.key === 'Escape') {
        setMobileFiltersOpen(false);
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setDisplayedCount(12);
  }, [selectedCategory, saleType, activeFilters, priceFilter, stockFilter, sellerFilter, searchQuery, sortBy]);

  useEffect(() => {
    if (mobileFiltersOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileFiltersOpen]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (selectedCategory !== 'all') filtered = filtered.filter((p) => p.category === selectedCategory);
    filtered = filtered.filter((p) => p.price <= priceFilter);
    if (stockFilter) filtered = filtered.filter((p) => p.inStock);
    if (sellerFilter) filtered = filtered.filter((p) => p.seller);
    if (saleType === 'wholesale') {
      filtered = filtered.filter((p) => p.saleType === 'both' || p.saleType === 'wholesale');
    } else if (saleType === 'retail') {
      filtered = filtered.filter((p) => p.saleType === 'retail' || p.saleType === 'both');
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.seller.toLowerCase().includes(q)
      );
    }
    if (activeFilters.sale) filtered = filtered.filter((p) => p.badge === 'sale');
    if (activeFilters.new) filtered = filtered.filter((p) => p.badge === 'new');
    if (activeFilters.popular) filtered = filtered.filter((p) => p.badge === 'popular' || p.badge === 'hit');
    if (activeFilters.organic) filtered = filtered.filter((p) => p.badge === 'organic');
    switch (sortBy) {
      case 'popular': filtered.sort((a, b) => b.popularity - a.popularity); break;
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return filtered;
  }, [products, selectedCategory, priceFilter, stockFilter, sellerFilter, saleType, searchQuery, activeFilters, sortBy]);

  const displayedProducts = filteredProducts.slice(0, displayedCount);

  const handleFilterChange = (id) => {
    setActiveFilters((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (id === 'all' && updated.all) {
        return { all: true, sale: false, new: false, popular: false, organic: false };
      }
      if (id !== 'all' && updated[id]) updated.all = false;
      const anyActive = updated.sale || updated.new || updated.popular || updated.organic;
      if (!anyActive) updated.all = true;
      return updated;
    });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSaleType('all');
    setActiveFilters({ all: true, sale: false, new: false, popular: false, organic: false });
    setPriceFilter(5000);
    setStockFilter(true);
    setSellerFilter(true);
    setSearchQuery('');
    setDisplayedCount(12);
    showToast('Фильтрлер тазаланды', 'info');
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      showToast('Буйрутма берүү үчүн кириңиз!', 'warning');
      setAuthOpen(true);
      return;
    }
    setCartOpen(false);
    openCheckout();
  };

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount =
    (activeFilters.sale ? 1 : 0) +
    (activeFilters.new ? 1 : 0) +
    (activeFilters.popular ? 1 : 0) +
    (activeFilters.organic ? 1 : 0) +
    (saleType !== 'all' ? 1 : 0) +
    (priceFilter < 5000 ? 1 : 0) +
    (!stockFilter ? 1 : 0) +
    (!sellerFilter ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0);

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes loaderSpin { to { transform: rotate(360deg); } }
          @keyframes loaderDot {
            0%, 80%, 100% { transform: scale(0.6); opacity: .5; }
            40% { transform: scale(1.2); opacity: 1; }
          }
          @keyframes loaderTextIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .loader-wrap {
            position: fixed; inset: 0;
            background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: 24px; z-index: 9999;
          }
          .loader-logo {
            width: 72px; height: 72px;
            border-radius: 22px;
            background: linear-gradient(135deg, #10B981, #059669);
            display: flex; align-items: center; justify-content: center;
            color: #fff;
            box-shadow: 0 20px 50px -10px rgba(16,185,129,.6);
            animation: loaderSpin 1.8s linear infinite;
          }
          .loader-logo svg { width: 36px; height: 36px; }
          .loader-text {
            color: #065F46;
            font-weight: 800;
            font-size: 22px;
            letter-spacing: 3px;
            animation: loaderTextIn .6s ease-out .2s both;
          }
          .loader-dots { display: flex; gap: 8px; }
          .loader-dot {
            width: 10px; height: 10px; border-radius: 50%;
            background: #10B981;
            animation: loaderDot 1.4s ease-in-out infinite;
          }
          .loader-dot:nth-child(2) { animation-delay: .2s; background: #22E8B0; }
          .loader-dot:nth-child(3) { animation-delay: .4s; background: #FFC857; }
        `}</style>
        <div className="loader-wrap">
          <div className="loader-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8 L12 4 L19 8 M5 8 L5 16 L12 20 M5 8 L12 12 M12 20 L19 16 L19 8 M19 8 L12 12 M12 12 L12 20" />
            </svg>
          </div>
          <div className="loader-text">NOORUZ MARKET</div>
          <div className="loader-dots">
            <span className="loader-dot" />
            <span className="loader-dot" />
            <span className="loader-dot" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes scrollTopIn {
          0% { opacity: 0; transform: translateY(20px) scale(.8); }
          60% { transform: translateY(-4px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scrollTopFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .scroll-top-btn {
          animation: scrollTopIn .5s cubic-bezier(.34,1.56,.64,1) both,
                     scrollTopFloat 3s ease-in-out 0.5s infinite;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .scroll-top-btn:hover {
          transform: translateY(-4px) scale(1.1) !important;
          box-shadow: 0 20px 40px -10px rgba(16,185,129,.5);
        }
        .scroll-top-btn:active { transform: scale(.9); }
        @keyframes productCardIn {
          0% { transform: translateY(30px) scale(.95); }
          60% { transform: translateY(-4px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        .products-grid-item {
          animation: productCardIn .6s cubic-bezier(.34,1.56,.64,1) both;
          will-change: transform;
        }
        @keyframes filterBtnPulse {
          0%, 100% { box-shadow: 0 8px 20px -8px rgba(16,185,129,.5), 0 0 0 0 rgba(16,185,129,.4); }
          50% { box-shadow: 0 8px 20px -8px rgba(16,185,129,.5), 0 0 0 12px rgba(16,185,129,0); }
        }
        .mobile-filter-btn {
          animation: filterBtnPulse 2.5s ease-in-out infinite;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .mobile-filter-btn:hover { transform: scale(1.05); }
        .mobile-filter-btn:active { transform: scale(.95); }
        @keyframes drawerIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes drawerOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .mobile-drawer-overlay { animation: drawerOverlayIn .3s ease-out both; }
        .mobile-drawer { animation: drawerIn .4s cubic-bezier(.34,1.56,.64,1) both; }
        .products-title {
          position: sticky;
          top: 80px;
          z-index: 5;
          background: rgba(249, 250, 251, .92);
          backdrop-filter: blur(10px);
          padding: 12px 0;
          border-radius: 12px;
        }
        .load-more-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .load-more-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(16,185,129,.15), transparent);
          transform: translateX(-100%);
          transition: transform .7s ease;
        }
        .load-more-btn:hover::before { transform: translateX(100%); }
        .load-more-btn:hover {
          transform: translateY(-3px) scale(1.02);
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
          border-color: #10B981;
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.4);
        }
        .load-more-btn:active { transform: scale(.97); }
        @keyframes chipIn {
          0% { transform: scale(.8); opacity: 0; }
          60% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .search-chip { animation: chipIn .4s cubic-bezier(.34,1.56,.64,1); }
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .empty-icon { animation: emptyFloat 3s ease-in-out infinite; }
        @keyframes countPop {
          0% { transform: scale(.5); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .count-badge { animation: countPop .4s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <Header
          onCartClick={() => setCartOpen(true)}
          onAuthClick={() => setAuthOpen(true)}
          onProfileClick={() => setProfileOpen(true)}
          onAdminClick={() => setAdminOpen(true)}
          onSearch={setSearchQuery}
        />

        <main className="pt-20">
          <Hero
            onShopNow={scrollToProducts}
            onStartSelling={() => setAuthOpen(true)}
          />

          <Benefits />

          <Categories
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <BestSellers onProductClick={setSelectedProduct} />

          <section
            id="products-section"
            ref={productsSectionRef}
            className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-24"
          >
            <div className="hidden lg:block">
              <ProductFilters
                saleType={saleType}
                onSaleTypeChange={setSaleType}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                priceFilter={priceFilter}
                onPriceChange={setPriceFilter}
                stockFilter={stockFilter}
                onStockToggle={() => setStockFilter(!stockFilter)}
                sellerFilter={sellerFilter}
                onSellerToggle={() => setSellerFilter(!sellerFilter)}
                onReset={resetFilters}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="products-title flex flex-wrap justify-between items-center mb-10 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FiHome className="text-primary" />
                  Популярдуу азыктар
                  <span
                    key={filteredProducts.length}
                    className="count-badge text-sm font-normal ml-2 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full"
                  >
                    {filteredProducts.length}
                  </span>
                </h2>

                <div className="flex gap-3 items-center flex-wrap">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="mobile-filter-btn lg:hidden bg-primary text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 relative"
                  >
                    <FiSliders />
                    Фильтрлер
                    {activeFilterCount > 0 && (
                      <span className="bg-white text-primary text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <SortDropdown value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {searchQuery && (
                <div className="mb-6 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">Издөө:</span>
                  <span className="search-chip inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
                    <FiSearch className="text-xs" />
                    {searchQuery}
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                      aria-label="Издөөнү тазалоо"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </span>
                </div>
              )}

              {appLoading.products ? (
                <ProductsGridSkeleton count={6} />
              ) : displayedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FiX className="text-7xl mb-4 opacity-20 empty-icon" />
                  <p className="text-xl font-medium text-gray-600">Азык табылган жок</p>
                  <p className="text-sm opacity-60 mt-1">Фильтрлерди өзгөртүп көрүңүз</p>
                  <button
                    onClick={resetFilters}
                    className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-transform shadow-lg"
                  >
                    Фильтрлерди тазалоо
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedProducts.map((product, i) => (
                      <div
                        key={product.id || product._id}
                        className="products-grid-item"
                        style={{ animationDelay: `${(i % 12) * 0.05}s` }}
                      >
                        <ProductCard
                          product={product}
                          onDetail={setSelectedProduct}
                        />
                      </div>
                    ))}
                  </div>

                  {displayedCount < filteredProducts.length && (
                    <div className="text-center mt-12">
                      <button
                        onClick={() => setDisplayedCount((c) => c + 8)}
                        className="load-more-btn bg-white border-2 border-primary text-primary px-8 py-3.5 rounded-xl font-bold"
                      >
                        Көбүрөөк жүктөө ({filteredProducts.length - displayedCount})
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>
          </section>

          <AboutSection />

          <DeliverySection onOpenMap={() => setMapOpen(true)} />

          <PromoSection />
        </main>

        <Footer />

        {/* ====== MODALS ====== */}
        <CartSidebar
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onCheckout={handleCheckout}
        />

        <CheckoutModal />

        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
        />

        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
        />

        <DeliveryMap
          isOpen={mapOpen}
          onClose={() => setMapOpen(false)}
          cartTotal={cartTotal}
          onZoneSelect={(zone) => {
            showToast(`📍 ${zone.name} тандалды`, 'success');
          }}
        />

        <AdminPanel
          isOpen={adminOpen}
          onClose={() => setAdminOpen(false)}
        />

        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onProductChange={setSelectedProduct}
          />
        )}

        {mobileFiltersOpen && (
          <>
            <div
              className="mobile-drawer-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="mobile-drawer fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[75] lg:hidden max-h-[85vh] overflow-y-auto p-6">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FiSliders className="text-primary" />
                  Фильтрлер
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                  aria-label="Жабуу"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <ProductFilters
                saleType={saleType}
                onSaleTypeChange={setSaleType}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                priceFilter={priceFilter}
                onPriceChange={setPriceFilter}
                stockFilter={stockFilter}
                onStockToggle={() => setStockFilter(!stockFilter)}
                sellerFilter={sellerFilter}
                onSellerToggle={() => setSellerFilter(!sellerFilter)}
                onReset={resetFilters}
              />

              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-6 bg-primary text-white py-3.5 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FiPackage className="text-lg" />
                Көрсөтүү ({filteredProducts.length} азык)
              </button>
            </div>
          </>
        )}

        <ToastContainer />

        <FloatingContact />
        <LiveChat />

        {/* ✅ PWA INSTALL PROMPT */}
        <PWAInstallPrompt />

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="scroll-top-btn fixed bottom-8 right-8 z-[80] w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-2xl flex items-center justify-center"
            aria-label="Жогору кайтуу"
          >
            <FiArrowUp className="text-xl" />
          </button>
        )}
      </div>
    </>
  );
}

export default App;
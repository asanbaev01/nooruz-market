import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Categories from './components/Categories';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductDetailModal from './components/ProductDetailModal';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';
import AboutSection from './components/AboutSection';
import DeliverySection from './components/DeliverySection';
import PromoSection from './components/PromoSection';
import Footer from './components/Footer';
import { productsData } from './data/products';
import { useApp } from './context/AppContext';
import { FiHome, FiX } from 'react-icons/fi';

function App() {
  const { isLoggedIn, showToast } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saleType, setSaleType] = useState('all');
  const [activeFilters, setActiveFilters] = useState({ all: true, sale: false, new: false, popular: false, organic: false });
  const [priceFilter, setPriceFilter] = useState(5000);
  const [stockFilter, setStockFilter] = useState(true);
  const [sellerFilter, setSellerFilter] = useState(true);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedCount, setDisplayedCount] = useState(12);

  const filteredProducts = useMemo(() => {
    let filtered = [...productsData];
    if (selectedCategory !== 'all') filtered = filtered.filter((p) => p.category === selectedCategory);
    filtered = filtered.filter((p) => p.price <= priceFilter);
    if (stockFilter) filtered = filtered.filter((p) => p.inStock);
    if (sellerFilter) filtered = filtered.filter((p) => p.seller);
    if (saleType === 'wholesale') filtered = filtered.filter((p) => p.saleType === 'both' || p.saleType === 'wholesale');
    else if (saleType === 'retail') filtered = filtered.filter((p) => p.saleType === 'retail' || p.saleType === 'both');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q));
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
  }, [selectedCategory, priceFilter, stockFilter, sellerFilter, saleType, searchQuery, activeFilters, sortBy]);

  const displayedProducts = filteredProducts.slice(0, displayedCount);

  const handleFilterChange = (id) => {
    setActiveFilters((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (id === 'all' && updated.all) return { all: true, sale: false, new: false, popular: false, organic: false };
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
    showToast('Фильтрлер тазаланды');
  };

  const handleCheckout = () => {
    if (!isLoggedIn) { showToast('Буйрутма берүү үчүн кириңиз!'); setAuthOpen(true); return; }
    showToast('Буйрутмаңыз кабыл алынды!');
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setCartOpen(true)} onAuthClick={() => setAuthOpen(true)} onSearch={setSearchQuery} />

      <main className="pt-20">
        <Hero
          onShopNow={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
          onStartSelling={() => setAuthOpen(true)}
        />
        <Benefits />
        <Categories selected={selectedCategory} onSelect={setSelectedCategory} />

        <section id="products-section" className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-8 pb-24">
          <ProductFilters
            saleType={saleType} onSaleTypeChange={setSaleType}
            activeFilters={activeFilters} onFilterChange={handleFilterChange}
            priceFilter={priceFilter} onPriceChange={setPriceFilter}
            stockFilter={stockFilter} onStockToggle={() => setStockFilter(!stockFilter)}
            sellerFilter={sellerFilter} onSellerToggle={() => setSellerFilter(!sellerFilter)}
            onReset={resetFilters}
          />

          <div className="lg:col-span-3">
            <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FiHome className="text-primary" /> Популярдуу азыктар
                <span className="text-sm text-gray-500 font-normal ml-2">{filteredProducts.length}</span>
              </h2>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-primary outline-none cursor-pointer shadow-sm">
                <option value="popular">Популярдуулугу боюнча</option>
                <option value="price-asc">Арзан баалар</option>
                <option value="price-desc">Жогорку баалар</option>
                <option value="name">Аты боюнча</option>
              </select>
            </div>

            {displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FiX className="text-7xl mb-4 opacity-20" />
                <p className="text-xl font-medium">Азык табылган жок</p>
                <p className="text-sm opacity-60 mt-1">Фильтрлерди өзгөртүп көрүңүз</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onDetail={setSelectedProduct} />
                  ))}
                </div>
                {displayedCount < filteredProducts.length && (
                  <div className="text-center mt-12">
                    <button onClick={() => setDisplayedCount((c) => c + 8)} className="bg-white border border-primary text-primary px-8 py-3.5 rounded-xl font-bold hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">
                      Көбүрөөк жүктөө
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <AboutSection />
        <DeliverySection />
        <PromoSection />
      </main>

      <Footer />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      <ToastContainer />
    </div>
  );
}

export default App;
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  authApi,
  productApi,
  categoryApi,
  cartApi,
  orderApi,
  favoriteApi,
} from '../api';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

/* ====== LOCALSTORAGE HELPERS ====== */
const LS_KEYS = {
  TOKEN: 'nooruz_token',
  USER: 'nooruz_user',
  CART: 'nooruz_cart',
  FAVORITES: 'nooruz_favorites',
  FILTERS: 'nooruz_filters',
};

const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('localStorage set error:', err);
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {}
};

/* ====== МААНИЛҮҮ: API жообун ар дайым массив кылып алуу ====== */
const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.products)) return data.products;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.categories)) return data.categories;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

export const AppProvider = ({ children }) => {
  /* ====== STATE ====== */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(() => {
    const c = safeGet(LS_KEYS.CART, []);
    return Array.isArray(c) ? c : [];
  });
  const [favorites, setFavorites] = useState(() => {
    const f = safeGet(LS_KEYS.FAVORITES, []);
    return Array.isArray(f) ? f : [];
  });
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => safeGet(LS_KEYS.USER, null));
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem(LS_KEYS.TOKEN)
  );
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    cart: false,
    favorites: false,
    orders: false,
  });

  useEffect(() => {
    safeSet(LS_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    safeSet(LS_KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    if (currentUser) {
      safeSet(LS_KEYS.USER, currentUser);
    } else {
      safeRemove(LS_KEYS.USER);
    }
  }, [currentUser]);

  const showToast = useCallback(
    (message, type = 'success', duration = 3500) => {
      if (!message) return;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
        );
        setTimeout(
          () => setToasts((prev) => prev.filter((t) => t.id !== id)),
          400
        );
      }, duration);
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      400
    );
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res?.success) {
        setCurrentUser(res.data);
        setIsLoggedIn(true);
      }
    } catch (err) {
      safeRemove(LS_KEYS.TOKEN);
      safeRemove(LS_KEYS.USER);
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res?.success) {
        localStorage.setItem(LS_KEYS.TOKEN, res.data.token);
        safeSet(LS_KEYS.USER, res.data.user);
        setCurrentUser(res.data.user);
        setIsLoggedIn(true);
        showToast(`Кош келиңиз, ${res.data.user.name}!`, 'success');
        // Кийинки жүктөөлөр (await эмес, фондо)
        loadCart();
        loadFavorites();
        loadOrders();
        return { success: true };
      }
      return { success: false, error: 'Кирүү ийгиликсиз' };
    } catch (err) {
      showToast(err.message || 'Кирүү катасы', 'error');
      return { success: false, error: err.message || 'Кирүү катасы' };
    }
  };

  const register = async (name, email, password, role = 'buyer') => {
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res?.success) {
        localStorage.setItem(LS_KEYS.TOKEN, res.data.token);
        safeSet(LS_KEYS.USER, res.data.user);
        setCurrentUser(res.data.user);
        setIsLoggedIn(true);
        showToast(
          `Каттоо ийгиликтүү! Кош келиңиз, ${res.data.user.name}!`,
          'success'
        );
        return { success: true };
      }
      return { success: false, error: 'Каттоо ийгиликсиз' };
    } catch (err) {
      showToast(err.message || 'Каттоо катасы', 'error');
      return { success: false, error: err.message || 'Каттоо катасы' };
    }
  };

  const logout = useCallback(() => {
    safeRemove(LS_KEYS.TOKEN);
    safeRemove(LS_KEYS.USER);
    safeRemove(LS_KEYS.CART);
    safeRemove(LS_KEYS.FAVORITES);
    safeRemove(LS_KEYS.FILTERS);
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    showToast('Чыктыңыз', 'info');
  }, [showToast]);

  /* ====== PRODUCTS ====== */
  const loadProducts = useCallback(
    async (params = {}) => {
      setLoading((prev) => ({ ...prev, products: true }));
      try {
        const res = await productApi.getAll(params);
        // ✅ API ар кандай форматта кайтарышы мүмкүн — массивке айландырабыз
        if (res?.success) {
          const list = toArray(res.data);
          setProducts(list);
        } else {
          setProducts([]);
        }
        return res;
      } catch (err) {
        console.error('Products load error:', err);
        showToast(err.message || 'Товарлар жүктөлбөдү', 'error');
        setProducts([]);
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    },
    [showToast]
  );

  /* ====== CATEGORIES ====== */
  const loadCategories = useCallback(async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await categoryApi.getAll();
      if (res?.success) {
        const list = toArray(res.data);
        setCategories(list);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Categories load error:', err);
      setCategories([]);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  }, []);

  /* ====== INITIAL LOAD ====== */
  useEffect(() => {
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    if (token) {
      loadUser();
    }
    loadProducts();
    loadCategories();
  }, [loadUser, loadProducts, loadCategories]);

  /* ====== CART ====== */
  const loadCart = useCallback(async () => {
    if (!localStorage.getItem(LS_KEYS.TOKEN)) return;
    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      const res = await cartApi.get();
      if (res?.success) {
        const items = toArray(res.data?.items || res.data);
        if (items.length > 0) setCart(items);
      }
    } catch (err) {
      console.error('Cart load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  }, []);

  const addToCart = useCallback(
    async (product, isWholesale = false) => {
      if (!product) return;
      const productId = product.id || product._id;
      if (!productId) return;

      // ✅ LocalStorage'га кошуу
      setCart((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const existingIndex = list.findIndex(
          (item) =>
            (item.id || item._id) === productId &&
            item.isWholesale === isWholesale
        );

        if (existingIndex >= 0) {
          const updated = [...list];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1,
          };
          return updated;
        }

        return [
          ...list,
          {
            id: productId,
            _id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            isWholesale,
          },
        ];
      });

      showToast(`${product.name} себетке кошулду`, 'success');

      // ✅ Эгер кирген болсо — серверге синхрондойбуз
      if (isLoggedIn) {
        try {
          const res = await cartApi.add(productId, 1, isWholesale);
          if (res?.success && res.data?.items) {
            setCart(toArray(res.data.items));
          }
        } catch (err) {
          console.warn('Server cart sync failed:', err.message);
        }
      }
    },
    [isLoggedIn, showToast]
  );

  const removeFromCart = useCallback(
    async (itemId, isWholesale) => {
      setCart((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.filter((item) => {
          const id = item.id || item._id;
          if (isWholesale !== undefined) {
            return !(id === itemId && item.isWholesale === isWholesale);
          }
          return id !== itemId;
        });
      });
      showToast('Корзинадан өчүрүлдү', 'info');

      if (isLoggedIn) {
        try {
          await cartApi.remove(itemId);
        } catch (err) {
          console.warn('Server remove failed:', err.message);
        }
      }
    },
    [isLoggedIn, showToast]
  );

  const changeQuantity = useCallback(
    async (itemId, isWholesale, delta) => {
      setCart((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list
          .map((item) => {
            const id = item.id || item._id;
            if (id === itemId && item.isWholesale === isWholesale) {
              const newQty = (item.quantity || 1) + delta;
              if (newQty < 1) return null;
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter(Boolean);
      });

      if (isLoggedIn) {
        try {
          const item = (cart || []).find(
            (i) =>
              (i.id || i._id) === itemId &&
              i.isWholesale === isWholesale
          );
          if (item) {
            await cartApi.update(itemId, (item.quantity || 1) + delta);
          }
        } catch (err) {
          console.warn('Server update failed:', err.message);
        }
      }
    },
    [isLoggedIn, cart]
  );

  const clearCart = useCallback(async () => {
    setCart([]);
    safeRemove(LS_KEYS.CART);
    showToast('Корзина тазаланды', 'info');

    if (isLoggedIn) {
      try {
        await cartApi.clear();
      } catch (err) {
        console.warn('Server clear failed:', err.message);
      }
    }
  }, [isLoggedIn, showToast]);

  /* ====== FAVORITES ====== */
  const loadFavorites = useCallback(async () => {
    if (!localStorage.getItem(LS_KEYS.TOKEN)) return;
    setLoading((prev) => ({ ...prev, favorites: true }));
    try {
      const res = await favoriteApi.getAll();
      if (res?.success) {
        const list = toArray(res.data);
        if (list.length > 0) setFavorites(list);
      }
    } catch (err) {
      console.error('Favorites load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, favorites: false }));
    }
  }, []);

  const toggleFavorite = useCallback(
    async (product) => {
      if (!product) return;
      const productId = product.id || product._id;
      if (!productId) return;

      setFavorites((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        const exists = list.some((f) => (f._id || f.id) === productId);
        if (exists) {
          showToast('Тандалмалардан алынды', 'info');
          return list.filter((f) => (f._id || f.id) !== productId);
        }
        showToast('Тандалмаларга кошулду', 'success');
        return [...list, product];
      });

      if (isLoggedIn) {
        try {
          await favoriteApi.toggle(productId);
        } catch (err) {
          console.warn('Server favorite toggle failed:', err.message);
        }
      }
    },
    [isLoggedIn, showToast]
  );

  const isFavorite = useCallback(
    (productId) =>
      (favorites || []).some((f) => (f._id || f.id) === productId),
    [favorites]
  );

  /* ====== ORDERS ====== */
  const loadOrders = useCallback(async () => {
    if (!localStorage.getItem(LS_KEYS.TOKEN)) return;
    setLoading((prev) => ({ ...prev, orders: true }));
    try {
      const res = await orderApi.getMy({ limit: 50 });
      if (res?.success) {
        setOrders(toArray(res.data));
      }
    } catch (err) {
      console.error('Orders load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  }, []);

  const createOrder = useCallback(
    async (orderData) => {
      try {
        const res = await orderApi.create(orderData);
        if (res?.success) {
          setCart([]);
          safeRemove(LS_KEYS.CART);
          await loadOrders();
          showToast('Буйрутма ийгиликтүү кабыл алынды!', 'success');
          return { success: true, order: res.data };
        }
        return { success: false, error: 'Буйрутма ийгиликсиз' };
      } catch (err) {
        showToast(err.message || 'Буйрутма катасы', 'error');
        return { success: false, error: err.message || 'Буйрутма катасы' };
      }
    },
    [loadOrders, showToast]
  );

  /* ====== COMPUTED ====== */
  const cartCount = useMemo(
    () =>
      (cart || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      (cart || []).reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      ),
    [cart]
  );

  const isSeller = useMemo(() => currentUser?.role === 'seller', [currentUser]);
  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  /* ====== CONTEXT VALUE ====== */
  const value = {
    // Products
    products,
    loading,
    loadProducts,
    // Categories
    categories,
    loadCategories,
    // Auth
    currentUser,
    isLoggedIn,
    isSeller,
    isAdmin,
    login,
    register,
    logout,
    loadUser,
    // Cart
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    loadCart,
    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    // Orders
    orders,
    createOrder,
    loadOrders,
    // Toasts
    toasts,
    showToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authApi, productApi, categoryApi, cartApi, orderApi, favoriteApi } from '../api';

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

export const AppProvider = ({ children }) => {
  /* ====== STATE (LocalStorage'дан баштапкы маанилерди алат) ====== */
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(() => safeGet(LS_KEYS.CART, []));
  const [favorites, setFavorites] = useState(() => safeGet(LS_KEYS.FAVORITES, []));
  const [orders, setOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => safeGet(LS_KEYS.USER, null));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem(LS_KEYS.TOKEN));
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState({
    products: false,
    categories: false,
    cart: false,
    favorites: false,
    orders: false,
  });

  /* ====== LOCALSTORAGE SYNC ====== */
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

  /* ====== TOASTS ====== */
  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 400);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 400);
  }, []);

  /* ====== INITIAL LOAD ====== */
  useEffect(() => {
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    if (token) {
      loadUser();
    }
    loadProducts();
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ====== AUTH ====== */
  const loadUser = async () => {
    try {
      const res = await authApi.getMe();
      if (res.success) {
        setCurrentUser(res.data);
        setIsLoggedIn(true);
        loadCart();
        loadFavorites();
        loadOrders();
      }
    } catch (err) {
      safeRemove(LS_KEYS.TOKEN);
      safeRemove(LS_KEYS.USER);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        localStorage.setItem(LS_KEYS.TOKEN, res.data.token);
        safeSet(LS_KEYS.USER, res.data.user);
        setCurrentUser(res.data.user);
        setIsLoggedIn(true);
        showToast(`Кош келиңиз, ${res.data.user.name}!`, 'success');
        loadCart();
        loadFavorites();
        loadOrders();
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, role = 'buyer') => {
    try {
      const res = await authApi.register({ name, email, password, role });
      if (res.success) {
        localStorage.setItem(LS_KEYS.TOKEN, res.data.token);
        safeSet(LS_KEYS.USER, res.data.user);
        setCurrentUser(res.data.user);
        setIsLoggedIn(true);
        showToast(`Каттоо ийгиликтүү! Кош келиңиз, ${res.data.user.name}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
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
  const loadProducts = async (params = {}) => {
    setLoading((prev) => ({ ...prev, products: true }));
    try {
      const res = await productApi.getAll(params);
      if (res.success) setProducts(res.data);
      return res;
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  /* ====== CATEGORIES ====== */
  const loadCategories = async () => {
    setLoading((prev) => ({ ...prev, categories: true }));
    try {
      const res = await categoryApi.getAll();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error('Categories load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, categories: false }));
    }
  };

  /* ====== CART (LocalStorage менен) ====== */
  const loadCart = async () => {
    if (!localStorage.getItem(LS_KEYS.TOKEN)) return;
    setLoading((prev) => ({ ...prev, cart: true }));
    try {
      const res = await cartApi.get();
      if (res.success && res.data?.items?.length > 0) {
        setCart(res.data.items);
      }
      // Эгер серверде бош болсо — LocalStorage'дагы калат
    } catch (err) {
      console.error('Cart load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  const addToCart = async (product, isWholesale = false) => {
    const productId = product.id || product._id;

    // ✅ Ар дайым LocalStorage'га кошобуз (guest колдонуучу үчүн да)
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id || item._id) === productId && item.isWholesale === isWholesale
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      return [
        ...prev,
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

    // ✅ Эгер кирген болсо — серверге да жөнөтөбүз
    if (isLoggedIn) {
      try {
        const res = await cartApi.add(productId, 1, isWholesale);
        if (res.success && res.data?.items) {
          setCart(res.data.items);
        }
      } catch (err) {
        console.warn('Server cart sync failed:', err.message);
      }
    }
  };

  const removeFromCart = async (itemId, isWholesale) => {
    // ✅ LocalStorage'дан өчүрүү
    setCart((prev) =>
      prev.filter((item) => {
        const id = item.id || item._id;
        if (isWholesale !== undefined) {
          return !(id === itemId && item.isWholesale === isWholesale);
        }
        return id !== itemId;
      })
    );
    showToast('Корзинадан өчүрүлдү', 'info');

    // ✅ Серверден өчүрүү
    if (isLoggedIn) {
      try {
        await cartApi.remove(itemId);
      } catch (err) {
        console.warn('Server remove failed:', err.message);
      }
    }
  };

  const changeQuantity = async (itemId, isWholesale, delta) => {
    // ✅ LocalStorage'да өзгөртүү
    setCart((prev) =>
      prev
        .map((item) => {
          const id = item.id || item._id;
          if (id === itemId && item.isWholesale === isWholesale) {
            const newQty = item.quantity + delta;
            if (newQty < 1) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean)
    );

    // ✅ Серверде өзгөртүү
    if (isLoggedIn) {
      try {
        const item = cart.find(
          (i) => (i.id || i._id) === itemId && i.isWholesale === isWholesale
        );
        if (item) {
          await cartApi.update(itemId, item.quantity + delta);
        }
      } catch (err) {
        console.warn('Server update failed:', err.message);
      }
    }
  };

  const clearCart = async () => {
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
  };

  /* ====== FAVORITES (LocalStorage менен) ====== */
  const loadFavorites = async () => {
    if (!localStorage.getItem(LS_KEYS.TOKEN)) return;
    setLoading((prev) => ({ ...prev, favorites: true }));
    try {
      const res = await favoriteApi.getAll();
      if (res.success && res.data?.length > 0) {
        setFavorites(res.data);
      }
    } catch (err) {
      console.error('Favorites load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, favorites: false }));
    }
  };

  const toggleFavorite = async (product) => {
    const productId = product.id || product._id;

    // ✅ LocalStorage'да toggle
    setFavorites((prev) => {
      const exists = prev.some((f) => (f._id || f.id) === productId);
      if (exists) {
        showToast('Тандалмалардан алынды', 'info');
        return prev.filter((f) => (f._id || f.id) !== productId);
      } else {
        showToast('Тандалмаларга кошулду', 'success');
        return [...prev, product];
      }
    });

    // ✅ Серверде toggle
    if (isLoggedIn) {
      try {
        await favoriteApi.toggle(productId);
      } catch (err) {
        console.warn('Server favorite toggle failed:', err.message);
      }
    }
  };

  const isFavorite = (productId) =>
    favorites.some((f) => (f._id || f.id) === productId);

  /* ====== ORDERS (LocalStorage'га сакталат OrderContext'те) ====== */
  const loadOrders = async () => {
    if (!localStorage.getItem(LS_KEYS.TOKEN)) return;
    setLoading((prev) => ({ ...prev, orders: true }));
    try {
      const res = await orderApi.getMy({ limit: 50 });
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error('Orders load error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  const createOrder = async (orderData) => {
    try {
      const res = await orderApi.create(orderData);
      if (res.success) {
        setCart([]);
        safeRemove(LS_KEYS.CART);
        await loadOrders();
        showToast('Буйрутма ийгиликтүү кабыл алынды!', 'success');
        return { success: true, order: res.data };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, error: err.message };
    }
  };

  /* ====== COMPUTED ====== */
  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
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

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('nooruz_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setCurrentUser(u);
      } catch (e) { localStorage.removeItem('nooruz_user'); }
    }
    const savedCart = localStorage.getItem('nooruz_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nooruz_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const addToCart = (product, isWholesale = false) => {
    const price = isWholesale ? product.wholesalePrice : product.price;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.isWholesale === isWholesale);
      if (existing) {
        return prev.map((i) => i.id === product.id && i.isWholesale === isWholesale ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price, quantity: 1, isWholesale, image: product.image }];
    });
    showToast(`${product.name} себетке кошулду`);
  };

  const removeFromCart = (id, isWholesale) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.isWholesale === isWholesale)));
  };

  const changeQuantity = (id, isWholesale, delta) => {
    setCart((prev) => prev
      .map((i) => i.id === id && i.isWholesale === isWholesale ? { ...i, quantity: i.quantity + delta } : i)
      .filter((i) => i.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const login = (email, name, role) => {
    const user = { email, name, role };
    setIsLoggedIn(true);
    setCurrentUser(user);
    localStorage.setItem('nooruz_user', JSON.stringify(user));
    showToast(`Салам, ${name}!`);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('nooruz_user');
    showToast('Чыктыңыз');
  };

  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);
  const cartTotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  return (
    <AppContext.Provider value={{
      cart, cartCount, cartTotal, addToCart, removeFromCart, changeQuantity, clearCart,
      isLoggedIn, currentUser, login, logout, toasts, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
};
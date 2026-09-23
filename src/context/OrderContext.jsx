import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

/* ====== LOCALSTORAGE KEY ====== */
const LS_ORDERS_KEY = 'nooruz_orders';

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
    console.warn('localStorage orders set error:', err);
  }
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  // ✅ LocalStorage'дан буйрутмаларды жүктөө
  const [orders, setOrders] = useState(() => safeGet(LS_ORDERS_KEY, []));
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ====== LOCALSTORAGE SYNC ====== */
  useEffect(() => {
    safeSet(LS_ORDERS_KEY, orders);
  }, [orders]);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  const placeOrder = async (orderData) => {
    setIsSubmitting(true);
    try {
      // Backend'ке жөнөтүү (келечекте fetch менен алмаштырасыз)
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newOrder = {
        id: `ORD-${Date.now()}`,
        ...orderData,
        status: 'Кабыл алынды',
        createdAt: new Date().toLocaleString('ky-KG'),
      };

      setOrders((prev) => [newOrder, ...prev]);
      setIsSubmitting(false);
      return { success: true, order: newOrder };
    } catch (error) {
      setIsSubmitting(false);
      return { success: false, error: error.message };
    }
  };

  /* ====== ЖАҢЫ: Буйрутманы өчүрүү ====== */
  const removeOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  /* ====== ЖАҢЫ: Баарын тазалоо ====== */
  const clearOrders = () => {
    setOrders([]);
    try {
      localStorage.removeItem(LS_ORDERS_KEY);
    } catch {}
  };

  return (
    <OrderContext.Provider
      value={{
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        orders,
        placeOrder,
        isSubmitting,
        removeOrder,
        clearOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
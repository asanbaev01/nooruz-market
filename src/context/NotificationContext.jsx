import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

const LS_KEY = 'nooruz_notifications';

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
    console.warn('Notification save error:', err);
  }
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => safeGet(LS_KEY, []));

  useEffect(() => {
    safeSet(LS_KEY, notifications);
  }, [notifications]);

  /* Уникалдуу ID */
  const genId = () => `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  /* ====== БИЛДИРҮҮ КОШУУ ====== */
  const addNotification = ({ type = 'info', title, message, icon = '🔔', orderId = null }) => {
    const newNotif = {
      id: genId(),
      type,
      title,
      message,
      icon,
      orderId,
      read: false,
      createdAt: new Date().toISOString(),
      createdAtFormatted: new Date().toLocaleString('ky-KG', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 50));
    return newNotif;
  };

  /* ====== ОКУУ ====== */
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  /* ====== ӨЧҮРҮҮ ====== */
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  /* ====== ОКУЛБАГАНДАРДЫН САНЫ ====== */
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect } from 'react';

const LoyaltyContext = createContext();
export const useLoyalty = () => useContext(LoyaltyContext);

/* ====== LOCALSTORAGE KEY ====== */
const LS_POINTS_KEY = 'nooruz_loyalty_points';
const LS_HISTORY_KEY = 'nooruz_loyalty_history';

/* ====== БААЛАР ====== */
export const LOYALTY_RULES = {
  EARN_RATE: 0.05,        // Ар бир 100 сомго 5 упай (5%)
  POINT_VALUE: 1,         // 1 упай = 1 сом
  MIN_REDEEM: 100,        // Минимум 100 упай колдонуу
  MAX_REDEEM_PERCENT: 50, // Максимум 50% буйрутмадан
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
    console.warn('Loyalty save error:', err);
  }
};

export const LoyaltyProvider = ({ children }) => {
  const [points, setPoints] = useState(() => safeGet(LS_POINTS_KEY, 0));
  const [history, setHistory] = useState(() => safeGet(LS_HISTORY_KEY, []));

  useEffect(() => {
    safeSet(LS_POINTS_KEY, points);
  }, [points]);

  useEffect(() => {
    safeSet(LS_HISTORY_KEY, history);
  }, [history]);

  /* ====== УПАЙ ЭСЕПТӨӨ (буйрутмадан) ====== */
  const calculateEarnedPoints = (orderTotal) => {
    return Math.floor(orderTotal * LOYALTY_RULES.EARN_RATE);
  };

  /* ====== УПАЙ КОШУУ (буйрутма бергенде) ====== */
  const earnPoints = (orderTotal, orderId) => {
    const earned = calculateEarnedPoints(orderTotal);
    if (earned <= 0) return 0;

    setPoints((prev) => prev + earned);

    const entry = {
      id: `HIST-${Date.now()}`,
      type: 'earn',
      amount: earned,
      description: `Буйрутма №${orderId} үчүн`,
      date: new Date().toLocaleString('ky-KG'),
      timestamp: Date.now(),
    };

    setHistory((prev) => [entry, ...prev].slice(0, 50));

    return earned;
  };

  /* ====== УПАЙ ЖУМШОО ====== */
  const redeemPoints = (amount, orderId) => {
    if (amount < LOYALTY_RULES.MIN_REDEEM) return false;
    if (amount > points) return false;

    setPoints((prev) => prev - amount);

    const entry = {
      id: `HIST-${Date.now()}`,
      type: 'redeem',
      amount: -amount,
      description: `Буйрутма №${orderId} үчүн арзандатуу`,
      date: new Date().toLocaleString('ky-KG'),
      timestamp: Date.now(),
    };

    setHistory((prev) => [entry, ...prev].slice(0, 50));

    return true;
  };

  /* ====== ЖЕТКИЛИКТҮҮ УПАЙ ЭСЕПТӨӨ ====== */
  const getMaxRedeemable = (orderTotal) => {
    const maxPercent = Math.floor(orderTotal * (LOYALTY_RULES.MAX_REDEEM_PERCENT / 100));
    return Math.min(points, maxPercent);
  };

  /* ====== ТАРЫХТЫ ТАЗАЛОО ====== */
  const clearHistory = () => {
    setHistory([]);
  };

  const value = {
    points,
    history,
    earnPoints,
    redeemPoints,
    calculateEarnedPoints,
    getMaxRedeemable,
    clearHistory,
    rules: LOYALTY_RULES,
  };

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>;
};
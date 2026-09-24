import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useApp } from './AppContext';

const CashbackContext = createContext();
export const useCashback = () => useContext(CashbackContext);

/* ====== КЭШБЭК ЭРЕЖЕЛЕРИ ====== */
export const CASHBACK_RULES = {
  EARN_RATE: 0.03,           // 3% ар бир буйрутмадан
  MIN_REDEEM: 50,            // Эң аз колдонуу 50 сом
  MAX_REDEEM_PERCENT: 30,    // Буйрутманын 30% га чейин
  WELCOME_BONUS: 100,        // Каттоодо 100 сом бонус
  REFERRAL_BONUS: 150,       // Дос чакырганда 150 сом
  FRIEND_DISCOUNT: 100,      // Дос болгондо 100 сом арзандатуу
  EXPIRY_DAYS: 365,          // 1 жыл жарактуу
};

/* ====== LOCALSTORAGE ====== */
const LS_KEYS = {
  BALANCE: 'nooruz_cashback_balance',
  HISTORY: 'nooruz_cashback_history',
};

const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch { return fallback; }
};

const safeSet = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

/* ====== FORMAT ====== */
const formatDate = () => {
  const now = new Date();
  return `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
};

export const CashbackProvider = ({ children }) => {
  const { currentUser, isLoggedIn, showToast } = useApp();

  const [balance, setBalance] = useState(() => safeGet(LS_KEYS.BALANCE, 0));
  const [history, setHistory] = useState(() => safeGet(LS_KEYS.HISTORY, []));

  /* ====== LOCALSTORAGE SYNC ====== */
  useEffect(() => {
    safeSet(LS_KEYS.BALANCE, balance);
  }, [balance]);

  useEffect(() => {
    safeSet(LS_KEYS.HISTORY, history);
  }, [history]);

  /* ====== КАТТООДО КОШ КЕЛҮҮ БОНУСУ ====== */
  useEffect(() => {
    if (isLoggedIn && currentUser && history.length === 0 && balance === 0) {
      const welcome = CASHBACK_RULES.WELCOME_BONUS;
      setBalance(welcome);
      setHistory([{
        id: `cb-${Date.now()}`,
        type: 'earn',
        amount: welcome,
        description: '🎁 Кош келиңиз бонусу',
        date: formatDate(),
      }]);
      showToast(`🎁 Кош келиңиз! Сизге ${welcome} сом кэшбэк берилди!`, 'success', 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, currentUser]);

  /* ====== КЭШБЭК КОШУУ (буйрутмадан) ====== */
  const earnCashback = useCallback((orderTotal, orderId) => {
    const earned = Math.floor(orderTotal * CASHBACK_RULES.EARN_RATE);
    if (earned <= 0) return 0;

    setBalance((prev) => prev + earned);
    setHistory((prev) => [
      {
        id: `cb-${Date.now()}`,
        type: 'earn',
        amount: earned,
        description: `🛒 Буйрутма №${orderId?.split('-')[1] || orderId} — ${CASHBACK_RULES.EARN_RATE * 100}% кэшбэк`,
        date: formatDate(),
        orderId,
      },
      ...prev,
    ].slice(0, 100));

    return earned;
  }, []);

  /* ====== КЭШБЭК КОЛДОНУУ ====== */
  const redeemCashback = useCallback((amount, orderId) => {
    if (amount < CASHBACK_RULES.MIN_REDEEM) {
      showToast(`Эң аз ${CASHBACK_RULES.MIN_REDEEM} сом колдонууга болот`, 'error');
      return false;
    }

    if (amount > balance) {
      showToast('Балансыңызда жетишсиз каражат', 'error');
      return false;
    }

    setBalance((prev) => prev - amount);
    setHistory((prev) => [
      {
        id: `cb-${Date.now()}`,
        type: 'spend',
        amount: -amount,
        description: `💳 Буйрутма №${orderId?.split('-')[1] || orderId} үчүн колдонулду`,
        date: formatDate(),
        orderId,
      },
      ...prev,
    ].slice(0, 100));

    return true;
  }, [balance, showToast]);

  /* ====== БОНУС КОШУУ (реферал үчүн) ====== */
  const addBonus = useCallback((amount, description) => {
    if (amount <= 0) return;
    setBalance((prev) => prev + amount);
    setHistory((prev) => [
      {
        id: `cb-${Date.now()}`,
        type: 'earn',
        amount,
        description,
        date: formatDate(),
      },
      ...prev,
    ].slice(0, 100));
  }, []);

  /* ====== ЭҢ КӨП КОЛДОНУУ ====== */
  const getMaxRedeemable = useCallback((orderTotal) => {
    const maxByPercent = Math.floor(orderTotal * (CASHBACK_RULES.MAX_REDEEM_PERCENT / 100));
    return Math.min(balance, maxByPercent);
  }, [balance]);

  /* ====== БАЛАНСТЫ ТАЗАЛОО ====== */
  const resetCashback = useCallback(() => {
    setBalance(0);
    setHistory([]);
    safeSet(LS_KEYS.BALANCE, 0);
    safeSet(LS_KEYS.HISTORY, []);
  }, []);

  /* ====== COMPUTED ====== */
  const totalEarned = useMemo(
    () => history.filter((h) => h.type === 'earn').reduce((s, h) => s + h.amount, 0),
    [history]
  );

  const totalSpent = useMemo(
    () => Math.abs(history.filter((h) => h.type === 'spend').reduce((s, h) => s + h.amount, 0)),
    [history]
  );

  const value = {
    balance,
    history,
    totalEarned,
    totalSpent,
    earnCashback,
    redeemCashback,
    addBonus,
    getMaxRedeemable,
    resetCashback,
    rules: CASHBACK_RULES,
  };

  return <CashbackContext.Provider value={value}>{children}</CashbackContext.Provider>;
};
import React, { createContext, useContext, useState, useEffect } from 'react';

const ReferralContext = createContext();
export const useReferral = () => useContext(ReferralContext);

/* ====== LOCALSTORAGE KEY ====== */
const LS_CODE_KEY = 'nooruz_referral_code';
const LS_FRIENDS_KEY = 'nooruz_referral_friends';
const LS_BONUS_KEY = 'nooruz_referral_bonus';

/* ====== БОНУС ПРАВИЛОЛОРУ ====== */
export const REFERRAL_RULES = {
  BONUS_PER_FRIEND: 100,   // Ар бир дос үчүн 100 сом
  FRIEND_DISCOUNT: 50,     // Дос 50 сом арзандатуу
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
    console.warn('Referral save error:', err);
  }
};

/* ====== РЕФЕРАЛ КОД ЖАСОО ====== */
const generateCode = (name) => {
  const clean = (name || 'USER').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${clean}${random}`;
};

export const ReferralProvider = ({ children }) => {
  const [myCode, setMyCode] = useState(() => safeGet(LS_CODE_KEY, null));
  const [friends, setFriends] = useState(() => safeGet(LS_FRIENDS_KEY, []));
  const [bonusBalance, setBonusBalance] = useState(() => safeGet(LS_BONUS_KEY, 0));

  useEffect(() => {
    safeSet(LS_CODE_KEY, myCode);
  }, [myCode]);

  useEffect(() => {
    safeSet(LS_FRIENDS_KEY, friends);
  }, [friends]);

  useEffect(() => {
    safeSet(LS_BONUS_KEY, bonusBalance);
  }, [bonusBalance]);

  /* ====== ЖЕКЕ КОД ТҮЗҮҮ ====== */
  const generateMyCode = (userName) => {
    if (myCode) return myCode;
    const code = generateCode(userName);
    setMyCode(code);
    return code;
  };

  /* ====== РЕФЕРАЛ ШИЛТЕМЕ ====== */
  const getReferralLink = () => {
    if (!myCode) return '';
    return `${window.location.origin}?ref=${myCode}`;
  };

  /* ====== ДОС КОШУУ (дос реферал кодду колдонгондо) ====== */
  const addFriend = (friendName, friendEmail) => {
    const friend = {
      id: `FR-${Date.now()}`,
      name: friendName || 'Дос',
      email: friendEmail || '',
      date: new Date().toLocaleDateString('ky-KG'),
      bonus: REFERRAL_RULES.BONUS_PER_FRIEND,
      status: 'active',
    };

    setFriends((prev) => [friend, ...prev]);
    setBonusBalance((prev) => prev + REFERRAL_RULES.BONUS_PER_FRIEND);

    return friend;
  };

  /* ====== БОНУС ЖУМШОО ====== */
  const redeemBonus = (amount) => {
    if (amount > bonusBalance) return false;
    setBonusBalance((prev) => prev - amount);
    return true;
  };

  /* ====== ТАРЫХТЫ ТАЗАЛОО ====== */
  const clearFriends = () => {
    setFriends([]);
    setBonusBalance(0);
  };

  const value = {
    myCode,
    friends,
    bonusBalance,
    generateMyCode,
    getReferralLink,
    addFriend,
    redeemBonus,
    clearFriends,
    rules: REFERRAL_RULES,
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};
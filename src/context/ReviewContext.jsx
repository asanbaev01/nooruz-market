import React, { createContext, useState, useContext, useEffect } from 'react';

const ReviewContext = createContext();
export const useReview = () => useContext(ReviewContext);

/* ====== LOCALSTORAGE KEY ====== */
const LS_REVIEWS_KEY = 'nooruz_reviews';

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
    console.warn('localStorage reviews set error:', err);
  }
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => safeGet(LS_REVIEWS_KEY, []));

  /* ====== LOCALSTORAGE SYNC ====== */
  useEffect(() => {
    safeSet(LS_REVIEWS_KEY, reviews);
  }, [reviews]);

  /* ====== ЖАҢЫ ПИКИР КОШУУ ====== */
  const addReview = (productId, reviewData) => {
    const newReview = {
      id: `REV-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: productId,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString(),
      createdAtFormatted: new Date().toLocaleString('ky-KG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      likes: 0,
      helpful: 0,
    };

    setReviews((prev) => [newReview, ...prev]);
    return { success: true, review: newReview };
  };

  /* ====== ПИКИРДИ ӨЧҮРҮҮ ====== */
  const removeReview = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  /* ====== БИР ТОВАРДЫН ПИКИРЛЕРИН АЛУУ ====== */
  const getProductReviews = (productId) => {
    return reviews
      .filter((r) => String(r.productId) === String(productId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  /* ====== ОРТОЧО РЕЙТИНГ ====== */
  const getAverageRating = (productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10; // 4.7 форматында
  };

  /* ====== ПИКИРЛЕРДИН САНЫ ====== */
  const getReviewCount = (productId) => {
    return getProductReviews(productId).length;
  };

  /* ====== РЕЙТИНГ БӨЛҮШТҮРҮҮ ====== */
  const getRatingDistribution = (productId) => {
    const productReviews = getProductReviews(productId);
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach((r) => {
      if (dist[r.rating] !== undefined) dist[r.rating]++;
    });
    return dist;
  };

  const value = {
    reviews,
    addReview,
    removeReview,
    getProductReviews,
    getAverageRating,
    getReviewCount,
    getRatingDistribution,
  };

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
};
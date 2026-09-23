import React, { useState, useMemo } from 'react';
import {
  FiStar,
  FiUser,
  FiSend,
  FiThumbsUp,
  FiTrash2,
  FiMessageSquare,
  FiCheckCircle,
} from 'react-icons/fi';
import { useReview } from '../context/ReviewContext';
import { useApp } from '../context/AppContext';

const ProductReviews = ({ productId }) => {
  const { currentUser, isLoggedIn, showToast } = useApp();
  const {
    addReview,
    removeReview,
    getProductReviews,
    getAverageRating,
    getReviewCount,
    getRatingDistribution,
  } = useReview();

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const reviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  const reviewCount = getReviewCount(productId);
  const distribution = getRatingDistribution(productId);

  /* ====== СОРТТОО ====== */
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [reviews, sortBy]);

  /* ====== ПИКИР ЖӨНӨТҮҮ ====== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showToast('Пикир жазуу үчүн кириңиз', 'warning');
      return;
    }

    if (rating === 0) {
      showToast('Жылдызды тандаңыз', 'warning');
      return;
    }

    if (!comment.trim()) {
      showToast('Пикириңизди жазыңыз', 'warning');
      return;
    }

    if (comment.trim().length < 5) {
      showToast('Пикир кеминде 5 белгиден турушу керек', 'warning');
      return;
    }

    addReview(productId, {
      userName: currentUser?.name || 'Аноним',
      rating,
      comment: comment.trim(),
    });

    showToast('Рахмат! Пикириңиз кошулду 🌟', 'success');
    setRating(0);
    setHoverRating(0);
    setComment('');
    setShowForm(false);
  };

  /* ====== ЖЫЛДЫЗ КОМПОНЕНТИ ====== */
  const StarRating = ({ value, size = 'text-base', interactive = false }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={interactive ? 'cursor-pointer transition-transform hover:scale-125' : 'cursor-default'}
            aria-label={`${star} жылдыз`}
          >
            <FiStar
              className={`${size} transition-colors ${
                star <= (interactive ? hoverRating || rating : value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes reviewIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes formSlideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 600px; }
        }
        @keyframes starPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4) rotate(15deg); }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes ratingBarFill {
          from { width: 0; }
        }
        .review-item-anim {
          animation: reviewIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        .review-form-anim {
          animation: formSlideDown .4s ease-out both;
        }
        .star-pop {
          animation: starPop .4s cubic-bezier(.34,1.56,.64,1);
        }
        .rating-bar-fill {
          animation: ratingBarFill .8s ease-out both;
        }
        .review-input {
          transition: all .3s ease;
        }
        .review-input:focus {
          border-color: #10B981;
          box-shadow: 0 0 0 4px rgba(16,185,129,.12);
        }
        .review-submit-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .review-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px -10px rgba(16,185,129,.5);
        }
        .review-submit-btn:active:not(:disabled) {
          transform: scale(.97);
        }
        .review-submit-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .review-submit-btn:hover:not(:disabled) svg {
          transform: translateX(4px) rotate(-8deg);
        }
        .review-scroll::-webkit-scrollbar { width: 5px; }
        .review-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 3px;
        }
      `}</style>

      <div className="bg-gray-50 rounded-2xl p-5 mt-6">
        {/* ====== HEADER: Орточо рейтинг ====== */}
        <div className="flex items-center gap-2 mb-4">
          <FiMessageSquare className="text-emerald-600 text-lg" />
          <h3 className="font-bold text-lg text-gray-800">
            Пикирлер
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({reviewCount})
            </span>
          </h3>
        </div>

        {reviewCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 bg-white rounded-2xl p-4 border border-gray-100">
            {/* Орточо */}
            <div className="text-center sm:border-r border-gray-100">
              <div className="text-4xl font-bold text-gray-800">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center my-1">
                <StarRating value={averageRating} size="text-lg" />
              </div>
              <p className="text-xs text-gray-500">
                {reviewCount} пикирдин негизинде
              </p>
            </div>

            {/* Бөлүштүрүү */}
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const percent = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-600 font-medium">{star}</span>
                    <FiStar className="fill-yellow-400 text-yellow-400 text-xs" />
                    <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="rating-bar-fill h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 mb-4">
            <FiStar className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Азырынча пикир жок. Биринчи болуп жазыңыз!
            </p>
          </div>
        )}

        {/* ====== ЖАҢЫ ПИКИР БАСКЫЧЫ ====== */}
        {isLoggedIn && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="review-submit-btn w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-md mb-4 flex items-center justify-center gap-2"
          >
            <FiStar className="text-sm" />
            Пикир жазуу
          </button>
        )}

        {!isLoggedIn && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-xs text-yellow-700">
              💡 Пикир жазуу үчүн аккаунтуңузга кириңиз
            </p>
          </div>
        )}

        {/* ====== ПИКИР ЖАЗУУ ФОРМАСЫ ====== */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="review-form-anim bg-white rounded-2xl p-4 border-2 border-emerald-200 mb-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-sm text-gray-700">
                Баа бериңиз
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment('');
                }}
                className="text-gray-400 hover:text-red-500 text-xs font-medium"
              >
                Жокко чыгаруу
              </button>
            </div>

            {/* Жылдыздар */}
            <div className="flex justify-center mb-4">
              <div className={rating > 0 ? 'star-pop' : ''}>
                <StarRating
                  value={rating}
                  size="text-3xl"
                  interactive
                />
              </div>
            </div>

            {rating > 0 && (
              <p className="text-center text-xs text-emerald-600 font-semibold mb-3">
                {rating === 5 && '🔥 Мыкты!'}
                {rating === 4 && '😊 Жакшы'}
                {rating === 3 && '😐 Канааттандырарлык'}
                {rating === 2 && '😕 Начар'}
                {rating === 1 && '😞 Абдан начар'}
              </p>
            )}

            {/* Комментарий */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Товар жөнүндө ойлоруңузду жазыңыз..."
              rows="4"
              maxLength={500}
              className="review-input w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 outline-none text-sm resize-none mb-2"
            />
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] text-gray-400">
                {comment.length}/500
              </span>
            </div>

            {/* Жөнөтүү */}
            <button
              type="submit"
              disabled={rating === 0 || !comment.trim()}
              className="review-submit-btn w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiSend className="text-sm" />
              Пикирди жөнөтүү
            </button>
          </form>
        )}

        {/* ====== СОРТТОО ====== */}
        {reviewCount > 1 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {[
              { id: 'recent', label: '🕐 Жаңы' },
              { id: 'highest', label: '⭐ Жогорку' },
              { id: 'lowest', label: '⬇️ Төмөнкү' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  sortBy === opt.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* ====== ПИКИРЛЕР ТИЗМЕСИ ====== */}
        <div className="review-scroll space-y-3 max-h-96 overflow-y-auto">
          {sortedReviews.map((review, i) => (
            <div
              key={review.id}
              className="review-item-anim bg-white rounded-2xl p-4 border border-gray-100"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-2">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 font-bold text-sm">
                  {review.userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-gray-800 truncate">
                      {review.userName}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-semibold">
                      <FiCheckCircle className="text-[10px]" />
                      Текшерилген
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating value={review.rating} size="text-xs" />
                    <span className="text-[10px] text-gray-400">
                      {review.createdAtFormatted}
                    </span>
                  </div>
                </div>

                {/* Өчүрүү (эгер өзүнүн пикири болсо) */}
                {currentUser?.name === review.userName && (
                  <button
                    onClick={() => {
                      removeReview(review.id);
                      showToast('Пикир өчүрүлдү', 'info');
                    }}
                    className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                    aria-label="Өчүрүү"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-700 leading-relaxed pl-13">
                {review.comment}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3 mt-3 pl-13">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors">
                  <FiThumbsUp className="text-sm" />
                  Пайдалуу
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductReviews;
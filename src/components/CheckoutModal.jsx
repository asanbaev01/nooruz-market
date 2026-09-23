import React, { useState, useEffect } from 'react';
import {
  FiX, FiUser, FiPhone, FiMapPin, FiCreditCard, FiDollarSign,
  FiCheckCircle, FiShoppingBag, FiMessageSquare, FiTag, FiCheck,
  FiAlertCircle, FiGift, FiAward,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { useOrder } from '../context/OrderContext';
import { useLoyalty, LOYALTY_RULES } from '../context/LoyaltyContext';
import { useNotifications } from '../context/NotificationContext'; // ✅ ЖАҢЫ
import { validatePromoCode } from '../data/promoCodes';

const CheckoutModal = () => {
  const { cart, cartTotal, clearCart, showToast } = useApp();
  const { isCheckoutOpen, closeCheckout, placeOrder, isSubmitting } = useOrder();
  const { points, redeemPoints, getMaxRedeemable, calculateEarnedPoints } = useLoyalty();
  const { addNotification } = useNotifications(); // ✅ ЖАҢЫ

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cash',
    comment: '',
  });

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const [isSuccess, setIsSuccess] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [errors, setErrors] = useState({});

  const maxRedeemable = getMaxRedeemable(cartTotal);
  const pointsDiscount = usePoints ? pointsToUse : 0;
  const promoDiscount = appliedPromo?.discount || 0;

  const finalTotal = Math.max(0, cartTotal - promoDiscount - pointsDiscount);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isCheckoutOpen && !isSubmitting) {
        closeCheckout();
        setIsSuccess(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCheckoutOpen, isSubmitting, closeCheckout]);

  useEffect(() => {
    if (isCheckoutOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (isCheckoutOpen) {
      setIsSuccess(false);
      setErrors({});
      setPromoInput('');
      setAppliedPromo(null);
      setPromoError('');
      setUsePoints(false);
      setPointsToUse(0);
      setEarnedPoints(0);
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (pointsToUse > maxRedeemable) setPointsToUse(maxRedeemable);
  }, [maxRedeemable, pointsToUse]);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoLoading(true);
    setTimeout(() => {
      const result = validatePromoCode(promoInput, cartTotal);
      if (result.valid) {
        setAppliedPromo({
          code: result.promo.code,
          discount: result.discount,
          description: result.promo.description,
        });
        showToast(`🎉 Промокод колдонулду! -${result.discount.toLocaleString()} сом`, 'success');
        setPromoInput('');
      } else {
        setPromoError(result.error);
        setAppliedPromo(null);
      }
      setPromoLoading(false);
    }, 600);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
    showToast('Промокод өчүрүлдү', 'info');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Атыңызды жазыңыз';
    if (!formData.phone.trim()) newErrors.phone = 'Телефон номериңизди жазыңыз';
    else if (!/^[+]?[\d\s()-]{9,}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Туура телефон номерин жазыңыз';
    }
    if (!formData.address.trim()) newErrors.address = 'Дарек жазыңыз';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderId = `ORD-${Date.now()}`;

    const orderData = {
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      },
      items: cart.map((item) => ({
        id: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isWholesale: item.isWholesale,
        image: item.image,
      })),
      subtotal: cartTotal,
      promoDiscount,
      pointsDiscount,
      promoCode: appliedPromo?.code || null,
      pointsUsed: pointsDiscount,
      total: finalTotal,
      paymentMethod: formData.paymentMethod,
      comment: formData.comment.trim(),
    };

    const result = await placeOrder(orderData);

    if (result.success) {
      if (pointsDiscount > 0) {
        redeemPoints(pointsDiscount, orderId);
      }

      const earned = calculateEarnedPoints(finalTotal);
      setEarnedPoints(earned);

      /* ✅ БИЛДИРҮҮ КОШУУ */
      addNotification({
        type: 'order_created',
        title: '🛒 Буйрутма кабыл алынды',
        message: `Сиздин №${orderId.split('-')[1] || orderId} буйрутмаңыз ийгиликтүү кабыл алынды. Оператор жакын арада байланышат.`,
        orderId: orderId,
      });

      setIsSuccess(true);
      clearCart();
      showToast('Буйрутмаңыз ийгиликтүү кабыл алынды!', 'success');

      setTimeout(() => {
        setIsSuccess(false);
        closeCheckout();
        setFormData({
          name: '', phone: '', address: '',
          paymentMethod: 'cash', comment: '',
        });
        setAppliedPromo(null);
        setPromoInput('');
        setUsePoints(false);
        setPointsToUse(0);
      }, 3500);
    } else {
      showToast('Ката кетти, кайра аракет кылыңыз', 'error');
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    closeCheckout();
    setIsSuccess(false);
  };

  return (
    <>
      <style>{`
        @keyframes checkoutOverlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes checkoutModalIn {
          0% { opacity: 0; transform: translateY(40px) scale(.94); }
          60% { transform: translateY(-6px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes successPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.2) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes successTextIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pointsBounce {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes giftFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }
        .checkout-overlay-anim { animation: checkoutOverlayIn .35s ease-out both; }
        .checkout-modal-anim { animation: checkoutModalIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .success-icon-anim { animation: successPop .6s cubic-bezier(.34,1.56,.64,1) both; }
        .success-text-anim { animation: successTextIn .5s ease-out .2s both; }
        .points-bounce { animation: pointsBounce .6s cubic-bezier(.34,1.56,.64,1) both; }
        .gift-float { animation: giftFloat 2.5s ease-in-out infinite; }

        .checkout-field { transition: all .3s ease; }
        .checkout-field:focus {
          border-color: #10B981;
          box-shadow: 0 0 0 4px rgba(16,185,129,.12);
        }
        .payment-option {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .payment-option:hover { transform: translateY(-2px); border-color: #10B981; }
        .payment-option.selected {
          border-color: #10B981;
          background: #ECFDF5;
          box-shadow: 0 8px 20px -8px rgba(16,185,129,.4);
        }
        .checkout-submit-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .checkout-submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.5);
        }
        .checkout-submit-btn:active:not(:disabled) { transform: scale(.97); }
        .checkout-close-btn { transition: all .4s cubic-bezier(.34,1.56,.64,1); }
        .checkout-close-btn:hover { transform: rotate(90deg) scale(1.15); color: #ef4444; }
        .checkout-scroll::-webkit-scrollbar { width: 6px; }
        .checkout-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 3px;
        }
        @keyframes promoErrorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        @keyframes successPromoIn {
          0% { opacity: 0; transform: scale(.8); }
          60% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .promo-error-anim { animation: promoErrorShake .4s ease-in-out; }
        .promo-success-anim { animation: successPromoIn .5s cubic-bezier(.34,1.56,.64,1); }
        .promo-input:focus { border-color: #10B981; box-shadow: 0 0 0 4px rgba(16,185,129,.12); }
        .promo-btn { transition: all .35s cubic-bezier(.34,1.56,.64,1); }
        .promo-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px -8px rgba(16,185,129,.5); }
        .promo-btn:active:not(:disabled) { transform: scale(.97); }

        .points-toggle {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .points-toggle:hover { transform: translateY(-2px); }
        .points-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(to right, #10B981 0%, #10B981 50%, #e5e7eb 50%, #e5e7eb 100%);
          outline: none;
          cursor: pointer;
        }
        .points-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid #10B981;
          box-shadow: 0 4px 10px rgba(16,185,129,.4);
          cursor: pointer;
          transition: transform .2s ease;
        }
        .points-slider::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .points-slider::-moz-range-thumb {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: white;
          border: 3px solid #10B981;
          cursor: pointer;
        }
      `}</style>

      <div
        className="checkout-overlay-anim fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="checkout-modal-anim bg-white rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="success-icon-anim w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-2xl mb-6">
                <FiCheckCircle className="text-6xl" />
              </div>
              <h2 className="success-text-anim text-2xl font-bold text-gray-800 mb-3">
                Буйрутмаңыз кабыл алынды!
              </h2>
              <p className="success-text-anim text-gray-500 text-sm mb-2" style={{ animationDelay: '.3s' }}>
                Биздин оператор жакын арада сиз менен байланышат.
              </p>

              {earnedPoints > 0 && (
                <div className="points-bounce mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="gift-float w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-lg">
                      <FiGift className="text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-yellow-700 font-semibold">Сиз уттуңуз!</p>
                      <p className="text-lg font-bold text-yellow-800">
                        +{earnedPoints} упай
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="success-text-anim text-emerald-600 font-semibold text-sm mt-4" style={{ animationDelay: '.5s' }}>
                Рахмат, бизди тандаганыңыз үчүн! 🌱
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white">
                <h2 className="text-xl font-bold flex items-center gap-3 text-gray-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <FiShoppingBag className="text-lg" />
                  </div>
                  Буйрутманы тапшыруу
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="checkout-close-btn text-gray-400 p-2 rounded-full hover:bg-red-50 disabled:opacity-40"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="checkout-scroll flex-grow overflow-y-auto px-7 py-6 flex flex-col gap-5"
              >
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiUser className="text-emerald-500" />
                    Аты-жөнүңүз <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Мисалы: Азамат Асанов"
                    className={`checkout-field w-full px-4 py-3 rounded-xl border-2 ${
                      errors.name ? 'border-red-400' : 'border-gray-200'
                    } outline-none text-sm`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiPhone className="text-emerald-500" />
                    Телефон номериңиз <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+996 700 123 456"
                    className={`checkout-field w-full px-4 py-3 rounded-xl border-2 ${
                      errors.phone ? 'border-red-400' : 'border-gray-200'
                    } outline-none text-sm`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiMapPin className="text-emerald-500" />
                    Жеткирүү дареги <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Шаар, көчө, үй номери, квартира..."
                    rows="3"
                    className={`checkout-field w-full px-4 py-3 rounded-xl border-2 ${
                      errors.address ? 'border-red-400' : 'border-gray-200'
                    } outline-none text-sm resize-none`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FiCreditCard className="text-emerald-500" />
                    Төлөм ыкмасы <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'cash' }))}
                      className={`payment-option p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                        formData.paymentMethod === 'cash' ? 'selected' : 'border-gray-200'
                      }`}
                    >
                      <FiDollarSign className="text-2xl text-emerald-600" />
                      <span className="text-sm font-bold text-gray-700">Накталай</span>
                      <span className="text-[10px] text-gray-500">Жеткирүүдө</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'card' }))}
                      className={`payment-option p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                        formData.paymentMethod === 'card' ? 'selected' : 'border-gray-200'
                      }`}
                    >
                      <FiCreditCard className="text-2xl text-emerald-600" />
                      <span className="text-sm font-bold text-gray-700">Карта менен</span>
                      <span className="text-[10px] text-gray-500">Онлайн</span>
                    </button>
                  </div>
                </div>

                {points > 0 && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="gift-float w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-md">
                          <FiAward className="text-lg" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-yellow-800">
                            Сиздин упайыңыз
                          </p>
                          <p className="text-xs text-yellow-600">
                            {points.toLocaleString()} упай
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUsePoints(!usePoints);
                          setPointsToUse(usePoints ? 0 : maxRedeemable);
                        }}
                        className={`points-toggle relative w-14 h-7 rounded-full transition-colors ${
                          usePoints ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                        aria-label="Упай колдонуу"
                      >
                        <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
                          usePoints ? 'left-7' : 'left-0.5'
                        }`} />
                      </button>
                    </div>

                    {usePoints && (
                      <>
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <span className="text-yellow-700 font-semibold">
                            Колдонуу: {pointsToUse} упай
                          </span>
                          <span className="text-emerald-600 font-bold">
                            -{pointsToUse.toLocaleString()} сом
                          </span>
                        </div>

                        <input
                          type="range"
                          min={LOYALTY_RULES.MIN_REDEEM}
                          max={maxRedeemable}
                          step={10}
                          value={pointsToUse}
                          onChange={(e) => setPointsToUse(Number(e.target.value))}
                          className="points-slider w-full"
                        />

                        <div className="flex justify-between text-[10px] text-yellow-600 mt-1">
                          <span>Мин: {LOYALTY_RULES.MIN_REDEEM}</span>
                          <span>Макс: {maxRedeemable}</span>
                        </div>

                        <p className="text-[10px] text-yellow-700 mt-2 text-center">
                          💡 Буйрутманын {LOYALTY_RULES.MAX_REDEEM_PERCENT}% га чейин колдонсо болот
                        </p>
                      </>
                    )}
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiTag className="text-emerald-500" />
                    Промокод
                    <span className="text-gray-400 font-normal text-xs">(милдеттүү эмес)</span>
                  </label>

                  {appliedPromo ? (
                    <div className="promo-success-anim bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <FiCheck className="text-lg" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-sm text-emerald-800 flex items-center gap-2">
                          {appliedPromo.code}
                          <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                            -{appliedPromo.discount.toLocaleString()} сом
                          </span>
                        </p>
                        <p className="text-xs text-emerald-600 truncate">
                          {appliedPromo.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-emerald-600 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-all"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`flex gap-2 ${promoError ? 'promo-error-anim' : ''}`}>
                        <div className="relative flex-grow">
                          <FiTag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => {
                              setPromoInput(e.target.value.toUpperCase());
                              setPromoError('');
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyPromo();
                              }
                            }}
                            placeholder="Мисалы: NOORUZ10"
                            className={`promo-input w-full pl-10 pr-4 py-3 rounded-xl border-2 ${
                              promoError ? 'border-red-400' : 'border-gray-200'
                            } outline-none text-sm font-mono tracking-wider transition-all`}
                            disabled={promoLoading}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoLoading || !promoInput.trim()}
                          className="promo-btn bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 rounded-xl font-bold text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {promoLoading ? (
                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <FiCheck className="text-sm" />
                              Колдонуу
                            </>
                          )}
                        </button>
                      </div>

                      {promoError && (
                        <p className="promo-error-anim flex items-center gap-1.5 text-red-500 text-xs mt-2 ml-1">
                          <FiAlertCircle className="text-sm flex-shrink-0" />
                          {promoError}
                        </p>
                      )}

                      <p className="text-[11px] text-gray-400 mt-2 ml-1">
                        💡 Аракет кыл: <span className="font-mono font-bold text-emerald-600">NOORUZ10</span>
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FiMessageSquare className="text-emerald-500" />
                    Комментарий
                    <span className="text-gray-400 font-normal text-xs">(милдеттүү эмес)</span>
                  </label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Кошумча маалымат..."
                    rows="2"
                    className="checkout-field w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm resize-none"
                  />
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border-2 border-emerald-100">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Товарлардын саны:</span>
                    <span className="font-bold text-gray-800">
                      {cart.reduce((s, i) => s + i.quantity, 0)} даана
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="text-gray-600">Аралык сумма:</span>
                    <span className="font-bold text-gray-800">
                      {cartTotal.toLocaleString()} сом
                    </span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center mb-2 text-sm text-emerald-600">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <FiTag className="text-xs" />
                        Промокод ({appliedPromo.code}):
                      </span>
                      <span className="font-bold">
                        -{promoDiscount.toLocaleString()} сом
                      </span>
                    </div>
                  )}

                  {pointsDiscount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-sm text-yellow-600">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <FiAward className="text-xs" />
                        Упайлар ({pointsToUse}):
                      </span>
                      <span className="font-bold">
                        -{pointsDiscount.toLocaleString()} сом
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-emerald-100">
                    <span className="text-base font-semibold text-gray-700">Жалпы сумма:</span>
                    <div className="text-right">
                      {(appliedPromo || pointsDiscount > 0) && (
                        <p className="text-xs text-gray-400 line-through">
                          {cartTotal.toLocaleString()} сом
                        </p>
                      )}
                      <p className="text-2xl font-bold text-emerald-600">
                        {finalTotal.toLocaleString()} сом
                      </p>
                    </div>
                  </div>

                  {finalTotal > 0 && (
                    <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
                      <span className="text-yellow-600 font-semibold flex items-center gap-1">
                        <FiGift className="text-xs" />
                        Бул буйрутмадан аласыз:
                      </span>
                      <span className="font-bold text-yellow-700">
                        +{calculateEarnedPoints(finalTotal)} упай
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="checkout-submit-btn w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-base shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Жөнөтүлүүдө...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="text-xl" />
                      Буйрутманы тастыктоо — {finalTotal.toLocaleString()} сом
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
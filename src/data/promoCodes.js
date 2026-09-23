/* ============================================================
   ПРОМОКОДДОРДУН ТИЗМЕСИ
   ------------------------------------------------------------
   Ар бир промокод:
   - code:        Промокод тексти (чоң тамга менен)
   - type:        'percent' (пайыз) же 'fixed' (фикс сумма)
   - value:       Арзандатуунун өлчөмү (мис: 10 = 10% же 100 сом)
   - minAmount:   Минималдуу буйрутма суммасы
   - maxDiscount: Максималдуу арзандатуу (пайыз үчүн)
   - expires:     Мөөнөтү (YYYY-MM-DD)
   - description: Сүрөттөмө (кардарга көрүнөт)
   - active:      Активдүүбү
   ============================================================ */

export const PROMO_CODES = [
  {
    code: 'NOORUZ10',
    type: 'percent',
    value: 10,
    minAmount: 500,
    maxDiscount: 500,
    expires: '2026-12-31',
    description: '10% арзандатуу (500 сомдон жогору)',
    active: true,
  },
  {
    code: 'WELCOME',
    type: 'fixed',
    value: 100,
    minAmount: 300,
    maxDiscount: 100,
    expires: '2026-12-31',
    description: 'Биринчи буйрутмага 100 сом',
    active: true,
  },
  {
    code: 'NEWYEAR',
    type: 'percent',
    value: 15,
    minAmount: 1000,
    maxDiscount: 1000,
    expires: '2026-12-31',
    description: 'Жаңы жылга 15% арзандатуу',
    active: true,
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 150,
    minAmount: 800,
    maxDiscount: 150,
    expires: '2026-12-31',
    description: 'Жеткирүү акысыз (150 сом)',
    active: true,
  },
  {
    code: 'SUPER50',
    type: 'fixed',
    value: 50,
    minAmount: 200,
    maxDiscount: 50,
    expires: '2026-12-31',
    description: '50 сом арзандатуу',
    active: true,
  },
];

/* ============================================================
   ПРОМОКОДДУ ТЕКШЕРҮҮ ФУНКЦИЯСЫ
   ============================================================ */
export const validatePromoCode = (code, cartTotal) => {
  if (!code || !code.trim()) {
    return { valid: false, error: 'Промокодду жазыңыз' };
  }

  const cleanCode = code.trim().toUpperCase();
  const promo = PROMO_CODES.find((p) => p.code === cleanCode);

  if (!promo) {
    return { valid: false, error: 'Мындай промокод табылган жок' };
  }

  if (!promo.active) {
    return { valid: false, error: 'Бул промокод активдүү эмес' };
  }

  // Мөөнөтүн текшерүү
  if (promo.expires) {
    const expiryDate = new Date(promo.expires);
    const today = new Date();
    if (today > expiryDate) {
      return { valid: false, error: 'Промокоддун мөөнөтү бүткөн' };
    }
  }

  // Минималдуу сумманы текшерүү
  if (cartTotal < promo.minAmount) {
    return {
      valid: false,
      error: `Минималдуу сумма: ${promo.minAmount.toLocaleString()} сом`,
    };
  }

  // Арзандатууну эсептөө
  let discount = 0;
  if (promo.type === 'percent') {
    discount = Math.round((cartTotal * promo.value) / 100);
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }
  } else {
    discount = promo.value;
  }

  // Арзандатуу жалпы суммадан ашпашы керек
  if (discount > cartTotal) discount = cartTotal;

  return {
    valid: true,
    discount,
    promo: {
      code: promo.code,
      type: promo.type,
      value: promo.value,
      description: promo.description,
    },
  };
};
/* ============================================================
   ЖЕТКИРҮҮ ЗОНАЛАРЫ (Бишкек)
   ------------------------------------------------------------
   Ар бир зона:
   - id:          Уникалдуу ID
   - name:        Райондун аты
   - center:      Картадагы борбору [lat, lng]
   - radius:      Радиус (метр)
   - color:       Түс
   - price:       Жеткирүү баасы (сом)
   - time:        Жеткирүү убактысы
   - freeFrom:    Мына суммадан жогору акысыз
   ============================================================ */

export const DELIVERY_ZONES = [
  {
    id: 'center',
    name: 'Борбор',
    center: [42.8746, 74.5698],
    radius: 2500,
    color: '#10B981',
    price: 100,
    time: '30-45 мүн',
    freeFrom: 1500,
    description: 'Ала-Тоо, Чүй проспектиси, Эркиндик бульвары',
  },
  {
    id: 'east',
    name: 'Чыгыш',
    center: [42.8746, 74.6198],
    radius: 3000,
    color: '#3B82F6',
    price: 150,
    time: '45-60 мүн',
    freeFrom: 2000,
    description: 'Восточный, Кок-Жар, Кара-Жыгач',
  },
  {
    id: 'west',
    name: 'Батыш',
    center: [42.8746, 74.5198],
    radius: 3000,
    color: '#F59E0B',
    price: 150,
    time: '45-60 мүн',
    freeFrom: 2000,
    description: 'Западный, Джал, Аламедин-1',
  },
  {
    id: 'south',
    name: 'Түштүк',
    center: [42.8446, 74.5698],
    radius: 2500,
    color: '#8B5CF6',
    price: 180,
    time: '50-70 мүн',
    freeFrom: 2500,
    description: 'Ош базары, Тунгуч, Ак-Ордо',
  },
  {
    id: 'north',
    name: 'Түндүк',
    center: [42.9046, 74.5698],
    radius: 3000,
    color: '#EF4444',
    price: 200,
    time: '60-80 мүн',
    freeFrom: 3000,
    description: 'Келечек, Ак-Босого, Конокбай',
  },
];

/* ====== Жеткирүү баасын эсептөө ====== */
export const calculateDeliveryPrice = (zone, cartTotal) => {
  if (!zone) return 0;
  if (cartTotal >= zone.freeFrom) return 0;
  return zone.price;
};

/* ====== Координаталар боюнча эң жакын зонаны табуу ====== */
export const findNearestZone = (lat, lng) => {
  if (!lat || !lng) return null;

  let nearest = null;
  let minDistance = Infinity;

  DELIVERY_ZONES.forEach((zone) => {
    const distance = getDistance(lat, lng, zone.center[0], zone.center[1]);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = zone;
    }
  });

  return { zone: nearest, distance: minDistance };
};

/* ====== Эки чекиттин аралыгы (метр) ====== */
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
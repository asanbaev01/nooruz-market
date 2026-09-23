import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FiMapPin, FiTruck, FiClock, FiDollarSign, FiX, FiCheck,
  FiNavigation, FiInfo, FiPackage,
} from 'react-icons/fi';
import { DELIVERY_ZONES, findNearestZone, calculateDeliveryPrice } from '../data/deliveryZones';

/* ====== FIX Leaflet default marker ====== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ====== Колдонуучунун маркери (жашыл) ====== */
const userIcon = L.divIcon({
  className: 'user-marker',
  html: `<div style="
    width: 20px; height: 20px; border-radius: 50%;
    background: #10B981; border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(16,185,129,.3), 0 4px 12px rgba(0,0,0,.3);
    animation: userPulse 2s ease-in-out infinite;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/* ====== Картанын борборун өзгөртүүчү жардамчы ====== */
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom || map.getZoom());
  }, [center, zoom, map]);
  return null;
};

const DeliveryMap = ({ isOpen, onClose, cartTotal = 0, onZoneSelect }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState([42.8746, 74.5698]);
  const [mapZoom, setMapZoom] = useState(12);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  /* ====== Жайгашкан жерди табуу ====== */
  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Сиздин браузер жайгашкан жерди аныктоону колдобойт');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setMapZoom(14);

        /* Эң жакын зонаны табуу */
        const nearest = findNearestZone(latitude, longitude);
        if (nearest && nearest.zone) {
          setSelectedZone(nearest.zone);
        }
        setLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Жайгашкан жерди аныктоо мүмкүн болбоду');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ====== Зонаны тандоо ====== */
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setMapCenter(zone.center);
    setMapZoom(13);
  };

  /* ====== Тастыктоо ====== */
  const handleConfirm = () => {
    if (selectedZone && onZoneSelect) {
      onZoneSelect(selectedZone);
    }
    onClose();
  };

  /* ====== Жеткирүү баасы ====== */
  const getZonePrice = (zone) => {
    return calculateDeliveryPrice(zone, cartTotal);
  };

  return (
    <>
      <style>{`
        @keyframes overlayIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to { opacity: 1; backdrop-filter: blur(8px); }
        }
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(.9) translateY(30px); }
          60% { transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes userPulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(16,185,129,.3), 0 4px 12px rgba(0,0,0,.3); }
          50% { box-shadow: 0 0 0 12px rgba(16,185,129,0), 0 4px 12px rgba(0,0,0,.3); }
        }
        @keyframes zoneInfoIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .delivery-overlay { animation: overlayIn .35s ease-out both; }
        .delivery-modal { animation: modalIn .5s cubic-bezier(.34,1.56,.64,1) both; }
        .zone-info { animation: zoneInfoIn .4s cubic-bezier(.34,1.56,.64,1); }

        /* ====== Leaflet z-index fix ====== */
        .leaflet-container {
          font-family: inherit;
          z-index: 1;
        }
        .leaflet-pane { z-index: 1; }
        .leaflet-top, .leaflet-bottom { z-index: 2; }

        /* ====== Zone card hover ====== */
        .zone-card {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .zone-card:hover {
          transform: translateX(4px);
          box-shadow: 0 8px 20px -8px rgba(16,185,129,.3);
        }
        .zone-card.active {
          border-color: #10B981;
          background: #ECFDF5;
          box-shadow: 0 0 0 3px rgba(16,185,129,.15);
        }

        /* ====== Locate button ====== */
        .locate-btn {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
        }
        .locate-btn:hover {
          transform: scale(1.05);
        }
        .locate-btn:active {
          transform: scale(.95);
        }

        /* ====== Close button ====== */
        .delivery-close {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .delivery-close:hover {
          transform: rotate(90deg) scale(1.15);
          color: #ef4444;
          background: #fee2e2;
        }

        /* ====== Confirm button ====== */
        .confirm-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .confirm-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -10px rgba(16,185,129,.5);
        }
        .confirm-btn:active:not(:disabled) {
          transform: scale(.97);
        }

        /* ====== Scrollbar ====== */
        .zone-scroll::-webkit-scrollbar { width: 5px; }
        .zone-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 3px;
        }

        /* ====== Mobile ====== */
        @media (max-width: 640px) {
          .delivery-modal {
            max-height: 95vh !important;
          }
          .map-container {
            height: 300px !important;
          }
        }
      `}</style>

      {/* OVERLAY */}
      <div
        className="delivery-overlay fixed inset-0 bg-black/50 backdrop-blur-sm z-[95] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* MODAL */}
        <div
          className="delivery-modal bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ====== HEADER ====== */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg">
                <FiTruck className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Жеткирүү картасы
                </h2>
                <p className="text-xs text-gray-500">
                  Кайсы райондорго жеткиребиз
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="delivery-close w-10 h-10 rounded-full flex items-center justify-center text-gray-400"
              aria-label="Жабуу"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* ====== CONTENT ====== */}
          <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">

            {/* ====== LEFT: MAP ====== */}
            <div className="lg:flex-1 relative">
              <div className="map-container h-[400px] lg:h-full w-full">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapController center={mapCenter} zoom={mapZoom} />

                  {/* Зоналар */}
                  {DELIVERY_ZONES.map((zone) => (
                    <Circle
                      key={zone.id}
                      center={zone.center}
                      radius={zone.radius}
                      pathOptions={{
                        color: zone.color,
                        fillColor: zone.color,
                        fillOpacity: selectedZone?.id === zone.id ? 0.35 : 0.15,
                        weight: selectedZone?.id === zone.id ? 3 : 2,
                      }}
                      eventHandlers={{
                        click: () => handleZoneClick(zone),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-1">
                          <strong className="text-sm">{zone.name}</strong>
                          <p className="text-xs text-gray-600 mt-1">
                            {zone.description}
                          </p>
                          <p className="text-xs font-bold text-emerald-600 mt-1">
                            {zone.price} сом • {zone.time}
                          </p>
                        </div>
                      </Popup>
                    </Circle>
                  ))}

                  {/* Колдонуучунун жайгашкан жери */}
                  {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                      <Popup>
                        <strong>Сиз бул жердесиз 📍</strong>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {/* Locate button */}
              <button
                onClick={handleLocate}
                disabled={locating}
                className="locate-btn absolute top-4 right-4 z-[10] bg-white rounded-full shadow-lg p-3 text-emerald-600 hover:bg-emerald-50 disabled:opacity-60 flex items-center gap-2 text-sm font-semibold"
              >
                {locating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    Издөө...
                  </>
                ) : (
                  <>
                    <FiNavigation className="text-lg" />
                    Менин жерим
                  </>
                )}
              </button>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 z-[10] bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 hidden sm:block">
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">
                  Шарттуу белгилер
                </p>
                <div className="space-y-1">
                  {DELIVERY_ZONES.map((zone) => (
                    <div key={zone.id} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: zone.color }}
                      />
                      <span className="text-gray-700">{zone.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ====== RIGHT: ZONES LIST ====== */}
            <div className="lg:w-[380px] flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 bg-gray-50 max-h-[50vh] lg:max-h-full">

              {/* Header */}
              <div className="px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
                <h3 className="font-bold text-sm text-gray-700 flex items-center gap-2">
                  <FiMapPin className="text-emerald-600" />
                  Жеткирүү зоналары
                  <span className="text-xs font-normal text-gray-400">
                    ({DELIVERY_ZONES.length})
                  </span>
                </h3>
              </div>

              {/* Zones list */}
              <div className="zone-scroll flex-grow overflow-y-auto p-3 space-y-2">
                {DELIVERY_ZONES.map((zone) => {
                  const isActive = selectedZone?.id === zone.id;
                  const price = getZonePrice(zone);
                  const isFree = price === 0;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => handleZoneClick(zone)}
                      className={`zone-card bg-white rounded-2xl p-3.5 border-2 ${
                        isActive ? 'active border-emerald-500' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Color dot */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md"
                          style={{ background: zone.color }}
                        >
                          <FiMapPin className="text-lg" />
                        </div>

                        {/* Info */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-bold text-sm text-gray-800">
                              {zone.name}
                            </h4>
                            {isActive && (
                              <span className="text-emerald-500 flex-shrink-0">
                                <FiCheck className="text-lg" />
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-gray-500 mb-2 line-clamp-2">
                            {zone.description}
                          </p>

                          <div className="flex items-center gap-3 text-xs flex-wrap">
                            <span className={`flex items-center gap-1 font-bold ${
                              isFree ? 'text-emerald-600' : 'text-gray-700'
                            }`}>
                              <FiDollarSign className="text-xs" />
                              {isFree ? 'Акысыз' : `${zone.price} сом`}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <FiClock className="text-xs" />
                              {zone.time}
                            </span>
                          </div>

                          {/* Free from hint */}
                          {!isFree && (
                            <p className="text-[10px] text-emerald-600 mt-1.5 bg-emerald-50 rounded-full px-2 py-0.5 inline-block">
                              💡 {zone.freeFrom.toLocaleString()} сомдон — акысыз
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Info card */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mt-3">
                  <div className="flex gap-2">
                    <FiInfo className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      <strong>Кеңеш:</strong> "Менин жерим" баскычын басып, сизге эң жакын зонаны автоматтык таба аласыз.
                    </p>
                  </div>
                </div>
              </div>

              {/* ====== FOOTER: Selected zone summary ====== */}
              {selectedZone && (
                <div className="zone-info p-4 bg-white border-t border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[10px] text-gray-500 font-semibold uppercase">
                        Тандалган зона
                      </p>
                      <p className="font-bold text-sm text-gray-800">
                        {selectedZone.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-500 font-semibold uppercase">
                        Жеткирүү
                      </p>
                      <p className={`font-bold text-sm ${
                        getZonePrice(selectedZone) === 0 ? 'text-emerald-600' : 'text-gray-800'
                      }`}>
                        {getZonePrice(selectedZone) === 0
                          ? 'Акысыз 🎉'
                          : `${getZonePrice(selectedZone)} сом`}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    className="confirm-btn w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                  >
                    <FiCheck className="text-lg" />
                    Ушул зонаны тастыктоо
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryMap;
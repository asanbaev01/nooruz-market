import React from 'react';

/* ============================================================
   SKELETON LOADING КОМПОНЕНТТЕРИ
   ============================================================
   Жүктөлүү учурунда ак бош кутучалардын ордуна көрсөтүлөт.
   ============================================================ */

/* ====== ЖАЛПЫ АНИМАЦИЯ CSS ====== */
const SkeletonStyles = () => (
  <style>{`
    @keyframes skeletonShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .skeleton-shimmer {
      background: linear-gradient(
        90deg,
        #f0f0f0 0%,
        #f8f8f8 40%,
        #f0f0f0 80%
      );
      background-size: 200% 100%;
      animation: skeletonShimmer 1.8s ease-in-out infinite;
    }
    .dark .skeleton-shimmer {
      background: linear-gradient(
        90deg,
        #1E293B 0%,
        #334155 40%,
        #1E293B 80%
      );
      background-size: 200% 100%;
    }

    @keyframes skeletonPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    .skeleton-pulse {
      animation: skeletonPulse 2s ease-in-out infinite;
    }

    @keyframes skeletonFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .skeleton-fade-in {
      animation: skeletonFadeIn 0.4s ease-out both;
    }
  `}</style>
);

/* ============================================================
   PRODUCT CARD SKELETON
   ============================================================ */
export const ProductCardSkeleton = ({ delay = 0 }) => (
  <div
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 skeleton-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    {/* Сүрөт placeholder */}
    <div className="skeleton-shimmer h-48 w-full" />

    {/* Маалымат */}
    <div className="p-4 space-y-3">
      {/* Аталышы */}
      <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />

      {/* Рейтинг */}
      <div className="flex items-center gap-2">
        <div className="skeleton-shimmer h-3 w-3 rounded-full" />
        <div className="skeleton-shimmer h-3 w-12 rounded-full" />
        <div className="skeleton-shimmer h-3 w-8 rounded-full" />
      </div>

      {/* Баа */}
      <div className="flex items-center justify-between pt-2">
        <div className="skeleton-shimmer h-6 w-20 rounded-lg" />
        <div className="skeleton-shimmer h-9 w-9 rounded-full" />
      </div>
    </div>
  </div>
);

/* ============================================================
   PRODUCTS GRID SKELETON
   ============================================================ */
export const ProductsGridSkeleton = ({ count = 6 }) => (
  <>
    <SkeletonStyles />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} delay={i * 0.05} />
      ))}
    </div>
  </>
);

/* ============================================================
   CATEGORY SKELETON
   ============================================================ */
export const CategorySkeleton = () => (
  <>
    <SkeletonStyles />
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div
            className="skeleton-shimmer w-16 h-16 rounded-full"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
          <div
            className="skeleton-shimmer h-3 w-16 rounded-full"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        </div>
      ))}
    </div>
  </>
);

/* ============================================================
   HERO SKELETON
   ============================================================ */
export const HeroSkeleton = () => (
  <>
    <SkeletonStyles />
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Сол жак: текст */}
        <div className="space-y-5">
          <div className="skeleton-shimmer h-8 w-40 rounded-full" />
          <div className="skeleton-shimmer h-14 w-full rounded-2xl" />
          <div className="skeleton-shimmer h-14 w-3/4 rounded-2xl" />
          <div className="skeleton-shimmer h-4 w-full rounded-full" />
          <div className="skeleton-shimmer h-4 w-5/6 rounded-full" />
          <div className="flex gap-4 pt-4">
            <div className="skeleton-shimmer h-12 w-40 rounded-xl" />
            <div className="skeleton-shimmer h-12 w-40 rounded-xl" />
          </div>
        </div>

        {/* Оң жак: сүрөт */}
        <div className="skeleton-shimmer h-80 lg:h-96 rounded-3xl" />
      </div>
    </div>
  </>
);

/* ============================================================
   REVIEW SKELETON
   ============================================================ */
export const ReviewSkeleton = ({ count = 2 }) => (
  <>
    <SkeletonStyles />
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-100"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="skeleton-shimmer w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-grow space-y-2">
              <div className="skeleton-shimmer h-3.5 w-32 rounded-full" />
              <div className="skeleton-shimmer h-3 w-24 rounded-full" />
            </div>
          </div>
          <div className="space-y-2 pl-13">
            <div className="skeleton-shimmer h-3 w-full rounded-full" />
            <div className="skeleton-shimmer h-3 w-4/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </>
);

/* ============================================================
   SIMILAR PRODUCTS SKELETON
   ============================================================ */
export const SimilarProductsSkeleton = ({ count = 4 }) => (
  <>
    <SkeletonStyles />
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-5 border border-emerald-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="skeleton-shimmer w-9 h-9 rounded-xl" />
        <div className="skeleton-shimmer h-4 w-40 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[160px] bg-white rounded-2xl overflow-hidden border border-gray-100"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="skeleton-shimmer h-[110px] w-full" />
            <div className="p-2.5 space-y-2">
              <div className="skeleton-shimmer h-3 w-3/4 rounded-full" />
              <div className="skeleton-shimmer h-2.5 w-1/2 rounded-full" />
              <div className="skeleton-shimmer h-4 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

/* ============================================================
   ORDER SKELETON (профиль үчүн)
   ============================================================ */
export const OrderSkeleton = ({ count = 3 }) => (
  <>
    <SkeletonStyles />
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border-2 border-gray-100"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex justify-between mb-3">
            <div className="space-y-2">
              <div className="skeleton-shimmer h-4 w-20 rounded-full" />
              <div className="skeleton-shimmer h-3 w-32 rounded-full" />
            </div>
            <div className="skeleton-shimmer h-6 w-24 rounded-full" />
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <div className="skeleton-shimmer h-3 w-20 rounded-full" />
            <div className="skeleton-shimmer h-4 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </>
);

/* ============================================================
   DEFAULT EXPORT
   ============================================================ */
export default {
  ProductCardSkeleton,
  ProductsGridSkeleton,
  CategorySkeleton,
  HeroSkeleton,
  ReviewSkeleton,
  SimilarProductsSkeleton,
  OrderSkeleton,
};
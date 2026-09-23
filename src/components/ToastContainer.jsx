import React, { useState, useEffect } from 'react';
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiXCircle,
  FiX,
  FiBell,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  return (
    <>
      <style>{`
        /* ====== CONTAINER ====== */
        .toast-container {
          pointer-events: none;
        }

        /* ====== TOAST ENTRY ====== */
        @keyframes toastIn {
          0% {
            opacity: 0;
            transform: translateX(120%) scale(.7);
          }
          60% {
            transform: translateX(-8px) scale(1.03);
          }
          80% {
            transform: translateX(4px) scale(.99);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastOut {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
            max-height: 200px;
            margin-bottom: 16px;
          }
          100% {
            opacity: 0;
            transform: translateX(120%) scale(.8);
            max-height: 0;
            margin-bottom: 0;
          }
        }
        .toast-item {
          animation: toastIn .55s cubic-bezier(.34,1.56,.64,1) both;
          pointer-events: auto;
          transition: transform .3s cubic-bezier(.34,1.56,.64,1),
                      box-shadow .3s ease;
          will-change: transform;
        }
        .toast-item:hover {
          transform: translateX(-6px) scale(1.02);
          box-shadow: 0 25px 50px -15px rgba(0,0,0,.6);
        }
        .toast-item.leaving {
          animation: toastOut .4s cubic-bezier(.22,1,.36,1) forwards;
        }

        /* ====== PROGRESS BAR ====== */
        @keyframes progressShrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform-origin: left;
          border-radius: 0 0 .75rem .75rem;
          animation: progressShrink 3.5s linear forwards;
        }

        /* ====== ICON CIRCLE ====== */
        @keyframes iconPop {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .toast-icon-wrap {
          animation: iconPop .6s cubic-bezier(.34,1.56,.64,1) .15s both,
                     iconPulse 2.5s ease-in-out infinite 1s;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .toast-item:hover .toast-icon-wrap svg {
          transform: rotate(-12deg) scale(1.15);
        }
        .toast-icon-wrap svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          z-index: 1;
        }

        /* Ripple ring on icon */
        .toast-icon-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0;
        }
        @keyframes rippleRing {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .toast-item:hover .toast-icon-wrap::before {
          animation: rippleRing 1s ease-out infinite;
        }

        /* ====== MESSAGE TEXT ====== */
        @keyframes textIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .toast-message {
          animation: textIn .5s cubic-bezier(.34,1.56,.64,1) .2s both;
        }

        /* ====== CLOSE BUTTON ====== */
        .toast-close {
          opacity: 0;
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: transparent;
          border: none;
        }
        .toast-item:hover .toast-close {
          opacity: 1;
        }
        .toast-close:hover {
          background: rgba(255,255,255,.15);
          transform: rotate(90deg) scale(1.15);
        }
        .toast-close svg {
          transition: transform .3s ease;
        }

        /* ====== SHINE PASS ====== */
        .toast-item::before {
          content: '';
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.2), transparent);
          transform: translateX(-150%) skewX(-20deg);
          pointer-events: none;
          border-radius: inherit;
        }
        .toast-item:hover::before {
          animation: shineMove 1s ease-out;
        }
        @keyframes shineMove {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(600%) skewX(-20deg); }
        }

        /* ====== SUCCESS TYPE ====== */
        .toast-success {
          background: linear-gradient(135deg, #065F46 0%, #047857 100%);
          border-left-color: #10B981;
        }
        .toast-success .toast-icon-wrap {
          background: rgba(16, 185, 129, .2);
          color: #34D399;
        }
        .toast-success .toast-progress {
          background: linear-gradient(90deg, #34D399, #10B981);
        }

        /* ====== ERROR TYPE ====== */
        .toast-error {
          background: linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%);
          border-left-color: #EF4444;
        }
        .toast-error .toast-icon-wrap {
          background: rgba(239, 68, 68, .2);
          color: #FCA5A5;
        }
        .toast-error .toast-progress {
          background: linear-gradient(90deg, #FCA5A5, #EF4444);
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .toast-error {
          animation: toastIn .55s cubic-bezier(.34,1.56,.64,1) both,
                     errorShake .5s ease-in-out .6s;
        }

        /* ====== INFO TYPE ====== */
        .toast-info {
          background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%);
          border-left-color: #3B82F6;
        }
        .toast-info .toast-icon-wrap {
          background: rgba(59, 130, 246, .2);
          color: #93C5FD;
        }
        .toast-info .toast-progress {
          background: linear-gradient(90deg, #93C5FD, #3B82F6);
        }

        /* ====== WARNING TYPE ====== */
        .toast-warning {
          background: linear-gradient(135deg, #92400E 0%, #B45309 100%);
          border-left-color: #F59E0B;
        }
        .toast-warning .toast-icon-wrap {
          background: rgba(245, 158, 11, .2);
          color: #FCD34D;
        }
        .toast-warning .toast-progress {
          background: linear-gradient(90deg, #FCD34D, #F59E0B);
        }

        /* ====== DEFAULT (dark) ====== */
        .toast-default {
          background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
          border-left-color: #7C6CFF;
        }
        .toast-default .toast-icon-wrap {
          background: rgba(124, 108, 255, .2);
          color: #A78BFA;
        }
        .toast-default .toast-progress {
          background: linear-gradient(90deg, #A78BFA, #7C6CFF);
        }

        /* ====== FLOATING PARTICLES ====== */
        @keyframes particleRise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: .8; }
          80% { opacity: .8; }
          100% { transform: translateY(-50px) scale(1.3); opacity: 0; }
        }
        .toast-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleRise 3s linear infinite;
        }

        /* ====== CONFETTI (success) ====== */
        @keyframes confettiBurst {
          0% { transform: translate(0, 0) scale(1) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0) rotate(720deg); opacity: 0; }
        }
        .toast-confetti {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          pointer-events: none;
          animation: confettiBurst .9s cubic-bezier(.22,1,.36,1) forwards;
          top: 50%;
          left: 20px;
          z-index: 10;
        }
      `}</style>

      <div className="toast-container fixed bottom-8 right-8 z-[100] flex flex-col gap-4 max-w-sm">
        {toasts.map((toast, index) => {
          const type = toast.type || 'default';
          const iconMap = {
            success: FiCheckCircle,
            error: FiXCircle,
            warning: FiAlertCircle,
            info: FiInfo,
            default: FiBell,
          };
          const Icon = iconMap[type] || FiBell;

          return (
            <div
              key={toast.id}
              className={`toast-item toast-${type} relative text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-l-4 overflow-hidden ${
                toast.leaving ? 'leaving' : ''
              }`}
              style={{
                animationDelay: toast.leaving ? '0s' : `${index * 0.05}s`,
              }}
            >
              {/* Floating particles */}
              <span className="toast-particle w-1.5 h-1.5 bg-white/40" style={{ left: '10%', bottom: '20%', animationDelay: '0s' }} />
              <span className="toast-particle w-1 h-1 bg-white/30" style={{ left: '80%', bottom: '30%', animationDelay: '1.5s' }} />

              {/* Confetti for success */}
              {type === 'success' && (
                <>
                  <span className="toast-confetti" style={{ background: '#34D399', '--tx': '40px', '--ty': '-30px' }} />
                  <span className="toast-confetti" style={{ background: '#FCD34D', '--tx': '60px', '--ty': '-50px' }} />
                  <span className="toast-confetti" style={{ background: '#7C6CFF', '--tx': '20px', '--ty': '-60px' }} />
                  <span className="toast-confetti" style={{ background: '#F472B6', '--tx': '80px', '--ty': '-20px' }} />
                </>
              )}

              {/* Icon */}
              <div className="toast-icon-wrap">
                <Icon className="text-xl" />
              </div>

              {/* Message */}
              <span className="toast-message font-medium text-sm flex-1">
                {toast.message}
              </span>

              {/* Close button */}
              <button
                onClick={() => removeToast?.(toast.id)}
                className="toast-close"
                aria-label="Жабуу"
              >
                <FiX className="text-sm" />
              </button>

              {/* Progress bar */}
              <div className="toast-progress" />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ToastContainer;
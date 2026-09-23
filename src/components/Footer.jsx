import React, { useState, useEffect, useRef } from 'react';
import {
  FiFeather,
  FiPhone,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiSend,
  FiChevronRight,
  FiCheck,
  FiShield,
  FiHeart,
  FiArrowUp,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast(`"${email}" дареги жазылды`, 'success');
      setEmail('');
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 2500);
    }
  };

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const infoLinks = [
    { name: 'Биз жөнүндө', href: '#about-section', icon: FiShield },
    { name: 'Жеткирилүү', href: '#delivery-section', icon: FiCheck },
    { name: 'Акциялар', href: '#promo-section', icon: FiHeart },
    { name: 'FAQ', href: '#', icon: FiChevronRight },
  ];

  const contacts = [
    { icon: FiPhone, text: '+996 (770) 123 456', href: 'tel:+996770123456' },
    { icon: FiMail, text: 'info@nooruzmarket.kg', href: 'mailto:info@nooruzmarket.kg' },
    { icon: FiMapPin, text: 'Бишкек ш., Чүй пр. 120', href: '#' },
  ];

  const socials = [
    { icon: FiInstagram, color: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-500', label: 'Instagram' },
    { icon: FiFacebook, color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: FiSend, color: 'hover:bg-sky-500', label: 'Telegram' },
  ];

  return (
    <>
      <style>{`
        /* ====== FOOTER ROOT — боз-жашыл, өзгөчө ====== */
        .footer-root {
          position: relative;
          background:
            radial-gradient(120% 80% at 50% 0%, rgba(16,185,129,.08) 0%, transparent 50%),
            linear-gradient(180deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 100%);
          border-top: 1px solid rgba(16, 185, 129, .25);
          overflow: hidden;
        }

        /* Top gradient accent line */
        .footer-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #10B981, #22E8B0, #10B981, transparent);
          background-size: 200% auto;
          animation: footerTopShine 4s linear infinite;
          z-index: 2;
        }
        @keyframes footerTopShine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* ====== BACKGROUND DECORATIONS ====== */
        @keyframes blobFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.15); }
        }
        .footer-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: .25;
          pointer-events: none;
          animation: blobFloat 12s ease-in-out infinite;
        }

        /* Grid pattern (green tint) */
        @keyframes gridFade {
          0%, 100% { opacity: .04; }
          50% { opacity: .08; }
        }
        .footer-grid-pattern {
          animation: gridFade 8s ease-in-out infinite;
        }

        /* Floating particles */
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) rotate(0); opacity: .2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: .5; }
        }
        .footer-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 5s ease-in-out infinite;
        }

        /* ====== ENTRY ====== */
        @keyframes footerIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .footer-main { opacity: 0; }
        .footer-main.visible {
          opacity: 1;
          animation: footerIn .8s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== COLUMN STAGGER ====== */
        @keyframes colIn {
          0% { opacity: 0; transform: translateY(30px); }
          60% { transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .footer-col { opacity: 0; }
        .footer-col.visible {
          opacity: 1;
          animation: colIn .6s cubic-bezier(.34,1.56,.64,1) both;
        }

        /* ====== LOGO ====== */
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-3px) rotate(-5deg); }
        }
        @keyframes logoSpin {
          0% { transform: rotate(0) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .footer-logo-icon {
          animation: logoFloat 3s ease-in-out infinite;
          transition: color .3s ease;
        }
        .footer-logo:hover .footer-logo-icon {
          animation: logoSpin .8s cubic-bezier(.34,1.56,.64,1);
        }

        /* ====== SECTION HEADINGS ====== */
        @keyframes headingShine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .footer-heading {
          position: relative;
          display: inline-block;
          color: #064e3b;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0; bottom: -6px;
          width: 30px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #10B981, #22E8B0, #10B981);
          background-size: 200% auto;
          animation: headingShine 3s ease infinite;
          transition: width .4s cubic-bezier(.34,1.56,.64,1);
        }
        .footer-col:hover .footer-heading::after {
          width: 60px;
        }

        /* ====== INFO LINKS ====== */
        .footer-link {
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          color: #334155;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 26px; right: 0; bottom: 6px;
          height: 1px;
          background: #059669;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .3s ease;
        }
        .footer-link:hover::after { transform: scaleX(1); }
        .footer-link:hover { color: #047857; }
        .footer-link svg {
          transition: transform .3s cubic-bezier(.34,1.56,.64,1);
        }
        .footer-link:hover svg {
          transform: translateX(4px);
          color: #10B981;
        }

        /* ====== CONTACT ITEMS ====== */
        .contact-item {
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          color: #334155;
        }
        .contact-item:hover {
          transform: translateX(6px);
          color: #047857;
        }
        .contact-icon-wrap {
          background: rgba(16, 185, 129, .15);
          color: #059669;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .contact-item:hover .contact-icon-wrap {
          background: #10B981;
          color: white;
          transform: rotate(-12deg) scale(1.1);
        }

        /* ====== SOCIAL BUTTONS ====== */
        .social-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
          background: rgba(16, 185, 129, .15);
          color: #059669;
        }
        .social-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,.3), transparent 70%);
          transform: scale(0);
          border-radius: inherit;
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .social-btn:hover::before { transform: scale(1.5); }
        .social-btn:hover {
          transform: translateY(-6px) scale(1.1) rotate(-6deg);
          color: white;
          box-shadow: 0 12px 25px -8px rgba(16, 185, 129, .5);
        }
        .social-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          z-index: 1;
        }
        .social-btn:hover svg { transform: scale(1.2); }

        /* ====== EMAIL INPUT ====== */
        .footer-input {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          background: rgba(255, 255, 255, .7);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(16, 185, 129, .3);
          color: #064e3b;
        }
        .footer-input:focus {
          outline: none;
          background: white;
          border-color: #10B981;
          transform: translateY(-2px);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, .15);
        }
        .footer-input::placeholder { color: #64748b; }

        /* ====== SUBSCRIBE BUTTON ====== */
        .subscribe-btn {
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #10B981, #059669);
          box-shadow: 0 8px 20px -8px rgba(16, 185, 129, .5);
        }
        .subscribe-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,.35), transparent);
          transform: translateX(-100%);
          transition: transform .7s ease;
        }
        .subscribe-btn:hover::before { transform: translateX(100%); }
        .subscribe-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 15px 30px -10px rgba(16, 185, 129, .6);
        }
        .subscribe-btn:active { transform: scale(.97); }
        .subscribe-btn svg {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }
        .subscribe-btn:hover svg { transform: translateX(4px); }

        @keyframes successPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .subscribe-btn.success {
          animation: successPop .6s cubic-bezier(.34,1.56,.64,1);
          background: #22E8B0;
        }

        /* ====== HEARTBEAT ====== */
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        .footer-heart {
          display: inline-block;
          animation: heartbeat 1.5s ease-in-out infinite;
          color: #ef4444;
        }

        /* ====== BOTTOM BAR ====== */
        .footer-bottom { opacity: 0; }
        .footer-bottom.visible {
          opacity: 1;
          animation: footerIn .6s cubic-bezier(.34,1.56,.64,1) .6s both;
        }
        .bottom-link {
          transition: all .3s ease;
          color: #475569;
        }
        .bottom-link:hover {
          color: #047857;
          transform: translateY(-2px);
        }

        /* ====== SCROLL TO TOP ====== */
        @keyframes scrollTopIn {
          0% { opacity: 0; transform: translateY(20px) scale(.8); }
          60% { transform: translateY(-4px) scale(1.05); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .footer-scroll-top {
          animation: scrollTopIn .5s cubic-bezier(.34,1.56,.64,1) .8s both;
          transition: all .35s cubic-bezier(.34,1.56,.64,1);
          background: linear-gradient(135deg, #10B981, #059669);
          box-shadow: 0 10px 25px -10px rgba(16, 185, 129, .6);
        }
        .footer-scroll-top:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 20px 40px -10px rgba(16, 185, 129, .7);
        }
        .footer-scroll-top:active { transform: scale(.9); }
        .footer-scroll-top svg {
          transition: transform .3s ease;
        }
        .footer-scroll-top:hover svg { transform: translateY(-2px); }

        /* ====== TRUST BADGE ====== */
        .trust-badge {
          background: rgba(255, 255, 255, .6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(16, 185, 129, .3);
          color: #047857;
        }

        /* ====== DIVIDER LINE ====== */
        .footer-divider {
          border-top: 1px solid rgba(16, 185, 129, .2);
        }
      `}</style>

      <footer
        ref={footerRef}
        className="footer-root relative text-slate-700 py-16 px-6"
      >
        {/* Background decorations */}
        <div className="footer-blob bg-emerald-400 w-96 h-96 -top-40 -left-20" />
        <div className="footer-blob bg-green-300 w-80 h-80 -bottom-40 right-0" style={{ animationDelay: '4s' }} />
        <div className="footer-blob bg-teal-300 w-72 h-72 top-1/3 right-1/4" style={{ animationDelay: '8s', opacity: .15 }} />

        {/* Grid pattern */}
        <div
          className="footer-grid-pattern absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Particles */}
        <span className="footer-particle w-2 h-2 bg-emerald-500 top-20 left-1/4" />
        <span className="footer-particle w-1.5 h-1.5 bg-green-500 top-1/2 right-1/3" style={{ animationDelay: '1.5s' }} />
        <span className="footer-particle w-1 h-1 bg-teal-400 bottom-20 left-2/3" style={{ animationDelay: '3s' }} />

        <div className={`footer-main relative z-10 max-w-7xl mx-auto ${visible ? 'visible' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* ====== BRAND ====== */}
            <div
              className={`footer-col space-y-6 ${visible ? 'visible' : ''}`}
              style={{ animationDelay: '0s' }}
            >
              <a
                href="#"
                className="footer-logo text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                style={{ color: '#047857' }}
              >
                <FiFeather className="footer-logo-icon text-3xl" style={{ color: '#10B981' }} />
                Nooruz Market
              </a>

              <p className="text-sm leading-relaxed text-slate-700">
                Кыргызстандын эң жаңы жана сапаттуу азык-түлүктөрүн сиздин босогоңузга чейин жеткиребиз.
              </p>

              {/* Social buttons */}
              <div className="flex gap-3">
                {socials.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href="#"
                      className={`social-btn w-10 h-10 rounded-full flex items-center justify-center ${social.color}`}
                      aria-label={social.label}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <Icon className="text-lg" />
                    </a>
                  );
                })}
              </div>

              {/* Trust badge */}
              <div className="trust-badge inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-semibold">
                <FiShield className="text-sm" />
                Ишенимдүү дүкөн · 2024
              </div>
            </div>

            {/* ====== INFO LINKS ====== */}
            <div
              className={`footer-col ${visible ? 'visible' : ''}`}
              style={{ animationDelay: '0.1s' }}
            >
              <h4 className="footer-heading text-lg font-bold mb-6">
                Маалымат
              </h4>
              <ul className="space-y-4 text-sm">
                {infoLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <button
                        onClick={() => scrollTo(link.href)}
                        className="footer-link flex items-center gap-3 w-full text-left"
                      >
                        <Icon className="text-sm text-emerald-600 flex-shrink-0" />
                        <span className="font-medium">{link.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ====== CONTACT ====== */}
            <div
              className={`footer-col ${visible ? 'visible' : ''}`}
              style={{ animationDelay: '0.2s' }}
            >
              <h4 className="footer-heading text-lg font-bold mb-6">
                Байланыш
              </h4>
              <ul className="space-y-4 text-sm">
                {contacts.map((contact, i) => {
                  const Icon = contact.icon;
                  return (
                    <li key={i}>
                      <a
                        href={contact.href}
                        className="contact-item flex items-center gap-3"
                      >
                        <span className="contact-icon-wrap w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="text-sm" />
                        </span>
                        <span className="font-medium">{contact.text}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ====== SUBSCRIBE ====== */}
            <div
              className={`footer-col ${visible ? 'visible' : ''}`}
              style={{ animationDelay: '0.3s' }}
            >
              <h4 className="footer-heading text-lg font-bold mb-6">
                Жазылуу
              </h4>
              <p className="text-sm mb-4 text-slate-700">
                Жаңылыктарды жана акцияларды биринчилерден болуп билиңиз!
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email дарегиңиз"
                    className="footer-input w-full rounded-xl pl-11 pr-4 py-3 text-sm font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`subscribe-btn text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${subscribed ? 'success' : ''}`}
                >
                  {subscribed ? (
                    <>
                      <FiCheck /> Жазылдыңыз!
                    </>
                  ) : (
                    <>
                      <FiSend /> Жазылуу
                    </>
                  )}
                </button>
              </form>

              {/* Hint */}
              <p className="text-xs text-slate-600 mt-3 flex items-center gap-1.5">
                <FiCheck className="text-emerald-600" />
                Спам жок — жөн гана пайдалуу маалымат
              </p>
            </div>
          </div>

          {/* ====== BOTTOM BAR ====== */}
          <div
            className={`footer-bottom footer-divider mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 ${visible ? 'visible' : ''}`}
          >
            <p className="flex items-center gap-1.5 flex-wrap justify-center md:justify-start">
              © 2024 Nooruz Market. Бардык укуктар корголгон. Жасалган
              <FiHeart className="footer-heart text-base" fill="currentColor" />
              менен Кыргызстанда
            </p>
            <div className="flex gap-6">
              <a href="#" className="bottom-link">Купуялуулук саясаты</a>
              <a href="#" className="bottom-link">Пайдалануу шарттары</a>
            </div>
          </div>
        </div>

        {/* ====== SCROLL TO TOP ====== */}
        <button
          onClick={scrollToTop}
          className="footer-scroll-top fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full text-white flex items-center justify-center"
          aria-label="Жогору кайтуу"
        >
          <FiArrowUp className="text-xl" />
        </button>
      </footer>
    </>
  );
};

export default Footer;
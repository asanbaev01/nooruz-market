import React, { useState } from 'react';
import { FiFeather, FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiSend, FiChevronRight } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { showToast(`"${email}" дареги жазылды`); setEmail(''); }
  };

  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <FiFeather className="text-primary" /> Nooruz Market
          </div>
          <p className="text-sm leading-relaxed">Кыргызстандын эң жаңы жана сапаттуу азык-түлүктөрүн сиздин босогоңузга чейин жеткиребиз.</p>
          <div className="flex gap-4">
            {[FiInstagram, FiFacebook, FiSend].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:-translate-y-1.5 transition-all">
                <Icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Маалымат</h4>
          <ul className="space-y-4 text-sm">
            {[
              { name: 'Биз жөнүндө', href: '#about-section' },
              { name: 'Жеткирилүү', href: '#delivery-section' },
              { name: 'Акциялар', href: '#promo-section' },
              { name: 'FAQ', href: '#' },
            ].map((link) => (
              <li key={link.name}>
                <button onClick={() => scrollTo(link.href)} className="hover:text-white transition-all flex items-center gap-1 hover:translate-x-1">
                  <FiChevronRight className="text-xs" /> {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Байланыш</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3 hover:text-white transition-colors"><FiPhone className="text-primary" /> +996 (770) 123 456</li>
            <li className="flex items-center gap-3 hover:text-white transition-colors"><FiMail className="text-primary" /> info@nooruzmarket.kg</li>
            <li className="flex items-center gap-3 hover:text-white transition-colors"><FiMapPin className="text-primary" /> Бишкек ш., Чүй пр. 120</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Жазылуу</h4>
          <p className="text-sm mb-4">Жаңылыктарды жана акцияларды биринчилерден болуп билиңиз!</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email дарегиңиз" className="bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
            <button type="submit" className="bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-light transition-colors hover:scale-[1.02] active:scale-95">Жазылуу</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2024 Nooruz Market. Бардык укуктар корголгон.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Купуялуулук саясаты</a>
          <a href="#" className="hover:text-white transition-colors">Пайдалануу шарттары</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
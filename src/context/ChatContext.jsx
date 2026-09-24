import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

const LS_KEY = 'nooruz_chat_messages';

/* ====== АВТОМАТТЫК ЖООПТОР ====== */
const AUTO_REPLIES = [
  {
    keywords: ['салам', 'привет', 'hello', 'саламатсыз', 'саламатсызбы'],
    reply: 'Саламатсызбы! 😊 Сизге кантип жардам бере алам?',
  },
  {
    keywords: ['жеткирүү', 'доставка', 'delivery', 'жеткирүү'],
    reply: '🚚 Жеткирүү 30-60 мүнөттө ишке ашат. Дарегиңизди жазыңыз, так баасын айтам.',
  },
  {
    keywords: ['баа', 'цена', 'сколько', 'price', 'канча'],
    reply: '💰 Бааларды сайттан көрө аласыз. Арзандатуу үчүн промокод: NOORUZ10',
  },
  {
    keywords: ['товар', 'продукт', 'product', 'азык'],
    reply: '🥗 Бизде 100+ түрдүү азыктар бар. Кайсы категория кызыктырат?',
  },
  {
    keywords: ['рахмат', 'спасибо', 'thanks', 'благодарю'],
    reply: 'Рахмат! 🌱 Жакшы күн каалайм!',
  },
  {
    keywords: ['адрес', 'дарек', 'кайда', 'где'],
    reply: '📍 Биздин дарек: Бишкек ш., Чүй пр. 120. Жеткирүү бардык райондорго.',
  },
  {
    keywords: ['акция', 'скидка', 'promo', 'арзандатуу'],
    reply: '🎁 Азыркы акциялар: NOORUZ10 (10%), WELCOME (100 сом), NEWYEAR (15%)',
  },
];

const getAutoReply = (message) => {
  const lowerMsg = message.toLowerCase();
  for (const item of AUTO_REPLIES) {
    if (item.keywords.some((kw) => lowerMsg.includes(kw))) {
      return item.reply;
    }
  }
  return 'Рахмат! Оператор жакын арада сиз менен байланышат. 📞 +996 700 123 456';
};

/* ====== БАШТАПКЫ ХОШ КЕЛҮҮ ====== */
const WELCOME_MESSAGE = {
  id: 'welcome',
  from: 'bot',
  text: 'Саламатсызбы! 👋 Nooruz Market колдоо кызматына кош келиңиз! Кантип жардам бере алам?',
  time: new Date().toLocaleTimeString('ky-KG', { hour: '2-digit', minute: '2-digit' }),
  timestamp: Date.now(),
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
    } catch {
      return [WELCOME_MESSAGE];
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn('Chat save error:', err);
    }
  }, [messages]);

  /* ====== ЖАҢЫ БИЛДИРҮҮ ЖӨНӨТҮҮ ====== */
  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `MSG-${Date.now()}`,
      from: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('ky-KG', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    /* Автоматтык жооп (1.5 сек кийин) */
    setTimeout(() => {
      const botMessage = {
        id: `MSG-${Date.now()}-bot`,
        from: 'bot',
        text: getAutoReply(text),
        time: new Date().toLocaleTimeString('ky-KG', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setUnreadCount((prev) => prev + 1);
    }, 1500);
  };

  /* ====== ТАРЫХТЫ ТАЗАЛОО ====== */
  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setUnreadCount(0);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {}
  };

  /* ====== ОКУУ ====== */
  const markAsRead = () => setUnreadCount(0);

  const value = {
    messages,
    isTyping,
    unreadCount,
    sendMessage,
    clearChat,
    markAsRead,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
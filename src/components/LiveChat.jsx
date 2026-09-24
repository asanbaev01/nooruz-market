import React, { useState, useEffect, useRef } from 'react';
import {
  FiMessageCircle, FiX, FiSend, FiTrash2, FiUser, FiPhone,
} from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useApp } from '../context/AppContext';

const LiveChat = () => {
  const { currentUser, isLoggedIn } = useApp();
  const { messages, isTyping, unreadCount, sendMessage, clearChat, markAsRead } = useChat();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* Жаңы билдирүү келгенде — ылдыйга сыдыруу */
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  /* Чат ачылганда — окуу + focus */
  useEffect(() => {
    if (isOpen) {
      markAsRead();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, markAsRead]);

  /* Escape менен жабуу */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      <style>{`
        @keyframes chatFabIn {
          0% { opacity: 0; transform: scale(0) rotate(-180deg); }
          60% { transform: scale(1.15) rotate(10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes chatFabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,.6), 0 10px 30px -10px rgba(59,130,246,.5); }
          50% { box-shadow: 0 0 0 20px rgba(59,130,246,0), 0 10px 30px -10px rgba(59,130,246,.5); }
        }
        @keyframes chatFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes chatWindowIn {
          0% { opacity: 0; transform: translateY(30px) scale(.9); }
          60% { transform: translateY(-6px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes messageIn {
          0% { opacity: 0; transform: translateY(15px) scale(.9); }
          60% { transform: translateY(-3px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); opacity: .5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes avatarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,.6); }
          50% { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
        }

        .chat-fab {
          animation: chatFabIn .6s cubic-bezier(.34,1.56,.64,1) both,
                     chatFloat 3s ease-in-out 1s infinite,
                     chatFabPulse 2.5s ease-in-out infinite;
          transition: all .4s cubic-bezier(.34,1.56,.64,1);
        }
        .chat-fab:hover {
          transform: scale(1.1) !important;
        }
        .chat-fab:active {
          transform: scale(.95);
        }
        .chat-fab.open .chat-fab-icon {
          transform: rotate(90deg);
        }
        .chat-fab-icon {
          transition: transform .4s cubic-bezier(.34,1.56,.64,1);
        }

        .chat-badge {
          animation: badgePulse 1.5s ease-in-out infinite;
        }

        .chat-window {
          animation: chatWindowIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }

        .chat-message {
          animation: messageIn .4s cubic-bezier(.34,1.56,.64,1) both;
        }

        .chat-typing-dot {
          animation: typingDot 1.4s ease-in-out infinite;
        }
        .chat-typing-dot:nth-child(2) { animation-delay: .2s; }
        .chat-typing-dot:nth-child(3) { animation-delay: .4s; }

        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(16,185,129,.3);
          border-radius: 3px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(16,185,129,.6);
        }

        .chat-avatar-online {
          animation: avatarPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* ====== CHAT WINDOW ====== */}
      {isOpen && (
        <div className="chat-window fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-2xl z-[95] flex flex-col overflow-hidden border border-gray-100">

          {/* ====== HEADER ====== */}
          <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 p-4 text-white relative overflow-hidden flex-shrink-0">
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="chat-avatar-online w-11 h-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center relative">
                  <FiMessageCircle className="text-xl" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-blue-600" />
                </div>

                <div>
                  <h3 className="font-bold text-base leading-tight">Nooruz Support</h3>
                  <div className="flex items-center gap-1.5 text-xs opacity-90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Азыр онлайн
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-all"
                  title="Тазалоо"
                >
                  <FiTrash2 className="text-lg" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition-all hover:rotate-90"
                  title="Жабуу"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
          </div>

          {/* ====== MESSAGES ====== */}
          <div className="chat-scroll flex-grow overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[80%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${
                    msg.from === 'user'
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    {msg.from === 'user' ? (
                      currentUser?.name?.charAt(0)?.toUpperCase() || 'U'
                    ) : (
                      <FiMessageCircle />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>
                    <p className={`text-[10px] mt-1 ${
                      msg.from === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* ====== TYPING INDICATOR ====== */}
            {isTyping && (
              <div className="chat-message flex justify-start">
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                    <FiMessageCircle className="text-sm" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="chat-typing-dot w-2 h-2 rounded-full bg-gray-400" />
                      <span className="chat-typing-dot w-2 h-2 rounded-full bg-gray-400" />
                      <span className="chat-typing-dot w-2 h-2 rounded-full bg-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ====== INPUT ====== */}
          <form
            onSubmit={handleSubmit}
            className="flex-shrink-0 p-3 border-t border-gray-100 bg-white flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Билдирүү жазыңыз..."
              className="flex-grow px-4 py-2.5 rounded-full border-2 border-gray-200 outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiSend className="text-lg" />
            </button>
          </form>
        </div>
      )}

      {/* ====== FLOATING BUTTON ====== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chat-fab ${isOpen ? 'open' : ''} fixed bottom-24 left-4 sm:left-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl flex items-center justify-center z-[90]`}
        aria-label={isOpen ? 'Жабуу' : 'Live Chat'}
      >
        {isOpen ? (
          <FiX className="text-2xl chat-fab-icon" />
        ) : (
          <>
            <FiMessageCircle className="text-2xl chat-fab-icon" />
            {unreadCount > 0 && (
              <span className="chat-badge absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
};

export default LiveChat;
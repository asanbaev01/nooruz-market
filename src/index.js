import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { NotificationProvider } from './context/NotificationContext';
import { ReferralProvider } from './context/ReferralContext';
import { CashbackProvider } from './context/CashbackContext'; // ✅ ЖАҢЫ
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { ChatProvider } from './context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          <OrderProvider>
            <ReviewProvider>
              <LoyaltyProvider>
                <NotificationProvider>
                  <ReferralProvider>
                    <CashbackProvider>  {/* ✅ ЖАҢЫ */}
                      <ChatProvider> 
                        <App />
                      </ChatProvider>
                    </CashbackProvider>
                  </ReferralProvider>
                </NotificationProvider>
              </LoyaltyProvider>
            </ReviewProvider>
          </OrderProvider>
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);

/* ✅ PWA SERVICE WORKER КАТТОО */
serviceWorkerRegistration.register({
  onSuccess: () => console.log('🎉 PWA ийгиликтүү орнотулду!'),
  onUpdate: (registration) => {
    console.log('🔄 Жаңы версия жеткиликтүү');
    if (window.confirm('Жаңы версия жеткиликтүү. Жаңылайбызбы?')) {
      window.location.reload();
    }
  },
});
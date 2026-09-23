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
                  <App />
                </NotificationProvider>
              </LoyaltyProvider>
            </ReviewProvider>
          </OrderProvider>
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);
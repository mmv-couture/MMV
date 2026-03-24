
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { NavigationHistoryProvider } from './context/NavigationHistoryContext';
import './styles/index.css';
import './styles/mobile-optimization.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <NavigationHistoryProvider>
            <App />
          </NavigationHistoryProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);


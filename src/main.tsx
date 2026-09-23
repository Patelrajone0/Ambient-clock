import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Progressive Web App Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = new URL('sw.js', window.location.href).pathname;
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
        // Force check for newest service worker version
        reg.update();
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });

  // Reload page when new service worker takes control so user gets fresh UI instantly
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}


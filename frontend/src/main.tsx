import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Enregistrement PWA Service Worker en production et environnement supporté
if ('serviceWorker' in navigator && (import.meta.env.PROD || window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[BBS PWA] Service Worker actif :', reg.scope);
      })
      .catch((err) => {
        console.warn('[BBS PWA] Service Worker non disponible :', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

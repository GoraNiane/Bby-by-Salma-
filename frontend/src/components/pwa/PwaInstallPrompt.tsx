import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      return;
    }

    // Check if dismissed recently
    const dismissed = sessionStorage.getItem('bbs_pwa_dismissed');
    if (dismissed) {
      return;
    }

    // Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Capture Chrome/Android install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS Safari and not standalone, show prompt after 4s
    if (isIosDevice && !isStandalone) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('[BBS PWA] Utilisateur a accepté l’installation');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosInstructions(false);
    sessionStorage.setItem('bbs_pwa_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Floating PWA Install Card on Mobile/Desktop */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 z-50 bg-[#1E140C] text-white p-4 rounded-3xl shadow-2xl border border-[#E2C078]/40 animate-fade-in flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#E2C078] text-[#1E140C] font-serif font-black flex items-center justify-center text-xl shrink-0 shadow-md">
            B
          </div>
          <div className="min-w-0">
            <h4 className="font-serif font-bold text-xs sm:text-sm text-white leading-tight truncate">
              Installer BBS By Salma
            </h4>
            <p className="text-[11px] text-[#D1C3B7] truncate">
              Accès rapide comme une application mobile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 bg-[#E2C078] hover:bg-[#D4AE5E] text-[#1E140C] font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Installer</span>
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 text-[#A59485] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIosInstructions && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#FAF6F1] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#EAE0D5] text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1E140C] text-[#E2C078] font-serif font-bold flex items-center justify-center text-xl mx-auto shadow-md">
              B
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1E140C]">
              Installer sur votre iPhone
            </h3>
            <div className="text-xs text-[#685A50] text-left space-y-2.5 p-3.5 bg-white rounded-2xl border border-[#EAE0D5]">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1E140C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-600" /> en bas de Safari.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1E140C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Faites défiler et sélectionnez <strong>Sur l'écran d'accueil</strong>.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#1E140C] text-white flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Appuyez sur <strong>Ajouter</strong> en haut à droite !</span>
              </div>
            </div>
            <button
              onClick={() => setShowIosInstructions(false)}
              className="w-full py-3 bg-[#1E140C] text-white font-bold rounded-2xl text-xs active:scale-95 transition-transform"
            >
              C'est compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
};

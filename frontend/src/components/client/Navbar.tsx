import React, { useState, useRef } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch
}) => {
  const { siteContent, collections } = useStore();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminToast, setShowAdminToast] = useState(false);

  // Secret 5-clicks tracker for admin entry behind the logo
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Boutique', path: '/boutique' },
    { label: 'Nos Gammes', path: '/categories' },
    { label: 'À Propos', path: '/a-propos' },
    { label: 'Avis Clientes', path: '/avis' },
    { label: 'Contact', path: '/contact' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    const now = Date.now();
    // If consecutive click within 2.5 seconds, increment
    if (now - lastClickTimeRef.current < 2500) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }
    lastClickTimeRef.current = now;

    // Secret 5th click opens the admin page
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      setMobileMenuOpen(false);
      setShowAdminToast(true);
      setTimeout(() => {
        setShowAdminToast(false);
        onNavigate('/admin');
      }, 400);
      return;
    }

    // On single click, navigate to homepage
    if (clickCountRef.current === 1) {
      handleLinkClick('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#EADED2]/80 transition-all">
      {/* Secret Admin Access Notification */}
      {showAdminToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1E140C] text-[#E2C078] px-5 py-2.5 rounded-full shadow-2xl border border-[#E2C078]/40 flex items-center gap-2.5 text-xs font-semibold animate-bounce pointer-events-none">
          <Sparkles className="w-4 h-4 text-[#E2C078] animate-spin" />
          <span>Accès Administrateur déverrouillé...</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-[#1E140C] hover:bg-black/5 rounded-xl transition-colors"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 stroke-[1.75]" />}
          </button>

          {/* Brand Logo with 5-click secret admin entry */}
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="BBS By Salma"
          >
            {/* Dark squircle with refined serif monogram */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1E140C] flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-transform duration-200 shrink-0">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#E2C078]">B</span>
            </div>
            <div className="leading-tight">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-extrabold text-[#1E140C] tracking-tight">BBS</span>
                <span className="font-sans text-[11px] sm:text-xs font-semibold text-[#A86D44] tracking-wider">BY SALMA</span>
              </div>
              <p className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.22em] text-[#867466] font-semibold mt-0.5">
                COSMÉTIQUES D'EXCEPTION
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#2E231C]">
            {navLinks.map(link => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 transition-colors ${
                    isActive ? 'text-[#1E140C] font-bold' : 'text-[#3E342B] hover:text-[#1E140C]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-[#A06E3B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, WhatsApp Advice, Shopping Bag */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#2E231C] hover:text-[#1E140C] hover:bg-black/5 rounded-full transition-colors"
              title="Rechercher un produit ou un soin"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Direct WhatsApp Advice (Desktop & Tablet) */}
            <a
              href={`https://wa.me/${siteContent?.contact.whatsapp?.replace(/\D/g, '') || '221770000000'}?text=${encodeURIComponent('Bonjour Salma, je souhaite des conseils pour mes soins corporels BBS ! ✨')}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EAF7ED] hover:bg-[#DEF1E3] text-[#1E7643] rounded-full text-xs font-semibold transition-all border border-[#C5E9D1] shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#1E7643]/20 text-[#1E7643]" />
              <span>Conseil Salma</span>
            </a>

            {/* Cart Button with Counter Badge - Matching Mockup */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#2E231C] hover:text-[#1E140C] hover:bg-black/5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Panier d'achats"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#C25E28] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col z-10 animate-fade-in justify-between">
            <div>
              {/* Header with 5-click logo handler */}
              <div className="flex items-center justify-between pb-4 border-b border-bbs-100">
                <div
                  onClick={handleLogoClick}
                  className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
                  title="BBS By Salma"
                >
                  <div className="w-9 h-9 rounded-xl bg-bbs-900 text-gold-300 font-serif font-bold flex items-center justify-center">
                    B
                  </div>
                  <div>
                    <div className="font-serif font-bold text-bbs-950">BBS BY SALMA</div>
                    <div className="text-[9px] uppercase tracking-wider text-gold-700">Cosmétiques de luxe</div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-bbs-500 hover:text-bbs-900 rounded-xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Links */}
              <div className="py-6 space-y-1">
                {navLinks.map(link => (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                      currentPath === link.path
                        ? 'bg-bbs-900 text-white shadow-md'
                        : 'text-bbs-800 hover:bg-bbs-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className={`w-4 h-4 ${currentPath === link.path ? 'text-gold-300' : 'text-bbs-400'}`} />
                  </button>
                ))}
              </div>

              {/* Gammes list quick access */}
              <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-100 space-y-2">
                <div className="text-xs font-bold text-bbs-900">Gammes par teint :</div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  {collections.slice(0, 3).map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleLinkClick(`/gamme/${c.slug}`)}
                      className="p-2 bg-white rounded-xl text-[11px] font-bold text-bbs-900 hover:bg-gold-50 shadow-sm truncate border border-bbs-100"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-bbs-100 space-y-2">
              <a
                href={`https://wa.me/${siteContent?.contact.whatsapp?.replace(/\D/g, '') || '221770000000'}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow"
              >
                <MessageCircle className="w-4 h-4" />
                Discuter avec Salma sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

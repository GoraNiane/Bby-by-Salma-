import React from 'react';
import { Home, Search, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch
}) => {
  const { itemCount, openCart } = useCart();

  const isHome = currentPath === '/' || currentPath === '';
  const isCategories = currentPath === '/categories';
  const isAccount = currentPath === '/contact' || currentPath.startsWith('/admin');

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EAE0D5] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all"
      aria-label="Navigation mobile principale"
    >
      <div className="grid grid-cols-5 items-center justify-items-center">
        {/* 1. Accueil */}
        <button
          onClick={() => {
            onNavigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
            isHome ? 'text-[#A86D44]' : 'text-[#7A6E65] hover:text-[#1E140C]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5 stroke-[1.8]" />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A86D44]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Accueil</span>
        </button>

        {/* 2. Recherche */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[#7A6E65] hover:text-[#1E140C] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold tracking-tight">Recherche</span>
        </button>

        {/* 3. Catégories */}
        <button
          onClick={() => {
            onNavigate('/categories');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
            isCategories ? 'text-[#A86D44]' : 'text-[#7A6E65] hover:text-[#1E140C]'
          }`}
        >
          <div className="relative">
            <LayoutGrid className="w-5 h-5 stroke-[1.8]" />
            {isCategories && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A86D44]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Catégories</span>
        </button>

        {/* 4. Panier */}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-[#7A6E65] hover:text-[#1E140C] transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#C25E28] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Panier</span>
        </button>

        {/* 5. Compte / Contact */}
        <button
          onClick={() => {
            onNavigate('/contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-colors cursor-pointer ${
            isAccount ? 'text-[#A86D44]' : 'text-[#7A6E65] hover:text-[#1E140C]'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5 stroke-[1.8]" />
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#A86D44]" />
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Compte</span>
        </button>
      </div>
    </nav>
  );
};

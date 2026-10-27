import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Layers,
  ShoppingBag,
  Users,
  TrendingUp,
  Star,
  FileText,
  Settings,
  Bell,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToStore: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  onNavigateToStore
}) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produits & Stocks', icon: Package },
    { id: 'collections', label: 'Gammes & Teintes', icon: Sparkles },
    { id: 'categories', label: 'Catégories', icon: Layers },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'customers', label: 'Clients (CRM)', icon: Users },
    { id: 'sales', label: 'Ventes & Stats', icon: TrendingUp },
    { id: 'reviews', label: 'Avis Clients', icon: Star },
    { id: 'content', label: 'Contenu du Site', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const handleNavClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-bbs-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-bbs-950 text-white border-b border-bbs-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="lg:hidden p-2 text-bbs-300 hover:text-white rounded-xl hover:bg-bbs-900 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-bbs-600 flex items-center justify-center text-bbs-950 font-bold shadow-lg shadow-gold-900/30">
                <span className="font-serif text-lg">B</span>
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wider text-white">
                  BBS <span className="font-sans text-xs font-normal text-gold-300">BY SALMA</span>
                </span>
                <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest bg-gold-500/20 text-gold-300 rounded-full border border-gold-400/30">
                  Manager Pro
                </span>
              </div>
            </div>
          </div>

          {/* Right actions: Store Link, Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Direct Link to Client Boutique */}
            <button
              onClick={onNavigateToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-bbs-200 hover:text-white bg-bbs-900 hover:bg-bbs-800 border border-bbs-700/60 rounded-xl transition-all shadow-sm"
              title="Voir la boutique publique"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Voir la Boutique</span>
            </button>

            {/* Notification Bell with live counter */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(prev => !prev)}
                className="relative p-2 text-bbs-200 hover:text-white hover:bg-bbs-900 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-bbs-900 rounded-2xl shadow-2xl border border-bbs-200 z-50 p-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-bbs-100 pb-3 mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-bbs-600" />
                      <span className="text-sm font-bold text-bbs-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-bbs-100 text-bbs-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} nouvelles
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-gold-600 hover:underline font-semibold"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-bbs-500 text-center py-6">Aucune notification pour le moment.</p>
                    ) : (
                      notifications.slice(0, 8).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.orderId) handleNavClick('orders');
                            setNotifDropdownOpen(false);
                          }}
                          className={`p-3 rounded-xl cursor-pointer transition-colors ${
                            n.read ? 'bg-bbs-50 hover:bg-bbs-100/70' : 'bg-gold-50/60 border border-gold-200/80 hover:bg-gold-50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-bbs-900">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-bbs-500">{n.time}</span>
                          </div>
                          <p className="text-xs text-bbs-600 mt-1">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-bbs-800">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-400/50 bg-bbs-800">
                <img
                  src={user?.avatar || '/assets/teint_marron.jpg'}
                  alt={user?.name || 'Salma'}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={logout}
                title="Se déconnecter"
                className="p-2 text-bbs-300 hover:text-rose-400 hover:bg-bbs-900 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-3xl p-4 shadow-sm border border-bbs-100 space-y-1">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-bbs-400">
              Navigation Gestion
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-bbs-900 text-white shadow-md shadow-bbs-950/20 translate-x-1'
                      : 'text-bbs-700 hover:bg-bbs-100/70 hover:text-bbs-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-300' : 'text-bbs-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-bbs-100">
              <div className="p-3 bg-gradient-to-br from-bbs-50 to-gold-50/50 rounded-2xl border border-bbs-200/60">
                <div className="flex items-center gap-2 text-xs font-bold text-bbs-900 mb-1">
                  <Smartphone className="w-4 h-4 text-bbs-600" />
                  Mode Mobile Optimisé
                </div>
                <p className="text-[11px] text-bbs-600">
                  Gérez vos commandes et ajoutez des photos directement depuis votre smartphone.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 flex flex-col z-10 animate-fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-bbs-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-bbs-900 text-gold-300 font-serif font-bold flex items-center justify-center">
                    B
                  </div>
                  <span className="font-serif font-bold text-bbs-950">BBS Admin</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-bbs-500 hover:text-bbs-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-bbs-900 text-white shadow-md'
                          : 'text-bbs-800 hover:bg-bbs-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-gold-300' : 'text-bbs-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-xs font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-bbs-100">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Quick-Action Bar (Smartphone UI) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-bbs-200 py-2 px-3 shadow-lg flex items-center justify-around">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'dashboard' ? 'text-bbs-900 font-bold' : 'text-bbs-500'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'text-bbs-900' : 'text-bbs-400'}`} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => handleNavClick('products')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'products' ? 'text-bbs-900 font-bold' : 'text-bbs-500'
          }`}
        >
          <Package className={`w-5 h-5 ${activeTab === 'products' ? 'text-bbs-900' : 'text-bbs-400'}`} />
          <span>Produits</span>
        </button>

        <button
          onClick={() => handleNavClick('orders')}
          className={`relative flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'orders' ? 'text-bbs-900 font-bold' : 'text-bbs-500'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'text-bbs-900' : 'text-bbs-400'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span>Commandes</span>
        </button>

        <button
          onClick={() => handleNavClick('collections')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] font-semibold transition-colors ${
            activeTab === 'collections' ? 'text-bbs-900 font-bold' : 'text-bbs-500'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${activeTab === 'collections' ? 'text-bbs-900' : 'text-bbs-400'}`} />
          <span>Gammes</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-[11px] font-semibold text-bbs-500 hover:text-bbs-900"
        >
          <Menu className="w-5 h-5 text-bbs-400" />
          <span>Plus</span>
        </button>
      </div>
    </div>
  );
};

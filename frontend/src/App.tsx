import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { Navbar } from './components/client/Navbar';
import { MobileBottomNav } from './components/client/MobileBottomNav';
import { PwaInstallPrompt } from './components/pwa/PwaInstallPrompt';
import { Footer } from './components/client/Footer';
import { CartDrawer } from './components/client/CartDrawer';
import { SearchModal } from './components/client/SearchModal';
import { HomePage } from './pages/client/HomePage';
import { ShopPage } from './pages/client/ShopPage';
import { ProductDetailPage } from './pages/client/ProductDetailPage';
import { CollectionDetailPage } from './pages/client/CollectionDetailPage';
import { CategoriesPage } from './pages/client/CategoriesPage';
import { AboutPage } from './pages/client/AboutPage';
import { ReviewsPage } from './pages/client/ReviewsPage';
import { ContactPage } from './pages/client/ContactPage';
import { CheckoutPage } from './pages/client/CheckoutPage';
import { OrderSuccessPage } from './pages/client/OrderSuccessPage';
import { OrderTrackingPage } from './pages/client/OrderTrackingPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCollectionsPage } from './pages/admin/AdminCollectionsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminSalesPage } from './pages/admin/AdminSalesPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { PremiumSplashScreen } from './components/splash/PremiumSplashScreen';
import { Order } from './types';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !window.location.pathname.startsWith('/admin');
  });
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [adminExtraProps, setAdminExtraProps] = useState<any>({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(() => {
    try {
      const saved = sessionStorage.getItem('bbs_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync with browser history if needed
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminTabChange = (tab: string, extra?: any) => {
    setAdminTab(tab);
    setAdminExtraProps(extra || {});
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    try {
      sessionStorage.setItem('bbs_last_order', JSON.stringify(order));
    } catch {}
    navigate('/confirmation-commande');
  };

  // --- PARTIE 2: ESPACE ADMINISTRATEUR ---
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => {
            navigate('/admin');
            setAdminTab('dashboard');
          }}
          onNavigateToStore={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        onTabChange={handleAdminTabChange}
        onNavigateToStore={() => navigate('/')}
      >
        {adminTab === 'dashboard' && <AdminDashboardPage onNavigate={handleAdminTabChange} />}
        {adminTab === 'products' && <AdminProductsPage initialOpenNew={adminExtraProps?.openNew} />}
        {adminTab === 'collections' && <AdminCollectionsPage initialOpenNew={adminExtraProps?.openNew} />}
        {adminTab === 'categories' && <AdminCategoriesPage />}
        {adminTab === 'orders' && <AdminOrdersPage />}
        {adminTab === 'customers' && <AdminCustomersPage />}
        {adminTab === 'sales' && <AdminSalesPage />}
        {adminTab === 'reviews' && <AdminReviewsPage />}
        {adminTab === 'content' && <AdminContentPage />}
        {adminTab === 'settings' && <AdminSettingsPage />}
      </AdminLayout>
    );
  }

  // --- PARTIE 1: SITE CLIENT (PUBLIC) ---
  const renderClientPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }
    if (currentPath === '/boutique') {
      return <ShopPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/produit/')) {
      const slug = currentPath.replace('/produit/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/gamme/')) {
      const slug = currentPath.replace('/gamme/', '');
      return <CollectionDetailPage slug={slug} onNavigate={navigate} />;
    }
    if (currentPath === '/categories') {
      return <CategoriesPage onNavigate={navigate} />;
    }
    if (currentPath === '/a-propos') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (currentPath === '/avis') {
      return <ReviewsPage onNavigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/panier' || currentPath === '/commande') {
      return <CheckoutPage onNavigate={navigate} onOrderSuccess={handleOrderSuccess} />;
    }
    if (currentPath === '/confirmation-commande' && confirmedOrder) {
      return <OrderSuccessPage order={confirmedOrder} onNavigate={navigate} />;
    }
    if (currentPath === '/suivi-commande') {
      return <OrderTrackingPage onNavigate={navigate} />;
    }

    // Default Fallback
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-nude-base flex flex-col font-sans selection:bg-bbs-300 selection:text-bbs-950">
      {/* Écran de démarrage d'exception BBS By Salma */}
      {showSplash && (
        <PremiumSplashScreen
          onComplete={() => {
            sessionStorage.setItem('bbs_splash_seen', 'true');
            setShowSplash(false);
          }}
        />
      )}

      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 pb-16 lg:pb-0">
        {renderClientPage()}
      </main>

      <Footer onNavigate={navigate} />

      {/* Mobile Bottom Navigation Bar matching mockup */}
      <MobileBottomNav
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <CartDrawer onNavigate={navigate} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* PWA Install Banner */}
      <PwaInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <NotificationProvider>
            <MainApp />
          </NotificationProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

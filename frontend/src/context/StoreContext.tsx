import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Collection, Category, SiteContent, StoreSettings } from '../types';
import { api } from '../services/api';

interface StoreContextType {
  products: Product[];
  collections: Collection[];
  categories: Category[];
  siteContent: SiteContent | null;
  settings: StoreSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshStore: () => Promise<void>;
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    try {
      setError(null);
      const [prods, cols, cats, content, sett] = await Promise.all([
        api.getProducts(),
        api.getCollections(),
        api.getCategories(),
        api.getSiteContent(),
        api.getSettings()
      ]);

      setProducts(prods);
      setCollections(cols);
      setCategories(cats);
      setSiteContent(content);
      setSettings(sett);
    } catch (err: any) {
      console.error('Failed to load store data:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const formatPrice = (amount: number): string => {
    const symbol = settings?.currencySymbol || 'FCFA';
    return `${new Intl.NumberFormat('fr-FR').format(amount)} ${symbol}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        collections,
        categories,
        siteContent,
        settings,
        isLoading,
        error,
        refreshStore: loadAll,
        formatPrice
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/client/ProductCard';

interface ShopPageProps {
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onNavigate }) => {
  const { products, collections, categories, formatPrice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceMax, setPriceMax] = useState<number>(50000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (p.status !== 'published') return false;

        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.shade && p.shade.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
        const matchesCol = selectedCollection === 'all' || p.collectionId === selectedCollection;
        const matchesSkin = selectedSkinType === 'all' || (p.skinType && p.skinType.toLowerCase().includes(selectedSkinType.toLowerCase()));
        const matchesPrice = (p.promoPrice || p.price) <= priceMax;

        return matchesSearch && matchesCat && matchesCol && matchesSkin && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return (a.promoPrice || a.price) - (b.promoPrice || b.price);
        if (sortBy === 'price_desc') return (b.promoPrice || b.price) - (a.promoPrice || a.price);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchTerm, selectedCategory, selectedCollection, selectedSkinType, priceMax, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedSkinType('all');
    setPriceMax(50000);
    setSortBy('featured');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedCollection !== 'all' || selectedSkinType !== 'all' || priceMax < 50000 || searchTerm !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-bbs-warm-gradient to-gold-50/50 p-8 sm:p-12 rounded-3xl border border-bbs-200 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-[11px] font-bold uppercase tracking-wider text-gold-700 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Catalogue Officiel BBS By Salma
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bbs-950">
          Toutes Nos Créations BBS By Salma
        </h1>
        <p className="text-xs sm:text-sm text-bbs-600 max-w-lg mx-auto">
          Laits de corps nourrissants et savons naturels d'exception formulés pour une peau douce, propre et éclatante.
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 py-3 px-4 bg-white border border-bbs-200 rounded-2xl text-xs font-bold text-bbs-900 shadow-sm flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-gold-600" />
            <span>Filtres ({filteredProducts.length} résultats)</span>
          </button>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="py-3 px-3 bg-white border border-bbs-200 rounded-2xl text-xs font-bold text-bbs-900 focus:outline-none"
          >
            <option value="featured">En Vedette</option>
            <option value="bestseller">Best-sellers</option>
            <option value="newest">Nouveautés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>

        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block bg-white rounded-3xl p-6 border border-bbs-100 shadow-sm space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-bbs-100">
            <h3 className="font-serif font-bold text-base text-bbs-950">Filtres</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bbs-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-bbs-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nom, nuance, formule..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Gamme / Collection Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bbs-700 mb-2">
              Gamme de Teint
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCollection('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCollection === 'all'
                    ? 'bg-bbs-900 text-white font-bold'
                    : 'text-bbs-700 hover:bg-bbs-50'
                }`}
              >
                Toutes les gammes
              </button>
              {collections.map(col => (
                <button
                  key={col.id}
                  onClick={() => setSelectedCollection(col.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedCollection === col.id
                      ? 'bg-bbs-900 text-white font-bold'
                      : 'text-bbs-700 hover:bg-bbs-50'
                  }`}
                >
                  <span>{col.name}</span>
                  <span className="text-[10px] opacity-70">({col.shade})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-bbs-700 mb-2">
              Rayon & Catégorie
            </label>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-bbs-900 text-white font-bold'
                    : 'text-bbs-700 hover:bg-bbs-50'
                }`}
              >
                Toutes les catégories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-bbs-900 text-white font-bold'
                      : 'text-bbs-700 hover:bg-bbs-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-bbs-700 mb-2">
              <span className="uppercase tracking-wider">Prix Maximum</span>
              <span className="text-gold-700 font-serif font-bold">{formatPrice(priceMax)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={priceMax}
              onChange={e => setPriceMax(Number(e.target.value))}
              className="w-full accent-bbs-900 cursor-pointer"
            />
          </div>
        </aside>

        {/* Products Grid Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Results Bar */}
          <div className="hidden lg:flex items-center justify-between pb-4 border-b border-bbs-100">
            <span className="text-xs text-bbs-600 font-semibold">
              <strong className="text-bbs-950 font-bold">{filteredProducts.length}</strong> produit(s) trouvé(s)
            </span>

            <div className="flex items-center gap-2 text-xs font-semibold text-bbs-700">
              <span>Trier par :</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white border border-bbs-200 rounded-xl text-xs font-bold text-bbs-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="featured">Mise en avant</option>
                <option value="bestseller">Best-sellers</option>
                <option value="newest">Nouveautés</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-bbs-100 space-y-3">
              <div className="w-16 h-16 rounded-full bg-bbs-50 text-bbs-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-bbs-950">Aucun produit ne correspond</h3>
              <p className="text-xs text-bbs-500 max-w-sm mx-auto">
                Essayez d'ajuster vos critères de recherche ou de réinitialiser les filtres pour voir l'ensemble de notre collection.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-bbs-900 text-white rounded-xl text-xs font-bold shadow"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full ml-auto p-6 shadow-2xl overflow-y-auto space-y-6 flex flex-col justify-between z-10 animate-fade-in text-xs">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-bbs-100">
                <h3 className="font-serif text-base font-bold text-bbs-950">Filtres Catalogue</h3>
                <button onClick={() => setMobileFilterOpen(false)}><X className="w-5 h-5 text-bbs-500" /></button>
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-2 uppercase">Gamme de Teint</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCollection('all')}
                    className={`w-full text-left p-2.5 rounded-xl font-semibold ${selectedCollection === 'all' ? 'bg-bbs-900 text-white' : 'bg-bbs-50'}`}
                  >
                    Toutes les gammes
                  </button>
                  {collections.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCollection(c.id)}
                      className={`w-full text-left p-2.5 rounded-xl font-semibold ${selectedCollection === c.id ? 'bg-bbs-900 text-white' : 'bg-bbs-50'}`}
                    >
                      {c.name} ({c.shade})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-2 uppercase">Catégorie</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left p-2.5 rounded-xl font-semibold ${selectedCategory === 'all' ? 'bg-bbs-900 text-white' : 'bg-bbs-50'}`}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left p-2.5 rounded-xl font-semibold ${selectedCategory === c.id ? 'bg-bbs-900 text-white' : 'bg-bbs-50'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-bbs-100 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 bg-bbs-900 text-white rounded-2xl font-bold shadow"
              >
                Afficher les {filteredProducts.length} résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

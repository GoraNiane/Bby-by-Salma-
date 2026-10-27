import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { products, collections, formatPrice } = useStore();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : products.filter(p =>
        p.status === 'published' &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
         p.description.toLowerCase().includes(query.toLowerCase()) ||
         (p.shade && p.shade.toLowerCase().includes(query.toLowerCase())))
      ).slice(0, 6);

  const filteredCollections = query.trim() === ''
    ? []
    : collections.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.shade.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectProduct = (slug: string) => {
    onClose();
    onNavigate(`/produit/${slug}`);
  };

  const handleSelectCollection = (slug: string) => {
    onClose();
    onNavigate(`/gamme/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div className="relative max-w-2xl w-full mx-auto mt-16 sm:mt-24 p-4 z-10 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-bbs-200 overflow-hidden">
          {/* Search Header Input */}
          <div className="p-4 sm:p-5 flex items-center gap-3 border-b border-bbs-100">
            <Search className="w-5 h-5 text-bbs-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Rechercher un produit, une gamme ou une teinte (ex: Fond de teint, Marron, Glow)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold text-bbs-950 placeholder:text-bbs-400 focus:outline-none bg-transparent"
            />
            <button onClick={onClose} className="p-1 text-bbs-400 hover:text-bbs-950">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results Area */}
          <div className="max-h-[65vh] overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
            {query.trim() === '' ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-bbs-500">Recherches populaires :</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Teint Parfait', 'Teint Noire', 'Teint Clair', 'Teint Marron', 'Fond de Teint', 'Poudre Compacte', 'Sérum Éclat'].map(t => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="px-3 py-1.5 bg-bbs-50 hover:bg-bbs-100 rounded-xl text-bbs-800 font-bold border border-bbs-200"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Collections matched */}
                {filteredCollections.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                      Gammes de Teint Correspondantes
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredCollections.map(col => (
                        <div
                          key={col.id}
                          onClick={() => handleSelectCollection(col.slug)}
                          className="flex items-center gap-3 p-2.5 bg-gold-50/50 hover:bg-gold-100/60 rounded-2xl border border-gold-200/60 cursor-pointer transition-colors"
                        >
                          <img src={col.coverImage} alt={col.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-bbs-950">{col.name}</div>
                            <div className="text-[11px] text-gold-800">{col.shade}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products matched */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-bbs-500">
                    Produits ({filteredProducts.length})
                  </div>
                  {filteredProducts.length === 0 && filteredCollections.length === 0 ? (
                    <p className="text-bbs-500 text-center py-6">Aucun résultat trouvé pour "{query}".</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredProducts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p.slug)}
                          className="flex items-center justify-between p-3 bg-bbs-50/60 hover:bg-bbs-100 rounded-2xl cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]?.url || '/assets/prod_fond_teint.jpg'}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover bg-white border border-bbs-200"
                            />
                            <div>
                              <div className="font-bold text-bbs-950">{p.name}</div>
                              <div className="text-[11px] text-bbs-500">
                                {p.shade && <span>{p.shade} • </span>}
                                <span>{p.brand}</span>
                              </div>
                            </div>
                          </div>
                          <div className="font-serif font-bold text-bbs-950">
                            {formatPrice(p.promoPrice || p.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

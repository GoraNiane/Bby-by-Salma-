import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Heart, ShoppingBag, ShieldCheck, CheckCircle } from 'lucide-react';
import { Collection, Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/client/ProductCard';

interface CollectionDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CollectionDetailPage: React.FC<CollectionDetailPageProps> = ({ slug, onNavigate }) => {
  const { collections, products, formatPrice } = useStore();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [activePhoto, setActivePhoto] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCollection() {
      try {
        setLoading(true);
        // Find in store first
        const found = collections.find(c => c.slug === slug || c.id === slug);
        if (found) {
          setCollection(found);
          setActivePhoto(found.coverImage || found.images[0] || '/assets/hero_banner.jpg');
        } else {
          const res = await api.getCollection(slug);
          setCollection(res);
          setActivePhoto(res.coverImage || res.images[0] || '/assets/hero_banner.jpg');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCollection();
  }, [slug, collections]);

  if (loading || !collection) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-bbs-300 border-t-bbs-900 rounded-full animate-spin" />
      </div>
    );
  }

  const associatedProducts = products.filter(p => p.collectionId === collection.id && p.status === 'published');
  const photoGallery = collection.images && collection.images.length > 0 ? collection.images : [collection.coverImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-16">
      {/* Back Button */}
      <div>
        <button
          onClick={() => onNavigate('/categories')}
          className="inline-flex items-center gap-2 text-xs font-bold text-bbs-700 hover:text-bbs-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Toutes les gammes</span>
        </button>
      </div>

      {/* Collection Hero Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bbs-100 shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Gallery Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-bbs-50 shadow-md border border-bbs-200">
              <img
                src={activePhoto}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-bbs-950/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                {collection.shade}
              </div>
            </div>

            {/* Thumbnails */}
            {photoGallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {photoGallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activePhoto === img ? 'border-gold-500 ring-2 ring-gold-200' : 'border-bbs-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Gamme ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Texts & Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-900 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              Gamme de Teint Officielle
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bbs-950">
              {collection.name}
            </h1>

            <p className="text-sm font-semibold text-gold-800 italic">
              {collection.shortDescription || 'Formulée sur-mesure pour sublimer cette carnation.'}
            </p>

            <p className="text-xs sm:text-sm text-bbs-700 leading-relaxed">
              {collection.description}
            </p>

            <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-200/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-bbs-950">Nuance Idéale</div>
                <div className="text-xs text-bbs-600">{collection.shade}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-bbs-950">{associatedProducts.length} Produits</div>
                <div className="text-xs text-gold-700 font-semibold">Gamme Complète</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Associated Products Grid */}
      <div className="space-y-6">
        <div className="border-b border-bbs-200 pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-bbs-950">
              Produits de la {collection.name}
            </h2>
            <p className="text-xs text-bbs-600">
              Chaque cosmétique ci-dessous a été rigoureusement sélectionné pour s'harmoniser avec cette gamme.
            </p>
          </div>
          <span className="text-xs font-bold text-bbs-900 bg-bbs-100 px-3 py-1 rounded-full">
            {associatedProducts.length} article(s)
          </span>
        </div>

        {associatedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-bbs-100 space-y-3">
            <p className="text-xs text-bbs-500">
              Aucun produit n'est actuellement associé à cette gamme.
            </p>
            <button
              onClick={() => onNavigate('/boutique')}
              className="px-6 py-2 bg-bbs-900 text-white rounded-xl text-xs font-bold shadow"
            >
              Découvrir la Boutique Complète
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {associatedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const { collections, categories } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 pb-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF6F1] border border-[#EAE0D5] rounded-full text-[11px] font-bold uppercase tracking-wider text-[#A86D44]">
          <Sparkles className="w-3.5 h-3.5 text-[#A86D44]" />
          Nos Univers de Soins
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1E140C]">
          Gammes & Catégories Corporelles
        </h1>
        <p className="text-xs sm:text-sm text-[#685A50]">
          Explorez nos collections de laits nourrissants et savons artisanaux formulés pour révéler l'éclat de votre peau.
        </p>
      </div>

      {/* 1. Gammes Signatures */}
      <div className="space-y-6">
        <div className="border-b border-[#EAE0D5] pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#1E140C]">
            Nos Gammes Signatures
          </h2>
          <p className="text-xs text-[#7A6E65]">Formules végétales d'exception pour le corps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col => (
            <div
              key={col.id}
              onClick={() => onNavigate(`/gamme/${col.slug}`)}
              className="group relative rounded-3xl overflow-hidden shadow-md bg-white border border-bbs-200 aspect-[4/3] flex flex-col justify-end p-6 cursor-pointer hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={col.coverImage || '/assets/hero_banner.jpg'}
                alt={col.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              <div className="relative z-10 space-y-1.5 text-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-bold">
                  {col.shade}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  {col.name}
                </h3>
                <p className="text-xs text-bbs-200 line-clamp-2">
                  {col.shortDescription || col.description}
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-gold-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Explorer cette gamme →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Rayons / Catégories */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-[#EAE0D5] pb-3">
          <h2 className="font-serif text-2xl font-bold text-[#1E140C]">
            Nos Catégories de Soins
          </h2>
          <p className="text-xs text-[#7A6E65]">Laits de corps et savons naturels pour une peau sublimée</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onNavigate('/boutique')}
              className="group bg-white rounded-3xl p-4 border border-bbs-100 shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-3"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-bbs-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-bbs-950 group-hover:text-gold-800 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-bbs-600 mt-1 line-clamp-2">
                  {cat.description || 'Découvrez nos cosmétiques haut de gamme.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Heart,
  Droplet,
  LayoutGrid,
  ChevronRight,
  MessageCircle,
  Star,
  Award
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/client/ProductCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { siteContent, products } = useStore();

  const bestSellers = products.filter(p => p.isBestSeller && p.status === 'published');
  const allPublished = products.filter(p => p.status === 'published');
  const displayProducts = bestSellers.length >= 3 ? bestSellers : allPublished;

  return (
    <div className="space-y-12 sm:space-y-20 pb-20">
      {/* 1. HERO SECTION - FULL-WIDTH EDGE-TO-EDGE IMMERSIVE BANNER */}
      <section className="relative w-full overflow-hidden bg-[#FAF6F1] border-b border-[#EAE0D5] flex items-center min-h-[480px] sm:min-h-[540px] lg:min-h-[600px]">
        {/* Full-width Background Image spanning entire width & height */}
        <div className="absolute inset-0 z-0">
          <img
            src={siteContent?.hero.bgImage || '/assets/hero_bodycare.jpg'}
            alt="BBS By Salma Soins Corporels & Savons Naturels"
            className="w-full h-full object-cover object-[74%_25%] sm:object-[78%_25%] lg:object-[82%_25%]"
          />
          {/* Subtle luxury gradient fade from warm nude on left to reveal radiant photo on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F1] via-[#FAF6F1]/90 sm:via-[#FAF6F1]/80 to-transparent/10 w-full" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF6F1] to-transparent pointer-events-none" />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-16">
          <div className="max-w-xl space-y-4 sm:space-y-5">
            {/* Badge: BBS BY SALMA */}
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E2D4C5] text-[#1E140C] text-[10.5px] font-extrabold tracking-widest uppercase shadow-xs">
              <span>{siteContent?.hero.badge || 'BBS BY SALMA'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] font-bold text-[#1E140C] leading-[1.08] tracking-tight">
              Votre peau mérite <br />
              <span className="font-serif italic font-normal text-[#A86D44]">le meilleur</span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-base text-[#685A50] max-w-lg leading-relaxed font-normal pt-1">
              {siteContent?.hero.subtitle ||
                'Des laits de corps nourrissants et des savons naturels pour une peau douce, propre et éclatante.'}
            </p>

            {/* CTA Buttons Side-by-Side */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onNavigate('/boutique');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#1E140C] hover:bg-[#2B1F16] text-white rounded-full text-xs sm:text-sm font-semibold shadow-xl shadow-[#1E140C]/20 flex items-center gap-2 active:scale-95 transition-all group cursor-pointer"
              >
                <span>{siteContent?.hero.ctaText || 'Découvrir la boutique'}</span>
                <ArrowRight className="w-4 h-4 text-[#E2C078] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  onNavigate('/categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-3.5 bg-white/90 hover:bg-white text-[#1E140C] border border-[#D9CEBF] rounded-full text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
              >
                <span>Nos produits</span>
                <LayoutGrid className="w-4 h-4 text-[#A86D44]" />
              </button>
            </div>
          </div>
        </div>

        {/* Handwritten Calligraphy Accent over the model on the right */}
        <div className="absolute bottom-7 right-5 sm:bottom-10 sm:right-12 lg:right-24 text-right pointer-events-none select-none z-10">
          <div className="font-script text-2xl sm:text-3xl lg:text-4xl text-white/95 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Naturellement <br />
            belle
          </div>
          <div className="text-white/90 text-sm mt-0.5 drop-shadow">♡</div>
        </div>

        {/* Carousel Pagination Dots Centered at bottom */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          <span className="w-7 h-2 rounded-full bg-[#A86D44] shadow-2xs" />
          <span className="w-2 h-2 rounded-full bg-[#D8C7B8]" />
          <span className="w-2 h-2 rounded-full bg-[#D8C7B8]" />
        </div>
      </section>

      {/* 2. "NOS CATÉGORIES" - 2 CARDS MATCHING MOCKUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E140C]">
            Nos catégories
          </h2>
          <button
            onClick={() => onNavigate('/categories')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B5E54] hover:text-[#1E140C] transition-colors cursor-pointer"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Visual Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: Laits de corps */}
          <div
            onClick={() => onNavigate('/categories')}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-[#EAE0D5] aspect-[16/11] sm:aspect-[4/3] bg-[#F7EFE8] cursor-pointer flex flex-col justify-between p-4 sm:p-5 transition-all duration-300"
          >
            <img
              src="/assets/cat_laits_corps.jpg"
              alt="Laits de corps BBS By Salma"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

            {/* Top-Left Floating Droplet Icon */}
            <div className="relative z-10 self-start w-10 h-10 rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 shadow-xs flex items-center justify-center text-[#1E140C]">
              <Droplet className="w-5 h-5 text-[#865934] stroke-[1.75]" />
            </div>

            {/* Bottom Floating Info Pill */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-lg border border-white/80 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E140C] leading-snug">
                  Laits de corps
                </h3>
                <p className="text-[11px] sm:text-xs text-[#7A6E65] font-normal">
                  Hydrate • Nourrit • Sublime
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1E140C] group-hover:bg-[#A86D44] text-white flex items-center justify-center shrink-0 shadow-md transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-[#E2C078]" />
              </div>
            </div>
          </div>

          {/* Card 2: Savons */}
          <div
            onClick={() => onNavigate('/categories')}
            className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-[#EAE0D5] aspect-[16/11] sm:aspect-[4/3] bg-[#F7EFE8] cursor-pointer flex flex-col justify-between p-4 sm:p-5 transition-all duration-300"
          >
            <img
              src="/assets/cat_savons.jpg"
              alt="Savons artisanaux BBS By Salma"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Soft Ambient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

            {/* Top-Left Floating Leaf Icon */}
            <div className="relative z-10 self-start w-10 h-10 rounded-2xl bg-white/85 backdrop-blur-md border border-white/70 shadow-xs flex items-center justify-center text-[#1E140C]">
              <Leaf className="w-5 h-5 text-[#865934] stroke-[1.75]" />
            </div>

            {/* Bottom Floating Info Pill */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-lg border border-white/80 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#1E140C] leading-snug">
                  Savons
                </h3>
                <p className="text-[11px] sm:text-xs text-[#7A6E65] font-normal">
                  Nettoie • Purifie • Adoucit
                </p>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#1E140C] group-hover:bg-[#A86D44] text-white flex items-center justify-center shrink-0 shadow-md transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-[#E2C078]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST REASSURANCE CARD - 4 PILLARS MATCHING MOCKUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF6F1] border border-[#EAE0D5] rounded-3xl p-5 sm:p-7 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 text-center">
            {/* Pillar 1: Produits naturels */}
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <Leaf className="w-6 h-6 text-[#1E140C] stroke-[1.6] mb-1" />
              <div className="font-bold text-[#1E140C] text-xs sm:text-sm">Produits naturels</div>
              <p className="text-[11px] text-[#7A6E65]">100% d'origine naturelle</p>
            </div>

            {/* Pillar 2: Produits authentiques */}
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <ShieldCheck className="w-6 h-6 text-[#1E140C] stroke-[1.6] mb-1" />
              <div className="font-bold text-[#1E140C] text-xs sm:text-sm">Produits authentiques</div>
              <p className="text-[11px] text-[#7A6E65]">Qualité garantie</p>
            </div>

            {/* Pillar 3: Livraison rapide */}
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <Truck className="w-6 h-6 text-[#1E140C] stroke-[1.6] mb-1" />
              <div className="font-bold text-[#1E140C] text-xs sm:text-sm">Livraison rapide</div>
              <p className="text-[11px] text-[#7A6E65]">Partout au Sénégal</p>
            </div>

            {/* Pillar 4: Satisfaction garantie */}
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <Heart className="w-6 h-6 text-[#1E140C] stroke-[1.6] mb-1" />
              <div className="font-bold text-[#1E140C] text-xs sm:text-sm">Satisfaction garantie</div>
              <p className="text-[11px] text-[#7A6E65]">Nos clientes nous font confiance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "MEILLEURES VENTES" - MATCHING MOCKUP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#A86D44]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E140C]">
              Meilleures ventes
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/boutique')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B5E54] hover:text-[#1E140C] transition-colors cursor-pointer"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 5. ABOUT BBS BY SALMA STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#EAE0D5] shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-lg border-2 border-[#EAE0D5]">
                <img
                  src={siteContent?.about.storyImage || '/assets/hero_bodycare.jpg'}
                  alt="Salma - Fondatrice BBS"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#A86D44]">
                BBS BY SALMA
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E140C]">
                {siteContent?.about.title || "L'excellence des soins corporels au naturel"}
              </h2>
              <p className="text-xs sm:text-sm text-[#685A50] leading-relaxed">
                {siteContent?.about.paragraph1 ||
                  "Chez BBS by Salma, nous sélectionnons des beurres végétaux précieux et des extraits botaniques bienfaisants pour créer des laits nourrissants et des savons artisanaux d'exception."}
              </p>
              <p className="text-xs sm:text-sm text-[#685A50] leading-relaxed">
                {siteContent?.about.paragraph2 ||
                  "Chaque formule est pensée pour respecter le film hydrolipidique, purifier sans assécher et apporter un velouté incomparable jour après jour."}
              </p>

              {/* 4 Value Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#EAE0D5]">
                <div className="text-center p-3 bg-[#FAF6F1] rounded-2xl border border-[#EAE0D5]/60">
                  <Sparkles className="w-5 h-5 text-[#A86D44] mx-auto mb-1" />
                  <div className="font-bold text-[#1E140C] text-xs">Formules saines</div>
                  <p className="text-[10px] text-[#7A6E65] mt-0.5">Ingrédients nobles</p>
                </div>

                <div className="text-center p-3 bg-[#FAF6F1] rounded-2xl border border-[#EAE0D5]/60">
                  <Heart className="w-5 h-5 text-[#A86D44] mx-auto mb-1" />
                  <div className="font-bold text-[#1E140C] text-xs">Douceur absolue</div>
                  <p className="text-[10px] text-[#7A6E65] mt-0.5">Peau satinée</p>
                </div>

                <div className="text-center p-3 bg-[#FAF6F1] rounded-2xl border border-[#EAE0D5]/60">
                  <Star className="w-5 h-5 text-[#A86D44] mx-auto mb-1" />
                  <div className="font-bold text-[#1E140C] text-xs">Fait avec amour</div>
                  <p className="text-[10px] text-[#7A6E65] mt-0.5">Savoir-faire artisanal</p>
                </div>

                <div className="text-center p-3 bg-[#FAF6F1] rounded-2xl border border-[#EAE0D5]/60">
                  <Award className="w-5 h-5 text-[#A86D44] mx-auto mb-1" />
                  <div className="font-bold text-[#1E140C] text-xs">Votre éclat</div>
                  <p className="text-[10px] text-[#7A6E65] mt-0.5">Notre priorité</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/a-propos')}
                  className="px-6 py-3.5 bg-[#1E140C] hover:bg-[#2B1F16] text-white rounded-2xl text-xs font-bold shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>En savoir plus</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E2C078]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP VIP ASSISTANCE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1E140C] text-white rounded-3xl p-7 sm:p-11 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3E2D20]">
          <div className="space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2C2117] text-[#E2C078] rounded-full text-xs font-bold border border-[#E2C078]/30">
              <MessageCircle className="w-3.5 h-3.5" />
              Service Clientèle VIP & Diagnostic Peau
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold">
              Besoin d'aide pour choisir votre routine ?
            </h3>
            <p className="text-xs sm:text-sm text-[#D1C3B7] max-w-xl">
              Salma vous conseille personnellement sur WhatsApp pour trouver le lait et le savon adaptés à votre type de peau.
            </p>
          </div>

          <a
            href={`https://wa.me/${siteContent?.contact.whatsapp ? siteContent.contact.whatsapp.replace(/\D/g, '') : '221770000000'}?text=${encodeURIComponent('Bonjour Salma, je souhaite un conseil personnalisé pour choisir mes soins corporels BBS ! ✨')}`}
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-full text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contacter Salma sur WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

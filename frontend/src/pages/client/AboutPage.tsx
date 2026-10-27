import React from 'react';
import { Sparkles, Heart, Star, Award, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { siteContent } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 pb-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gold-100 text-gold-900 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          La Maison BBS By Salma
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bbs-950">
          Célébrer la Splendeur de Toutes les Teintes
        </h1>
        <p className="text-sm sm:text-base text-bbs-700 leading-relaxed">
          Une marque née d'une conviction profonde : chaque femme mérite des cosmétiques nobles, sublimes et formulés spécifiquement pour son éclat singulier.
        </p>
      </div>

      {/* Founder Story */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-bbs-100 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={siteContent?.about.storyImage || '/assets/teint_marron.jpg'}
                alt="Salma, fondatrice BBS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-bbs-900 text-white p-4 rounded-2xl shadow-xl border border-gold-400">
              <div className="font-serif font-bold text-sm">Salma</div>
              <div className="text-[10px] text-gold-300">Fondatrice & Créatrice</div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-bbs-700 leading-relaxed">
            <div className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Le Mot de la Fondatrice
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bbs-950">
              "Votre beauté est une force, votre teinte est un trésor."
            </h2>
            <p>
              Pendant des années, trouver un fond de teint qui fusionne parfaitement avec les teints métissés, noirs profonds ou clairs dorés relevait du défi sous nos climats ensoleillés. Trop grisâtres, trop asséchants ou instables à la chaleur.
            </p>
            <p>
              BBS By Salma a été créé pour combler cette exigence : offrir des textures soyeuses, des pigments ultra-purs et des formules enrichies en soins bienfaisants pour que votre maquillage soit à la fois un rehausseur d'éclat et un geste d'amour envers votre peau.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-bbs-100 text-center">
              <div className="p-3 bg-bbs-50 rounded-2xl">
                <div className="font-serif text-2xl font-bold text-bbs-950">{siteContent?.about.stat1Value || '100%'}</div>
                <div className="text-[11px] text-bbs-500 font-semibold">{siteContent?.about.stat1Label || 'Authenticité'}</div>
              </div>
              <div className="p-3 bg-bbs-50 rounded-2xl">
                <div className="font-serif text-2xl font-bold text-bbs-950">{siteContent?.about.stat2Value || '3 Teintes'}</div>
                <div className="text-[11px] text-bbs-500 font-semibold">{siteContent?.about.stat2Label || 'Clair, Marron, Noir'}</div>
              </div>
              <div className="p-3 bg-bbs-50 rounded-2xl">
                <div className="font-serif text-2xl font-bold text-bbs-950">{siteContent?.about.stat3Value || '5 000+'}</div>
                <div className="text-[11px] text-bbs-500 font-semibold">{siteContent?.about.stat3Label || 'Femmes sublimées'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-bbs-950">
          Prête à révéler votre éclat ?
        </h3>
        <button
          onClick={() => onNavigate('/boutique')}
          className="px-8 py-4 bg-bbs-900 hover:bg-bbs-800 text-white rounded-2xl font-bold text-xs shadow-xl inline-flex items-center gap-2"
        >
          <span>Découvrir notre collection</span>
          <ArrowRight className="w-4 h-4 text-gold-300" />
        </button>
      </div>
    </div>
  );
};

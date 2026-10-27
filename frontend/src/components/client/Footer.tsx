import React from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  Heart
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { siteContent, collections } = useStore();

  const handleLink = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-bbs-950 text-bbs-200 border-t border-bbs-800 font-sans">
      {/* Upper Guarantees Bar */}
      <div className="border-b border-bbs-800/80 py-10 bg-bbs-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 bg-gold-500/10 text-gold-400 rounded-2xl border border-gold-400/20">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Livraison Rapide</h4>
                <p className="text-[11px] text-bbs-300 mt-0.5">Partout au Sénégal en 24h & Monde</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 bg-gold-500/10 text-gold-400 rounded-2xl border border-gold-400/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">100% Authentique</h4>
                <p className="text-[11px] text-bbs-300 mt-0.5">Formules testées et certifiées</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 bg-gold-500/10 text-gold-400 rounded-2xl border border-gold-400/20">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Conseil 7j/7</h4>
                <p className="text-[11px] text-bbs-300 mt-0.5">Assistance beauté sur WhatsApp</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-3 bg-gold-500/10 text-gold-400 rounded-2xl border border-gold-400/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Paiement Flexible</h4>
                <p className="text-[11px] text-bbs-300 mt-0.5">À la livraison, Wave ou Orange Money</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gold-500 text-bbs-950 font-serif text-xl font-bold flex items-center justify-center shadow-lg">
                B
              </div>
              <div>
                <span className="font-serif text-2xl font-bold text-white tracking-wide">
                  BBS <span className="text-gold-400 font-sans text-xs">BY SALMA</span>
                </span>
                <p className="text-[10px] text-gold-300 uppercase tracking-widest font-bold">
                  Votre beauté en toutes teintes
                </p>
              </div>
            </div>

            <p className="text-xs text-bbs-300 leading-relaxed max-w-sm">
              BBS By Salma est une maison de cosmétiques d'exception dédiée à la valorisation de chaque carnation : teint clair, teint marron, teint noir. Révélez votre éclat naturel.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteContent?.contact.whatsapp ? `https://wa.me/${siteContent.contact.whatsapp.replace(/\D/g, '')}` : 'https://wa.me/221770000000'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-bbs-900 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={siteContent?.contact.instagram || 'https://instagram.com/bbs_by_salma'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-bbs-900 hover:bg-pink-600 text-white flex items-center justify-center transition-colors shadow"
                title="Instagram"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
              <a
                href={siteContent?.contact.tiktok || 'https://tiktok.com/@bbs_by_salma'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-bbs-900 hover:bg-black text-white flex items-center justify-center transition-colors shadow"
                title="TikTok"
              >
                <span className="text-xs font-bold">TT</span>
              </a>
            </div>
          </div>

          {/* Gammes & Teintes */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gold-300">
              Nos Gammes
            </h4>
            <ul className="space-y-2">
              {collections.map(col => (
                <li key={col.id}>
                  <button
                    onClick={() => handleLink(`/gamme/${col.slug}`)}
                    className="hover:text-gold-300 transition-colors text-left"
                  >
                    {col.name} ({col.shade})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Boutique */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gold-300">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleLink('/boutique')} className="hover:text-white transition-colors">Tous les Produits</button></li>
              <li><button onClick={() => handleLink('/categories')} className="hover:text-white transition-colors">Catégories de Maquillage</button></li>
              <li><button onClick={() => handleLink('/a-propos')} className="hover:text-white transition-colors">L'Histoire de Salma</button></li>
              <li><button onClick={() => handleLink('/avis')} className="hover:text-white transition-colors">Témoignages & Avis</button></li>
              <li><button onClick={() => handleLink('/contact')} className="hover:text-white transition-colors">Nous Contacter</button></li>
              <li><button onClick={() => handleLink('/suivi-commande')} className="hover:text-white transition-colors text-gold-300 font-semibold">Suivre ma commande</button></li>
            </ul>
          </div>

          {/* Contact & Dakar Boutique */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider text-gold-300">
              Boutique Dakar
            </h4>
            <ul className="space-y-2.5 text-bbs-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{siteContent?.contact.address || 'Almadies, Dakar, Sénégal'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{siteContent?.contact.phone || '+221 77 000 00 00'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{siteContent?.contact.email || 'contact@bbsbysalma.com'}</span>
              </li>
              <li className="pt-1 text-[11px] text-bbs-400">
                {siteContent?.contact.openingHours || 'Lun - Sam : 09h00 - 20h00'}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="mt-12 pt-6 border-t border-bbs-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bbs-400">
          <div>
            © {new Date().getFullYear()} BBS By Salma. Tous droits réservés. Dakar, Sénégal.
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-bbs-300">
            <span className="px-2 py-1 bg-bbs-900 rounded-lg border border-bbs-800">Wave Sénégal</span>
            <span className="px-2 py-1 bg-bbs-900 rounded-lg border border-bbs-800">Orange Money</span>
            <span className="px-2 py-1 bg-bbs-900 rounded-lg border border-bbs-800">Paiement à la livraison</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

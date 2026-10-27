import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { siteContent } = useStore();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const whatsappPhone = siteContent?.contact.whatsapp?.replace(/\D/g, '') || '221770000000';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 pb-20 font-sans">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 rounded-full text-xs font-bold uppercase tracking-wider text-gold-900">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          À Votre Écoute
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bbs-950">
          Contactez Salma & Son Équipe
        </h1>
        <p className="text-xs sm:text-sm text-bbs-600">
          Une question sur nos teintes, une commande spéciale ou un conseil personnalisé ? Nous vous répondons avec joie.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Information Cards */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* WhatsApp Direct Hero Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <MessageCircle className="w-5 h-5" />
              <span>Assistance Directe WhatsApp</span>
            </div>
            <p className="text-bbs-100 leading-relaxed">
              Le moyen le plus rapide pour obtenir un conseil teinte ou le suivi immédiat de votre commande.
            </p>
            <a
              href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent('Bonjour Salma, je souhaite un renseignement sur vos produits ! ✨')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow"
            >
              <MessageCircle className="w-4 h-4" />
              Ouvrir WhatsApp (+{whatsappPhone})
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-bbs-950">Nos Coordonnées</h3>

            <div className="space-y-3 text-bbs-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-600 mt-0.5" />
                <div>
                  <strong>Boutique & Showroom Dakar :</strong>
                  <p>{siteContent?.contact.address || 'Almadies, Route de la Corniche Ouest, Dakar'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-600" />
                <div>
                  <strong>Téléphone :</strong> {siteContent?.contact.phone || '+221 77 000 00 00'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-600" />
                <div>
                  <strong>Email :</strong> {siteContent?.contact.email || 'contact@bbsbysalma.com'}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold-600 mt-0.5" />
                <div>
                  <strong>Horaires :</strong>
                  <p>{siteContent?.contact.openingHours || 'Lundi - Samedi : 09h00 - 20h00'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-bbs-100 shadow-xl text-xs">
          <h2 className="font-serif text-xl font-bold text-bbs-950 mb-2">Envoyez-nous un Message</h2>
          <p className="text-bbs-500 mb-6">Nous vous répondrons dans les plus brefs délais.</p>

          {sent ? (
            <div className="p-8 bg-emerald-50 rounded-2xl text-center space-y-2 text-emerald-800">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-base font-bold">Message envoyé avec succès !</h3>
              <p className="text-xs">Merci de nous avoir contactés. Nous reviendrons vers vous très vite.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Fatou Bintou"
                    className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ex: +221 77 000 00 00"
                    className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Adresse Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Sujet de votre message</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="ex: Renseignement sur le fond de teint Caramel"
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Votre Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Écrivez votre message ici..."
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-2xl shadow flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-gold-300" />
                <span>Envoyer le Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, Smartphone, RefreshCw } from 'lucide-react';
import { SiteContent } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { PhotoUploader, UploadedPhoto } from '../../components/admin/PhotoUploader';

export const AdminContentPage: React.FC = () => {
  const { siteContent, refreshStore } = useStore();
  const [formData, setFormData] = useState<SiteContent | null>(null);
  const [heroPhotos, setHeroPhotos] = useState<UploadedPhoto[]>([]);
  const [aboutPhotos, setAboutPhotos] = useState<UploadedPhoto[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (siteContent) {
      setFormData(siteContent);
      setHeroPhotos([{ id: 'hero_img', url: siteContent.hero.bgImage, isPrimary: true, position: 1 }]);
      setAboutPhotos([{ id: 'about_img', url: siteContent.about.storyImage, isPrimary: true, position: 1 }]);
    }
  }, [siteContent]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      let heroBg = formData.hero.bgImage;
      if (heroPhotos.length > 0 && heroPhotos[0].file) {
        heroBg = await api.uploadSinglePhoto(heroPhotos[0].file);
      } else if (heroPhotos.length > 0) {
        heroBg = heroPhotos[0].url;
      }

      let aboutImg = formData.about.storyImage;
      if (aboutPhotos.length > 0 && aboutPhotos[0].file) {
        aboutImg = await api.uploadSinglePhoto(aboutPhotos[0].file);
      } else if (aboutPhotos.length > 0) {
        aboutImg = aboutPhotos[0].url;
      }

      const updatedPayload: Partial<SiteContent> = {
        ...formData,
        hero: {
          ...formData.hero,
          bgImage: heroBg
        },
        about: {
          ...formData.about,
          storyImage: aboutImg
        }
      };

      await api.updateSiteContent(updatedPayload);
      await refreshStore();
      setNotification('✓ Contenu du site mis à jour en direct !');
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-bbs-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-gold-400 text-xs font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-bbs-950">
            Contenu du Site (CMS Visuel)
          </h1>
          <p className="text-xs text-bbs-600">
            Modifiez vos textes d'accueil, bannières et coordonnées sans toucher au code source
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-bbs-900 hover:bg-bbs-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-bbs-950/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Publication...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-gold-300" />
              <span>Publier sur le Site</span>
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Section 1: Hero Banner (Accueil) */}
        <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-bbs-100 pb-3">
            <div>
              <h2 className="font-serif text-base font-bold text-bbs-950">Bannière Principale (Hero)</h2>
              <p className="text-[11px] text-bbs-500">Visible en haut de votre page d'accueil</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-bbs-900 mb-1">Badge d'en-tête</label>
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={e => setFormData({
                    ...formData,
                    hero: { ...formData.hero, badge: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Grand Titre Hero</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={e => setFormData({
                    ...formData,
                    hero: { ...formData.hero, title: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Sous-titre / Description</label>
                <textarea
                  rows={2}
                  value={formData.hero.subtitle}
                  onChange={e => setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Texte du Bouton</label>
                  <input
                    type="text"
                    value={formData.hero.ctaText}
                    onChange={e => setFormData({
                      ...formData,
                      hero: { ...formData.hero, ctaText: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Lien du Bouton</label>
                  <input
                    type="text"
                    value={formData.hero.ctaLink}
                    onChange={e => setFormData({
                      ...formData,
                      hero: { ...formData.hero, ctaLink: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className="block font-bold text-bbs-900 mb-2">Photo d'ambiance Hero</label>
              <PhotoUploader photos={heroPhotos} onChange={setHeroPhotos} maxPhotos={1} />
            </div>
          </div>
        </div>

        {/* Section 2: Promo Announcement Bar */}
        <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-bbs-100 pb-3">
            <h2 className="font-serif text-base font-bold text-bbs-950">Bandeau Défilant Supérieur (Annonces & Livraisons)</h2>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-bbs-900">
              <input
                type="checkbox"
                checked={formData.promoBanner.enabled}
                onChange={e => setFormData({
                  ...formData,
                  promoBanner: { ...formData.promoBanner, enabled: e.target.checked }
                })}
                className="rounded text-gold-600 focus:ring-gold-500"
              />
              <span>Activer le bandeau</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-bbs-900 mb-1">Message du bandeau</label>
            <input
              type="text"
              value={formData.promoBanner.text}
              onChange={e => setFormData({
                ...formData,
                promoBanner: { ...formData.promoBanner, text: e.target.value }
              })}
              className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
            />
          </div>
        </div>

        {/* Section 3: About Story & Mission */}
        <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4">
          <div className="border-b border-bbs-100 pb-3">
            <h2 className="font-serif text-base font-bold text-bbs-950">Présentation & Histoire (À Propos)</h2>
            <p className="text-[11px] text-bbs-500">Votre vision de la beauté inclusive pour chaque carnation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-bbs-900 mb-1">Titre de section</label>
                <input
                  type="text"
                  value={formData.about.title}
                  onChange={e => setFormData({
                    ...formData,
                    about: { ...formData.about, title: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Paragraphe 1</label>
                <textarea
                  rows={2}
                  value={formData.about.paragraph1}
                  onChange={e => setFormData({
                    ...formData,
                    about: { ...formData.about, paragraph1: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Paragraphe 2</label>
                <textarea
                  rows={2}
                  value={formData.about.paragraph2}
                  onChange={e => setFormData({
                    ...formData,
                    about: { ...formData.about, paragraph2: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-2">Photo d'illustration</label>
              <PhotoUploader photos={aboutPhotos} onChange={setAboutPhotos} maxPhotos={1} />
            </div>
          </div>
        </div>

        {/* Section 4: Contact & Socials */}
        <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4">
          <div className="border-b border-bbs-100 pb-3">
            <h2 className="font-serif text-base font-bold text-bbs-950">Coordonnées, WhatsApp & Réseaux Sociaux</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-bbs-900 mb-1">Numéro WhatsApp</label>
              <input
                type="text"
                value={formData.contact.whatsapp}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, whatsapp: e.target.value }
                })}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Téléphone Appel Direct</label>
              <input
                type="text"
                value={formData.contact.phone}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value }
                })}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Email Boutique</label>
              <input
                type="email"
                value={formData.contact.email}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Adresse Boutique</label>
              <input
                type="text"
                value={formData.contact.address}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, address: e.target.value }
                })}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Lien Instagram</label>
              <input
                type="text"
                value={formData.contact.instagram}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, instagram: e.target.value }
                })}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Lien TikTok</label>
              <input
                type="text"
                value={formData.contact.tiktok}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, tiktok: e.target.value }
                })}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-2xl shadow-xl shadow-bbs-950/20 text-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-gold-300" />
            <span>Enregistrer toutes les modifications</span>
          </button>
        </div>
      </form>
    </div>
  );
};

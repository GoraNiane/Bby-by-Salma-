import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, X, RefreshCw } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { PhotoUploader, UploadedPhoto } from '../../components/admin/PhotoUploader';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, refreshStore } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '/assets/hero_banner.jpg'
  });
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '/assets/hero_banner.jpg' });
    setPhotos([]);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description, image: cat.image });
    setPhotos([{ id: 'cat_img', url: cat.image, isPrimary: true, position: 1 }]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSaving(true);
    try {
      let finalImg = formData.image;
      if (photos.length > 0 && photos[0].file) {
        finalImg = await api.uploadSinglePhoto(photos[0].file);
      } else if (photos.length > 0) {
        finalImg = photos[0].url;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        image: finalImg
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        setNotification('✓ Catégorie modifiée.');
      } else {
        await api.createCategory(payload);
        setNotification('✓ Nouvelle catégorie créée.');
      }

      await refreshStore();
      setIsModalOpen(false);
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Supprimer la catégorie "${name}" ?`)) {
      try {
        await api.deleteCategory(id);
        await refreshStore();
        setNotification('✓ Catégorie supprimée.');
        setTimeout(() => setNotification(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Erreur');
      }
    }
  };

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
            Gestion des Catégories
          </h1>
          <p className="text-xs text-bbs-600">
            Rayons et classifications de la boutique
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-bbs-900 hover:bg-bbs-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-bbs-950/20"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          + Nouvelle Catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;
          return (
            <div key={cat.id} className="bg-white rounded-3xl border border-bbs-100 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="aspect-[4/3] bg-bbs-100 overflow-hidden relative">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-serif font-bold text-base">{cat.name}</h3>
                    <p className="text-[11px] text-gold-300 font-semibold">{count} produit(s)</p>
                  </div>
                </div>
                <div className="p-4 text-xs text-bbs-600">
                  {cat.description || 'Catégorie de produits de beauté.'}
                </div>
              </div>

              <div className="px-4 py-2.5 bg-bbs-50/60 border-t border-bbs-100 flex items-center justify-end gap-1">
                <button onClick={() => openEditModal(cat)} className="p-1.5 text-bbs-700 hover:bg-bbs-200 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-bbs-100">
              <h3 className="font-serif text-base font-bold text-bbs-950">
                {editingCategory ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-bbs-500" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <PhotoUploader photos={photos} onChange={setPhotos} maxPhotos={1} />
              <div>
                <label className="block font-bold text-bbs-900 mb-1">Nom de la catégorie *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-bbs-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-bbs-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-bbs-100 rounded-xl font-bold">Annuler</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 bg-bbs-900 text-white rounded-xl font-bold">
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

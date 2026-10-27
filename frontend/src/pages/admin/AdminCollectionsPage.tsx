import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  Package,
  Layers,
  X,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Collection, Category, Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { PhotoUploader, UploadedPhoto } from '../../components/admin/PhotoUploader';

interface AdminCollectionsPageProps {
  initialOpenNew?: boolean;
}

export const AdminCollectionsPage: React.FC<AdminCollectionsPageProps> = ({ initialOpenNew = false }) => {
  const { collections, categories, products, refreshStore } = useStore();
  const [collectionList, setCollectionList] = useState<Collection[]>(collections);
  const [isModalOpen, setIsModalOpen] = useState(initialOpenNew);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'cat_teint',
    shade: '',
    shortDescription: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    isFeatured: true
  });

  const [formPhotos, setFormPhotos] = useState<UploadedPhoto[]>([]);

  useEffect(() => {
    setCollectionList(collections);
  }, [collections]);

  const openCreateModal = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      categoryId: categories[0]?.id || 'cat_teint',
      shade: '',
      shortDescription: '',
      description: '',
      status: 'active',
      isFeatured: true
    });
    setFormPhotos([]);
    setIsModalOpen(true);
  };

  const openEditModal = (col: Collection) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      categoryId: col.categoryId,
      shade: col.shade,
      shortDescription: col.shortDescription || '',
      description: col.description || '',
      status: col.status,
      isFeatured: col.isFeatured
    });

    const photoList: UploadedPhoto[] = (col.images && col.images.length > 0 ? col.images : [col.coverImage]).map((url, idx) => ({
      id: `img_${idx}`,
      url,
      isPrimary: idx === 0,
      position: idx + 1
    }));
    setFormPhotos(photoList);
    setIsModalOpen(true);
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Veuillez renseigner le nom de la gamme.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Process photos
      const finalImageUrls: string[] = [];

      for (let i = 0; i < formPhotos.length; i++) {
        const photo = formPhotos[i];
        if (photo.file) {
          try {
            const uploadedUrl = await api.uploadSinglePhoto(photo.file);
            finalImageUrls.push(uploadedUrl);
          } catch (err) {
            finalImageUrls.push(photo.url);
          }
        } else {
          finalImageUrls.push(photo.url);
        }
      }

      if (finalImageUrls.length === 0) {
        finalImageUrls.push('/assets/hero_banner.jpg');
      }

      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        shade: formData.shade,
        shortDescription: formData.shortDescription,
        description: formData.description,
        coverImage: finalImageUrls[0],
        images: finalImageUrls,
        status: formData.status,
        isFeatured: formData.isFeatured
      };

      if (editingCollection) {
        await api.updateCollection(editingCollection.id, payload);
        setNotification('✓ Gamme mise à jour avec succès.');
      } else {
        await api.createCollection(payload);
        setNotification('✓ Nouvelle gamme créée avec succès.');
      }

      await refreshStore();
      setIsModalOpen(false);

      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’enregistrement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûre de vouloir supprimer la gamme "${name}" ? Les produits associés resteront dans la boutique.`)) {
      try {
        await api.deleteCollection(id);
        await refreshStore();
        setNotification('✓ Gamme supprimée.');
        setTimeout(() => setNotification(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-bbs-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-gold-400 text-xs font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-bbs-950">
            Gestion des Gammes & Collections
          </h1>
          <p className="text-xs text-bbs-600">
            Organisez vos produits par gamme de teint (Teint Clair, Teint Noire, Teint Marron...)
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-bbs-900 hover:bg-bbs-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-bbs-950/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          + Ajouter une Gamme
        </button>
      </div>

      {/* Collections Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectionList.map(col => {
          const associatedProducts = products.filter(p => p.collectionId === col.id);
          const category = categories.find(c => c.id === col.categoryId);

          return (
            <div
              key={col.id}
              className="bg-white rounded-3xl border border-bbs-100 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Cover Image & Multi-photos */}
                <div className="relative aspect-[16/10] overflow-hidden bg-bbs-100">
                  <img
                    src={col.coverImage || col.images[0] || '/assets/hero_banner.jpg'}
                    alt={col.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      col.status === 'active'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}>
                      {col.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Shade Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-bbs-950 px-2.5 py-1 rounded-full text-[10px] font-bold shadow">
                    {col.shade}
                  </div>

                  {/* Title on bottom of cover */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <div className="text-[10px] uppercase font-bold text-gold-300">
                      {category?.name || 'Teint'}
                    </div>
                    <h3 className="font-serif text-lg font-bold">
                      {col.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-bbs-700 line-clamp-2">
                    {col.shortDescription || col.description}
                  </p>

                  {/* Associated Products List */}
                  <div className="p-3 bg-bbs-50 rounded-2xl border border-bbs-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-bbs-900">
                      <span className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-bbs-600" />
                        Produits associés ({associatedProducts.length})
                      </span>
                    </div>

                    {associatedProducts.length === 0 ? (
                      <p className="text-[11px] text-bbs-500">Aucun produit associé à cette gamme.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                        {associatedProducts.map(p => (
                          <div key={p.id} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded-lg border border-bbs-100">
                            <span className="font-semibold text-bbs-900 truncate max-w-[160px]">{p.name}</span>
                            <span className="text-bbs-500 font-bold whitespace-nowrap">{p.stock} en stock</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="px-5 py-3 bg-bbs-50/50 border-t border-bbs-100 flex items-center justify-between">
                <a
                  href={`/gamme/${col.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 hover:text-gold-900"
                >
                  <ExternalLink className="w-3 h-3" />
                  Page Publique
                </a>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(col)}
                    className="p-1.5 text-bbs-700 hover:bg-bbs-200/60 rounded-xl transition-colors"
                    title="Modifier la gamme"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCollection(col.id, col.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT COLLECTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-bbs-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-bbs-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-300" />
                <h2 className="font-serif text-lg font-bold">
                  {editingCollection ? 'Modifier la Gamme' : 'Ajouter une Gamme de Beauté'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-bbs-300 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Photo Uploader */}
              <div className="p-4 bg-bbs-50/80 rounded-2xl border border-bbs-200">
                <PhotoUploader
                  photos={formPhotos}
                  onChange={setFormPhotos}
                  maxPhotos={5}
                />
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Nom de la Gamme *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Collection Teint Parfait, Teint Clair..."
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Teinte / Nuance ciblée
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Marron, Ébène, Doré, Clair..."
                    value={formData.shade}
                    onChange={e => setFormData({ ...formData, shade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Accroche / Slogan
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Éclat, fraîcheur, naturel"
                    value={formData.shortDescription}
                    onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Description Détaillée
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Une collection spécialement sélectionnée pour..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Statut de la Gamme
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Masquée)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-bbs-900">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span>Mettre en avant sur la page d'accueil</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-bbs-100 hover:bg-bbs-200 text-bbs-800 font-bold rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-xl shadow-lg shadow-bbs-950/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>{editingCollection ? 'Mettre à Jour' : 'Créer la Gamme'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

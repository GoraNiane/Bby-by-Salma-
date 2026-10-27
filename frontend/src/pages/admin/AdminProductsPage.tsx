import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  X,
  RefreshCw,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Product, ProductImage, Collection, Category } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { PhotoUploader, UploadedPhoto } from '../../components/admin/PhotoUploader';

interface AdminProductsPageProps {
  initialOpenNew?: boolean;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({ initialOpenNew = false }) => {
  const { products, collections, categories, formatPrice, refreshStore } = useStore();
  const [productList, setProductList] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(initialOpenNew);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    brand: 'BBS By Salma',
    categoryId: 'cat_teint',
    collectionId: '',
    shortDescription: '',
    description: '',
    price: '',
    oldPrice: '',
    promoPrice: '',
    stock: '15',
    alertThreshold: '5',
    shade: '',
    skinType: 'Tous types de peau',
    ingredients: '',
    isFeatured: true,
    isNew: false,
    isBestSeller: false,
    status: 'published' as 'published' | 'draft' | 'hidden'
  });

  const [formPhotos, setFormPhotos] = useState<UploadedPhoto[]>([]);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `BBS-${Math.floor(1000 + Math.random() * 9000)}`,
      brand: 'BBS By Salma',
      categoryId: categories[0]?.id || 'cat_teint',
      collectionId: collections[0]?.id || '',
      shortDescription: '',
      description: '',
      price: '',
      oldPrice: '',
      promoPrice: '',
      stock: '20',
      alertThreshold: '5',
      shade: '',
      skinType: 'Tous types de peau',
      ingredients: '',
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      status: 'published'
    });
    setFormPhotos([]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      sku: prod.sku,
      brand: prod.brand,
      categoryId: prod.categoryId,
      collectionId: prod.collectionId || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      price: prod.price.toString(),
      oldPrice: prod.oldPrice ? prod.oldPrice.toString() : '',
      promoPrice: prod.promoPrice ? prod.promoPrice.toString() : '',
      stock: prod.stock.toString(),
      alertThreshold: prod.alertThreshold.toString(),
      shade: prod.shade || '',
      skinType: prod.skinType || 'Tous types de peau',
      ingredients: prod.ingredients || '',
      isFeatured: prod.isFeatured,
      isNew: prod.isNew,
      isBestSeller: prod.isBestSeller,
      status: prod.status
    });

    const existingPhotos: UploadedPhoto[] = prod.images.map((img, idx) => ({
      id: img.id,
      url: img.url,
      isPrimary: img.isPrimary,
      position: img.position || idx + 1
    }));
    setFormPhotos(existingPhotos);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Veuillez renseigner le nom et le prix du produit.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Process and upload any new blob/local photos
      const finalImages: ProductImage[] = [];

      for (let i = 0; i < formPhotos.length; i++) {
        const photo = formPhotos[i];
        if (photo.file) {
          // Upload file to server
          try {
            const uploadedUrl = await api.uploadSinglePhoto(photo.file);
            finalImages.push({
              id: `img_${Date.now()}_${i}`,
              url: uploadedUrl,
              isPrimary: photo.isPrimary,
              position: i + 1
            });
          } catch (uploadErr) {
            console.error('Upload error, fallback to URL:', uploadErr);
            finalImages.push({
              id: photo.id,
              url: photo.url,
              isPrimary: photo.isPrimary,
              position: i + 1
            });
          }
        } else {
          finalImages.push({
            id: photo.id,
            url: photo.url,
            isPrimary: photo.isPrimary,
            position: i + 1
          });
        }
      }

      // If no images provided, add a default placeholder
      if (finalImages.length === 0) {
        finalImages.push({
          id: `img_def_${Date.now()}`,
          url: '/assets/prod_fond_teint.jpg',
          isPrimary: true,
          position: 1
        });
      }

      const payload = {
        name: formData.name,
        sku: formData.sku,
        brand: formData.brand,
        categoryId: formData.categoryId,
        collectionId: formData.collectionId || undefined,
        shortDescription: formData.shortDescription,
        description: formData.description,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        promoPrice: formData.promoPrice ? Number(formData.promoPrice) : undefined,
        stock: Number(formData.stock) || 0,
        alertThreshold: Number(formData.alertThreshold) || 5,
        shade: formData.shade,
        skinType: formData.skinType,
        ingredients: formData.ingredients,
        images: finalImages,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        isBestSeller: formData.isBestSeller,
        status: formData.status
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        setNotification('✓ Produit modifié avec succès.');
      } else {
        await api.createProduct(payload);
        setNotification('✓ Nouveau produit ajouté avec succès.');
      }

      await refreshStore();
      setIsModalOpen(false);

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l’enregistrement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûre de vouloir supprimer définitivement "${name}" ?`)) {
      try {
        await api.deleteProduct(id);
        await refreshStore();
        setNotification('✓ Produit supprimé.');
        setTimeout(() => setNotification(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleStockInlineChange = async (id: string, newStock: number) => {
    try {
      await api.updateProductStock(id, newStock);
      await refreshStore();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products list
  const filteredProducts = productList.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.shade && p.shade.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesCollection = selectedCollection === 'all' || p.collectionId === selectedCollection;

    let matchesStock = true;
    if (selectedStockFilter === 'low') matchesStock = p.stock <= p.alertThreshold && p.stock > 0;
    else if (selectedStockFilter === 'out') matchesStock = p.stock === 0;
    else if (selectedStockFilter === 'in_stock') matchesStock = p.stock > p.alertThreshold;

    return matchesSearch && matchesCategory && matchesCollection && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-bbs-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-gold-400 text-xs font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-bbs-950">
            Gestion des Produits & Stocks
          </h1>
          <p className="text-xs text-bbs-600">
            {products.length} produits enregistrés • Synchronisation immédiate avec la boutique
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-bbs-900 hover:bg-bbs-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-bbs-950/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-gold-300" />
          + Ajouter un Produit
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-bbs-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-bbs-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, SKU, teinte..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Collection Filter */}
          <div>
            <select
              value={selectedCollection}
              onChange={e => setSelectedCollection(e.target.value)}
              className="w-full px-3 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="all">Toutes les gammes</option>
              {collections.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={selectedStockFilter}
              onChange={e => setSelectedStockFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="all">Tous les niveaux de stock</option>
              <option value="low">⚠️ Stock faible</option>
              <option value="out">❌ Rupture de stock</option>
              <option value="in_stock">✓ En stock normal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table (Desktop & Mobile Friendly Cards) */}
      <div className="bg-white rounded-3xl border border-bbs-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-bbs-50/70 border-b border-bbs-100 text-bbs-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Produit & Galerie</th>
                <th className="py-3 px-3">Gamme / Catégorie</th>
                <th className="py-3 px-3">Prix</th>
                <th className="py-3 px-3">Stock Réel</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bbs-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-bbs-500">
                    Aucun produit ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const collection = collections.find(c => c.id === p.collectionId);
                  const category = categories.find(c => c.id === p.categoryId);
                  const isLowStock = p.stock <= p.alertThreshold && p.stock > 0;
                  const isOutOfStock = p.stock === 0;

                  return (
                    <tr key={p.id} className="hover:bg-bbs-50/40 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-bbs-100 border border-bbs-200 shrink-0">
                            <img
                              src={p.images[0]?.url || '/assets/prod_fond_teint.jpg'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                            {p.images.length > 1 && (
                              <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                                +{p.images.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-bbs-950 text-xs">{p.name}</div>
                            <div className="text-[11px] text-bbs-500 flex items-center gap-2">
                              <span>SKU: {p.sku}</span>
                              {p.shade && <span>• {p.shade}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Gamme & Catégorie */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-bbs-900">{category?.name || 'Catégorie'}</div>
                        <div className="text-[11px] text-gold-700 font-medium">{collection?.name || 'Sans gamme'}</div>
                      </td>

                      {/* Prix */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-bbs-950 font-serif">
                          {formatPrice(p.promoPrice || p.price)}
                        </div>
                        {p.oldPrice && (
                          <div className="text-[10px] text-bbs-400 line-through">
                            {formatPrice(p.oldPrice)}
                          </div>
                        )}
                      </td>

                      {/* Stock Réel with Quick Inline Adjust */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={p.stock}
                            onChange={e => handleStockInlineChange(p.id, Number(e.target.value))}
                            className={`w-14 px-2 py-1 text-xs font-bold rounded-lg border text-center ${
                              isOutOfStock
                                ? 'border-rose-300 bg-rose-50 text-rose-700'
                                : isLowStock
                                ? 'border-amber-300 bg-amber-50 text-amber-700'
                                : 'border-bbs-200 bg-white text-bbs-900'
                            }`}
                          />
                          {isOutOfStock ? (
                            <span className="text-[10px] font-bold text-rose-600">Épuisé</span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-bold text-amber-600">Faible</span>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-600">OK</span>
                          )}
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {p.status === 'published' ? 'Publié' : p.status === 'draft' ? 'Brouillon' : 'Masqué'}
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {p.isFeatured && (
                            <span className="px-1.5 py-0.5 bg-gold-100 text-gold-800 text-[9px] font-bold rounded">
                              Vedette
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-1.5 py-0.5 bg-bbs-100 text-bbs-900 text-[9px] font-bold rounded">
                              Best-Seller
                            </span>
                          )}
                          {p.isNew && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                              Nouveau
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-bbs-600 hover:text-bbs-950 hover:bg-bbs-100 rounded-xl transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL (Mobile First) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-bbs-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-bbs-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gold-300" />
                <h2 className="font-serif text-lg font-bold">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
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

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Photo Uploader Component (Max 5 photos) */}
              <div className="p-4 bg-bbs-50/80 rounded-2xl border border-bbs-200">
                <PhotoUploader
                  photos={formPhotos}
                  onChange={setFormPhotos}
                  maxPhotos={5}
                />
              </div>

              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Nom du Produit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Fond de Teint BBS Radiance Glow"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Référence / SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Marque
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Catégorie *
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
                    Gamme Associée
                  </label>
                  <select
                    value={formData.collectionId}
                    onChange={e => setFormData({ ...formData, collectionId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    <option value="">Aucune gamme (Indépendant)</option>
                    {collections.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.shade})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-gold-50/40 rounded-2xl border border-gold-200/60">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Prix de vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="22500"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-bbs-200 rounded-xl font-bold text-xs text-bbs-950 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Ancien Prix (FCFA)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="28000"
                    value={formData.oldPrice}
                    onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Stock Initial
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-bbs-200 rounded-xl font-bold text-xs text-bbs-950 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Seuil d'Alerte Stock
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.alertThreshold}
                    onChange={e => setFormData({ ...formData, alertThreshold: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Beauty Specific Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Teinte / Nuance
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Caramel Doré (Shade 04)"
                    value={formData.shade}
                    onChange={e => setFormData({ ...formData, shade: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Type de peau recommandé
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Tous types de peau, Peaux mixtes à grasses"
                    value={formData.skinType}
                    onChange={e => setFormData({ ...formData, skinType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Description Courte (Accroche)
                  </label>
                  <input
                    type="text"
                    placeholder="Fini lumineux seconde peau avec acide hyaluronique..."
                    value={formData.shortDescription}
                    onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Description Complète & Conseils d'Application
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Détails sur la formule, bienfaits, mode d'application..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Ingrédients Clés
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Aqua, Niacinamide, Jojoba Oil, Vitamin E..."
                    value={formData.ingredients}
                    onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status & Badges */}
              <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-200 space-y-3">
                <div className="font-bold text-bbs-900">Visibilité & Mise en Avant</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-bbs-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-bbs-900">Produit Vedette</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-bbs-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-bbs-900">Best-Seller</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-bbs-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                      className="rounded text-gold-600 focus:ring-gold-500"
                    />
                    <span className="font-semibold text-bbs-900">Nouveau</span>
                  </label>

                  <div>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-2 bg-white rounded-xl border border-bbs-200 font-bold text-bbs-900 focus:ring-2 focus:ring-gold-500"
                    >
                      <option value="published">🟢 Publié</option>
                      <option value="draft">🟡 Brouillon</option>
                      <option value="hidden">⚪ Masqué</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
                    <span>{editingProduct ? 'Enregistrer les Modifications' : 'Publier le Produit'}</span>
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

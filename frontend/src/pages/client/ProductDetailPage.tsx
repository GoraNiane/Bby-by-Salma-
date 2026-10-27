import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Plus,
  Minus,
  MessageCircle,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  Share2,
  X
} from 'lucide-react';
import { Product, Review } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/client/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug, onNavigate }) => {
  const { products, collections, formatPrice } = useStore();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Accordions state
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'application' | 'shipping'>('desc');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const found = products.find(p => p.slug === slug || p.id === slug);
        if (found) {
          setProduct(found);
          setSelectedPhotoIndex(0);
          setQuantity(1);
        } else {
          const res = await api.getProduct(slug);
          setProduct(res);
          setSelectedPhotoIndex(0);
          setQuantity(1);
        }

        // Load reviews
        if (found || slug) {
          const revs = await api.getReviews({ status: 'approved' });
          setReviews(revs.filter(r => r.productId === (found?.id || slug)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug, products]);

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="w-8 h-8 border-4 border-bbs-300 border-t-bbs-900 rounded-full animate-spin" />
      </div>
    );
  }

  const collection = collections.find(c => c.id === product.collectionId);
  const images = product.images && product.images.length > 0 ? product.images : [{ id: '1', url: '/assets/prod_fond_teint.jpg', isPrimary: true, position: 1 }];
  const currentPhoto = images[selectedPhotoIndex]?.url || images[0].url;

  const isLowStock = product.stock <= product.alertThreshold && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.status === 'published' && (p.collectionId === product.collectionId || p.categoryId === product.categoryId))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    try {
      await api.createReview({
        productId: product.id,
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle || 'Mon avis BBS',
        comment: reviewComment
      });

      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccess(false);
        setReviewName('');
        setReviewTitle('');
        setReviewComment('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la publication de l’avis');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      {/* Back to shop navigation */}
      <div>
        <button
          onClick={() => onNavigate('/boutique')}
          className="inline-flex items-center gap-2 text-xs font-bold text-bbs-700 hover:text-bbs-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la boutique</span>
        </button>
      </div>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Interactive 5-Photo Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-bbs-200 shadow-xl group">
            <img
              src={currentPhoto}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <span className="px-3 py-1 bg-bbs-950 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                  Nouveauté
                </span>
              )}
              {product.oldPrice && (
                <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow">
                  Offre Spéciale
                </span>
              )}
            </div>
          </div>

          {/* Photo Thumbnails Selector (Up to 5 photos) */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedPhotoIndex === idx
                      ? 'border-gold-500 ring-4 ring-gold-100 shadow-md'
                      : 'border-bbs-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`Angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details, Shade, Price, Real Stock & Cart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Collection / Brand */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-gold-700">
              {collection ? collection.name : product.brand}
            </div>
            <div className="text-xs text-bbs-400 font-mono">
              SKU: {product.sku}
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bbs-950 leading-tight">
            {product.name}
          </h1>

          {/* Reviews stars rating */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center text-gold-500">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-bbs-900">5.0</span>
            <span className="text-bbs-500">({reviews.length > 0 ? `${reviews.length} avis` : 'Avis vérifiés'})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="font-serif text-3xl font-bold text-bbs-950">
              {formatPrice(product.promoPrice || product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-bbs-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-bbs-700 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Shade & Skin Type Box */}
          <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-200/80 space-y-2 text-xs">
            {product.shade && (
              <div className="flex justify-between">
                <span className="text-bbs-500">Teinte sélectionnée :</span>
                <span className="font-bold text-bbs-950">{product.shade}</span>
              </div>
            )}
            {product.skinType && (
              <div className="flex justify-between">
                <span className="text-bbs-500">Type de peau :</span>
                <span className="font-bold text-bbs-950">{product.skinType}</span>
              </div>
            )}
          </div>

          {/* Real-time Stock Indicator */}
          <div>
            {isOutOfStock ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Rupture temporaire de stock pour ce produit.</span>
              </div>
            ) : isLowStock ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-2 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Attention : Plus que {product.stock} pièce(s) en stock !</span>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>En stock ({product.stock} pièces disponibles au showroom)</span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {/* Quantity Stepper */}
            <div className="flex items-center justify-between border-2 border-bbs-200 rounded-2xl p-1 bg-white sm:w-36">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-bbs-700 hover:bg-bbs-50 rounded-xl disabled:opacity-30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-bbs-950 px-2">{quantity}</span>
              <button
                type="button"
                disabled={quantity >= product.stock}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 text-bbs-700 hover:bg-bbs-50 rounded-xl disabled:opacity-30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl active:scale-98 transition-all ${
                isOutOfStock
                  ? 'bg-bbs-200 text-bbs-400 cursor-not-allowed'
                  : 'bg-bbs-900 hover:bg-bbs-800 text-white shadow-bbs-950/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-gold-300" />
              <span>{isOutOfStock ? 'Victime de son succès' : 'Ajouter au Panier'}</span>
            </button>
          </div>

          {/* Quick WhatsApp Question */}
          <div className="pt-1">
            <a
              href={`https://wa.me/221770000000?text=${encodeURIComponent(`Bonjour Salma, j'ai une question concernant le produit "${product.name}" (SKU: ${product.sku}).`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Poser une question sur WhatsApp</span>
            </a>
          </div>

          {/* Guarantees Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-bbs-100 text-[11px] text-bbs-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-bbs-800" />
              <span>Livraison 24h à Dakar</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-bbs-800" />
              <span>Formule 100% originale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions / Tabs Section (Description, Ingredients, Application, Shipping) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bbs-100 shadow-sm space-y-6">
        {/* Tabs Headers */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-bbs-100 text-xs font-bold no-scrollbar">
          {[
            { id: 'desc', label: 'Description Complète' },
            { id: 'application', label: 'Conseils d’Application' },
            { id: 'ingredients', label: 'Ingrédients & Formule' },
            { id: 'shipping', label: 'Livraison & Retours' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-4 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-bbs-900 text-white font-extrabold shadow'
                  : 'text-bbs-600 hover:bg-bbs-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-bbs-700 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description || product.shortDescription || 'Ce cosmétique d’exception a été conçu dans les meilleurs laboratoires pour apporter couvrance, tenue et respect de l’épiderme.'}</p>
            </div>
          )}

          {activeTab === 'application' && (
            <div className="space-y-3">
              <p>1. Préparez votre peau sur un visage propre et hydraté.</p>
              <p>2. Déposez une noisette de produit au centre du visage.</p>
              <p>3. Étirez délicatement vers l’extérieur à l’aide d’un pinceau ou d’une éponge humide pour un fini ultra-naturel sans démarcation.</p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-2">
              <p className="font-bold text-bbs-950">Liste des ingrédients (INCI) :</p>
              <p className="font-mono text-xs bg-bbs-50 p-4 rounded-2xl border border-bbs-100">
                {product.ingredients || 'Aqua (Water), Niacinamide, Glycerin, Simmondsia Chinensis Seed Oil, Hyaluronic Acid, Tocopherol, CI 77491, CI 77492, CI 77499.'}
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-2">
              <p><strong>Dakar et banlieue :</strong> Livraison le jour même ou sous 24h ouvrées. Paiement en espèces à la livraison ou via Wave / Orange Money.</p>
              <p><strong>Régions du Sénégal (Thiès, Saint-Louis, Mbour...) :</strong> Livraison express en 48h.</p>
              <p><strong>International (Zone UEMOA, Europe) :</strong> Expédition par transporteur agréé.</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-bbs-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bbs-100 pb-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-bbs-950">Avis Clientes ({reviews.length})</h3>
            <p className="text-xs text-bbs-500">Retours authentiques sur ce produit</p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 bg-bbs-900 text-white rounded-xl text-xs font-bold shadow hover:bg-bbs-800"
          >
            Laisser un avis
          </button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-bbs-500 text-center py-6">Soyez la première à donner votre avis sur ce produit !</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-bbs-50 rounded-2xl border border-bbs-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gold-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-current' : 'text-bbs-200'}`} />
                    ))}
                  </div>
                  <span className="text-[10px] text-bbs-400 font-semibold">
                    {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-bbs-950">{rev.title}</h5>
                <p className="text-xs text-bbs-700 italic">"{rev.comment}"</p>
                <div className="text-[11px] font-semibold text-bbs-900 pt-1">
                  {rev.customerName} {rev.verified && <span className="text-emerald-700 text-[10px]">✓ Achat Vérifié</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-bbs-100">
              <h3 className="font-serif text-base font-bold text-bbs-950">Donner votre avis</h3>
              <button onClick={() => setIsReviewModalOpen(false)}><X className="w-5 h-5 text-bbs-500" /></button>
            </div>

            {reviewSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-base font-bold text-bbs-950">Merci pour votre avis !</h4>
                <p className="text-xs text-bbs-600">Votre témoignage a bien été transmis à l'équipe BBS.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre note *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 text-gold-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-current' : 'text-bbs-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre Nom / Prénom *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    placeholder="ex: Fatou S."
                    className="w-full px-3 py-2 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Titre de l'avis</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    placeholder="ex: Parfait pour ma carnation !"
                    className="w-full px-3 py-2 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre commentaire *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Racontez votre expérience avec ce cosmétique..."
                    className="w-full px-3 py-2 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsReviewModalOpen(false)} className="px-4 py-2 bg-bbs-100 rounded-xl font-bold">Annuler</button>
                  <button type="submit" className="px-5 py-2 bg-bbs-900 text-white rounded-xl font-bold">Publier</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-bold text-bbs-950">Vous aimerez aussi</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

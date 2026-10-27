import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Sparkles, Heart } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onQuickView
}) => {
  const { formatPrice, collections } = useStore();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const collection = collections.find(c => c.id === product.collectionId);
  const primaryImg = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '/assets/prod_fond_teint.jpg';
  const secondaryImg = product.images[1]?.url || primaryImg;

  const isLowStock = product.stock <= product.alertThreshold && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const handleCardClick = () => {
    onNavigate(`/produit/${product.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl p-3 sm:p-4 border border-bbs-100 hover:border-bbs-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Badges & Wishlist */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-bbs-50 mb-3.5">
        {/* Images with smooth transition */}
        <img
          src={isHovered && secondaryImg ? secondaryImg : primaryImg}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isNew ? (
            <span className="px-2.5 py-0.5 bg-[#C25E28] text-white text-[9.5px] font-bold rounded-full shadow-md">
              Nouveau
            </span>
          ) : product.isBestSeller ? (
            <span className="px-2.5 py-0.5 bg-[#734827] text-white text-[9.5px] font-bold rounded-full shadow-md">
              Top vente
            </span>
          ) : product.oldPrice ? (
            <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[9.5px] font-bold rounded-full shadow-md">
              Promo
            </span>
          ) : null}
        </div>

        {/* Real-time Stock Status Floating Tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-rose-300 text-[10px] font-bold rounded-lg">
              Épuisé
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-lg animate-pulse">
              Plus que {product.stock} !
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all ${
            isLiked ? 'text-rose-500 fill-rose-500 bg-white/90 shadow' : 'text-[#645347] hover:text-rose-500 hover:bg-white/70'
          }`}
          title="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : 'stroke-[1.75]'}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Product Name */}
          <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1E140C] line-clamp-1 group-hover:text-[#A86D44] transition-colors">
            {product.name}
          </h3>

          {/* Variant Color Dot */}
          {product.shade && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#736357] mt-0.5">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs border border-black/10"
                style={{
                  backgroundColor:
                    product.shade.toLowerCase().includes('karité')
                      ? '#C49A6C'
                      : product.shade.toLowerCase().includes('coco')
                      ? '#6D4C3D'
                      : product.shade.toLowerCase().includes('papaye')
                      ? '#E07A5F'
                      : product.shade.toLowerCase().includes('curcuma')
                      ? '#E5A93B'
                      : '#A86D44'
                }}
              />
              <span className="font-medium">{product.shade}</span>
            </div>
          )}
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#F2ECE4]">
          <div>
            <div className="font-serif font-bold text-[#1E140C] text-xs sm:text-sm">
              {formatPrice(product.promoPrice || product.price)}
            </div>
            {product.oldPrice && (
              <div className="text-[10px] text-[#9A8C80] line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all ${
              isOutOfStock
                ? 'bg-bbs-200 text-bbs-400 cursor-not-allowed'
                : 'bg-bbs-900 hover:bg-bbs-800 text-white hover:shadow-gold-900/20'
            }`}
            title={isOutOfStock ? 'Produit épuisé' : 'Ajouter au panier'}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
            <span className="hidden sm:inline">Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
};

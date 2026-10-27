import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    promoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();
  const { formatPrice, settings } = useStore();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);

  if (!isOpen) return null;

  const freeShippingThreshold = settings?.freeDeliveryThreshold || 50000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 3000);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    onNavigate('/commande');
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dark Blur Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade-in">
          {/* Header */}
          <div className="p-5 border-b border-bbs-100 flex items-center justify-between bg-bbs-50/50">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-bbs-900 text-white rounded-xl">
                <ShoppingBag className="w-4 h-4 text-gold-300" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-bbs-950">Mon Panier</h2>
                <p className="text-[11px] text-bbs-500">{cart.reduce((s, i) => s + i.quantity, 0)} article(s) sélectionné(s)</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-bbs-500 hover:text-bbs-950 hover:bg-bbs-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-gradient-to-r from-bbs-50 to-gold-50/60 border-b border-bbs-100 text-xs">
            <div className="flex items-center justify-between font-semibold text-bbs-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-gold-600" />
                {remainingForFree > 0
                  ? `Plus que ${formatPrice(remainingForFree)} pour la livraison gratuite !`
                  : '🎉 Félicitations ! Livraison offerte à Dakar !'}
              </span>
              <span className="font-bold text-gold-700">{progressPercent}%</span>
            </div>
            <div className="w-full bg-bbs-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-gold-500 to-bbs-700 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-bbs-50 text-bbs-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-bbs-950">Votre panier est vide</h3>
                <p className="text-xs text-bbs-500 max-w-xs">
                  Découvrez nos gammes formulées pour illuminer votre teint et ajoutez vos cosmétiques favoris.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('/boutique');
                  }}
                  className="mt-2 px-6 py-2.5 bg-bbs-900 text-white rounded-2xl text-xs font-bold shadow"
                >
                  Découvrir la Boutique
                </button>
              </div>
            ) : (
              cart.map((item, index) => {
                const prod = item.product;
                const price = prod.promoPrice || prod.price;
                const image = prod.images[0]?.url || '/assets/prod_fond_teint.jpg';

                return (
                  <div
                    key={`${prod.id}_${item.shade || index}`}
                    className="flex gap-3 p-3 bg-bbs-50/50 rounded-2xl border border-bbs-100"
                  >
                    <img
                      src={image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover bg-white border border-bbs-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-bbs-950 truncate">{prod.name}</h4>
                          <button
                            onClick={() => removeFromCart(prod.id, item.shade)}
                            className="text-bbs-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {item.shade && (
                          <div className="text-[10px] text-gold-700 font-semibold mt-0.5">
                            Teinte : {item.shade}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-bbs-100">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-bbs-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(prod.id, item.quantity - 1, item.shade)}
                            className="p-1 hover:bg-bbs-50 text-bbs-700 rounded-l"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-bbs-950">{item.quantity}</span>
                          <button
                            disabled={item.quantity >= prod.stock}
                            onClick={() => updateQuantity(prod.id, item.quantity + 1, item.shade)}
                            className="p-1 hover:bg-bbs-50 text-bbs-700 rounded-r disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-serif font-bold text-xs text-bbs-950">
                          {formatPrice(price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-bbs-100 bg-white space-y-3.5 shadow-lg">
              {/* Promo Code Input */}
              {promoCode ? (
                <div className="p-2.5 bg-gold-50 border border-gold-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-gold-900">
                    <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                    <span>Code {promoCode} appliqué (-{formatPrice(discount)})</span>
                  </div>
                  <button onClick={removePromoCode} className="text-bbs-500 hover:text-rose-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code Promo (ex: SALMA10)"
                    value={promoInput}
                    onChange={e => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl text-xs uppercase text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-bbs-100 hover:bg-bbs-200 text-bbs-900 rounded-xl text-xs font-bold transition-colors"
                  >
                    Appliquer
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-rose-600 font-semibold">
                  Code promo invalide. Essayez "SALMA10" (-10%)
                </p>
              )}

              {/* Subtotal & Total */}
              <div className="space-y-1.5 text-xs text-bbs-600 pt-1">
                <div className="flex justify-between">
                  <span>Sous-total :</span>
                  <span className="font-semibold text-bbs-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise :</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-bbs-950 font-serif pt-1 border-t border-bbs-100">
                  <span>Total :</span>
                  <span className="text-base text-gold-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-2xl shadow-xl shadow-bbs-950/20 text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Passer la Commande</span>
                <ArrowRight className="w-4 h-4 text-gold-300" />
              </button>

              {/* Wave Direct Option */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-2.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#0284C7] font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all border border-[#BAE6FD]"
              >
                <div className="w-4 h-4 rounded bg-[#1BA5E1] text-white font-black text-[9px] flex items-center justify-center shadow-sm">
                  W
                </div>
                <span>Payer par Wave Sénégal ({formatPrice(total)})</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-bbs-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paiement à la livraison, Wave ou Orange Money</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

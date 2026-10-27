import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  MapPin,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { api } from '../../services/api';
import { buildWavePaymentUrl } from '../../services/wave';
import { Order } from '../../types';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderSuccess }) => {
  const { cart, subtotal, discount, clearCart } = useCart();
  const { formatPrice, settings, refreshStore } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dakar',
    region: 'Dakar (Centre, Almadies, Mermoz, Plateau)',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'wave' | 'orange_money' | 'card'>('cash_on_delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-bbs-100 text-bbs-600 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-bbs-950">Votre panier est vide</h2>
        <p className="text-xs text-bbs-600">
          Ajoutez des cosmétiques avant de passer votre commande.
        </p>
        <button
          onClick={() => onNavigate('/boutique')}
          className="px-6 py-3 bg-bbs-900 text-white rounded-2xl text-xs font-bold shadow"
        >
          Voir la Boutique
        </button>
      </div>
    );
  }

  // Calculate delivery fee
  const deliveryFees = settings?.deliveryFees || [
    { region: 'Dakar (Centre, Almadies, Mermoz, Plateau)', fee: 2000 },
    { region: 'Banlieue Dakar (Pikine, Guédiawaye, Rufisque)', fee: 3000 },
    { region: 'Régions Sénégal (Thiès, Saint-Louis, Mbour, etc.)', fee: 5000 },
    { region: 'International (Zone UEMOA & Europe)', fee: 15000 }
  ];

  const selectedDelivery = deliveryFees.find(d => d.region === formData.region) || deliveryFees[0];
  const isFreeDelivery = subtotal >= (settings?.freeDeliveryThreshold || 50000);
  const actualDeliveryFee = isFreeDelivery ? 0 : selectedDelivery.fee;

  const total = Math.max(0, subtotal + actualDeliveryFee - discount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name || !formData.phone || !formData.address) {
      setErrorMessage('Veuillez renseigner votre nom, téléphone et adresse de livraison.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email ? formData.email.trim() : undefined,
          address: formData.address.trim(),
          city: formData.city.trim(),
          region: formData.region.trim(),
          notes: formData.notes ? formData.notes.trim() : undefined
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.promoPrice || item.product.price,
          quantity: item.quantity,
          shade: item.shade,
          image: item.product.images[0]?.url || '/assets/prod_fond_teint.jpg',
          sku: item.product.sku
        })),
        paymentMethod,
        deliveryFee: actualDeliveryFee,
        discount
      };

      const res = await api.createOrder(orderPayload);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      clearCart();
      await refreshStore();

      onOrderSuccess(res.order);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l’enregistrement de votre commande.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => onNavigate('/boutique')}
          className="inline-flex items-center gap-2 text-xs font-bold text-bbs-700 hover:text-bbs-950 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continuer mes achats</span>
        </button>

        <h1 className="font-serif text-3xl font-bold text-bbs-950">
          Validation de votre Commande
        </h1>
        <p className="text-xs text-bbs-600 mt-1">
          Remplissez vos coordonnées pour recevoir votre colis cosmétique avec soin.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 animate-fade-in">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer & Delivery Info Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-bbs-100 pb-3 font-bold text-bbs-950 text-sm">
                <div className="w-6 h-6 rounded-full bg-bbs-900 text-white flex items-center justify-center text-xs">1</div>
                <span>Vos Coordonnées</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-bbs-900 mb-1">
                    Nom & Prénom de la destinataire *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Aïcha Diallo"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Numéro de Téléphone (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ex: +221 77 452 89 12"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Adresse Email (Optionnel)
                  </label>
                  <input
                    type="email"
                    placeholder="aicha@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address in Senegal */}
            <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-bbs-100 pb-3 font-bold text-bbs-950 text-sm">
                <div className="w-6 h-6 rounded-full bg-bbs-900 text-white flex items-center justify-center text-xs">2</div>
                <span>Lieu de Livraison</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Zone / Région de Livraison *
                  </label>
                  <select
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs font-semibold text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  >
                    {deliveryFees.map(df => (
                      <option key={df.region} value={df.region}>
                        {df.region} — {formatPrice(df.fee)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Adresse complète (Quartier, Rue, Numéro de villa ou Immeuble) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Almadies, Route de la Corniche, Villa 45 près de la pharmacie"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">
                    Instructions particulières pour le livreur (Optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: M'appeler 15 minutes avant d'arriver..."
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Choice */}
            <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4 text-xs">
              <div className="flex items-center gap-2 border-b border-bbs-100 pb-3 font-bold text-bbs-950 text-sm">
                <div className="w-6 h-6 rounded-full bg-bbs-900 text-white flex items-center justify-center text-xs">3</div>
                <span>Mode de Paiement</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-gold-500 bg-gold-50/50 shadow-sm'
                    : 'border-bbs-200 hover:border-bbs-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="mt-0.5 text-gold-600 focus:ring-gold-500"
                  />
                  <div>
                    <div className="font-bold text-bbs-950">Paiement à la livraison</div>
                    <p className="text-[11px] text-bbs-600 mt-0.5">Réglez en espèces directement auprès du coursier à la réception.</p>
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 sm:col-span-2 ${
                  paymentMethod === 'wave'
                    ? 'border-[#1BA5E1] bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE]/70 shadow-md ring-2 ring-[#38BDF8]/30'
                    : 'border-bbs-200 hover:border-[#1BA5E1]/60'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="wave"
                    checked={paymentMethod === 'wave'}
                    onChange={() => setPaymentMethod('wave')}
                    className="mt-1 text-[#1BA5E1] focus:ring-[#1BA5E1]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#0C4A6E]">Payer avec Wave Sénégal</span>
                        <span className="px-2 py-0.5 bg-[#1BA5E1] text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                          Recommandé
                        </span>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-[#1BA5E1] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                        W
                      </div>
                    </div>
                    <p className="text-[11px] text-[#0369A1] mt-1">
                      Vous validez votre commande d'abord, puis vous réglerez directement sur l'application Wave avec le montant exact pré-rempli (<strong>{formatPrice(total)}</strong>).
                    </p>
                    <div className="mt-2 text-[10px] text-[#0284C7] font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                      <span>Montant pré-rempli sur Wave à l'étape suivante</span>
                    </div>
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'orange_money'
                    ? 'border-gold-500 bg-gold-50/50 shadow-sm'
                    : 'border-bbs-200 hover:border-bbs-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="orange_money"
                    checked={paymentMethod === 'orange_money'}
                    onChange={() => setPaymentMethod('orange_money')}
                    className="mt-0.5 text-gold-600 focus:ring-gold-500"
                  />
                  <div>
                    <div className="font-bold text-bbs-950">Orange Money</div>
                    <p className="text-[11px] text-bbs-600 mt-0.5">Paiement mobile rapide et certifié.</p>
                  </div>
                </label>

                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'card'
                    ? 'border-gold-500 bg-gold-50/50 shadow-sm'
                    : 'border-bbs-200 hover:border-bbs-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-0.5 text-gold-600 focus:ring-gold-500"
                  />
                  <div>
                    <div className="font-bold text-bbs-950">Carte Bancaire / Visa</div>
                    <p className="text-[11px] text-bbs-600 mt-0.5">Paiement international par carte sécurisée.</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right: Order Summary Sticky Card */}
          <div className="lg:col-span-5 sticky top-28">
            <div className="bg-white rounded-3xl p-6 border border-bbs-100 shadow-xl space-y-5 text-xs">
              <h2 className="font-serif text-base font-bold text-bbs-950 border-b border-bbs-100 pb-3">
                Récapitulatif du Panier ({cart.length} articles)
              </h2>

              {/* Items List */}
              <div className="divide-y divide-bbs-100 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => {
                  const price = item.product.promoPrice || item.product.price;
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]?.url || '/assets/prod_fond_teint.jpg'}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-bbs-50 border border-bbs-200"
                        />
                        <div>
                          <div className="font-bold text-bbs-950 truncate max-w-[160px]">{item.product.name}</div>
                          <div className="text-[11px] text-bbs-500">
                            {item.shade && <span>Teinte : {item.shade} • </span>}
                            <span>Qté : {item.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-serif font-bold text-bbs-950 whitespace-nowrap">
                        {formatPrice(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 pt-2 border-t border-bbs-100 text-bbs-700">
                <div className="flex justify-between">
                  <span>Sous-total articles :</span>
                  <span className="font-semibold text-bbs-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison ({formData.region.split(' ')[0]}) :</span>
                  <span className="font-semibold text-bbs-950">
                    {isFreeDelivery ? (
                      <span className="text-emerald-600 font-bold">Gratuite</span>
                    ) : (
                      formatPrice(actualDeliveryFee)
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise Code Promo :</span>
                    <span>- {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-bbs-950 font-serif pt-2 border-t border-bbs-200">
                  <span>Total à payer :</span>
                  <span className="text-xl text-gold-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white font-bold rounded-2xl shadow-xl text-xs sm:text-sm flex items-center justify-center gap-2.5 active:scale-98 transition-all disabled:opacity-50 cursor-pointer ${
                  paymentMethod === 'wave'
                    ? 'bg-[#1BA5E1] hover:bg-[#0284C7] shadow-[#0284C7]/25'
                    : 'bg-bbs-900 hover:bg-bbs-800 shadow-bbs-950/20'
                }`}
              >
                {isSubmitting ? (
                  <span>Enregistrement de votre commande...</span>
                ) : (
                  <>
                    {paymentMethod === 'wave' && (
                      <div className="w-5 h-5 rounded-md bg-white text-[#1BA5E1] font-black text-xs flex items-center justify-center shadow-xs">
                        W
                      </div>
                    )}
                    <span className="font-extrabold">
                      {paymentMethod === 'wave'
                        ? `Valider la commande • Payer par Wave (${formatPrice(total)})`
                        : `Confirmer ma commande (${formatPrice(total)})`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>

              <div className="p-3 bg-bbs-50 rounded-2xl border border-bbs-200/80 text-[11px] text-bbs-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-bbs-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Garantie BBS By Salma
                </div>
                <p>Vos données sont protégées. Dès confirmation, notre service client prépare votre colis.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

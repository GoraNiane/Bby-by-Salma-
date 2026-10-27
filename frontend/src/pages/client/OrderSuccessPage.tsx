import React from 'react';
import { CheckCircle, ShoppingBag, MessageCircle, ArrowRight, Printer, Sparkles, CreditCard } from 'lucide-react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { buildWavePaymentUrl } from '../../services/wave';

interface OrderSuccessPageProps {
  order: Order;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, onNavigate }) => {
  const { formatPrice, siteContent, settings } = useStore();

  const getWhatsAppMessage = () => {
    const itemsList = order.items.map(i => `- ${i.quantity}x ${i.name}`).join('%0A');
    const msg = `Bonjour Salma ! Je viens de passer la commande *%23${order.orderNumber}* sur votre boutique.%0A*Total :* ${encodeURIComponent(formatPrice(order.total))}%0A*Articles :*%0A${itemsList}%0A*Nom :* ${encodeURIComponent(order.customer.name)}%0A*Adresse :* ${encodeURIComponent(order.customer.address)}%0AMerci ! ✨`;
    const phone = siteContent?.contact.whatsapp?.replace(/\D/g, '') || '221770000000';
    return `https://wa.me/${phone}?text=${msg}`;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-8 text-center font-sans">
      {/* Celebration Header */}
      <div className="space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-900 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          Commande Confirmée
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bbs-950">
          Merci pour votre commande, {order.customer.name.split(' ')[0]} !
        </h1>

        <p className="text-xs sm:text-sm text-bbs-600 max-w-md mx-auto">
          Votre commande <strong>#{order.orderNumber}</strong> est bien enregistrée dans notre système. Nous préparons votre colis avec le plus grand soin.
        </p>
      </div>

      {/* Wave Payment Action Box - Step 2/2 */}
      {order.paymentMethod === 'wave' ? (
        <div className="bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]/40 rounded-3xl p-6 sm:p-8 border-2 border-[#1BA5E1] shadow-2xl text-left space-y-4 animate-fade-in relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#1BA5E1] text-white flex items-center justify-center font-black text-2xl shadow-lg ring-4 ring-white">
                W
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#1BA5E1] text-white text-[10px] font-black uppercase tracking-wider mb-1">
                  Étape 2/2 • Paiement Wave
                </div>
                <h3 className="font-bold text-[#0C4A6E] text-base sm:text-lg">
                  Régler votre commande par Wave
                </h3>
              </div>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-[11px] text-[#0369A1] block font-medium">Montant pré-rempli</span>
              <span className="font-serif font-extrabold text-xl sm:text-2xl text-[#0C4A6E]">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#0369A1] leading-relaxed">
            Votre commande <strong>#{order.orderNumber}</strong> est bien enregistrée ! Pour finaliser votre achat, appuyez sur le bouton ci-dessous : votre application Wave s'ouvrira directement avec le montant exact de <strong>{formatPrice(order.total)}</strong> pré-rempli.
          </p>

          <a
            href={buildWavePaymentUrl(order.total, settings?.wavePaymentUrl)}
            target="_blank"
            rel="noreferrer"
            className="w-full py-4 sm:py-4.5 px-6 bg-[#1BA5E1] hover:bg-[#0284C7] text-white font-black rounded-2xl text-sm sm:text-base shadow-xl shadow-[#0284C7]/30 flex items-center justify-center gap-3 active:scale-95 transition-all text-center cursor-pointer ring-4 ring-[#1BA5E1]/20 hover:ring-[#1BA5E1]/40"
          >
            <div className="w-6 h-6 rounded-md bg-white text-[#1BA5E1] font-black text-sm flex items-center justify-center shadow-sm">
              W
            </div>
            <span>Payer {formatPrice(order.total)} avec Wave maintenant</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </a>
        </div>
      ) : (
        <div className="bg-[#FAF6F1] rounded-2xl p-4 border border-[#EAE0D5] text-left flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1BA5E1] text-white font-bold flex items-center justify-center text-xs">
              W
            </div>
            <div>
              <span className="font-bold text-[#1E140C] block">Vous préférez régler par Wave ?</span>
              <span className="text-[#7A6E65] text-[11px]">Réglez {formatPrice(order.total)} sans contact</span>
            </div>
          </div>
          <a
            href={buildWavePaymentUrl(order.total, settings?.wavePaymentUrl)}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-[#1BA5E1] hover:bg-[#0284C7] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
          >
            <span>Payer par Wave</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Invoice Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bbs-200 shadow-xl text-left text-xs space-y-5">
        <div className="flex items-center justify-between border-b border-bbs-100 pb-3">
          <div>
            <div className="font-bold text-bbs-950 text-sm">Commande #{order.orderNumber}</div>
            <div className="text-[11px] text-bbs-500">
              {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-900 font-bold rounded-full text-[11px]">
            {order.paymentMethod === 'cash_on_delivery' ? 'Paiement à la livraison' : order.paymentMethod.toUpperCase()}
          </span>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-bbs-50 rounded-2xl">
          <div>
            <div className="font-bold text-bbs-900 mb-1">Destinataire :</div>
            <p className="font-semibold text-bbs-950">{order.customer.name}</p>
            <p className="text-bbs-600">{order.customer.phone}</p>
          </div>
          <div>
            <div className="font-bold text-bbs-900 mb-1">Adresse de livraison :</div>
            <p className="text-bbs-800">{order.customer.address}</p>
            <p className="text-bbs-500">{order.customer.city} ({order.customer.region})</p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <div className="font-bold text-bbs-900 mb-2">Articles commandés :</div>
          <div className="divide-y divide-bbs-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-bbs-50 border border-bbs-200"
                  />
                  <div>
                    <div className="font-bold text-bbs-950">{item.name}</div>
                    <div className="text-[11px] text-bbs-500">
                      {item.shade && <span>Teinte : {item.shade} • </span>}
                      <span>Qté : {item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="font-serif font-bold text-bbs-950">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-bbs-200 space-y-1.5 text-right text-bbs-700">
          <div className="flex justify-between">
            <span>Sous-total :</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison :</span>
            <span>{order.deliveryFee === 0 ? 'Offerte' : formatPrice(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-bbs-950 font-serif pt-2 border-t border-bbs-100">
            <span>Total :</span>
            <span className="text-lg text-gold-700">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <a
          href={getWhatsAppMessage()}
          target="_blank"
          rel="noreferrer"
          className="py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Envoyer le récapitulatif sur WhatsApp</span>
        </a>

        <button
          onClick={() => onNavigate('/boutique')}
          className="py-4 px-6 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-gold-300" />
          <span>Retourner à la boutique</span>
        </button>
      </div>
    </div>
  );
};

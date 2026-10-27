import React, { useState } from 'react';
import { Search, Package, CheckCircle, Clock, Truck, MapPin, ArrowLeft } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

interface OrderTrackingPageProps {
  onNavigate: (path: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onNavigate }) => {
  const { formatPrice } = useStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber) return;

    setError(null);
    setLoading(true);
    try {
      const res = await api.trackOrder(orderNumber.trim(), phone.trim() || undefined);
      setOrder(res);
    } catch (err: any) {
      setError(err.message || 'Commande introuvable.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'new', label: 'Enregistrée', icon: Clock },
    { id: 'confirmed', label: 'Confirmée', icon: CheckCircle },
    { id: 'processing', label: 'En préparation', icon: Package },
    { id: 'shipped', label: 'Expédiée / En cours de livraison', icon: Truck },
    { id: 'delivered', label: 'Livrée avec succès', icon: CheckCircle }
  ];

  const currentStepIndex = order ? steps.findIndex(s => s.id === order.orderStatus) : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 font-sans">
      <div>
        <button
          onClick={() => onNavigate('/boutique')}
          className="inline-flex items-center gap-2 text-xs font-bold text-bbs-700 hover:text-bbs-950 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Boutique</span>
        </button>

        <h1 className="font-serif text-3xl font-bold text-bbs-950">
          Suivi de Votre Commande BBS
        </h1>
        <p className="text-xs text-bbs-600 mt-1">
          Entrez votre numéro de commande reçu par SMS ou sur votre reçu pour voir l'avancement de la livraison.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleTrack} className="bg-white p-6 rounded-3xl border border-bbs-200 shadow-xl space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-bbs-900 mb-1">Numéro de Commande *</label>
            <input
              type="text"
              required
              placeholder="ex: BBS-00125"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl uppercase font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-bbs-900 mb-1">Numéro de Téléphone</label>
            <input
              type="tel"
              placeholder="ex: +221 77 000 00 00"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-bbs-50 border border-bbs-200 rounded-xl"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4 text-gold-300" />
          <span>{loading ? 'Recherche...' : 'Rechercher Ma Commande'}</span>
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 animate-fade-in text-center">
          {error}
        </div>
      )}

      {/* Tracking Result */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-bbs-200 shadow-xl space-y-6 text-xs animate-fade-in">
          <div className="flex items-center justify-between border-b border-bbs-100 pb-3">
            <div>
              <span className="text-[10px] text-gold-700 font-bold uppercase">Statut en direct</span>
              <h2 className="font-serif text-xl font-bold text-bbs-950">Commande #{order.orderNumber}</h2>
            </div>
            <div className="font-serif font-bold text-bbs-950 text-base">
              {formatPrice(order.total)}
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="space-y-3 py-2">
            <div className="text-xs font-bold text-bbs-900">Progression du Colis :</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={s.id}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                      isCurrent
                        ? 'bg-bbs-900 text-white border-bbs-900 shadow-md ring-2 ring-gold-400'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : 'bg-bbs-50 text-bbs-400 border-bbs-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] font-bold leading-tight">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details */}
          <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-100 space-y-2">
            <div><strong>Destinataire :</strong> {order.customer.name} ({order.customer.phone})</div>
            <div><strong>Lieu de livraison :</strong> {order.customer.address}, {order.customer.city}</div>
            <div><strong>Articles :</strong> {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

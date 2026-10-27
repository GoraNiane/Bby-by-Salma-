import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Printer,
  ChevronRight,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Order, OrderItem } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminOrdersPage: React.FC = () => {
  const { formatPrice, refreshStore } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders();
      setOrders(res);
      if (selectedOrder) {
        const updated = res.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      await api.updateOrderStatus(selectedOrder.id, newStatus, statusNote);
      setStatusNote('');
      await fetchOrders();
      await refreshStore();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleQuickStatusUpdate = async (orderId: string, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
      await refreshStore();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Nouvelle' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmée' },
    processing: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'En préparation' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Expédiée' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Livrée' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Annulée' }
  };

  const getWhatsAppMessage = (order: Order) => {
    const cleanPhone = order.customer.phone.replace(/\D/g, '');
    const itemsList = order.items.map(i => `- ${i.quantity}x ${i.name} (${formatPrice(i.price)})`).join('%0A');
    const msg = `Bonjour ${encodeURIComponent(order.customer.name)}, ici BBS By Salma.%0ANous avons bien reçu votre commande *%23${order.orderNumber}* pour un montant de *${encodeURIComponent(formatPrice(order.total))}*.%0A%0A*Articles:*%0A${itemsList}%0A%0AVotre adresse de livraison : ${encodeURIComponent(order.customer.address)}%0ANous préparons votre colis avec le plus grand soin ! ✨`;
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-bbs-950">
            Gestion des Commandes
          </h1>
          <p className="text-xs text-bbs-600">
            Suivi des ventes, préparation des colis, livraisons et contact client
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-bbs-200 text-bbs-800 rounded-2xl text-xs font-bold shadow-sm hover:bg-bbs-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      {/* Status Filter Tabs (Mobile Thumb Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        {[
          { id: 'all', label: `Toutes (${orders.length})` },
          { id: 'new', label: `Nouvelles (${orders.filter(o => o.orderStatus === 'new').length})` },
          { id: 'confirmed', label: `Confirmées (${orders.filter(o => o.orderStatus === 'confirmed').length})` },
          { id: 'processing', label: `En préparation (${orders.filter(o => o.orderStatus === 'processing').length})` },
          { id: 'shipped', label: `Expédiées (${orders.filter(o => o.orderStatus === 'shipped').length})` },
          { id: 'delivered', label: `Livrées (${orders.filter(o => o.orderStatus === 'delivered').length})` },
          { id: 'cancelled', label: `Annulées (${orders.filter(o => o.orderStatus === 'cancelled').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all ${
              statusFilter === tab.id
                ? 'bg-bbs-900 text-white shadow-md'
                : 'bg-white text-bbs-700 hover:bg-bbs-100 border border-bbs-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-bbs-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-bbs-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par numéro de commande, nom de cliente, téléphone, adresse..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white rounded-3xl border border-bbs-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-bbs-50/70 border-b border-bbs-100 text-bbs-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Commande</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Cliente & Contact</th>
                <th className="py-3.5 px-3">Articles</th>
                <th className="py-3.5 px-3">Montant Total</th>
                <th className="py-3.5 px-3">Paiement</th>
                <th className="py-3.5 px-3">Statut</th>
                <th className="py-3.5 px-4 text-right">Action Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bbs-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-bbs-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const conf = statusColors[order.orderStatus] || statusColors.new;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-bbs-50/60 transition-colors cursor-pointer"
                    >
                      {/* Numéro */}
                      <td className="py-3.5 px-4 font-bold text-bbs-950">
                        #{order.orderNumber}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-bbs-600">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>

                      {/* Cliente */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-bbs-950">{order.customer.name}</div>
                        <div className="text-[11px] text-bbs-500 flex items-center gap-1.5 mt-0.5">
                          <span>{order.customer.phone}</span>
                          <a
                            href={getWhatsAppMessage(order)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Contacter sur WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* Articles Count */}
                      <td className="py-3.5 px-3 text-bbs-700">
                        <span className="font-semibold">{order.items.reduce((s, i) => s + i.quantity, 0)}</span> article(s)
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-3 font-bold text-bbs-950 font-serif text-sm">
                        {formatPrice(order.total)}
                      </td>

                      {/* Paiement */}
                      <td className="py-3.5 px-3">
                        <span className="uppercase text-[10px] font-bold text-bbs-700 bg-bbs-100 px-2 py-0.5 rounded">
                          {order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : order.paymentMethod}
                        </span>
                      </td>

                      {/* Statut Badge */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${conf.bg} ${conf.text}`}>
                          {conf.label}
                        </span>
                      </td>

                      {/* Quick Status Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {order.orderStatus === 'new' && (
                            <button
                              onClick={e => handleQuickStatusUpdate(order.id, 'confirmed', e)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold"
                            >
                              Confirmer
                            </button>
                          )}
                          {order.orderStatus === 'confirmed' && (
                            <button
                              onClick={e => handleQuickStatusUpdate(order.id, 'processing', e)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold"
                            >
                              En préparation
                            </button>
                          )}
                          {order.orderStatus === 'processing' && (
                            <button
                              onClick={e => handleQuickStatusUpdate(order.id, 'shipped', e)}
                              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold"
                            >
                              Expédier
                            </button>
                          )}
                          {order.orderStatus === 'shipped' && (
                            <button
                              onClick={e => handleQuickStatusUpdate(order.id, 'delivered', e)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                            >
                              Livrer
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-bbs-600 hover:bg-bbs-100 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
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

      {/* ORDER DETAILS DRAWER / MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-bbs-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Drawer Header */}
            <div className="px-6 py-4 bg-bbs-950 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="text-xs text-gold-300 font-bold uppercase tracking-wider">
                  Détail de la Commande
                </div>
                <h2 className="font-serif text-xl font-bold">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-bbs-300 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Status Update Actions Bar */}
              <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-bbs-900">Changer le statut :</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[selectedOrder.orderStatus]?.bg} ${statusColors[selectedOrder.orderStatus]?.text}`}>
                    Actuel : {statusColors[selectedOrder.orderStatus]?.label}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {[
                    { id: 'new', label: 'Nouvelle' },
                    { id: 'confirmed', label: 'Confirmée' },
                    { id: 'processing', label: 'En cours' },
                    { id: 'shipped', label: 'Expédiée' },
                    { id: 'delivered', label: 'Livrée' },
                    { id: 'cancelled', label: 'Annulée' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={isUpdatingStatus || selectedOrder.orderStatus === s.id}
                      onClick={() => handleStatusChange(s.id)}
                      className={`py-2 px-1 rounded-xl font-bold text-[11px] transition-all ${
                        selectedOrder.orderStatus === s.id
                          ? 'bg-bbs-900 text-white shadow'
                          : 'bg-white text-bbs-800 hover:bg-bbs-200/70 border border-bbs-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Information & Direct Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-bbs-200 space-y-2">
                  <div className="font-bold text-bbs-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-bbs-600" />
                    Adresse de Livraison
                  </div>
                  <div className="font-semibold text-bbs-950 text-sm">{selectedOrder.customer.name}</div>
                  <p className="text-bbs-700">{selectedOrder.customer.address}</p>
                  <p className="text-bbs-500">{selectedOrder.customer.city} ({selectedOrder.customer.region})</p>
                  {selectedOrder.customer.notes && (
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-800 text-[11px]">
                      <strong>Note cliente :</strong> {selectedOrder.customer.notes}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white rounded-2xl border border-bbs-200 space-y-2">
                  <div className="font-bold text-bbs-900 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-bbs-600" />
                    Contact & Actions Directes
                  </div>
                  <div className="text-bbs-950 font-bold text-sm">{selectedOrder.customer.phone}</div>
                  {selectedOrder.customer.email && (
                    <p className="text-bbs-600">{selectedOrder.customer.email}</p>
                  )}

                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href={`tel:${selectedOrder.customer.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-bbs-100 hover:bg-bbs-200 text-bbs-900 rounded-xl font-bold text-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Appeler
                    </a>
                    <a
                      href={getWhatsAppMessage(selectedOrder)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Direct
                    </a>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-4 bg-white rounded-2xl border border-bbs-200 space-y-3">
                <div className="font-bold text-bbs-900">Articles Commandés</div>
                <div className="divide-y divide-bbs-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-bbs-100 border border-bbs-200"
                        />
                        <div>
                          <div className="font-bold text-bbs-900">{item.name}</div>
                          <div className="text-bbs-500 text-[11px]">
                            {item.shade && <span>Teinte : {item.shade} • </span>}
                            <span>Qté : {item.quantity} × {formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-bbs-950 font-serif">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotals & Total */}
                <div className="pt-3 border-t border-bbs-100 space-y-1.5 text-right">
                  <div className="flex justify-between text-bbs-600">
                    <span>Sous-total :</span>
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-bbs-600">
                    <span>Frais de livraison :</span>
                    <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Réduction appliquée :</span>
                      <span>- {formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-bbs-950 font-serif pt-1 border-t border-bbs-200">
                    <span>Total à encaisser :</span>
                    <span className="text-base text-gold-700">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Order Timeline History */}
              <div className="p-4 bg-bbs-50 rounded-2xl border border-bbs-200 space-y-2">
                <div className="font-bold text-bbs-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-bbs-600" />
                  Historique de la commande
                </div>
                <div className="space-y-2 pt-1">
                  {selectedOrder.history.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px]">
                      <div className="w-2 h-2 rounded-full bg-gold-500 mt-1 shrink-0" />
                      <div>
                        <span className="font-bold text-bbs-900 uppercase">[{h.status}]</span>{' '}
                        <span className="text-bbs-600">{h.note || ''}</span>
                        <div className="text-[10px] text-bbs-400">
                          {new Date(h.date).toLocaleString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-bbs-50 border-t border-bbs-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-bbs-200 hover:bg-bbs-100 text-bbs-800 rounded-xl font-bold text-xs"
              >
                <Printer className="w-4 h-4" />
                Imprimer le Reçu
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-bbs-900 hover:bg-bbs-800 text-white rounded-xl font-bold text-xs shadow"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, MapPin, ShoppingBag, Eye, Calendar, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Customer, Order } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminCustomersPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getCustomers(searchTerm);
      setCustomers(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  const viewCustomerDetails = async (id: string) => {
    try {
      const details = await api.getCustomer(id);
      setSelectedCustomer(details);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-bbs-950">
            Fichier Clients (CRM)
          </h1>
          <p className="text-xs text-bbs-600">
            {customers.length} clientes enregistrées • Historique des achats et fidélité
          </p>
        </div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-bbs-100 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-bbs-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, email, ville..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bbs-50/70 border border-bbs-200 rounded-xl text-xs text-bbs-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-bbs-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-bbs-50/70 border-b border-bbs-100 text-bbs-500 uppercase tracking-wider font-bold">
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-3">Téléphone & WhatsApp</th>
                <th className="py-3.5 px-3">Ville</th>
                <th className="py-3.5 px-3">Commandes</th>
                <th className="py-3.5 px-3">Total Dépensé</th>
                <th className="py-3.5 px-3">Dernière Commande</th>
                <th className="py-3.5 px-4 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bbs-50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-bbs-500">
                    Aucune cliente trouvée.
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} className="hover:bg-bbs-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-bbs-950">
                      <div>{c.name}</div>
                      {c.email && <div className="text-[11px] text-bbs-500 font-normal">{c.email}</div>}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-semibold text-bbs-800">
                        <span>{c.phone}</span>
                        <a
                          href={`https://wa.me/${c.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 p-1"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-bbs-700">{c.city || 'Dakar'}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 bg-gold-100 text-gold-900 rounded-full font-bold text-[10px]">
                        {c.ordersCount} cmd
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-serif font-bold text-bbs-950 text-sm">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-3.5 px-3 text-bbs-600">
                      {new Date(c.lastOrderDate).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => viewCustomerDetails(c.id)}
                        className="p-1.5 text-bbs-700 hover:bg-bbs-100 rounded-xl transition-colors"
                        title="Voir historique"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl space-y-5 text-xs max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-bbs-100 shrink-0">
              <div>
                <span className="text-[10px] text-gold-600 font-bold uppercase tracking-wider">Fiche Cliente</span>
                <h3 className="font-serif text-lg font-bold text-bbs-950">{selectedCustomer.name}</h3>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 text-bbs-400 hover:text-bbs-900">✕</button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 p-4 bg-bbs-50 rounded-2xl border border-bbs-100">
                <div>
                  <span className="text-bbs-500 text-[10px] uppercase font-bold">Téléphone</span>
                  <p className="font-bold text-bbs-950">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <span className="text-bbs-500 text-[10px] uppercase font-bold">Email</span>
                  <p className="font-bold text-bbs-950">{selectedCustomer.email || 'Non renseigné'}</p>
                </div>
                <div>
                  <span className="text-bbs-500 text-[10px] uppercase font-bold">Total Dépensé</span>
                  <p className="font-bold text-gold-700 font-serif text-sm">{formatPrice(selectedCustomer.totalSpent)}</p>
                </div>
                <div>
                  <span className="text-bbs-500 text-[10px] uppercase font-bold">Nombre de commandes</span>
                  <p className="font-bold text-bbs-950">{selectedCustomer.ordersCount}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-bbs-900 mb-2">Historique des Commandes</h4>
                <div className="space-y-2">
                  {(!selectedCustomer.orders || selectedCustomer.orders.length === 0) ? (
                    <p className="text-bbs-500 text-center py-4">Aucune commande enregistrée pour cette cliente.</p>
                  ) : (
                    selectedCustomer.orders.map(order => (
                      <div key={order.id} className="p-3 bg-white rounded-xl border border-bbs-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-bbs-950">#{order.orderNumber}</div>
                          <div className="text-[11px] text-bbs-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')} • {order.items.length} produit(s)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-bbs-950 font-serif">{formatPrice(order.total)}</div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-bbs-100 font-bold text-bbs-800">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-bbs-900 text-white rounded-xl font-bold"
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

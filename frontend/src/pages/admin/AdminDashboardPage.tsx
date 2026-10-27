import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  Users,
  CreditCard,
  Plus,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  Eye
} from 'lucide-react';
import { DashboardData, Order } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

interface AdminDashboardPageProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { formatPrice } = useStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardData();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      fetchDashboard();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-bbs-300 border-t-bbs-900 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-bbs-600">Chargement des données en direct...</p>
      </div>
    );
  }

  const { summary, lowStockProducts, topProducts, topCollections, last7DaysChart, recentOrders } = data;

  // Find max revenue for chart scaling
  const maxChartRev = Math.max(...last7DaysChart.map(d => d.revenue), 10000);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Actions Bar (Mobile First Thumb Friendly) */}
      <div className="bg-gradient-to-r from-bbs-950 via-bbs-900 to-bbs-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-xs font-semibold border border-gold-400/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Tableau de Bord BBS By Salma
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold">
            Bonjour, Salma ✨
          </h1>
          <p className="text-xs sm:text-sm text-bbs-200 mt-1">
            Voici les performances en temps réel de votre boutique en ligne.
          </p>
        </div>

        {/* Action Buttons for Mobile Thumb Reach */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate('products', { openNew: true })}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-bbs-950 font-bold text-xs rounded-2xl shadow-lg shadow-gold-900/40 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Ajouter un Produit
          </button>
          <button
            onClick={() => onNavigate('collections', { openNew: true })}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-bbs-800 hover:bg-bbs-700 text-white font-semibold text-xs rounded-2xl border border-bbs-700/60 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            + Nouvelle Gamme
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-bbs-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-bbs-500 text-xs font-semibold mb-2">
            <span>Chiffre d'affaires Total</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-bbs-950 font-serif">
            {formatPrice(summary.totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-2">
            <span>Aujourd'hui : {formatPrice(summary.todayRevenue)}</span>
          </div>
        </div>

        {/* Commandes Aujourd'hui & Mois */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-bbs-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-bbs-500 text-xs font-semibold mb-2">
            <span>Commandes (Aujourd'hui)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-bbs-950">
            {summary.todayOrdersCount} <span className="text-xs font-normal text-bbs-500">commandes</span>
          </div>
          <div className="text-[11px] text-bbs-600 font-semibold mt-2">
            Mois en cours : <span className="text-bbs-900 font-bold">{summary.monthOrdersCount}</span>
          </div>
        </div>

        {/* Panier Moyen */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-bbs-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-bbs-500 text-xs font-semibold mb-2">
            <span>Panier Moyen</span>
            <div className="p-2 bg-gold-50 text-gold-600 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-bbs-950 font-serif">
            {formatPrice(summary.averageCart)}
          </div>
          <div className="text-[11px] text-bbs-600 font-semibold mt-2">
            {summary.totalProductsSold} articles vendus au total
          </div>
        </div>

        {/* Alertes Stock Faible */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-bbs-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-bbs-500 text-xs font-semibold mb-2">
            <span>Alertes Stock</span>
            <div className={`p-2 rounded-xl ${summary.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-bbs-50 text-bbs-600'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-bbs-950">
            {summary.lowStockCount + summary.outOfStockCount}{' '}
            <span className="text-xs font-normal text-bbs-500">articles</span>
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-2">
            {summary.outOfStockCount} épuisé(s) • {summary.lowStockCount} faible(s)
          </div>
        </div>
      </div>

      {/* Chart Section & Sales Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive 7-Day Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-bbs-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-bbs-950">Ventes des 7 derniers jours</h2>
              <p className="text-xs text-bbs-500">Évolution quotidienne du chiffre d'affaires</p>
            </div>
            <button
              onClick={() => onNavigate('sales')}
              className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900"
            >
              Voir détails <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-52 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-bbs-100">
            {last7DaysChart.map((item, idx) => {
              const heightPercent = Math.max(8, Math.round((item.revenue / maxChartRev) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-bbs-950 text-white text-[10px] rounded-lg px-2 py-1 absolute -translate-y-16 pointer-events-none z-10 whitespace-nowrap shadow-lg">
                    {formatPrice(item.revenue)} ({item.ordersCount} cmd)
                  </div>

                  <div className="w-full max-w-[42px] bg-bbs-100 rounded-t-xl overflow-hidden flex flex-col justify-end transition-all h-full">
                    <div
                      className="w-full bg-gradient-to-t from-bbs-900 via-bbs-700 to-gold-500 rounded-t-xl group-hover:opacity-90 transition-all duration-500"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-bbs-700">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-bbs-500 mt-3 pt-1">
            <span>Volume quotidien</span>
            <span className="font-semibold text-bbs-900">
              Total semaine : {formatPrice(summary.weekRevenue)}
            </span>
          </div>
        </div>

        {/* Top Best Sellers Products */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-bbs-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-bbs-950">Produits Vedettes</h2>
              <span className="text-xs text-bbs-500">Par volume</span>
            </div>

            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-xs text-bbs-500 py-4 text-center">Aucune vente enregistrée.</p>
              ) : (
                topProducts.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-bbs-50/70 hover:bg-bbs-100/60 transition-colors">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-bbs-200 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-bbs-900 truncate">{p.name}</div>
                      <div className="text-[11px] text-bbs-500">{p.count} vendus</div>
                    </div>
                    <div className="text-xs font-bold text-gold-700 whitespace-nowrap">
                      {formatPrice(p.revenue)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="mt-4 w-full py-2.5 text-center text-xs font-bold text-bbs-900 bg-bbs-100 hover:bg-bbs-200 rounded-xl transition-colors"
          >
            Gérer tout le catalogue ({summary.totalProductsInCatalog} produits)
          </button>
        </div>
      </div>

      {/* Recent Orders Section with Status Actions */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-bbs-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-bbs-950">Dernières Commandes</h2>
            <p className="text-xs text-bbs-500">Mettez à jour le statut en direct sans quitter le dashboard</p>
          </div>
          <button
            onClick={() => onNavigate('orders')}
            className="inline-flex items-center gap-1 text-xs font-bold text-gold-700 hover:text-gold-900"
          >
            Toutes les commandes ({summary.totalOrders}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-bbs-100 text-bbs-400 uppercase tracking-wider font-bold">
                <th className="pb-3 px-2">Numéro</th>
                <th className="pb-3 px-2">Cliente</th>
                <th className="pb-3 px-2">Articles</th>
                <th className="pb-3 px-2">Total</th>
                <th className="pb-3 px-2">Paiement</th>
                <th className="pb-3 px-2">Statut</th>
                <th className="pb-3 px-2 text-right">Action Rapide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bbs-50">
              {recentOrders.map(order => {
                const statusColors: Record<string, string> = {
                  new: 'bg-rose-100 text-rose-800',
                  confirmed: 'bg-blue-100 text-blue-800',
                  processing: 'bg-amber-100 text-amber-800',
                  shipped: 'bg-purple-100 text-purple-800',
                  delivered: 'bg-emerald-100 text-emerald-800',
                  cancelled: 'bg-gray-100 text-gray-700'
                };

                const statusLabels: Record<string, string> = {
                  new: 'Nouvelle',
                  confirmed: 'Confirmée',
                  processing: 'En préparation',
                  shipped: 'Expédiée',
                  delivered: 'Livrée',
                  cancelled: 'Annulée'
                };

                return (
                  <tr key={order.id} className="hover:bg-bbs-50/50 transition-colors">
                    <td className="py-3 px-2 font-bold text-bbs-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-semibold text-bbs-900">{order.customer.name}</div>
                      <div className="text-[11px] text-bbs-500">{order.customer.phone}</div>
                    </td>
                    <td className="py-3 px-2 text-bbs-600">
                      {order.items.length} article(s)
                    </td>
                    <td className="py-3 px-2 font-bold text-bbs-950 font-serif">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-2 uppercase font-semibold text-[10px] text-bbs-600">
                      {order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : order.paymentMethod}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors[order.orderStatus] || 'bg-bbs-100 text-bbs-800'}`}>
                        {statusLabels[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="inline-flex items-center gap-1">
                        {order.orderStatus === 'new' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            Confirmer
                          </button>
                        )}
                        {order.orderStatus === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            Préparer
                          </button>
                        )}
                        {order.orderStatus === 'processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            Expédier
                          </button>
                        )}
                        {order.orderStatus === 'shipped' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                          >
                            Livrer
                          </button>
                        )}
                        <button
                          onClick={() => onNavigate('orders')}
                          className="p-1 text-bbs-500 hover:text-bbs-900 hover:bg-bbs-100 rounded-lg"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

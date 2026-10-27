import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, CreditCard, Sparkles, Calendar, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';
import { DashboardData } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';

export const AdminSalesPage: React.FC = () => {
  const { formatPrice } = useStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.getDashboardData();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [period]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="w-8 h-8 border-4 border-bbs-300 border-t-bbs-900 rounded-full animate-spin" />
      </div>
    );
  }

  const { summary, topProducts, topCollections, last7DaysChart, ordersByStatus } = data;

  const currentRevenue =
    period === 'today' ? summary.todayRevenue :
    period === 'week' ? summary.weekRevenue :
    period === 'month' ? summary.monthRevenue : summary.totalRevenue;

  const currentOrders =
    period === 'today' ? summary.todayOrdersCount :
    period === 'week' ? summary.weekOrdersCount :
    period === 'month' ? summary.monthOrdersCount : summary.totalOrders;

  return (
    <div className="space-y-6">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-bbs-950">
            Rapports de Ventes & Statistiques
          </h1>
          <p className="text-xs text-bbs-600">
            Analyse financière détaillée et performance des gammes
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-bbs-200 shadow-sm text-xs font-bold">
          {[
            { id: 'today', label: 'Aujourd\'hui' },
            { id: 'week', label: 'Cette Semaine' },
            { id: 'month', label: 'Ce Mois' },
            { id: 'year', label: 'Cette Année' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                period === t.id
                  ? 'bg-bbs-900 text-white shadow'
                  : 'text-bbs-700 hover:bg-bbs-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-bbs-100 shadow-sm">
          <span className="text-xs font-semibold text-bbs-500">Chiffre d'Affaires ({period.toUpperCase()})</span>
          <div className="text-2xl font-bold text-bbs-950 font-serif mt-2">{formatPrice(currentRevenue)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">✓ En direct</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-bbs-100 shadow-sm">
          <span className="text-xs font-semibold text-bbs-500">Commandes Traitées</span>
          <div className="text-2xl font-bold text-bbs-950 mt-2">{currentOrders}</div>
          <div className="text-[11px] text-bbs-600 font-semibold mt-1">Total global : {summary.totalOrders}</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-bbs-100 shadow-sm">
          <span className="text-xs font-semibold text-bbs-500">Panier Moyen</span>
          <div className="text-2xl font-bold text-bbs-950 font-serif mt-2">{formatPrice(summary.averageCart)}</div>
          <div className="text-[11px] text-bbs-600 font-semibold mt-1">Sur l'ensemble des commandes</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-bbs-100 shadow-sm">
          <span className="text-xs font-semibold text-bbs-500">Articles Vendus</span>
          <div className="text-2xl font-bold text-bbs-950 mt-2">{summary.totalProductsSold}</div>
          <div className="text-[11px] text-bbs-600 font-semibold mt-1">Pièces distribuées</div>
        </div>
      </div>

      {/* Best Performers Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-bold text-bbs-950">Produits les plus vendus</h3>
            <span className="text-xs font-semibold text-bbs-500">Top 5</span>
          </div>

          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-bbs-50/80 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bbs-900 text-gold-300 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-bbs-950 text-xs">{p.name}</div>
                    <div className="text-[11px] text-bbs-500">{p.count} unités vendues</div>
                  </div>
                </div>
                <div className="font-serif font-bold text-gold-700 text-xs">
                  {formatPrice(p.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gammes / Collections */}
        <div className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-base font-bold text-bbs-950">Gammes les plus populaires</h3>
            <span className="text-xs font-semibold text-bbs-500">Par chiffre d'affaires</span>
          </div>

          <div className="space-y-3">
            {topCollections.length === 0 ? (
              <p className="text-xs text-bbs-500 py-6 text-center">Aucune donnée de gamme disponible.</p>
            ) : (
              topCollections.map((col, idx) => (
                <div key={idx} className="p-3 bg-gold-50/40 border border-gold-200/60 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-gold-600" />
                    <div>
                      <div className="font-bold text-bbs-950 text-xs">{col.name}</div>
                      <div className="text-[11px] text-bbs-500">{col.count} produits vendus dans cette gamme</div>
                    </div>
                  </div>
                  <div className="font-serif font-bold text-bbs-950 text-xs">
                    {formatPrice(col.revenue)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

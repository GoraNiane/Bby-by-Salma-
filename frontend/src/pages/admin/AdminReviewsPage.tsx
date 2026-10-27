import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Search, MessageSquare } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getReviews();
      setReviews(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateReviewStatus(id, status);
      await fetchReviews();
      setNotification('✓ Statut de l’avis mis à jour.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cet avis ?')) {
      try {
        await api.deleteReview(id);
        await fetchReviews();
        setNotification('✓ Avis supprimé.');
        setTimeout(() => setNotification(null), 3000);
      } catch (err: any) {
        alert(err.message || 'Erreur');
      }
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-bbs-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-gold-400 text-xs font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{notification}</span>
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl font-bold text-bbs-950">
          Modération des Avis Clients
        </h1>
        <p className="text-xs text-bbs-600">
          {reviews.length} témoignages reçus • Approuvez ou filtrez les avis publics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white p-5 rounded-3xl border border-bbs-100 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= rev.rating ? 'fill-gold-400 text-gold-400' : 'text-bbs-200'}`}
                    />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {rev.status === 'approved' ? 'Approuvé' : 'En attente'}
                </span>
              </div>

              <h4 className="font-bold text-bbs-950 text-xs">{rev.title}</h4>
              <p className="text-xs text-bbs-700 mt-1 italic leading-relaxed">"{rev.comment}"</p>
              
              <div className="mt-3 pt-2 border-t border-bbs-100 flex items-center justify-between text-[11px] text-bbs-500">
                <span className="font-semibold text-bbs-900">{rev.customerName} {rev.verified && '✓ Achat vérifié'}</span>
                <span>{rev.productName || 'Produit BBS'}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-bbs-100">
              {rev.status !== 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'approved')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold"
                >
                  Approuver
                </button>
              )}
              {rev.status === 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'pending')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold"
                >
                  Masquer
                </button>
              )}
              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

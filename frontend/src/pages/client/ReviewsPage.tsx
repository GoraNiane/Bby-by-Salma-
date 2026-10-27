import React, { useState, useEffect } from 'react';
import { Star, Sparkles, CheckCircle, MessageSquare, Plus, X } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';

interface ReviewsPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        setLoading(true);
        const res = await api.getReviews({ status: 'approved' });
        setReviews(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    try {
      await api.createReview({
        productId: 'prod_fond_teint_luxe',
        customerName: reviewName,
        rating: reviewRating,
        title: reviewTitle || 'Avis sur BBS By Salma',
        comment: reviewComment
      });

      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
        setReviewName('');
        setReviewTitle('');
        setReviewComment('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 pb-20 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 rounded-full text-xs font-bold uppercase tracking-wider text-gold-900">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          Expériences & Témoignages
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bbs-950">
          Les Avis de Nos Clientes
        </h1>
        <p className="text-xs sm:text-sm text-bbs-600">
          Découvrez les retours authentiques de femmes qui ont adopté BBS By Salma dans leur routine quotidienne.
        </p>

        <div className="pt-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-bbs-900 hover:bg-bbs-800 text-white rounded-2xl text-xs font-bold shadow-lg"
          >
            + Partager Mon Témoignage
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(rev => (
          <div key={rev.id} className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gold-500">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-4 h-4 ${s <= rev.rating ? 'fill-current' : 'text-bbs-200'}`} />
                  ))}
                </div>
                <span className="text-[10px] text-bbs-400 font-semibold">
                  {new Date(rev.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <h3 className="font-serif font-bold text-base text-bbs-950">
                {rev.title}
              </h3>

              <p className="text-xs text-bbs-700 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-bbs-100 flex items-center justify-between text-xs">
              <span className="font-bold text-bbs-950">{rev.customerName}</span>
              {rev.verified && (
                <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Achat Vérifié
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-bbs-100">
              <h3 className="font-serif text-base font-bold text-bbs-950">Partager votre avis</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-bbs-500" /></button>
            </div>

            {success ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-base font-bold text-bbs-950">Merci infiniment !</h4>
                <p className="text-xs text-bbs-600">Votre avis a été enregistré avec succès.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre note *</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 text-gold-500 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-current' : 'text-bbs-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre Nom *</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    placeholder="ex: Amina D."
                    className="w-full px-3 py-2 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Titre de l'avis</label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    placeholder="ex: Le meilleur fond de teint !"
                    className="w-full px-3 py-2 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-bbs-900 mb-1">Votre commentaire *</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Expliquez ce que vous avez aimé..."
                    className="w-full px-3 py-2 border border-bbs-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-bbs-100 rounded-xl font-bold">Annuler</button>
                  <button type="submit" className="px-5 py-2 bg-bbs-900 text-white rounded-xl font-bold">Publier</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

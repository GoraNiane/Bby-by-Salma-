import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onNavigateToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccess,
  onNavigateToStore
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || 'Identifiants incorrects.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@bbsbysalma.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-bbs-warm-gradient flex flex-col justify-center items-center p-4">
      {/* Back to store link */}
      <button
        onClick={onNavigateToStore}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-bbs-700 hover:text-bbs-950 transition-colors"
      >
        ← Retour à la boutique publique
      </button>

      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-bbs-900 text-gold-300 shadow-xl shadow-bbs-950/20 mb-4 ring-4 ring-gold-400/20">
            <span className="font-serif text-3xl font-bold">B</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-bbs-950">
            BBS <span className="text-gold-600">BY SALMA</span>
          </h1>
          <p className="text-sm text-bbs-600 mt-1">
            Portail d’Administration & Gestion de Boutique
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-bbs-200/80">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-bbs-100">
            <div className="p-2 bg-gold-100 text-gold-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-bbs-900">Espace Sécurisé</h2>
              <p className="text-xs text-bbs-500">Connectez-vous pour piloter votre activité</p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 mb-5 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700 animate-fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bbs-700 mb-1.5">
                Adresse Email Administratrice
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-bbs-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-bbs-50/70 border border-bbs-200 rounded-2xl text-sm text-bbs-900 placeholder:text-bbs-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                  placeholder="admin@bbsbysalma.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bbs-700 mb-1.5">
                Mot de Passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-bbs-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-bbs-50/70 border border-bbs-200 rounded-2xl text-sm text-bbs-900 placeholder:text-bbs-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bbs-400 hover:text-bbs-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-2xl text-sm shadow-xl shadow-bbs-950/20 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <span>Accéder à l'Administration</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>
          </form>

          {/* Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-bbs-100 flex items-center justify-between text-xs">
            <span className="text-bbs-500">Identifiants par défaut :</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1 font-semibold text-gold-700 hover:text-gold-900 bg-gold-50 px-2.5 py-1 rounded-lg border border-gold-200/60"
            >
              <Sparkles className="w-3 h-3 text-gold-500" />
              Remplir Démo
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-bbs-500 mt-6">
          © 2026 BBS By Salma. Tous droits réservés. Système de gestion sécurisé.
        </p>
      </div>
    </div>
  );
};

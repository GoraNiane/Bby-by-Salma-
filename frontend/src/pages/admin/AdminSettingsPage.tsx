import React, { useState, useEffect } from 'react';
import { Settings, Save, Lock, User, CheckCircle, Volume2, Truck, CreditCard } from 'lucide-react';
import { StoreSettings } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshStore } = useStore();
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<StoreSettings | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      await api.updateSettings(formData);
      await refreshStore();
      setNotification('✓ Paramètres enregistrés avec succès.');
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    setPwdError(null);

    if (newPassword !== confirmPassword) {
      setPwdError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      await api.updateProfile({
        currentPassword,
        newPassword
      });
      setPwdMsg('✓ Mot de passe modifié avec succès.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdMsg(null), 3000);
    } catch (err: any) {
      setPwdError(err.message || 'Erreur lors du changement de mot de passe');
    }
  };

  if (!formData) return null;

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
          Paramètres Généraux & Sécurité
        </h1>
        <p className="text-xs text-bbs-600">
          Devise, frais de livraison par région, alertes et sécurité du compte
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store & Delivery Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-5 text-xs">
            <h2 className="font-serif text-base font-bold text-bbs-950 border-b border-bbs-100 pb-3">
              Paramètres de la Boutique & Livraison
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-bbs-900 mb-1">Nom de la Boutique</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Symbole Devise</label>
                <input
                  type="text"
                  value={formData.currencySymbol}
                  onChange={e => setFormData({ ...formData, currencySymbol: e.target.value })}
                  className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Seuil Livraison Gratuite (FCFA)</label>
                <input
                  type="number"
                  value={formData.freeDeliveryThreshold}
                  onChange={e => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-bbs-900 mb-1">Seuil Alerte Stock Global</label>
                <input
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={e => setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-bbs-900 mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#1BA5E1]" />
                  <span>Lien Marchand Wave Sénégal (pay.wave.com)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://pay.wave.com/m/M_sn_UoRxc-HJ7lK-/c/sn/"
                  value={formData.wavePaymentUrl || ''}
                  onChange={e => setFormData({ ...formData, wavePaymentUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl font-mono text-xs text-[#0284C7]"
                />
                <p className="text-[10px] text-bbs-500 mt-1">
                  Ce lien permet d'ouvrir directement l'application Wave de l'acheteuse avec le montant de son panier déjà prescrit.
                </p>
              </div>
            </div>

            {/* Delivery Fees By Region */}
            <div className="pt-2">
              <label className="block font-bold text-bbs-900 mb-2 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-bbs-600" />
                Frais de Livraison par Région au Sénégal & International
              </label>

              <div className="space-y-2">
                {formData.deliveryFees.map((df, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={df.region}
                      onChange={e => {
                        const copy = [...formData.deliveryFees];
                        copy[idx].region = e.target.value;
                        setFormData({ ...formData, deliveryFees: copy });
                      }}
                      className="flex-1 px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl font-semibold"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={df.fee}
                        onChange={e => {
                          const copy = [...formData.deliveryFees];
                          copy[idx].fee = Number(e.target.value);
                          setFormData({ ...formData, deliveryFees: copy });
                        }}
                        className="w-24 px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl font-bold text-right"
                      />
                      <span className="font-bold text-bbs-700">FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-bbs-900 text-white font-bold rounded-xl shadow"
              >
                Enregistrer les Paramètres
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password Management */}
        <div className="space-y-6">
          <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-bbs-100 shadow-sm space-y-4 text-xs">
            <h2 className="font-serif text-base font-bold text-bbs-950 border-b border-bbs-100 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-bbs-600" />
              Sécurité du Compte
            </h2>

            {pwdMsg && <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl font-semibold">{pwdMsg}</div>}
            {pwdError && <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl font-semibold">{pwdError}</div>}

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-bbs-900 mb-1">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-bbs-50 border border-bbs-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-bbs-900 hover:bg-bbs-800 text-white font-bold rounded-xl shadow"
            >
              Modifier le Mot de Passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

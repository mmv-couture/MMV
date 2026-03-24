import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const AdminPaymentSettings: React.FC = () => {
  const { getPaymentSettings, updatePaymentSettings } = useAuth();
  const settings = getPaymentSettings();
  const [local, setLocal] = useState(settings);

  if (!local) return <div>Aucun paramètre de paiement trouvé.</div>;

  const toggleProvider = (id: string) => {
    setLocal(prev => ({
      ...prev!,
      mobileMoneyProviders: prev!.mobileMoneyProviders.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    }));
  };

  const handleSave = () => {
    updatePaymentSettings(local!);
    alert('Paramètres de paiement mis à jour');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-orange-900">Paramètres de Paiement</h3>
          <p className="text-sm text-gray-500 mt-1">Configuration des fournisseurs et tarification</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-orange-100">
        <h4 className="font-bold text-sm mb-3">Fournisseurs Mobile Money</h4>
        <div className="space-y-3">
          {local.mobileMoneyProviders.map(p => (
            <div key={p.id} className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-orange-900">{p.name}</div>
                <div className="text-xs text-stone-500">Compte: {p.accountNumber} • Code: {p.transferCode}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs">Activer</label>
                <input type="checkbox" checked={p.enabled} onChange={() => toggleProvider(p.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-orange-100">
        <h4 className="font-bold text-sm mb-3">Tarification</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs">Mensuel (CFA)</label>
            <input className="w-full px-3 py-2 border rounded mt-1" value={local.pricing.monthly} onChange={(e) => setLocal(prev => ({ ...prev!, pricing: { ...prev!.pricing, monthly: Number(e.target.value) } }))} />
          </div>
          <div>
            <label className="text-xs">Trimestriel (CFA)</label>
            <input className="w-full px-3 py-2 border rounded mt-1" value={local.pricing.quarterly} onChange={(e) => setLocal(prev => ({ ...prev!, pricing: { ...prev!.pricing, quarterly: Number(e.target.value) } }))} />
          </div>
          <div>
            <label className="text-xs">Annuel (CFA)</label>
            <input className="w-full px-3 py-2 border rounded mt-1" value={local.pricing.yearly} onChange={(e) => setLocal(prev => ({ ...prev!, pricing: { ...prev!.pricing, yearly: Number(e.target.value) } }))} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="px-4 py-2 bg-orange-600 text-white rounded">Enregistrer</button>
      </div>
    </div>
  );
};

export default AdminPaymentSettings;

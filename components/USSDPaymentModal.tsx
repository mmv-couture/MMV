import * as React from 'react';
import {
  getPlatformSettings,
  createUSSDSession,
  dialUSSD,
} from '../utils/subscriptionSystem';

interface USSDPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  atelierId: string;
  phoneNumber: string;
  userType: 'atelier' | 'client';
  onSuccess: () => void;
}

export const USSDPaymentModal: React.FC<USSDPaymentModalProps> = ({
  isOpen,
  onClose,
  userId,
  atelierId,
  phoneNumber,
  userType,
  onSuccess,
}) => {
  const [step, setStep] = React.useState<'plan' | 'provider' | 'code' | 'processing' | 'success'>('plan');
  const [selectedPlan, setSelectedPlan] = React.useState<'plan1' | 'plan2' | 'plan3'>('plan1');
  const [selectedProvider, setSelectedProvider] = React.useState<'orange' | 'mtn' | 'moov' | 'celtis'>('orange');
  const [ussdCode, setUssdCode] = React.useState('');
  const [sessionId, setSessionId] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [settings, setSettings] = React.useState(getPlatformSettings());

  React.useEffect(() => {
    setSettings(getPlatformSettings());
  }, []);

  if (!isOpen) return null;

  const handlePlanSelect = (plan: 'plan1' | 'plan2' | 'plan3') => {
    setSelectedPlan(plan);
    setStep('provider');
  };

  const handleProviderSelect = (provider: 'orange' | 'mtn' | 'moov' | 'celtis') => {
    setSelectedProvider(provider);
    const plan = settings.subscriptionPlans.find(p => p.id === selectedPlan);
    if (!plan) return;

    const session = createUSSDSession(userId, atelierId, phoneNumber, selectedPlan, provider);
    setUssdCode(session.ussdCode);
    setSessionId(session.id);
    
    setStep('code');
  };

  const handleDial = () => {
    dialUSSD(ussdCode);
    setStep('processing');
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      onSuccess();
    }, 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ussdCode);
    alert('Code USSD copié !');
  };

  const plan = settings.subscriptionPlans.find(p => p.id === selectedPlan);
  const activeProviders = settings.ussdProviders.filter(p => p.isActive);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black">Abonnement</h2>
              <p className="text-orange-100 text-sm mt-1">
                {step === 'plan' && 'Choisissez votre forfait'}
                {step === 'provider' && 'Sélectionnez votre opérateur'}
                {step === 'code' && 'Composez le code USSD'}
                {step === 'processing' && 'Traitement en cours...'}
                {step === 'success' && 'Demande envoyée !'}
              </p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white">✕</button>
          </div>
        </div>

        <div className="p-6">
          {step === 'plan' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">Sélectionnez le forfait qui correspond à vos besoins</p>
              {settings.subscriptionPlans.filter(p => p.isActive).map((planData) => (
                <button
                  key={planData.id}
                  onClick={() => handlePlanSelect(planData.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedPlan === planData.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-900">{planData.name}</h3>
                      <p className="text-sm text-gray-500">{planData.duration} jours</p>
                      <p className="text-xs text-gray-400 mt-1">{planData.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-orange-600">{planData.price.toLocaleString()} CFA</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {planData.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{feature}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'provider' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">Choisissez votre opérateur mobile money</p>
              <div className="grid grid-cols-2 gap-3">
                {activeProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedProvider === provider.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}
                  >
                    <div className="text-center">
                      <span className="text-3xl block mb-2">
                        {provider.id === 'orange' && '🟠'}
                        {provider.id === 'mtn' && '🟡'}
                        {provider.id === 'moov' && '🔵'}
                        {provider.id === 'celtis' && '🟢'}
                      </span>
                      <p className="font-bold text-sm text-gray-900">{provider.name}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('plan')} className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">← Retour aux forfaits</button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-4">Composez ce code sur votre téléphone</p>
                <div className="bg-gray-900 text-white p-6 rounded-xl font-mono text-lg tracking-wider">{ussdCode}</div>
                <button onClick={handleCopyCode} className="mt-3 text-orange-600 text-sm hover:underline">📋 Copier le code</button>
              </div>

              <div className="space-y-3">
                <button onClick={handleDial} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                  <span>📱</span> Composer automatiquement
                </button>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-800"><strong>⚠️ Important :</strong> Votre abonnement sera activé uniquement après validation par notre équipe.</p>
              </div>

              <button onClick={() => setStep('provider')} className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm">← Changer d'opérateur</button>
            </div>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Traitement en cours</h3>
              <p className="text-gray-600">Veuillez compléter le paiement sur votre téléphone...</p>
              <p className="text-sm text-gray-500 mt-4">Session: {sessionId.slice(-8)}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-4xl">✓</span></div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Demande envoyée !</h3>
              <p className="text-gray-600 mb-6">Votre paiement est en attente de validation par l'administrateur.</p>
              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left">
                <p className="text-sm text-gray-600">Forfait: <span className="font-bold">{plan?.name}</span></p>
                <p className="text-sm text-gray-600">Montant: <span className="font-bold">{plan?.price.toLocaleString()} CFA</span></p>
                <p className="text-sm text-gray-600">Statut: <span className="text-yellow-600 font-bold">En attente</span></p>
              </div>
              <button onClick={onClose} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all">Continuer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default USSDPaymentModal;

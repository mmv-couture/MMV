import React, { useState } from 'react';
import { MobileMoneyProvider, SubscriptionPlan } from '../types';
import { useAuth } from '../auth/AuthContext';
import { OperatorCard } from './OperatorCard';
import { formatTransferCode } from '../utils/subscriptionUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  atelierId: string;
}

type PaymentStep = 'plan-select' | 'operator-select' | 'transfer-instructions' | 'confirmation';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  atelierId,
}) => {
  const { getPaymentSettings, addPaymentTransaction } = useAuth();
  const settings = getPaymentSettings();

  const [step, setStep] = useState<PaymentStep>('plan-select');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<MobileMoneyProvider | null>(null);
  const [senderPhone, setSenderPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !settings) return null;

  const plans: { plan: SubscriptionPlan; label: string; price: number; duration: string }[] = [
    { plan: 'monthly', label: 'Mensuel', price: settings.pricing.monthly, duration: '1 mois' },
    {
      plan: 'quarterly',
      label: 'Trimestriel',
      price: settings.pricing.quarterly,
      duration: '3 mois',
    },
    { plan: 'yearly', label: 'Annuel', price: settings.pricing.yearly, duration: '12 mois' },
  ];

  const enabledOperators = settings.mobileMoneyProviders.filter(p => p.enabled);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep('operator-select');
  };

  const handleSelectOperator = (operator: MobileMoneyProvider) => {
    setSelectedOperator(operator);
    setStep('transfer-instructions');
  };

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !selectedOperator) return;

    setIsSubmitting(true);
    const currentPlan = plans.find(p => p.plan === selectedPlan)!;

    try {
      addPaymentTransaction({
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        atelierId,
        amount: currentPlan.price,
        currency: settings.pricing.currency,
        plan: selectedPlan,
        provider: selectedOperator.type,
        senderPhoneNumber: senderPhone,
        transferCode: formatTransferCode(selectedOperator.transferCode, currentPlan.price),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      // Reset form
      setStep('confirmation');

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setStep('plan-select');
        setSelectedPlan(null);
        setSelectedOperator(null);
        setSenderPhone('');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'plan-select' && '💳 Choisir un plan'}
            {step === 'operator-select' && '📱 Sélectionner un opérateur'}
            {step === 'transfer-instructions' && '💸 Instructions de transfert'}
            {step === 'confirmation' && '✅ Paiement en attente'}
          </h2>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Plan Selection */}
          {step === 'plan-select' && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Choisissez le plan qui vous convient:
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {plans.map(({ plan, label, price, duration }) => (
                  <button
                    key={plan}
                    onClick={() => handleSelectPlan(plan)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:shadow-md transition-all text-left"
                  >
                    <h3 className="font-semibold text-lg text-gray-900">{label}</h3>
                    <p className="text-gray-600 text-sm mt-1">{duration}</p>
                    <p className="text-2xl font-bold text-orange-600 mt-3">
                      {price.toLocaleString('fr-FR')} {settings.pricing.currency}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Operator Selection */}
          {step === 'operator-select' && selectedPlan && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">
                Sélectionnez un opérateur Mobile Money:
              </p>
              <div className="space-y-3">
                {enabledOperators.map(operator => (
                  <OperatorCard
                    key={operator.id}
                    provider={operator}
                    amount={plans.find(p => p.plan === selectedPlan)?.price || 0}
                    onSelect={handleSelectOperator}
                    selected={selectedOperator?.id === operator.id}
                  />
                ))}
              </div>
              {enabledOperators.length === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  ⚠️ Aucun opérateur disponible pour le moment. Veuillez contacter l'administrateur.
                </div>
              )}
              <button
                onClick={() => setStep('plan-select')}
                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                ← Retour
              </button>
            </div>
          )}

          {/* Step 3: Transfer Instructions */}
          {step === 'transfer-instructions' && selectedPlan && selectedOperator && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Plan:</span>{' '}
                  {plans.find(p => p.plan === selectedPlan)?.label}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Opérateur:</span> {selectedOperator.name}
                </p>
                <p className="text-2xl font-bold text-orange-600 mt-3">
                  Montant: {plans.find(p => p.plan === selectedPlan)?.price.toLocaleString('fr-FR')}{' '}
                  {settings.pricing.currency}
                </p>
              </div>

              {/* Large Transfer Code */}
              <div className="bg-orange-100 border-2 border-orange-500 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Code de transfert:</p>
                <p className="font-mono text-4xl font-bold text-orange-900 break-all">
                  {formatTransferCode(
                    selectedOperator.transferCode,
                    plans.find(p => p.plan === selectedPlan)?.price || 0
                  )}
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      formatTransferCode(
                        selectedOperator.transferCode,
                        plans.find(p => p.plan === selectedPlan)?.price || 0
                      )
                    );
                  }}
                >
                  📋 Copier le code
                </button>
              </div>

              {/* Sender Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro d'envoyeur (optionnel):
                </label>
                <input
                  type="tel"
                  placeholder="Ex: +229 01 52 03 07 44 ou 0229123456789"
                  value={senderPhone}
                  onChange={e => setSenderPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Utile pour retrouver votre transaction si nécessaire
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">📱 Comment envoyer le transfert:</h4>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Ouvrez l'application {selectedOperator.name}</li>
                  <li>Sélectionnez "Envoyer de l'argent"</li>
                  <li>Entrez le code ci-dessus ou tapez-le directement</li>
                  <li>Vérifiez le montant et confirmez</li>
                  <li>Vous recevrez une confirmation par SMS</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('operator-select')}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-all"
                >
                  {isSubmitting ? '⏳ Envoi...' : '✓ J\'ai envoyé le transfert'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Paiement reçu!</h3>
              <p className="text-gray-600 mb-4">
                Votre transfert est en attente de confirmation par l'administrateur.
              </p>
              <p className="text-sm text-gray-500">
                Cela prend généralement 1-2 heures. Vous recevrez une notification de confirmation.
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-6">
                Merci! 🙏
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

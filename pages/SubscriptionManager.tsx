import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { PaymentModal } from '../components/PaymentModal';
import {
  getDaysRemaining,
  isSubscriptionExpired,
  shouldShowReminderBanner,
  getSubscriptionStatusMessage,
  formatDateFR,
} from '../utils/subscriptionUtils';

export const SubscriptionManager: React.FC = () => {
  const { atelier } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!atelier?.subscription) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-900">
          <h2 className="text-xl font-bold mb-2">⚠️ Erreur</h2>
          <p>Aucune information d'abonnement trouvée. Veuillez recharger la page.</p>
        </div>
      </div>
    );
  }

  const subscription = atelier.subscription;
  const daysRemaining = getDaysRemaining(subscription.expiryDate);
  const isExpired = isSubscriptionExpired(subscription);
  const shouldRemind = shouldShowReminderBanner(subscription.expiryDate);
  const statusMessage = getSubscriptionStatusMessage(subscription);

  // Progress bar percentage
  const totalDays = subscription.status === 'trial' ? 60 : 30; // 60 for trial, 30 for active (approx)
  const progressPercent = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));

  // Get badge color
  const getStatusBadgeColor = () => {
    if (isExpired) return 'bg-gray-100 text-gray-900';
    if (shouldRemind) return 'bg-red-100 text-red-900';
    if (subscription.status === 'trial') return 'bg-orange-100 text-orange-900';
    return 'bg-green-100 text-green-900';
  };

  const getProgressColor = () => {
    if (isExpired) return 'bg-gray-400';
    if (shouldRemind) return 'bg-red-500';
    if (subscription.status === 'trial') return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📅 Gestion de l'abonnement</h1>
        <p className="text-gray-600">Gérez votre abonnement et vos paiements</p>
      </div>

      {/* Status Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{statusMessage}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {subscription.status === 'trial'
                ? `Vous êtes en période d'essai gratuit`
                : subscription.status === 'active'
                ? 'Accès complet à la plateforme'
                : 'Accès limité'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusBadgeColor()}`}>
            {subscription.status === 'trial'
              ? '🎁 Essai gratuit'
              : subscription.status === 'active'
              ? '✅ Actif'
              : subscription.status === 'expired'
              ? '❌ Expiré'
              : '⏸️ En pause'}
          </div>
        </div>

        {/* Progress Bar */}
        {!isExpired && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                {daysRemaining} jour{daysRemaining !== 1 ? 's' : ''} restant{daysRemaining !== 1 ? 's' : ''}
              </span>
              <span className="text-sm text-gray-600">
                Expire: {formatDateFR(subscription.expiryDate)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${getProgressColor()} transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Warning if expiring soon */}
        {shouldRemind && !isExpired && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mt-4">
            <p className="text-red-900 text-sm font-semibold">
              ⚠️ Votre abonnement expire dans {daysRemaining} jour{daysRemaining !== 1 ? 's' : ''}
            </p>
            <p className="text-red-800 text-xs mt-1">
              Renouvelez votre abonnement dès maintenant pour éviter une interruption de service.
            </p>
          </div>
        )}

        {/* Expired message */}
        {isExpired && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mt-4">
            <p className="text-red-900 font-semibold mb-2">
              🔒 Votre abonnement a expiré
            </p>
            <p className="text-red-800 text-sm mb-3">
              Certaines fonctionnalités sont limitées. Renouvelez votre abonnement pour retrouver l'accès complet.
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      {(isExpired || shouldRemind) && (
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-all text-lg"
        >
          {isExpired ? '🔓 Renouveler mon abonnement' : '💳 Renouveler avant expiration'}
        </button>
      )}

      {!isExpired && !shouldRemind && subscription.status === 'active' && (
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
        >
          💳 Ajuster ou renouveler l'abonnement
        </button>
      )}

      {subscription.status === 'trial' && !isExpired && !shouldRemind && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            Vous avez encore {daysRemaining} jour{daysRemaining !== 1 ? 's' : ''} gratuit{daysRemaining !== 1 ? 's' : ''}. Préparez-vous à renouveler!
          </p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-3 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg"
          >
            💳 Voir les plans de paiement
          </button>
        </div>
      )}

      {/* Payment Details */}
      {subscription.lastPaymentDate && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">📊 Dernier paiement</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Date:</span> {formatDateFR(subscription.lastPaymentDate)}
          </p>
          {subscription.paymentMethod && (
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">Opérateur:</span>{' '}
              {subscription.paymentMethod === 'mtn'
                ? 'MTN Mobile Money'
                : subscription.paymentMethod === 'orange'
                ? 'Orange Money'
                : subscription.paymentMethod === 'moov'
                ? 'Moov Money'
                : 'Autre'}
            </p>
          )}
        </div>
      )}

      {/* Transaction History */}
      {atelier.paymentHistory && atelier.paymentHistory.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">📋 Historique des paiements</h3>
          <div className="space-y-3">
            {atelier.paymentHistory.slice(-5).reverse().map(transaction => (
              <div
                key={transaction.id}
                className="border-l-4 border-orange-500 bg-gray-50 p-3 rounded-r"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900">
                    {transaction.amount.toLocaleString('fr-FR')} {transaction.currency}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      transaction.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.status === 'confirmed'
                      ? '✓ Confirmé'
                      : transaction.status === 'pending'
                      ? '⏳ En attente'
                      : '✕ Échoué'}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {transaction.provider.toUpperCase()} • {formatDateFR(transaction.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-gray-900 mb-4">❓ Questions fréquentes</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-900">Puis-je annuler mon abonnement?</p>
            <p>Oui, vous pouvez arrêter votre renouvellement à tout moment. Contactez-nous pour plus d'infos.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Combien de temps avant confirmation du paiement?</p>
            <p>Les paiements Mobile Money sont généralement confirmés dans 1-2 heures pendant les heures de bureau.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Puis-je changer de plan?</p>
            <p>Oui, vous pouvez à tout moment passer à un plan plus haut ou plus bas. Le nouveau plan s'appliquera au prochain renouvellement.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Aucun opérateur n'est disponible?</p>
            <p>Contactez l'administrateur pour qu'il active les opérateurs Mobile Money de votre pays.</p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        atelierId={atelier.id}
      />
    </div>
  );
};

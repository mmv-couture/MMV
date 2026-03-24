import React from 'react';
import { MobileMoneyProvider } from '../types';
import { formatTransferCode, getTransferInstructions } from '../utils/subscriptionUtils';

interface OperatorCardProps {
  provider: MobileMoneyProvider;
  amount: number;
  onSelect: (provider: MobileMoneyProvider) => void;
  selected?: boolean;
}

export const OperatorCard: React.FC<OperatorCardProps> = ({
  provider,
  amount,
  onSelect,
  selected = false,
}) => {
  const [showInstructions, setShowInstructions] = React.useState(false);
  const transferCode = formatTransferCode(provider.transferCode, amount);
  const instructions = getTransferInstructions(provider, amount);

  const getOperatorIcon = () => {
    switch (provider.type) {
      case 'mtn':
        return '🟡'; // Jaune pour MTN
      case 'orange':
        return '🟠'; // Orange
      case 'moov':
        return '🟦'; // Bleu pour Moov
      default:
        return '💳';
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        selected
          ? 'border-orange-500 bg-orange-50 shadow-md'
          : 'border-gray-200 bg-white hover:shadow-md'
      }`}
      onClick={() => onSelect(provider)}
    >
      {/* Header: Icon + Name */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getOperatorIcon()}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
            {!provider.enabled && (
              <p className="text-xs text-red-500">⚠️ Non activé par l'admin</p>
            )}
          </div>
        </div>
        {selected && (
          <div className="text-xl text-orange-500">✓</div>
        )}
      </div>

      {/* Account details */}
      <div className="bg-gray-50 rounded p-3 mb-3 text-sm">
        <p className="text-gray-600">
          <span className="font-semibold">Compte:</span> {provider.accountNumber}
        </p>
        <p className="text-gray-600 mt-1">
          <span className="font-semibold">Titulaire:</span> {provider.accountHolderName}
        </p>
      </div>

      {/* Transfer code (highlighted) */}
      <div className="bg-orange-100 border border-orange-300 rounded p-3 mb-3">
        <p className="text-xs text-gray-600 mb-1">Code de transfert:</p>
        <p className="font-mono text-lg font-bold text-orange-900">{transferCode}</p>
        <button
          className="mt-2 text-xs text-orange-600 hover:text-orange-800 underline"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(transferCode);
            // TODO: Show toast notification
          }}
        >
          📋 Copier le code
        </button>
      </div>

      {/* Instructions toggle */}
      <button
        className="text-sm text-orange-600 hover:text-orange-800 underline flex items-center gap-1"
        onClick={(e) => {
          e.stopPropagation();
          setShowInstructions(!showInstructions);
        }}
      >
        {showInstructions ? '▼' : '▶'} Instructions détaillées
      </button>

      {/* Instructions (expandable) */}
      {showInstructions && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700 whitespace-pre-wrap font-mono text-xs">
          {instructions}
        </div>
      )}

      {/* Select button */}
      {!provider.enabled && (
        <button
          className="mt-3 w-full py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed text-sm"
          disabled
        >
          Non disponible
        </button>
      )}
      {provider.enabled && (
        <button
          className={`mt-3 w-full py-2 rounded font-semibold text-sm transition-all ${
            selected
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-orange-100 hover:bg-orange-200 text-orange-900'
          }`}
          onClick={() => onSelect(provider)}
        >
          {selected ? '✓ Sélectionné' : 'Utiliser cet opérateur'}
        </button>
      )}
    </div>
  );
};

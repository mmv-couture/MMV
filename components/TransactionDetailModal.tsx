import React from 'react';
import type { PaymentTransaction } from '../types';

interface Props {
  transaction: PaymentTransaction | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

const TransactionDetailModal: React.FC<Props> = ({ transaction, onClose, onConfirm, onReject }) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-stone-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-black text-orange-900">Détails de la transaction</h3>
            <p className="text-xs text-stone-500">ID: {transaction.id}</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-700">✕</button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-stone-700">
          <div><strong>Atelier:</strong> {transaction.atelierId}</div>
          <div><strong>Montant:</strong> {transaction.amount.toLocaleString()} {transaction.currency}</div>
          <div><strong>Plan:</strong> {transaction.plan}</div>
          <div><strong>Opérateur:</strong> {transaction.provider}</div>
          <div><strong>Téléphone:</strong> {transaction.senderPhoneNumber || '—'}</div>
          <div><strong>Statut:</strong> {transaction.status}</div>
          <div className="sm:col-span-2"><strong>Code de transfert:</strong> <span className="font-mono ml-2">{transaction.transferCode}</span></div>
          <div className="sm:col-span-2"><strong>Créé le:</strong> {new Date(transaction.createdAt).toLocaleString('fr-FR')}</div>
        </div>

        <div className="mt-6 flex items-center gap-3 justify-end">
          {transaction.status === 'pending' && (
            <>
              <button onClick={() => onConfirm(transaction.id)} className="px-4 py-2 bg-green-600 text-white rounded">Confirmer</button>
              <button onClick={() => {
                const reason = prompt('Raison du rejet') || 'Rejeté par admin';
                onReject(transaction.id, reason);
              }} className="px-4 py-2 bg-red-600 text-white rounded">Rejeter</button>
            </>
          )}
          <button onClick={onClose} className="px-3 py-2 bg-stone-200 rounded">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;

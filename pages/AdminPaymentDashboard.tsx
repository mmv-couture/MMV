import React, { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { PaymentTransaction } from '../types';
import TransactionDetailModal from '../components/TransactionDetailModal';

type CsvColumn = 'id' | 'atelier' | 'amount' | 'currency' | 'plan' | 'provider' | 'phone' | 'transferCode' | 'status' | 'createdAt';

const AdminPaymentDashboard: React.FC = () => {
  const { getAllAteliersWithManager, confirmPayment, rejectPayment, user } = useAuth();
  const ateliers = getAllAteliersWithManager();
  const [rejecting, setRejecting] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'confirmed'|'failed'>('all');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [selected, setSelected] = useState<PaymentTransaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCsvConfig, setShowCsvConfig] = useState(false);
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>(['id', 'atelier', 'amount', 'plan', 'provider', 'status', 'createdAt']);

  const csvColumnLabels: Record<CsvColumn, string> = {
    id: 'ID Transaction',
    atelier: 'Atelier',
    amount: 'Montant',
    currency: 'Devise',
    plan: 'Plan',
    provider: 'Opérateur',
    phone: 'Téléphone',
    transferCode: 'Code Transfert',
    status: 'Statut',
    createdAt: 'Créé le'
  };

  const transactions: (PaymentTransaction & { atelierName?: string })[] = useMemo(() => {
    let txs: (PaymentTransaction & { atelierName?: string })[] = [];
    ateliers.forEach(a => {
      if (a.paymentHistory) {
        a.paymentHistory.forEach(t => txs.push({ ...t, atelierName: a.name }));
      }
    });
    return txs.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [ateliers]);

  const filtered = transactions.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (providerFilter !== 'all' && t.provider !== providerFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      if (!((t.atelierName || '').toLowerCase().includes(s) || (t.senderPhoneNumber || '').toLowerCase().includes(s) || (t.transferCode || '').toLowerCase().includes(s))) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedFiltered = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const providers = Array.from(new Set(transactions.map(t => t.provider)));

  const pending = filtered.filter(t => t.status === 'pending');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-orange-900">Paiements en attente</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Liste des transactions en cours de validation</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="px-3 py-1 bg-orange-50 rounded-lg border border-orange-200 flex-shrink-0">
            <span className="text-xs font-bold text-orange-900">Affichés: {filtered.length}</span>
          </div>
          {/* Filter presets - scrollable on mobile */}
          <div className="flex gap-1 overflow-x-auto pb-2 sm:pb-0">
            <button onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }} title="Afficher les en attente" className="px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs font-bold hover:bg-yellow-100 flex-shrink-0">⏳ En attente</button>
            <button onClick={() => { setStatusFilter('confirmed'); setCurrentPage(1); }} title="Afficher les confirmés" className="px-2 py-1 bg-green-50 border border-green-200 rounded text-xs font-bold hover:bg-green-100 flex-shrink-0">✓ Confirmés</button>
            <button onClick={() => { setStatusFilter('all'); setCurrentPage(1); }} title="Réinitialiser filtre" className="px-2 py-1 bg-stone-100 border border-stone-200 rounded text-xs font-bold hover:bg-stone-200 flex-shrink-0">↺ Tout</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="text-xs sm:text-sm px-2 py-1 rounded border border-stone-300 bg-white dark:bg-stone-800 flex-1 sm:flex-none">
              <option value="all">Tous</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmé</option>
              <option value="failed">Échoué</option>
            </select>
            <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)} className="text-xs sm:text-sm px-2 py-1 rounded border border-stone-300 bg-white dark:bg-stone-800 flex-1 sm:flex-none">
              <option value="all">Tous opérateurs</option>
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <input placeholder="Recherche..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-2 py-1 rounded border border-stone-300 bg-white dark:bg-stone-800 text-xs sm:text-sm flex-1 sm:flex-none" />
            <button onClick={() => {
              // CSV export of filtered
              const rows = filtered.map(r => {
                const rec: Record<string, any> = { id: r.id, atelier: r.atelierName || r.atelierId, amount: r.amount, currency: r.currency, plan: r.plan, provider: r.provider, phone: r.senderPhoneNumber, transferCode: r.transferCode, status: r.status, createdAt: r.createdAt };
                return Object.fromEntries(csvColumns.map(col => [col, rec[col]]));
              });
              const header = csvColumns.map(col => csvColumnLabels[col]).join(',');
              const csv = [header].concat(rows.map(r => csvColumns.map(col => `"${String(r[col] || '').replace(/"/g,'""')}"`).join(','))).join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = `transactions_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
            }} className="px-3 py-1 bg-stone-200 rounded text-sm">Export CSV</button>
            <button onClick={() => setShowCsvConfig(!showCsvConfig)} className="px-3 py-1 bg-stone-200 rounded text-sm">⚙️ CSV</button>
          </div>
      </div>
      {showCsvConfig && (
        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <p className="text-xs font-bold mb-2">Colonnes CSV</p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(csvColumnLabels) as CsvColumn[]).map(col => (
              <label key={col} className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={csvColumns.includes(col)} onChange={(e) => 
                  setCsvColumns(e.target.checked ? [...csvColumns, col] : csvColumns.filter(c => c !== col))
                } />
                {csvColumnLabels[col]}
              </label>
            ))}
          </div>
        </div>
      )}

      {paginatedFiltered.length === 0 && filtered.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-orange-100 shadow-sm text-center">
          <p className="text-lg font-bold text-gray-600">✓ Aucune transaction en attente</p>
          <p className="text-sm text-gray-500 mt-2">Toutes les transactions sont traitées</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 gap-4">
          {paginatedFiltered.map(tx => (
            <div key={tx.id} onClick={() => setSelected(tx)} className="bg-white p-4 rounded-lg border border-orange-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:shadow-md">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-orange-900">{tx.atelierName}</div>
                  <div className="text-xs text-stone-500">• {new Date(tx.createdAt).toLocaleString('fr-FR')}</div>
                </div>
                <div className="mt-2 text-sm text-stone-700">
                  <p><strong>Montant:</strong> {tx.amount.toLocaleString()} {tx.currency}</p>
                  <p><strong>Plan:</strong> {tx.plan}</p>
                  <p><strong>Opérateur:</strong> {tx.provider}</p>
                  <p><strong>Téléphone expéditeur:</strong> {tx.senderPhoneNumber || '—'}</p>
                  <p className="mt-1 text-xs text-stone-500">Code de transfert: <span className="font-mono ml-2">{tx.transferCode}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); confirmPayment(tx.id, user?.id || 'admin'); }} className="px-4 py-2 bg-green-50 text-green-700 rounded border border-green-200 font-bold text-xs">✓ Confirmer</button>
                <button onClick={(e) => { e.stopPropagation(); setRejecting(tx.id); }} className="px-4 py-2 bg-red-50 text-red-700 rounded border border-red-200 font-bold text-xs">✗ Rejeter</button>
              </div>

              {rejecting === tx.id && (
                <div className="mt-3 sm:mt-0 sm:ml-4 w-full sm:w-80">
                  <input placeholder="Raison du refus" className="w-full px-3 py-2 border rounded" id={`rej-${tx.id}`} />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => {
                      const input = (document.getElementById(`rej-${tx.id}`) as HTMLInputElement);
                      rejectPayment(tx.id, user?.id || 'admin', input?.value || 'Refus par admin');
                      setRejecting(null);
                    }} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Envoyer</button>
                    <button onClick={() => setRejecting(null)} className="px-3 py-1 bg-stone-200 rounded text-xs">Annuler</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-stone-100 rounded text-sm disabled:opacity-50">← Avant</button>
            <div className="flex items-center gap-1">
              {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} className={`px-2 py-1 rounded text-sm ${currentPage === page ? 'bg-orange-600 text-white' : 'bg-stone-100'}`}>{page}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-stone-100 rounded text-sm disabled:opacity-50">Après →</button>
          </div>
        )}
        <div className="flex items-center justify-between mt-3 text-xs text-stone-500 flex-wrap gap-3">
          <div>
            Affichage {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filtered.length)} sur {filtered.length}
          </div>
          <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="px-2 py-1 border rounded text-xs">
            <option value={5}>5 par page</option>
            <option value={10}>10 par page</option>
            <option value={25}>25 par page</option>
            <option value={50}>50 par page</option>
          </select>
        </div>
        </>
      )}

      {selected && (
        <TransactionDetailModal transaction={selected} onClose={() => setSelected(null)} onConfirm={(id) => { confirmPayment(id, user?.id || 'admin'); setSelected(null); }} onReject={(id, reason) => { rejectPayment(id, user?.id || 'admin', reason); setSelected(null); }} />
      )}
    </div>
  );
};

export default AdminPaymentDashboard;

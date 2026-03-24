import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const AdminModerationLogs: React.FC = () => {
  const { getModerationLogs } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [filterAction, setFilterAction] = useState<string>('all');

  useEffect(() => {
    setLogs(getModerationLogs());
  }, [getModerationLogs]);

  const filteredLogs = filterAction === 'all' 
    ? logs 
    : logs.filter(l => l.action.toLowerCase() === filterAction.toLowerCase());

  const actionColors: Record<string, { bg: string; text: string; icon: string }> = {
    approved: { bg: 'bg-green-50', text: 'text-green-700', icon: '✓' },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: '✗' },
    edited: { bg: 'bg-blue-50', text: 'text-blue-700', icon: '✎' },
    deleted: { bg: 'bg-gray-50', text: 'text-gray-700', icon: '✕' },
  };

  const getActionStyle = (action: string) => actionColors[action.toLowerCase()] || actionColors.edited;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-2xl font-black text-orange-900">Historique de Modération</h3>
        <p className="text-sm text-gray-500 mt-2">{filteredLogs.length} action(s) enregistrée(s)</p>
      </div>

      {/* Filter */}
      <div className="flex gap-3 flex-wrap">
        {['all', 'approved', 'rejected', 'edited', 'deleted'].map(action => (
          <button
            key={action}
            onClick={() => setFilterAction(action)}
            className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              filterAction === action
                ? 'bg-orange-900 text-white shadow-md'
                : 'bg-white border border-orange-200 text-orange-900 hover:border-orange-900'
            }`}
          >
            {action === 'all' ? 'Tous' : action}
          </button>
        ))}
      </div>

      {/* Logs List */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-orange-100 shadow-sm text-center">
          <p className="text-lg font-bold text-gray-600">Aucune action enregistrée</p>
          <p className="text-sm text-gray-500 mt-2">Les actions de modération s'afficheront ici</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map(l => {
            const style = getActionStyle(l.action);
            return (
              <div key={l.id} className={`${style.bg} ${style.text} p-5 rounded-xl border border-current border-opacity-20 transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{style.icon}</span>
                      <div>
                        <p className="font-black uppercase tracking-wider">{l.action}</p>
                        <p className="text-xs font-bold opacity-75 mt-1">ID: {l.modelId?.slice(0, 8)}...</p>
                      </div>
                    </div>
                    <div className="text-xs font-bold opacity-75 mt-3">
                      <p>Acteur: <span className="opacity-100">{l.actor}</span></p>
                      <p>Date: <span className="opacity-100">{new Date(l.date).toLocaleString('fr-FR')}</span></p>
                    </div>
                    {l.note && (
                      <div className="mt-3 p-3 bg-white bg-opacity-40 rounded-lg border border-current border-opacity-20">
                        <p className="text-xs font-bold opacity-75">Note:</p>
                        <p className="text-sm mt-1 opacity-100">{l.note}</p>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-3xl font-black opacity-20">{style.icon}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminModerationLogs;

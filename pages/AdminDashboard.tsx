
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { AtelierWithManager, Modele, ShowcaseStatus } from '../types';
import AdminPaymentDashboard from './AdminPaymentDashboard';
import AdminPaymentSettings from './AdminPaymentSettings';
import AdminTutorialsManager from './AdminTutorialsManager';
import SiteCustomization from '../components/SiteCustomization';
import AdminUsers from './AdminUsers';
import AdminModerationLogs from './AdminModerationLogs';
import AdminLayout from '../components/AdminLayout';

const MetricTile: React.FC<{ title: string; value: string | number; color: string; icon?: React.ReactNode; onClick?: () => void }> = ({ title, value, color, icon, onClick }) => (
    <div onClick={onClick} className={`bg-white p-6 rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3 ${onClick ? 'cursor-pointer' : ''}`}>
        <div className="flex items-center justify-between">
            <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{title}</p>
            {icon && <div className={`p-2 rounded-lg ${color}`}>{icon}</div>}
        </div>
        <p className="text-3xl font-black text-orange-900 tracking-tight">{value}</p>
        <div className="h-1 bg-gradient-to-r from-orange-200 to-orange-50 rounded-full w-1/3"></div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { getAllAteliersWithManager, updateSubscription, logout, impersonate, updateShowcaseStatus, getPlatformStats, sendSystemNotification, getPendingShowcaseModels } = useAuth();
    
    const [ateliers, setAteliers] = useState<AtelierWithManager[]>(getAllAteliersWithManager());
    const [currentPage, setCurrentPage] = useState<'overview' | 'ateliers' | 'showroom' | 'cms' | 'users' | 'logs' | 'payments' | 'paymentSettings' | 'tutorials'>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const stats = useMemo(() => getPlatformStats(), [ateliers]);

    const allModels = useMemo(() => {
        let models: Modele[] = [];
        ateliers.forEach(a => { if (a.data.models) models = [...models, ...a.data.models]; });
        return models;
    }, [ateliers]);

    const pendingModels = useMemo(() => getPendingShowcaseModels(), [ateliers, getPendingShowcaseModels]);

    const [toastMessage, setToastMessage] = useState<string | null>(null);
    useEffect(() => {
        if (!toastMessage) return;
        const t = setTimeout(() => setToastMessage(null), 3500);
        return () => clearTimeout(t);
    }, [toastMessage]);

    useEffect(() => {
        // keep local ateliers state in sync when external data changes
        setAteliers(getAllAteliersWithManager());
    }, [getAllAteliersWithManager]);

    const chartData = [35, 52, 41, 68, 82, 75, 94]; // Simulation cohérente

    return (
        <AdminLayout currentPage={currentPage} setCurrentPage={setCurrentPage} logout={logout}>
                    {currentPage === 'overview' && (
                        <div className="max-w-5xl space-y-8 animate-fade-in">
                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricTile 
                                    title="Partenaires Total" 
                                    value={stats.totalAteliers} 
                                    color="bg-orange-50"
                                    icon={<DashboardIcon className="w-5 h-5 text-orange-900" />}
                                />
                                <MetricTile 
                                    title="Modèles en Ligne" 
                                    value={allModels.length} 
                                    color="bg-orange-50"
                                    icon={<CatalogueIcon className="w-5 h-5 text-orange-700" />}
                                />
                                <MetricTile 
                                    title="Revenu MRR (CFA)" 
                                    value={stats.estimatedMRR.toLocaleString()} 
                                    color="bg-green-50"
                                    icon={<FinancesIcon className="w-5 h-5 text-green-700" />}
                                />
                                <MetricTile 
                                    title="En Attente" 
                                    value={allModels.filter(m => m.showcaseStatus === 'pending').length} 
                                    color="bg-yellow-50"
                                    icon={<OrderIcon className="w-5 h-5 text-amber-700" />}
                                />
                            </div>

                            {/* Traffic Graph */}
                            <div className="bg-white p-8 rounded-xl border border-orange-100 shadow-sm">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-600">Croissance du Réseau</h3>
                                        <p className="text-xs text-gray-400 mt-1">7 derniers jours</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs font-bold text-green-700">+18% vs sem.</span>
                                    </div>
                                </div>
                                <div className="h-72 flex items-end justify-between gap-2 sm:gap-4 relative px-2">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                                        {[1,2,3,4].map(l => <div key={l} className="border-t border-gray-300 w-full"></div>)}
                                    </div>
                                    
                                    {chartData.map((h, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-3 z-10 group">
                                            <div 
                                                className="w-full bg-gradient-to-t from-orange-900 to-orange-700 rounded-t-xl transition-all duration-500 hover:from-orange-800 hover:to-orange-600 cursor-pointer relative group-hover:shadow-lg group-hover:scale-y-105 origin-bottom" 
                                                style={{ height: `${h}%` }}
                                                title={`Jour ${i+1}: ${h} inscrits`}
                                            >
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2 py-1 rounded">{h}</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">J{i+1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Derniers Inscrits */}
                                <div className="bg-white p-8 rounded-xl border border-orange-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-sm font-black uppercase text-gray-600">Derniers Inscrits</h4>
                                            <p className="text-xs text-gray-400 mt-1">4 derniers ateliers</p>
                                        </div>
                                        <div className="px-3 py-1 bg-orange-50 rounded-lg border border-orange-200">
                                            <span className="text-xs font-bold text-orange-900">{ateliers.length} total</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {ateliers.slice(-4).reverse().map((a, idx) => (
                                            <div key={a.id} className="flex items-center justify-between p-4 bg-orange-50/50 rounded-lg hover:bg-orange-100/50 transition-colors border border-orange-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-sm text-white">
                                                        {a.name.slice(0,2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-orange-900 truncate">{a.name}</p>
                                                        <p className="text-xs text-gray-500">{a.data.managerProfile?.specialization || 'Mode'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-gray-600">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</p>
                                                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Actif</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Système & Alertes */}
                                <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-8 rounded-xl shadow-lg text-white border border-orange-700">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h4 className="text-sm font-black uppercase">Système & Alertes</h4>
                                            <p className="text-xs text-orange-100 mt-1">État et notifications</p>
                                        </div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <ul className="text-xs space-y-4 font-medium">
                                        <li className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-orange-700/50">
                                            <span className="text-green-400 text-lg mt-0.5">✓</span>
                                            <span>Mise à jour v2.5 déployée avec succès.</span>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-orange-700/50">
                                            <span className="text-green-400 text-lg mt-0.5">✓</span>
                                            <span>Mise à jour v2.5 déployée avec succès.</span>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-orange-700/50">
                                            <span className="text-green-400 text-lg mt-0.5">✓</span>
                                            <span>Backup automatique effectué à 04:00.</span>
                                        </li>
                                        <li className="flex items-start gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-orange-700/50">
                                            <span className="text-yellow-300 text-lg mt-0.5">⚠</span>
                                            <span>Utilisation mémoire: 72% (Normal)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'ateliers' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-orange-900">Gestion des Ateliers</h3>
                                    <p className="text-sm text-gray-500 mt-2">{ateliers.length} structures enregistrées</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-orange-100 shadow-sm">
                                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                                        <table className="w-full text-left text-sm">
                                    <thead className="bg-orange-50 border-b-2 border-orange-200">
                                        <tr>
                                            <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600">Structure</th>
                                            <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600">Manager</th>
                                            <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600">Abonnement</th>
                                            <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600">Clients</th>
                                            <th className="px-6 py-4 font-black text-xs uppercase tracking-widest text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-orange-50">
                                        {ateliers.map(a => (
                                            <tr key={a.id} className="hover:bg-orange-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm">
                                                            {a.name.slice(0,2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-orange-900">{a.name}</p>
                                                            <p className="text-xs text-gray-500">{a.data.managerProfile?.atelierType}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-700">{a.managerEmail}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs font-black px-3 py-1 rounded-lg uppercase tracking-wider ${
                                                        a.subscription.status === 'active'
                                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                        {a.subscription.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-black text-orange-900">{a.data.clients?.length || 0}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => impersonate(a.managerId)}
                                                        className="px-4 py-2 bg-orange-50 text-orange-900 rounded-lg border border-orange-200 font-bold text-xs uppercase tracking-wider hover:bg-orange-100 transition-all"
                                                    >
                                                        Explorer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPage === 'cms' && <SiteCustomization />}
                    {currentPage === 'users' && <AdminUsers />}
                    {currentPage === 'logs' && <AdminModerationLogs />}

                    {currentPage === 'payments' && (
                        <AdminPaymentDashboard />
                    )}

                    {currentPage === 'paymentSettings' && (
                        <AdminPaymentSettings />
                    )}

                    {currentPage === 'tutorials' && (
                        <AdminTutorialsManager />
                    )}

                    <AdminToast message={toastMessage} onClose={() => setToastMessage(null)} />
                    {currentPage === 'showroom' && (
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-orange-900">Modération des Modèles</h3>
                                    <p className="text-sm text-gray-500 mt-2">Validation des créations</p>
                                </div>
                                {pendingModels.length > 0 && (
                                    <div className="px-6 py-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <p className="text-xs font-black text-yellow-700 uppercase tracking-wider">{pendingModels.length} en attente</p>
                                    </div>
                                )}
                            </div>

                            {pendingModels.length === 0 ? (
                                <div className="bg-white p-12 rounded-xl border border-orange-100 shadow-sm text-center">
                                    <p className="text-lg font-bold text-gray-600">✓ Aucun modèle en attente</p>
                                    <p className="text-sm text-gray-500 mt-2">Tous les modèles ont été validés</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {pendingModels.map(m => (
                                        <div key={m.id} className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
                                            <div className="relative h-48 bg-orange-50 overflow-hidden">
                                                <img src={m.imageUrls?.[0] || '/placeholder.png'} alt={m.title} className="w-full h-full object-cover" />
                                                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">
                                                    En attente
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="flex-1">
                                                    <h4 className="font-black text-orange-900 truncate">{m.title}</h4>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-2">{m.genre} • {m.event}</p>
                                                    <p className="text-xs text-gray-600 mt-3 line-clamp-2">{m.description}</p>
                                                    <p className="text-[11px] text-gray-400 mt-3 font-bold">Atelier: <span className="text-orange-900">{m.atelierName || '—'}</span></p>
                                                </div>
                                                <div className="mt-5 flex gap-3 pt-4 border-t border-orange-100">
                                                    <button
                                                        onClick={() => {
                                                            updateShowcaseStatus(m.id, 'approved');
                                                            setAteliers(getAllAteliersWithManager());
                                                            setToastMessage(`✓ Modèle "${m.title}" approuvé`);
                                                        }}
                                                        className="flex-1 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200 font-bold text-xs uppercase tracking-wider hover:bg-green-100 transition-all"
                                                    >
                                                        ✓ Approuver
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            updateShowcaseStatus(m.id, 'rejected');
                                                            setAteliers(getAllAteliersWithManager());
                                                            setToastMessage(`✗ Modèle "${m.title}" rejeté`);
                                                        }}
                                                        className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200 font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all"
                                                    >
                                                        ✗ Rejeter
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Admin Toast */}
                    {toastMessage && (
                        <div className="fixed top-6 right-6 z-50">
                            <div className="bg-brand-navy text-white px-4 py-2 rounded shadow-lg font-bold">{toastMessage}</div>
                        </div>
                    )}
        </AdminLayout>
    );
};

export default AdminDashboard;

import * as React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import AdminTutorialsManager from './AdminTutorialsManager';
import {
  getAnalytics,
  logAction,
  getPlatformSettings,
  savePlatformSettings,
  updateSubscriptionPlan,
  updateUSSDProvider,
  validatePayment,
  getAllUSSDSessions,
  getAllSubscriptions,
  PlatformSettings,
  SubscriptionPlan,
  USSDProvider,
  USSDSession,
  Subscription,
} from '../utils/subscriptionSystem';
import {
  getContentSections,
  saveContentSections,
  createContentSection,
  deleteContentSection,
  reorderSections,
  ContentSection,
  DEFAULT_CONTENT,
} from '../utils/cmsSystem';

interface AdminStats {
  totalAteliers: number;
  activeAteliers: number;
  suspendedAteliers: number;
  pendingAteliers: number;
  totalModels: number;
  approvedModels: number;
  pendingModels: number;
  totalOrders: number;
  totalClients: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
}

type PageType = 'overview' | 'analytics' | 'ateliers' | 'showroom' | 'subscriptions' | 'ussd' | 'users' | 'cms' | 'logs' | 'settings' | 'tutoriels';

const AdminDashboardNew: React.FC = () => {
  const { t } = useLanguage();
  const { getAllAteliersWithManager, logout, impersonate, updateShowcaseStatus, updateAtelierStatus, deleteAtelier, user } = useAuth();

  const [currentPage, setCurrentPage] = React.useState<PageType>('overview');
  const [ateliers, setAteliers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = React.useState<any>(null);
  const [settings, setSettings] = React.useState<PlatformSettings>(getPlatformSettings());

  const loadData = React.useCallback(() => {
    setLoading(true);
    const data = getAllAteliersWithManager();
    setAteliers(data);
    const calculatedStats: AdminStats = {
      totalAteliers: data.length,
      activeAteliers: data.filter((a: any) => a.subscription?.status === 'active').length,
      suspendedAteliers: data.filter((a: any) => a.subscription?.status === 'suspended').length,
      pendingAteliers: data.filter((a: any) => !a.subscription?.status || a.subscription?.status === 'pending').length,
      totalModels: data.reduce((sum: number, a: any) => sum + (a.data?.models?.length || 0), 0),
      approvedModels: data.reduce((sum: number, a: any) => sum + (a.data?.models?.filter((m: any) => m.showcaseStatus === 'approved').length || 0), 0),
      pendingModels: data.reduce((sum: number, a: any) => sum + (a.data?.models?.filter((m: any) => m.showcaseStatus === 'pending').length || 0), 0),
      totalOrders: data.reduce((sum: number, a: any) => sum + (a.data?.orders?.length || 0), 0),
      totalClients: data.reduce((sum: number, a: any) => sum + (a.data?.clients?.length || 0), 0),
      totalRevenue: data.reduce((sum: number, a: any) => sum + (a.data?.orders?.reduce((oSum: number, o: any) => oSum + (o.price || 0), 0) || 0), 0),
      monthlyRecurringRevenue: data.filter((a: any) => a.subscription?.status === 'active').length * 50000,
    };
    setStats(calculatedStats);
    setAnalytics(getAnalytics());
    setSettings(getPlatformSettings());
    setLoading(false);
  }, [getAllAteliersWithManager]);

  React.useEffect(() => {
    loadData();
    logAction('ADMIN_DASHBOARD_LOADED', {}, 'info', user?.id);
  }, [loadData, user?.id]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // HELPER COMPONENTS
  const MetricCard = ({ icon, label, value, trend }: { icon: string; label: string; value: string | number; trend: number }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl">{icon}</span>
        <span className={`text-sm font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>+{trend}%</span>
      </div>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );

  const StatRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );

  // PAGES
  const OverviewPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon="🏭" label="Ateliers" value={stats?.totalAteliers || 0} trend={+15} />
        <MetricCard icon="👔" label="Modèles" value={stats?.totalModels || 0} trend={+8} />
        <MetricCard icon="👥" label="Clients" value={stats?.totalClients || 0} trend={+12} />
        <MetricCard icon="💰" label="Revenus" value={`${(stats?.totalRevenue || 0).toLocaleString()} CFA`} trend={+23} />
      </div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setCurrentPage('analytics')} className="px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-bold">📊 Analytics</button>
          <button onClick={() => setCurrentPage('subscriptions')} className="px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-bold">💳 Abonnements</button>
          <button onClick={() => setCurrentPage('ussd')} className="px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-bold">📱 Paiements USSD</button>
          <button onClick={() => setCurrentPage('cms')} className="px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-bold">📝 CMS</button>
          <button onClick={() => setCurrentPage('tutoriels')} className="px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-bold">📹 Tutoriels</button>
          <button onClick={() => setCurrentPage('logs')} className="px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-sm font-bold">📋 Logs</button>
        </div>
      </div>
    </div>
  );

  const AnalyticsPage = () => {
    const data = analytics || {};
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
            <p className="text-green-100 text-sm font-bold uppercase">Revenu Total</p>
            <p className="text-3xl font-black mt-2">{(data.revenue?.total || 0).toLocaleString()} CFA</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <p className="text-blue-100 text-sm font-bold uppercase">MRR</p>
            <p className="text-3xl font-black mt-2">{(data.revenue?.monthly || 0).toLocaleString()} CFA</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-purple-100 text-sm font-bold uppercase">Projection</p>
            <p className="text-3xl font-black mt-2">{(data.revenue?.projected || 0).toLocaleString()} CFA</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Abonnements</h3>
            <StatRow label="Total" value={data.subscriptions?.total || 0} />
            <StatRow label="Actifs" value={data.subscriptions?.active || 0} />
            <StatRow label="Essai (2 mois)" value={data.subscriptions?.trial || 0} />
            <StatRow label="Plan Essentiel" value={data.subscriptions?.byPlan?.plan1 || 0} />
            <StatRow label="Plan Pro" value={data.subscriptions?.byPlan?.plan2 || 0} />
            <StatRow label="Plan Entreprise" value={data.subscriptions?.byPlan?.plan3 || 0} />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Paiements USSD</h3>
            <StatRow label="Sessions" value={data.ussd?.total || 0} />
            <StatRow label="En attente" value={data.ussd?.pending || 0} />
            <StatRow label="Validés" value={data.ussd?.validated || 0} />
            <StatRow label="Rejetés" value={data.ussd?.rejected || 0} />
            <StatRow label="Montant en attente" value={`${(data.ussd?.pendingAmount || 0).toLocaleString()} CFA`} />
          </div>
        </div>
      </div>
    );
  };

  const AteliersPage = () => {
    const [filter, setFilter] = React.useState<'all' | 'active' | 'suspended' | 'pending' | 'trial'>('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);

    const filtered = React.useMemo(() => {
      return ateliers.filter((a: any) => {
        if (filter !== 'all' && a.subscription?.status !== filter) return false;
        if (searchTerm && !a.name?.toLowerCase().includes(searchTerm.toLowerCase()) && !a.managerEmail?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
    }, [ateliers, filter, searchTerm]);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'trial', 'suspended', 'pending'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f === 'all' ? 'Tous' : f === 'trial' ? 'Essai' : f}
              </button>
            ))}
          </div>
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Atelier</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Manager</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Abonnement</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Expiration</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((atelier: any) => (
                <tr key={atelier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{atelier.name}</p>
                    <p className="text-xs text-gray-500">{atelier.managerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{atelier.managerName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      atelier.subscription?.status === 'active' ? 'bg-green-100 text-green-700' : 
                      atelier.subscription?.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                      atelier.subscription?.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {atelier.subscription?.status === 'trial' ? '2 mois gratuit' : atelier.subscription?.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {atelier.subscription?.expiresAt ? new Date(atelier.subscription.expiresAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { impersonate(atelier.managerId); showToast('Mode exploration actif'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">👁️</button>
                      <button onClick={() => { updateAtelierStatus?.(atelier.id, atelier.subscription?.status === 'active' ? 'suspended' : 'active'); showToast(`Atelier ${atelier.subscription?.status === 'active' ? 'suspendu' : 'activé'}`); loadData(); }} className={`p-2 rounded-lg ${atelier.subscription?.status === 'active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>{atelier.subscription?.status === 'active' ? '⏸️' : '▶️'}</button>
                      <button onClick={() => setConfirmDelete(atelier.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
                <button onClick={() => { deleteAtelier?.(confirmDelete); setConfirmDelete(null); showToast('Atelier supprimé'); loadData(); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ShowroomPage = () => {
    const [models, setModels] = React.useState<any[]>([]);
    React.useEffect(() => {
      const allModels = ateliers.flatMap((a: any) => (a.data?.models || []).map((m: any) => ({ ...m, atelierName: a.name, atelierId: a.id })));
      setModels(allModels);
    }, [ateliers]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold">{models.length}</p>
            <p className="text-sm text-gray-500">Total Modèles</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-green-600">{models.filter((m: any) => m.showcaseStatus === 'approved').length}</p>
            <p className="text-sm text-gray-500">Approuvés</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 text-center">
            <p className="text-2xl font-bold text-yellow-600">{models.filter((m: any) => m.showcaseStatus === 'pending').length}</p>
            <p className="text-sm text-gray-500">En attente</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model: any) => (
            <div key={model.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {model.imageUrl ? <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" /> : <span className="text-4xl">👔</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.atelierName}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">{model.price?.toLocaleString()} CFA</p>
                <div className="flex gap-2 mt-3">
                  {model.showcaseStatus === 'pending' && (
                    <>
                      <button onClick={() => { updateShowcaseStatus?.(model.atelierId, model.id, 'approved'); showToast('Modèle approuvé'); loadData(); }} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-bold">Approuver</button>
                      <button onClick={() => { updateShowcaseStatus?.(model.atelierId, model.id, 'rejected'); showToast('Modèle rejeté'); loadData(); }} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-bold">Rejeter</button>
                    </>
                  )}
                  {model.showcaseStatus === 'approved' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Approuvé</span>}
                  {model.showcaseStatus === 'rejected' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Rejeté</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGE SUBSCRIPTIONS - Gestion complète des abonnements et plans
  const SubscriptionsPage = () => {
    const [editingPlan, setEditingPlan] = React.useState<'plan1' | 'plan2' | 'plan3' | null>(null);
    const [planForm, setPlanForm] = React.useState<Partial<SubscriptionPlan>>({});
    const [activeTab, setActiveTab] = React.useState<'plans' | 'subscriptions'>('plans');
    const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
    const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'expired' | 'trial'>('all');

    React.useEffect(() => {
      setSubscriptions(getAllSubscriptions());
    }, []);

    const handleSavePlan = () => {
      if (editingPlan && planForm) {
        updateSubscriptionPlan(editingPlan, planForm);
        setSettings(getPlatformSettings());
        setEditingPlan(null);
        showToast('Plan mis à jour');
      }
    };

    // Guards pour éviter les erreurs
    const subscriptionPlans = settings?.subscriptionPlans || [];
    
    // Filtrer les abonnements
    const filteredSubscriptions = subscriptions.filter(sub => 
      statusFilter === 'all' || sub.status === statusFilter
    );;

    // Statistiques des abonnements
    const stats = {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      trial: subscriptions.filter(s => s.status === 'trial').length,
      expired: subscriptions.filter(s => s.status === 'expired').length,
      revenue: subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0)
    };

    return (
      <div className="space-y-6">
        {/* Navigation tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          <button 
            onClick={() => setActiveTab('plans')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'plans' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            💳 Plans d'abonnement
          </button>
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'subscriptions' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            👥 Abonnements actifs ({stats.total})
          </button>
        </div>

        {activeTab === 'plans' ? (
          <>
            {/* Configuration des plans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className={`bg-white rounded-2xl p-6 border-2 shadow-sm transition-all hover:shadow-md ${plan.isActive ? 'border-green-500' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {plan.isActive ? 'Actif' : 'Inactif'}
                    </span>
                    <button onClick={() => { setEditingPlan(plan.id); setPlanForm(plan); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">✏️</button>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <p className="text-3xl font-black text-orange-600">{plan.price?.toLocaleString()} CFA<span className="text-sm text-gray-500 font-normal">/{plan.duration}j</span></p>
                  <div className="mt-4 space-y-2">
                    {(plan.features || []).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span>{feature}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {editingPlan && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Modifier le plan</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Nom du plan</label>
                      <input type="text" value={planForm.name || ''} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Prix (CFA)</label>
                        <input type="number" value={planForm.price || 0} onChange={(e) => setPlanForm({ ...planForm, price: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Durée (jours)</label>
                        <input type="number" value={planForm.duration || 30} onChange={(e) => setPlanForm({ ...planForm, duration: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Description</label>
                      <textarea value={planForm.description || ''} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" rows={2} />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <input type="checkbox" checked={planForm.isActive} onChange={(e) => setPlanForm({ ...planForm, isActive: e.target.checked })} className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-bold">Plan actif et visible</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setEditingPlan(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50">Annuler</button>
                    <button onClick={handleSavePlan} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">Sauvegarder</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Statistiques des abonnements */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500">Total abonnements</p>
                <p className="text-2xl font-black text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-sm text-green-600">Actifs</p>
                <p className="text-2xl font-black text-green-700">{stats.active}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-600">Période d'essai</p>
                <p className="text-2xl font-black text-blue-700">{stats.trial}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-sm text-orange-600">Revenus totaux</p>
                <p className="text-2xl font-black text-orange-700">{stats.revenue.toLocaleString()} CFA</p>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex gap-2">
              {(['all', 'active', 'trial', 'expired'] as const).map((status) => (
                <button 
                  key={status} 
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                    statusFilter === status 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tous' : status}
                </button>
              ))}
            </div>

            {/* Liste des abonnements */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Atelier</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Plan</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Début</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Expiration</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Aucun abonnement trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{ateliers.find(a => a.id === sub.atelierId)?.name || 'Inconnu'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                            {subscriptionPlans.find(p => p.id === sub.planType)?.name || sub.planType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            sub.status === 'active' ? 'bg-green-100 text-green-700' :
                            sub.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                            sub.status === 'expired' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm">{new Date(sub.endDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold">{sub.amount?.toLocaleString()} CFA</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  // PAGE USSD - Validation manuelle des paiements
  const USSDPage = () => {
    const [sessions, setSessions] = React.useState<USSDSession[]>([]);
    const [filter, setFilter] = React.useState<'all' | 'pending' | 'validated' | 'rejected'>('all');
    const [validatingSession, setValidatingSession] = React.useState<USSDSession | null>(null);
    const [validationNotes, setValidationNotes] = React.useState('');

    React.useEffect(() => {
      setSessions(getAllUSSDSessions());
    }, []);

    const filteredSessions = sessions.filter(s => filter === 'all' || s.status === filter);

    const handleValidate = (validated: boolean) => {
      if (validatingSession) {
        validatePayment(validatingSession.id, user?.id || 'admin', validated, validationNotes);
        setSessions(getAllUSSDSessions());
        setValidatingSession(null);
        setValidationNotes('');
        showToast(validated ? 'Paiement validé' : 'Paiement rejeté');
        loadData();
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'validated', 'rejected'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {f === 'all' ? 'Tous' : f}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-bold">Date</th>
                <th className="px-4 py-3 text-xs font-bold">Atelier</th>
                <th className="px-4 py-3 text-xs font-bold">Plan</th>
                <th className="px-4 py-3 text-xs font-bold">Montant</th>
                <th className="px-4 py-3 text-xs font-bold">Opérateur</th>
                <th className="px-4 py-3 text-xs font-bold">Statut</th>
                <th className="px-4 py-3 text-xs font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-4 py-3 text-sm">{new Date(session.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-medium">{ateliers.find(a => a.id === session.atelierId)?.name || 'Inconnu'}</td>
                  <td className="px-4 py-3 text-sm">{settings.subscriptionPlans.find(p => p.id === session.planType)?.name || session.planType}</td>
                  <td className="px-4 py-3 text-sm font-bold">{session.amount.toLocaleString()} CFA</td>
                  <td className="px-4 py-3 text-sm">{session.provider}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      session.status === 'validated' ? 'bg-green-100 text-green-700' :
                      session.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    }`}>{session.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {session.status === 'pending' && (
                      <button onClick={() => setValidatingSession(session)} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-bold">Valider</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {validatingSession && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Valider le paiement</h3>
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <p className="text-sm"><strong>Montant:</strong> {validatingSession.amount.toLocaleString()} CFA</p>
                <p className="text-sm"><strong>Plan:</strong> {settings.subscriptionPlans.find(p => p.id === validatingSession.planType)?.name}</p>
                <p className="text-sm"><strong>Opérateur:</strong> {validatingSession.provider}</p>
              </div>
              <textarea value={validationNotes} onChange={(e) => setValidationNotes(e.target.value)} placeholder="Notes (optionnel)" className="w-full px-4 py-2 border rounded-lg mb-4" rows={3} />
              <div className="flex gap-3">
                <button onClick={() => setValidatingSession(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
                <button onClick={() => handleValidate(false)} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Rejeter</button>
                <button onClick={() => handleValidate(true)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold">Valider</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // PAGE USERS - Gestion des utilisateurs
  const UsersPage = () => {
    const [users, setUsers] = React.useState<any[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
      const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(allUsers);
    }, []);

    const filteredUsers = users.filter((u: any) => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl w-64" />
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-bold">{users.filter((u: any) => u.type === 'atelier').length} Ateliers</span>
            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">{users.filter((u: any) => u.type === 'client').length} Clients</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date création</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.type === 'atelier' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {user.type === 'atelier' ? 'Atelier' : 'Client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive !== false ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // PAGE CMS - Éditeur de contenu complet avec gestion d'images
  const CMSPage = () => {
    const [sections, setSections] = React.useState<ContentSection[]>([]);
    const [editingSection, setEditingSection] = React.useState<ContentSection | null>(null);
    const [isCreating, setIsCreating] = React.useState(false);
    const [newSectionType, setNewSectionType] = React.useState<ContentSection['type']>('hero');
    const [previewMode, setPreviewMode] = React.useState(false);
    const [draggingId, setDraggingId] = React.useState<string | null>(null);

    React.useEffect(() => {
      setSections(getContentSections());
    }, []);

    const handleSaveSection = () => {
      if (editingSection) {
        const updatedSections = sections.map(s => s.id === editingSection.id ? editingSection : s);
        saveContentSections(updatedSections);
        setSections(updatedSections);
        setEditingSection(null);
        showToast('Section mise à jour');
      }
    };

    const handleCreateSection = () => {
      const newSection = createContentSection(newSectionType);
      const updatedSections = [...sections, newSection];
      saveContentSections(updatedSections);
      setSections(updatedSections);
      setEditingSection(newSection);
      setIsCreating(false);
      showToast('Section créée');
    };

    const handleDeleteSection = (id: string) => {
      if (confirm('Supprimer cette section ?')) {
        deleteContentSection(id);
        setSections(getContentSections());
        showToast('Section supprimée');
      }
    };

    const handleDuplicateSection = (id: string) => {
      duplicateContentSection(id);
      setSections(getContentSections());
      showToast('Section dupliquée');
    };

    const handleMoveSection = (id: string, direction: 'up' | 'down') => {
      const index = sections.findIndex(s => s.id === id);
      if (index === -1) return;
      
      const newSections = [...sections];
      if (direction === 'up' && index > 0) {
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      
      // Update order property
      newSections.forEach((s, i) => s.order = i + 1);
      saveContentSections(newSections);
      setSections(newSections);
    };

    const getSectionIcon = (type: string) => {
      switch(type) {
        case 'hero': return '🎯';
        case 'features': return '✨';
        case 'about': return '📖';
        case 'services': return '🛠️';
        case 'testimonials': return '💬';
        case 'contact': return '📧';
        default: return '📝';
      }
    };

    const getSectionLabel = (type: string) => {
      switch(type) {
        case 'hero': return 'Héros (Bannière)';
        case 'features': return 'Fonctionnalités';
        case 'about': return 'À propos';
        case 'services': return 'Services';
        case 'testimonials': return 'Témoignages';
        case 'contact': return 'Contact';
        case 'custom': return 'Personnalisé';
        default: return type;
      }
    };

    // Preview component
    const SectionPreview = ({ section }: { section: ContentSection }) => {
      switch(section.type) {
        case 'hero':
          return (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white text-center">
              <h1 className="text-2xl font-bold mb-2">{section.title || 'Titre Héros'}</h1>
              {section.subtitle && <p className="text-lg opacity-90 mb-4">{section.subtitle}</p>}
              {section.imageUrl && (
                <img src={section.imageUrl} alt="Hero" className="w-full h-32 object-cover rounded-lg mb-4" />
              )}
              {section.buttonText && (
                <button className="px-4 py-2 bg-white text-orange-600 rounded-lg font-bold">{section.buttonText}</button>
              )}
            </div>
          );
        case 'features':
          return (
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-bold text-center mb-4">{section.title || 'Nos Fonctionnalités'}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">✨ Feature 1</div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">✨ Feature 2</div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">✨ Feature 3</div>
              </div>
            </div>
          );
        default:
          return (
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-bold mb-2">{section.title || 'Section sans titre'}</h2>
              {section.subtitle && <p className="text-gray-500 mb-2">{section.subtitle}</p>}
              {section.imageUrl && (
                <img src={section.imageUrl} alt="Section" className="w-full h-24 object-cover rounded-lg mb-3" />
              )}
              <p className="text-gray-600 text-sm line-clamp-3">{section.content || 'Aucun contenu'}</p>
            </div>
          );
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setPreviewMode(false)} 
              className={`px-4 py-2 rounded-xl text-sm font-bold ${!previewMode ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              ✏️ Édition
            </button>
            <button 
              onClick={() => setPreviewMode(true)} 
              className={`px-4 py-2 rounded-xl text-sm font-bold ${previewMode ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              👁️ Prévisualisation
            </button>
          </div>
          <button 
            onClick={() => setIsCreating(true)} 
            className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold flex items-center gap-2"
          >
            <span>+</span> Ajouter une section
          </button>
        </div>

        {/* Create Section Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Nouvelle section</h3>
              <p className="text-sm text-gray-500 mb-4">Choisissez le type de section à créer :</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {(['hero', 'features', 'about', 'services', 'testimonials', 'contact', 'custom'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewSectionType(type)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      newSectionType === type 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{getSectionIcon(type)}</span>
                    <span className="text-sm font-bold">{getSectionLabel(type)}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsCreating(false)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
                <button onClick={handleCreateSection} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">Créer</button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Section Modal */}
        {editingSection && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-auto">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>{getSectionIcon(editingSection.type)}</span>
                  Modifier {getSectionLabel(editingSection.type)}
                </h3>
                <button onClick={() => setEditingSection(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
              </div>
              
              <div className="space-y-4">
                {/* Type indicator */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-500">Type: </span>
                  <span className="font-bold">{getSectionLabel(editingSection.type)}</span>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-bold mb-2">Titre</label>
                  <input 
                    type="text" 
                    value={editingSection.title} 
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                  />
                </div>

                {/* Subtitle (for hero and some others) */}
                {(editingSection.type === 'hero' || editingSection.type === 'about' || editingSection.type === 'services') && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Sous-titre</label>
                    <input 
                      type="text" 
                      value={editingSection.subtitle || ''} 
                      onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                    />
                  </div>
                )}

                {/* Content textarea */}
                <div>
                  <label className="block text-sm font-bold mb-2">Contenu</label>
                  <textarea 
                    value={editingSection.content} 
                    onChange={(e) => setEditingSection({ ...editingSection, content: e.target.value })} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                    rows={4}
                  />
                </div>

                {/* Image Upload with preview */}
                <div>
                  <label className="block text-sm font-bold mb-2">Image</label>
                  <div className="space-y-3">
                    {/* Upload zone */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingSection({ ...editingSection, imageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="text-4xl mb-2">📤</div>
                        <p className="text-sm font-bold text-gray-600">Cliquez pour uploader une image</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF - Max 5MB</p>
                      </label>
                    </div>

                    {/* Manual URL input */}
                    <div className="flex gap-2">
                      <span className="text-sm text-gray-500 py-2">Ou URL:</span>
                      <input
                        type="text"
                        value={editingSection.imageUrl || ''}
                        onChange={(e) => setEditingSection({ ...editingSection, imageUrl: e.target.value })}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* Preview */}
                    {editingSection.imageUrl && (
                      <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs text-gray-500">Aperçu :</p>
                          <button
                            onClick={() => setEditingSection({ ...editingSection, imageUrl: '' })}
                            className="text-red-500 text-xs hover:text-red-700 font-bold"
                          >
                            ✕ Supprimer
                          </button>
                        </div>
                        <img
                          src={editingSection.imageUrl}
                          alt="Preview"
                          className="max-h-40 rounded-lg object-cover mx-auto"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Button text and link (for hero and CTA sections) */}
                {(editingSection.type === 'hero' || editingSection.type === 'custom') && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-2">Texte du bouton</label>
                      <input 
                        type="text" 
                        value={editingSection.buttonText || ''} 
                        onChange={(e) => setEditingSection({ ...editingSection, buttonText: e.target.value })} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="Ex: En savoir plus"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Lien du bouton</label>
                      <input 
                        type="text" 
                        value={editingSection.buttonLink || ''} 
                        onChange={(e) => setEditingSection({ ...editingSection, buttonLink: e.target.value })} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        placeholder="Ex: /ateliers ou https://..."
                      />
                    </div>
                  </>
                )}

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Couleur de fond</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={editingSection.backgroundColor || '#ffffff'} 
                        onChange={(e) => setEditingSection({ ...editingSection, backgroundColor: e.target.value })} 
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={editingSection.backgroundColor || ''} 
                        onChange={(e) => setEditingSection({ ...editingSection, backgroundColor: e.target.value })} 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Couleur du texte</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        value={editingSection.textColor || '#000000'} 
                        onChange={(e) => setEditingSection({ ...editingSection, textColor: e.target.value })} 
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={editingSection.textColor || ''} 
                        onChange={(e) => setEditingSection({ ...editingSection, textColor: e.target.value })} 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-bold mb-2">Public cible</label>
                  <select 
                    value={editingSection.targetAudience} 
                    onChange={(e) => setEditingSection({ ...editingSection, targetAudience: e.target.value as any })} 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="all">Tous</option>
                    <option value="public">Public (non connecté)</option>
                    <option value="client">Clients</option>
                    <option value="atelier">Ateliers</option>
                  </select>
                </div>

                {/* --- NOUVELLES OPTIONS AVANCÉES --- */}

                {/* Position de l'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Position de l'image</label>
                    <select 
                      value={editingSection.imagePosition || 'left'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imagePosition: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="left">Gauche</option>
                      <option value="right">Droite</option>
                      <option value="top">En haut</option>
                      <option value="center">Centré</option>
                      <option value="background">Arrière-plan</option>
                      <option value="overlay">Superposition</option>
                    </select>
                  </div>
                )}

                {/* Taille de l'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Taille de l'image</label>
                    <select 
                      value={editingSection.imageSize || 'medium'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imageSize: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="small">Petite</option>
                      <option value="medium">Moyenne</option>
                      <option value="large">Grande</option>
                      <option value="extra-large">Très grande</option>
                      <option value="full">Plein écran</option>
                    </select>
                  </div>
                )}

                {/* Fit de l'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Ajustement de l'image</label>
                    <select 
                      value={editingSection.imageFit || 'cover'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imageFit: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="cover">Cover (remplir)</option>
                      <option value="contain">Contain (contenir)</option>
                      <option value="fill">Fill (étirer)</option>
                      <option value="scale-down">Scale down</option>
                      <option value="none">Aucun</option>
                    </select>
                  </div>
                )}

                {/* Filtres d'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Filtre d'image</label>
                    <select 
                      value={editingSection.imageFilter || 'none'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imageFilter: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="none">Aucun</option>
                      <option value="grayscale">Noir et blanc</option>
                      <option value="sepia">Sépia</option>
                      <option value="blur">Flou</option>
                      <option value="brightness">Luminosité</option>
                      <option value="contrast">Contraste</option>
                      <option value="saturate">Saturation</option>
                    </select>
                  </div>
                )}

                {/* Opacité de l'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Opacité de l'image</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={(editingSection.imageOpacity || 1) * 100} 
                        onChange={(e) => setEditingSection({ ...editingSection, imageOpacity: parseInt(e.target.value) / 100 })} 
                        className="flex-1"
                      />
                      <span className="text-sm font-bold w-12">{Math.round((editingSection.imageOpacity || 1) * 100)}%</span>
                    </div>
                  </div>
                )}

                {/* Bordure de l'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Bordure de l'image</label>
                    <select 
                      value={editingSection.imageBorder || 'none'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imageBorder: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="none">Aucune</option>
                      <option value="thin">Fine</option>
                      <option value="medium">Moyenne</option>
                      <option value="thick">Épaisse</option>
                      <option value="rounded">Arrondie</option>
                    </select>
                  </div>
                )}

                {/* Ombre de l'image */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Ombre de l'image</label>
                    <select 
                      value={editingSection.imageShadow || 'none'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imageShadow: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="none">Aucune</option>
                      <option value="soft">Douce</option>
                      <option value="medium">Moyenne</option>
                      <option value="hard">Dur</option>
                      <option value="glow">Lueur</option>
                    </select>
                  </div>
                )}

                {/* Effet au survol */}
                {editingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-bold mb-2">Effet au survol</label>
                    <select 
                      value={editingSection.imageHoverEffect || 'none'} 
                      onChange={(e) => setEditingSection({ ...editingSection, imageHoverEffect: e.target.value as any })} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="none">Aucun</option>
                      <option value="zoom">Zoom</option>
                      <option value="pan">Panoramique</option>
                      <option value="tilt">Inclinaison</option>
                      <option value="fade">Fondu</option>
                      <option value="slide">Glissement</option>
                    </select>
                  </div>
                )}

                {/* Animation de la section */}
                <div>
                  <label className="block text-sm font-bold mb-2">Animation</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      value={editingSection.animationType || 'fade'} 
                      onChange={(e) => setEditingSection({ ...editingSection, animationType: e.target.value as any })} 
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="none">Aucune</option>
                      <option value="fade">Fondu</option>
                      <option value="slide">Glissement</option>
                      <option value="zoom">Zoom</option>
                      <option value="bounce">Rebond</option>
                      <option value="flip">Retournement</option>
                      <option value="rotate">Rotation</option>
                      <option value="elastic">Élastique</option>
                    </select>
                    <select 
                      value={editingSection.animationSpeed || 'medium'} 
                      onChange={(e) => setEditingSection({ ...editingSection, animationSpeed: e.target.value as any })} 
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="slow">Lente</option>
                      <option value="medium">Moyenne</option>
                      <option value="fast">Rapide</option>
                    </select>
                  </div>
                </div>

                {/* Typographie avancée */}
                <div>
                  <label className="block text-sm font-bold mb-2">Typographie du titre</label>
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      value={editingSection.titleFont || 'default'} 
                      onChange={(e) => setEditingSection({ ...editingSection, titleFont: e.target.value as any })} 
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="default">Par défaut</option>
                      <option value="serif">Serif</option>
                      <option value="sans-serif">Sans-serif</option>
                      <option value="display">Display</option>
                      <option value="handwritten">Manuscrite</option>
                      <option value="monospace">Monospace</option>
                    </select>
                    <select 
                      value={editingSection.titleSize || 'large'} 
                      onChange={(e) => setEditingSection({ ...editingSection, titleSize: e.target.value as any })} 
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="small">Petite</option>
                      <option value="medium">Moyenne</option>
                      <option value="large">Grande</option>
                      <option value="extra-large">Très grande</option>
                      <option value="huge">Énorme</option>
                      <option value="massive">Massive</option>
                    </select>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={editingSection.isActive} 
                    onChange={(e) => setEditingSection({ ...editingSection, isActive: e.target.checked })} 
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="font-bold cursor-pointer">Section active (visible sur le site)</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingSection(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold">Annuler</button>
                <button onClick={handleSaveSection} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold">Sauvegarder</button>
              </div>
            </div>
          </div>
        )}

        {/* Sections List */}
        {previewMode ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Prévisualisation du rendu sur le site public :</p>
            {sections.filter(s => s.isActive).sort((a, b) => a.order - b.order).map((section) => (
              <SectionPreview key={section.id} section={section} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sections.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <p className="text-gray-500 mb-4">Aucune section créée</p>
                <button 
                  onClick={() => setIsCreating(true)} 
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold"
                >
                  + Créer votre première section
                </button>
              </div>
            )}
            {sections.sort((a, b) => a.order - b.order).map((section, index) => (
              <div 
                key={section.id} 
                className={`bg-white rounded-2xl p-6 border-2 transition-all ${section.isActive ? 'border-green-500' : 'border-gray-200 opacity-60'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{getSectionIcon(section.type)}</span>
                    <div>
                      <h4 className="font-bold text-lg">{section.title || 'Sans titre'}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {section.isActive ? 'Visible' : 'Masquée'}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                          {getSectionLabel(section.type)}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700">
                          Position {section.order}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleMoveSection(section.id, 'up')} 
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                      title="Monter"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveSection(section.id, 'down')} 
                      disabled={index === sections.length - 1}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30"
                      title="Descendre"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => setEditingSection(section)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDuplicateSection(section.id)} 
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Dupliquer"
                    >
                      📋
                    </button>
                    <button 
                      onClick={() => handleDeleteSection(section.id)} 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {section.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={section.imageUrl} 
                      alt="Section" 
                      className="h-24 w-full object-cover rounded-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                
                <p className="text-gray-600 text-sm line-clamp-2">{section.content || 'Aucun contenu'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // PAGE LOGS - Système de logs
  const LogsPage = () => {
    const [logs, setLogs] = React.useState<any[]>([]);
    const [filter, setFilter] = React.useState<'all' | 'info' | 'warning' | 'error'>('all');

    React.useEffect(() => {
      const allLogs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
      setLogs(allLogs);
    }, []);

    const filteredLogs = logs.filter(log => filter === 'all' || log.severity === filter);

    const clearLogs = () => {
      if (confirm('Effacer tous les logs ?')) {
        localStorage.removeItem('systemLogs');
        setLogs([]);
        showToast('Logs effacés');
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {(['all', 'info', 'warning', 'error'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${filter === f ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {f === 'all' ? 'Tous' : f}
              </button>
            ))}
          </div>
          <button onClick={clearLogs} className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-sm">Effacer</button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden max-h-96 overflow-auto">
          {filteredLogs.slice(0, 100).map((log) => (
            <div key={log.id} className="p-4 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    log.severity === 'error' ? 'bg-red-100 text-red-700' :
                    log.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{log.severity}</span>
                  <div>
                    <p className="font-bold text-sm">{log.action}</p>
                    <p className="text-xs text-gray-500">{JSON.stringify(log.details)}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // PAGE SETTINGS - Configuration complète de la plateforme
  const SettingsPage = () => {
    const [editingProvider, setEditingProvider] = React.useState<USSDProvider | null>(null);
    const [activeTab, setActiveTab] = React.useState<'payment' | 'general' | 'danger'>('payment');
    const [generalSettings, setGeneralSettings] = React.useState({
      trialPeriodDays: settings?.trialPeriodDays ?? 60,
      gracePeriodDays: settings?.gracePeriodDays ?? 7,
      maintenanceMode: settings?.maintenanceMode ?? false,
      commissionRate: settings?.commissionRate ?? 10,
    });

    const handleSaveProvider = () => {
      if (editingProvider) {
        updateUSSDProvider(editingProvider.id, editingProvider);
        setSettings(getPlatformSettings());
        setEditingProvider(null);
        showToast('Configuration USSD mise à jour');
      }
    };

    const handleSaveGeneral = () => {
      const updated = getPlatformSettings();
      updated.trialPeriodDays = generalSettings.trialPeriodDays;
      updated.gracePeriodDays = generalSettings.gracePeriodDays;
      updated.maintenanceMode = generalSettings.maintenanceMode;
      updated.commissionRate = generalSettings.commissionRate;
      savePlatformSettings(updated);
      setSettings(updated);
      showToast('Paramètres généraux mis à jour');
    };

    // Guards pour éviter les erreurs
    const ussdProviders = settings?.ussdProviders || [];

    return (
      <div className="space-y-6">
        {/* Navigation tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-4">
          <button 
            onClick={() => setActiveTab('payment')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'payment' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            📱 Paiements Mobile Money
          </button>
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            ⚙️ Paramètres généraux
          </button>
          <button 
            onClick={() => setActiveTab('danger')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'danger' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            🚨 Zone de danger
          </button>
        </div>

        {activeTab === 'payment' && (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>Configuration des opérateurs Mobile Money</strong><br />
                Configurez les codes USSD et numéros de paiement pour chaque opérateur. 
                Les variables disponibles sont : {'{MONTANT}'}, {'{NUMERO}'}, {'{REFERENCE}'}
              </p>
            </div>

            {/* Opérateurs USSD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ussdProviders.map((provider) => (
                <div key={provider.id} className={`bg-white rounded-2xl p-6 border-2 shadow-sm transition-all hover:shadow-md ${provider.isActive ? 'border-green-500' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${provider.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {provider.id === 'orange' ? '🟠' : provider.id === 'mtn' ? '🟡' : provider.id === 'moov' ? '🔵' : '🟢'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{provider.name}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${provider.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {provider.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setEditingProvider(provider)} 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Configurer"
                    >
                      ✏️
                    </button>
                  </div>
                  
                  <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Code USSD:</span>
                      <span className="font-mono font-bold text-gray-900">{provider.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Numéro de paiement:</span>
                      <span className="font-mono font-bold text-gray-900">{provider.paymentNumber}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-400">Template:</span>
                      <p className="font-mono text-xs text-gray-600 mt-1 bg-white p-2 rounded border">{provider.ussdTemplate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-2xl">
            <h3 className="text-lg font-bold mb-6">Paramètres de la plateforme</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Période d'essai (jours)</label>
                  <input 
                    type="number" 
                    value={generalSettings.trialPeriodDays} 
                    onChange={(e) => setGeneralSettings({...generalSettings, trialPeriodDays: parseInt(e.target.value) || 0})} 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Durée de la période d'essai gratuite</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Période de grâce (jours)</label>
                  <input 
                    type="number" 
                    value={generalSettings.gracePeriodDays} 
                    onChange={(e) => setGeneralSettings({...generalSettings, gracePeriodDays: parseInt(e.target.value) || 0})} 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Délai après expiration avant blocage</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Taux de commission (%)</label>
                <input 
                  type="number" 
                  value={generalSettings.commissionRate} 
                  onChange={(e) => setGeneralSettings({...generalSettings, commissionRate: parseInt(e.target.value) || 0})} 
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={generalSettings.maintenanceMode} 
                  onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})} 
                  className="w-5 h-5 text-orange-500"
                />
                <div>
                  <span className="font-bold block">Mode maintenance</span>
                  <span className="text-xs text-gray-500">Bloquer l'accès aux utilisateurs pendant la maintenance</span>
                </div>
              </div>

              <button 
                onClick={handleSaveGeneral}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
              >
                Sauvegarder les paramètres
              </button>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <h3 className="text-lg font-bold text-red-600 mb-4">Zone de danger</h3>
            <p className="text-sm text-red-600 mb-6">
              Ces actions sont irréversibles. Utilisez-les avec précaution.
            </p>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-red-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900">Effacer toutes les données</p>
                    <p className="text-sm text-gray-500">Supprime définitivement tous les ateliers, commandes, et utilisateurs</p>
                  </div>
                  <button 
                    onClick={() => { 
                      if (confirm('⚠️ ATTENTION : Toutes les données seront supprimées définitivement !\n\nÊtes-vous sûr de vouloir continuer ?')) { 
                        localStorage.clear(); 
                        showToast('Toutes les données ont été effacées'); 
                      } 
                    }} 
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                  >
                    Effacer tout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'édition opérateur */}
        {editingProvider && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                  {editingProvider.id === 'orange' ? '🟠' : editingProvider.id === 'mtn' ? '🟡' : editingProvider.id === 'moov' ? '🔵' : '🟢'}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Configurer {editingProvider.name}</h3>
                  <p className="text-sm text-gray-500">Modifiez les paramètres de paiement</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Code USSD</label>
                  <input 
                    type="text" 
                    value={editingProvider.code} 
                    onChange={(e) => setEditingProvider({ ...editingProvider, code: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: *144*"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Numéro de paiement</label>
                  <input 
                    type="text" 
                    value={editingProvider.paymentNumber} 
                    onChange={(e) => setEditingProvider({ ...editingProvider, paymentNumber: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                    placeholder="Ex: 0700000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Template USSD</label>
                  <input 
                    type="text" 
                    value={editingProvider.ussdTemplate} 
                    onChange={(e) => setEditingProvider({ ...editingProvider, ussdTemplate: e.target.value })} 
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                    placeholder="*144*1*{MONTANT}*{NUMERO}#{REFERENCE}"
                  />
                  <p className="text-xs text-gray-500 mt-1">Variables: {'{MONTANT}'}, {'{NUMERO}'}, {'{REFERENCE}'}</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <input 
                    type="checkbox" 
                    checked={editingProvider.isActive} 
                    onChange={(e) => setEditingProvider({ ...editingProvider, isActive: e.target.checked })} 
                    className="w-5 h-5 text-orange-500"
                  />
                  <span className="font-bold">Opérateur actif et disponible</span>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEditingProvider(null)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50">Annuler</button>
                <button onClick={handleSaveProvider} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600">Sauvegarder</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar moderne et professionnelle */}
      <div className="w-64 bg-gray-900 text-white h-screen flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">👔</span>
            </div>
            <div>
              <h1 className="text-lg font-black leading-tight">MMV Couture</h1>
              <p className="text-xs text-gray-400 font-medium">Super Admin</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Section Dashboard */}
          <div className="mb-2">
            <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Dashboard</p>
            {[
              { icon: '📊', label: "Vue d'ensemble", page: 'overview' as PageType },
              { icon: '📈', label: 'Analytics', page: 'analytics' as PageType },
            ].map((item) => (
              <button key={item.page} onClick={() => setCurrentPage(item.page)} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === item.page ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>

          {/* Section Gestion */}
          <div className="mb-2">
            <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Gestion</p>
            {[
              { icon: '🏭', label: 'Ateliers', page: 'ateliers' as PageType },
              { icon: '👗', label: 'Showroom', page: 'showroom' as PageType },
              { icon: '�', label: 'Utilisateurs', page: 'users' as PageType },
            ].map((item) => (
              <button key={item.page} onClick={() => setCurrentPage(item.page)} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === item.page ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>

          {/* Section Finance */}
          <div className="mb-2">
            <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Finance</p>
            {[
              { icon: '��', label: 'Abonnements', page: 'subscriptions' as PageType },
              { icon: '📱', label: 'Paiements USSD', page: 'ussd' as PageType },
            ].map((item) => (
              <button key={item.page} onClick={() => setCurrentPage(item.page)} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === item.page ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>

          {/* Section Système */}
          <div className="mb-2">
            <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Système</p>
            {[
              { icon: '📝', label: 'CMS', page: 'cms' as PageType },
              { icon: '�', label: 'Tutoriels', page: 'tutoriels' as PageType },
              { icon: '�📋', label: 'Logs', page: 'logs' as PageType },
              { icon: '⚙️', label: 'Paramètres', page: 'settings' as PageType },
            ].map((item) => (
              <button key={item.page} onClick={() => setCurrentPage(item.page)} 
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === item.page ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                <span className="text-lg">{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-900/20 transition-colors">
            <span className="text-lg">🚪</span>Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header avec breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Super Admin</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">
                {currentPage === 'overview' && "Vue d'ensemble"}
                {currentPage === 'analytics' && 'Analytics'}
                {currentPage === 'ateliers' && 'Gestion des Ateliers'}
                {currentPage === 'showroom' && 'Showroom'}
                {currentPage === 'subscriptions' && 'Configuration Abonnements'}
                {currentPage === 'ussd' && 'Paiements USSD en Attente'}
                {currentPage === 'users' && 'Gestion des Utilisateurs'}
                {currentPage === 'cms' && 'CMS - Éditeur de Contenu'}
                {currentPage === 'logs' && 'Logs Système'}
                {currentPage === 'settings' && 'Paramètres Plateforme'}
                {currentPage === 'tutoriels' && 'Gestion des Tutoriels'}
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900">
              {currentPage === 'overview' && "Vue d'ensemble"}
              {currentPage === 'analytics' && 'Analytics'}
              {currentPage === 'ateliers' && 'Gestion des Ateliers'}
              {currentPage === 'showroom' && 'Showroom'}
              {currentPage === 'subscriptions' && 'Configuration Abonnements'}
              {currentPage === 'ussd' && 'Paiements USSD en Attente'}
              {currentPage === 'users' && 'Gestion des Utilisateurs'}
              {currentPage === 'cms' && 'CMS - Éditeur de Contenu'}
              {currentPage === 'logs' && 'Logs Système'}
              {currentPage === 'settings' && 'Paramètres Plateforme'}
              {currentPage === 'tutoriels' && 'Gestion des Tutoriels'}
            </h2>
          </div>
          
          {currentPage === 'overview' && <OverviewPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'ateliers' && <AteliersPage />}
          {currentPage === 'showroom' && <ShowroomPage />}
          {currentPage === 'subscriptions' && <SubscriptionsPage />}
          {currentPage === 'ussd' && <USSDPage />}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'cms' && <CMSPage />}
          {currentPage === 'logs' && <LogsPage />}
          {currentPage === 'settings' && <SettingsPage />}
          {currentPage === 'tutoriels' && <AdminTutorialsManager />}
        </div>
      </div>

      {/* Toast moderne */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
            <span className="font-semibold">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardNew;

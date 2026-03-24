// ============================================
// SYSTÈME D'ABONNEMENT ET PAIEMENT USSD
// SaaS Africain - MMV Couture
// ============================================

// ============================================
// TYPES ET INTERFACES
// ============================================

export interface USSDSession {
  id: string;
  userId: string;
  atelierId: string;
  userPhone: string;
  planType: 'plan1' | 'plan2' | 'plan3' | 'trial';
  amount: number;
  ussdCode: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'validated' | 'rejected';
  createdAt: string;
  completedAt?: string;
  validatedAt?: string;
  validatedBy?: string;
  provider: 'orange' | 'mtn' | 'moov' | 'celtis';
  transactionId?: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  atelierId: string;
  userType: 'atelier' | 'client';
  planType: 'plan1' | 'plan2' | 'plan3' | 'trial';
  status: 'active' | 'expired' | 'cancelled' | 'suspended' | 'trial';
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: 'ussd' | 'card' | 'bank' | 'trial';
  autoRenew: boolean;
  history: PaymentHistory[];
  isTrial: boolean;
}

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'validated' | 'rejected';
  method: string;
  transactionId: string;
  validatedBy?: string;
  notes?: string;
}

export interface SubscriptionPlan {
  id: 'plan1' | 'plan2' | 'plan3';
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
  features: string[];
  description: string;
}

export interface USSDProvider {
  id: 'orange' | 'mtn' | 'moov' | 'celtis';
  name: string;
  code: string;
  paymentNumber: string;
  ussdTemplate: string;
  isActive: boolean;
  country: string;
}

export interface PlatformSettings {
  subscriptionPlans: SubscriptionPlan[];
  ussdProviders: USSDProvider[];
  trialPeriodDays: number;
  gracePeriodDays: number;
  maintenanceMode: boolean;
  commissionRate: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  action: string;
  userId?: string;
  details: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  ip?: string;
  userAgent?: string;
}

// ============================================
// CONFIGURATION PAR DÉFAUT
// ============================================

export const DEFAULT_SETTINGS: PlatformSettings = {
  subscriptionPlans: [
    {
      id: 'plan1',
      name: 'Essentiel',
      price: 5000,
      duration: 30,
      isActive: true,
      features: ['10 modèles', '5 commandes/mois', 'Support email'],
      description: 'Parfait pour démarrer',
    },
    {
      id: 'plan2',
      name: 'Professionnel',
      price: 15000,
      duration: 30,
      isActive: true,
      features: ['Modèles illimités', 'Commandes illimitées', 'Support prioritaire', 'Statistiques avancées'],
      description: 'Pour les ateliers actifs',
    },
    {
      id: 'plan3',
      name: 'Entreprise',
      price: 45000,
      duration: 90,
      isActive: true,
      features: ['Tout du Pro', 'API access', 'Multi-utilisateurs', 'Formation incluse'],
      description: 'Solution complète',
    },
  ],
  ussdProviders: [
    {
      id: 'orange',
      name: 'Orange Money',
      code: '*144*',
      paymentNumber: '0700000000',
      ussdTemplate: '*144*1*{MONTANT}*{NUMERO}#{REFERENCE}',
      isActive: true,
      country: 'CI',
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      code: '*156*',
      paymentNumber: '0500000000',
      ussdTemplate: '*156*1*{MONTANT}*{NUMERO}*{REFERENCE}#',
      isActive: true,
      country: 'CI',
    },
    {
      id: 'moov',
      name: 'Moov Money',
      code: '*155*',
      paymentNumber: '0100000000',
      ussdTemplate: '*155*1*{MONTANT}*{NUMERO}*{REFERENCE}#',
      isActive: true,
      country: 'CI',
    },
    {
      id: 'celtis',
      name: 'Celtis Cash',
      code: '*123*',
      paymentNumber: '0600000000',
      ussdTemplate: '*123*{MONTANT}*{NUMERO}*{REFERENCE}#',
      isActive: false,
      country: 'CI',
    },
  ],
  trialPeriodDays: 60,
  gracePeriodDays: 7,
  maintenanceMode: false,
  commissionRate: 10,
};

// ============================================
// GESTION DES PARAMÈTRES PLATEFORME
// ============================================

export function getPlatformSettings(): PlatformSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem('platformSettings');
    if (!stored) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(stored);
    // Vérifier que la structure est correcte
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SETTINGS;
    // Fusionner avec les valeurs par défaut pour garantir toutes les propriétés
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      subscriptionPlans: parsed.subscriptionPlans || DEFAULT_SETTINGS.subscriptionPlans,
      ussdProviders: parsed.ussdProviders || DEFAULT_SETTINGS.ussdProviders,
    };
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error);
    return DEFAULT_SETTINGS;
  }
}

export function savePlatformSettings(settings: PlatformSettings): void {
  localStorage.setItem('platformSettings', JSON.stringify(settings));
  logAction('SETTINGS_UPDATED', { settings }, 'info', 'system');
}

export function updateSubscriptionPlan(planId: 'plan1' | 'plan2' | 'plan3', updates: Partial<SubscriptionPlan>): void {
  const settings = getPlatformSettings();
  const planIndex = settings.subscriptionPlans.findIndex(p => p.id === planId);
  if (planIndex !== -1) {
    settings.subscriptionPlans[planIndex] = { ...settings.subscriptionPlans[planIndex], ...updates };
    savePlatformSettings(settings);
  }
}

export function updateUSSDProvider(providerId: 'orange' | 'mtn' | 'moov' | 'celtis', updates: Partial<USSDProvider>): void {
  const settings = getPlatformSettings();
  const providerIndex = settings.ussdProviders.findIndex(p => p.id === providerId);
  if (providerIndex !== -1) {
    settings.ussdProviders[providerIndex] = { ...settings.ussdProviders[providerIndex], ...updates };
    savePlatformSettings(settings);
  }
}

// ============================================
// GESTION DES ABONNEMENTS
// ============================================

export function createTrialSubscription(atelierId: string, userId: string): Subscription {
  const settings = getPlatformSettings();
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + settings.trialPeriodDays);

  const subscription: Subscription = {
    id: `sub-trial-${Date.now()}`,
    userId,
    atelierId,
    userType: 'atelier',
    planType: 'trial',
    status: 'trial',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    amount: 0,
    paymentMethod: 'trial',
    autoRenew: false,
    history: [{
      id: `pay-${Date.now()}`,
      date: startDate.toISOString(),
      amount: 0,
      status: 'success',
      method: 'trial',
      transactionId: `TRIAL-${Date.now()}`,
      notes: `Période d'essai de ${settings.trialPeriodDays} jours`,
    }],
    isTrial: true,
  };

  saveSubscription(subscription);
  updateUserSubscription(userId, atelierId, subscription);
  logAction('TRIAL_SUBSCRIPTION_CREATED', { subscriptionId: subscription.id, atelierId, userId });
  return subscription;
}

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status === 'active' || subscription.status === 'trial') {
    const endDate = new Date(subscription.endDate);
    return endDate > new Date();
  }
  return false;
}

export function isAtelierBlocked(atelierId: string): { blocked: boolean; reason?: string; daysRemaining?: number } {
  const subscription = getAtelierSubscription(atelierId);
  if (!subscription) {
    return { blocked: true, reason: 'Aucun abonnement actif' };
  }

  const now = new Date();
  const endDate = new Date(subscription.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysRemaining > 0) {
    return { blocked: false, daysRemaining };
  }

  const settings = getPlatformSettings();
  if (Math.abs(daysRemaining) <= settings.gracePeriodDays) {
    return { blocked: false, reason: 'Période de grâce', daysRemaining };
  }

  return { blocked: true, reason: 'Abonnement expiré', daysRemaining };
}

export function saveSubscription(subscription: Subscription): void {
  const subscriptions = getAllSubscriptions();
  const existingIndex = subscriptions.findIndex(s => s.id === subscription.id);
  if (existingIndex !== -1) {
    subscriptions[existingIndex] = subscription;
  } else {
    subscriptions.push(subscription);
  }
  localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
}

export function getAllSubscriptions(): Subscription[] {
  return JSON.parse(localStorage.getItem('subscriptions') || '[]');
}

export function getAtelierSubscription(atelierId: string): Subscription | null {
  const subscriptions = getAllSubscriptions();
  return subscriptions.find(s => s.atelierId === atelierId && (s.status === 'active' || s.status === 'trial')) || null;
}

export function updateUserSubscription(userId: string, atelierId: string, subscription: Subscription): void {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: any) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].subscription = {
      id: subscription.id,
      status: subscription.status,
      planType: subscription.planType,
      expiresAt: subscription.endDate,
      isTrial: subscription.isTrial,
    };
    localStorage.setItem('users', JSON.stringify(users));
  }

  const ateliers = JSON.parse(localStorage.getItem('ateliers') || '[]');
  const atelierIndex = ateliers.findIndex((a: any) => a.id === atelierId);
  if (atelierIndex !== -1) {
    ateliers[atelierIndex].subscription = {
      id: subscription.id,
      status: subscription.status,
      planType: subscription.planType,
      expiresAt: subscription.endDate,
      isTrial: subscription.isTrial,
    };
    localStorage.setItem('ateliers', JSON.stringify(ateliers));
  }
}

// ============================================
// SYSTÈME USSD
// ============================================

export function generateUSSDCode(
  providerId: 'orange' | 'mtn' | 'moov' | 'celtis',
  amount: number,
  reference: string
): string {
  const settings = getPlatformSettings();
  const provider = settings.ussdProviders.find(p => p.id === providerId);
  if (!provider || !provider.isActive) {
    throw new Error(`Opérateur ${providerId} non disponible`);
  }

  let code = provider.ussdTemplate;
  code = code.replace('{MONTANT}', amount.toString());
  code = code.replace('{NUMERO}', provider.paymentNumber);
  code = code.replace('{REFERENCE}', reference.slice(-6));
  return code;
}

export function createUSSDSession(
  userId: string,
  atelierId: string,
  phoneNumber: string,
  planType: 'plan1' | 'plan2' | 'plan3',
  provider: 'orange' | 'mtn' | 'moov' | 'celtis'
): USSDSession {
  const settings = getPlatformSettings();
  const plan = settings.subscriptionPlans.find(p => p.id === planType);
  if (!plan || !plan.isActive) {
    throw new Error('Plan non disponible');
  }

  const reference = `SUB-${Date.now()}-${atelierId.slice(-4)}`;
  const ussdCode = generateUSSDCode(provider, plan.price, reference);

  const session: USSDSession = {
    id: `ussd-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    atelierId,
    userPhone: phoneNumber,
    planType,
    amount: plan.price,
    ussdCode,
    status: 'pending',
    createdAt: new Date().toISOString(),
    provider,
  };

  const sessions = getAllUSSDSessions();
  sessions.unshift(session);
  localStorage.setItem('ussdSessions', JSON.stringify(sessions));

  logAction('USSD_SESSION_CREATED', { sessionId: session.id, userId, atelierId, amount: plan.price });
  return session;
}

export function getAllUSSDSessions(): USSDSession[] {
  return JSON.parse(localStorage.getItem('ussdSessions') || '[]');
}

export function dialUSSD(ussdCode: string): void {
  window.location.href = `tel:${encodeURIComponent(ussdCode)}`;
}

export function validatePayment(
  sessionId: string,
  adminId: string,
  validated: boolean,
  notes?: string
): USSDSession | null {
  const sessions = getAllUSSDSessions();
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);

  if (sessionIndex === -1) return null;

  const session = sessions[sessionIndex];
  session.status = validated ? 'validated' : 'rejected';
  session.validatedAt = new Date().toISOString();
  session.validatedBy = adminId;
  session.notes = notes;

  localStorage.setItem('ussdSessions', JSON.stringify(sessions));

  if (validated) {
    const settings = getPlatformSettings();
    const plan = settings.subscriptionPlans.find(p => p.id === session.planType);
    if (plan) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      const subscription: Subscription = {
        id: `sub-${Date.now()}`,
        userId: session.userId,
        atelierId: session.atelierId,
        userType: 'atelier',
        planType: session.planType,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: session.amount,
        paymentMethod: 'ussd',
        autoRenew: false,
        history: [{
          id: `pay-${Date.now()}`,
          date: startDate.toISOString(),
          amount: session.amount,
          status: 'validated',
          method: `ussd-${session.provider}`,
          transactionId: session.id,
          validatedBy: adminId,
          notes: notes || 'Paiement validé par admin',
        }],
        isTrial: false,
      };

      saveSubscription(subscription);
      updateUserSubscription(session.userId, session.atelierId, subscription);
    }
  }

  logAction(validated ? 'PAYMENT_VALIDATED' : 'PAYMENT_REJECTED', {
    sessionId,
    validatedBy: adminId,
    amount: session.amount,
    notes,
  });

  return session;
}

// ============================================
// SYSTÈME DE LOGS
// ============================================

export function logAction(
  action: string,
  details: Record<string, any> = {},
  severity: LogEntry['severity'] = 'info',
  userId?: string
): void {
  const log: LogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
    severity,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
  };

  const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
  logs.unshift(log);

  if (logs.length > 1000) logs.pop();

  localStorage.setItem('systemLogs', JSON.stringify(logs));

  console.log(`[${severity.toUpperCase()}] ${action}`, details);
}

// ============================================
// ANALYTICS
// ============================================

export function getAnalytics() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const subscriptions = getAllSubscriptions();
  const sessions = getAllUSSDSessions();
  const logs = JSON.parse(localStorage.getItem('systemLogs') || '[]');
  const settings = getPlatformSettings();

  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalRevenue = subscriptions
    .filter(s => s.status === 'active' && !s.isTrial)
    .reduce((sum, sub) => sum + sub.amount, 0);

  const monthlyRevenue = subscriptions
    .filter(s => new Date(s.startDate) > last30Days && !s.isTrial)
    .reduce((sum, sub) => sum + sub.amount, 0);

  const ussdStats = {
    total: sessions.length,
    pending: sessions.filter(s => s.status === 'pending').length,
    validated: sessions.filter(s => s.status === 'validated').length,
    rejected: sessions.filter(s => s.status === 'rejected').length,
    byProvider: sessions.reduce((acc: Record<string, number>, s) => {
      acc[s.provider] = (acc[s.provider] || 0) + 1;
      return acc;
    }, {}),
    pendingAmount: sessions
      .filter(s => s.status === 'pending')
      .reduce((sum, s) => sum + s.amount, 0),
  };

  return {
    users: {
      total: users.length,
      ateliers: users.filter((u: any) => u.type === 'atelier').length,
      clients: users.filter((u: any) => u.type === 'client').length,
      newThisMonth: users.filter((u: any) => new Date(u.createdAt) > last30Days).length,
    },
    subscriptions: {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      trial: subscriptions.filter(s => s.status === 'trial').length,
      expired: subscriptions.filter(s => s.status === 'expired').length,
      byPlan: {
        plan1: subscriptions.filter(s => s.planType === 'plan1').length,
        plan2: subscriptions.filter(s => s.planType === 'plan2').length,
        plan3: subscriptions.filter(s => s.planType === 'plan3').length,
      },
    },
    revenue: {
      total: totalRevenue,
      monthly: monthlyRevenue,
      projected: monthlyRevenue * 12,
    },
    ussd: ussdStats,
    settings,
    recentLogs: logs.slice(0, 50),
  };
}

// ============================================
// EXPORT / IMPORT
// ============================================

export function exportData(): string {
  const data = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    subscriptions: getAllSubscriptions(),
    ussdSessions: getAllUSSDSessions(),
    logs: JSON.parse(localStorage.getItem('systemLogs') || '[]'),
    settings: getPlatformSettings(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

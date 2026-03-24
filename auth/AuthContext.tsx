
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { User, Atelier, AtelierData, SubscriptionStatus, ManagerProfile, Modele, Order, Appointment, Workstation, Fourniture, AtelierWithManager, SubscriptionPlan, Review, ShowcaseStatus, SiteContent, Expense, AtelierType, Specialization, PageBlock, SubscriptionData, PaymentTransaction, PaymentSettings, MobileMoneyType } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    atelier: Atelier | null;
    isSubscriptionActive: boolean;
    isImpersonating: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    register: (atelierName: string, email: string, pass: string, withDemoData: boolean, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number, initialPlan?: SubscriptionPlan) => Promise<boolean>;
    changePassword: (userId: string, oldPass: string, newPass: string) => Promise<{ success: boolean, message: string }>;
    impersonate: (managerId: string) => void;
    stopImpersonating: () => void;
    getAllAteliersWithManager: () => AtelierWithManager[];
    updateSubscription: (atelierId: string, status: SubscriptionStatus, durationInMonths?: number) => void;
    upgradeClientSubscription: (plan: SubscriptionPlan, durationMonths: number) => void;
    updateAtelierData: (atelierId: string, newData: AtelierData) => void;
    resetAtelierData: (atelierId: string) => void;
    updateManagerProfile: (profile: ManagerProfile) => void;
    getShowcaseModels: () => Modele[];
    getPendingShowcaseModels: () => Modele[];
    updateShowcaseStatus: (modelId: string, status: ShowcaseStatus) => void;
    addModerationLog: (modelId: string, action: 'approved' | 'rejected' | 'requested', note?: string) => void;
    getModerationLogs: () => any[];
    getAllUsers: () => User[];
    updateUserRole: (userId: string, role: User['role']) => void;
    deleteUser: (userId: string) => void;
    registerClientAndOrderFromShowroom: (model: Modele, clientInfo: { name: string, phone: string, email?: string }) => Promise<boolean>;
    getReviews: () => Review[];
    addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
    deleteReview: (reviewId: string) => void;
    getSiteContent: () => SiteContent;
    updateSiteContent: (newContent: SiteContent) => void;
    getPlatformStats: () => any;
    sendSystemNotification: (message: string) => void;
    
    // 🎫 NEW: Subscription & Payment Management
    initializeSubscriptionForNewAtelier: (atelierId: string) => void;
    getPaymentSettings: () => PaymentSettings | null;
    addPaymentTransaction: (transaction: PaymentTransaction) => void;
    confirmPayment: (transactionId: string, adminId: string) => void;
    rejectPayment: (transactionId: string, adminId: string, reason: string) => void;
    renewSubscription: (atelierId: string, plan: SubscriptionPlan) => void;
    updatePaymentSettings: (settings: PaymentSettings) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    USER: 'mmv_user',
    ATELIER: 'mmv_atelier',
    ALL_USERS: 'mmv_all_users',
    ALL_ATELIERS: 'mmv_all_ateliers',
    REVIEWS: 'mmv_reviews',
    SITE_CONTENT: 'mmv_site_content',
    MODERATION_LOGS: 'mmv_moderation_logs',
    PAYMENT_SETTINGS: 'mmv_payment_settings'
};

const DEFAULT_SITE_CONTENT: SiteContent = {
    blocks: [
        { id: 'b1', type: 'hero', title: 'Digitalisez votre Savoir-Faire', subtitle: 'La plateforme tout-en-un pour les tailleurs et stylistes.', imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a4bb4?q=80&w=2070', align: 'center', buttonText: 'Démarrer l\'essai gratuit', buttonLink: 'register' },
        { id: 'b_search', type: 'workshop-search' },
        { id: 'b2', type: 'stats', backgroundColor: 'orange', stats: [{ id: 's1', value: '500+', label: 'Ateliers' }, { id: 's2', value: '10k+', label: 'Modèles' }, { id: 's3', value: '24/7', label: 'Support' }] }
    ]
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  id: 'default',
  mobileMoneyProviders: [
    {
      id: 'mtn_ci',
      type: 'mtn',
      name: 'MTN Mobile Money',
      accountNumber: '+229 01 52 03 07 44',
      accountHolderName: 'MMV COUTURE SARL',
      transferCode: '*880*1*1#',
      enabled: false,
      currency: 'CFA',
      minAmount: 500,
      maxAmount: 10000000,
    },
    {
      id: 'orange_ci',
      type: 'orange',
      name: 'Orange Money',
      accountNumber: '+225 XX XX XX XX XX',
      accountHolderName: 'MMV COUTURE SARL',
      transferCode: '*144*AMOUNT#',
      enabled: false,
      currency: 'CFA',
      minAmount: 500,
      maxAmount: 10000000,
    },
    {
      id: 'moov_ci',
      type: 'moov',
      name: 'Moov Money',
      accountNumber: '+229 01 60 23 46 71',
      accountHolderName: 'MMV COUTURE SARL',
      transferCode: '*855#',
      enabled: false,
      currency: 'CFA',
      minAmount: 500,
      maxAmount: 10000000,
    },
  ],
  pricing: {
    monthly: 5000,
    quarterly: 15000,
    yearly: 45000,
    currency: 'CFA',
    discountPercentage: {
      quarterly: 0,
      yearly: 25,
    },
  },
  trialPeriodDays: 60,
  reminderDaysBefore: 7,
  autoRenew: false,
  notificationChannels: ['in-app', 'email'],
  updatedAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [atelier, setAtelier] = useState<Atelier | null>(null);
    const [isImpersonating, setIsImpersonating] = useState(false);
    const [originalUser, setOriginalUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedAtelier = localStorage.getItem(STORAGE_KEYS.ATELIER);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedAtelier) setAtelier(JSON.parse(storedAtelier));
        
        // Initialize default admin if not exists
        let allUsersStr = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
        let allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
        
        let updated = false;
        
        // Primary admin account
        if (!allUsers.find(u => u.email === 'adoris@mmv.com')) {
            const admin: User = { 
                id: 'admin-adoris', 
                email: 'adoris@mmv.com', 
                passwordHash: 'adélaris@2025', 
                role: 'superadmin' 
            };
            allUsers = [...allUsers, admin];
            updated = true;
            console.log('✅ Admin account created:', admin.email);
        }
        
        // Backup admin account (simple credentials for testing)
        if (!allUsers.find(u => u.email === 'admin@mmv.com')) {
            const backupAdmin: User = { 
                id: 'admin-backup', 
                email: 'admin@mmv.com', 
                passwordHash: 'admin', 
                role: 'superadmin' 
            };
            allUsers = [...allUsers, backupAdmin];
            updated = true;
            console.log('✅ Backup admin account created:', backupAdmin.email);
        }
        
        if (updated) {
            localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
            console.log('📊 Available admin accounts:', allUsers.filter(u => u.role === 'superadmin').map(u => ({ email: u.email, id: u.id })));
        } else {
            console.log('✅ Admin accounts already exist');
        }
    }, []);

    const login = useCallback(async (email: string, pass: string) => {
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
        
        // Debug: log available users
        console.log('🔍 Available users:', allUsers.map(u => ({ email: u.email, role: u.role })));
        console.log('🔐 Login attempt:', { email, pass });
        
        const foundUser = allUsers.find(u => u.email === email && u.passwordHash === pass);
        
        if (foundUser) {
            console.log('✅ Login successful for:', foundUser.email);
            setUser(foundUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
            if (foundUser.role === 'manager' && foundUser.atelierId) {
                const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
                const foundAtelier = allAteliers.find(a => a.id === foundUser.atelierId);
                if (foundAtelier) {
                    setAtelier(foundAtelier);
                    localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(foundAtelier));
                }
            }
            return true;
        }
        
        console.log('❌ Login failed: User not found or password incorrect');
        // Additional debug info
        const emailFound = allUsers.find(u => u.email === email);
        if (emailFound) {
            console.log('⚠️ Email found but password mismatch. Expected:', emailFound.passwordHash, 'Got:', pass);
        } else {
            console.log('⚠️ Email not found:', email);
        }
        
        return false;
    }, []);

    const logout = useCallback(() => {
        setUser(null); setAtelier(null); setIsImpersonating(false); setOriginalUser(null);
        localStorage.removeItem(STORAGE_KEYS.USER); localStorage.removeItem(STORAGE_KEYS.ATELIER);
    }, []);

    const register = useCallback(async (atelierName: string, email: string, pass: string, withDemoData: boolean, atelierType?: AtelierType, specialization?: Specialization, employeeCount?: number, initialPlan: SubscriptionPlan = 'free') => {
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
        if (allUsers.find(u => u.email === email)) return false;
        const userId = crypto.randomUUID();
        const atelierId = crypto.randomUUID();
        const startDate = new Date();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 60); // 60 days trial
        const newUser: User = { id: userId, email, passwordHash: pass, role: 'manager', atelierId };
        const newAtelier: Atelier = {
            id: atelierId, name: atelierName, managerId: userId,
            subscription: { 
              id: `sub_${Date.now()}`,
              atelierId,
              status: 'trial', 
              plan: 'free',
              startDate: startDate.toISOString(),
              expiryDate: expiryDate.toISOString(),
              autoRenew: false
            },
            createdAt: new Date().toISOString(),
            data: {
                clients: [], models: [], appointments: [], orders: [], workstations: [], fournitures: [], notifications: [], expenses: [],
                managerProfile: { 
                    name: atelierName, 
                    avatarUrl: 'https://placehold.co/100x100/e2e8f0/78350f?text=Atelier', 
                    atelierType, specialization, employeeCount,
                    phone: '', phonePrefix: '+225' // Default prefix
                },
                managerAccessCode: `CODE-${Math.floor(1000 + Math.random() * 9000)}`,
                modelOfTheMonthId: null, favoriteIds: [], isNew: true
            }
        };
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify([...allUsers, newUser]));
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify([...allAteliers, newAtelier]));
        setUser(newUser); setAtelier(newAtelier);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)); localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(newAtelier));
        return true;
    }, []);

    const updateAtelierData = useCallback((atelierId: string, newData: AtelierData) => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const updatedAteliers = allAteliers.map(a => {
            if (a.id === atelierId) {
                const updated = { ...a, data: newData };
                if (atelier?.id === atelierId) {
                    setAtelier(updated);
                    localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(updated));
                }
                return updated;
            }
            return a;
        });
        localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(updatedAteliers));
    }, [atelier]);

    const updateManagerProfile = useCallback((profile: ManagerProfile) => {
        if (atelier) {
            const newData = { ...atelier.data, managerProfile: profile };
            updateAtelierData(atelier.id, newData);
        }
    }, [atelier, updateAtelierData]);

    const getReviews = useCallback(() => JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]'), []);
    const addReview = useCallback((review: Omit<Review, 'id' | 'createdAt'>) => {
        const reviews = getReviews();
        const newReview = { ...review, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([newReview, ...reviews]));
    }, [getReviews]);

    const deleteReview = useCallback((reviewId: string) => {
        const reviews = getReviews().filter((r: Review) => r.id !== reviewId);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    }, [getReviews]);

    const getSiteContent = useCallback(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
        return stored ? JSON.parse(stored) : DEFAULT_SITE_CONTENT;
    }, []);

    const updateSiteContent = useCallback((newContent: SiteContent) => {
        localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(newContent));
    }, []);

    const sendSystemNotification = useCallback((message: string) => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const updatedAteliers = allAteliers.map(a => ({
            ...a,
            data: {
                ...a.data,
                notifications: [
                    { id: crypto.randomUUID(), message: `📢 MESSAGE SYSTÈME : ${message}`, date: new Date().toISOString(), read: false },
                    ...a.data.notifications
                ]
            }
        }));
        localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(updatedAteliers));
    }, []);

    const addModerationLog = useCallback((modelId: string, action: 'approved' | 'rejected' | 'requested', note?: string) => {
        const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.MODERATION_LOGS) || '[]');
        const entry = { id: crypto.randomUUID(), modelId, action, note: note || '', actor: user?.email || 'system', date: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEYS.MODERATION_LOGS, JSON.stringify([entry, ...logs]));
        return entry;
    }, [user]);

    const getModerationLogs = useCallback(() => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.MODERATION_LOGS) || '[]');
    }, []);

    const getAllUsers = useCallback(() => {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
    }, []);

    const updateUserRole = useCallback((userId: string, role: User['role']) => {
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
        const updated = allUsers.map(u => u.id === userId ? { ...u, role } : u);
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updated));
        if (user?.id === userId) {
            const newUser = updated.find(u => u.id === userId)!;
            setUser(newUser);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
        }
    }, [user]);

    const deleteUser = useCallback((userId: string) => {
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
        const filtered = allUsers.filter(u => u.id !== userId);
        localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(filtered));
        if (user?.id === userId) {
            logout();
        }
    }, [user, logout]);

    const getPlatformStats = useCallback(() => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const active = allAteliers.filter(a => a.subscription.status === 'active' || a.subscription.status === 'trial').length;
        const totalModels = allAteliers.reduce((sum, a) => sum + (a.data.models?.length || 0), 0);
        const estimatedMRR = allAteliers.filter(a => a.subscription.status === 'active').length * 5000;
        return { totalAteliers: allAteliers.length, activeAteliers: active, totalModels, estimatedMRR };
    }, []);

    const getAllAteliersWithManager = useCallback(() => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
        return allAteliers.map(a => ({
            ...a,
            managerEmail: allUsers.find(u => u.id === a.managerId)?.email || 'N/A'
        }));
    }, []);

    const updateSubscription = useCallback((atelierId: string, status: SubscriptionStatus, durationInMonths: number = 1) => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const expiresAt = new Date(); expiresAt.setMonth(expiresAt.getMonth() + durationInMonths);
        const updated = allAteliers.map(a => a.id === atelierId ? { ...a, subscription: { ...a.subscription, status, expiresAt: expiresAt.toISOString() } } : a);
        localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(updated));
        if (atelier?.id === atelierId) {
            const current = updated.find(a => a.id === atelierId)!;
            setAtelier(current);
            localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(current));
        }
    }, [atelier]);

    const getPendingShowcaseModels = useCallback(() => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        let models: Modele[] = [];
        allAteliers.forEach(a => { if (a.data.models) models = [...models, ...a.data.models.filter(m => m.showcaseStatus === 'pending')]; });
        return models;
    }, []);

    const getShowcaseModels = useCallback(() => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        let models: Modele[] = [];
        allAteliers.forEach(a => { if (a.data.models) models = [...models, ...a.data.models.filter(m => m.showcaseStatus === 'approved' && m.isVisible !== false)]; });
        return models;
    }, []);

    const updateShowcaseStatus = useCallback((modelId: string, status: ShowcaseStatus) => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const updated = allAteliers.map(a => {
            if (a.data.models && a.data.models.some(m => m.id === modelId)) {
                return { ...a, data: { ...a.data, models: a.data.models.map(m => m.id === modelId ? { ...m, showcaseStatus: status, isVisible: status === 'approved' } : m) } };
            }
            return a;
        });
        localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(updated));
        // record moderation log
        try { addModerationLog(modelId, status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'requested'); } catch (e) {}
    }, [addModerationLog]);

    const impersonate = useCallback((managerId: string) => {
        const allUsers: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_USERS) || '[]');
        const targetUser = allUsers.find(u => u.id === managerId);
        if (targetUser && user) {
            setOriginalUser(user); setIsImpersonating(true); setUser(targetUser);
            const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
            const targetAtelier = allAteliers.find(a => a.id === targetUser.atelierId);
            if (targetAtelier) setAtelier(targetAtelier);
        }
    }, [user]);

    const stopImpersonating = useCallback(() => {
        if (originalUser) {
            setUser(originalUser); setAtelier(null); setIsImpersonating(false); setOriginalUser(null);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(originalUser));
            localStorage.removeItem(STORAGE_KEYS.ATELIER);
        }
    }, [originalUser]);

    const resetAtelierData = useCallback((id: string) => {
        const allAteliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const updated = allAteliers.map(a => a.id === id ? { ...a, data: { ...a.data, clients: [], orders: [], models: [], appointments: [], favoritesIds: [] } } : a);
        localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(updated));
        window.location.reload();
    }, []);

    // 🎫 NEW: Subscription & Payment Management functions
    const initializeSubscriptionForNewAtelier = useCallback((atelierId: string) => {
        const ateliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const atelierIndex = ateliers.findIndex(a => a.id === atelierId);
        
        if (atelierIndex !== -1) {
            ateliers[atelierIndex].subscription = {
                id: `sub_${Date.now()}`,
                atelierId,
                status: 'trial',
                plan: 'free',
                startDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                autoRenew: false,
            };
            localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(ateliers));
            if (atelier?.id === atelierId) {
                setAtelier(ateliers[atelierIndex]);
                localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(ateliers[atelierIndex]));
            }
        }
    }, [atelier?.id]);

    const getPaymentSettings = useCallback((): PaymentSettings | null => {
        const settings = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
        return settings ? JSON.parse(settings) : DEFAULT_PAYMENT_SETTINGS;
    }, []);

    const addPaymentTransaction = useCallback((transaction: PaymentTransaction) => {
        const ateliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const atelierIndex = ateliers.findIndex(a => a.id === transaction.atelierId);
        
        if (atelierIndex !== -1) {
            if (!ateliers[atelierIndex].paymentHistory) {
                ateliers[atelierIndex].paymentHistory = [];
            }
            ateliers[atelierIndex].paymentHistory!.push(transaction);
            localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(ateliers));
            
            if (atelier?.id === transaction.atelierId) {
                setAtelier(ateliers[atelierIndex]);
                localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(ateliers[atelierIndex]));
            }
        }
    }, [atelier?.id]);

    const confirmPayment = useCallback((transactionId: string, adminId: string) => {
        const ateliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        
        for (const atelier of ateliers) {
            if (atelier.paymentHistory) {
                const transaction = atelier.paymentHistory.find(t => t.id === transactionId);
                if (transaction) {
                    transaction.status = 'confirmed';
                    transaction.confirmedAt = new Date().toISOString();
                    transaction.confirmedBy = adminId;
                    
                    // Renouveller l'abonnement
                    if (atelier.subscription) {
                        const expiryDate = new Date();
                        if (transaction.plan === 'monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
                        if (transaction.plan === 'quarterly') expiryDate.setMonth(expiryDate.getMonth() + 3);
                        if (transaction.plan === 'yearly') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                        
                        atelier.subscription.status = 'active';
                        atelier.subscription.plan = transaction.plan;
                        atelier.subscription.expiryDate = expiryDate.toISOString();
                        atelier.subscription.lastPaymentDate = new Date().toISOString();
                        atelier.subscription.lastTransactionId = transactionId;
                        atelier.subscription.paymentMethod = transaction.provider;
                    }
                    
                    localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(ateliers));
                    if (atelier?.id === transaction.atelierId) {
                        setAtelier(atelier);
                        localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(atelier));
                    }
                    break;
                }
            }
        }
    }, [atelier?.id]);

    const rejectPayment = useCallback((transactionId: string, adminId: string, reason: string) => {
        const ateliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        
        for (const atelier of ateliers) {
            if (atelier.paymentHistory) {
                const transaction = atelier.paymentHistory.find(t => t.id === transactionId);
                if (transaction) {
                    transaction.status = 'failed';
                    transaction.rejectedAt = new Date().toISOString();
                    transaction.rejectedBy = adminId;
                    transaction.rejectionReason = reason;
                    
                    localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(ateliers));
                    break;
                }
            }
        }
    }, []);

    const renewSubscription = useCallback((atelierId: string, plan: SubscriptionPlan) => {
        const ateliers: Atelier[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_ATELIERS) || '[]');
        const atelierIndex = ateliers.findIndex(a => a.id === atelierId);
        
        if (atelierIndex !== -1 && ateliers[atelierIndex].subscription) {
            const expiryDate = new Date();
            if (plan === 'monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
            if (plan === 'quarterly') expiryDate.setMonth(expiryDate.getMonth() + 3);
            if (plan === 'yearly') expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            
            ateliers[atelierIndex].subscription!.status = 'active';
            ateliers[atelierIndex].subscription!.plan = plan;
            ateliers[atelierIndex].subscription!.startDate = new Date().toISOString();
            ateliers[atelierIndex].subscription!.expiryDate = expiryDate.toISOString();
            
            localStorage.setItem(STORAGE_KEYS.ALL_ATELIERS, JSON.stringify(ateliers));
            
            if (atelier?.id === atelierId) {
                setAtelier(ateliers[atelierIndex]);
                localStorage.setItem(STORAGE_KEYS.ATELIER, JSON.stringify(ateliers[atelierIndex]));
            }
        }
    }, [atelier?.id]);

    const updatePaymentSettings = useCallback((settings: PaymentSettings) => {
        localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify({
            ...settings,
            updatedAt: new Date().toISOString(),
        }));
    }, []);

    const value = useMemo(() => ({ 
        isAuthenticated: !!user, user, atelier, isSubscriptionActive: true, isImpersonating,
        login, logout, register, changePassword: async () => ({ success: true, message: 'OK' }), impersonate, stopImpersonating,
        getAllAteliersWithManager, updateSubscription, upgradeClientSubscription: () => {}, updateAtelierData,
        resetAtelierData, updateManagerProfile, getShowcaseModels,
        getPendingShowcaseModels, updateShowcaseStatus, registerClientAndOrderFromShowroom: async () => true,
        getReviews, addReview, deleteReview, getSiteContent, updateSiteContent, getPlatformStats, sendSystemNotification,
        addModerationLog, getModerationLogs, getAllUsers, updateUserRole, deleteUser,
        // 🎫 NEW: Payment functions
        initializeSubscriptionForNewAtelier, getPaymentSettings, addPaymentTransaction, confirmPayment, rejectPayment, renewSubscription, updatePaymentSettings
    }), [user, atelier, isImpersonating, login, logout, register, impersonate, stopImpersonating, getAllAteliersWithManager, updateSubscription, updateAtelierData, getPendingShowcaseModels, updateShowcaseStatus, getReviews, addReview, deleteReview, getSiteContent, updateSiteContent, getPlatformStats, sendSystemNotification, resetAtelierData, getShowcaseModels, updateManagerProfile, addModerationLog, getModerationLogs, getAllUsers, updateUserRole, deleteUser, initializeSubscriptionForNewAtelier, getPaymentSettings, addPaymentTransaction, confirmPayment, rejectPayment, renewSubscription, updatePaymentSettings]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth error');
    return context;
};

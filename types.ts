export type MobileMoneyType = 'mtn' | 'orange' | 'moov';

export interface MobileMoneyProvider {
  id: string;
  type: MobileMoneyType;
  name: string;
  accountNumber: string;
  accountHolderName: string;
  transferCode: string;
  enabled: boolean;
  countryCode: string;
}

export type SubscriptionTier = 'basic' | 'premium' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: number;
  durationDays: number;
  features: string[];
  maxClients: number;
  maxOrders: number;
}

export type PaymentStatus = 'pending' | 'confirmed' | 'rejected' | 'expired';

export interface PaymentTransaction {
  id: string;
  atelierId: string;
  planId: string;
  providerId: string;
  amount: number;
  senderPhone: string;
  status: PaymentStatus;
  createdAt: Date;
  confirmedAt?: Date;
  expiresAt: Date;
  adminNote?: string;
}

export interface PaymentSettings {
  providers: MobileMoneyProvider[];
  plans: SubscriptionPlan[];
  isEnabled: boolean;
}

export interface Tutoriel {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: Date;
}

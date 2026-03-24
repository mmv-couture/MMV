import { MobileMoneyProvider } from '../types';

export const formatTransferCode = (code: string, amount: number): string => {
  // Format: *code*amount*accountNumber#
  return `${code}${amount}#`;
};

export const getTransferInstructions = (provider: MobileMoneyProvider, amount: number): string => {
  const code = formatTransferCode(provider.transferCode, amount);
  
  const instructions: Record<MobileMoneyProvider['type'], string> = {
    mtn: `Instructions MTN Mobile Money:
1. Composez le code: ${code}
2. Entrez votre PIN MTN
3. Confirmez le transfert vers ${provider.accountHolderName}
4. Conservez le SMS de confirmation`,
    
    orange: `Instructions Orange Money:
1. Composez le code: ${code}
2. Entrez votre code secret Orange
3. Validez le transfert vers ${provider.accountHolderName}
4. Gardez le SMS de confirmation`,
    
    moov: `Instructions Moov Money:
1. Composez le code: ${code}
2. Saisissez votre mot de passe Moov
3. Confirmez l'envoi à ${provider.accountHolderName}
4. Conservez la preuve de transaction`,
  };

  return instructions[provider.type];
};

export const calculateExpiryDate = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const formatPrice = (price: number, currency = 'XOF'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(price);
};

export const getDaysRemaining = (expiryDate: Date | string): number => {
  const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isSubscriptionExpired = (expiryDate: Date | string): boolean => {
  return getDaysRemaining(expiryDate) < 0;
};

export const shouldShowReminderBanner = (expiryDate: Date | string, daysThreshold = 7): boolean => {
  const days = getDaysRemaining(expiryDate);
  return days <= daysThreshold && days >= 0;
};

export const getSubscriptionStatusMessage = (expiryDate: Date | string): string => {
  const days = getDaysRemaining(expiryDate);
  if (days < 0) return 'Abonnement expiré';
  if (days === 0) return 'Expire aujourd\'hui';
  if (days === 1) return 'Expire demain';
  if (days <= 7) return `Expire dans ${days} jours`;
  return `Valide jusqu'au ${formatDateFR(expiryDate)}`;
};

export const formatDateFR = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

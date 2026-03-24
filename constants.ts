// Constants for the application

export const WAITING_ROOM_ID = 'waiting-room';
export const DEFAULT_WORKSTATION_ID = 'default';

export const APP_NAME = 'MMV Couture';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mmv_auth_token',
  USER_DATA: 'mmv_user_data',
  SETTINGS: 'mmv_settings',
  THEME: 'mmv_theme',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ORDERS: '/orders',
  CLIENTS: '/clients',
  MODELS: '/models',
  SETTINGS: '/settings',
  SUBSCRIPTION: '/subscription',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

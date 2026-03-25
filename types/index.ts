// Types principaux de l'application
export interface Page {
  name: string;
  path: string;
  icon?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'client' | 'artisan';
  workshopId?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workshop {
  id: string;
  name: string;
  description: string;
  managerId: string;
  address: string;
  phone: string;
  email: string;
  specialty: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  preferences?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fonction utilitaire pour le nom complet
export const getClientFullName = (client: Client): string => {
  return `${client.firstName} ${client.lastName}`;
};

export interface Model {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  clientId: string;
  workshopId: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  deliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Alias pour compatibilité avec le code existant
  ticketId: string;  // Alias vers id
  date: Date;        // Alias vers createdAt
}

export interface OrderItem {
  id: string;
  type: 'clothing' | 'accessory' | 'alteration';
  description: string;
  fabric?: string;
  measurements?: string;
  price: number;
  quantity: number;
}

export interface Measurement {
  id: string;
  clientId: string;
  type: string;
  values: Record<string, number>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Types pour le système de langues
export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translation {
  [key: string]: string;
}

// Types pour les statistiques et rapports
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeClients: number;
  pendingOrders: number;
  completedOrders: number;
  monthlyRevenue: number[];
  orderStatus: Record<string, number>;
}

export interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'orders' | 'clients' | 'workshops';
  data: any;
  generatedAt: Date;
  generatedBy: string;
}

// Types pour les paramètres
export interface Settings {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  updatedAt: Date;
  updatedBy: string;
}

// Types pour les fichiers et médias
export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

// Types pour les événements et logs
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  timestamp: Date;
  ipAddress?: string;
}

// Types pour le système de recherche
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Types pour la pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Types pour les formulaires
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormData {
  [key: string]: any;
}

// Types pour les thèmes et personnalisation
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

// Types pour l'API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

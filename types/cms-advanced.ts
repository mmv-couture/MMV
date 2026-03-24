// Système de galerie d'images avancé
export interface GalleryImage {
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  alt?: string;
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
    size?: number;
    format?: string;
  };
}

export interface GallerySettings {
  layout: 'grid' | 'masonry' | 'carousel' | 'slider' | 'lightbox';
  columns?: number;
  spacing?: 'small' | 'medium' | 'large';
  showThumbnails?: boolean;
  enableZoom?: boolean;
  enableLazyLoad?: boolean;
  autoplay?: boolean;
  interval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  transitionType?: 'fade' | 'slide' | 'scale' | 'flip';
  transitionSpeed?: 'slow' | 'medium' | 'fast';
}

export interface VideoContent {
  id: string;
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  duration?: number;
  platform?: 'youtube' | 'vimeo' | 'self-hosted';
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
}

export interface SocialMediaIntegration {
  platform: 'instagram' | 'facebook' | 'twitter' | 'pinterest' | 'tiktok';
  username?: string;
  hashtag?: string;
  feedType?: 'user' | 'hashtag' | 'location';
  limit?: number;
  showCaptions?: boolean;
  enableLightbox?: boolean;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  images: GalleryImage[];
  category?: string;
  tags?: string[];
  variants?: ProductVariant[];
  inventory?: {
    stock: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
  };
  shipping?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping?: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  sku?: string;
  image?: string;
  attributes: Record<string, string>;
  inventory?: {
    stock: number;
    trackQuantity: boolean;
  };
}

export interface ContactForm {
  id: string;
  title?: string;
  description?: string;
  fields: FormField[];
  submitButton?: {
    text?: string;
    style?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
  };
  successMessage?: string;
  errorMessage?: string;
  redirectUrl?: string;
  notifications?: {
    email?: string;
    slack?: string;
    webhook?: string;
  };
}

export interface NewsletterSection {
  id: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
  provider?: 'mailchimp' | 'convertkit' | 'sendinblue' | 'custom';
  listId?: string;
  tags?: string[];
  doubleOptIn?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  content: string;
  rating?: number;
  date?: Date;
  verified?: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface TestimonialSection {
  testimonials: Testimonial[];
  layout: 'grid' | 'carousel' | 'slider' | 'masonry';
  showAvatars?: boolean;
  showRating?: boolean;
  showDate?: boolean;
  autoRotate?: boolean;
  interval?: number;
  showNavigation?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  featured?: boolean;
}

export interface FaqSection {
  title?: string;
  description?: string;
  items: FaqItem[];
  layout: 'accordion' | 'grid' | 'list';
  searchable?: boolean;
  categorizable?: boolean;
  expandMultiple?: boolean;
}

export interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  image?: string;
}

export interface MapSection {
  locations: MapLocation[];
  provider: 'google' | 'openstreet' | 'mapbox';
  style?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  zoom?: number;
  showControls?: boolean;
  showMarkers?: boolean;
  enableClustering?: boolean;
  fullscreenControl?: boolean;
}

export interface CountdownTimer {
  id: string;
  title?: string;
  targetDate: Date;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  format?: 'standard' | 'compact' | 'verbose';
  onComplete?: {
    message?: string;
    action?: 'hide' | 'show-message' | 'redirect';
    redirectUrl?: string;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  period?: 'month' | 'year' | 'lifetime';
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonUrl?: string;
  badge?: string;
  popular?: boolean;
}

export interface PricingSection {
  title?: string;
  description?: string;
  plans: PricingPlan[];
  layout: 'grid' | 'carousel' | 'comparison';
  showToggle?: boolean;
  toggleText?: {
    monthly?: string;
    yearly?: string;
  };
  yearlyDiscount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  expertise?: string[];
}

export interface TeamSection {
  title?: string;
  description?: string;
  members: TeamMember[];
  layout: 'grid' | 'carousel' | 'list';
  showSocial?: boolean;
  showBio?: boolean;
  columns?: number;
}

export interface Statistics {
  id: string;
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: string;
  animation?: 'count' | 'slide' | 'fade';
  duration?: number;
}

export interface StatisticsSection {
  title?: string;
  description?: string;
  statistics: Statistics[];
  layout: 'grid' | 'counter' | 'progress';
  animated?: boolean;
  showIcons?: boolean;
}

export interface ProgressBar {
  id: string;
  label: string;
  value: number;
  max?: number;
  color?: string;
  animated?: boolean;
  showPercentage?: boolean;
  striped?: boolean;
}

export interface ProgressSection {
  title?: string;
  description?: string;
  bars: ProgressBar[];
  layout: 'vertical' | 'horizontal';
  animated?: boolean;
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description?: string;
  image?: string;
  type?: 'milestone' | 'event' | 'achievement' | 'announcement';
  featured?: boolean;
}

export interface TimelineSection {
  title?: string;
  description?: string;
  events: TimelineEvent[];
  layout: 'vertical' | 'horizontal' | 'zigzag';
  showDates?: boolean;
  showImages?: boolean;
  alternating?: boolean;
}

export interface LogoItem {
  id: string;
  name: string;
  image: string;
  url?: string;
  alt?: string;
}

export interface LogoSection {
  title?: string;
  description?: string;
  logos: LogoItem[];
  layout: 'grid' | 'carousel' | 'wall';
  showGrayscale?: boolean;
  enableHover?: boolean;
  autoRotate?: boolean;
}

export interface DownloadItem {
  id: string;
  name: string;
  description?: string;
  file: string;
  size?: string;
  format?: string;
  icon?: string;
  requireEmail?: boolean;
}

export interface DownloadSection {
  title?: string;
  description?: string;
  items: DownloadItem[];
  layout: 'grid' | 'list' | 'cards';
  showPreviews?: boolean;
  requireEmail?: boolean;
}

// Types pour les formulaires avancés
export interface AdvancedFormField extends FormField {
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file' | 'date' | 'range' | 'color' | 'url' | 'tel' | 'search';
  conditional?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
    action: 'show' | 'hide' | 'enable' | 'disable';
  };
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: string;
    message?: string;
  };
  dependencies?: string[];
  defaultValue?: any;
  placeholder?: string;
  helpText?: string;
}

export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: AdvancedFormField[];
  layout: 'vertical' | 'horizontal' | 'grid' | 'steps';
  multiStep?: boolean;
  showProgress?: boolean;
  submitButton?: {
    text?: string;
    style?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
  };
  resetButton?: {
    text?: string;
    show?: boolean;
  };
  successAction?: {
    type: 'message' | 'redirect' | 'download';
    value: string;
  };
}

// Types pour les sections interactives
export interface InteractiveSection {
  id: string;
  type: 'quiz' | 'poll' | 'survey' | 'calculator' | 'configurator';
  title?: string;
  description?: string;
  content: any;
  settings?: Record<string, any>;
}

export interface QuizSection extends InteractiveSection {
  type: 'quiz';
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer?: number;
    explanation?: string;
    image?: string;
  }[];
  showResults?: boolean;
  showScore?: boolean;
  randomize?: boolean;
  timeLimit?: number;
}

export interface PollSection extends InteractiveSection {
  type: 'poll';
  question: string;
  options: string[];
  multipleChoice?: boolean;
  showResults?: boolean;
  allowComments?: boolean;
  endDate?: Date;
}

export interface CalculatorSection extends InteractiveSection {
  type: 'calculator';
  inputs: {
    name: string;
    label: string;
    type: 'number' | 'select' | 'range';
    options?: Array<{ label: string; value: number }>;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
  }[];
  formula: string;
  resultLabel?: string;
  showSteps?: boolean;
}

// Types pour les sections de contenu dynamique
export interface DynamicContent {
  id: string;
  type: 'rss' | 'api' | 'database' | 'json';
  source: string;
  template?: string;
  refreshInterval?: number;
  limit?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DynamicSection {
  id: string;
  title?: string;
  description?: string;
  content: DynamicContent;
  layout: 'list' | 'grid' | 'cards' | 'carousel';
  showLoading?: boolean;
  showError?: boolean;
  emptyMessage?: string;
}

// Types pour les sections d'intégration externe
export interface ExternalIntegration {
  id: string;
  type: 'calendly' | 'typeform' | 'google-forms' | 'hubspot' | 'salesforce' | 'slack' | 'discord' | 'whatsapp';
  config: Record<string, any>;
  embedCode?: string;
  customStyles?: string;
}

export interface IntegrationSection {
  id: string;
  integration: ExternalIntegration;
  title?: string;
  description?: string;
  fullWidth?: boolean;
  height?: string;
  responsive?: boolean;
}

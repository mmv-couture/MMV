import * as React from 'react';

export interface ContentSection {
  id: string;
  type: 'hero' | 'features' | 'about' | 'services' | 'testimonials' | 'contact' | 'custom' | 'content' | 'workshop-search';
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  order: number;
  isActive: boolean;
  targetAudience: 'public' | 'client' | 'atelier' | 'all';
  
  // Options de positionnement et d'affichage des images
  imagePosition?: 'left' | 'right' | 'top' | 'background' | 'center' | 'overlay';
  imageFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  imageSize?: 'small' | 'medium' | 'large' | 'extra-large' | 'full';
  
  // Options avancées pour les images
  imageOpacity?: number; // 0.1 à 1.0
  imageFilter?: 'none' | 'grayscale' | 'sepia' | 'blur' | 'brightness' | 'contrast' | 'saturate';
  imageBorder?: 'none' | 'thin' | 'medium' | 'thick' | 'rounded';
  imageShadow?: 'none' | 'soft' | 'medium' | 'hard' | 'glow';
  imageHoverEffect?: 'none' | 'zoom' | 'pan' | 'tilt' | 'fade' | 'slide';
  
  // Options de parallax et de mouvement
  enableParallax?: boolean;
  parallaxSpeed?: 'slow' | 'medium' | 'fast';
  enableFloating?: boolean;
  floatingSpeed?: 'slow' | 'medium' | 'fast';
  
  // Options de fond et de décoration
  heroBackgroundImage?: string;
  heroBackgroundType?: 'solid' | 'gradient' | 'image' | 'video' | 'pattern';
  heroGradientStart?: string;
  heroGradientEnd?: string;
  heroGradientDirection?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'diagonal';
  
  // Options de forme et de style
  paddingSize?: 'small' | 'medium' | 'large' | 'extra-large' | 'huge';
  borderRadius?: 'none' | 'small' | 'medium' | 'large' | 'full' | 'custom';
  shadowIntensity?: 'none' | 'light' | 'medium' | 'heavy' | 'dramatic';
  animationType?: 'none' | 'fade' | 'slide' | 'zoom' | 'bounce' | 'flip' | 'rotate' | 'elastic';
  animationSpeed?: 'slow' | 'medium' | 'fast';
  
  // Options de layout avancées
  layoutType?: 'standard' | 'centered' | 'split' | 'grid' | 'full-width' | 'masonry' | 'cards';
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom';
  contentAlignment?: 'left' | 'center' | 'right' | 'justify';
  verticalAlignment?: 'top' | 'middle' | 'bottom' | 'stretch';
  
  // Options de typographie avancées
  titleFont?: 'default' | 'serif' | 'sans-serif' | 'display' | 'handwritten' | 'monospace';
  titleSize?: 'small' | 'medium' | 'large' | 'extra-large' | 'huge' | 'massive';
  titleWeight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  titleStyle?: 'normal' | 'italic' | 'oblique';
  
  // Options de couleurs avancées
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  gradientColors?: string[];
  colorScheme?: 'light' | 'dark' | 'auto' | 'custom';
  
  // Options interactives
  enableClickToZoom?: boolean;
  enableImageGallery?: boolean;
  enableLazyLoading?: boolean;
  enableLightbox?: boolean;
  
  // Options responsives
  mobileLayout?: 'stack' | 'horizontal' | 'vertical' | 'hidden';
  tabletLayout?: 'adapt' | 'desktop' | 'mobile';
  
  // Options de performance
  imageOptimization?: 'auto' | 'high' | 'medium' | 'low';
  enableWebP?: boolean;
  enableAvif?: boolean;
  
  // Options SEO et accessibilité
  imageAlt?: string;
  imageTitle?: string;
  imageCaption?: string;
  enableSchema?: boolean;
  
  // Options personnalisées
  customCSS?: string;
  customClasses?: string;
  customAttributes?: Record<string, string>;
  
  // Options de débogage
  enableDebugMode?: boolean;
  showImageInfo?: boolean;
}

export const DEFAULT_CONTENT: ContentSection[] = [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'MMV Couture - L\'Excellence Africaine',
    subtitle: 'Des créations uniques qui célèbrent votre identité',
    content: 'Découvrez des ateliers de couture d\'exception et des modèles qui racontent votre histoire. Notre marketplace connecte les meilleurs tailleurs africains avec des clients du monde entier.',
    buttonText: 'Découvrir les ateliers',
    buttonLink: '/ateliers',
    backgroundColor: '#f97316',
    textColor: '#ffffff',
    order: 1,
    isActive: true,
    targetAudience: 'public',
  },
  {
    id: 'features-1',
    type: 'features',
    title: 'Pourquoi choisir MMV Couture ?',
    content: 'Une plateforme complète pour tous vos besoins en couture africaine',
    order: 2,
    isActive: true,
    targetAudience: 'public',
  },
  {
    id: 'about-1',
    type: 'about',
    title: 'Notre Histoire',
    content: 'MMV Couture est née de la passion pour la couture africaine et du désir de connecter les talents locaux avec une clientèle mondiale. Notre mission est de préserver et promouvoir le savoir-faire textile africain tout en créant des opportunités économiques pour les artisans.',
    order: 3,
    isActive: true,
    targetAudience: 'public',
  },
  {
    id: 'services-1',
    type: 'services',
    title: 'Nos Services',
    content: 'De la création sur mesure aux collections prêt-à-porter, en passant par les conseils en style',
    order: 4,
    isActive: true,
    targetAudience: 'public',
  },
];

// Récupérer le contenu
export function getContentSections(): ContentSection[] {
  if (typeof window === 'undefined') return DEFAULT_CONTENT;
  const stored = localStorage.getItem('cmsContent');
  return stored ? JSON.parse(stored) : DEFAULT_CONTENT;
}

// Sauvegarder le contenu
export function saveContentSections(sections: ContentSection[]): void {
  localStorage.setItem('cmsContent', JSON.stringify(sections));
}

// Créer une nouvelle section
export function createContentSection(type: ContentSection['type']): ContentSection {
  const sections = getContentSections();
  const maxOrder = Math.max(...sections.map(s => s.order), 0);
  
  return {
    id: `section-${Date.now()}`,
    type,
    title: 'Nouvelle section',
    content: '',
    order: maxOrder + 1,
    isActive: true,
    targetAudience: 'all',
    
    // Options de positionnement et d'affichage des images
    imagePosition: 'left',
    imageFit: 'cover',
    imageSize: 'large',
    
    // Options avancées pour les images
    imageOpacity: 1.0,
    imageFilter: 'none',
    imageBorder: 'medium',
    imageShadow: 'medium',
    imageHoverEffect: 'zoom',
    
    // Options de parallax et de mouvement
    enableParallax: false,
    parallaxSpeed: 'medium',
    enableFloating: false,
    floatingSpeed: 'medium',
    
    // Options de fond et de décoration
    heroBackgroundType: 'gradient',
    heroGradientStart: '#fb923c',
    heroGradientEnd: '#d97706',
    heroGradientDirection: 'diagonal',
    
    // Options de forme et de style
    paddingSize: 'large',
    borderRadius: 'medium',
    shadowIntensity: 'medium',
    animationType: 'fade',
    animationSpeed: 'medium',
    
    // Options de layout avancées
    layoutType: 'standard',
    maxWidth: 'xl',
    contentAlignment: 'left',
    verticalAlignment: 'middle',
    
    // Options de typographie avancées
    titleFont: 'default',
    titleSize: 'large',
    titleWeight: 'bold',
    titleStyle: 'normal',
    
    // Options de couleurs avancées
    primaryColor: '#fb923c',
    secondaryColor: '#d97706',
    accentColor: '#f59e0b',
    gradientColors: ['#fb923c', '#d97706'],
    colorScheme: 'auto',
    
    // Options interactives
    enableClickToZoom: false,
    enableImageGallery: false,
    enableLazyLoading: true,
    enableLightbox: false,
    
    // Options responsives
    mobileLayout: 'stack',
    tabletLayout: 'adapt',
    
    // Options de performance
    imageOptimization: 'auto',
    enableWebP: true,
    enableAvif: false,
    
    // Options SEO et accessibilité
    imageAlt: '',
    imageTitle: '',
    imageCaption: '',
    enableSchema: true,
    
    // Options personnalisées
    customCSS: '',
    customClasses: '',
    customAttributes: {},
    
    // Options de débogage
    enableDebugMode: false,
    showImageInfo: false,
  };
}

// Mettre à jour une section
export function updateContentSection(id: string, updates: Partial<ContentSection>): void {
  const sections = getContentSections();
  const index = sections.findIndex(s => s.id === id);
  if (index !== -1) {
    sections[index] = { ...sections[index], ...updates };
    saveContentSections(sections);
  }
}

// Supprimer une section
export function deleteContentSection(id: string): void {
  const sections = getContentSections();
  const filtered = sections.filter(s => s.id !== id);
  saveContentSections(filtered);
}

// Réorganiser les sections
export function reorderSections(orderedIds: string[]): void {
  const sections = getContentSections();
  const reordered = orderedIds.map((id, index) => {
    const section = sections.find(s => s.id === id);
    return { ...section!, order: index + 1 };
  });
  saveContentSections(reordered);
}

// Dupliquer une section
export function duplicateContentSection(id: string): void {
  const sections = getContentSections();
  const section = sections.find(s => s.id === id);
  if (section) {
    const maxOrder = Math.max(...sections.map(s => s.order), 0);
    const duplicate: ContentSection = {
      ...section,
      id: `section-${Date.now()}`,
      title: `${section.title} (Copie)`,
      order: maxOrder + 1,
      isActive: false, // Inactive par défaut pour éviter les doublons visuels
    };
    sections.push(duplicate);
    saveContentSections(sections);
  }
}

// Récupérer le contenu public
export function getPublicContent(): ContentSection[] {
  const sections = getContentSections();
  return sections
    .filter(s => s.isActive && (s.targetAudience === 'public' || s.targetAudience === 'all'))
    .sort((a, b) => a.order - b.order);
}

// Récupérer le contenu client
export function getClientContent(): ContentSection[] {
  const sections = getContentSections();
  return sections
    .filter(s => s.isActive && (s.targetAudience === 'client' || s.targetAudience === 'all'))
    .sort((a, b) => a.order - b.order);
}

// Récupérer le contenu atelier
export function getAtelierContent(): ContentSection[] {
  const sections = getContentSections();
  return sections
    .filter(s => s.isActive && (s.targetAudience === 'atelier' || s.targetAudience === 'all'))
    .sort((a, b) => a.order - b.order);
}

// Prévisualiser le rendu HTML d'une section
export function renderSectionHTML(section: ContentSection): string {
  const styles = `
    background-color: ${section.backgroundColor || '#ffffff'};
    color: ${section.textColor || '#000000'};
    padding: 4rem 2rem;
  `;
  
  switch (section.type) {
    case 'hero':
      return `
        <section class="hero-section" style="${styles} min-height: 80vh; display: flex; align-items: center;">
          <div class="container">
            <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1rem;">${section.title}</h1>
            ${section.subtitle ? `<h2 style="font-size: 1.5rem; margin-bottom: 2rem;">${section.subtitle}</h2>` : ''}
            <p style="font-size: 1.25rem; margin-bottom: 2rem; max-width: 600px;">${section.content}</p>
            ${section.buttonText ? `<a href="${section.buttonLink || '#'}" style="display: inline-block; padding: 1rem 2rem; background: white; color: ${section.backgroundColor}; text-decoration: none; border-radius: 0.5rem; font-weight: bold;">${section.buttonText}</a>` : ''}
          </div>
        </section>
      `;
    
    case 'features':
      return `
        <section class="features-section" style="${styles}">
          <div class="container">
            <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">${section.title}</h2>
            <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              <div class="feature-card" style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Qualité Premium</h3>
                <p>Des créations d'exception par les meilleurs artisans</p>
              </div>
              <div class="feature-card" style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Sur Mesure</h3>
                <p>Des vêtements adaptés à votre morphologie</p>
              </div>
              <div class="feature-card" style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem;">Livraison Rapide</h3>
                <p>Recevez vos commandes en 7-14 jours</p>
              </div>
            </div>
          </div>
        </section>
      `;
    
    default:
      return `
        <section style="${styles}">
          <div class="container">
            <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">${section.title}</h2>
            ${section.subtitle ? `<h3 style="font-size: 1.25rem; margin-bottom: 1rem;">${section.subtitle}</h3>` : ''}
            <p style="white-space: pre-wrap;">${section.content}</p>
          </div>
        </section>
      `;
  }
}

// Exporter le contenu
export function exportContent(): string {
  const sections = getContentSections();
  return JSON.stringify(sections, null, 2);
}

// Importer du contenu
export function importContent(jsonString: string): boolean {
  try {
    const sections = JSON.parse(jsonString);
    if (Array.isArray(sections)) {
      saveContentSections(sections);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Réinitialiser le contenu
export function resetContent(): void {
  localStorage.removeItem('cmsContent');
}

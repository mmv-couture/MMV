import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ContentSection, getPublicContent } from '../utils/cmsSystem';
import { Page } from '../types';

// TypingText component
interface TypingTextProps {
  text: string;
  speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <>{displayedText}</>;
};

// FloatingParticles component
const FloatingParticles: React.FC = () => {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }}
        />
      ))}
    </>
  );
};

// Props pour PublicHome
interface PublicHomeProps {
  onNavigate: (page: Page) => void;
}

// WorkshopSearch component
interface WorkshopSearchProps {
  onNavigate: (page: Page) => void;
}

const WorkshopSearch: React.FC<WorkshopSearchProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simuler une recherche
    setTimeout(() => {
      setSearchResults([
        `Atelier "${searchQuery}" - Abidjan`,
        `Couture "${searchQuery}" - Cocody`,
        `Design "${searchQuery}" - Plateau`
      ]);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          Trouvez un Atelier de Couture
        </h2>
        
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher un atelier, un style de couture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-300 disabled:opacity-50"
            >
              {isSearching ? 'Recherche...' : 'Rechercher'}
            </button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-gray-700 mb-3">Résultats trouvés :</h3>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => onNavigate('workshops')}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                >
                  <p className="text-gray-800">{result}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const HeroSection: React.FC<{ section: ContentSection; onNavigate: (page: Page) => void }> = ({ section, onNavigate }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                });
            }
        };

        const timer = setTimeout(() => setIsVisible(true), 100);
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Gérer les différents types de fond d'écran
    const getBackgroundStyle = () => {
        const bgStyle = section.backgroundColor ? { backgroundColor: section.backgroundColor } : {};
        
        switch (section.heroBackgroundType) {
            case 'solid':
                return {
                    ...bgStyle,
                    backgroundColor: section.backgroundColor || '#1e293b',
                };
                
            case 'gradient':
                return {
                    ...bgStyle,
                    backgroundImage: `linear-gradient(135deg, 
                        ${section.heroGradientStart || '#1e293b'} 0%, 
                        ${section.heroGradientEnd || '#fb923c'} 50%, 
                        ${section.heroGradientEnd || '#d97706'} 100%)`,
                };
                
            case 'image':
                return {
                    ...bgStyle,
                    backgroundImage: section.heroBackgroundImage || section.imageUrl ? 
                        `linear-gradient(135deg, 
                            rgba(0,0,0,0.7) 0%, 
                            rgba(0,0,0,0.5) 40%, 
                            rgba(251,146,60,0.2) 60%, 
                            rgba(0,0,0,0.6) 100%), 
                        url(${section.heroBackgroundImage || section.imageUrl})` : 
                        `linear-gradient(135deg, 
                            rgb(30,30,30) 0%, 
                            rgb(50,50,50) 40%, 
                            rgb(251,146,60,0.3) 60%, 
                            rgb(40,40,40) 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                };
                
            case 'video':
                // Pour les vidéos, nous utiliserions une balise video mais pour l'instant, utilisons une image
                return {
                    ...bgStyle,
                    backgroundImage: section.heroBackgroundImage ? 
                        `linear-gradient(135deg, 
                            rgba(0,0,0,0.8) 0%, 
                            rgba(0,0,0,0.4) 100%), 
                        url(${section.heroBackgroundImage})` : 
                        `linear-gradient(135deg, 
                            rgb(15,15,15) 0%, 
                            rgb(30,30,30) 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                };
                
            default:
                return {
                    ...bgStyle,
                    backgroundImage: section.imageUrl ? 
                        `linear-gradient(135deg, 
                            rgba(0,0,0,0.7) 0%, 
                            rgba(0,0,0,0.5) 40%, 
                            rgba(251,146,60,0.2) 60%, 
                            rgba(0,0,0,0.6) 100%), 
                        url(${section.imageUrl})` : 
                        `linear-gradient(135deg, 
                            rgb(30,30,30) 0%, 
                            rgb(50,50,50) 40%, 
                            rgb(251,146,60,0.3) 60%, 
                            rgb(40,40,40) 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                };
        }
    };

    return (
        <section
            ref={heroRef}
            className="relative mb-0 overflow-hidden"
            style={getBackgroundStyle()}
        >
            {/* Overlay subtil avec parallax */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-stone-900/30"
                    style={{
                        transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
                        transition: 'transform 0.3s ease-out'
                    }}
                ></div>
                <div 
                    className="absolute inset-0 bg-gradient-to-tr from-stone-900/20 via-transparent to-black/10"
                    style={{
                        transform: `translate(${-mousePosition.x * 10}px, ${-mousePosition.y * 10}px)`,
                        transition: 'transform 0.4s ease-out'
                    }}
                ></div>
            </div>
            
            {/* Particules flottantes discrètes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${15 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>
            
            <div className={`min-h-screen sm:min-h-[90vh] relative flex items-center justify-center p-6 sm:p-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
                <div className={`relative z-10 w-full max-w-5xl flex flex-col text-center items-center transform transition-all duration-1000 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                    {/* Badge supérieur */}
                    <div className="mb-8 animate-slide-down" style={{ animationDelay: '0.2s' }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Excellence Africaine</span>
                        </div>
                    </div>
                    
                    {/* Titre principal - taille réduite */}
                    <div className="mb-6">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 text-white">
                            <div className="relative">
                                <span className="relative z-10 block">
                                    <TypingText text={section.title} speed={80} />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 blur-2xl opacity-50"></div>
                            </div>
                        </h1>
                    </div>
                    
                    {/* Sous-titre */}
                    <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed font-light max-w-3xl">
                            {section.subtitle}
                        </p>
                    </div>
                    
                    {/* Description */}
                    {section.content && (
                        <div className="mb-12 animate-slide-up" style={{ animationDelay: '1.2s' }}>
                            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-normal max-w-3xl mx-auto">
                                {section.content}
                            </p>
                        </div>
                    )}
                    
                    {/* Boutons d'action - design épuré */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-slide-up" style={{ animationDelay: '1.6s' }}>
                        {section.buttonText && (
                            <button
                                onClick={() => {
                                    if (section.buttonLink?.startsWith('/')) {
                                        const page = section.buttonLink.replace('/', '') as Page;
                                        onNavigate(page);
                                    }
                                }}
                                className="group relative px-8 py-3 bg-stone-900 text-white rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-stone-900/30 hover:scale-105"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {section.buttonText}
                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        )}
                        
                        <button
                            onClick={() => onNavigate('workshops')}
                            className="group relative px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg text-sm font-semibold uppercase tracking-wide hover:bg-white/20 hover:border-white/30 hover:scale-105 transition-all duration-300"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Artisans Inscrits
                            </span>
                        </button>
                    </div>
                    
                    {/* Indicateur de scroll discret */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Découvrir</span>
                            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ContentSectionView: React.FC<{ section: ContentSection; index: number }> = ({ section, index }) => {
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const bgStyle = section.backgroundColor ? { backgroundColor: section.backgroundColor } : {};
    const textStyle = section.textColor ? { color: section.textColor } : {};

    // Classes CSS dynamiques basées sur les options
    const getPaddingClass = () => {
        switch (section.paddingSize) {
            case 'small': return 'py-8';
            case 'large': return 'py-20';
            case 'extra-large': return 'py-24';
            case 'huge': return 'py-32';
            default: return 'py-16';
        }
    };

    const getBorderRadiusClass = () => {
        switch (section.borderRadius) {
            case 'none': return 'rounded-none';
            case 'small': return 'rounded-lg';
            case 'large': return 'rounded-3xl';
            case 'full': return 'rounded-full';
            case 'custom': return 'rounded-2xl';
            default: return 'rounded-2xl';
        }
    };

    const getShadowClass = () => {
        switch (section.shadowIntensity) {
            case 'none': return '';
            case 'light': return 'shadow-lg';
            case 'heavy': return 'shadow-2xl';
            case 'dramatic': return 'shadow-2xl shadow-orange-500/20';
            default: return 'shadow-xl';
        }
    };

    const getAnimationClass = () => {
        if (!isInView) return 'opacity-0';
        switch (section.animationType) {
            case 'slide': return 'animate-slide-in-up';
            case 'zoom': return 'animate-zoom-in';
            case 'bounce': return 'animate-bounce-in';
            case 'flip': return 'animate-flip-in';
            case 'rotate': return 'animate-rotate-in';
            case 'elastic': return 'animate-elastic-in';
            case 'fade': 
            default: return 'animate-fade-in-up';
        }
    };

    const getAnimationSpeedClass = () => {
        switch (section.animationSpeed) {
            case 'slow': return 'duration-700';
            case 'fast': return 'duration-300';
            case 'medium': 
            default: return 'duration-500';
        }
    };

    const getMaxWidthClass = () => {
        switch (section.maxWidth) {
            case 'sm': return 'max-w-2xl';
            case 'md': return 'max-w-4xl';
            case 'lg': return 'max-w-6xl';
            case 'xl': return 'max-w-7xl';
            case '2xl': return 'max-w-8xl';
            case 'full': return 'max-w-full';
            case 'custom': 
            case 'none': 
            default: return '';
        }
    };

    const getImageSizeClass = () => {
        switch (section.imageSize) {
            case 'small': return 'max-h-64';
            case 'medium': return 'max-h-96';
            case 'large': return 'max-h-[500px]';
            case 'extra-large': return 'max-h-[600px]';
            case 'full': return 'max-h-[800px]';
            default: return 'max-h-[500px]';
        }
    };

    const getImageFilterClass = () => {
        switch (section.imageFilter) {
            case 'grayscale': return 'grayscale';
            case 'sepia': return 'sepia';
            case 'blur': return 'blur-sm';
            case 'brightness': return 'brightness-110';
            case 'contrast': return 'contrast-110';
            case 'saturate': return 'saturate-110';
            default: return '';
        }
    };

    const getBorderClass = () => {
        switch (section.imageBorder) {
            case 'none': return 'border-0';
            case 'thin': return 'border';
            case 'medium': return 'border-2';
            case 'thick': return 'border-4';
            case 'rounded': return 'border-2 rounded-xl';
            default: return 'border-2';
        }
    };

    const getShadowImageClass = () => {
        switch (section.imageShadow) {
            case 'none': return '';
            case 'soft': return 'shadow-md';
            case 'medium': return 'shadow-lg';
            case 'hard': return 'shadow-xl';
            case 'glow': return 'shadow-lg shadow-orange-500/30';
            default: return 'shadow-lg';
        }
    };

    const getHoverEffectClass = () => {
        switch (section.imageHoverEffect) {
            case 'none': return '';
            case 'zoom': return 'group-hover:scale-105';
            case 'pan': return 'group-hover:scale-110 group-hover:translate-x-2';
            case 'tilt': return 'group-hover:rotate-1';
            case 'fade': return 'group-hover:opacity-80';
            case 'slide': return 'group-hover:translate-y-[-4px]';
            default: return 'group-hover:scale-105';
        }
    };

    const getTitleFontClass = () => {
        switch (section.titleFont) {
            case 'serif': return 'font-serif';
            case 'sans-serif': return 'font-sans';
            case 'display': return 'font-display';
            case 'handwritten': return 'font-handwriting';
            case 'monospace': return 'font-mono';
            default: return '';
        }
    };

    const getTitleSizeClass = () => {
        switch (section.titleSize) {
            case 'small': return 'text-2xl sm:text-3xl';
            case 'medium': return 'text-3xl sm:text-4xl';
            case 'large': return 'text-4xl sm:text-6xl';
            case 'extra-large': return 'text-5xl sm:text-7xl';
            case 'huge': return 'text-6xl sm:text-8xl';
            case 'massive': return 'text-7xl sm:text-9xl';
            default: return 'text-3xl sm:text-5xl';
        }
    };

    const getTitleWeightClass = () => {
        switch (section.titleWeight) {
            case 'light': return 'font-light';
            case 'normal': return 'font-normal';
            case 'medium': return 'font-medium';
            case 'semibold': return 'font-semibold';
            case 'bold': return 'font-bold';
            case 'black': return 'font-black';
            default: return 'font-black';
        }
    };

    const getTitleStyleClass = () => {
        switch (section.titleStyle) {
            case 'italic': return 'italic';
            case 'oblique': return 'italic';
            case 'normal': 
            default: return '';
        }
    };

    const getAlignmentClass = () => {
        switch (section.contentAlignment) {
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            case 'justify': return 'text-justify';
            case 'left': 
            default: return 'text-left';
        }
    };

    const imagePosition = section.imagePosition || 'left';
    const isImageLeft = imagePosition === 'left';
    const isImageRight = imagePosition === 'right';
    const isImageTop = imagePosition === 'top';
    const isImageCenter = imagePosition === 'center';
    const isImageOverlay = imagePosition === 'background';

    // Calcul des dimensions du conteneur image
    const getImageContainerWidth = () => {
        if (isImageTop || isImageCenter) return 'w-full';
        if (section.imageSize === 'full' || section.imageSize === 'extra-large') return 'md:w-4/5';
        return 'md:w-3/5';
    };

    const getTextContainerWidth = () => {
        if (!section.imageUrl || isImageTop || isImageCenter) return 'max-w-4xl mx-auto';
        if (section.imageSize === 'full' || section.imageSize === 'extra-large') return 'md:w-1/5';
        return 'md:w-2/5';
    };

    return (
        <section 
            ref={sectionRef}
            className={`${getPaddingClass()} px-6 flex flex-col ${isImageTop ? 'gap-8' : 'md:flex-row'} gap-12 sm:gap-16 mb-16 bg-white border border-slate-50 items-center ${getAlignmentClass()} relative overflow-hidden group ${getAnimationClass()} ${getAnimationSpeedClass()}`}
            style={{ 
                ...bgStyle, 
                animationDelay: `${index * 100}ms`,
                background: index % 2 === 1 ? 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)' : undefined
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {section.imageUrl && !isImageOverlay && (
                <div className={`w-full ${isImageTop ? 'order-first' : isImageLeft ? `${getImageContainerWidth()} md:order-first` : isImageRight ? `${getImageContainerWidth()} md:order-last` : getImageContainerWidth()} flex justify-center ${isInView ? 'animate-slide-in-left' : 'opacity-0 -translate-x-10'}`} style={{ animationDelay: `${index * 100 + 200}ms` }}>
                    <div className={`w-full overflow-hidden ${getBorderRadiusClass()} ${getShadowClass()} ${getBorderClass()} ${getShadowImageClass()} border-slate-100 group ${getMaxWidthClass()} ${getHoverEffectClass()} transition-all duration-500`}>
                        <div className="relative w-full">
                            <img
                                src={section.imageUrl}
                                alt={section.imageAlt || section.title}
                                title={section.imageTitle || section.title}
                                className={`w-full ${section.imageFit === 'contain' ? 'h-auto object-contain bg-gray-50' : section.imageFit === 'fill' ? 'h-auto object-fill' : section.imageFit === 'scale-down' ? 'h-auto object-scale-down' : section.imageFit === 'none' ? 'h-auto object-none' : 'h-auto object-cover'} ${getImageSizeClass()} ${getImageFilterClass()} ${getHoverEffectClass()} transition-all duration-700`}
                                style={{ 
                                    opacity: section.imageOpacity || 1,
                                    maxHeight: section.imageSize === 'full' ? '800px' : section.imageSize === 'extra-large' ? '700px' : section.imageSize === 'large' ? '600px' : '500px',
                                    minHeight: section.imageSize === 'full' ? '600px' : section.imageSize === 'extra-large' ? '500px' : '400px'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {section.imageCaption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-sm font-medium">{section.imageCaption}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {isImageOverlay && section.imageUrl && (
                <div className="absolute inset-0 z-0">
                    <img
                        src={section.imageUrl}
                        alt={section.imageAlt || section.title}
                        className="w-full h-full object-cover"
                        style={{ opacity: (section.imageOpacity || 1) * 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70"></div>
                </div>
            )}
            
            <div className={`w-full space-y-6 ${getTextContainerWidth()} ${section.imageUrl && !isImageTop && !isImageOverlay ? (isImageLeft ? 'md:px-8 md:order-last' : 'md:px-8 md:order-first') : 'max-w-4xl mx-auto'} ${isInView ? 'animate-slide-in-right' : 'opacity-0 translate-x-10'} ${isImageOverlay ? 'relative z-10' : ''}`} style={{ animationDelay: `${index * 100 + 400}ms` }}>
                <h2 className={`${getTitleSizeClass()} ${getTitleWeightClass()} ${getTitleFontClass()} ${getTitleStyleClass()} tracking-tighter leading-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-orange-900 to-amber-900 ${getAlignmentClass()}`} style={textStyle}>
                    {section.title}
                </h2>
                
                {section.subtitle && (
                    <p className={`text-xl font-semibold opacity-80 ${getAlignmentClass()}`} style={textStyle}>
                        {section.subtitle}
                    </p>
                )}
                
                <p className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium opacity-70 ${getAlignmentClass()}`} style={textStyle}>
                    {section.content}
                </p>
                
                <div className="pt-4">
                    <div className={`h-1 w-20 bg-gradient-to-r from-orange-600 to-amber-600 rounded-full ${section.contentAlignment === 'center' ? 'mx-auto' : section.contentAlignment === 'right' ? 'ml-auto' : ''}`}></div>
                </div>
            </div>
        </section>
    );
};

const PublicHome: React.FC<PublicHomeProps> = ({ onNavigate }) => {
    const [sections, setSections] = useState<ContentSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cmsSections = getPublicContent();
        setSections(cmsSections);
        setIsLoading(false);
    }, []);

    // Default sections if CMS is empty
    const defaultSections: ContentSection[] = [
        {
            id: 'default-hero',
            type: 'hero',
            title: 'MMV Couture - L\'Excellence Africaine',
            subtitle: 'Des créations uniques qui célèbrent votre identité',
            content: 'Découvrez des ateliers de couture d\'exception et des modèles qui racontent votre histoire.',
            buttonText: 'Découvrir',
            buttonLink: '/workshops',
            order: 1,
            isActive: true,
            targetAudience: 'public',
        },
    ];

    const displaySections = sections.length > 0 ? sections : defaultSections;

    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto py-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-orange-900 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-8">
            {displaySections.map((section, index) => {
                switch(section.type) {
                    case 'hero': return <HeroSection key={section.id} section={section} onNavigate={onNavigate} />;
                    case 'workshop-search': return <WorkshopSearch key={section.id} onNavigate={onNavigate} />;
                    case 'content': return <ContentSectionView key={section.id} section={section} index={index} />;
                    default: return <ContentSectionView key={section.id} section={section} index={index} />;
                }
            })}
            
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    33% {
                        transform: translateY(-20px) rotate(120deg);
                    }
                    66% {
                        transform: translateY(10px) rotate(240deg);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .animate-slide-in-left {
                    animation: slide-in-left 0.8s ease-out forwards;
                }
                
                .animate-slide-in-right {
                    animation: slide-in-right 0.8s ease-out forwards;
                }
                
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
                
                .animate-float {
                    animation: float 20s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default PublicHome;

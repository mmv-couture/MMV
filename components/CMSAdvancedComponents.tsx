import React, { useState, useEffect, useRef } from 'react';
import { ContentSection } from '../utils/cmsSystem';
import { Page } from '../types';
import { 
  GalleryImage, 
  GallerySettings, 
  VideoContent, 
  TestimonialSection,
  FaqSection,
  TeamSection,
  StatisticsSection,
  TimelineSection,
  LogoSection,
  DownloadSection,
  PricingSection,
  MapSection,
  CountdownTimer,
  NewsletterSection,
  ContactForm,
  DynamicSection,
  IntegrationSection
} from '../types/cms-advanced';

// Composant de galerie d'images avancé
interface GallerySectionProps {
  section: ContentSection;
  images: GalleryImage[];
  settings: GallerySettings;
}

const GallerySection: React.FC<GallerySectionProps> = ({ section, images, settings }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + images.length) % images.length
      : (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const renderGalleryLayout = () => {
    switch (settings.layout) {
      case 'grid':
        return (
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${settings.columns || 3}, 1fr)` }}>
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(image, index)}
              >
                <img
                  src={image.thumbnail || image.url}
                  alt={image.alt || image.title}
                  className="w-full h-48 object-cover"
                  loading={settings.enableLazyLoad ? 'lazy' : 'eager'}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        );

      case 'masonry':
        return (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid mb-4 overflow-hidden rounded-lg cursor-pointer group hover:scale-105 transition-transform duration-300"
                onClick={() => openLightbox(image, index)}
              >
                <img
                  src={image.thumbnail || image.url}
                  alt={image.alt || image.title}
                  className="w-full object-cover"
                  style={{ height: `${Math.random() * 200 + 200}px` }}
                  loading={settings.enableLazyLoad ? 'lazy' : 'eager'}
                />
              </div>
            ))}
          </div>
        );

      case 'carousel':
        return (
          <div className="relative overflow-hidden rounded-lg">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <div key={image.id} className="w-full flex-shrink-0">
                  <img
                    src={image.url}
                    alt={image.alt || image.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              ))}
            </div>
            {settings.showNavigation && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {section.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>
        )}
        {renderGalleryLayout()}
        
        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={closeLightbox}>
            <div className="relative max-w-4xl max-h-screen p-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || selectedImage.title}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Composant de témoignages avancé
const TestimonialsSection: React.FC<{ section: ContentSection; testimonials: TestimonialSection }> = ({ section, testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.autoRotate) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.testimonials.length);
      }, testimonials.interval || 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.autoRotate, testimonials.interval, testimonials.testimonials.length]);

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {section.title && (
          <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
        )}
        
        {testimonials.layout === 'carousel' ? (
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {testimonials.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                      {testimonials.showAvatars && testimonial.avatar && (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4"
                        />
                      )}
                      <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                      {testimonials.showRating && testimonial.rating && (
                        <div className="flex justify-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        {testimonial.role && <p className="text-gray-600">{testimonial.role}</p>}
                        {testimonial.company && <p className="text-gray-500">{testimonial.company}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {testimonials.showNavigation && (
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6">
                {testimonials.showAvatars && testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mb-4"
                  />
                )}
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  {testimonial.role && <p className="text-gray-600">{testimonial.role}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Composant de FAQ avancé
const FaqSectionComponent: React.FC<{ section: ContentSection; faq: FaqSection }> = ({ section, faq }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      if (!faq.expandMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredItems = faq.items.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {section.title && (
          <h2 className="text-3xl font-bold text-center mb-8">{section.title}</h2>
        )}
        
        {faq.searchable && (
          <div className="mb-8">
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        )}
        
        {faq.layout === 'accordion' ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{item.question}</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${openItems.has(item.id) ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openItems.has(item.id) && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <p className="text-gray-700">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Composant de compteur statistique
const StatisticsSectionComponent: React.FC<{ section: ContentSection; stats: StatisticsSection }> = ({ section, stats }) => {
  const [visibleStats, setVisibleStats] = useState<Set<string>>(new Set());
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleStats((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.5 }
    );

    const statElements = statsRef.current?.querySelectorAll('[data-stat-id]');
    statElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const AnimatedNumber: React.FC<{ value: number; prefix?: string; suffix?: string; duration?: number }> = ({ 
    value, 
    prefix = '', 
    suffix = '', 
    duration = 2000 
  }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const statId = useRef(`stat-${Math.random()}`);

    useEffect(() => {
      if (visibleStats.has(statId.current)) {
        const startTime = Date.now();
        const endTime = startTime + duration;

        const updateValue = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / duration, 1);
          const currentValue = Math.floor(progress * value);
          setDisplayValue(currentValue);

          if (progress < 1) {
            requestAnimationFrame(updateValue);
          }
        };

        requestAnimationFrame(updateValue);
      }
    }, [visibleStats, value, duration]);

    return (
      <span data-stat-id={statId.current}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <section className="py-16 px-6 bg-gradient-to-br from-orange-50 to-amber-50" ref={statsRef}>
      <div className="max-w-6xl mx-auto">
        {section.title && (
          <h2 className="text-3xl font-bold text-center mb-12">{section.title}</h2>
        )}
        
        <div className={`grid ${stats.layout === 'grid' ? 'md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'} gap-8`}>
          {stats.statistics.map((stat) => (
            <div key={stat.id} className="text-center">
              {stats.showIcons && stat.icon && (
                <div className="text-4xl mb-4">{stat.icon}</div>
              )}
              <div className="text-4xl font-bold text-orange-600 mb-2">
                <AnimatedNumber 
                  value={typeof stat.value === 'number' ? stat.value : 0} 
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  duration={stat.duration}
                />
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
              {stat.description && (
                <div className="text-gray-600">{stat.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Export de tous les composants avancés
export {
  GallerySection,
  TestimonialsSection,
  FaqSectionComponent,
  StatisticsSectionComponent,
};

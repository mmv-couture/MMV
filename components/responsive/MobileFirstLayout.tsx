import React, { useEffect, useState } from 'react';
import { useResponsive } from '../../hooks/useMobileDetection';

interface MobileFirstLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  bottomNav?: React.ReactNode;
  sideNav?: React.ReactNode;
  showSideNavOn?: 'tablet' | 'desktop';
  safeArea?: boolean;
}

/**
 * MobileFirstLayout - Layout structure optimisée pour mobile
 * - Mobile: Bottom nav + fullwidth content
 * - Tablet: Side nav appear + content
 * - Desktop: Traditional sidebar layout
 */
export const MobileFirstLayout: React.FC<MobileFirstLayoutProps> = ({
  children,
  header,
  bottomNav,
  sideNav,
  showSideNavOn = 'desktop',
  safeArea = true
}) => {
  const screen = useResponsive();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (screen.isMobile) {
      setIsSideNavOpen(false);
    }
  }, [screen.isMobile]);

  const showSidebar = showSideNavOn === 'tablet' ? !screen.isMobile : screen.isDesktop;

  return (
    <div
      className={`
        flex h-screen w-screen flex-col lg:flex-row
        ${safeArea ? 'safe-all' : ''}
      `}
    >
      {/* Header - fixe au top sur tous les appareils */}
      {header && (
        <div className="fixed top-0 left-0 right-0 z-40 lg:relative lg:w-full">
          {header}
        </div>
      )}

      {/* Side Navigation - visible sur desktop/tablet seulement */}
      {sideNav && showSidebar && (
        <aside className="hidden lg:flex lg:flex-col w-64 bg-stone-50 dark:bg-stone-900 border-r border-gray-200 dark:border-stone-700 overflow-y-auto">
          {sideNav}
        </aside>
      )}

      {/* Burger menu button pour mobile (visible seulement si sideNav existe) */}
      {sideNav && screen.isMobile && (
        <button
          onClick={() => setIsSideNavOpen(!isSideNavOpen)}
          className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-stone-800"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Mobile Side Menu Overlay */}
      {sideNav && isSideNavOpen && screen.isMobile && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSideNavOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-stone-900 z-50 overflow-y-auto">
            {sideNav}
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <main
        className={`
          flex-1 overflow-y-auto
          ${header ? 'mt-16 lg:mt-0' : ''}
          ${bottomNav && screen.isMobile ? 'pb-20' : ''}
        `}
      >
        {children}
      </main>

      {/* Bottom Navigation - visible sur mobile seulement */}
      {bottomNav && screen.isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40">
          {bottomNav}
        </div>
      )}
    </div>
  );
};

interface ScrollableAreaProps {
  children: React.ReactNode;
  className?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  scrollToTop?: boolean;
}

/**
 * ScrollableArea - Wrapper pour les zones scrollables optimisées
 * Utilise momentum scrolling et GPU acceleration
 */
export const ScrollableArea: React.FC<ScrollableAreaProps> = ({
  children,
  className = '',
  onScroll,
  scrollToTop = false
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollToTop && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [scrollToTop]);

  return (
    <div
      ref={scrollRef}
      className={`
        overflow-y-auto
        -webkit-overflow-scrolling touch
        ${className}
      `}
      onScroll={onScroll}
    >
      {children}
    </div>
  );
};

interface ResponsiveContentProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'compact' | 'normal' | 'spacious';
  centered?: boolean;
}

/**
 * ResponsiveContent - Wrapper de contenu responsive optimal
 */
export const ResponsiveContent: React.FC<ResponsiveContentProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'normal',
  centered = true
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'w-full'
  };

  const paddingClasses = {
    none: 'px-0 py-0',
    compact: 'px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6',
    normal: 'px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8',
    spacious: 'px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-12'
  };

  return (
    <div
      className={`
        ${maxWidthClasses[maxWidth]}
        ${paddingClasses[padding]}
        ${centered ? 'mx-auto' : ''}
        w-full
      `}
    >
      {children}
    </div>
  );
};

interface MobileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  fullscreen?: boolean;
}

/**
 * MobileDialog - Full modal optimisé pour mobile
 */
export const MobileDialog: React.FC<MobileDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  fullscreen = false
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`
          fixed z-50 bg-white dark:bg-stone-900
          flex flex-col
          ${fullscreen ? 'inset-0 rounded-none' : 'inset-4 rounded-2xl max-h-[90vh] md:max-h-[80vh]'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-stone-700">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-stone-800 rounded-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="border-t border-gray-200 dark:border-stone-700 px-6 py-4 flex gap-3 justify-end">
            {actions}
          </div>
        )}
      </div>
    </>
  );
};

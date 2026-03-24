import React, { useEffect, useState } from 'react';

interface BottomNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick: () => void;
}

interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeId?: string;
  showOn?: 'mobile' | 'always';
}

/**
 * BottomNavigation - Navigation en bas d'écran pour mobile
 * Pattern mobile standard : accessible au pouce sans contorsion
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeId,
  showOn = 'mobile'
}) => {
  const showClass = showOn === 'mobile' ? 'md:hidden' : '';

  return (
    <>
      {/* Spacer pour éviter que le contenu soit caché sous la nav */}
      <div className={`h-20 ${showClass}`} />

      {/* Navigation fixe en bas */}
      <nav
        className={`
          fixed bottom-0 left-0 right-0
          bg-white dark:bg-stone-900
          border-t border-gray-200 dark:border-stone-700
          z-50
          ${showClass}
        `}
      >
        <div className="flex justify-around items-stretch h-20 max-w-lg mx-auto lg:max-w-full">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1
                relative
                transition-colors
                ${
                  activeId === item.id
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-600 dark:text-stone-400 hover:text-orange-600'
                }
              `}
              aria-label={item.label}
              title={item.label}
            >
              <div className="relative w-6 h-6">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium leading-none">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[]; // Heights in pixels or percentages
}

/**
 * BottomSheet - Modal qui glisse du bas
 * Super pour les actions/filtres sur mobile
 */
export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [200, 400, window.innerHeight * 0.9]
}) => {
  const [translateY, setTranslateY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      setIsAnimating(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY;

      if (diff > 0) {
        setTranslateY(diff);
      }
    };

    const handleTouchEnd = () => {
      if (translateY > 100) {
        onClose();
      } else {
        setTranslateY(0);
      }
      setIsAnimating(false);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, translateY, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        style={{ animation: isOpen ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-out' }}
      />

      {/* Sheet */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50
          bg-white dark:bg-stone-900
          rounded-t-3xl
          max-h-screen overflow-hidden
          flex flex-col
        `}
        style={{
          transform: isAnimating ? `translateY(${translateY}px)` : 'translateY(0)',
          transition: isAnimating ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-stone-700">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * MobileMenu - Menu sidebar qui glisse depuis le côté (mobile)
 */
export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`
          fixed left-0 top-0 bottom-0 w-3/4 max-w-xs
          bg-white dark:bg-stone-900
          z-50
          transition-transform duration-300
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {children}
      </div>
    </>
  );
};

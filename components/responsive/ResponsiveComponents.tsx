import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  mobileSize?: string;  // e.g., "320px"
  tabletSize?: string;  // e.g., "768px"
  desktopSize?: string; // e.g., "1280px"
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
}

/**
 * ResponsiveImage - Images optimisées pour tous les appareils
 * Charge différentes résolutions selon le device
 * Utilise WebP quand possible pour meilleure perf
 */
export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  mobileSize = '320px',
  tabletSize = '768px',
  desktopSize = '1280px',
  className = 'w-full h-auto',
  priority = false,
  onLoad,
  onClick
}) => {
  const getResponsiveSrc = (baseSrc: string, size: string) => {
    // If using a CDN with query params, add size param
    const separator = baseSrc.includes('?') ? '&' : '?';
    return `${baseSrc}${separator}w=${size.replace('px', '')}`;
  };

  const baseSrc = src.split('?')[0];

  return (
    <picture>
      {/* Mobile: small image */}
      <source
        media="(max-width: 640px)"
        srcSet={getResponsiveSrc(baseSrc, mobileSize)}
        type="image/webp"
      />
      {/* Tablet: medium image */}
      <source
        media="(max-width: 1024px)"
        srcSet={getResponsiveSrc(baseSrc, tabletSize)}
        type="image/webp"
      />
      {/* Desktop: full image */}
      <source srcSet={getResponsiveSrc(baseSrc, desktopSize)} type="image/webp" />

      {/* Fallback */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={onLoad}
        onClick={onClick}
        decoding="async"
      />
    </picture>
  );
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'full' | 'padded' | 'centered';
}

/**
 * ResponsiveContainer - wrapper avec padding/margin responsive
 * Gère les safe areas et le responsive padding automatiquement
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  variant = 'padded'
}) => {
  const variantClasses = {
    full: 'w-full',
    padded: 'w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8',
    centered: 'w-full max-w-4xl mx-auto px-4 sm:px-6'
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: 'auto' | 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ResponsiveGrid - Grille automatiquement responsive
 * 1 colonne sur mobile, 2 sur tablet, 3+ sur desktop
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = 'auto',
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3 md:gap-4',
    md: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8'
  };

  const columnClasses = {
    auto: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    1: 'grid grid-cols-1',
    2: 'grid grid-cols-1 sm:grid-cols-2',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  const gridClass = typeof columns === 'number' ? columnClasses[columns] : columnClasses.auto;

  return (
    <div className={`${gridClass} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ResponsiveStack - Empile les éléments verticalement sur mobile,
 * horizontalement sur desktop
 */
export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = 'vertical',
  gap = 'md',
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8'
  };

  const directionClasses = {
    vertical: 'flex flex-col md:flex-row',
    horizontal: 'flex flex-col sm:flex-row'
  };

  return (
    <div className={`${directionClasses[direction]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
};

interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

/**
 * TouchButton - Bouton optimisé pour touch (44px minimum)
 * Feedback haptic sur mobile
 */
export const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback sur mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      props.onClick?.(e);
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-10',
      md: 'px-4 py-3 text-base min-h-12',
      lg: 'px-6 py-4 text-lg min-h-14'
    };

    const variantClasses = {
      primary: 'bg-orange-600 hover:bg-orange-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };

    return (
      <button
        ref={ref}
        className={`
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          rounded-lg font-medium transition-colors
          active:scale-95 disabled:opacity-50
          ${loading ? 'opacity-75 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={loading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {loading ? '...' : children}
      </button>
    );
  }
);

TouchButton.displayName = 'TouchButton';

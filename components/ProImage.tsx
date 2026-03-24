import React, { useState } from 'react';

interface ProImageProps {
  src: string;
  alt: string;
  aspectRatio?: '3/4' | '4/3' | '16/9' | '1/1' | '2/3' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  className?: string;
  onClick?: () => void;
  showOnHover?: boolean;
  height?: string;
}

const ProImage: React.FC<ProImageProps> = ({
  src,
  alt,
  aspectRatio = '3/4',
  objectFit = 'contain',
  className = '',
  onClick,
  showOnHover = true,
  height = 'auto',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate PT-based aspect ratio classes
  const aspectRatioClasses: Record<string, string> = {
    '3/4': 'pt-[133.33%]',
    '4/3': 'pt-[75%]',
    '16/9': 'pt-[56.25%]',
    '1/1': 'pt-[100%]',
    '2/3': 'pt-[150%]',
    'auto': '',
  };

  const objectFitClasses: Record<string, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    'scale-down': 'object-scale-down',
  };

  const ptClass = aspectRatioClasses[aspectRatio];
  const objClass = objectFitClasses[objectFit];

  if (hasError) {
    return (
      <div
        className={`w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded overflow-hidden ${aspectRatio === 'auto' ? '' : 'relative'} ${className}`}
        style={aspectRatio === 'auto' ? { minHeight: height } : {}}
      >
        <div className="text-center text-slate-400">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">Image non disponible</p>
        </div>
      </div>
    );
  }

  if (aspectRatio === 'auto') {
    return (
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        onClick={onClick}
        className={`w-full h-auto ${objClass} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        style={{ minHeight: height }}
      />
    );
  }

  return (
    <div
      className={`relative w-full ${ptClass} overflow-hidden rounded-lg bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-colors ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`absolute inset-0 w-full h-full ${objClass} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${onClick ? (showOnHover ? 'group-hover:drop-shadow-lg' : '') : ''}`}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ProImage;

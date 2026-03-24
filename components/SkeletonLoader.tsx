import React from 'react';

interface SkeletonLoaderProps {
  /** Nombre de lignes du skeleton */
  lines?: number;
  /** Type de skeleton */
  type?: 'text' | 'card' | 'table' | 'list' | 'header';
  /** Hauteur des lignes en pixels */
  lineHeight?: number;
  /** Largeur personnalisée */
  width?: string | number;
  /** If true, show animated pulse */
  animated?: boolean;
}

/**
 * Skeleton Loader - Placeholder pendant le chargement
 * Remplace les "Chargement..." génériques
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  type = 'text',
  lineHeight = 16,
  width = '100%',
  animated = true
}) => {
  const baseClass = `${animated ? 'animate-pulse' : ''} rounded`;
  const bgClass = 'bg-stone-200 dark:bg-stone-700';

  if (type === 'header') {
    return (
      <div className="space-y-4 mb-8">
        <div className={`h-10 ${bgClass} ${baseClass} w-2/3`}></div>
        <div className={`h-5 ${bgClass} ${baseClass} w-1/2`}></div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={`p-4 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3`}>
        <div className={`h-20 ${bgClass} ${baseClass}`}></div>
        <div className={`h-4 ${bgClass} ${baseClass} w-5/6`}></div>
        <div className={`h-4 ${bgClass} ${baseClass} w-4/5`}></div>
        <div className={`h-8 ${bgClass} ${baseClass} w-1/3 mt-4`}></div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-8 ${bgClass} ${baseClass} flex-1`}></div>
          ))}
        </div>
        {/* Rows */}
        {[...Array(5)].map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4">
            {[0, 1, 2, 3].map(colIdx => (
              <div key={colIdx} className={`h-12 ${bgClass} ${baseClass} flex-1`}></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex gap-4 items-center p-3 rounded border border-stone-200 dark:border-stone-700">
            <div className={`h-12 w-12 rounded-lg ${bgClass} ${baseClass} flex-shrink-0`}></div>
            <div className="flex-1 space-y-2">
              <div className={`h-4 ${bgClass} ${baseClass} w-2/3`}></div>
              <div className={`h-3 ${bgClass} ${baseClass} w-1/2`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default text type
  return (
    <div className={`space-y-${Math.max(2, Math.min(4, lines))}`}>
      {[...Array(lines)].map((_, idx) => {
        const isLastLine = idx === lines - 1;
        const w = isLastLine ? '75%' : '100%';
        return (
          <div
            key={idx}
            className={`h-${lineHeight} ${bgClass} ${baseClass}`}
            style={{ width: w }}
          ></div>
        );
      })}
    </div>
  );
};

export default SkeletonLoader;

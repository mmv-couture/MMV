import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'shimmer',
}) => {
  const variants = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'text' ? '100%' : undefined),
    height: height ?? (variant === 'text' ? '1em' : undefined),
  };

  return (
    <div
      className={`bg-gray-200 ${variants[variant]} ${animations[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton patterns
export const SkeletonCard: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1">
        <Skeleton width="60%" height={20} className="mb-2" />
        <Skeleton width="40%" height={16} />
      </div>
    </div>
    <Skeleton width="100%" height={80} className="mb-4" />
    <div className="flex gap-2">
      <Skeleton width={80} height={36} variant="rounded" />
      <Skeleton width={80} height={36} variant="rounded" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
    <div className="p-4 border-b border-gray-100">
      <Skeleton width={200} height={24} />
    </div>
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton width="30%" height={18} className="mb-2" />
            <Skeleton width="50%" height={14} />
          </div>
          <Skeleton width={80} height={24} variant="rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 bg-white rounded-xl border border-gray-100">
        <Skeleton width={80} height={14} className="mb-2" />
        <Skeleton width={120} height={32} />
      </div>
    ))}
  </div>
);

export default Skeleton;

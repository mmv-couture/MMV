import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
  overlay?: boolean;
}

/**
 * Material Design Loading Spinner
 * Inspired by Flutter's CircularProgressIndicator
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  fullScreen = false, 
  text, 
  overlay = true 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        
        {/* Spinning arc */}
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400"
          style={{
            animation: 'spin 1.5s linear infinite'
          }}
        ></div>
        
        {/* Secondary arc for depth */}
        <div 
          className="absolute inset-1 rounded-full border-2 border-transparent border-b-orange-300"
          style={{
            animation: 'spin 2s linear infinite reverse'
          }}
        ></div>
      </div>
      
      {text && (
        <p className={`${textSizeClasses[size]} font-medium text-gray-600 dark:text-gray-400 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${overlay ? 'bg-black/40 backdrop-blur-sm' : 'bg-transparent'}`}>
        {spinner}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

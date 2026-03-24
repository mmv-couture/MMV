import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
  border = true,
}) => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const shadows = {
    none: '',
    sm: 'shadow-card',
    md: 'shadow-soft',
    lg: 'shadow-elevated',
  };

  const classes = `
    bg-white rounded-2xl
    ${paddings[padding]}
    ${shadows[shadow]}
    ${border ? 'border border-gray-100' : ''}
    ${hover ? 'transition-all duration-200 hover:shadow-elevated hover:-translate-y-0.5' : ''}
    ${className}
  `.trim();

  return <div className={classes}>{children}</div>;
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, icon }) => (
  <div className="flex items-start justify-between mb-4">
    <div className="flex items-center gap-3">
      {icon && <div className="p-2 bg-primary-50 rounded-xl text-primary-500">{icon}</div>}
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

export default Card;

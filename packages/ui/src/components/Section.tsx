import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'none';
  background?: 'white' | 'gray' | 'navy' | 'transparent';
}

export const Section: React.FC<SectionProps> = ({
  children,
  spacing = 'md',
  background = 'transparent',
  className = '',
  ...props
}) => {
  const spacingStyles = {
    none: 'py-0',
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16 lg:py-20',
    lg: 'py-16 sm:py-24 lg:py-32',
  };

  const backgroundStyles = {
    white: 'bg-white text-navy-900',
    gray: 'bg-gray-50 text-navy-900',
    navy: 'bg-navy-950 text-white',
    transparent: '',
  };

  return (
    <section
      className={`${spacingStyles[spacing]} ${backgroundStyles[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
};

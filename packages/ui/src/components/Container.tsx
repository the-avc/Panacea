import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    narrow: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

import React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'display' | 'section' | 'subsection' | 'card';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  variant,
  as,
  className = '',
  ...props
}) => {
  const Component = (as || `h${level}`) as keyof JSX.IntrinsicElements;

  const defaultVariantByLevel: Record<number, string> = {
    1: 'font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-navy-950',
    2: 'font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-navy-950',
    3: 'font-display text-xl sm:text-2xl font-semibold text-navy-900',
    4: 'font-sans text-lg sm:text-xl font-semibold text-navy-900',
    5: 'font-sans text-base font-semibold text-navy-800',
    6: 'font-sans text-sm font-semibold uppercase tracking-wider text-navy-700',
  };

  const variantStyles = {
    display: 'font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-navy-950',
    section: 'font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-navy-950',
    subsection: 'font-display text-xl sm:text-2xl font-semibold text-navy-900',
    card: 'font-sans text-lg font-semibold text-navy-900',
  };

  const style = variant ? variantStyles[variant] : defaultVariantByLevel[level];

  return React.createElement(
    Component,
    {
      className: `${style} ${className}`,
      ...props,
    },
    children,
  );
};

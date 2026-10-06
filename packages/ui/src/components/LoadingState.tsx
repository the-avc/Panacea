import React from 'react';

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Loading...',
  className = '',
}) => {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        <div className="absolute h-full w-full rounded-full border-2 border-navy-200 opacity-25" />
        <div className="absolute h-full w-full rounded-full border-2 border-t-navy-900 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500">{label}</p>
      <span className="sr-only">{label}</span>
    </div>
  );
};

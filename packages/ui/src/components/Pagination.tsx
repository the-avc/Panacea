import React from 'react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 ${className}`}>
      {totalItems !== undefined && pageSize !== undefined && (
        <div className="text-xs text-gray-500">
          Showing <span className="font-medium text-navy-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
          <span className="font-medium text-navy-900">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{' '}
          of <span className="font-medium text-navy-900">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <span className="px-3 text-xs font-medium text-navy-800">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

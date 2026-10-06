import React from 'react';
import { Badge } from './Badge';

export type DataClassificationType = 'public' | 'internal' | 'confidential' | 'restricted';

export interface ClassificationBadgeProps {
  classification: DataClassificationType | string;
  className?: string;
}

const classificationMap: Record<
  string,
  { label: string; variant: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  public: { label: 'PUBLIC', variant: 'neutral' },
  internal: { label: 'INTERNAL', variant: 'info' },
  confidential: { label: 'CONFIDENTIAL', variant: 'warning' },
  restricted: { label: 'RESTRICTED', variant: 'danger' },
};

export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  classification,
  className = '',
}) => {
  const normalized = classification.toLowerCase();
  const config = classificationMap[normalized] || {
    label: classification.toUpperCase(),
    variant: 'neutral' as const,
  };

  return (
    <Badge
      variant={config.variant}
      size="sm"
      className={`tracking-wider font-mono font-bold text-[10px] ${className}`}
    >
      {config.label}
    </Badge>
  );
};

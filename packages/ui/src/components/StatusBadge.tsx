import React from 'react';
import { Badge } from './Badge';

export type CaseStatusType =
  | 'intake'
  | 'notice_drafting'
  | 'notice_served'
  | 'sec14_filing'
  | 'hearing_scheduled'
  | 'order_obtained'
  | 'possession_scheduled'
  | 'possession_taken'
  | 'closed';

export interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusMap: Record<
  string,
  { label: string; variant: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info' }
> = {
  intake: { label: 'Intake', variant: 'neutral' },
  notice_drafting: { label: 'Notice Drafting', variant: 'info' },
  notice_served: { label: 'Notice Served', variant: 'info' },
  sec14_filing: { label: 'Sec 14 Filing', variant: 'warning' },
  hearing_scheduled: { label: 'Hearing Scheduled', variant: 'warning' },
  order_obtained: { label: 'Order Obtained', variant: 'success' },
  possession_scheduled: { label: 'Possession Scheduled', variant: 'warning' },
  possession_taken: { label: 'Possession Taken', variant: 'success' },
  closed: { label: 'Closed', variant: 'neutral' },
  active: { label: 'Active', variant: 'success' },
  suspended: { label: 'Suspended', variant: 'danger' },
  archived: { label: 'Archived', variant: 'neutral' },
  disabled: { label: 'Disabled', variant: 'danger' },
  uploading: { label: 'Uploading', variant: 'info' },
  scanning: { label: 'Scanning', variant: 'warning' },
  available: { label: 'Available', variant: 'success' },
  quarantined: { label: 'Quarantined', variant: 'danger' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase();
  const config = statusMap[normalized] || {
    label: status.replace(/_/g, ' '),
    variant: 'neutral' as const,
  };

  return (
    <Badge variant={config.variant} className={className}>
      <span className="capitalize">{config.label}</span>
    </Badge>
  );
};

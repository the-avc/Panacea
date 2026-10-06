import React from 'react';

export interface SecurityNoticeProps {
  type?: 'legal' | 'confidentiality' | 'session' | 'warning';
  title?: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({
  type = 'legal',
  title,
  message,
  children,
  className = '',
}) => {
  const styles = {
    legal: {
      bg: 'bg-navy-50/70 border-navy-200 text-navy-900',
      iconColor: 'text-navy-700',
      defaultTitle: 'CONFIDENTIAL & PRIVILEGED INFORMATION',
      defaultMessage:
        'The information and records accessible through this system are confidential, legally privileged, and protected by applicable laws. Unauthorized access, disclosure, or distribution is strictly prohibited and subject to legal prosecution.',
    },
    confidentiality: {
      bg: 'bg-amber-50/70 border-amber-200 text-amber-950',
      iconColor: 'text-amber-700',
      defaultTitle: 'CLIENT CONFIDENTIALITY NOTICE',
      defaultMessage:
        'All client records, recovery dockets, borrower data, and investigation reports are confidential. Access is logged and monitored for compliance audits.',
    },
    session: {
      bg: 'bg-gray-50 border-gray-200 text-gray-900',
      iconColor: 'text-gray-600',
      defaultTitle: 'SESSION SECURITY NOTICE',
      defaultMessage:
        'For security compliance, inactive sessions are automatically terminated after 30 minutes. Always log out when completing operations.',
    },
    warning: {
      bg: 'bg-burgundy-50/70 border-burgundy-200 text-burgundy-950',
      iconColor: 'text-burgundy-700',
      defaultTitle: 'RESTRICTED ACCESS',
      defaultMessage:
        'This portal is strictly restricted to authorized institutional representatives and verified personnel.',
    },
  };

  const current = styles[type];

  return (
    <div
      role="note"
      className={`rounded-lg border p-4 text-xs leading-relaxed ${current.bg} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${current.iconColor}`}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold tracking-wider uppercase text-[11px] mb-1">
            {title || current.defaultTitle}
          </h4>
          <p className="opacity-90">{message || current.defaultMessage}</p>
          {children && <div className="mt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
};

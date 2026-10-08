import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security & Confidentiality',
  description:
    'Security architecture, client data isolation, and confidentiality commitments of Panacea Consultancy Private Limited.',
};

export default function SecurityConfidentialityPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Zero-Trust Architecture & Data Governance
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Institutional Security & Confidentiality Framework
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              In debt recovery and enforcement, confidentiality is not a feature—it is a statutory
              and fiduciary duty. Discover how Panacea safeguards institutional creditor records,
              loan dockets, borrower data, and institutional privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Security Principles */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Multi-Tenant Isolation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Client records and borrower portfolios are strictly segmented at the database and API
                layer. Institution A can never discover, query, or enumerate dockets belonging to
                Institution B.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Ephemeral Access Tokens
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Direct access to sensitive case PDFs and orders is strictly prohibited. Documents are
                retrieved solely via short-lived cryptographic signed URLs with a 5-minute time-to-live.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Mandatory MFA & Short Sessions
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Client portal access requires verified multi-factor authentication (TOTP or
                passkeys). Inactive sessions terminate after 30 minutes, and 15 minutes for admin roles.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Immutable Audit Trail
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Every login, status movement, document upload, view, and download generates an
                immutable audit event stamped with the user identity, IP address, and unique request ID.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Physical Docket Security
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Physical court records, certified orders, and postal acknowledgements are stored in
                fireproof locked archives with restricted biometric or dual-key custody.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Enforceable NDAs
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                All Panacea officers, field investigators, and operational staff are bound by
                legally binding Non-Disclosure Agreements with severe contractual and legal penalties
                for data leakage.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

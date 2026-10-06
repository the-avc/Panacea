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
              and fiduciary duty. Discover how Panacea safeguards banking data, case dockets, and
              client privacy.
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
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4">
                🔒
              </div>
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                Multi-Tenant Isolation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bank records and borrower portfolios are strictly segmented at the database and API
                layer. Institution A can never discover, query, or enumerate dockets belonging to
                Institution B.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4">
                🛡️
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
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4">
                🔑
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
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4">
                📜
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
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4">
                🏢
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
              <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-800 flex items-center justify-center font-bold text-sm mb-4">
                🤝
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

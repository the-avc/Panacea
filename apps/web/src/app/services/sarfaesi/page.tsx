import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SARFAESI Enforcement Services',
  description:
    'Dedicated statutory enforcement under the SARFAESI Act 2002. Demand notices u/s 13(2), Section 14 applications & orders, physical possession execution across Bihar, Jharkhand, and Chhattisgarh.',
};

export default function SarfaesiPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/services"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1 mb-4"
            >
              <span>← Back to Services Overview</span>
            </Link>
            <span className="block text-xs font-bold uppercase tracking-widest text-gold-400">
              Statutory Enforcement Vertical
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              SARFAESI Enforcement Procedures & Ground Execution
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Precision execution under the Securitisation and Reconstruction of Financial Assets
              and Enforcement of Security Interest Act, 2002. Navigating district magistracies,
              revenue hierarchies, and law enforcement agencies across Eastern India.
            </p>
          </div>
        </div>
      </section>

      {/* Structured 4-Stage Workflow */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
              Statutory Milestones
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
              The 4-Stage Enforcement Lifecycle
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Every stage is handled with formal legal rigor, maintaining a complete documentary
              trail for DRT defense and institutional audit scrutiny.
            </p>
          </div>

          <div className="space-y-8">
            {/* Stage 1 */}
            <div className="p-8 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-gold-400 font-bold text-xs">
                  1
                </span>
                <h3 className="font-display text-xl font-bold text-navy-950">
                  Section 13(2) Demand Notice Drafting & Proof of Service
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
                Preparation of precise 60-day demand notices under Section 13(2). We verify security
                interest details, outstanding dues, asset descriptions matching the mortgage deed,
                and borrower/guarantor identifications. Multi-channel dispatch via registered post
                with acknowledgement due (RPAD), speed post, and physical affixture with photographic
                dockets and newspaper publication management where required.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-8 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-gold-400 font-bold text-xs">
                  2
                </span>
                <h3 className="font-display text-xl font-bold text-navy-950">
                  Section 14 Petition Drafting, Verification & Filing
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
                Upon expiry of the statutory 60-day notice period without borrower satisfaction, our
                team drafts the formal application u/s 14 before the District Magistrate (DM) or Chief
                Metropolitan Magistrate (CMM). Includes drafting the mandatory 9-point affidavit
                conforming to the 2013 SARFAESI amendment, verifying compliance certificates, and
                docket submission before the appropriate collectorate.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-8 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-gold-400 font-bold text-xs">
                  3
                </span>
                <h3 className="font-display text-xl font-bold text-navy-950">
                  Section 14 Order Tracking & Obtaining
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
                Active administrative follow-up with the magistracy and revenue departments across
                districts in Bihar, Jharkhand, and Chhattisgarh. Resolving administrative queries,
                coordinating hearing dates, and securing certified orders directing police and
                executive magistrates to take physical possession of the mortgaged asset.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-8 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-gold-400 font-bold text-xs">
                  4
                </span>
                <h3 className="font-display text-xl font-bold text-navy-950">
                  Execution of Section 14 Orders & Physical Possession Handover
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl">
                On-site execution alongside deputed Executive Magistrates, Circle Officers, Court
                Receivers, and local police forces. Execution includes: comprehensive video
                recording, panchnama documentation, inventory listing of all movable goods, lawful
                eviction of unauthorized occupants, replacement of physical locks, deploying static
                security personnel, and formal physical handover of possession to the Authorised
                Officer of the client bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Portal Callout */}
      <section className="py-12 bg-navy-950 text-white border-t border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-display text-xl font-bold text-white">
              Track Active SARFAESI Enforcement Dockets
            </h4>
            <p className="mt-1 text-xs text-gray-300">
              Bank nodal officers can inspect filed Section 14 petitions, orders, and execution reports.
            </p>
          </div>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-gold-500 hover:bg-gold-600 px-5 py-2.5 text-xs font-semibold text-navy-950 shrink-0"
          >
            Access Secure Client Portal →
          </a>
        </div>
      </section>
    </div>
  );
}

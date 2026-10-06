import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Executive Leadership',
  description:
    'Board of Directors and executive leadership profile of Panacea Consultancy Private Limited. Mr. Prashant Kumar and Mrs. Anjana Singh.',
};

export default function LeadershipPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Board of Directors
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Executive Leadership & Operational Command
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Factual leadership credentials rooted in two decades of institutional recovery, legal
              diligence, and corporate governance.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Profiles */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mr. Prashant Kumar */}
            <div className="rounded-2xl border border-gray-200 bg-[#fbfcfd] p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center font-display text-2xl font-bold border border-gold-500/30">
                  PK
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy-950">
                    Mr. Prashant Kumar
                  </h2>
                  <p className="text-xs font-semibold text-burgundy-700 tracking-wide uppercase">
                    Managing Director
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                <p>
                  Mr. Prashant Kumar brings <strong>20 years of intensive professional experience</strong>{' '}
                  with India’s leading Non-Banking Financial Companies (NBFCs), Private Sector Banks,
                  and specialized recovery law firms.
                </p>
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-bold text-navy-950 uppercase text-[11px] mb-2">
                    Prior Institutional Engagements:
                  </h4>
                  <ul className="space-y-1.5 text-gray-600">
                    <li>· Magma Fincorp Ltd</li>
                    <li>· ARCIL-Arms (Asset Reconstruction Company India Ltd)</li>
                    <li>· HDFC Bank Limited</li>
                    <li>· Vidhi Associates Law Firm (as Partner)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-bold text-navy-950 uppercase text-[11px] mb-2">
                    Core Functional Domains:
                  </h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>· Debt Collection & Secured Asset Recovery Operations</li>
                    <li>· Para-Legal & Legal Procedural Execution</li>
                    <li>· Debt Recovery Tribunals (DRT) Coordination</li>
                    <li>· SARFAESI Enforcement (Sec 13.2, Sec 13.4, Sec 14)</li>
                    <li>· Lok Adalat Settlements & Conciliations</li>
                    <li>· Magisterial Order Executions & Police Coordination</li>
                    <li>· Commercial Arbitration Enforcement</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mrs. Anjana Singh */}
            <div className="rounded-2xl border border-gray-200 bg-[#fbfcfd] p-8 lg:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center font-display text-2xl font-bold border border-gold-500/30">
                  AS
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-navy-950">
                    Mrs. Anjana Singh
                  </h2>
                  <p className="text-xs font-semibold text-burgundy-700 tracking-wide uppercase">
                    Director
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
                <p>
                  Mrs. Anjana Singh serves as a Director on the Board of Panacea Consultancy Private
                  Limited, playing an integral role in strategic oversight, corporate ethics, and
                  long-term organizational direction.
                </p>
                <div className="p-4 rounded-lg bg-white border border-gray-200">
                  <h4 className="font-bold text-navy-950 uppercase text-[11px] mb-2">
                    Governance & Strategic Focus:
                  </h4>
                  <ul className="space-y-1.5 text-gray-600">
                    <li>· Organizational vision, ethical standards, and cultural alignment</li>
                    <li>· Review of internal governance and statutory compliance policies</li>
                    <li>· Supporting institutional client partnerships and corporate expansion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

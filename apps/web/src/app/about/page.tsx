import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Profile, organizational values, and operational capabilities of Panacea Consultancy Private Limited. Institutional enforcement partner for financial institutions across Eastern India.',
};

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Company Profile & Corporate Ethics
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Dedicated Ancillary Enforcement for Secured Creditors
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Panacea Consultancy Private Limited is a specialized corporate agency established to
              deliver lawful, professional, and ethical enforcement, para-legal execution, and
              investigation services for banks, housing finance companies, NBFCs, and asset
              reconstruction entities.
            </p>
          </div>
        </div>
      </section>

      {/* Core Facts & Ethics */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                Institutional Mandate
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Built on Confidentiality, Legal Discipline, and Integrity
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                In secured debt recovery and SARFAESI enforcement, institutional creditors require a
                ground partner who operates with utmost legal precision and discretion. Panacea
                Consultancy acts as a dedicated ancillary enforcement agency, ensuring that statutory
                notices, Section 14 filings, court appearances, and physical possession takeovers
                proceed strictly within the framework of Indian law.
              </p>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                We place paramount emphasis on protecting the brand equity of our institutional
                clients, safeguarding sensitive borrower records, and executing every recovery docket
                with transparency.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
                <div className="h-8 w-8 rounded-md bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-sm mb-3">
                  01
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Confidentiality</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Strict non-disclosure of private borrower details, loan dockets, and bank data.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
                <div className="h-8 w-8 rounded-md bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-sm mb-3">
                  02
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Data Security</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Isolated client repositories and strict digital and physical access governance.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
                <div className="h-8 w-8 rounded-md bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-sm mb-3">
                  03
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Integrity & Honesty</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Transparent docket progress reporting, lawful procedures, and zero compromise on ethics.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
                <div className="h-8 w-8 rounded-md bg-navy-100 text-navy-900 flex items-center justify-center font-bold text-sm mb-3">
                  04
                </div>
                <h3 className="text-sm font-bold text-navy-950 mb-1">Brand Protection</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Upholding the reputation and statutory standing of principal institutions in every engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Mission & Objectives (Directly from Corporate Profile) */}
      <section className="py-16 bg-navy-50/50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                Our Mission
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Transforming Debt Solutions & Protecting Client Equity
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
                Requirements for satisfying consumer needs, burdens of overdue debt, and the need for
                effective customer retention throw up never-ending challenges for any business.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                We believe in building long-lasting strategic relationships. We have sufficient experience
                and expertise needed to establish a mutually beneficial relationship between clients and
                their debtors whereby we assist our clients in recovering outstanding amounts owing by
                implementing the most efficient means possible, taking away anxiety off debt recovery issues,
                and allowing clients to focus on core business processes.
              </p>
              <div className="mt-6 p-4 rounded-xl border border-gold-500/30 bg-white text-xs text-navy-950">
                <span className="font-bold text-burgundy-900 block mb-1 uppercase tracking-wider">
                  Our Partnership Philosophy:
                </span>
                <em>
                  “Momentum Movement Forward motion. It is what we have been doing since we started out, and
                  it has been growing. Our client’s momentum feeds ours and we sustain theirs. It’s a
                  partnership.”
                </em>
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                Core Objectives
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Measurable Statutory Goals
              </h2>
              <div className="mt-6 space-y-3 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-gold-600 font-bold">✓</span>
                  <span>
                    <strong>Complete the process under SARFAESI Act</strong> in mortgage properties, from
                    sending Section 13(2) notices to the auction of properties.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-gold-600 font-bold">✓</span>
                  <span>
                    <strong>Arrange the Section 14 order</strong> within the shortest period of time through
                    systematic magistracy follow-up.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-gold-600 font-bold">✓</span>
                  <span>
                    <strong>Proven agency of choice</strong> for our institutional clients in terms of
                    performance and results.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-gold-600 font-bold">✓</span>
                  <span>
                    <strong>Strong relationships with key organizations</strong> in selected financial market
                    segments across Bihar, Jharkhand, and Chhattisgarh.
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-gray-200">
                  <span className="text-gold-600 font-bold">✓</span>
                  <span>
                    <strong>An extension of our clients' business approach</strong> as an exclusive debt
                    solutions and para-legal enforcement partner.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Operational Boundaries */}
      <section className="py-16 bg-[#fbfcfd] border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
              Territorial Scope
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
              State-Level Coverage & Ground Presence
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Our operational teams operate across district magistracies, police commissionerates,
              and administrative headquarters across three key states.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">State of Bihar</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Full-spectrum enforcement across Patna, Gaya, Muzaffarpur, Bhagalpur, Purnia, and all
                districts. Enforcement, third-party investigations, asset verification, and recovery support.
              </p>
              <span className="inline-block px-2.5 py-1 bg-navy-50 text-navy-800 text-[11px] font-semibold rounded">
                Active Banking Vertical
              </span>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">State of Jharkhand</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Section 14 processing, order execution, and recovery operations across Ranchi,
                Jamshedpur, Dhanbad, Bokaro, and all adjoining commissionerates.
              </p>
              <span className="inline-block px-2.5 py-1 bg-navy-50 text-navy-800 text-[11px] font-semibold rounded">
                Active Banking Vertical
              </span>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-navy-950 mb-2">State of Chhattisgarh</h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Enforcement ancillary support, physical possession, notice service, and asset verification
                covering Raipur, Bilaspur, Durg, Bhilai, and regional districts.
              </p>
              <span className="inline-block px-2.5 py-1 bg-navy-50 text-navy-800 text-[11px] font-semibold rounded">
                Active Banking Vertical
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Callout */}
      <section className="py-16 bg-navy-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Executive Guidance
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
              Led by Two Decades of Enforcement Excellence
            </h2>
            <p className="mt-4 text-sm text-gray-300 leading-relaxed">
              Managing Director Mr. Prashant Kumar brings 20 years of hands-on leadership with leading
              NBFCs and Banks (Magma Fincorp Ltd, ARCIL-Arms, HDFC Bank, and Vidhi Associates Law
              Firm as Partner), spanning Collection, Recovery, Para-Legal & Legal procedures (DRT,
              SARFAESI, Lok Adalat, Execution, Arbitration).
            </p>
            <div className="mt-8">
              <Link
                href="/leadership"
                className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300"
              >
                <span>Read detailed leadership credentials</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

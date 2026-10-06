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

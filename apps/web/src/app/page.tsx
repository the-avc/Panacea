import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-950 text-white pt-20 pb-28 lg:pt-28 lg:pb-36">
        {/* Subtle Background Gradients & Grid */}
        <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-navy-800/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-burgundy-900/30 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Jurisdictional Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-navy-900/80 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span>Jurisdictions: Bihar · Jharkhand · Chhattisgarh</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Institutional Enforcement & Recovery Services.
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl font-normal">
              Panacea Consultancy Private Limited provides specialized para-legal execution,
              rigorous SARFAESI enforcement, Section 14 acquisition, asset verification, and
              third-party investigations for leading financial institutions, banks, and NBFCs.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                id="cta-explore-services"
                className="inline-flex items-center justify-center rounded-md bg-gold-500 hover:bg-gold-600 active:bg-gold-700 px-6 py-3.5 text-sm font-semibold text-navy-950 transition-all shadow-md hover:shadow-lg gap-2"
              >
                <span>Explore Core Verticals</span>
                <span className="text-navy-900">→</span>
              </Link>
              <a
                href="http://localhost:3001"
                id="cta-client-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-white/5 hover:bg-white/10 active:bg-white/15 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all gap-2"
              >
                <svg
                  className="h-4 w-4 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Authorized Client Portal</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Governance Pillars Banner */}
      <section className="border-y border-navy-100 bg-white py-8 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">Data Confidentiality</h4>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Strict non-disclosure protocols protecting institutional borrower files.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">Institutional Trust</h4>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  Preserving client brand equity during on-ground statutory enforcement.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">Legal Diligence</h4>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  20+ years of legal & recovery expertise led by industry veterans.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">Regional Command</h4>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  End-to-end liaison with district magistrates and local police authorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="py-20 lg:py-28 bg-[#fbfcfd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
              Our Capabilities
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-navy-950">
              Specialized Ancillary Services
            </h2>
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              We assist banks, financial institutions, and asset reconstruction entities through
              structured statutory compliance and ground execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                SARFAESI Notice Drafting
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Accurate preparation and legal vetting of Demand Notices under Section 13(2) of the
                SARFAESI Act, ensuring all statutory particulars and service compliance are fulfilled.
              </p>
              <Link
                href="/services/sarfaesi"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 inline-flex items-center gap-1"
              >
                <span>Read Section 13(2) workflow</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 2 */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Section 14 Application & Orders
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Filing verified Section 14 applications before District Magistrates and Chief
                Metropolitan Magistrates, active tracking, and acquisition of statutory assistance orders.
              </p>
              <Link
                href="/services/sarfaesi"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 inline-flex items-center gap-1"
              >
                <span>Section 14 filing process</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 3 */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Possession Execution Support
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                On-ground operational coordination with administrative and police officials for the
                lawful physical takeover and securing of secured immovable and movable assets.
              </p>
              <Link
                href="/services/sarfaesi"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 inline-flex items-center gap-1"
              >
                <span>Execution procedures</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 4 */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Third-Party Investigation (TP)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Thorough non-intrusive field investigation for insurance and banking clients,
                document verification, borrower tracing, and factual integrity analysis.
              </p>
              <Link
                href="/services/investigation"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 inline-flex items-center gap-1"
              >
                <span>Investigation verticals</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 5 */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Asset Verification & Inspection
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Physical property inspections, boundaries demarcation verification, occupancy
                checks, and condition reports for secured assets prior to enforcement or auction.
              </p>
              <Link
                href="/services/investigation"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 inline-flex items-center gap-1"
              >
                <span>Inspection standards</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 6 */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-800 mb-6">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Auction & Buyer Assistance
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-6">
                Logistical coordination for public auctions under SARFAESI rules, buyer inspection
                facilitation, and statutory hand-over assistance for secured creditor institutions.
              </p>
              <Link
                href="/services"
                className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900 inline-flex items-center gap-1"
              >
                <span>Auction assistance details</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Jurisdictions Section */}
      <section className="py-16 bg-navy-950 text-white border-t border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                Operating Territories
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                Deep Regional Footprint Across Eastern India
              </h2>
              <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                Panacea maintains comprehensive operational familiarity with district magistrates,
                police administrations, and enforcement jurisdictions across the states of Bihar,
                Jharkhand, and Chhattisgarh.
              </p>

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-lg bg-navy-900/60 border border-navy-800">
                  <h4 className="text-sm font-semibold text-gold-300">State of Bihar</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Enforcement (all verticals), Third-Party Investigation, Asset Verification & Recovery.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-navy-900/60 border border-navy-800">
                  <h4 className="text-sm font-semibold text-gold-300">State of Jharkhand</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    SARFAESI Section 14 processing, order execution, possession and recovery support.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-navy-900/60 border border-navy-800">
                  <h4 className="text-sm font-semibold text-gold-300">State of Chhattisgarh</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Enforcement, notice service, physical possession execution, and asset audits.
                  </p>
                </div>
              </div>
            </div>

            {/* Regional Stats & Leadership Summary */}
            <div className="rounded-2xl border border-navy-800 bg-navy-900/40 p-8 lg:p-10 backdrop-blur-sm">
              <h3 className="font-display text-2xl font-bold text-white mb-6">
                Executive Leadership
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-gold-400">Mr. Prashant Kumar</h4>
                  <p className="text-xs text-gray-300 font-medium">Managing Director</p>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                    20 years of hands-on experience in Collection, Recovery, Para-Legal & Legal
                    enforcement across prominent NBFCs, Banks, and legal firms including Magma Fincorp
                    Ltd, ARCIL-Arms, HDFC Bank, and Vidhi Associates Law Firm.
                  </p>
                </div>
                <div className="pt-4 border-t border-navy-800">
                  <h4 className="text-base font-semibold text-gold-400">Mrs. Anjana Singh</h4>
                  <p className="text-xs text-gray-300 font-medium">Director</p>
                  <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                    Contributes to the strategic vision, governance posture, and organizational
                    development of the firm.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-navy-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">Confidentiality Guarantee</span>
                <Link
                  href="/security-confidentiality"
                  className="text-xs font-semibold text-gold-400 hover:text-gold-300"
                >
                  View Security Commitments →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gateway Callout Banner */}
      <section className="py-16 bg-white border-t border-navy-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-navy-950 p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                Authorized Client Portal
              </span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
                Live Case Docket Management & Secure Vault
              </h2>
              <p className="mt-4 text-sm text-gray-300 leading-relaxed">
                Empaneled bank officers and nodal representatives can log into our secure portal to
                track docket milestones, inspect certified Section 14 orders, and download statutory
                proofs in real time.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gold-500 hover:bg-gold-600 active:bg-gold-700 px-6 py-3 text-xs font-semibold text-navy-950 transition-colors shadow-md"
                >
                  Access Client Portal →
                </a>
                <Link
                  href="/contact"
                  className="rounded-md border border-gray-600 px-6 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Contact Institutional Desk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

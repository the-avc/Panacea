import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-950 text-white pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="absolute inset-0 subtle-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-navy-800/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-burgundy-900/30 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Jurisdictional Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-navy-900/80 px-3.5 py-1 text-xs font-semibold text-gold-300 backdrop-blur-md mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
              <span>Operating Jurisdictions: Bihar · Jharkhand · Chhattisgarh</span>
            </div>

            {/* Profile Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Institutional Enforcement & Recovery Services
            </h1>
            <p className="mt-3 text-xs sm:text-sm uppercase tracking-widest text-gold-400 font-semibold">
              Enforcement and Investigation Related Ancillary Services
            </p>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl font-normal">
              Panacea Consultancy Private Limited delivers structured on-ground para-legal execution,
              statutory SARFAESI enforcement, Section 14 magisterial petitions, physical possession takeovers,
              and independent investigations for Banks, Non-Banking Financial Companies (NBFCs), Asset Reconstruction
              Companies (ARCs), Housing Finance Institutions, and General Insurance Providers.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/services"
                id="cta-explore-services"
                className="inline-flex items-center justify-center rounded-md bg-gold-500 hover:bg-gold-600 active:bg-gold-700 px-6 py-3.5 text-xs font-semibold text-navy-950 transition-all shadow-md hover:shadow-lg gap-2"
              >
                <span>Explore 6 Ancillary Verticals</span>
                <span className="text-navy-900">→</span>
              </Link>
              <a
                href={portalBase}
                id="cta-client-portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-gray-600 bg-white/5 hover:bg-white/10 active:bg-white/15 px-6 py-3.5 text-xs font-semibold text-white backdrop-blur-sm transition-all gap-2"
              >
                <svg
                  className="h-4 w-4 text-gold-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Authorized Client Portal</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Commitments — Verbatim from Corporate Profile */}
      <section className="border-y border-navy-100 bg-white py-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-900 mb-3 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                Protecting Client Brand Equity
              </h4>
              <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                We understand that by allocating the file to us for Enforcement, our clients also release their brand to us.
                Being conscious of this, we ensure that we protect one of the most important aspects of our clients business that is their brand equity.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-900 mb-3 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                Data Security & Confidentiality
              </h4>
              <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                We understand the importance of confidentiality of private data our clients, data security, and that is why we ensure that the data provided to us always remains confidential.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-900 mb-3 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                Integrity & Honesty in Business
              </h4>
              <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                We at Panacea Consultancy Private Limited reflect our values and reinforce our commitment to the highest standards of integrity and honesty in business.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-900 mb-3 border border-navy-100">
                <svg className="h-5 w-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                Relieving Debt Anxiety
              </h4>
              <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                We assist our clients in recovering outstanding amounts owing by implementing the most efficient means possible and take away your anxiety off issues regarding debt recovery.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Six Core Services Grid — Direct Links to Dedicated Pages */}
      <section className="py-20 lg:py-24 bg-white" id="services-section">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
              Our Services
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-navy-950">
              Six Core Ancillary Verticals
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
              We assist financial institutions with all SARFAESI-related activities, including the drafting of Demand Notices (u/s 13.2),
              the filing of Section 14 applications & Getting Orders, the execution of Section 14 orders, and helping to find buyers in the auctioned process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1: Drafting Demand Notices (u/s 13.2) */}
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  Drafting of Demand Notices (u/s 13.2)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Assisting financial institutions with drafting statutory Demand Notices under Section 13(2) of the
                  SARFAESI Act. Prepared with a strong legal background for drafting notices to begin the process towards property auction.
                </p>
              </div>
              <Link
                href="/services/sarfaesi/notice-13-2"
                className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 inline-flex items-center gap-1.5 pt-4 border-t border-gray-100"
              >
                <span>Section 13(2) Notice Details</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 2: Filing Section 14 Applications & Getting Orders */}
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  Section 14 Applications & Getting Orders
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  The filing of Section 14 applications and getting orders before District Magistrates and Chief Metropolitan Magistrates.
                  Our primary objective is to arrange the Sec 14 order within the shortest period of time.
                </p>
              </div>
              <Link
                href="/services/sarfaesi/section-14"
                className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 inline-flex items-center gap-1.5 pt-4 border-t border-gray-100"
              >
                <span>Section 14 Filing & Orders</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 3: Execution of Section 14 Orders */}
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  Execution of Section 14 Orders
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  The execution of Section 14 orders. Our aim is to recover debt by way of possession of secured assets mortgaged with our clients,
                  at the same time ensuring better business relationships and protecting the brand equity of our clients.
                </p>
              </div>
              <Link
                href="/services/sarfaesi/possession-execution"
                className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 inline-flex items-center gap-1.5 pt-4 border-t border-gray-100"
              >
                <span>Section 14 Execution Details</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 4: Investigation (TP) — Third Party */}
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  Investigation (TP) — Third Party
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Engaged in Investigation related ancillary services. Officially empaneled with esteemed institutions such as
                  ICICI Lombard for Investigation (TP) for all Bihar, ensuring strict data confidentiality and integrity.
                </p>
              </div>
              <Link
                href="/services/investigation/third-party"
                className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 inline-flex items-center gap-1.5 pt-4 border-t border-gray-100"
              >
                <span>Investigation (TP) Scope</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 5: Asset Verification & Recovery */}
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                  05
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  Asset Verification & Recovery
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Empaneled with Bajaj GIC for Asset Verification and Recovery for all Bihar, and ICICI Lombard for Asset Verification.
                  On-ground verification of secured mortgaged assets with meticulous scrutiny.
                </p>
              </div>
              <Link
                href="/services/investigation/asset-verification"
                className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 inline-flex items-center gap-1.5 pt-4 border-t border-gray-100"
              >
                <span>Asset Verification Standards</span>
                <span>→</span>
              </Link>
            </div>

            {/* Service 6: Auction Process & Finding Buyers */}
            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-sm mb-4">
                  06
                </div>
                <h3 className="font-display text-lg font-bold text-navy-950 mb-2">
                  Auction Process & Finding Buyers
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  We also help Financial Institutions to find the buyer in the auctioned process.
                  Completing the entire SARFAESI Act statutory lifecycle from sending 13(2) notice to auction of properties.
                </p>
              </div>
              <Link
                href="/services/auction-assistance"
                className="text-xs font-bold text-burgundy-800 hover:text-burgundy-950 inline-flex items-center gap-1.5 pt-4 border-t border-gray-100"
              >
                <span>Auction Assistance Overview</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section — Verbatim Page 2 */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
            Our Team
          </span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
            Strong Legal Background
          </h2>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed font-medium">
            “We having a good team with a strong legal background for drafting of notices and petitions.”
          </p>
        </div>
      </section>

      {/* Existing Assignments — 11 Empanelled Institutions (Pages 2 & 3) */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
              Institutional Empanelments
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
              Empaneled with Esteemed Institutions Across Sectors
            </h2>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Panacea Consultancy Private Limited is empaneled with leading institutional creditors and corporations across Bihar, Jharkhand & Chhattisgarh—spanning Commercial Banks, Small Finance Banks, NBFCs, Asset Reconstruction Companies (ARCs), Housing Finance Institutions, and General Insurance Corporations:
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-navy-800">
              <span className="rounded-full bg-navy-50 border border-navy-100 px-3 py-1">Commercial & SFBs</span>
              <span className="rounded-full bg-navy-50 border border-navy-100 px-3 py-1">NBFCs & Credit Funds</span>
              <span className="rounded-full bg-navy-50 border border-navy-100 px-3 py-1">Asset Reconstruction (ARCs)</span>
              <span className="rounded-full bg-navy-50 border border-navy-100 px-3 py-1">Housing Finance</span>
              <span className="rounded-full bg-navy-50 border border-navy-100 px-3 py-1">General Insurance</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Banking</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">ICICI Bank</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement for all verticals in Bihar, Jharkhand & Chhattisgarh.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">General Insurance</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">ICICI Lombard</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for Investigation (TP), Asset Verification for all Bihar.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">General Insurance</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">Bajaj GIC</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for Asset Verification and Recovery for all Bihar.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Banking</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">Axis Bank</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement for all verticals in Bihar, Jharkhand & Chhattisgarh.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Housing Finance</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">ICICI Home Finance</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for Enforcement in Bihar and Jharkhand.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Banking</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">IDBI Bank</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for Enforcement in Bihar and Jharkhand.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Small Finance Bank</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">Jana Small Finance Bank</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement for all verticals in Bihar, Jharkhand.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Small Finance Bank</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">Utkarsh Small Finance Bank</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement for all verticals in Bihar, Jharkhand.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Housing Finance</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">Aadhar Housing Finance Ltd.</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement in Bihar & Jharkhand.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">Asset Reconstruction</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">ARCIL (Asset Reconstruction Company India Ltd.)</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement in Bihar, Jharkhand & Chhattisgarh.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-[#fbfcfd]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800">NBFC / Finance</span>
              <h4 className="text-xs font-bold text-navy-950 mt-1">Cholamandalam Investment & Finance Company Ltd.</h4>
              <p className="text-[11px] text-gray-600 mt-1">
                Empaneled for enforcement in Bihar and Jharkhand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Directors Profile — Verbatim Page 3 */}
      <section className="py-16 bg-navy-950 text-white border-t border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Leadership
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white">
              Directors Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-8 backdrop-blur-sm">
              <span className="text-xs font-mono font-bold text-gold-400 uppercase">Director 1</span>
              <h3 className="text-lg font-bold text-white mt-1">Mr. Prashant Kumar</h3>
              <p className="text-xs text-gold-300 font-semibold mb-3">Managing Director</p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Mr. Prashant Kumar has a vivid experience of 20 years working with leading NBFCs and Banks such as
                Magma Fincorp Ltd, ARCIL-Arms & HDFC Bank & Vidhi Associates A Law Firm (As Partner) and looking after
                the Collection, Recovery, Para Legal & Legal (DRT, SARFAESI, Lok Adalat, Execution, Arbitration).
              </p>
            </div>

            <div className="rounded-2xl border border-navy-800 bg-navy-900/60 p-8 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-gold-400 uppercase">Director 2</span>
                <h3 className="text-lg font-bold text-white mt-1">Mrs. Anjana Singh</h3>
                <p className="text-xs text-gold-300 font-semibold mb-3">Director</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Mrs. Anjana Singh, a silent partner and director, contributes to our organizational vision.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-navy-800">
                <span className="text-[11px] text-gray-400 block">Regional Headquarters:</span>
                <span className="text-xs text-gold-300 font-semibold">Bihar · Jharkhand · Chhattisgarh</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

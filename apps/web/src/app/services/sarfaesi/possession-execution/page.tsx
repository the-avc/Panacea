import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Execution of Section 14 Orders — SARFAESI Act',
  description:
    'Panacea Consultancy Private Limited executes Section 14 orders to recover debt by way of possession of secured assets while protecting client brand equity across Bihar, Jharkhand, and Chhattisgarh.',
};

export default function PossessionExecutionPage() {
  const portalBase = process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001';

  return (
    <div className="w-full">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 lg:py-20 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/services"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1 mb-4"
            >
              <span>← Back to Services Overview</span>
            </Link>
            <span className="block text-xs font-bold uppercase tracking-widest text-gold-400">
              SARFAESI Act, 2002 — Service Vertical 03
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Execution of Section 14 Orders
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Ground execution of Section 14 orders to recover debt by way of possession of secured assets,
              protecting client brand equity and ensuring better business relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              {/* PDF Profile Extract */}
              <div className="rounded-xl border border-gold-300/40 bg-gold-50/40 p-6 text-xs text-navy-950 leading-relaxed">
                <span className="font-bold text-burgundy-950 block text-xs uppercase tracking-wide mb-1.5">
                  Core Mandate from Corporate Profile
                </span>
                <p className="italic text-gray-800">
                  “We fully understand that we are frequently dealing with sensitive issues while recovering the delinquent accounts.
                  Our aim to recover the debt by way of possession of secured assets, mortgage with our clients at the same time we
                  also ensure better business relationship protecting the interests of our clients.”
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
                  Operational Execution
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy-950">
                  Lawful Physical Possession & Asset Securing
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Execution of Section 14 orders requires coordination with district authorities, deputed magistrates,
                  and local police. Being conscious that clients release their brand to us when allocating enforcement files,
                  we conduct all on-ground proceedings with maximum professionalism, lawful demeanor, and rigorous documentation.
                </p>
              </div>

              {/* Service Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">01</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Administrative & Police Protection Liaison
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Formal communication with police superintendents and local police stations to ensure requisite police
                    force is deputed to assist the magistrate or court commissioner on the day of execution.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">02</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Magisterial Possession Execution
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Accompanying the deputed Executive Magistrate, Circle Officer, or Advocate Commissioner to the mortgaged property
                    for lawful entry and takeover of physical possession.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">03</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Panchnama & Inventory Documentation
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Preparing the spot Panchnama in the presence of independent witnesses, itemizing movable assets found
                    at the site, and recording photographic/video evidence.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">04</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Handover to Authorised Officer
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Formal handover of keys, locks, and possession memorandum to the Authorised Officer of the secured
                    creditor bank, and deployment of site security guards.
                  </p>
                </div>
              </div>

              {/* Brand Equity Commitment */}
              <div className="p-5 rounded-xl border border-gray-200 bg-navy-50/50 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-navy-950 block mb-1">Brand Equity Protection:</span>
                “We understand that by allocating the file to us for Enforcement, our clients also release their brand to us.
                Being conscious of this, we ensure that we protect one of the most important aspects of our clients business that is their brand equity.”
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 block mb-1">
                  Jurisdictions Covered
                </span>
                <h4 className="font-display text-base font-bold text-navy-950 mb-3">
                  On-Ground Execution Desks
                </h4>
                <div className="space-y-2 text-xs font-semibold text-navy-900">
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Bihar (All Districts)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Jharkhand (All Districts)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Chhattisgarh (All Districts)</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-sm font-bold text-navy-950 mb-2">
                  Institutional Contact Desk
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For possession scheduling and execution team coordination:
                </p>
                <div className="space-y-2 text-xs text-gray-700 mb-4">
                  <div>
                    <span className="font-bold block text-navy-950">Email:</span>
                    <a href="mailto:panaceaconsultancypvtltd@gmail.com" className="text-burgundy-800 font-semibold break-all">
                      panaceaconsultancypvtltd@gmail.com
                    </a>
                  </div>
                  <div>
                    <span className="font-bold block text-navy-950">Phone:</span>
                    <span className="text-navy-950 font-semibold">+91-9304897257, 9431432983</span>
                  </div>
                </div>
                <a
                  href={`${portalBase}/login?portal=client`}
                  className="block w-full text-center rounded-md bg-navy-950 py-2.5 px-4 text-xs font-semibold text-white hover:bg-navy-900 transition-colors"
                >
                  Bank Client Portal Login →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

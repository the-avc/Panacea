import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Auction Process & Finding Buyers — SARFAESI Act',
  description:
    'Panacea Consultancy Private Limited helps financial institutions to find buyers in the auctioned process, completing the SARFAESI Act process from 13(2) notice to auction of mortgage properties across Bihar, Jharkhand, and Chhattisgarh.',
};

export default function AuctionAssistancePage() {
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
              SARFAESI Act, 2002 — Service Vertical 06
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Auction Process & Finding Buyers
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              We help financial institutions find buyers in the auctioned process, completing the full process under
              the SARFAESI Act in mortgage properties from sending 13(2) notice to auction of properties.
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
                  “We also help to Financial Institution to find the buyer in auctioned process...
                  Our objective: To complete the process under SARFAESI Act in mortgage properties. (Sending 13(2) notice to Auction of properties.)”
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
                  Completing the Recovery Cycle
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                  Assisting Lenders in Successful Auction Disposition
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Taking physical possession of secured assets under Section 14 is the intermediate milestone; the ultimate
                  objective of a secured creditor under the SARFAESI Act is recovering outstanding amounts owing through public
                  auction. Panacea Consultancy Private Limited actively assists financial institutions in finding prospective
                  buyers and managing on-ground inspection logistics.
                </p>
              </div>

              {/* Service Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">01</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Finding Buyers in Auctioned Process
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Connecting with local markets and prospective commercial buyers interested in purchasing secured
                    mortgage properties in the statutory auction process.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">02</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Site Inspections for Prospective Bidders
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Facilitating site visits and property inspections for interested bidders during the statutory pre-auction
                    inspection window under authorized bank protocol.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">03</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Sale Notice Affixture & Publication Support
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Assisting with the physical affixture of the statutory 30-day or 15-day public auction notice on the
                    property and local administrative coordination.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">04</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Post-Auction Handover Assistance
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Assisting the Authorised Officer with final physical handover of the secured property to the successful
                    auction purchaser upon issuance of the statutory Sale Certificate.
                  </p>
                </div>
              </div>

              {/* Momentum & Partnership Commitment */}
              <div className="p-5 rounded-xl border border-gray-200 bg-navy-50/50 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-navy-950 block mb-1">Momentum & Partnership:</span>
                “Momentum Movement Forward motion. It is what we have been doing since we started out, and it has been
                growing. Our client’s momentum feeds ours and we sustain theirs. It’s a partnership. To be an extension of
                overall our clients business approach and an exclusive Debt Solutions partner.”
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 block mb-1">
                  Operating Jurisdictions
                </span>
                <h4 className="font-display text-base font-bold text-navy-950 mb-3">
                  Auction Support Desks
                </h4>
                <div className="space-y-2 text-xs font-semibold text-navy-900">
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Bihar (All Districts)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Jharkhand (All Districts)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Chhattisgarh (All Districts)</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-sm font-bold text-navy-950 mb-2">
                  Institutional Auction Desk
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For auction coordination and buyer assistance liaison:
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
                  Authorized Client Portal →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

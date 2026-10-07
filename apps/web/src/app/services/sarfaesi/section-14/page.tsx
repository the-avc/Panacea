import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Section 14 Applications & Getting Orders — SARFAESI Act',
  description:
    'Panacea Consultancy Private Limited assists financial institutions with filing Section 14 applications and getting orders before District Magistrates within the shortest period of time across Bihar, Jharkhand, and Chhattisgarh.',
};

export default function Section14Page() {
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
              SARFAESI Act, 2002 — Service Vertical 02
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Section 14 Applications & Getting Orders
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Assisting financial institutions with filing Section 14 applications and obtaining orders before
              District Magistrates and Chief Metropolitan Magistrates within the shortest period of time.
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
                  “The filing of Section 14 applications & Getting Orders... Our objective: To arrange the Sec 14 order within the shortest period of time.”
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
                  Magisterial Process
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy-950">
                  Expedited Magisterial Petition Filing & Follow-Up
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  When borrowers fail to satisfy the statutory 60-day demand under Section 13(2), Section 14 empowers
                  secured creditors to request the assistance of the District Magistrate (DM) or Chief Metropolitan Magistrate
                  (CMM) to take possession of the secured asset. Our dedicated team handles petition preparation,
                  statutory affidavits, and continuous administrative liaison to obtain the certified order without delays.
                </p>
              </div>

              {/* Service Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">01</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Petition & Affidavit Drafting
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Prepared by personnel with a strong legal background, incorporating the mandatory statutory affidavit
                    affirming loan default, security creation, and valid service of the Section 13(2) demand notice.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">02</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Collectorate / DM Office Filing
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Formal filing before the competent District Magistrate across collectorates in Bihar, Jharkhand,
                    and Chhattisgarh, ensuring full adherence to local administrative procedures.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">03</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Order Procurement Within Shortest Period
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Active case tracking and procedural follow-up to arrange the Section 14 order within the shortest
                    period of time, minimizing delays in secured asset takeover.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">04</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Certified Copy Procurement
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Securing certified copies of the magisterial order deputing the Executive Magistrate / Police Officers
                    for execution, and transmitting the documents to the client portal vault.
                  </p>
                </div>
              </div>

              {/* Integrity Commitment */}
              <div className="p-5 rounded-xl border border-gray-200 bg-navy-50/50 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-navy-950 block mb-1">Standards of Integrity:</span>
                “We at Panacea Consultancy Private Limited reflect our values and reinforce our commitment to the highest
                standards of integrity and honesty in business.”
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 block mb-1">
                  Jurisdictions Covered
                </span>
                <h4 className="font-display text-base font-bold text-navy-950 mb-3">
                  District Magistracies
                </h4>
                <div className="space-y-2 text-xs font-semibold text-navy-900">
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Bihar (All District Magistracies)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Jharkhand (All District Magistracies)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Chhattisgarh (All District Magistracies)</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-sm font-bold text-navy-950 mb-2">
                  Institutional Contact Desk
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For Section 14 file allocation and order updates:
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

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Drafting Demand Notices (u/s 13.2) — SARFAESI Act',
  description:
    'Panacea Consultancy Private Limited drafts Demand Notices under Section 13(2) of the SARFAESI Act, 2002 for financial institutions across Bihar, Jharkhand, and Chhattisgarh.',
};

export default function Section13NoticePage() {
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
              SARFAESI Act, 2002 — Service Vertical 01
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Drafting Demand Notices (u/s 13.2)
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              We assist financial institutions with all SARFAESI-related activities, including the drafting of
              Demand Notices (u/s 13.2), backed by a team with a strong legal background for drafting of notices and petitions.
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
                  “We assist financial institutions with all SARFAESI-related activities, including the drafting of Demand Notices (u/s 13.2)...
                  Our objective: To complete the process under SARFAESI Act in mortgage properties. (Sending 13(2) notice to Auction of properties.)”
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
                  Statutory Focus
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy-950">
                  Precision Legal Drafting for Secured Creditors
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Under the SARFAESI Act, 2002, issuing a valid and defensible Demand Notice under Section 13(2) is the mandatory
                  first step to enforce security interests without the intervention of court. Our legal recovery team ensures that
                  every notice accurately incorporates the debt schedule, mortgage documents, borrower and guarantor particulars,
                  and clear calculation of outstanding amounts.
                </p>
              </div>

              {/* Service Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">01</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Mortgage Property Schedule Verification
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Meticulous legal examination of title deeds, equitable mortgage memoranda, and property boundary schedules
                    to ensure complete accuracy in notice particulars.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">02</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Legal Notice Drafting & Vetting
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Prepared by personnel with a strong legal background, incorporating statutory 60-day demand timelines,
                    aggregate default computations, and statutory caution against alienation of secured assets.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">03</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Dispatch & Service Proof Documentation
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Tracking registered postal dispatch (RPAD / Speed Post) and assembling verifiable proof-of-service dockets
                    required for subsequent Section 14 filing.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">04</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Physical Affixture Assistance
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Assistance with physical notice affixture at the conspicuous part of the mortgaged property with
                    photographic proof and local panchas where required.
                  </p>
                </div>
              </div>

              {/* Data Confidentiality Commitment */}
              <div className="p-5 rounded-xl border border-gray-200 bg-navy-50/50 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-navy-950 block mb-1">Confidentiality Guarantee:</span>
                “We understand the importance of confidentiality of private data our clients, data security, and that is why
                we ensure that the data provided to us always remains confidential.”
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 block mb-1">
                  Jurisdictions Covered
                </span>
                <h4 className="font-display text-base font-bold text-navy-950 mb-3">
                  Regional Operating Desks
                </h4>
                <div className="space-y-2 text-xs font-semibold text-navy-900">
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Bihar (All Districts)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Jharkhand (All Districts)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Chhattisgarh (All Districts)</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-sm font-bold text-navy-950 mb-2">
                  Contact Directorate Desk
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For service allocation, notice drafting status, or case inquiries:
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

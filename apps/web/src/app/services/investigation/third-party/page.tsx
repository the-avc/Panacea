import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investigation (TP) — Third Party Ancillary Services',
  description:
    'Panacea Consultancy Private Limited is empaneled with ICICI Lombard for Investigation (TP) and Asset Verification for all Bihar, providing discrete investigation related ancillary services.',
};

export default function ThirdPartyInvestigationPage() {
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
              Investigation Vertical 04
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Investigation (TP) — Third Party
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Engaged in Investigation related ancillary services. Officially empaneled with premier institutions
              including ICICI Lombard for Investigation (TP) and Asset Verification for all Bihar.
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
                  Institutional Empanelment Mandate
                </span>
                <p className="italic text-gray-800">
                  “Empaneled with ICICI Lombard for Investigation (TP), Asset Verification for all Bihar...
                  We understand the importance of confidentiality of private data our clients, data security,
                  and that is why we ensure that the data provided to us always remains confidential.”
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
                  Discrete Field Intelligence
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                  Professional Ground Verification for Institutional Clients
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Third-party (TP) investigations require acute discretion, factual objectivity, and strict adherence to
                  data security protocols. Our regional field investigators conduct meticulous inquiries to verify facts,
                  cross-check documentation, and provide factual reports protecting institutional interests.
                </p>
              </div>

              {/* Service Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">01</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Third-Party (TP) Claim Fact-Checking
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Ground verification of incident facts, spot inspections, and factual consistency checks for general
                    insurance claims and financial assessments across Bihar.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">02</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Document & Record Verification
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Cross-checking official records, police documentation, local authority verifications, and public
                    registers to confirm authenticity and eliminate fraudulent discrepancies.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">03</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Borrower & Collateral Tracing
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Field tracing of non-responsive borrowers, co-borrowers, and guarantors, confirming physical residence,
                    operational business premises, and movable assets.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">04</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Confidential Reporting & Audit Trail
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Assembling structured factual reports with photographic evidence, maintaining strict non-disclosure
                    and data protection for our institutional principals.
                  </p>
                </div>
              </div>

              {/* Data Confidentiality Commitment */}
              <div className="p-5 rounded-xl border border-gray-200 bg-navy-50/50 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-navy-950 block mb-1">Confidentiality of Private Data:</span>
                “We understand that by allocating the file to us for Enforcement, our clients also release their brand to us.
                Being conscious of this, we ensure that we protect one of the most important aspects of our clients business that
                is their brand equity. We understand the importance of confidentiality of private data our clients, data security,
                and that is why we ensure that the data provided to us always remains confidential.”
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 block mb-1">
                  Primary Territory
                </span>
                <h4 className="font-display text-base font-bold text-navy-950 mb-3">
                  Investigation Territory
                </h4>
                <div className="space-y-2 text-xs font-semibold text-navy-900">
                  <div className="p-2.5 rounded bg-white border border-navy-100">All Bihar (Empaneled ICICI Lombard)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Jharkhand</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Chhattisgarh</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-sm font-bold text-navy-950 mb-2">
                  Institutional Inquiries
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For investigation assignments and case file allocation:
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

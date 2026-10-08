import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Asset Verification & Recovery — Panacea Consultancy',
  description:
    'Panacea Consultancy Private Limited is empaneled with Bajaj GIC and ICICI Lombard for Asset Verification and Recovery across Bihar, inspecting secured assets and mortgaged properties.',
};

export default function AssetVerificationPage() {
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
              Ancillary Vertical 05
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Asset Verification & Recovery
            </h1>
            <p className="mt-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              Empaneled with premier institutions including Bajaj GIC for Asset Verification and Recovery for all Bihar,
              and ICICI Lombard for Asset Verification. On-ground verification of secured and mortgaged assets.
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
                  “Empaneled with Bajaj GIC for Asset Verification and Recovery for all Bihar...
                  Empaneled with ICICI Lombard for Investigation (TP), Asset Verification for all Bihar...
                  Our aim to recover the debt by way of possession of secured assets, mortgage with our clients at the same time
                  we also ensure better business relationship protecting the interests of our clients.”
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-800">
                  Pre-Enforcement Reconnaissance
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                  Securing Ground Reality for Mortgaged Assets
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Before initiating coercive Section 14 proceedings or issuing statutory sale notices, lenders and insurance
                  institutions require accurate on-ground verification of the physical condition, occupancy status, boundary
                  demarcation, and existence of the secured asset. Our experienced recovery executives provide comprehensive
                  field audits to eliminate ambiguity and prevent litigation complications.
                </p>
              </div>

              {/* Service Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">01</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Physical Boundary Demarcation
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Physical inspection matching the four boundaries (East, West, North, South) against the mortgaged
                    property schedule, confirming land measurements and physical landmarks.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">02</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Occupancy & Tenancy Audit
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Determining whether the property is self-occupied, vacant, locked, or occupied by third-party tenants
                    or adverse claimants prior to enforcement action.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">03</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Commercial & Hypothecated Asset Verification
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Inspection and inventorying of hypothecated plant, machinery, vehicle fleets, and commercial stock
                    verifying running status, asset tags, and storage conditions.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-gray-200 bg-[#fbfcfd]">
                  <span className="text-xs font-bold text-burgundy-800 font-mono">04</span>
                  <h3 className="font-bold text-xs text-navy-950 mt-1 mb-1.5">
                    Photographic Audit & Geo-tagged Proofs
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Comprehensive digital inspection reports with time-stamped, geo-referenced photographs of the asset,
                    approach roads, and immediate neighborhood.
                  </p>
                </div>
              </div>

              {/* Core Mission Commitment */}
              <div className="p-5 rounded-xl border border-gray-200 bg-navy-50/50 text-xs text-gray-700 leading-relaxed">
                <span className="font-bold text-navy-950 block mb-1">Our Recovery Mission:</span>
                “We assist our clients in recovering outstanding amounts owing by implementing the most efficient means
                possible and take away your anxiety off issues regarding debt recovery and allow clients to focus on the
                core business processes and help them in transforming their business.”
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-xl border border-navy-100 bg-navy-50/70 p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-burgundy-800 block mb-1">
                  Primary Territory
                </span>
                <h4 className="font-display text-base font-bold text-navy-950 mb-3">
                  Verification Territory
                </h4>
                <div className="space-y-2 text-xs font-semibold text-navy-900">
                  <div className="p-2.5 rounded bg-white border border-navy-100">All Bihar (Empaneled Bajaj GIC & ICICI Lombard)</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Jharkhand</div>
                  <div className="p-2.5 rounded bg-white border border-navy-100">State of Chhattisgarh</div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h4 className="font-display text-sm font-bold text-navy-950 mb-2">
                  Institutional Inquiries
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  For asset inspection requests and recovery desk liaison:
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

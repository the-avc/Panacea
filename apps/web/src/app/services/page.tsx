import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services Overview',
  description:
    'Comprehensive portfolio of enforcement, para-legal execution, third-party investigation, and asset verification services by Panacea Consultancy Private Limited.',
};

export default function ServicesPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Institutional Capabilities
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              End-to-End Ancillary Enforcement Verticals
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              We provide structured support tailored to the operational demands of Special Asset
              Management Groups (SAMG), retail asset recovery desks, and legal departments of secured
              creditors.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Services Listing */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Vertical 1: SARFAESI Enforcement */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-gray-100 pb-16">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                Vertical 01
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                SARFAESI Statutory Enforcement
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Complete execution support under the Securitisation and Reconstruction of Financial
                Assets and Enforcement of Security Interest Act, 2002.
              </p>
              <div className="mt-6">
                <Link
                  href="/services/sarfaesi"
                  className="inline-flex items-center gap-1.5 rounded-md bg-navy-950 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-900 transition-colors"
                >
                  <span>Detailed SARFAESI Procedures</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Section 13(2) Demand Notices</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Drafting, legal proofing, dispatch via registered posts/couriers, affixture, and publication coordination.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Section 14 DM / CMM Petitions</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Filing verified affidavits before District Magistrates, liaisoning with magistrates' offices, and obtaining police assistance orders.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Physical Possession Execution</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  On-site execution with court-appointed receivers, revenue officers, and police forces, including panchnama and video inventory.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Post-Possession Security</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Physical sealing, deployment of armed/unarmed security guards, and asset preservation until auction hand-over.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical 2: Investigation & Asset Verification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-gray-100 pb-16">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                Vertical 02
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Third-Party Investigation & Asset Verification
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Non-intrusive field investigation, discrete intelligence gathering, and meticulous
                collateral verification for secured creditors and insurance corporations.
              </p>
              <div className="mt-6">
                <Link
                  href="/services/investigation"
                  className="inline-flex items-center gap-1.5 rounded-md bg-navy-950 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-900 transition-colors"
                >
                  <span>Detailed Investigation Standards</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Third-Party (TP) Investigations</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Field verification, verification of claim bona fides, and factual background validation for general insurance and NBFCs.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Pre-Enforcement Asset Tracing</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Identification of unencumbered borrower assets, commercial interests, and alternate property leads for DRT / recovery attachment.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Physical Collateral Audits</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Demarcation inspections, GPS tagging, occupancy status determination (tenant vs owner), and encroachment checks.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Skip Tracing & Contactability</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Lawful tracing of absconding borrowers and guarantors to ensure effective legal notice delivery and court summon service.
                </p>
              </div>
            </div>
          </div>

          {/* Vertical 3: Auction & Buyer Coordination */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                Vertical 03
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-navy-950">
                Auction Support & Buyer Coordination
              </h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Assistance with the disposition of repossessed assets to maximize statutory recovery
                yields while complying with SARFAESI Security Interest (Enforcement) Rules.
              </p>
              <div className="mt-6">
                <Link
                  href="/services/auction-assistance"
                  className="inline-flex items-center gap-1.5 rounded-md bg-navy-950 px-4 py-2 text-xs font-semibold text-white hover:bg-navy-900 transition-colors"
                >
                  <span>Auction Support Procedures</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Public Auction Logistics</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Notice publication assistance, venue management for physical/e-auctions, and prospective bidder documentation.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Site Inspections for Bidders</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Facilitating regulated property visits for qualified buyers under official creditor supervision.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Asset Handover Assistance</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Statutory execution of final physical handover to successful auction purchasers upon sale certificate issuance.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-gray-200 bg-gray-50/50">
                <h4 className="text-xs font-bold text-navy-950 uppercase">Comprehensive Docket Archives</h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  End-to-end digitised docket retention stored within our secure cloud repository for compliance and audit defense.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

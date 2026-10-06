import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Investigation & Asset Verification Services',
  description:
    'Professional third-party investigation, borrower tracing, asset reconnaissance, and physical collateral audits across Bihar, Jharkhand, and Chhattisgarh.',
};

export default function InvestigationPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link
              href="/services"
              className="text-xs font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1 mb-4"
            >
              <span>← Back to Services Overview</span>
            </Link>
            <span className="block text-xs font-bold uppercase tracking-widest text-gold-400">
              Intelligence & Risk Verification
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Third-Party Investigation & Collateral Verification
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Discrete, lawful, and rigorous field intelligence to evaluate risk, verify claims,
              inspect physical collaterals, and trace absconding parties across Eastern India.
            </p>
          </div>
        </div>
      </section>

      {/* Investigation Verticals */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-8">
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Third-Party (TP) Investigation for General Insurance & NBFCs
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Field verification of claims, incident veracity verification, identification of
                staged losses, and assessment of factual bona fides. Handled with sensitivity and
                strict non-disclosure to protect institutional brand integrity.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Accident scene verification & witness fact-checking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Verification of commercial premises & inventory claims</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Document genuineness and local authority cross-verification</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-8">
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Asset Tracing & Physical Inspection
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Thorough physical verification of secured real estate and movable assets prior to
                statutory enforcement, DRT attachment, or auction scheduling.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>GPS geocoding and photographic boundary demarcations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Occupancy checks (tenant agreements vs third-party squatters)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Structural integrity and encroachment assessments</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-8">
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Borrower Skip Tracing & Location Reconnaissance
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Locating non-contactable borrowers, directors of corporate debtors, and personal
                guarantors through legitimate local reconnaissance and public registry tracing.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Identification of current residence and business addresses</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Effective service of demand notices and court summons</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Detection of corporate entity relocations and shell offices</span>
                </li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-8">
              <h3 className="font-display text-xl font-bold text-navy-950 mb-3">
                Pre-Recovery Feasibility Assessments
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                Before instituting Section 14 proceedings or police deployment, we conduct detailed
                feasibility evaluations of potential ground resistance, local socio-political
                sensitivities, and physical access hurdles.
              </p>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Evaluation of required administrative forces & logistics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Mitigation of institutional reputational exposure</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-burgundy-700" />
                  <span>Actionable intelligence reports delivered securely via client portal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

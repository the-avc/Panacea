import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Institutional Experience & Empanelments',
  description:
    'Institutional track record and enforcement empanelment engagements of Panacea Consultancy Private Limited across banking, insurance, and NBFC sectors.',
};

export default function InstitutionalExperiencePage() {
  const empanelments = [
    {
      institution: 'ICICI Bank',
      vertical: 'Enforcement (all verticals)',
      regions: 'Bihar, Jharkhand & Chhattisgarh',
    },
    {
      institution: 'ICICI Lombard',
      vertical: 'Investigation (TP), Asset Verification',
      regions: 'Bihar',
    },
    {
      institution: 'Bajaj GIC',
      vertical: 'Asset Verification and Recovery',
      regions: 'Bihar',
    },
    {
      institution: 'Axis Bank',
      vertical: 'Enforcement (all verticals)',
      regions: 'Bihar, Jharkhand & Chhattisgarh',
    },
    {
      institution: 'ICICI Home Finance',
      vertical: 'Enforcement',
      regions: 'Bihar and Jharkhand',
    },
    {
      institution: 'IDBI Bank',
      vertical: 'Enforcement',
      regions: 'Bihar and Jharkhand',
    },
    {
      institution: 'Jana Small Finance Bank',
      vertical: 'Enforcement (all verticals)',
      regions: 'Bihar, Jharkhand',
    },
    {
      institution: 'Utkarsh Small Finance Bank',
      vertical: 'Enforcement (all verticals)',
      regions: 'Bihar, Jharkhand',
    },
    {
      institution: 'Aadhar Housing Finance Ltd.',
      vertical: 'Enforcement',
      regions: 'Bihar & Jharkhand',
    },
    {
      institution: 'ARCIL',
      vertical: 'Enforcement',
      regions: 'Bihar, Jharkhand & Chhattisgarh',
    },
    {
      institution: 'Cholamandalam Investment And Finance Company Ltd.',
      vertical: 'Enforcement',
      regions: 'Bihar and Jharkhand',
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Institutional Track Record
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Institutional Experience & Empanelment Record
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              Serving leading scheduled commercial banks, small finance institutions, housing finance
              corporations, and asset reconstruction entities across Eastern India.
            </p>
          </div>
        </div>
      </section>

      {/* Empanelment Table & Standards */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Regulatory Disclaimer */}
          <div className="mb-10 rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 leading-relaxed">
            <span className="font-bold uppercase tracking-wide mr-1">
              Institutional Representation Notice:
            </span>
            The institutional relationships detailed below reflect historical and ongoing ancillary
            enforcement, verification, and investigation mandates entrusted to Panacea Consultancy
            Private Limited as documented in our institutional corporate profile. All services are
            conducted under specific authorizations issued by respective client institutions.
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50/75">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold uppercase tracking-wider text-navy-900">
                    Client Institution
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold uppercase tracking-wider text-navy-900">
                    Mandated Scope / Services
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold uppercase tracking-wider text-navy-900">
                    Authorized Operating Regions
                  </th>
                  <th scope="col" className="px-6 py-4 font-bold uppercase tracking-wider text-navy-900 text-right">
                    Operational Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/70 bg-white">
                {empanelments.map((item, idx) => (
                  <tr key={idx} className="hover:bg-navy-50/30 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 font-semibold text-navy-950">
                      {item.institution}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{item.vertical}</td>
                    <td className="px-6 py-4 text-gray-700">{item.regions}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200">
                        Empaneled / Operational
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Standards Callout */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50/40">
              <h4 className="font-display text-base font-bold text-navy-950 mb-2">
                Turnaround Efficiency
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Expedited drafting and prompt filing to minimize delays in obtaining certified Section 14
                magisterial orders.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50/40">
              <h4 className="font-display text-base font-bold text-navy-950 mb-2">
                Audit Trail Discipline
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Complete photographic evidence, certified police memos, panchnama documentation, and
                docket logs for legal compliance.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-gray-200 bg-gray-50/40">
              <h4 className="font-display text-base font-bold text-navy-950 mb-2">
                Brand Sensitivity
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Zero aggression, complete adherence to the RBI Code of Conduct for Recovery Agents,
                and professional conduct at all times.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

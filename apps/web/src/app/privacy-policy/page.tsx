import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Institutional data privacy policy and governance commitments of Panacea Consultancy Private Limited under Indian digital data protection principles.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
        Data Governance
      </span>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-navy-950">
        Privacy & Data Protection Policy
      </h1>
      <p className="mt-2 text-xs text-gray-500">Effective Date: October 2026</p>

      <div className="mt-8 space-y-8 text-xs text-gray-700 leading-relaxed border-t border-gray-200 pt-8">
        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            1. Institutional Mandate & Scope
          </h2>
          <p>
            Panacea Consultancy Private Limited (&quot;Panacea&quot;, &quot;we&quot;, &quot;us&quot;)
            operates as an ancillary enforcement and investigation service provider for banks,
            housing finance companies, asset reconstruction corporations, and non-banking financial
            institutions. This Privacy Policy governs the processing of institutional contact
            data and the handling of client-authorized borrower records entrusted to us.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            2. Categories of Information Processed
          </h2>
          <p>
            We process data strictly in accordance with official client authorizations (Banks, NBFCs,
            ARCs, Housing Finance Companies, and Insurance Providers) and statutory mandates under
            the SARFAESI Act, 2002. Categories include:
          </p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-gray-600">
            <li>
              <strong>Institutional Officer Data:</strong> Official email addresses, designations,
              and official contact numbers of institutional nodal officers.
            </li>
            <li>
              <strong>Statutory Docket Records:</strong> Borrower names, mortgaged asset particulars,
              demand notice delivery receipts, and certified orders issued by district magistracies.
            </li>
            <li>
              <strong>Technical Audit Metadata:</strong> Cryptographic session tokens, timestamps,
              and IP addresses logged solely for platform security and compliance auditing.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            3. Non-Disclosure & Multi-Tenant Isolation
          </h2>
          <p>
            Under no circumstances does Panacea commercialize, broker, or sell any borrower,
            collateral, or institutional data. All digital repositories are tenant-isolated,
            ensuring that records belonging to one creditor institution can never be queried or
            viewed by another.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            4. Data Retention & Secure Archival
          </h2>
          <p>
            Enforcement files, Section 14 order certified copies, and execution panchnamas are
            retained in accordance with client bank master service agreements and statutory
            limitation requirements for Debt Recovery Tribunal (DRT) proceedings.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            5. Institutional Grievance Officer
          </h2>
          <p>
            For privacy inquiries or compliance audits, institutional officers may contact our
            designated grievance desk:
          </p>
          <div className="mt-3 p-4 rounded-md bg-gray-50 border border-gray-200">
            <p className="font-semibold text-navy-950">Grievance Desk · Panacea Consultancy Private Limited</p>
            <p className="mt-1 text-gray-600">Email: panaceaconsultancypvtltd@gmail.com</p>
            <p className="text-gray-600">Phone: +91-9304897257 / +91-9431432983</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal Disclaimer',
  description:
    'Statutory legal disclaimer regarding the para-legal and ancillary nature of services provided by Panacea Consultancy Private Limited.',
};

export default function LegalDisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
        Statutory Disclosures
      </span>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-navy-950">
        Legal Disclaimer & Statutory Disclosures
      </h1>

      <div className="mt-8 space-y-6 text-xs text-gray-700 leading-relaxed border-t border-gray-200 pt-8">
        <div className="p-5 rounded-xl border border-navy-100 bg-navy-50/50">
          <h3 className="font-display text-base font-bold text-navy-950 mb-2">
            No Solicitation of Legal Practice
          </h3>
          <p>
            Panacea Consultancy Private Limited is a corporate consultancy firm providing
            enforcement and investigation ancillary services. This website does not constitute a
            solicitation, invitation, advertisement, or inducement of any sort whatsoever to solicit
            any legal work, representation, or legal advice from the general public.
          </p>
        </div>

        <div>
          <h3 className="font-display text-base font-bold text-navy-950 mb-2">
            Ancillary Enforcement Capacity
          </h3>
          <p>
            All actions executed under the SARFAESI Act, 2002—including the drafting and issuance of
            notices under Section 13(2), filing of petitions under Section 14, and physical possession
            takeovers—are carried out strictly as authorized agents and support service providers to
            the Authorised Officers of client banks, NBFCs, ARCs, and institutional creditors in
            compliance with applicable law.
          </p>
        </div>

        <div>
          <h3 className="font-display text-base font-bold text-navy-950 mb-2">
            Accuracy & External Information
          </h3>
          <p>
            While every effort is made to maintain factual accuracy regarding statutory procedures,
            information presented on this website is for general institutional orientation only.
            Institutions must rely upon specific engagement agreements and legal counsels for formal
            litigation advice.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <Link href="/" className="text-xs font-semibold text-burgundy-700 hover:text-burgundy-900">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

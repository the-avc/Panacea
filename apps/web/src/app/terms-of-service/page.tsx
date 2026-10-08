import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service and institutional conditions of engagement governing the Panacea Consultancy Private Limited platform.',
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
        Legal Agreements
      </span>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-navy-950">
        Terms of Service & Conditions of Engagement
      </h1>
      <p className="mt-2 text-xs text-gray-500">Effective Date: October 2026</p>

      <div className="mt-8 space-y-8 text-xs text-gray-700 leading-relaxed border-t border-gray-200 pt-8">
        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            1. Institutional Nature of Services
          </h2>
          <p>
            The services offered by Panacea Consultancy Private Limited are exclusively intended for
            Banks, NBFCs, Asset Reconstruction Companies (ARCs), Housing Finance Companies, Insurance
            Providers, and Institutional Creditors under formal empanelment or bilateral master service
            agreements. We do not provide advisory or representation services to individual retail
            borrowers or the general public.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            2. Client Portal Access Credentials
          </h2>
          <p>
            Authorized representatives must maintain strict confidentiality of their portal
            credentials, session cookies, and multi-factor authentication devices. Sharing
            credentials across non-authorized personnel constitutes a material breach of security
            governance.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            3. Regulatory Compliance
          </h2>
          <p>
            All ground enforcement activities, physical possessions, and investigations strictly
            adhere to the SARFAESI Act 2002, Reserve Bank of India (RBI) guidelines, and orders of
            competent judicial and executive magistracies.
          </p>
        </div>

        <div>
          <h2 className="font-display text-lg font-bold text-navy-950 mb-2">
            4. Governing Law & Jurisdiction
          </h2>
          <p>
            Any dispute arising out of or related to these terms or services rendered shall be
            subject to the exclusive jurisdiction of the competent courts in the State of Bihar, India.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-navy-900 bg-navy-950 text-white">
      {/* Top Banner */}
      <div className="border-b border-navy-900/80 bg-navy-900/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-navy-200">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span>
                Authorized Enforcement & Investigation Ancillary Services for Secured Creditors
              </span>
            </div>
            <div className="flex items-center gap-6">
              <span>Jurisdictions: Bihar · Jharkhand · Chhattisgarh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Company Profile */}
          <div>
            <div className="mb-4">
              <span className="block font-display text-lg font-bold text-white tracking-[0.08em] leading-tight">
                PANACEA
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-gold-400 uppercase mt-1">
                Consultancy Private Limited
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Institutional enforcement and third-party investigation partner dedicated to banks,
              housing finance institutions, NBFCs, and asset reconstruction companies across Eastern
              India.
            </p>
            <div className="mt-4 pt-4 border-t border-navy-900 text-[11px] text-gray-400">
              <p className="font-semibold text-gray-300">Key Leadership</p>
              <p className="mt-1">Mr. Prashant Kumar · Managing Director</p>
              <p>Mrs. Anjana Singh · Director</p>
            </div>
          </div>

          {/* Column 2: Core Vertical Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Core Verticals
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link
                  href="/services/sarfaesi/notice-13-2"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> SARFAESI Notice Drafting (Sec 13.2)
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sarfaesi/section-14"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> Section 14 Application & Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/services/sarfaesi/possession-execution"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> Physical Possession Execution
                </Link>
              </li>
              <li>
                <Link
                  href="/services/investigation/third-party"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> Third-Party Investigation (TP)
                </Link>
              </li>
              <li>
                <Link
                  href="/services/investigation/asset-verification"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> Asset Tracing & Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/services/auction-assistance"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-gold-500">›</span> Auction & Buyer Coordination
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional Gateway & Compliance */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Institutional Governance
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Corporate Profile & Ethics
                </Link>
              </li>
              <li>
                <Link
                  href="/institutional-experience"
                  className="hover:text-white transition-colors"
                >
                  Empaneled Institutions
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="hover:text-white transition-colors">
                  Leadership & Track Record
                </Link>
              </li>
              <li>
                <Link
                  href="/security-confidentiality"
                  className="hover:text-white transition-colors"
                >
                  Data Security & Non-Disclosure
                </Link>
              </li>
              <li>
                <a
                  href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'}/login?portal=client`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-gold-300 hover:text-gold-200 font-semibold"
                >
                  Client Portal ↗
                </a>
              </li>
              <li>
                <a
                  href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'http://localhost:3001'}/admin/login`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-burgundy-300 hover:text-burgundy-200 font-semibold"
                >
                  Directorate & Admin Login ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">
              Official Contact
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div>
                <span className="block text-[11px] text-gray-400">Institutional Inquiries:</span>
                <a
                  href="mailto:panaceaconsultancypvtltd@gmail.com"
                  className="text-white hover:text-gold-300 break-all transition-colors font-mono"
                >
                  panaceaconsultancypvtltd@gmail.com
                </a>
              </div>
              <div>
                <span className="block text-[11px] text-gray-400">Operational Desks:</span>
                <p className="text-white font-mono">+91-9304897257</p>
                <p className="text-white font-mono">+91-7870657256</p>
                <p className="text-white font-mono">+91-9431432983</p>
              </div>
              <div className="pt-2 text-[11px] text-gray-400">
                <span className="block font-semibold text-gray-300">Operational Office:</span>
                <p className="text-gray-300 leading-relaxed">
                  311-C, 3rd Floor, Ashiana Galaxy, Opp. Hotel Lemon Tree, Exhibition Road, Patna -
                  800 001
                </p>
              </div>
              <div className="pt-1 text-[11px] text-gray-400">
                <span className="block font-semibold text-gray-300">Registered Office:</span>
                <p className="text-gray-300 leading-relaxed">
                  1 Van Vihar, Gali No.-2, Beside Ramawtar Apartment, Near Paras Nath Garden,
                  Ashiana Nagar, Patna - 800 025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="mt-12 border-t border-navy-900 pt-8">
          <div className="p-4 rounded-md bg-navy-900/40 border border-navy-800 text-[11px] text-gray-400 leading-relaxed mb-6">
            <span className="font-semibold text-gray-300 uppercase tracking-wider">
              Legal Confidentiality Notice:
            </span>{' '}
            Panacea Consultancy Private Limited provides specialized para-legal and enforcement
            support strictly in accordance with client institutional authorizations (Banks, NBFCs,
            ARCs, Housing Finance Companies, and Insurance Providers) under the SARFAESI Act,
            2002. All borrower information, recovery records, and case files are strictly
            confidential and privileged. This website does not solicit legal representation from the
            general public.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <p>© 2026 Panacea Consultancy Private Limited. All Rights Reserved.</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Link href="/privacy-policy" className="hover:text-gray-200 transition-colors">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link href="/terms-of-service" className="hover:text-gray-200 transition-colors">
                Terms of Service
              </Link>
              <span>·</span>
              <Link href="/legal-disclaimer" className="hover:text-gray-200 transition-colors">
                Legal Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

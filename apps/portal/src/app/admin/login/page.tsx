'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('prashant.kumar@panaceaconsultancy.com');
  const [password, setPassword] = useState('PanaceaSecure2026!#');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const res = await login(email, password, showMfa ? mfaCode : undefined);
    setSubmitting(false);

    if (res.mfaRequired) {
      setShowMfa(true);
      return;
    }

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMessage(res.error || 'Directorate authentication failed. Please verify credentials.');
    }
  };

  const handleSelectAdmin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('PanaceaSecure2026!#');
    setErrorMessage('');
    setShowMfa(false);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#071324] py-12 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4a84a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-burgundy-950 border border-gold-500/40 text-gold-400 font-display text-2xl font-bold shadow-lg">
            🏛️
          </div>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            DIRECTORATE & ADMINISTRATIVE GATEWAY
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Panacea Consultancy Private Limited · Executive Command Center
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 text-navy-950 shadow-2xl border border-gray-100">
          <div className="mb-5 rounded-md bg-burgundy-50 p-3.5 text-[11px] text-burgundy-950 border border-burgundy-200 flex items-start gap-2.5">
            <span className="text-base leading-none">🛡️</span>
            <div>
              <span className="font-bold block uppercase tracking-wider text-burgundy-900 mb-0.5">
                RESTRICTED EXECUTIVE ACCESS ONLY
              </span>
              Authorized access for Managing Director Mr. Prashant Kumar, Operations Director Mrs. Anjana Singh, Legal Counsel, and System Administrators.
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-4 rounded-md bg-burgundy-50 p-3 text-xs font-semibold text-burgundy-800 border border-burgundy-200"
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Executive / Director Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@panaceaconsultancy.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900 mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none font-mono"
              />
            </div>

            {showMfa && (
              <div className="p-3 rounded-md bg-gold-50 border border-gold-200">
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  TOTP Authenticator Code (6 Digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-md border border-gray-300 p-2 text-center text-sm font-mono tracking-widest text-navy-950 focus:border-navy-600 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md py-2.5 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50 bg-burgundy-950 hover:bg-burgundy-900 active:bg-burgundy-950"
            >
              {submitting
                ? 'Verifying Directorate Session...'
                : showMfa
                ? 'Verify MFA & Enter Command Center'
                : 'Authenticate Director & Admin Session →'}
            </button>
          </form>

          {/* Quick Leadership Accounts */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                One-Click Director & Leadership Personas
              </span>
              <span className="text-[10px] text-gray-400 font-mono">Password: PanaceaSecure2026!#</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-left">
              <button
                type="button"
                onClick={() => handleSelectAdmin('prashant.kumar@panaceaconsultancy.com')}
                className={`p-2.5 rounded border text-left text-[11px] transition-colors ${
                  email === 'prashant.kumar@panaceaconsultancy.com'
                    ? 'border-burgundy-800 bg-burgundy-50 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-burgundy-950">Mr. Prashant Kumar</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-burgundy-100 text-burgundy-800 font-bold uppercase">
                    Managing Director
                  </span>
                </div>
                <span className="text-gray-500 text-[10px] block mt-0.5">
                  Platform Super Admin · Cross-Bank Portfolio Oversight
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAdmin('anjana.singh@panaceaconsultancy.com')}
                className={`p-2.5 rounded border text-left text-[11px] transition-colors ${
                  email === 'anjana.singh@panaceaconsultancy.com'
                    ? 'border-burgundy-800 bg-burgundy-50 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-burgundy-950">Mrs. Anjana Singh</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-burgundy-100 text-burgundy-800 font-bold uppercase">
                    Director — Operations
                  </span>
                </div>
                <span className="text-gray-500 text-[10px] block mt-0.5">
                  Enforcement Administration · Field Operations Oversight
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAdmin('admin@panaceaconsultancy.in')}
                className={`p-2.5 rounded border text-left text-[11px] transition-colors ${
                  email === 'admin@panaceaconsultancy.in'
                    ? 'border-burgundy-800 bg-burgundy-50 font-semibold'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-950">Systems Administrator</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-800 font-bold uppercase">
                    Super Admin
                  </span>
                </div>
                <span className="text-gray-500 text-[10px] block mt-0.5">
                  Tenant Management, User Provisioning, System Audits
                </span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-gray-500 border-t border-gray-100 pt-3">
            Looking for bank creditor access?{' '}
            <Link href="/login?portal=client" className="text-navy-900 font-bold hover:underline">
              Switch to Bank Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

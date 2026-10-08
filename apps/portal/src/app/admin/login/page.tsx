'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (res.mfaEnrollmentRequired) {
      setErrorMessage(
        'MFA Enrollment Required: Privileged directorate accounts must enroll MFA before login.',
      );
      return;
    }

    if (res.mfaRequired) {
      setShowMfa(true);
      if (process.env.NODE_ENV !== 'production' && !mfaCode) {
        setMfaCode('000000');
      }
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
    setPassword('Panacea#DevTest2026');
    setErrorMessage('');
    setShowMfa(false);
    setMfaCode('000000');
  };

  const handleInstantLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('Panacea#DevTest2026');
    setMfaCode('000000');
    setErrorMessage('');
    setSubmitting(true);

    const res = await login(userEmail, 'Panacea#DevTest2026', '000000');
    setSubmitting(false);

    if (res.success) {
      router.push('/admin');
    } else {
      setErrorMessage(res.error || 'Directorate authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#071324] py-12 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4a84a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.06em] text-white">
            PANACEA CONSULTANCY PRIVATE LIMITED
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold-400 font-semibold">
            Directorate & Administrative Command Center
          </p>
        </div>

        {/* Login Card */}
        <div className="mt-6 rounded-2xl bg-white p-6 sm:p-8 text-navy-950 shadow-2xl border border-gray-100">
          <div className="mb-5 rounded-md bg-burgundy-50 p-3.5 text-[11px] text-burgundy-950 border border-burgundy-200 flex items-start gap-2.5">
            <svg className="h-5 w-5 text-burgundy-900 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <span className="font-bold block uppercase tracking-wider text-burgundy-900 mb-0.5">
                RESTRICTED EXECUTIVE ACCESS ONLY
              </span>
              Authorized access for Managing Director Mr. Prashant Kumar, Operations Director Mrs.
              Anjana Singh, Legal Counsel, and System Administrators.
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
                  placeholder="000000"
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

          {/* Quick Leadership Accounts (Development/Test environments ONLY - Excluded in production) */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  One-Click Director & Leadership Personas (DEV ONLY)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold">
                  Dev/Test Active
                </span>
              </div>

              <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold">Universal Dev Password: </span>
                  <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold text-amber-950">
                    Panacea#DevTest2026
                  </code>
                  <span className="mx-1.5 text-amber-400">·</span>
                  <span className="font-bold">MFA TOTP: </span>
                  <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold text-amber-950">
                    000000
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('Panacea#DevTest2026');
                    setMfaCode('000000');
                  }}
                  className="px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 font-bold text-[10px] text-amber-950 transition-colors"
                >
                  Auto-Fill Password & MFA
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2 text-left">
                <div
                  className={`p-3 rounded-lg border text-left text-[11px] transition-colors flex items-center justify-between gap-3 ${
                    email === 'prashant.kumar@panaceaconsultancy.com'
                      ? 'border-burgundy-800 bg-burgundy-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAdmin('prashant.kumar@panaceaconsultancy.com')}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-burgundy-950">Mr. Prashant Kumar</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-burgundy-100 text-burgundy-800 font-bold uppercase">
                        Managing Director
                      </span>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Platform Super Admin · Institutional Portfolio Oversight
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleInstantLogin('prashant.kumar@panaceaconsultancy.com')}
                    className="px-2.5 py-1.5 rounded bg-burgundy-900 hover:bg-burgundy-800 text-gold-400 font-bold text-[10px] whitespace-nowrap shadow-sm disabled:opacity-50"
                  >
                    Quick Sign In
                  </button>
                </div>

                <div
                  className={`p-3 rounded-lg border text-left text-[11px] transition-colors flex items-center justify-between gap-3 ${
                    email === 'anjana.singh@panaceaconsultancy.com'
                      ? 'border-burgundy-800 bg-burgundy-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAdmin('anjana.singh@panaceaconsultancy.com')}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
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
                    disabled={submitting}
                    onClick={() => handleInstantLogin('anjana.singh@panaceaconsultancy.com')}
                    className="px-2.5 py-1.5 rounded bg-burgundy-900 hover:bg-burgundy-800 text-gold-400 font-bold text-[10px] whitespace-nowrap shadow-sm disabled:opacity-50"
                  >
                    Quick Sign In
                  </button>
                </div>

                <div
                  className={`p-3 rounded-lg border text-left text-[11px] transition-colors flex items-center justify-between gap-3 ${
                    email === 'admin@panaceaconsultancy.in'
                      ? 'border-burgundy-800 bg-burgundy-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectAdmin('admin@panaceaconsultancy.in')}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-navy-950">Systems Administrator</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-800 font-bold uppercase">
                        Super Admin
                      </span>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Tenant Management, User Provisioning, System Audits
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleInstantLogin('admin@panaceaconsultancy.in')}
                    className="px-2.5 py-1.5 rounded bg-navy-900 hover:bg-navy-800 text-white font-bold text-[10px] whitespace-nowrap shadow-sm disabled:opacity-50"
                  >
                    Quick Sign In
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 text-center text-xs text-gray-500 border-t border-gray-100 pt-3">
            Looking for institutional creditor access?{' '}
            <Link href="/login?portal=client" className="text-navy-900 font-bold hover:underline">
              Switch to Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

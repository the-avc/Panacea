'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

function LoginFormContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('portal') === 'client' ? 'client' : 'staff';
  const [activeTab, setActiveTab] = useState<'staff' | 'client'>(initialTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setShowMfa(false);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const res = await login(email, password, showMfa ? mfaCode : undefined);
    setSubmitting(false);

    if (res.mfaEnrollmentRequired) {
      setErrorMessage(
        'MFA Enrollment Required: Multi-factor authentication must be enrolled for this privileged account before login can complete.',
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
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSelectDemoUser = (userEmail: string) => {
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
      router.push('/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#071324] py-12 px-4 sm:px-6 lg:px-8 text-white relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4a84a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-navy-900 border border-gold-500/40 text-gold-400 font-display text-2xl font-bold shadow-lg">
            P
          </div>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            PANACEA CONSULTANCY PRIVATE LIMITED
          </h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Institutional Operations & Secured Client Platform
          </p>
        </div>

        {/* Portal Scope Switcher Tabs */}
        <div className="mt-6 flex rounded-lg bg-navy-900/90 p-1 border border-navy-800 shadow-md">
          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'staff'
                ? 'bg-burgundy-900 text-gold-300 shadow-sm border border-gold-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>🏛️</span>
            <span>Company Directorate & Operations Staff</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'client'
                ? 'bg-navy-800 text-white shadow-sm border border-gold-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>🏦</span>
            <span>Empanelled Bank Clients</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="mt-4 rounded-2xl bg-white p-6 sm:p-8 text-navy-950 shadow-2xl border border-gray-100">
          <div className="mb-5 rounded-md bg-navy-50 p-3 text-[11px] text-navy-800 border border-navy-100 flex items-start gap-2.5">
            <span className="text-base leading-none">🛡️</span>
            <div>
              <span className="font-bold block uppercase tracking-wider text-navy-950 mb-0.5">
                {activeTab === 'staff'
                  ? 'RESTRICTED EXECUTIVE & ENFORCEMENT GATEWAY'
                  : 'AUTHORIZED SECURED CREDITOR ACCESS ONLY'}
              </span>
              {activeTab === 'staff'
                ? 'Authorized access for Managing Directors, Operations Heads, Legal Recovery Advocates, and Field Investigators.'
                : 'Secured access for Empanelled Bank Nodal Officers and Recovery Desks under SARFAESI Act, 2002.'}
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
                {activeTab === 'staff' ? 'Company Staff / Director Email' : 'Institutional Bank Officer Email'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'staff' ? 'director@panaceaconsultancy.com' : 'nodal.officer@bank.com'}
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
                <p className="mt-1 text-[10px] text-gray-500">
                  Enter the one-time code from your registered authentication device.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-md py-2.5 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50 ${
                activeTab === 'staff'
                  ? 'bg-burgundy-950 hover:bg-burgundy-900 active:bg-burgundy-950'
                  : 'bg-navy-950 hover:bg-navy-900 active:bg-navy-950'
              }`}
            >
              {submitting
                ? 'Verifying Security Session...'
                : showMfa
                ? 'Verify MFA & Enter Command Center'
                : activeTab === 'staff'
                ? 'Authenticate Directorate & Staff Session →'
                : 'Authenticate & Enter Bank Portal →'}
            </button>
          </form>

          {/* Quick Demo Personas Selector (Development / Test Environments ONLY — Never exposed in production) */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {activeTab === 'staff'
                    ? 'Fast-Switch Company & Director Personas'
                    : 'Fast-Switch Bank Client Personas'}
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold">
                  Dev/Test Active
                </span>
              </div>

              <div className="mb-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold">⚡ Universal Dev Password: </span>
                  <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold text-amber-950">Panacea#DevTest2026</code>
                  <span className="mx-1.5 text-amber-400">·</span>
                  <span className="font-bold">MFA TOTP: </span>
                  <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold text-amber-950">000000</code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('Panacea#DevTest2026');
                    setMfaCode('000000');
                  }}
                  className="px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 font-bold text-[10px] text-amber-950 transition-colors"
                >
                  ⚡ Auto-Fill Password & MFA
                </button>
              </div>

              {activeTab === 'staff' ? (
                <div className="grid grid-cols-1 gap-1.5 text-left">
                  <div
                    onClick={() => handleSelectDemoUser('prashant.kumar@panaceaconsultancy.com')}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer ${
                      email === 'prashant.kumar@panaceaconsultancy.com'
                        ? 'border-burgundy-800 bg-burgundy-50 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-burgundy-950">Mr. Prashant Kumar</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-burgundy-100 text-burgundy-800 font-bold uppercase">
                          Managing Director
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin('prashant.kumar@panaceaconsultancy.com');
                          }}
                          className="text-[10px] bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold px-2 py-0.5 rounded shadow-sm"
                        >
                          ⚡ Quick Sign In
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Lead Strategist & Executive Platform Super Admin
                    </span>
                  </div>

                  <div
                    onClick={() => handleSelectDemoUser('anjana.singh@panaceaconsultancy.com')}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer ${
                      email === 'anjana.singh@panaceaconsultancy.com'
                        ? 'border-burgundy-800 bg-burgundy-50 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-burgundy-950">Mrs. Anjana Singh</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-burgundy-100 text-burgundy-800 font-bold uppercase">
                          Director — Operations
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin('anjana.singh@panaceaconsultancy.com');
                          }}
                          className="text-[10px] bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold px-2 py-0.5 rounded shadow-sm"
                        >
                          ⚡ Quick Sign In
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Field Enforcement Oversight & Institutional Case Management
                    </span>
                  </div>

                  <div
                    onClick={() => handleSelectDemoUser('legal.officer@panaceaconsultancy.in')}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer ${
                      email === 'legal.officer@panaceaconsultancy.in'
                        ? 'border-navy-800 bg-navy-50 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-950">Adv. Rajesh Verma</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-800 font-bold uppercase">
                          Legal Recovery Lead
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin('legal.officer@panaceaconsultancy.in');
                          }}
                          className="text-[10px] bg-navy-950 hover:bg-navy-900 text-white font-bold px-2 py-0.5 rounded shadow-sm"
                        >
                          ⚡ Quick Sign In
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      SARFAESI Sec 13(2), Sec 14 Petitions & DM Court Liaison
                    </span>
                  </div>

                  <div
                    onClick={() => handleSelectDemoUser('investigation@panaceaconsultancy.in')}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer ${
                      email === 'investigation@panaceaconsultancy.in'
                        ? 'border-navy-800 bg-navy-50 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-950">Suresh Pandey</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-navy-100 text-navy-800 font-bold uppercase">
                          Chief Investigator
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin('investigation@panaceaconsultancy.in');
                          }}
                          className="text-[10px] bg-navy-950 hover:bg-navy-900 text-white font-bold px-2 py-0.5 rounded shadow-sm"
                        >
                          ⚡ Quick Sign In
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Asset Verification, Title Tracing & Fraud Detection Lead
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1.5 text-left">
                  <div
                    onClick={() => handleSelectDemoUser('nodal.officer@icicibank.com')}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer ${
                      email === 'nodal.officer@icicibank.com'
                        ? 'border-navy-800 bg-navy-50 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-950">ICICI Bank Limited</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold uppercase">
                          SAMG Patna Nodal
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin('nodal.officer@icicibank.com');
                          }}
                          className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white font-bold px-2 py-0.5 rounded shadow-sm"
                        >
                          ⚡ Quick Sign In
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Secured Creditor Mandate — Amitabh Sen
                    </span>
                  </div>

                  <div
                    onClick={() => handleSelectDemoUser('recovery.desk@axisbank.com')}
                    className={`p-2 rounded border text-left text-[11px] transition-colors cursor-pointer ${
                      email === 'recovery.desk@axisbank.com'
                        ? 'border-navy-800 bg-navy-50 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-950">Axis Bank Limited</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold uppercase">
                          Recovery Desk Dhanbad
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstantLogin('recovery.desk@axisbank.com');
                          }}
                          className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-2 py-0.5 rounded shadow-sm"
                        >
                          ⚡ Quick Sign In
                        </button>
                      </div>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">
                      Secured Creditor Mandate — Priya Sharma
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#071324] text-white">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}

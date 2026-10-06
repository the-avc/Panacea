'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    institutionName: '',
    officerName: '',
    designation: '',
    email: '',
    phone: '',
    serviceVertical: 'sarfaesi',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Process contact inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Institutional Communications
            </span>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Connect With Our Operational Desks
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              For new empanelment inquiries, district-specific enforcement coordination, and
              institutional service requests across Bihar, Jharkhand, and Chhattisgarh.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-burgundy-700">
                  Headquarters & Regional Reach
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-navy-950">
                  Panacea Consultancy Private Limited
                </h2>
                <p className="mt-3 text-xs text-gray-600 leading-relaxed">
                  Specialized enforcement and investigation ancillary services provider for secured
                  creditors and financial institutions.
                </p>
              </div>

              {/* Direct Channels */}
              <div className="rounded-xl border border-gray-200 bg-[#fbfcfd] p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                    Official Inquiries Email
                  </h4>
                  <a
                    href="mailto:panaceaconsultancypvtltd@gmail.com"
                    className="mt-1 block text-sm font-semibold text-navy-900 hover:text-burgundy-700 break-all transition-colors"
                  >
                    panaceaconsultancypvtltd@gmail.com
                  </a>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Monitored by executive leadership for official communication.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                    Operational Telephone Desks
                  </h4>
                  <div className="mt-2 space-y-1 font-mono text-sm text-navy-900">
                    <p className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-sans">Desk 1:</span>
                      <a href="tel:+919304897257" className="hover:text-burgundy-700 font-semibold">
                        +91-9304897257
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-sans">Desk 2:</span>
                      <a href="tel:+919431432983" className="hover:text-burgundy-700 font-semibold">
                        +91-9431432983
                      </a>
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Available during statutory court and administrative hours.
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                    Active Operational States
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded bg-navy-50 text-navy-800 text-xs font-semibold">
                      Bihar
                    </span>
                    <span className="px-2.5 py-1 rounded bg-navy-50 text-navy-800 text-xs font-semibold">
                      Jharkhand
                    </span>
                    <span className="px-2.5 py-1 rounded bg-navy-50 text-navy-800 text-xs font-semibold">
                      Chhattisgarh
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Advisory */}
              <div className="rounded-xl border border-navy-100 bg-navy-50/60 p-5 text-xs text-navy-950 leading-relaxed">
                <span className="font-bold uppercase tracking-wider block mb-1">
                  Confidential Docket Advisory:
                </span>
                Please do not submit sensitive borrower loan details or non-public case dockets
                through this public contact form. Active docket updates and certified order downloads
                must be conducted through the authenticated{' '}
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-burgundy-700 underline"
                >
                  Client Portal
                </a>
                .
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-gray-200 bg-white p-8 lg:p-10 shadow-sm">
                <h3 className="font-display text-xl font-bold text-navy-950 mb-2">
                  Institutional Inquiry Form
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Please provide official institutional credentials to verify your inquiry.
                </p>

                {submitted ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-3">
                      ✓
                    </div>
                    <h4 className="text-base font-bold text-emerald-950">Inquiry Dispatched</h4>
                    <p className="mt-1 text-xs text-emerald-800 max-w-md mx-auto">
                      Thank you. Your communication has been routed to our leadership desk. An
                      authorized representative will follow up via your official email address.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 text-xs font-semibold text-emerald-900 underline"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy-900 mb-1">
                          Financial Institution / Bank *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.institutionName}
                          onChange={(e) =>
                            setFormData({ ...formData, institutionName: e.target.value })
                          }
                          placeholder="e.g. ICICI Bank / Axis Bank / Scheduled Commercial Bank"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy-900 mb-1">
                          Officer Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.officerName}
                          onChange={(e) =>
                            setFormData({ ...formData, officerName: e.target.value })
                          }
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-navy-900 mb-1">
                          Official Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="officer@bank.com"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-navy-900 mb-1">
                          Official Phone / Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91-XXXXX-XXXXX"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">
                        Service Vertical Required *
                      </label>
                      <select
                        value={formData.serviceVertical}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceVertical: e.target.value })
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                      >
                        <option value="sarfaesi">SARFAESI Enforcement (Sec 13.2 / Sec 14)</option>
                        <option value="investigation">Third-Party (TP) Investigation</option>
                        <option value="asset_verification">Asset Verification & Physical Inspection</option>
                        <option value="auction_assistance">Auction & Recovery Assistance</option>
                        <option value="empanelment">New Institutional Empanelment Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-navy-900 mb-1">
                        Inquiry Details / Scope of Assignment *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Specify target district, required service scope, and timeline constraints..."
                        className="w-full rounded-md border border-gray-300 p-3 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-md bg-navy-950 hover:bg-navy-900 active:bg-navy-950 py-3 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50"
                    >
                      {loading ? 'Transmitting Secure Inquiry...' : 'Submit Institutional Inquiry →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

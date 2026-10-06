'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PortalLayout } from '../../../components/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';

export default function CaseDetailPage() {
  const { isPanaceaStaff, isDirector } = useAuth();
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status transition modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const [statusError, setStatusError] = useState('');

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadMime, setUploadMime] = useState('application/pdf');
  const [uploadClassification, setUploadClassification] = useState('confidential');
  const [uploading, setUploading] = useState(false);

  // Officer Assignment modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigneeName, setAssigneeName] = useState('Adv. Rajesh Verma');
  const [assignRole, setAssignRole] = useState('LEAD_OFFICER');
  const [assigning, setAssigning] = useState(false);

  const loadCaseDetails = async () => {
    setLoading(true);
    const [cRes, dRes, hRes, aRes] = await Promise.all([
      apiFetch<any>(`/cases/${caseId}`),
      apiFetch<any>(`/cases/${caseId}/documents`),
      apiFetch<any>(`/cases/${caseId}/history`),
      apiFetch<any>(`/cases/${caseId}/assignments`),
    ]);

    if (cRes.data) setCaseData(cRes.data);
    if (dRes.data) setDocuments(dRes.data);
    if (hRes.data) setHistory(hRes.data);
    if (aRes.data) setAssignments(aRes.data);
    setLoading(false);
  };

  useEffect(() => {
    if (caseId) {
      loadCaseDetails();
    }
  }, [caseId]);

  const handleStatusTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusError('');
    setTransitioning(true);

    const res = await apiFetch<any>(`/cases/${caseId}/status`, {
      method: 'POST',
      body: JSON.stringify({
        newStatus,
        reason: statusReason,
      }),
    });

    setTransitioning(false);

    if (res.error) {
      setStatusError(res.error.message);
      return;
    }

    setShowStatusModal(false);
    setNewStatus('');
    setStatusReason('');
    loadCaseDetails();
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const res = await apiFetch<any>(`/cases/${caseId}/documents/upload`, {
      method: 'POST',
      body: JSON.stringify({
        filename: uploadFilename,
        mimeType: uploadMime,
        sizeBytes: 1540200, // mock 1.5MB
        classification: uploadClassification,
      }),
    });

    setUploading(false);
    if (res.data?.id) {
      setShowUploadModal(false);
      setUploadFilename('');
      loadCaseDetails();
    }
  };

  const handleAssignOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    await apiFetch(`/cases/${caseId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({
        teamReference: assigneeName,
        assignmentType: assignRole,
      }),
    });
    setAssigning(false);
    setShowAssignModal(false);
    loadCaseDetails();
  };

  const handleDownload = async (docId: string, filename: string) => {
    const res = await apiFetch<any>(`/documents/${docId}/download`, {
      method: 'POST',
    });

    if (res.data?.downloadUrl) {
      alert(`Secure download authorized. Ephemeral signed link issued for "${filename}" (5-minute TTL).`);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy-200 border-t-navy-900" />
        </div>
      </PortalLayout>
    );
  }

  if (!caseData) {
    return (
      <PortalLayout>
        <div className="p-8 text-center bg-white rounded-xl border border-gray-200">
          <h2 className="font-display text-lg font-bold text-navy-950">Docket Not Found</h2>
          <p className="mt-1 text-xs text-gray-500">
            This case docket does not exist or you lack authorization to inspect it across organization boundaries.
          </p>
          <Link href="/cases" className="mt-4 inline-block text-xs font-semibold text-burgundy-700 underline">
            ← Return to Dockets
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div>
          <Link href="/cases" className="text-xs font-semibold text-gray-500 hover:text-navy-900">
            ← Back to Cases
          </Link>
        </div>

        {/* Docket Summary Header */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-700">
                  {caseData.classification}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  Ref: {caseData.external_reference || 'N/A'}
                </span>
              </div>
              <h1 className="font-display text-2xl font-bold text-navy-950">{caseData.title}</h1>
              <p className="mt-1 text-xs text-gray-500">
                Principal Secured Creditor:{' '}
                <span className="font-semibold text-navy-900">{caseData.organizationName}</span> · Created on{' '}
                {new Date(caseData.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800 capitalize border border-navy-200">
                Current: {caseData.status.replace(/_/g, ' ')}
              </span>
              <button
                type="button"
                onClick={() => setShowStatusModal(true)}
                className="rounded-md bg-navy-950 hover:bg-navy-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
              >
                Advance Status Milestone
              </button>
            </div>
          </div>
        </div>

        {/* Documents & Assigned Personnel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Document Repository (8 cols) */}
          <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-display text-base font-bold text-navy-950">
                Docket Document Vault ({documents.length})
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-xs font-semibold text-navy-900 transition-colors"
              >
                + Upload Document
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 italic">
                No statutory documents uploaded for this docket yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-xs shrink-0">
                        PDF
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-navy-950 truncate">
                          {doc.originalFilename}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {Math.round(doc.sizeBytes / 1024)} KB · Uploaded on{' '}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(doc.id, doc.originalFilename)}
                      className="shrink-0 rounded bg-navy-50 hover:bg-navy-100 text-navy-900 font-semibold px-3 py-1.5 text-xs transition-colors"
                    >
                      Download Signed URL
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assigned Officers (4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="font-display text-base font-bold text-navy-950">
                Enforcement Officers Assigned
              </h2>
              {isPanaceaStaff && (
                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  className="rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-navy-900 transition-colors"
                >
                  + Assign
                </button>
              )}
            </div>

            {assignments.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 italic">
                No enforcement officers explicitly assigned. Handled by Panacea General Operations.
              </div>
            ) : (
              <div className="space-y-3">
                {assignments.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                    <div className="font-semibold text-navy-950">
                      {a.userDisplayName || a.team_reference}
                    </div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wide">
                      {a.assignment_type.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Transition History Timeline */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-display text-base font-bold text-navy-950 border-b border-gray-100 pb-3">
            Milestone Transition History & Statutory Timeline
          </h2>

          <div className="space-y-4">
            {history.map((h, i) => (
              <div key={h.id} className="flex items-start gap-4 text-xs">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-navy-800" />
                  {i < history.length - 1 && <div className="w-0.5 h-12 bg-gray-200" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-950 capitalize">
                      {h.new_status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(h.changed_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 mt-0.5">
                    Authorized Officer: <span className="font-medium text-navy-900">{h.changedByName}</span>
                  </div>
                  {h.reason && (
                    <div className="mt-1 text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 text-[11px]">
                      &quot;{h.reason}&quot;
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advance Status Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
              <h3 className="font-display text-lg font-bold text-navy-950 mb-3">
                Advance Status Milestone
              </h3>

              {statusError && (
                <div className="mb-3 p-2.5 rounded bg-burgundy-50 border border-burgundy-200 text-xs text-burgundy-800 font-semibold">
                  {statusError}
                </div>
              )}

              <form onSubmit={handleStatusTransition} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Select New Milestone *
                  </label>
                  <select
                    required
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  >
                    <option value="">Choose milestone...</option>
                    <option value="notice_drafting">Notice Drafting</option>
                    <option value="notice_served">Notice Served</option>
                    <option value="sec14_filing">Section 14 Filing</option>
                    <option value="hearing_scheduled">Hearing Scheduled</option>
                    <option value="order_obtained">Order Obtained</option>
                    <option value="possession_scheduled">Possession Scheduled</option>
                    <option value="possession_taken">Possession Taken</option>
                    <option value="closed">Closed / Settled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Transition Justification / Remarks *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    placeholder="Provide statutory order reference, court memo details, or reason for transition..."
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={transitioning}
                    className="rounded bg-navy-950 hover:bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {transitioning ? 'Advancing...' : 'Confirm Transition'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload Document Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
              <h3 className="font-display text-lg font-bold text-navy-950 mb-3">
                Upload Case Docket Document
              </h3>

              <form onSubmit={handleUploadDocument} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Document Title / File Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadFilename}
                    onChange={(e) => setUploadFilename(e.target.value)}
                    placeholder="e.g. Certified_Section14_Order_Patna_DM.pdf"
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Classification *
                  </label>
                  <select
                    value={uploadClassification}
                    onChange={(e) => setUploadClassification(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  >
                    <option value="confidential">CONFIDENTIAL</option>
                    <option value="restricted">RESTRICTED</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="rounded bg-navy-950 hover:bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {uploading ? 'Validating & Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assign Enforcement Officer Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
              <h3 className="font-display text-lg font-bold text-navy-950 mb-1">
                Assign Enforcement Officer
              </h3>
              <p className="text-[11px] text-gray-500 mb-4">
                Assign lead advocate, field recovery agent, or investigator to this active docket.
              </p>

              <form onSubmit={handleAssignOfficer} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Officer / Advocate / Team Reference *
                  </label>
                  <input
                    type="text"
                    required
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    placeholder="e.g. Adv. Rajesh Verma / Field Team Alpha"
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Assignment Mandate Role *
                  </label>
                  <select
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  >
                    <option value="LEAD_OFFICER">LEAD ENFORCEMENT OFFICER</option>
                    <option value="LEGAL_COUNSEL">LEGAL COUNSEL / ADVOCATE (DM COURT)</option>
                    <option value="FIELD_RECOVERY_AGENT">FIELD RECOVERY & PHYSICAL ASSET AGENT</option>
                    <option value="INVESTIGATOR">CHIEF INVESTIGATOR & ASSET TRACER</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={assigning}
                    className="rounded bg-burgundy-900 hover:bg-burgundy-800 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {assigning ? 'Assigning Officer...' : 'Confirm Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

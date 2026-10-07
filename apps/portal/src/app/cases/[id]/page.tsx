'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PortalLayout } from '../../../components/PortalLayout';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch, API_ORIGIN } from '../../../lib/api';

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

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadClassification, setUploadClassification] = useState('confidential');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState('');
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFilePicked = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File exceeds maximum limit of 50MB.');
      return;
    }
    setSelectedFile(file);
    setUploadError('');
    if (!uploadFilename.trim()) {
      setUploadFilename(file.name);
    }
  };

  const handleAttachSamplePdf = () => {
    // Generate valid statutory PDF with standard magic bytes (%PDF-1.4)
    const samplePdfContent =
      '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources <<>> /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n190\n%%EOF';
    const blob = new Blob([samplePdfContent], { type: 'application/pdf' });
    const testFile = new File(
      [blob],
      `Statutory_Demand_Notice_13_2_${Date.now().toString().slice(-4)}.pdf`,
      { type: 'application/pdf' },
    );
    setSelectedFile(testFile);
    setUploadFilename(testFile.name);
    setUploadError('');
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload or click "Attach Sample PDF".');
      return;
    }

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', selectedFile, uploadFilename.trim() || selectedFile.name);
    formData.append('classification', uploadClassification);

    const res = await apiFetch<any>(`/cases/${caseId}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    setUploading(false);
    if (res.error) {
      setUploadError(res.error.message || 'Upload failed. Disallowed type or corrupted bytes.');
      return;
    }

    if (res.data?.id) {
      setShowUploadModal(false);
      setSelectedFile(null);
      setUploadFilename('');
      setUploadSuccessToast(
        `Document "${res.data.originalFilename || uploadFilename}" uploaded & registered in vault!`,
      );
      setTimeout(() => setUploadSuccessToast(''), 4500);
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
    setDownloadingDocId(docId);
    try {
      const res = await apiFetch<any>(`/documents/${docId}/download`, {
        method: 'POST',
      });

      if (res.error) {
        alert(`Download error: ${res.error.message}`);
        return;
      }

      if (res.data?.downloadUrl) {
        const fullUrl = `${API_ORIGIN}${res.data.downloadUrl}`;
        const anchor = document.createElement('a');
        anchor.href = fullUrl;
        anchor.download = filename || res.data.filename || 'case-document.pdf';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

        setUploadSuccessToast(`Secure signed download started for "${filename}"`);
        setTimeout(() => setUploadSuccessToast(''), 4000);
      }
    } catch {
      alert('Failed to initiate secure document download.');
    } finally {
      setDownloadingDocId(null);
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
                onClick={() => {
                  setUploadError('');
                  setShowUploadModal(true);
                }}
                className="rounded-md bg-navy-950 hover:bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span>+</span>
                <span>Upload Document</span>
              </button>
            </div>

            {uploadSuccessToast && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>✅</span>
                  <span>{uploadSuccessToast}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setUploadSuccessToast('')}
                  className="text-emerald-700 hover:text-emerald-900 text-xs"
                >
                  ✕
                </button>
              </div>
            )}

            {documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 italic">
                No statutory documents uploaded for this docket yet. Click "+ Upload Document" above to upload or attach statutory notices.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-navy-50 text-navy-900 border border-navy-100 flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.mimeType?.includes('pdf')
                          ? 'PDF'
                          : doc.mimeType?.includes('image')
                          ? 'IMG'
                          : 'DOC'}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-navy-950 truncate">
                          {doc.originalFilename}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                          <span>{Math.round(doc.sizeBytes / 1024)} KB</span>
                          <span>·</span>
                          <span className="uppercase text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                            {doc.classification}
                          </span>
                          <span>·</span>
                          <span>Uploaded {new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={downloadingDocId === doc.id}
                      onClick={() => handleDownload(doc.id, doc.originalFilename)}
                      className="shrink-0 rounded-md bg-navy-50 hover:bg-navy-100 text-navy-900 font-semibold px-3 py-1.5 text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <span>📥</span>
                      <span>{downloadingDocId === doc.id ? 'Streaming...' : 'Download File'}</span>
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
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-display text-lg font-bold text-navy-950">
                    Upload Case Docket Document
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Encrypted vault storage · Multi-tenant isolated · SHA-256 verified
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setUploadError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ✕
                </button>
              </div>

              {uploadError && (
                <div
                  role="alert"
                  className="mt-4 p-3 rounded-md bg-burgundy-50 border border-burgundy-200 text-xs font-semibold text-burgundy-800 flex items-center gap-2"
                >
                  <span>⚠️</span>
                  <span>{uploadError}</span>
                </div>
              )}

              <form onSubmit={handleUploadDocument} className="mt-4 space-y-4">
                {/* File Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Select File (PDF, JPEG, PNG, DOCX, XLSX — Max 50MB) *
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFilePicked(e.target.files[0]);
                      }
                    }}
                  />

                  {selectedFile ? (
                    <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          ✓
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-navy-950 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'Document'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs text-burgundy-700 hover:text-burgundy-900 font-semibold px-2 py-1 rounded hover:bg-burgundy-50"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFilePicked(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-6 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-navy-900 bg-navy-50'
                          : 'border-gray-300 hover:border-navy-500 hover:bg-gray-50/60'
                      }`}
                    >
                      <div className="text-2xl mb-1">📄</div>
                      <p className="text-xs font-semibold text-navy-950">
                        Drag & drop statutory document here, or{' '}
                        <span className="text-burgundy-800 underline">browse files</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Supported: Statutory 13(2) Notices, Section 14 Petitions, Certified DM Orders, Panchnamas
                      </p>
                    </div>
                  )}

                  {/* 1-Click Test Attachment Helper */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Quick Testing:</span>
                    <button
                      type="button"
                      onClick={handleAttachSamplePdf}
                      className="text-xs font-semibold text-navy-800 hover:text-navy-950 bg-navy-50 hover:bg-navy-100 px-2.5 py-1 rounded transition-colors flex items-center gap-1 border border-navy-200"
                    >
                      <span>⚡</span>
                      <span>Attach Sample Statutory Notice PDF</span>
                    </button>
                  </div>
                </div>

                {/* Custom Display Title */}
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Document Display Name / Docket Filing Title
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadFilename}
                    onChange={(e) => setUploadFilename(e.target.value)}
                    placeholder="e.g. Certified_Section14_Order_Patna_DM.pdf"
                    className="w-full rounded-md border border-gray-300 p-2.5 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  />
                </div>

                {/* Classification */}
                <div>
                  <label className="block text-xs font-semibold text-navy-900 mb-1">
                    Security Classification *
                  </label>
                  <select
                    value={uploadClassification}
                    onChange={(e) => setUploadClassification(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2.5 text-xs text-navy-950 focus:border-navy-600 focus:outline-none"
                  >
                    <option value="confidential">CONFIDENTIAL (Standard Creditor / Nodal Officer Access)</option>
                    <option value="restricted">RESTRICTED (Directorate & Administrative Roles Only)</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setUploadError('');
                    }}
                    className="rounded border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="rounded-md bg-navy-950 hover:bg-navy-900 px-5 py-2 text-xs font-semibold text-white shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {uploading && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    <span>{uploading ? 'Validating Magic Bytes & Uploading...' : 'Upload & Secure in Vault'}</span>
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

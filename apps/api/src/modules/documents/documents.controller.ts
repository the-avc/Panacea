import { Router, Response } from 'express';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { isPanaceaInternalRole } from '../../common/guards/tenant.guard';
import { logAuditEvent } from '../../common/middleware/audit';

const router = Router();

// Allowed MIME types per security spec
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Sanitizes uploaded filenames, stripping path traversals and control characters
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[/\\]/g, '_')
    .replace(/\.\./g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Handler for GET /cases/:caseId/documents
 */
export const getCaseDocumentsHandler = (req: AppRequest, res: Response, next: any) => {
  const caseId = (req.params.caseId || req.params.id) as string;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  const foundCase = isInternal
    ? db.cases.find((c) => c.id === caseId)
    : db.getCaseByIdAndOrg(caseId, req.user!.organization_id);

  if (!foundCase) {
    return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
  }

  // Filter out internal storage_key from client payload
  const docs = db.getDocumentsByCase(caseId).map((d) => ({
    id: d.id,
    caseId: d.case_id,
    classification: d.classification,
    originalFilename: d.original_filename,
    mimeType: d.mime_type,
    sizeBytes: d.size_bytes,
    status: d.status,
    uploadedBy: d.uploaded_by,
    createdAt: d.created_at,
  }));

  return res.status(200).json({
    data: docs,
    requestId: req.requestId,
  });
};

/**
 * Handler for POST /cases/:caseId/documents/upload
 */
export const uploadCaseDocumentHandler = (req: AppRequest, res: Response, next: any) => {
  const caseId = (req.params.caseId || req.params.id) as string;
  const { filename, mimeType, sizeBytes, classification = 'confidential' } = req.body;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  const foundCase = isInternal
    ? db.cases.find((c) => c.id === caseId)
    : db.getCaseByIdAndOrg(caseId, req.user!.organization_id);

  if (!foundCase) {
    return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
  }

  if (!filename || !mimeType || !sizeBytes) {
    return next(
      new AppError(
        'Missing required upload parameters: filename, mimeType, sizeBytes.',
        'VALIDATION_ERROR',
        400,
      ),
    );
  }

  // 1. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return next(
      new AppError(
        `Disallowed file type: ${mimeType}. Allowed formats: PDF, JPEG, PNG, DOCX, XLSX.`,
        'DISALLOWED_FILE_TYPE',
        415,
      ),
    );
  }

  // 2. Validate Size
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return next(
      new AppError(
        `File exceeds maximum limit of 50MB (received ${Math.round(sizeBytes / 1024 / 1024)}MB).`,
        'FILE_TOO_LARGE',
        413,
      ),
    );
  }

  // 3. Sanitize filename
  const safeFilename = sanitizeFilename(filename);

  // 4. Generate private storage key (NEVER exposed to client)
  const privateStorageKey = `vault/${foundCase.organization_id}/${caseId}/${uuidv4()}_${safeFilename}`;
  const mockChecksum = crypto.createHash('sha256').update(safeFilename + Date.now()).digest('hex');

  const newDocument = {
    id: uuidv4(),
    case_id: caseId,
    classification,
    original_filename: safeFilename,
    storage_key: privateStorageKey, // stored in DB, stripped from responses
    mime_type: mimeType,
    size_bytes: sizeBytes,
    checksum: mockChecksum,
    status: 'available' as const,
    uploaded_by: req.user!.id,
    created_at: new Date().toISOString(),
  };

  db.documents.push(newDocument);

  // Version 1
  db.documentVersions.push({
    id: uuidv4(),
    document_id: newDocument.id,
    version_number: 1,
    storage_key: privateStorageKey,
    checksum: mockChecksum,
    size_bytes: sizeBytes,
    uploaded_by: req.user!.id,
    created_at: new Date().toISOString(),
  });

  logAuditEvent({
    actorUserId: req.user!.id,
    organizationId: foundCase.organization_id,
    eventType: 'DOCUMENT_UPLOADED',
    action: 'UPLOAD',
    resourceType: 'DOCUMENT',
    resourceId: newDocument.id,
    result: 'success',
    requestId: req.requestId,
    metadata: {
      filename: safeFilename,
      sizeBytes,
      classification,
      caseId,
    },
  });

  return res.status(201).json({
    data: {
      id: newDocument.id,
      caseId: newDocument.case_id,
      classification: newDocument.classification,
      originalFilename: newDocument.original_filename,
      mimeType: newDocument.mime_type,
      sizeBytes: newDocument.size_bytes,
      status: newDocument.status,
      createdAt: newDocument.created_at,
    },
    requestId: req.requestId,
  });
};

/**
 * Also support /documents/cases/:caseId/documents if invoked via documents router
 */
router.get('/cases/:caseId/documents', requireAuth, getCaseDocumentsHandler);
router.post('/cases/:caseId/documents/upload', requireAuth, uploadCaseDocumentHandler);

/**
 * GET /documents/:id
 * Retrieve document metadata
 */
router.get('/:id', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const doc = db.getDocumentById(id);

  if (!doc) {
    return next(new AppError('Document not found.', 'NOT_FOUND', 404));
  }

  const foundCase = db.cases.find((c) => c.id === doc.case_id);
  const isInternal = isPanaceaInternalRole(req.user!.role);

  if (!isInternal && foundCase?.organization_id !== req.user!.organization_id) {
    return next(new AppError('Document not found.', 'NOT_FOUND', 404));
  }

  return res.status(200).json({
    data: {
      id: doc.id,
      caseId: doc.case_id,
      classification: doc.classification,
      originalFilename: doc.original_filename,
      mimeType: doc.mime_type,
      sizeBytes: doc.size_bytes,
      status: doc.status,
      uploadedBy: doc.uploaded_by,
      createdAt: doc.created_at,
    },
    requestId: req.requestId,
  });
});

/**
 * POST /documents/:id/download
 * Generates short-lived temporary access token (5-minute TTL) & audits download event
 */
router.post('/:id/download', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const doc = db.getDocumentById(id);

  if (!doc) {
    return next(new AppError('Document not found.', 'NOT_FOUND', 404));
  }

  const foundCase = db.cases.find((c) => c.id === doc.case_id);
  const isInternal = isPanaceaInternalRole(req.user!.role);

  if (!isInternal && foundCase?.organization_id !== req.user!.organization_id) {
    logAuditEvent({
      actorUserId: req.user!.id,
      organizationId: req.user!.organization_id,
      eventType: 'DOCUMENT_ACCESS_DENIED',
      action: 'DOWNLOAD',
      resourceType: 'DOCUMENT',
      resourceId: id,
      result: 'denied',
      requestId: req.requestId,
      metadata: { attemptedDocumentCaseId: doc.case_id },
    });
    return next(new AppError('Access denied.', 'FORBIDDEN', 403));
  }

  // Generate 5-minute signed token
  const downloadToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  logAuditEvent({
    actorUserId: req.user!.id,
    organizationId: foundCase?.organization_id,
    eventType: 'DOCUMENT_DOWNLOADED',
    action: 'DOWNLOAD',
    resourceType: 'DOCUMENT',
    resourceId: doc.id,
    result: 'success',
    requestId: req.requestId,
    metadata: { filename: doc.original_filename },
  });

  return res.status(200).json({
    data: {
      downloadUrl: `/api/v1/documents/${doc.id}/stream?token=${downloadToken}`,
      filename: doc.original_filename,
      mimeType: doc.mime_type,
      expiresAt,
    },
    requestId: req.requestId,
  });
});

/**
 * GET /documents/:id/versions
 */
router.get('/:id/versions', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const doc = db.getDocumentById(id);

  if (!doc) {
    return next(new AppError('Document not found.', 'NOT_FOUND', 404));
  }

  const versions = db.documentVersions
    .filter((v) => v.document_id === id)
    .map((v) => ({
      id: v.id,
      versionNumber: v.version_number,
      sizeBytes: v.size_bytes,
      createdAt: v.created_at,
    }));

  return res.status(200).json({
    data: versions,
    requestId: req.requestId,
  });
});

/**
 * DELETE /documents/:id
 * Soft deletion with audit trail
 */
router.delete('/:id', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const doc = db.getDocumentById(id);

  if (!doc) {
    return next(new AppError('Document not found.', 'NOT_FOUND', 404));
  }

  const foundCase = db.cases.find((c) => c.id === doc.case_id);
  const isInternal = isPanaceaInternalRole(req.user!.role);

  if (!isInternal && foundCase?.organization_id !== req.user!.organization_id) {
    return next(new AppError('Access denied.', 'FORBIDDEN', 403));
  }

  doc.status = 'deleted';

  logAuditEvent({
    actorUserId: req.user!.id,
    organizationId: foundCase?.organization_id,
    eventType: 'DOCUMENT_DELETED',
    action: 'DELETE',
    resourceType: 'DOCUMENT',
    resourceId: id,
    result: 'success',
    requestId: req.requestId,
    metadata: { filename: doc.original_filename },
  });

  return res.status(200).json({
    data: { message: 'Document removed from active repository.' },
    requestId: req.requestId,
  });
});

export default router;

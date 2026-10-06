import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../database/db';
import { AppRequest } from '../../common/types';
import { AppError } from '../../common/filters/error.filter';
import { requireAuth } from '../../common/guards/auth.guard';
import { isPanaceaInternalRole } from '../../common/guards/tenant.guard';
import { logAuditEvent } from '../../common/middleware/audit';
import {
  getCaseDocumentsHandler,
  uploadCaseDocumentHandler,
  upload,
} from '../documents/documents.controller';

const router = Router();

// Approved State Machine transitions (SYSTEM-SPEC & API-SPEC §7)
const VALID_TRANSITIONS: Record<string, string[]> = {
  intake: ['notice_drafting', 'closed'],
  notice_drafting: ['notice_served', 'closed'],
  notice_served: ['sec14_filing', 'closed'],
  sec14_filing: ['hearing_scheduled', 'order_obtained', 'closed'],
  hearing_scheduled: ['order_obtained', 'closed'],
  order_obtained: ['possession_scheduled', 'closed'],
  possession_scheduled: ['possession_taken', 'closed'],
  possession_taken: ['closed'],
  closed: ['intake'], // reopening only with justification
};

/**
 * GET /cases
 * Retrieves cases scoped to the user's organization (or all cases for Panacea internal staff)
 */
router.get('/', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const { status, search, page = '1', pageSize = '25' } = req.query;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    const p = Math.max(1, parseInt(page as string, 10) || 1);
    const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 25));
    const offset = (p - 1) * ps;

    const result = await db.getCases({
      orgId: isInternal ? undefined : req.user!.organization_id,
      status: typeof status === 'string' ? status : undefined,
      search: typeof search === 'string' ? search : undefined,
      limit: ps,
      offset,
    });

    const totalPages = Math.ceil(result.total / ps);

    return res.status(200).json({
      data: {
        items: result.items,
        pagination: {
          page: p,
          pageSize: ps,
          totalItems: result.total,
          totalPages,
        },
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /cases/:id
 * Retrieves single case with tenant isolation check
 */
router.get('/:id', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    const foundCase = await db.getCaseById(id, isInternal ? undefined : req.user!.organization_id);

    if (!foundCase) {
      // Return 404 to avoid leaking existence across tenants
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    // Attach organization and document count
    const org = await db.getOrgById(foundCase.organization_id);
    const docs = await db.getDocumentsByCase(foundCase.id);
    const docCount = docs.length;

    return res.status(200).json({
      data: {
        ...foundCase,
        organizationName: org?.legal_name || 'Unknown',
        documentCount: docCount,
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /cases
 * Creates a new case docket
 */
router.post('/', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const { title, external_reference, classification = 'confidential', organization_id } = req.body;

    if (!title) {
      return next(new AppError('Case title is required.', 'VALIDATION_ERROR', 400));
    }

    const isInternal = isPanaceaInternalRole(req.user!.role);
    // Institutional clients can only create cases for their own organization
    const targetOrgId = isInternal && organization_id ? organization_id : req.user!.organization_id;

    const newCase = {
      id: uuidv4(),
      organization_id: targetOrgId,
      external_reference: external_reference || null,
      title,
      status: 'intake',
      classification,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const initialHistory = {
      id: uuidv4(),
      case_id: newCase.id,
      old_status: null,
      new_status: 'intake',
      changed_by: req.user!.id,
      changed_at: new Date().toISOString(),
      reason: 'Initial case docket intake',
    };

    await db.createCase(newCase, initialHistory);

    logAuditEvent({
      actorUserId: req.user!.id,
      organizationId: targetOrgId,
      eventType: 'CASE_CREATED',
      action: 'CREATE',
      resourceType: 'CASE',
      resourceId: newCase.id,
      result: 'success',
      requestId: req.requestId,
    });

    return res.status(201).json({
      data: newCase,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /cases/:id/status
 * Transition case status validated against the state machine
 */
router.post('/:id/status', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const { newStatus, reason } = req.body;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    const foundCase = await db.getCaseById(id, isInternal ? undefined : req.user!.organization_id);

    if (!foundCase) {
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    if (!newStatus) {
      return next(new AppError('New status is required.', 'VALIDATION_ERROR', 400));
    }

    // Validate state machine transition
    const allowedNext = VALID_TRANSITIONS[foundCase.status] || [];
    if (!allowedNext.includes(newStatus)) {
      return next(
        new AppError(
          `Invalid status transition from '${foundCase.status}' to '${newStatus}'. Allowed transitions: ${allowedNext.join(', ')}`,
          'INVALID_STATUS_TRANSITION',
          400,
        ),
      );
    }

    const oldStatus = foundCase.status;

    // Record history
    const historyRecord = {
      id: uuidv4(),
      case_id: foundCase.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: req.user!.id,
      changed_at: new Date().toISOString(),
      reason: reason || null,
    };

    const updatedCase = await db.updateCaseStatus(foundCase.id, newStatus, historyRecord);

    logAuditEvent({
      actorUserId: req.user!.id,
      organizationId: foundCase.organization_id,
      eventType: 'CASE_STATUS_CHANGED',
      action: 'CHANGE_STATUS',
      resourceType: 'CASE',
      resourceId: foundCase.id,
      result: 'success',
      requestId: req.requestId,
      metadata: { oldStatus, newStatus, reason },
    });

    return res.status(200).json({
      data: {
        case: updatedCase,
        transition: historyRecord,
      },
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /cases/:id/history
 * Returns complete status timeline for a case
 */
router.get('/:id/history', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    const foundCase = await db.getCaseById(id, isInternal ? undefined : req.user!.organization_id);

    if (!foundCase) {
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    const rawHistory = await db.getCaseHistory(id);
    const history = await Promise.all(
      rawHistory.map(async (h) => {
        const user = await db.getUserById(h.changed_by);
        return {
          ...h,
          changedByName: user?.display_name || 'System Operator',
        };
      }),
    );

    return res.status(200).json({
      data: history,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /cases/:id/assignments
 */
router.get('/:id/assignments', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const isInternal = isPanaceaInternalRole(req.user!.role);

    const foundCase = await db.getCaseById(id, isInternal ? undefined : req.user!.organization_id);

    if (!foundCase) {
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    const assignments = await db.getCaseAssignments(id);

    return res.status(200).json({
      data: assignments,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /cases/:id/assignments
 */
router.post('/:id/assignments', requireAuth, async (req: AppRequest, res: Response, next) => {
  try {
    const id = req.params.id as string;
    const { userId, teamReference, assignmentType = 'LEAD_OFFICER' } = req.body;

    if (!userId && !teamReference) {
      return next(
        new AppError('Either userId or teamReference must be provided.', 'VALIDATION_ERROR', 400),
      );
    }

    const isInternal = isPanaceaInternalRole(req.user!.role);
    const foundCase = await db.getCaseById(id, isInternal ? undefined : req.user!.organization_id);
    if (!foundCase) {
      return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
    }

    const newAssignment = {
      id: uuidv4(),
      case_id: id,
      user_id: userId || null,
      team_reference: teamReference || null,
      assignment_type: assignmentType,
      assigned_at: new Date().toISOString(),
      revoked_at: null,
    };

    await db.addCaseAssignment(newAssignment);

    logAuditEvent({
      actorUserId: req.user!.id,
      organizationId: foundCase.organization_id,
      eventType: 'CASE_ASSIGNED',
      action: 'ASSIGN',
      resourceType: 'CASE',
      resourceId: id,
      result: 'success',
      requestId: req.requestId,
      metadata: { assignmentType, userId, teamReference },
    });

    return res.status(201).json({
      data: newAssignment,
      requestId: req.requestId,
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /cases/:id/documents
 * POST /cases/:id/documents/upload
 */
router.get('/:id/documents', requireAuth, getCaseDocumentsHandler);
router.post(
  '/:id/documents/upload',
  requireAuth,
  upload.single('file'),
  uploadCaseDocumentHandler,
);

export default router;

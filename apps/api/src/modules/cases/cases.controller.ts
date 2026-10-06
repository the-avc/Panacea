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
router.get('/', requireAuth, (req: AppRequest, res: Response) => {
  const { status, search, page = '1', pageSize = '25' } = req.query;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  let caseList = isInternal ? [...db.cases] : db.getCasesByOrg(req.user!.organization_id);

  // Filter by status
  if (status && typeof status === 'string') {
    caseList = caseList.filter((c) => c.status === status);
  }

  // Search filter
  if (search && typeof search === 'string') {
    const term = search.toLowerCase();
    caseList = caseList.filter(
      (c) =>
        c.title.toLowerCase().includes(term) ||
        (c.external_reference && c.external_reference.toLowerCase().includes(term)),
    );
  }

  // Bounded pagination
  const p = Math.max(1, parseInt(page as string, 10) || 1);
  const ps = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 25));
  const total = caseList.length;
  const totalPages = Math.ceil(total / ps);
  const paginated = caseList.slice((p - 1) * ps, p * ps);

  return res.status(200).json({
    data: {
      items: paginated,
      pagination: {
        page: p,
        pageSize: ps,
        totalItems: total,
        totalPages,
      },
    },
    requestId: req.requestId,
  });
});

/**
 * GET /cases/:id
 * Retrieves single case with tenant isolation check
 */
router.get('/:id', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  const foundCase = isInternal
    ? db.cases.find((c) => c.id === id)
    : db.getCaseByIdAndOrg(id, req.user!.organization_id);

  if (!foundCase) {
    // Return 404 to avoid leaking existence across tenants
    return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
  }

  // Attach organization and document count
  const org = db.getOrgById(foundCase.organization_id);
  const docCount = db.getDocumentsByCase(foundCase.id).length;

  return res.status(200).json({
    data: {
      ...foundCase,
      organizationName: org?.legal_name || 'Unknown',
      documentCount: docCount,
    },
    requestId: req.requestId,
  });
});

/**
 * POST /cases
 * Creates a new case docket
 */
router.post('/', requireAuth, (req: AppRequest, res: Response, next) => {
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

  db.cases.unshift(newCase);

  // Initial status history
  db.caseStatusHistory.push({
    id: uuidv4(),
    case_id: newCase.id,
    old_status: null,
    new_status: 'intake',
    changed_by: req.user!.id,
    changed_at: new Date().toISOString(),
    reason: 'Initial case docket intake',
  });

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
});

/**
 * POST /cases/:id/status
 * Transition case status validated against the state machine
 */
router.post('/:id/status', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const { newStatus, reason } = req.body;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  const foundCase = isInternal
    ? db.cases.find((c) => c.id === id)
    : db.getCaseByIdAndOrg(id, req.user!.organization_id);

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
  foundCase.status = newStatus;
  foundCase.updated_at = new Date().toISOString();

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
  db.caseStatusHistory.unshift(historyRecord);

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
      case: foundCase,
      transition: historyRecord,
    },
    requestId: req.requestId,
  });
});

/**
 * GET /cases/:id/history
 * Returns complete status timeline for a case
 */
router.get('/:id/history', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  const foundCase = isInternal
    ? db.cases.find((c) => c.id === id)
    : db.getCaseByIdAndOrg(id, req.user!.organization_id);

  if (!foundCase) {
    return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
  }

  const history = db.caseStatusHistory
    .filter((h) => h.case_id === id)
    .map((h) => {
      const user = db.getUserById(h.changed_by);
      return {
        ...h,
        changedByName: user?.display_name || 'System Operator',
      };
    });

  return res.status(200).json({
    data: history,
    requestId: req.requestId,
  });
});

/**
 * GET /cases/:id/assignments
 */
router.get('/:id/assignments', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const isInternal = isPanaceaInternalRole(req.user!.role);

  const foundCase = isInternal
    ? db.cases.find((c) => c.id === id)
    : db.getCaseByIdAndOrg(id, req.user!.organization_id);

  if (!foundCase) {
    return next(new AppError('Case docket not found.', 'NOT_FOUND', 404));
  }

  const assignments = db.caseAssignments
    .filter((a) => a.case_id === id && !a.revoked_at)
    .map((a) => {
      const user = a.user_id ? db.getUserById(a.user_id) : null;
      return {
        ...a,
        userDisplayName: user?.display_name || null,
        userEmail: user?.email || null,
      };
    });

  return res.status(200).json({
    data: assignments,
    requestId: req.requestId,
  });
});

/**
 * POST /cases/:id/assignments
 */
router.post('/:id/assignments', requireAuth, (req: AppRequest, res: Response, next) => {
  const id = req.params.id as string;
  const { userId, teamReference, assignmentType = 'LEAD_OFFICER' } = req.body;

  if (!userId && !teamReference) {
    return next(
      new AppError('Either userId or teamReference must be provided.', 'VALIDATION_ERROR', 400),
    );
  }

  const foundCase = db.cases.find((c) => c.id === id);
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

  db.caseAssignments.push(newAssignment);

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
});

/**
 * GET /cases/:id/documents
 * POST /cases/:id/documents/upload
 */
router.get('/:id/documents', requireAuth, getCaseDocumentsHandler);
router.post('/:id/documents/upload', requireAuth, uploadCaseDocumentHandler);

export default router;


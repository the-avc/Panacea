/**
 * PANACEA CONSULTANCY — Shared Security Utilities
 *
 * Input validation, sanitization, and security constants
 * shared across frontend and backend.
 *
 * IMPORTANT: These are supplementary validation utilities.
 * Backend MUST independently validate all inputs regardless
 * of frontend validation.
 */

// ---- Validation Constants ----

export const VALIDATION = {
  EMAIL_MAX_LENGTH: 255,
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 100,
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_MAX_LENGTH: 128,
  ORGANIZATION_NAME_MAX_LENGTH: 255,
  CASE_TITLE_MAX_LENGTH: 500,
  CASE_REFERENCE_MAX_LENGTH: 100,
  DOCUMENT_FILENAME_MAX_LENGTH: 255,
  MESSAGE_MAX_LENGTH: 5000,
  SUBJECT_MAX_LENGTH: 200,
  PHONE_MAX_LENGTH: 20,
  PAGINATION_MAX_PAGE_SIZE: 100,
  PAGINATION_DEFAULT_PAGE_SIZE: 25,
  UUID_REGEX: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
} as const;

// ---- File Upload Constants ----

export const FILE_UPLOAD = {
  MAX_SIZE_BYTES: 52_428_800, // 50MB
  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png'] as const,
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
  ] as const,
  /** Magic bytes for file content validation (first bytes of file) */
  MAGIC_BYTES: {
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    'image/jpeg': [0xff, 0xd8, 0xff],
    'image/png': [0x89, 0x50, 0x4e, 0x47], // .PNG
    // DOCX and XLSX are ZIP-based
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
      0x50, 0x4b, 0x03, 0x04,
    ],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      0x50, 0x4b, 0x03, 0x04,
    ],
  } as Record<string, number[]>,
} as const;

// ---- Sanitization ----

/**
 * Sanitize a filename to prevent path traversal and special character attacks.
 * Removes directory separators, null bytes, and control characters.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'unnamed';
  }

  return (
    filename
      // Remove path separators
      .replace(/[/\\]/g, '')
      // Remove null bytes
      .replace(/\0/g, '')
      // Remove control characters
      .replace(/[\x00-\x1f\x7f]/g, '')
      // Remove leading/trailing dots and spaces
      .replace(/^[.\s]+|[.\s]+$/g, '')
      // Replace multiple spaces with single
      .replace(/\s+/g, ' ')
      // Limit length
      .substring(0, VALIDATION.DOCUMENT_FILENAME_MAX_LENGTH) || 'unnamed'
  );
}

/**
 * Validate that a string is a valid UUID v4 format.
 * Used to prevent injection via ID parameters.
 */
export function isValidUUID(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  return VALIDATION.UUID_REGEX.test(value);
}

/**
 * Validate email format (basic check, not exhaustive).
 * Server-side validation must be authoritative.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  if (email.length > VALIDATION.EMAIL_MAX_LENGTH) return false;
  // Basic RFC 5322 approximation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check password strength requirements.
 * Requirements: min 12 chars, at least one uppercase, one lowercase, one digit.
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required.'] };
  }
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`);
  }
  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    errors.push(`Password must not exceed ${VALIDATION.PASSWORD_MAX_LENGTH} characters.`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one digit.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate file MIME type against allowlist.
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return (FILE_UPLOAD.ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

/**
 * Validate file size against maximum.
 */
export function isAllowedFileSize(sizeBytes: number): boolean {
  return sizeBytes > 0 && sizeBytes <= FILE_UPLOAD.MAX_SIZE_BYTES;
}

/**
 * Validate magic bytes of a file buffer against expected MIME type.
 * Returns true if the file's actual content matches the claimed MIME type.
 */
export function validateMagicBytes(buffer: Uint8Array, claimedMimeType: string): boolean {
  const expectedBytes = FILE_UPLOAD.MAGIC_BYTES[claimedMimeType];
  if (!expectedBytes) return false;
  if (buffer.length < expectedBytes.length) return false;

  return expectedBytes.every((byte, index) => buffer[index] === byte);
}

// ---- Security Constants ----

/**
 * Secure error messages that do not leak internal information.
 */
export const SAFE_ERRORS = {
  UNAUTHORIZED: 'Authentication required.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_LOCKED: 'This account has been temporarily locked. Please try again later.',
  ACCOUNT_DISABLED: 'This account has been disabled. Please contact your administrator.',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  MFA_REQUIRED: 'Multi-factor authentication is required.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
  VALIDATION_ERROR: 'The request contains invalid data.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
  FILE_REJECTED: 'The file could not be accepted. Please contact your administrator.',
  FILE_TOO_LARGE: 'The file exceeds the maximum allowed size.',
  FILE_TYPE_NOT_ALLOWED: 'This file type is not permitted.',
} as const;

/**
 * Contact form security notice as specified in MASTER-BUILD-PROMPT and SECURITY.md.
 */
export const CONTACT_FORM_SECURITY_NOTICE =
  'Please do not submit confidential case documents, financial information, identity documents or other sensitive information through this public contact form. Existing institutional clients should use the secure client portal.';

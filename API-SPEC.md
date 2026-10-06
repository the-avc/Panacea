# Panacea Consultancy --- API Specification

## 1. API conventions

Base URL:

``` text
/api/v1
```

Transport: - HTTPS only.

Content: - JSON for normal API operations. - Multipart upload only where
required.

Authentication: - Secure authenticated session or approved
identity-provider mechanism.

Authorization: - Required on every protected endpoint.

## 2. Standard response

Success:

``` json
{
  "data": {},
  "requestId": "uuid"
}
```

Error:

``` json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource.",
    "requestId": "uuid"
  }
}
```

Never return stack traces or internal database errors.

## 3. Authentication

``` text
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/me
POST /auth/mfa/challenge
POST /auth/mfa/verify
GET  /auth/sessions
POST /auth/sessions/:id/revoke
POST /auth/password/reset/request
POST /auth/password/reset/complete
```

Exact authentication endpoints may differ when using an external
identity provider.

## 4. Users

``` text
GET   /users/me
PATCH /users/me
GET   /users/me/sessions
```

Admin-only:

``` text
GET   /admin/users
POST  /admin/users
GET   /admin/users/:id
PATCH /admin/users/:id
POST  /admin/users/:id/disable
POST  /admin/users/:id/enable
```

## 5. Organizations

``` text
GET /organizations/:id
GET /organizations/:id/users
```

Admin:

``` text
POST  /admin/organizations
PATCH /admin/organizations/:id
POST  /admin/organizations/:id/suspend
```

## 6. Cases

``` text
GET    /cases
POST   /cases
GET    /cases/:id
PATCH  /cases/:id
GET    /cases/:id/history
GET    /cases/:id/assignments
POST   /cases/:id/assignments
DELETE /cases/:id/assignments/:assignmentId
```

Every endpoint must enforce organization and resource authorization.

Filtering: - status - created date - assignment - approved search fields

Never allow arbitrary database-field filtering from the client.

## 7. Case status

``` text
POST /cases/:id/status
GET  /cases/:id/history
```

Status transitions should be validated against an approved state
machine.

Do not allow arbitrary status strings if the business process requires
controlled transitions.

## 8. Documents

``` text
GET    /cases/:id/documents
POST   /cases/:id/documents/upload
GET    /documents/:id
POST   /documents/:id/download
GET    /documents/:id/versions
DELETE /documents/:id
```

Upload process:

``` text
Request
 ↓
Authenticate
 ↓
Authorize case
 ↓
Validate file
 ↓
Malware scan
 ↓
Store privately
 ↓
Create document record
 ↓
Audit
```

Download process:

``` text
Authenticate
 ↓
Authorize document
 ↓
Generate short-lived access
 ↓
Audit
 ↓
Download
```

## 9. Notifications

``` text
GET   /notifications
PATCH /notifications/:id/read
POST  /admin/notifications
```

## 10. Audit

Admin/security roles only:

``` text
GET /admin/audit-logs
GET /admin/security-events
GET /admin/security-events/:id
```

Audit search must itself be authorized and audited where appropriate.

## 11. Rate limits

Apply stricter limits to: - Login - Password reset - MFA - Upload -
Download - Search - Administrative APIs

Exact limits should be established from expected traffic and security
testing.

## 12. CORS

Allow only approved application origins.

Never use unrestricted production CORS such as:

``` text
Access-Control-Allow-Origin: *
```

for authenticated sensitive APIs.

## 13. Request validation

Validate: - Types - Lengths - Enumerations - UUID formats - Date
ranges - File metadata - Pagination bounds

Reject unexpected fields where practical.

## 14. Pagination

Use bounded pagination.

Example:

``` text
?page=1&pageSize=25
```

Enforce a maximum page size server-side.

## 15. API security test matrix

  Test                             Expected
  -------------------------------- --------------------------------------
  Unauthenticated case request     401
  Wrong organization case          403/404
  Wrong role                       403
  Revoked session                  401
  Expired session                  401
  Unauthorized document download   403/404
  Malicious upload                 Rejected/quarantined
  Excessive login attempts         Throttled
  SQL injection payload            Rejected/safely handled
  XSS payload                      Encoded/rejected
  Invalid UUID                     400
  Unknown fields                   Rejected/ignored according to schema

## 16. API documentation

Generate OpenAPI documentation for the implementation.

Do not expose sensitive production API documentation publicly unless
explicitly intended.

If public API documentation is unnecessary, keep the OpenAPI
specification private.

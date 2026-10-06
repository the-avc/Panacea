# Panacea Consultancy Private Limited --- Security Architecture & Secure Development Standard

## Document status

-   **Status:** Draft for technical and management review
-   **Purpose:** Security baseline for the Panacea Consultancy website
    and future secure client portal
-   **Source-derived company context:** Panacea Consultancy Private
    Limited states that it is engaged in enforcement and
    investigation-related ancillary services and emphasizes
    confidentiality, private-data protection, data security, integrity
    and honesty. The company profile also describes SARFAESI-related
    enforcement, investigation, asset verification and recovery support.
    \[Company Profile, pp. 1--3\]
-   **Important:** Technical controls in this document are
    recommendations. They are not claims that Panacea currently has
    these controls, certifications, or security capabilities.

------------------------------------------------------------------------

## 1. Security objectives

The system shall prioritize:

1.  Confidentiality of client and case information.
2.  Integrity of legal, recovery and investigation-related records.
3.  Availability of business-critical services.
4.  Strong tenant/client isolation.
5.  Least-privilege access.
6.  Traceability through security and audit logging.
7.  Secure handling of uploaded documents.
8.  Secure-by-default development and deployment.

The public website and any future client portal must be treated as
separate security boundaries.

------------------------------------------------------------------------

## 2. System boundaries

### Public website

Contains only approved corporate information: - Company profile -
Services - Institutional experience - Leadership information - Contact
information - Approved policies/disclaimers

It must not contain confidential case information.

### Client portal

A separate authenticated application for authorized institutional
clients.

Potential future capabilities: - Case dashboards - Assignment
information - Secure document exchange - Notifications - Activity
history - Audit trails

### Administrative system

A separate privileged area for authorized staff.

Administrative actions must require stronger authentication and generate
audit events.

------------------------------------------------------------------------

## 3. Recommended architecture

``` text
Internet
   |
CDN / DDoS Protection
   |
Web Application Firewall
   |
Reverse Proxy / Load Balancer
   |
+-----------------------+
|                       |
Public Website      Client Portal
|                       |
|                   Authentication
|                       |
|                    MFA/Passkey
|                       |
|                    API Layer
|                       |
|              +--------+--------+
|              |                 |
|          PostgreSQL       Private Object Storage
|              |                 |
|              +--------+--------+
|                       |
+------------------- Audit / Security Logs
```

Sensitive databases and object storage should not be publicly reachable.

------------------------------------------------------------------------

## 4. Identity and authentication

Recommended controls:

-   MFA for all privileged users.
-   MFA for institutional client accounts.
-   Prefer passkeys/WebAuthn where practical.
-   Strong password hashing using a mature password-hashing library if
    passwords are supported.
-   Secure, HttpOnly, SameSite cookies.
-   Secure session expiration.
-   Refresh-token rotation if token-based sessions are used.
-   Session revocation.
-   Login rate limiting.
-   Progressive throttling for repeated failures.
-   Security alerts for suspicious authentication activity.

Do not implement cryptographic primitives manually.

------------------------------------------------------------------------

## 5. Authorization

Authentication answers: "Who are you?"

Authorization answers: "What are you allowed to access?"

Every protected request must perform server-side authorization.

Recommended model:

``` text
User
 |
Organization
 |
Role
 |
Permission
 |
Resource assignment
 |
Requested action
```

Example:

``` text
Institution A
  ├── Case A-001
  └── Case A-002

Institution B
  ├── Case B-001
  └── Case B-002
```

Institution A must never be able to access Institution B's records, even
if it knows or guesses an identifier.

Test explicitly for IDOR/BOLA.

------------------------------------------------------------------------

## 6. Data protection

Recommended data classifications:

-   Public
-   Internal
-   Confidential
-   Highly Confidential / Restricted

Client case information, legal documents, investigation material and
sensitive financial information should be treated as Confidential or
Restricted according to the company's final data-classification policy.

Recommended controls: - TLS for data in transit. - Encryption at rest. -
Private storage. - Least-privilege access. - Controlled retention. -
Secure deletion procedures. - Backup encryption. - Restricted
administrative access.

------------------------------------------------------------------------

## 7. Document security

Documents must not be stored in public web directories.

Recommended upload flow:

``` text
Client
  |
Authenticated API
  |
Authorization Check
  |
File Validation
  |
Malware Scan
  |
Private Object Storage
  |
Audit Event
```

Controls: - File-size limits. - MIME/content validation. - Extension
validation. - Filename sanitization. - Malware scanning. - Private
storage. - Short-lived signed URLs. - Download authorization. -
Upload/download audit logs. - Versioning where required.

Never trust the file extension supplied by the client.

------------------------------------------------------------------------

## 8. API security

All protected endpoints must enforce authorization server-side.

Recommended controls: - Strict input validation. - Parameterized
queries. - Rate limiting. - Strict CORS. - Security headers. - API
versioning. - Safe error responses. - Request IDs/correlation IDs. -
Schema validation. - Abuse monitoring.

Never expose stack traces, database errors, tokens or internal
implementation details to clients.

------------------------------------------------------------------------

## 9. Web security

Recommended controls include:

-   Content Security Policy tailored to the actual application.
-   Strict-Transport-Security.
-   X-Content-Type-Options.
-   Referrer-Policy.
-   Permissions-Policy.
-   Frame-ancestors/clickjacking protection.
-   Secure cookie attributes.
-   Output encoding.
-   CSRF protection where applicable.

------------------------------------------------------------------------

## 10. Public contact form

The public form should not request sensitive case information.

Display:

> Please do not submit confidential case documents, financial
> information, identity documents or other sensitive information through
> this public contact form. Existing institutional clients should use
> the secure client portal.

Recommended protections: - Server-side validation. - Rate limiting. -
Bot protection. - Spam filtering. - CSRF protection where applicable. -
Secure mail handling.

------------------------------------------------------------------------

## 11. Logging and auditing

Audit security-sensitive events such as:

-   Successful login
-   Failed login
-   Logout
-   MFA changes
-   Password changes
-   Permission changes
-   Case access
-   Case modification
-   Document upload
-   Document download
-   Administrative actions
-   Security alerts

Never log: - Passwords - Authentication tokens - Private keys - Full
sensitive documents - Unnecessary personal information

Audit logs should be access-controlled and protected against
unauthorized modification.

------------------------------------------------------------------------

## 12. Secrets management

Never commit: - API keys - Database passwords - Private keys - Session
secrets - Cloud credentials

Use: - Environment variables during local development. - A proper
production secrets manager. - Secret rotation procedures.

Maintain `.env.example` without real credentials.

------------------------------------------------------------------------

## 13. Database security

Recommended PostgreSQL controls:

-   Private network placement.
-   No public database endpoint.
-   TLS connections.
-   Least-privilege roles.
-   Parameterized queries.
-   Encrypted backups.
-   Point-in-time recovery.
-   Database activity logging.
-   Regular restoration tests.

------------------------------------------------------------------------

## 14. CI/CD security

Recommended pipeline:

``` text
Commit
  ↓
Lint
  ↓
Type Check
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
Secret Scan
  ↓
Dependency Audit
  ↓
SAST
  ↓
Build
  ↓
Staging
  ↓
E2E/Security Tests
  ↓
Production
```

Production credentials must never be exposed in CI logs.

------------------------------------------------------------------------

## 15. Backup and disaster recovery

Define and approve: - Recovery Point Objective (RPO) - Recovery Time
Objective (RTO) - Backup retention - Backup encryption - Restore testing
frequency

Do not assume that having backups means recovery has been tested.

------------------------------------------------------------------------

## 16. Security testing

Before production: - Dependency vulnerability scanning - SAST - DAST
where appropriate - Authentication tests - Authorization tests -
IDOR/BOLA tests - File upload security tests - XSS tests - SQL injection
tests - CSRF tests - SSRF tests - Rate-limit tests -
Privilege-escalation tests - Cross-tenant isolation tests

A qualified security professional should perform an independent
penetration test before exposing a sensitive client portal to production
users.

------------------------------------------------------------------------

## 17. Production launch gate

Do not launch the secure portal until management has approved:

-   Data classification
-   User roles
-   Retention policy
-   Privacy policy
-   Incident-response process
-   Backup/recovery process
-   Security monitoring
-   Authorized client list
-   Legal disclaimers
-   Document-handling procedures

------------------------------------------------------------------------

## 18. Important limitation

The supplied company profile supports the company's business description
and stated commitment to confidentiality/data security. It does **not**
establish that Panacea currently holds any specific security
certification or operates any particular technical security control.
Such claims must be verified before publication.

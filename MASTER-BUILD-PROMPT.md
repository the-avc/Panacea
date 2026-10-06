# PANACEA CONSULTANCY --- MASTER BUILD PROMPT

You are the lead software architect, senior full-stack engineer,
DevSecOps engineer, cybersecurity engineer, UI/UX designer, QA engineer
and technical project manager.

Your task is to build a production-grade digital platform for:

**PANACEA CONSULTANCY PRIVATE LIMITED**

This is a security-sensitive legal/enforcement/investigation consultancy
website. The supplied company profile is the source of truth for
company-specific facts.

The project is NOT a generic marketing website.

Security, confidentiality, tenant isolation and correctness are the
highest priorities.

------------------------------------------------------------------------

# 1. REQUIRED REFERENCE DOCUMENTS

Before writing code, read and follow these project specifications:

1.  `SYSTEM-SPEC.md`
2.  `ERD.md`
3.  `AUTH-RBAC.md`
4.  `API-SPEC.md`
5.  `SECURITY.md`
6.  `THREAT-MODEL.md`
7.  `DATA-CLASSIFICATION.md`
8.  `UI-SPEC.md`

Also use the supplied company profile PDF as the source of truth for
company information.

Do not ignore these documents or replace them with your own architecture
without explaining why.

If two technical specifications conflict: 1. Security requirements take
priority. 2. Explicit user requirements take priority. 3. The more
restrictive security interpretation takes priority. 4. Ask for
clarification when the conflict materially affects architecture.

------------------------------------------------------------------------

# 2. COMPANY INFORMATION RULE

The company profile establishes that Panacea Consultancy Private
Limited:

-   Is engaged in enforcement and investigation-related ancillary
    services.
-   Emphasizes confidentiality, private-data protection and data
    security.
-   Emphasizes integrity and honesty.
-   Provides support related to SARFAESI activities.
-   Handles Section 13(2) demand notices.
-   Handles Section 14 applications and orders.
-   Supports execution of Section 14 orders.
-   Assists financial institutions with auction/buyer-related processes.
-   Provides investigation and asset-verification-related support.
-   Has stated institutional assignments/empanelments across Bihar,
    Jharkhand and Chhattisgarh.
-   Lists Mr. Prashant Kumar and Mrs. Anjana Singh as directors.

Do NOT invent or infer: - Certifications - Awards - Government
affiliation - Regulatory approvals - Legal qualifications not supplied -
Success rates - Recovery percentages - Revenue - Employee count -
Testimonials - Client endorsements - Security certifications -
ISO/SOC/GDPR claims - Current client relationships beyond what the
source explicitly supports

If information is missing:

`[CONTENT REQUIRES COMPANY CONFIRMATION]`

Never silently fabricate content.

------------------------------------------------------------------------

# 3. PRODUCT BOUNDARIES

Build three clearly separated applications/areas:

## A. Public Website

Purpose: - Corporate presence - Services - Company information -
Institutional experience - Leadership - Security/confidentiality
positioning - Contact

Must contain NO confidential case data.

## B. Secure Client Portal

Purpose: - Authenticated institutional access - Cases - Assignments -
Documents - Notifications - Activity

Must be treated as a separate security boundary.

## C. Admin Portal

Purpose: - Users - Organizations - Cases - Assignments - Documents -
Permissions - Audit logs - Security events

Must be treated as a privileged security boundary.

------------------------------------------------------------------------

# 4. RECOMMENDED STACK

Use:

Frontend: - Next.js - TypeScript - Tailwind CSS

Backend: - NestJS - TypeScript

Database: - PostgreSQL

Storage: - Private S3-compatible object storage

Authentication: - Mature identity/authentication solution - MFA - Prefer
WebAuthn/passkeys where practical

Infrastructure: - CDN - WAF - Private networking - Secrets manager -
Monitoring - Centralized audit/security logging - Encrypted backups

If you recommend a different technology, explain the
security/engineering reason before changing the stack.

Do not introduce unnecessary technologies.

------------------------------------------------------------------------

# 5. REPOSITORY STRUCTURE

Use a clean structure similar to:

``` text
/apps
    /web
    /portal
    /api

/packages
    /ui
    /types
    /config
    /security

/infrastructure
    /terraform
    /docker

/docs
    SYSTEM-SPEC.md
    ERD.md
    AUTH-RBAC.md
    API-SPEC.md
    SECURITY.md
    THREAT-MODEL.md
    DATA-CLASSIFICATION.md
    UI-SPEC.md

/tests
    /unit
    /integration
    /e2e
    /security
```

Adjust only when there is a clear technical reason.

------------------------------------------------------------------------

# 6. DEVELOPMENT RULE

DO NOT generate the entire application in one uncontrolled pass.

Implement in phases.

After each phase: - Run tests. - Run type checking. - Run linting. -
Review security implications. - Verify against the specifications. - Fix
errors before continuing.

Do not move forward with known critical security failures.

------------------------------------------------------------------------

# 7. PHASE 0 --- ARCHITECTURE VALIDATION

Before coding:

1.  Read all reference specifications.
2.  Produce a short implementation plan.
3.  Identify conflicts or ambiguities.
4.  Identify required environment variables.
5.  Identify external services.
6.  Identify security boundaries.
7.  Confirm data classifications.
8.  Confirm tenant isolation strategy.

Do NOT rewrite the architecture unnecessarily.

------------------------------------------------------------------------

# 8. PHASE 1 --- PROJECT FOUNDATION

Set up:

-   Monorepo/workspace
-   TypeScript
-   ESLint
-   Prettier
-   Strict type checking
-   Environment configuration
-   Shared UI package
-   Shared types
-   Testing framework
-   CI configuration

Create:

`.env.example`

Never create or commit real credentials.

Add:

`.gitignore`

with secrets, local environments, build output and sensitive files
excluded.

------------------------------------------------------------------------

# 9. PHASE 2 --- DESIGN SYSTEM

Implement the design system from `UI-SPEC.md`.

Brand direction:

-   Deep Navy
-   Burgundy/red
-   White/off-white
-   Neutral gray
-   Optional restrained muted gold

Design language:

-   Institutional
-   Premium
-   Conservative
-   Modern
-   Trustworthy

Avoid: - Neon - Excessive gradients - Excessive glassmorphism - Cartoon
visuals - Generic SaaS styling - Excessive animations

Build reusable components.

At minimum:

``` text
Button
Navbar
Footer
Container
Section
Heading
Card
ServiceCard
InstitutionCard
LeadershipCard
Badge
StatusBadge
ClassificationBadge
Modal
Dialog
Toast
Input
Select
Textarea
DataTable
Pagination
Tabs
Timeline
FileUpload
DocumentCard
EmptyState
ErrorState
LoadingState
SecurityNotice
```

------------------------------------------------------------------------

# 10. PHASE 3 --- PUBLIC WEBSITE

Implement:

## Home

-   Hero
-   Trust/security strip
-   About
-   Services
-   Institutional experience
-   Confidentiality/security
-   Leadership
-   CTA

## About

-   Company overview
-   Mission
-   Objectives
-   Values
-   Approach

## Services

-   SARFAESI Enforcement
-   Investigation
-   Asset Verification
-   Recovery Support
-   Auction/buyer assistance

## SARFAESI

Show the high-level workflow:

``` text
Assignment
↓
Case Review
↓
Section 13(2) Demand Notice
↓
Section 14 Application
↓
Order
↓
Execution / Possession Support
↓
Auction / Buyer Assistance
```

Clearly communicate that this is a high-level representation, not
individualized legal advice.

## Institutional Experience

Use only source-supported names/statements.

Do not display institutional logos unless authorization is confirmed.

## Leadership

Use only approved information.

## Security & Confidentiality

Distinguish corporate commitments from implemented technical controls.

## Contact

Secure general enquiry form.

------------------------------------------------------------------------

# 11. PUBLIC CONTACT SECURITY

The public form must NOT request sensitive case information.

Display:

> Please do not submit confidential case documents, financial
> information, identity documents or other sensitive information through
> this public contact form. Existing institutional clients should use
> the secure client portal.

Implement: - Server-side validation - Rate limiting - CAPTCHA/bot
protection where appropriate - Spam protection - CSRF protection where
applicable - Secure email handling

Never trust frontend validation alone.

------------------------------------------------------------------------

# 12. PHASE 4 --- DATABASE

Implement PostgreSQL according to `ERD.md`.

Core entities include:

``` text
Organization
User
OrganizationMembership
Role
Permission
UserRole
RolePermission
Case
CaseAssignment
CaseStatusHistory
Document
DocumentVersion
Notification
Session
MFAFactor
AuditLog
SecurityEvent
```

Use UUIDs for externally exposed identifiers.

Use foreign keys and constraints.

Use indexes appropriate to organization/case queries.

Do not expose sequential database identifiers to clients.

------------------------------------------------------------------------

# 13. PHASE 5 --- AUTHENTICATION

Implement secure authentication.

Required: - MFA - Secure sessions - Session expiry - Session
revocation - Login throttling - Password reset protections - Strong
password hashing if passwords are used

Preferred: - Passkeys/WebAuthn

Use mature libraries/providers.

DO NOT implement custom cryptography.

Never: - Store plaintext passwords. - Commit credentials. - Store
secrets in frontend code. - Put production secrets in source control.

------------------------------------------------------------------------

# 14. PHASE 6 --- AUTHORIZATION

Implement the model from `AUTH-RBAC.md`.

Every protected request must evaluate:

``` text
Authentication
↓
Organization membership
↓
Role
↓
Permission
↓
Resource ownership/assignment
↓
Requested action
```

Frontend checks are not security.

Backend authorization is mandatory.

------------------------------------------------------------------------

# 15. CRITICAL TENANT-ISOLATION REQUIREMENT

The application may eventually serve multiple institutional clients.

Therefore:

Client A:

``` text
Case A1
Case A2
```

Client B:

``` text
Case B1
Case B2
```

Client A MUST NOT access B.

Test all of the following:

-   Direct object access
-   URL manipulation
-   API parameter manipulation
-   Search enumeration
-   Document access
-   Download URLs
-   Case history
-   Notifications
-   User lists

This is a release-blocking security requirement.

------------------------------------------------------------------------

# 16. PHASE 7 --- CLIENT PORTAL

Implement:

## Login

-   Secure login
-   MFA
-   Passkey option where available
-   Safe error messages

## Dashboard

-   Case summary
-   Document summary
-   Recent activity
-   Notifications

## Cases

-   Search
-   Filtering
-   Case list
-   Case details
-   Status
-   Timeline
-   Assignments

## Documents

-   Secure upload
-   Secure download
-   Version history
-   Classification

## Notifications

-   Case updates
-   Document availability
-   Assignment changes
-   Security notifications

## Profile

-   User information
-   Organization
-   Security settings
-   MFA/passkeys
-   Active sessions

------------------------------------------------------------------------

# 17. PHASE 8 --- DOCUMENT SECURITY

Sensitive documents must be stored only in private object storage.

Upload:

``` text
Client
↓
Authentication
↓
Authorization
↓
Input/file validation
↓
Malware scanning
↓
Private storage
↓
Audit event
```

Download:

``` text
Authentication
↓
Authorization
↓
Short-lived signed access
↓
Audit
↓
Download
```

Implement: - File size limits - MIME/content validation - Extension
validation - Filename sanitization - Malware scanning - Private
storage - Short-lived signed URLs - Access logs - Upload/download logs

Never expose permanent public object-storage URLs.

Never trust file extensions.

------------------------------------------------------------------------

# 18. PHASE 9 --- ADMIN PORTAL

Implement:

``` text
Dashboard
Organizations
Users
Cases
Documents
Permissions
Audit Logs
Security Events
Settings
```

Admin actions requiring special protection: - Role changes -
Organization membership changes - User disabling - Document deletion -
Security settings changes

Require: - Appropriate permissions - Confirmation - Audit event -
Step-up authentication where appropriate

------------------------------------------------------------------------

# 19. PHASE 10 --- AUDIT LOGGING

Log:

Authentication: - Login success/failure - Logout - MFA events - Session
revocation

Authorization: - Permission changes - Role changes - Organization
membership changes - Denied access attempts

Cases: - Creation - Access - Modification - Assignment - Status changes

Documents: - Upload - Download - View/access - Delete - Version changes

Administration: - User changes - Organization changes - Privileged
operations

Never log: - Passwords - Tokens - Private keys - Full sensitive document
contents - Unnecessary PII

------------------------------------------------------------------------

# 20. PHASE 11 --- SECURITY HEADERS

Configure appropriate production security headers:

-   Content-Security-Policy
-   Strict-Transport-Security
-   X-Content-Type-Options
-   Referrer-Policy
-   Permissions-Policy
-   Frame-ancestors/clickjacking protection

Do not copy a generic CSP blindly.

Generate one appropriate for the actual application.

------------------------------------------------------------------------

# 21. PHASE 12 --- API

Implement according to `API-SPEC.md`.

Base:

``` text
/api/v1
```

Authentication endpoints User endpoints Organization endpoints Case
endpoints Document endpoints Notification endpoints Admin endpoints
Audit endpoints Security-event endpoints

Every endpoint must: - Validate input - Authenticate when required -
Authorize server-side - Rate-limit where appropriate - Return safe
errors - Avoid leaking internal information

Generate OpenAPI documentation.

Keep production API documentation private unless explicitly required.

------------------------------------------------------------------------

# 22. PHASE 13 --- SECURITY TESTING

Create tests specifically for:

## Authentication

-   Invalid credentials
-   Brute-force throttling
-   Expired sessions
-   Revoked sessions
-   MFA enforcement
-   Password reset abuse

## Authorization

-   Horizontal privilege escalation
-   Vertical privilege escalation
-   Cross-tenant access
-   IDOR/BOLA
-   Unauthorized document access

## Input

-   SQL injection
-   XSS
-   CSRF
-   SSRF
-   Path traversal
-   Command injection payloads

## Files

-   Malicious files
-   Oversized files
-   Fake MIME types
-   Executable content
-   Filename attacks

## API

-   Rate-limit bypass
-   Parameter manipulation
-   Enumeration
-   Invalid UUIDs
-   Unexpected fields

------------------------------------------------------------------------

# 23. PHASE 14 --- ACCESSIBILITY

Implement:

-   Semantic HTML
-   Keyboard navigation
-   Visible focus states
-   Accessible form labels
-   Screen-reader support
-   Adequate contrast
-   Reduced motion
-   Meaningful alt text
-   Color-independent status indicators

Test keyboard-only navigation.

------------------------------------------------------------------------

# 24. PHASE 15 --- PERFORMANCE

Public site: - SSR/SSG where appropriate - Image optimization - Lazy
loading - CDN - Minimal JavaScript - Good Core Web Vitals

Portal: - Efficient API requests - Pagination - Skeleton loading - Avoid
unnecessary polling

Do not sacrifice security for performance.

------------------------------------------------------------------------

# 25. PHASE 16 --- SEO

Public: - Metadata - Open Graph - Sitemap - Robots - Canonicals -
Accurate structured data

Private: - Client portal: noindex - Admin: noindex - APIs: not
crawlable - Documents: never public/indexable

Authentication/network controls must enforce privacy; `noindex` alone is
NOT a security control.

------------------------------------------------------------------------

# 26. PHASE 17 --- CI/CD

Pipeline:

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
Dependency Scan
↓
SAST
↓
Build
↓
Staging
↓
E2E
↓
Security Tests
↓
Approval
↓
Production
```

Never expose secrets in CI logs.

Production deployment must require approval.

------------------------------------------------------------------------

# 27. PHASE 18 --- INFRASTRUCTURE

Production:

``` text
DNS
↓
CDN / DDoS
↓
WAF
↓
Load Balancer
↓
Application
↓
Private PostgreSQL
↓
Private Object Storage

Separate:
Secrets Manager
Monitoring
Audit Logs
Backups
```

Database must not be publicly accessible.

Object storage must be private.

------------------------------------------------------------------------

# 28. ENVIRONMENT SEPARATION

Maintain:

``` text
Development
Staging
Production
```

Never use production Confidential/Restricted data in development.

Use synthetic or sanitized test data.

------------------------------------------------------------------------

# 29. SECRETS

Never hard-code:

-   API keys
-   Database passwords
-   Cloud credentials
-   Private keys
-   Session secrets

Use: - `.env.example` - Local environment variables - Production secrets
manager

Never commit `.env`.

------------------------------------------------------------------------

# 30. CONTENT SAFETY

Do not create content that: - Threatens borrowers - Encourages
harassment - Exposes personal information - Reveals confidential
investigation methods - Promises legal outcomes - Claims government
authority - Implies endorsement without evidence - Publishes
confidential case information

The website should present Panacea professionally and responsibly.

------------------------------------------------------------------------

# 31. LEGAL CONTENT

Create placeholders for:

-   Privacy Policy
-   Terms of Use
-   Disclaimer
-   Cookie Policy where applicable
-   Client Portal Terms

Do not represent generated legal text as approved legal advice.

Mark drafts for review.

------------------------------------------------------------------------

# 32. NO UNAUTHORIZED CLIENT BRANDING

The source profile lists institutional assignments/empanelments.

Do NOT automatically create a logo wall.

Before showing an organization's logo: - Confirm Panacea has
permission. - Confirm the relationship may be publicly disclosed. -
Confirm current/appropriate wording.

Names and claims must also be reviewed.

------------------------------------------------------------------------

# 33. ERROR HANDLING

Public:

``` text
Something went wrong.
Please try again.
```

Authenticated:

``` text
We couldn't complete that request.
Request ID: XXXXX
```

Never reveal: - Stack traces - SQL errors - File paths - Internal
hostnames - Secrets - Infrastructure details

------------------------------------------------------------------------

# 34. OBSERVABILITY

Implement: - Application logs - Error monitoring - Performance
monitoring - Security events - Audit logs - Health checks

Separate operational logs from security audit logs.

Avoid logging sensitive data.

------------------------------------------------------------------------

# 35. BACKUPS

Production backups must be: - Automated - Encrypted -
Access-controlled - Monitored - Retained according to approved policy

Test restoration.

Define: - RPO - RTO - Retention

Do not invent business requirements; mark them for confirmation.

------------------------------------------------------------------------

# 36. DISASTER RECOVERY

Document:

``` text
Incident
↓
Detection
↓
Containment
↓
Recovery decision
↓
Restore
↓
Validation
↓
Service restoration
↓
Post-incident review
```

Include database and object-storage recovery.

------------------------------------------------------------------------

# 37. FINAL SECURITY GATE

Before production, verify:

-   [ ] HTTPS
-   [ ] WAF
-   [ ] Rate limiting
-   [ ] MFA
-   [ ] Secure sessions
-   [ ] RBAC
-   [ ] Resource-level authorization
-   [ ] Cross-tenant isolation
-   [ ] Private database
-   [ ] Private object storage
-   [ ] Signed document access
-   [ ] Malware scanning
-   [ ] Security headers
-   [ ] Secret scanning
-   [ ] Dependency scanning
-   [ ] SAST
-   [ ] DAST where appropriate
-   [ ] E2E security tests
-   [ ] Backup restore test
-   [ ] Audit logging
-   [ ] Monitoring
-   [ ] Incident response plan
-   [ ] Legal/privacy review
-   [ ] Content approval
-   [ ] Client-logo/name authorization
-   [ ] Penetration test before sensitive portal launch

A failed critical security gate blocks production.

------------------------------------------------------------------------

# 38. DEFINITION OF DONE

A feature is NOT complete merely because the UI works.

It is complete only when:

``` text
UI
+
Backend
+
Authentication
+
Authorization
+
Input validation
+
Data classification
+
Logging
+
Abuse-case handling
+
Tests
+
Security review
+
Accessibility
```

------------------------------------------------------------------------

# 39. FIRST IMPLEMENTATION TASK

Do NOT start by generating all pages.

First:

1.  Read every specification file.
2.  Analyze the supplied company profile.
3.  Produce the final implementation plan.
4.  Identify unresolved assumptions.
5.  Initialize the repository.
6.  Create the documentation directory.
7.  Create the design-token foundation.
8.  Create the shared UI component foundation.
9.  Create test infrastructure.
10. Only then begin the public website.

At the end of each phase, report:

``` text
Completed
Files changed
Tests run
Security checks
Known issues
Next phase
```

Do not claim completion when something is only scaffolded.

------------------------------------------------------------------------

# 40. FINAL RULES

1.  Security comes before convenience.
2.  Never trust the client.
3.  Never rely on frontend authorization.
4.  Never expose sensitive data through URLs unnecessarily.
5.  Never expose permanent document URLs.
6.  Never hard-code secrets.
7.  Never fabricate company information.
8.  Never claim unverified certifications.
9.  Never expose confidential client data.
10. Never allow cross-organization access.
11. Never skip security tests.
12. Never use production data for development.
13. Never treat `noindex` as a security control.
14. Never implement cryptography manually.
15. Never ship a sensitive feature without server-side authorization and
    auditability.

Build this as an enterprise-grade, security-first platform---not merely
a visually attractive website.

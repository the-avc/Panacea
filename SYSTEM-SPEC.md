# Panacea Consultancy Private Limited --- SYSTEM-SPEC.md

## 0. Document purpose

This is the master technical specification for the Panacea Consultancy
Private Limited website and future secure institutional client portal.

It combines: - Company-derived website requirements - Public website
information architecture - Secure client portal architecture - Admin
architecture - Authentication and authorization - Data model - API
structure - Security boundaries - Document handling - Audit logging -
Deployment - Testing - Implementation phases

### Source-of-truth rule

The supplied Panacea company profile is the authority for
company-specific facts.

The profile describes Panacea Consultancy Private Limited as an
enforcement and investigation-related consultancy and states an emphasis
on confidentiality, private-data protection, data security, integrity
and honesty. It describes SARFAESI-related activities, Section 13(2)
demand notices, Section 14 applications/orders, execution of Section 14
orders, auction buyer assistance, investigation, asset verification and
recovery support. \[Company Profile, pp. 1--3\]

Technical architecture in this document is a recommendation. It is not a
claim about controls Panacea already operates.

------------------------------------------------------------------------

# 1. Product definition

## 1.1 Public website

Purpose: - Establish institutional credibility. - Explain services. -
Present approved company information. - Provide safe contact channels. -
Communicate confidentiality/security commitments.

The public site must contain no confidential client, case, borrower,
property, investigation or recovery data.

## 1.2 Client portal

Purpose: Provide authenticated institutional clients with a secure
environment for future functions such as: - Case visibility - Assignment
tracking - Secure document exchange - Notifications - Activity history

The portal must be a separate security boundary from the public website.

## 1.3 Admin portal

Purpose: Allow authorized Panacea personnel to manage: - Users -
Organizations - Roles - Permissions - Cases - Assignments - Documents -
Notifications - Audit/security events

Administrative access requires stronger controls than ordinary client
access.

------------------------------------------------------------------------

# 2. High-level architecture

``` text
                         INTERNET
                            |
                    CDN / DDoS Protection
                            |
                     Web Application
                         Firewall
                            |
                    Reverse Proxy / LB
                            |
             +--------------+--------------+
             |                             |
             v                             v
       PUBLIC WEBSITE                CLIENT PORTAL
             |                             |
       Approved content              Authentication
                                           |
                                      MFA / Passkey
                                           |
                                      Authorization
                                           |
                                           v
                                      API Layer
                                           |
                         +-----------------+----------------+
                         |                                  |
                         v                                  v
                    PostgreSQL                     Private Object Storage
                         |                                  |
                         +-----------------+----------------+
                                           |
                                           v
                                    Audit / Security Logs
                                           |
                                           v
                                    Monitoring / Alerts
```

The administrative interface should be logically separated from the
client portal and protected with stronger privileged-access controls.

------------------------------------------------------------------------

# 3. Public website sitemap

## Home

Sections: 1. Hero 2. Company overview 3. Areas of expertise 4. Services
5. Institutional experience 6. Confidentiality/security 7. Leadership 8.
Contact CTA

## About

-   Company profile
-   Mission
-   Objectives
-   Values
-   Approach

## Services

-   SARFAESI Enforcement
-   Investigation & Asset Verification
-   Recovery Support
-   Auction/Bidder Assistance

## SARFAESI Enforcement

-   Section 13(2) Demand Notices
-   Section 14 Applications
-   Obtaining Section 14 Orders
-   Execution of Section 14 Orders
-   Secured asset possession support
-   Auction process support

## Investigation & Asset Verification

-   Investigation support
-   Asset verification
-   Recovery-related support

## Institutional Experience

Use only company-profile-supported statements.

Do not imply current activity, endorsement or exclusivity unless
separately confirmed.

## Leadership

-   Mr. Prashant Kumar
-   Mrs. Anjana Singh

Use only approved biographical information.

## Confidentiality & Security

-   Confidentiality commitment
-   Data protection principles
-   Client-interest protection
-   Security principles

Do not claim certifications or technical controls that have not been
verified.

## Contact

-   Approved company contact information
-   General enquiry form
-   Secure-portal CTA for existing clients

## Legal

-   Privacy Policy
-   Terms of Use
-   Disclaimer
-   Cookie Policy if applicable

Legal text requires company/legal review before production.

------------------------------------------------------------------------

# 4. Navigation

Recommended:

``` text
PANACEA
Home
About
Services
Institutional Experience
Leadership
Security
Contact
Client Portal
```

On mobile, use a secure accessible navigation drawer.

The Client Portal should be visually distinct from the public-site
navigation.

------------------------------------------------------------------------

# 5. Public website content rules

The company profile should be treated as the source for: - Business
description - Services - Mission - Objectives - Institutional
assignments/empanelments - Leadership information - Contact information

Do not fabricate: - Certifications - Awards - Revenue - Employee count -
Success rate - Recovery percentages - Government affiliation -
Regulatory approvals - Client endorsements - Testimonials - Security
certifications

Where information is needed but unavailable:

`[CONTENT REQUIRES COMPANY CONFIRMATION]`

------------------------------------------------------------------------

# 6. Client portal users

Recommended roles:

``` text
Platform Super Administrator
        |
        +-- Security/Compliance Administrator
        |
        +-- Operations Administrator
        |
        +-- Panacea Legal/Recovery User
        |
        +-- Panacea Investigation User
        |
        +-- Institutional Client Administrator
        |
        +-- Institutional Client User
```

Actual roles should be finalized with Panacea management.

------------------------------------------------------------------------

# 7. Authorization model

Authorization must operate at multiple levels:

``` text
Authentication
      |
Organization membership
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

Institution A must not be able to access Institution B resources.

The backend must never rely on: - Hidden frontend buttons - Client-side
role checks - URL obscurity - Sequential IDs

------------------------------------------------------------------------

# 8. Core data model

Recommended entities:

``` text
User
Organization
Role
Permission
UserRole
OrganizationMembership
Case
CaseAssignment
CaseStatusHistory
Document
DocumentVersion
Notification
AuditLog
SecurityEvent
Session
MFAFactor
```

## Relationships

``` text
Organization
   |
   +---- OrganizationMembership ---- User
   |
   +---- Case
            |
            +---- CaseAssignment
            |
            +---- CaseStatusHistory
            |
            +---- Document
                     |
                     +---- DocumentVersion

User
 |
 +---- AuditLog
 |
 +---- SecurityEvent
 |
 +---- Session
 |
 +---- MFAFactor
```

Use UUIDs for externally exposed resource identifiers.

------------------------------------------------------------------------

# 9. Suggested database fields

## User

-   id
-   organization_id
-   email
-   display_name
-   status
-   created_at
-   updated_at
-   last_login_at

Do not store plaintext passwords.

## Organization

-   id
-   legal_name
-   status
-   created_at
-   updated_at

## Role

-   id
-   name
-   description

## Permission

-   id
-   resource
-   action

## Case

-   id
-   organization_id
-   external_reference
-   title
-   status
-   assigned_team
-   created_at
-   updated_at

Avoid unnecessary sensitive fields.

## CaseAssignment

-   id
-   case_id
-   user_id/team_id
-   assignment_type
-   assigned_at
-   revoked_at

## Document

-   id
-   case_id
-   classification
-   storage_key
-   status
-   uploaded_by
-   created_at

## DocumentVersion

-   id
-   document_id
-   version
-   storage_key
-   checksum
-   created_at

## AuditLog

-   id
-   actor_id
-   organization_id
-   event_type
-   resource_type
-   resource_id
-   action
-   timestamp
-   request_id
-   result

Never put passwords, tokens or unnecessary sensitive document contents
in logs.

------------------------------------------------------------------------

# 10. API architecture

Recommended base:

`/api/v1`

## Authentication

``` text
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
POST   /auth/mfa/challenge
POST   /auth/mfa/verify
POST   /auth/sessions/revoke
GET    /auth/me
```

Use a mature authentication framework/provider rather than implementing
cryptographic authentication manually.

## Users

``` text
GET    /users/me
PATCH  /users/me
GET    /users/me/sessions
```

Administrative user endpoints must be separately protected.

## Organizations

``` text
GET    /organizations/:id
GET    /organizations/:id/users
```

Only authorized administrators should access these.

## Cases

``` text
GET    /cases
GET    /cases/:id
POST   /cases
PATCH  /cases/:id
GET    /cases/:id/history
```

Every request must enforce organization and resource-level
authorization.

## Documents

``` text
GET    /cases/:id/documents
POST   /cases/:id/documents/upload
GET    /documents/:id
POST   /documents/:id/download
DELETE /documents/:id
```

Document downloads must never return permanent public storage URLs.

## Notifications

``` text
GET    /notifications
PATCH  /notifications/:id/read
```

------------------------------------------------------------------------

# 11. API response principles

Never return: - Password hashes - Session tokens - Internal secrets -
Database errors - Stack traces - Private storage credentials -
Unnecessary PII

Use consistent error responses:

``` json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource.",
    "requestId": "..."
  }
}
```

Do not reveal whether a sensitive resource exists when that would create
an information leak.

------------------------------------------------------------------------

# 12. Document architecture

Recommended:

``` text
Browser
   |
HTTPS
   |
API
   |
Authentication
   |
Authorization
   |
Upload validation
   |
Malware scan
   |
Private object storage
   |
Audit event
```

Download:

``` text
Browser
   |
API
   |
Authorization
   |
Short-lived signed URL
   |
Private storage
```

Storage must be private by default.

------------------------------------------------------------------------

# 13. Security boundaries

## Boundary 1

Internet → Public Website

Controls: - CDN - WAF - TLS - Security headers - Rate limiting

## Boundary 2

Internet → Client Portal

Controls: - Authentication - MFA - Session management - Rate limiting -
Authorization

## Boundary 3

Application → Database

Controls: - Private network - Least privilege - Parameterized queries -
Encryption

## Boundary 4

Application → Object Storage

Controls: - Private bucket - Server-side authorization - Short-lived
URLs - Audit logs

## Boundary 5

Client Organization → Client Organization

Controls: - Tenant isolation - Resource-level authorization - Automated
cross-tenant tests

------------------------------------------------------------------------

# 14. Authentication specification

Minimum: - MFA for administrators - MFA for client users - Secure
sessions - Session expiration - Session revocation - Login throttling -
Password reset protections - Suspicious login monitoring

Preferred: - Passkeys/WebAuthn

Never: - Store plaintext passwords - Put tokens in localStorage if a
safer session design is available - Build custom cryptography

------------------------------------------------------------------------

# 15. Admin security

Administrative functions should have:

-   Strong MFA
-   Shorter session lifetime
-   Least privilege
-   Privileged role separation
-   Audit logging
-   Security alerts
-   Re-authentication for high-risk actions

High-risk actions include: - Changing roles - Granting access - Deleting
documents - Changing organization membership - Changing security
settings

------------------------------------------------------------------------

# 16. Audit architecture

Audit events should cover:

### Authentication

-   Login success/failure
-   Logout
-   MFA changes
-   Password changes
-   Session revocation

### Authorization

-   Permission changes
-   Role changes
-   Organization membership changes
-   Repeated denied access

### Case

-   Created
-   Viewed
-   Updated
-   Assigned
-   Status changed

### Documents

-   Uploaded
-   Viewed
-   Downloaded
-   Deleted
-   Version changed

### Administration

-   User created
-   User disabled
-   Organization modified
-   Privilege changed

------------------------------------------------------------------------

# 17. Incident response

The production system must have a documented process:

``` text
Detection
   ↓
Triage
   ↓
Containment
   ↓
Evidence Preservation
   ↓
Eradication
   ↓
Recovery
   ↓
Notification / Legal Review
   ↓
Post-Incident Review
```

The exact legal notification process must be determined by Panacea and
appropriate counsel.

------------------------------------------------------------------------

# 18. Backup and disaster recovery

Define before production:

-   RPO
-   RTO
-   Backup frequency
-   Retention
-   Backup encryption
-   Geographic/region strategy
-   Restore procedure
-   Restore test frequency

A backup is not considered reliable until restoration has been tested.

------------------------------------------------------------------------

# 19. Deployment architecture

Recommended environments:

``` text
Development
    ↓
Staging
    ↓
Production
```

Never use real production Confidential/Restricted data in development.

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
Private Database
 ↓
Private Object Storage

Separate:
Secrets Manager
Monitoring
Audit Logs
Backups
```

------------------------------------------------------------------------

# 20. DevSecOps

CI pipeline:

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
Deploy Staging
 ↓
E2E Tests
 ↓
Security Tests
 ↓
Production Approval
 ↓
Production
```

Production deployment should require explicit approval.

------------------------------------------------------------------------

# 21. UI/UX design system

## Visual character

The site should feel: - Institutional - Premium - Conservative -
Modern - Trustworthy - Minimal

Avoid: - Neon - Excessive gradients - Cartoon graphics - Excessive
glassmorphism - Generic SaaS styling - Excessive animations

## Colors

Primary: - Deep Navy - Professional Burgundy/Red - White/Off-white

Optional: - Muted Gold

Exact color values should be finalized after reviewing the company's
logo/brand assets.

## Typography

Use a highly readable professional typeface system.

Suggested: - Serif display font for major institutional headings if
appropriate. - Sans-serif for body/UI.

Do not sacrifice readability.

------------------------------------------------------------------------

# 22. Responsive design

Required: - Desktop - Laptop - Tablet - Mobile

Accessibility: - Semantic HTML - Keyboard navigation - Visible focus
states - Proper labels - Accessible contrast - Screen-reader-friendly
content - Meaningful alt text - Reduced-motion support

------------------------------------------------------------------------

# 23. SEO

Public pages: - Metadata - Open Graph - Sitemap - Robots.txt - Canonical
URLs - Structured data only where accurate

Do not index: - Client portal - Admin portal - API endpoints - Case
pages - Document URLs

Use `noindex` plus authentication/network controls where appropriate.

------------------------------------------------------------------------

# 24. Privacy/legal placeholders

Before launch, obtain approved versions of:

-   Privacy Policy
-   Terms of Use
-   Disclaimer
-   Cookie Policy if applicable
-   Client Portal Terms
-   Data retention policy
-   Document handling policy

Do not generate these as "legally approved" documents automatically.

------------------------------------------------------------------------

# 25. Company information requiring confirmation

Before production, obtain confirmation of:

1.  Official registered company name and spelling.
2.  Approved logo and brand assets.
3.  Current office address.
4.  Current phone numbers.
5.  Current email addresses.
6.  Current service list.
7.  Current geographic coverage.
8.  Current institutional empanelments.
9.  Permission to display institution names.
10. Permission to display institution logos.
11. Approved director photographs.
12. Approved director biographies.
13. Any official registrations that may be displayed.
14. Security certifications, if any.
15. Privacy requirements.
16. Client portal requirements.
17. Hosting/data-residency requirements.
18. Data retention requirements.
19. Authorized portal administrators.
20. Incident-notification requirements.

------------------------------------------------------------------------

# 26. Implementation roadmap

## Phase 0 --- Confirmation

-   Company facts
-   Brand assets
-   Legal review
-   Portal scope
-   Data requirements

## Phase 1 --- Architecture

-   System architecture
-   Threat model
-   Data classification
-   ER model
-   API specification

## Phase 2 --- Design

-   Design system
-   Wireframes
-   Responsive layouts
-   Accessibility

## Phase 3 --- Public website

-   Home
-   About
-   Services
-   Institutional Experience
-   Leadership
-   Security
-   Contact
-   Legal pages

## Phase 4 --- Identity

-   Authentication
-   MFA
-   Sessions
-   Organizations
-   Roles
-   Permissions

## Phase 5 --- Portal

-   Dashboard
-   Cases
-   Assignments
-   Documents
-   Notifications
-   Activity

## Phase 6 --- Admin

-   User management
-   Organizations
-   Cases
-   Documents
-   Permissions
-   Audit logs

## Phase 7 --- Security validation

-   SAST
-   Dependency scan
-   DAST
-   E2E security tests
-   Cross-tenant tests
-   File-upload tests
-   Penetration test

## Phase 8 --- Production

-   Infrastructure
-   Monitoring
-   Backup
-   Disaster recovery
-   Production launch

------------------------------------------------------------------------

# 27. Definition of done

A feature is NOT complete when the UI works.

A feature is complete only when:

``` text
UI
+
Backend
+
Authentication
+
Authorization
+
Validation
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
```

------------------------------------------------------------------------

# 28. Final engineering rule

The system must follow:

> SECURITY BY DESIGN, NOT SECURITY AFTER DEVELOPMENT.

For every new feature, document:

1.  What data does it process?
2.  What classification does that data have?
3.  Who can access it?
4.  How is access authorized?
5.  What could an attacker do?
6.  What must be logged?
7.  What happens if the feature fails?
8.  How is the feature tested?

No sensitive feature should be shipped without answering all eight
questions.

------------------------------------------------------------------------

# 29. Recommended next implementation artifact

After this specification is approved, produce:

1.  `ERD.md`
2.  `API-SPEC.md`
3.  `AUTH-RBAC.md`
4.  `THREAT-MODEL.md`
5.  `SECURITY.md`
6.  `DATA-CLASSIFICATION.md`
7.  `UI-SPEC.md`
8.  `DEPLOYMENT.md`
9.  `INCIDENT-RESPONSE.md`
10. `TEST-PLAN.md`

These documents together form the engineering baseline for
implementation.

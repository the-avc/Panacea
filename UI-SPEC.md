# Panacea Consultancy Private Limited --- UI-SPEC.md

## 0. Purpose

This document defines the visual and interaction specification for:

1.  The public corporate website
2.  The secure institutional client portal
3.  The privileged administration interface

The supplied Panacea profile is the source of truth for company-specific
content. It describes enforcement and investigation-related ancillary
services, SARFAESI-related activities, confidentiality/data-security
emphasis, institutional assignments/empanelments and leadership.
\[Company Profile, pp. 1--3\]

Do not invent company facts, certifications, awards, statistics, legal
claims, testimonials or client endorsements.

------------------------------------------------------------------------

# 1. Product experience

The product has three distinct experiences:

``` text
                 PANACEA DIGITAL PLATFORM
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
 Public Website      Client Portal      Admin Portal
    Public            Restricted          Highly Restricted
```

## Public Website

Primary goals: - Trust - Institutional credibility - Clear service
explanation - Professional presentation - Safe contact

## Client Portal

Primary goals: - Secure access - Clear case visibility - Secure document
exchange - Minimal exposure of sensitive information - Strong
authorization cues

## Admin Portal

Primary goals: - Operational control - Security - Auditability - Least
privilege - Efficient administration

------------------------------------------------------------------------

# 2. Design personality

The website must look:

-   Institutional
-   Premium
-   Conservative
-   Modern
-   Trustworthy
-   Mature
-   Professional
-   Calm

It should NOT look: - Like a startup - Like a generic SaaS dashboard -
Like a gaming website - Like a cryptocurrency product - Like an overly
decorative law-firm template

Use restrained motion and strong typography.

------------------------------------------------------------------------

# 3. Brand direction

The source document uses a traditional corporate identity with dark blue
and red elements.

Recommended digital palette:

``` text
Primary Navy
Deep Burgundy / Red
Off-White
White
Neutral Gray
Muted Gold — optional accent
```

Do not finalize exact hex values until the official logo/brand assets
are confirmed.

## Color usage

Navy: - Header - Major headings - Primary navigation - Institutional
sections

Burgundy/red: - Accent - Important CTA - Active state - Small visual
highlights

Gold: - Very limited premium accent

Neutral tones: - Backgrounds - Cards - Tables - Form controls

Do not use red for every button or warning.

------------------------------------------------------------------------

# 4. Typography

Use a professional font system.

Recommended approach:

``` text
Display / major headings:
Professional serif OR high-quality institutional sans-serif

Body:
Highly readable sans-serif

UI:
Same body sans-serif
```

Typography must prioritize readability over stylistic novelty.

Recommended hierarchy:

``` text
H1 — 56–72px desktop
H2 — 40–48px
H3 — 28–32px
H4 — 20–24px
Body — 16–18px
Small — 13–14px
```

Mobile typography should scale down proportionally.

------------------------------------------------------------------------

# 5. Global layout

Desktop content width:

``` text
max-width: 1200–1280px
```

Use generous whitespace.

Typical structure:

``` text
┌─────────────────────────────────────┐
│ Navigation                          │
├─────────────────────────────────────┤
│                                     │
│ Hero / Section                      │
│                                     │
├─────────────────────────────────────┤
│ Content                             │
│                                     │
├─────────────────────────────────────┤
│ Content                             │
├─────────────────────────────────────┤
│ CTA                                 │
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

Avoid excessive card grids.

------------------------------------------------------------------------

# 6. Global navigation

Desktop:

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

The Client Portal CTA should be visually distinct.

Mobile: - Logo - Menu button - Full-screen or side navigation - Portal
CTA

Navigation must be keyboard accessible.

------------------------------------------------------------------------

# 7. Home page

## 7.1 Hero

Content:

``` text
PANACEA CONSULTANCY
PRIVATE LIMITED

Enforcement. Investigation. Recovery.

Professional support for enforcement, investigation
and recovery-related requirements of financial institutions.
```

Use only claims supported by the company profile.

CTA: - Explore Services - Contact Us - Client Portal

Visual direction: - Large typography - Subtle architectural/legal
imagery - No cliché gavel imagery unless approved - No overly dramatic
stock photography

------------------------------------------------------------------------

# 8. Home --- trust strip

Immediately below hero:

``` text
Confidentiality
Data Security
Integrity
Institutional Focus
Strategic Relationships
```

This is based on the firm's stated emphasis on confidentiality, data
security, integrity and long-term relationships.

Do not label these as certifications.

------------------------------------------------------------------------

# 9. Home --- About section

Layout:

``` text
Left:
Short company introduction

Right:
Visual / typographic statement
```

CTA: `Discover Panacea`

Keep this concise.

------------------------------------------------------------------------

# 10. Home --- Services

Use four major service cards:

### SARFAESI Enforcement

Section 13(2), Section 14 applications/orders and execution support.

### Investigation

Investigation-related support.

### Asset Verification

Asset verification support.

### Recovery & Auction Support

Secured asset recovery and buyer/auction assistance.

Each card: - Small icon - Title - Short description - Arrow

Do not use exaggerated claims.

------------------------------------------------------------------------

# 11. Home --- institutional experience

Create a premium section:

``` text
Institutional Experience

Supporting financial institutions across
Bihar, Jharkhand and Chhattisgarh.
```

If approved, show names from the company profile.

Do NOT automatically display logos.

Add a note internally in CMS:

`Logo display requires authorization confirmation.`

------------------------------------------------------------------------

# 12. Home --- security section

This should be visually important.

Heading:

``` text
Confidentiality at the Core
```

Copy should communicate that the firm's work involves sensitive client
matters and that confidentiality and data security are central
principles.

Do NOT claim: - ISO certification - SOC 2 - specific encryption
standards - government security certification

unless verified.

CTA: `Our Approach to Security`

------------------------------------------------------------------------

# 13. Home --- leadership

Two-profile layout:

``` text
[Photo / Placeholder]     [Photo / Placeholder]
Mr. Prashant Kumar        Mrs. Anjana Singh
```

Only approved biographies.

For Prashant Kumar, use the source-supported professional experience.

For Anjana Singh, use only approved source-supported information.

------------------------------------------------------------------------

# 14. Home --- final CTA

Dark institutional section:

``` text
Discuss Your Requirement

For services, further information or an
obligation-free discussion, contact Panacea.
```

CTA: `Contact Us`

Do not promise outcomes.

------------------------------------------------------------------------

# 15. About page

Structure:

``` text
Hero
↓
Company Overview
↓
Mission
↓
Objectives
↓
Values
↓
Our Approach
↓
Confidentiality
↓
CTA
```

## Mission

Preserve the source document's meaning regarding: - Consumer needs -
Overdue debt - Customer retention - Strategic relationships - Recovery
support - Allowing clients to focus on core business

Do not silently change the business meaning.

------------------------------------------------------------------------

# 16. Services page

Use a structured vertical layout rather than a generic 3x3 card grid.

``` text
Services
   |
   +-- SARFAESI Enforcement
   |
   +-- Investigation
   |
   +-- Asset Verification
   |
   +-- Recovery Support
   |
   +-- Auction / Buyer Assistance
```

Each service should have: - Overview - Scope - High-level workflow - CTA

No individualized legal advice.

------------------------------------------------------------------------

# 17. SARFAESI page

Hero:

``` text
SARFAESI Enforcement
```

Workflow visualization:

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

This is a visual representation of the company's described service flow,
not a comprehensive statement of statutory procedure.

Do not invent timelines.

------------------------------------------------------------------------

# 18. Investigation & Asset Verification

Sections:

``` text
Investigation Support
Asset Verification
Recovery Support
```

Use understated visuals.

Do not expose investigation methodology.

Do not reveal: - Surveillance techniques - Internal investigative
processes - Sensitive sources - Operational procedures

------------------------------------------------------------------------

# 19. Institutional Experience

Use an editorial institutional layout.

Example:

``` text
Institutional Experience

Our profile reflects assignments/empanelments
with financial institutions across selected markets.

[Institution]
[Institution]
[Institution]
...
```

Each institution should be accompanied by: - Name - Region/service area
only if confirmed

Avoid: - "Trusted by" - "Official partner" - "Exclusive partner" -
"Endorsed by"

unless explicitly verified.

------------------------------------------------------------------------

# 20. Leadership page

## Prashant Kumar

Use: - Professional portrait if approved - Name - Role - Approved
biography

## Anjana Singh

Use: - Professional portrait if approved - Name - Role - Approved
biography

No invented credentials.

------------------------------------------------------------------------

# 21. Security & Confidentiality page

This is a core brand page.

Structure:

``` text
Confidentiality & Security
        ↓
Why confidentiality matters
        ↓
Information handling principles
        ↓
Access control principles
        ↓
Secure communication
        ↓
Client responsibility
        ↓
Contact
```

Important: The public page must distinguish between: - Corporate
commitment - Implemented technical controls

Do not publicly claim a technical control until it is actually
implemented and approved for publication.

------------------------------------------------------------------------

# 22. Contact page

Layout:

``` text
Contact Panacea

Left:
Company contact information

Right:
Secure enquiry form
```

Fields: - Name - Organization - Email - Phone - Subject - Message

Before submission:

``` text
Do not submit confidential case documents,
financial information, identity documents or
other sensitive information through this public form.
```

Existing institutional clients should be directed to the Client Portal.

------------------------------------------------------------------------

# 23. Client Portal --- login

Minimal design.

``` text
             PANACEA

       Secure Client Portal

Email
[________________]

Password
[________________]

[ Sign In ]

[ Use Passkey ]

Forgot password?

Security notice
```

Do not include unnecessary marketing content.

The login page should not reveal whether an email/account exists.

------------------------------------------------------------------------

# 24. MFA screen

``` text
Verify your identity

Enter your verification code

[ _ _ _ _ _ _ ]

[ Verify ]

Use another method
```

If passkeys are supported:

``` text
[ Continue with Passkey ]
```

Do not display sensitive account information before authentication is
complete.

------------------------------------------------------------------------

# 25. Client dashboard

After authentication:

``` text
┌─────────────────────────────────────────────┐
│ PANACEA       Dashboard  Cases  Documents   │
│                                  Profile     │
├─────────────────────────────────────────────┤
│                                             │
│ Welcome                                     │
│                                             │
│ Active Cases        Documents               │
│      12                 48                  │
│                                             │
├─────────────────────────────────────────────┤
│ Recent Case Activity                        │
│                                             │
│ Case ID | Status | Updated                  │
│                                             │
├─────────────────────────────────────────────┤
│ Recent Documents                            │
└─────────────────────────────────────────────┘
```

Do not display more sensitive information than necessary.

------------------------------------------------------------------------

# 26. Client cases page

Use a secure table:

``` text
Cases

Search
Filter
Status

Case Reference
Service
Status
Last Updated
Action
```

Avoid displaying: - Borrower personal information - Full property
information - Sensitive financial information

unless specifically required and authorized.

------------------------------------------------------------------------

# 27. Case details

Structure:

``` text
Case Overview
     ↓
Status
     ↓
Assignment
     ↓
Timeline
     ↓
Documents
     ↓
Activity
```

Sensitive information should be progressively disclosed only when
necessary.

Use: - Permission-based fields - Masking - Clear classification labels

------------------------------------------------------------------------

# 28. Documents page

Design for trust.

``` text
Documents

Upload Document
Search
Filter by type

Document
Version
Classification
Uploaded
Action
```

Use clear labels:

``` text
CONFIDENTIAL
RESTRICTED
```

Never expose storage URLs.

------------------------------------------------------------------------

# 29. Secure upload UI

``` text
Upload Document

Drag & Drop
or
[ Choose File ]

Accepted file types: [configured list]
Maximum size: [configured limit]

Classification:
( ) Confidential
( ) Restricted

[ Upload Securely ]
```

Show:

``` text
Uploading
Scanning
Processing
Available
```

If malware scanning fails:

``` text
The file could not be accepted.
Please contact your administrator.
```

Do not expose scanner internals.

------------------------------------------------------------------------

# 30. Notifications

Use:

``` text
Notifications

Unread
All

Case updated
Document available
Assignment changed
Security notification
```

Security-sensitive notifications should not include unnecessary case
information in email/push previews.

------------------------------------------------------------------------

# 31. Profile & security

Client users can view:

-   Name
-   Organization
-   Email
-   Role

Security:

``` text
MFA
Passkeys
Active sessions
Sign out other sessions
```

Do not expose internal administrative permissions unnecessarily.

------------------------------------------------------------------------

# 32. Admin dashboard

Separate visual identity:

``` text
PANACEA ADMIN

Overview
Organizations
Users
Cases
Documents
Audit Logs
Security Events
Settings
```

Dashboard:

``` text
Active Organizations
Active Users
Active Cases
Pending Documents
Security Events
Recent Administrative Actions
```

Do not expose unrestricted sensitive data on the dashboard.

------------------------------------------------------------------------

# 33. Admin organizations

Table:

``` text
Organization
Status
Users
Cases
Last Activity
Actions
```

Actions require appropriate authorization.

------------------------------------------------------------------------

# 34. Admin users

Table:

``` text
User
Organization
Role
Status
Last Login
Actions
```

High-risk actions: - Disable user - Change role - Change organization
membership

must require confirmation and generate audit events.

------------------------------------------------------------------------

# 35. Admin audit logs

Use:

``` text
Audit Logs

Timestamp
Actor
Organization
Action
Resource
Result
Request ID
```

Provide filtering by: - Date - Actor - Organization - Event - Result

Do not allow ordinary users to view audit logs.

------------------------------------------------------------------------

# 36. Security events

Separate from ordinary audit events.

Severity:

``` text
LOW
MEDIUM
HIGH
CRITICAL
```

Examples: - Repeated failed logins - Suspicious authorization failures -
Privilege changes - Unusual document activity

Security-event details must be protected because they may themselves
contain sensitive information.

------------------------------------------------------------------------

# 37. Empty states

Never show a blank page.

Example:

``` text
No cases found

There are no cases matching your current filters.
```

Avoid revealing information such as: "There are no cases because your
account isn't assigned."

when that could disclose sensitive authorization information.

------------------------------------------------------------------------

# 38. Error states

Public site:

``` text
Something went wrong.
Please try again.
```

Portal:

``` text
We couldn't complete that request.
Request ID: ABC123
```

Do not show: - Stack traces - SQL errors - Internal service names - File
paths - Secrets - Infrastructure details

------------------------------------------------------------------------

# 39. Loading states

Use skeletons for: - Dashboard - Cases - Documents - Tables

Use progress indicators for: - File upload - File scanning -
Authentication

Do not make loading states reveal restricted information.

------------------------------------------------------------------------

# 40. Mobile design

Client portal mobile navigation:

``` text
Dashboard
Cases
Documents
Notifications
Profile
```

Admin mobile can use a collapsible navigation.

Tables should become: - Cards - Horizontal scroll where appropriate -
Condensed rows

Do not simply shrink desktop tables until unreadable.

------------------------------------------------------------------------

# 41. Accessibility

Must support: - Keyboard navigation - Focus indicators - Semantic HTML -
Accessible forms - Screen-reader labels - Color-independent status
indicators - Reduced motion - Adequate contrast

Never use color alone for: - Case status - Security severity - Document
classification

Example:

``` text
[HIGH] Security Event
```

not merely a red dot.

------------------------------------------------------------------------

# 42. Motion

Use subtle motion:

-   150--300ms transitions
-   Gentle fade/slide
-   Hover elevation
-   Section reveal

Avoid: - Continuous animation - Parallax overload - Large moving
backgrounds - Motion during authentication - Distracting dashboard
animation

Respect `prefers-reduced-motion`.

------------------------------------------------------------------------

# 43. Component library

Create reusable components:

``` text
Button
LinkButton
Navbar
Footer
Section
Container
Heading
Breadcrumb
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
Tooltip
Input
Select
Textarea
DatePicker
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

Do not create duplicate components for every page.

------------------------------------------------------------------------

# 44. Security-sensitive UI rules

Never: - Display tokens - Display storage URLs - Display passwords -
Display secret keys - Put sensitive data into URLs unnecessarily - Use
query parameters for confidential information - Show restricted
information before authorization

Use: - Masking - Confirmation for destructive actions - Permission-aware
UI - Secure error messages

Frontend hiding is not security. Backend authorization is mandatory.

------------------------------------------------------------------------

# 45. Public vs private visual language

Public website:

``` text
Elegant
Editorial
Institutional
Marketing-oriented
```

Client portal:

``` text
Quiet
Functional
Secure
Information-dense
```

Admin portal:

``` text
Operational
Dense
Precise
Audit-oriented
```

Do not use the same decorative design language for all three.

------------------------------------------------------------------------

# 46. SEO behavior

Public pages: - Indexable where appropriate.

Client portal: - `noindex` - Authentication required.

Admin: - `noindex` - Strong access controls.

API: - Not publicly crawlable.

Documents: - Never publicly indexed.

------------------------------------------------------------------------

# 47. Performance

Public website: - Optimized images - CDN - Lazy loading - Server-side
rendering where useful - Minimal JavaScript - Good Core Web Vitals

Portal: - Prioritize responsiveness and secure API calls.

Do not introduce third-party scripts unnecessarily.

Every third-party dependency must have a documented reason.

------------------------------------------------------------------------

# 48. Third-party services

Before adding: - Analytics - Chat widgets - Marketing pixels - Embedded
forms - External fonts - Maps - CAPTCHA - Monitoring

evaluate: - Data sent - Cookies - Privacy impact - Security impact -
Vendor trust - Necessity

For the client portal, minimize third-party JavaScript.

------------------------------------------------------------------------

# 49. Content governance

Every public-content change should have:

``` text
Draft
 ↓
Internal Review
 ↓
Legal/Management Review where necessary
 ↓
Approval
 ↓
Publish
```

Particularly for: - Institutional client names - Legal claims - Service
claims - Security claims - Privacy language - Testimonials

------------------------------------------------------------------------

# 50. Final UI acceptance criteria

The UI is complete only when:

-   Every page is responsive.
-   Keyboard navigation works.
-   Accessibility checks pass.
-   No confidential data is exposed publicly.
-   Client portal is visually separated from public site.
-   Admin portal is clearly privileged.
-   All destructive actions require appropriate confirmation.
-   All sensitive actions are backed by server-side authorization.
-   Loading/error/empty states exist.
-   Security classification is visually clear.
-   No unsupported company claims are present.
-   Official company assets are used only after approval.

------------------------------------------------------------------------

# 51. Recommended implementation order

``` text
Design Tokens
      ↓
Global Layout
      ↓
Navbar / Footer
      ↓
Home
      ↓
About
      ↓
Services
      ↓
Institutional Experience
      ↓
Leadership
      ↓
Security
      ↓
Contact
      ↓
Authentication UI
      ↓
Client Dashboard
      ↓
Cases
      ↓
Documents
      ↓
Notifications
      ↓
Admin
      ↓
Accessibility
      ↓
Security QA
```

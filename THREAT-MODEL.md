# Panacea Consultancy Private Limited --- Threat Model

## Document status

-   **Status:** Draft
-   **Purpose:** Identify realistic threats to the public website,
    client portal, APIs, documents and administrative systems.
-   **Company context:** The company profile describes
    enforcement/investigation-related services and explicitly emphasizes
    confidentiality, private-data protection and data security.
    \[Company Profile, pp. 1--3\]
-   **Important:** Threats and mitigations below are technical
    recommendations, not statements that an incident has occurred or
    that a particular control already exists.

------------------------------------------------------------------------

## 1. Assets

### Public assets

-   Corporate website content
-   Service descriptions
-   Approved leadership information
-   Contact information

### Internal assets

-   User accounts
-   Organization records
-   Case metadata
-   Assignment information
-   Internal communications
-   Audit records

### Highly sensitive assets

-   Legal/recovery documents
-   Investigation information
-   Asset verification information
-   Client-provided documents
-   Financial information
-   Personal information
-   Authentication credentials
-   Session tokens
-   Encryption/secrets material

------------------------------------------------------------------------

## 2. Trust boundaries

### Boundary A --- Internet → Public Website

Threats: - Automated attacks - XSS - Bot traffic - DDoS - Web
exploitation

### Boundary B --- Internet → Client Portal

Threats: - Credential attacks - Session theft - Broken access control -
API abuse

### Boundary C --- Application → Database

Threats: - Injection - Excessive database privileges - Data exfiltration

### Boundary D --- Application → Document Storage

Threats: - Unauthorized document access - Malicious uploads - Public
bucket exposure - Signed-URL abuse

### Boundary E --- User → Organization

Threat: - Cross-client/tenant access

### Boundary F --- Administrator → System

Threat: - Privileged account compromise - Insider misuse -
Administrative mistakes

------------------------------------------------------------------------

## 3. Threat register

  ----------------------------------------------------------------------------------
  ID             Threat          Impact            Likelihood     Primary mitigation
  -------------- --------------- ----------------- -------------- ------------------
  T01            Credential      Account           High           MFA, rate
                 stuffing        compromise                       limiting, anomaly
                                                                  detection

  T02            Phishing of     Account           High           MFA/passkeys,
                 staff           compromise                       security awareness

  T03            IDOR/BOLA       Cross-client data High           Resource-level
                                 exposure                         authorization

  T04            Stolen session  Account takeover  Medium/High    Secure cookies,
                                                                  session rotation,
                                                                  revocation

  T05            Malicious file  Malware/server    Medium/High    File validation,
                 upload          compromise                       malware scanning,
                                                                  isolation

  T06            Public storage  Bulk document     High           Private storage,
                 bucket          exposure                         policy controls

  T07            SQL injection   Database          Medium         Parameterized
                                 compromise                       queries,
                                                                  validation, SAST

  T08            XSS             Session/data      Medium         Output encoding,
                                 theft                            CSP

  T09            CSRF            Unauthorized      Medium         SameSite cookies,
                                 actions                          CSRF controls

  T10            SSRF            Internal service  Medium         URL allowlists,
                                 access                           network controls

  T11            Privilege       Administrative    Medium         RBAC, least
                 escalation      compromise                       privilege, tests

  T12            Insider misuse  Confidentiality   Medium         Least privilege,
                                 breach                           audit logs,
                                                                  monitoring

  T13            API enumeration Information       Medium         UUIDs,
                                 disclosure                       authorization,
                                                                  rate limits

  T14            DDoS            Availability loss Medium         CDN/WAF/DDoS
                                                                  protection

  T15            Dependency      Application       Medium         Dependency
                 compromise      compromise                       pinning/scanning

  T16            Secret leakage  Full-system       Medium         Secrets manager,
                                 compromise                       secret scanning

  T17            Backup exposure Bulk data breach  Medium         Encryption, access
                                                                  controls

  T18            Misconfigured   Privileged access Medium         Network controls,
                 admin endpoint                                   MFA, monitoring
  ----------------------------------------------------------------------------------

------------------------------------------------------------------------

## 4. High-priority threat: cross-client data exposure

### Scenario

An authenticated user changes:

`/api/cases/CASE-A`

to:

`/api/cases/CASE-B`

### Failure

The API checks only whether the user is logged in.

### Required behavior

The server must independently verify:

``` text
User authenticated?
       ↓
User's organization?
       ↓
User's role?
       ↓
Case organization?
       ↓
Case assignment?
       ↓
Requested permission?
       ↓
Allow / Deny
```

This must be tested automatically.

------------------------------------------------------------------------

## 5. High-priority threat: malicious documents

### Scenario

An attacker uploads a malicious executable disguised as a PDF.

### Mitigations

-   Content inspection
-   File-type validation
-   Malware scanning
-   Size limits
-   Sanitized filenames
-   Private storage
-   Non-executable storage location
-   Authorization checks
-   Audit logs

------------------------------------------------------------------------

## 6. High-priority threat: compromised administrator

### Scenario

An administrator account is compromised.

### Mitigations

-   MFA/passkeys
-   Short administrative sessions
-   Least privilege
-   Privileged role separation
-   Audit logs
-   Security alerts
-   Session revocation
-   Administrative network restrictions where practical

------------------------------------------------------------------------

## 7. Abuse cases

The application must explicitly test:

### Abuse Case A

User attempts to access another organization's case.

Expected result: **403/404 without data leakage.**

### Abuse Case B

User downloads a document without authorization.

Expected result: **Denied.**

### Abuse Case C

Expired signed URL is reused.

Expected result: **Denied.**

### Abuse Case D

User attempts 1,000 login requests.

Expected result: **Rate limiting/throttling.**

### Abuse Case E

User uploads a malicious file.

Expected result: **Rejected/quarantined.**

### Abuse Case F

User attempts to elevate their own role.

Expected result: **Denied and logged.**

------------------------------------------------------------------------

## 8. Detection

Monitor for: - Repeated failed logins - Unusual login locations/devices
where appropriate - Large document-download spikes - Repeated
authorization failures - Privilege changes - Suspicious API activity -
Repeated 4xx/5xx spikes - Storage access anomalies

------------------------------------------------------------------------

## 9. Incident response

The company should establish a documented process for:

1.  Detection
2.  Triage
3.  Containment
4.  Evidence preservation
5.  Eradication
6.  Recovery
7.  Stakeholder notification
8.  Post-incident review

Legal/privacy notification requirements should be reviewed and approved
by appropriate counsel.

------------------------------------------------------------------------

## 10. Risk acceptance

Any security exception should record:

-   Asset
-   Risk
-   Reason
-   Compensating control
-   Owner
-   Approval
-   Expiry/review date

Security exceptions should never become permanent by accident.

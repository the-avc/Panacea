# Panacea Consultancy Private Limited --- Data Classification & Handling Standard

## Document status

-   **Status:** Draft for management/legal approval
-   **Purpose:** Establish a practical classification model for
    information handled by the website and future client portal.
-   **Company context:** The company profile states that Panacea handles
    enforcement and investigation-related work and emphasizes
    confidentiality, private-data protection and data security.
    \[Company Profile, pp. 1--3\]
-   **Important:** The classifications and handling controls below are
    technical/operational recommendations and require approval by
    Panacea management and legal counsel.

------------------------------------------------------------------------

# 1. Classification levels

## Level 1 --- PUBLIC

Information approved for unrestricted publication.

Examples: - Company name - Approved service descriptions - Approved
company overview - Approved leadership information - Approved contact
information - Approved institutional-experience statements

Handling: - May be displayed on the public website. - May be indexed by
search engines if appropriate. - No confidentiality controls beyond
normal website security.

------------------------------------------------------------------------

## Level 2 --- INTERNAL

Information intended for Panacea personnel and authorized operational
use but not intended for public publication.

Examples: - Internal procedures - Non-public operational documentation -
Internal project information - Internal meeting records - Non-sensitive
administrative information

Handling: - Authentication required. - Access based on job role. - Do
not publish publicly. - Avoid unnecessary copying.

------------------------------------------------------------------------

## Level 3 --- CONFIDENTIAL

Information that could cause meaningful harm to Panacea or its clients
if improperly disclosed.

Examples: - Client communications - Assignment information - Case
metadata - Internal recovery information - Investigation-related
information - Non-public institutional information - Internal
legal/para-legal working material

Handling: - Authorized users only. - Encryption in transit and at
rest. - Access logging. - Least privilege. - Controlled sharing. - No
public URLs. - Defined retention period.

------------------------------------------------------------------------

## Level 4 --- RESTRICTED / HIGHLY CONFIDENTIAL

Information requiring the highest level of protection.

Potential examples: - Sensitive client-provided documents -
Legal/recovery case documents - Personal identification information -
Sensitive financial information - Investigation evidence -
Authentication credentials - Encryption keys - Security secrets

Handling: - Explicit authorization. - Strong authentication/MFA. -
Strict resource-level authorization. - Encryption. - Detailed audit
trail. - Private storage. - Restricted downloads. - Controlled
retention. - Secure deletion when approved. - No use in development
environments.

------------------------------------------------------------------------

# 2. Handling matrix

  Activity                     Public         Internal   Confidential               Restricted
  ------------------------ ---------- ---------------- -------------- ------------------------
  Public website                  Yes               No             No                       No
  Search engine indexing          Yes               No             No                       No
  Email                           Yes       Controlled     Restricted    Avoid unless approved
  Client portal              Optional              Yes            Yes                      Yes
  Local download                  Yes       Controlled     Restricted        Highly restricted
  Development database            Yes   Sanitized only   No real data                       No
  Analytics                       Yes       Controlled       Minimize                       No
  Backup                          Yes              Yes      Encrypted   Encrypted + restricted
  Audit logging                   Yes              Yes            Yes                      Yes

------------------------------------------------------------------------

# 3. Data minimization

Only collect information required for the business function.

Do not collect sensitive information merely because it might be useful
later.

For the public website: - Avoid collecting case information. - Avoid
collecting identity documents. - Avoid collecting financial details. -
Avoid collecting confidential legal documents.

The public contact form should explicitly warn users not to submit
sensitive information.

------------------------------------------------------------------------

# 4. Client portal rules

For Confidential and Restricted information:

### Access

Require: - Authentication - MFA where applicable - Authorization -
Resource-level access checks

### Storage

Use: - Private database - Private object storage - Encryption

### Transfer

Use: - HTTPS/TLS - Short-lived signed URLs for documents

### Monitoring

Record: - Access - Upload - Download - Modification - Permission changes

------------------------------------------------------------------------

# 5. Retention

Do not invent retention periods.

Panacea management and legal counsel should define retention
requirements for:

-   Case records
-   Documents
-   Investigation material
-   Client communications
-   Audit logs
-   Security logs
-   Backups

Each data type should have:

``` text
Data type
Owner
Classification
Retention period
Legal hold rule
Deletion method
Approval authority
```

------------------------------------------------------------------------

# 6. Deletion

Deletion must be deliberate and auditable for Confidential/Restricted
information.

Consider: - Logical deletion - Retention locks where required - Secure
object deletion - Backup lifecycle - Legal holds

Do not delete records subject to a legal or contractual retention
requirement.

------------------------------------------------------------------------

# 7. Development and testing

Production Confidential/Restricted data must not be copied into
development environments.

Use: - Synthetic data - Redacted data - Anonymized test data

Developers should not receive production access unless explicitly
authorized and necessary.

------------------------------------------------------------------------

# 8. Sharing

Before sharing Confidential or Restricted information externally:

1.  Verify recipient identity.
2.  Verify authorization.
3.  Confirm the minimum required information.
4.  Use an approved secure transfer method.
5.  Record the transfer where required.

Do not send sensitive documents through uncontrolled public links.

------------------------------------------------------------------------

# 9. Data ownership

Every sensitive dataset should have an identified owner responsible for:

-   Access decisions
-   Classification
-   Retention
-   Sharing
-   Review
-   Deletion

------------------------------------------------------------------------

# 10. Review schedule

Review this classification standard at least annually and whenever there
is a major change to:

-   Services
-   Client portal
-   Data types
-   Legal requirements
-   Infrastructure
-   Security architecture

------------------------------------------------------------------------

# 11. Items requiring Panacea confirmation

Before implementation, obtain written decisions on:

1.  What categories of client/case data will the portal actually store?
2.  Which users and organizations will access it?
3.  Which documents may be uploaded?
4.  Required retention periods?
5.  Any legal/contractual retention obligations?
6.  Approved hosting/cloud region?
7.  Required backup location?
8.  Approved administrators?
9.  Required incident-notification process?
10. Any client-specific security requirements?
11. Whether institutional names/logos may be displayed publicly?
12. Whether any regulatory/security certifications may be claimed?

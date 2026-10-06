# Panacea Consultancy --- Authentication & RBAC Specification

## 1. Security principle

Authentication proves identity.

Authorization determines access.

No frontend-only authorization is acceptable.

Every protected server request must evaluate the authenticated identity,
organization membership, role, permission and resource relationship.

## 2. Roles

Proposed roles:

  ----------------------------------------------------------------------------
  Role                    Scope                   Purpose
  ----------------------- ----------------------- ----------------------------
  Platform Super Admin    Platform                Highest operational
                                                  privilege

  Security/Compliance     Platform                Security, audit and
  Admin                                           compliance operations

  Operations Admin        Platform/Org            Operational management

  Panacea Legal/Recovery  Organization            Authorized case operations
  User                                            

  Panacea Investigation   Organization            Investigation/verification
  User                                            operations

  Institutional Client    Organization            Manage users for client
  Admin                                           organization

  Institutional Client    Organization            Access assigned client
  User                                            resources
  ----------------------------------------------------------------------------

These roles require confirmation by Panacea management.

## 3. Permission model

Permissions should follow:

`resource:action`

Examples:

``` text
case:read
case:create
case:update
case:assign
case:change_status

document:read
document:upload
document:download
document:delete

user:read
user:create
user:disable

organization:read
organization:update

audit:read
security_event:read
role:assign
```

Avoid broad permissions such as `admin:*` unless absolutely necessary.

## 4. Resource authorization

Example:

``` text
User
 ↓
Membership
 ↓
Organization
 ↓
Case
 ↓
Assignment
 ↓
Permission
```

A user must satisfy all required checks.

## 5. Cross-tenant isolation

Institution A:

``` text
A
 ├── Case A1
 └── Case A2
```

Institution B:

``` text
B
 ├── Case B1
 └── Case B2
```

A user from A must not: - Read B cases - Download B documents - Modify B
cases - Enumerate B IDs - Infer B case existence where avoidable

Test this at API level, not just UI level.

## 6. Authentication

Recommended: - Mature identity provider or security-reviewed
authentication framework - MFA - Passkeys/WebAuthn where practical -
Secure password hashing if passwords are used - Secure session cookies -
Session expiry - Session revocation - Login throttling - Password-reset
protections

Never implement custom cryptographic algorithms.

## 7. Session rules

Use: - HttpOnly - Secure - SameSite cookies where cookie sessions are
used - Rotation after sensitive authentication events - Server-side
revocation - Idle timeout - Absolute timeout

Do not put long-lived authentication secrets in browser localStorage
unless there is a documented security reason and compensating controls.

## 8. High-risk actions

Require re-authentication or step-up authentication for: - Role
changes - Granting organization access - Disabling security controls -
Deleting sensitive documents - Changing privileged accounts

Every such event must be audited.

## 9. Authorization pseudocode

``` text
authenticate(request)
    ↓
user = identity
    ↓
membership = getMembership(user, organization)
    ↓
role = getRole(user, organization)
    ↓
permission = checkPermission(role, resource, action)
    ↓
resource = loadResourceWithinOrganization(resourceId, organization)
    ↓
assignment = checkAssignment(user, resource)
    ↓
if all checks pass:
    allow
else:
    deny + audit
```

## 10. Error behavior

Avoid leaking sensitive existence information.

For some resources, unauthorized users should receive a generic
not-found response rather than revealing that another organization's
resource exists.

The exact policy should be consistent across the API.

## 11. Admin separation

Super-admin privileges should not automatically be granted to ordinary
operational users.

Use separate privileged roles and, where practical: - Separate admin
interface - Stronger MFA - Shorter sessions - Additional monitoring

## 12. Account lifecycle

### Provisioning

-   Authorized administrator creates/invites user.
-   User verifies identity.
-   MFA setup required according to role.

### Suspension

-   Revoke active sessions.
-   Disable access.
-   Preserve required audit records.

### Offboarding

-   Disable account.
-   Revoke sessions.
-   Revoke MFA factors where appropriate.
-   Remove organization memberships.
-   Review owned/assigned cases and documents.

## 13. Security tests

Mandatory tests: - User A cannot read User B's restricted case. - User A
cannot download User B's document. - Client Admin cannot become Platform
Admin. - Disabled user cannot authenticate. - Revoked session cannot
access APIs. - Expired signed document URL cannot be reused. - Role
changes are audited. - Organization membership changes are audited.

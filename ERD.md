# Panacea Consultancy --- ERD Specification

## Purpose

Database design for the secure client portal and administration system.

## Core entities

``` text
Organization
 ├── OrganizationMembership ── User
 └── Case
       ├── CaseAssignment ── User
       ├── CaseStatusHistory
       └── Document
              └── DocumentVersion

User
 ├── UserRole ── Role ── RolePermission ── Permission
 ├── Session
 ├── MFAFactor
 ├── AuditLog
 └── SecurityEvent
```

## Tables

### organizations

-   id UUID PK
-   legal_name VARCHAR
-   status ENUM(active, suspended, archived)
-   created_at TIMESTAMP
-   updated_at TIMESTAMP

### users

-   id UUID PK
-   email VARCHAR UNIQUE
-   display_name VARCHAR
-   status ENUM(active, suspended, disabled)
-   created_at TIMESTAMP
-   updated_at TIMESTAMP
-   last_login_at TIMESTAMP NULL

Passwords must never be stored in plaintext.

### organization_memberships

-   id UUID PK
-   organization_id UUID FK
-   user_id UUID FK
-   status
-   created_at
-   revoked_at NULL

Unique: `(organization_id, user_id)`

### roles

-   id UUID PK
-   name VARCHAR UNIQUE
-   description TEXT

### permissions

-   id UUID PK
-   resource VARCHAR
-   action VARCHAR

Unique: `(resource, action)`

### user_roles

-   id UUID PK
-   user_id UUID FK
-   role_id UUID FK
-   organization_id UUID NULL
-   created_at

Organization-scoped roles must include the organization ID.

### role_permissions

-   role_id UUID FK
-   permission_id UUID FK

Composite PK: `(role_id, permission_id)`

### cases

-   id UUID PK
-   organization_id UUID FK
-   external_reference VARCHAR NULL
-   title VARCHAR
-   status VARCHAR
-   classification ENUM(internal, confidential, restricted)
-   created_at
-   updated_at

Index: - `(organization_id, status)` - `(organization_id, created_at)`

### case_assignments

-   id UUID PK
-   case_id UUID FK
-   user_id UUID FK NULL
-   team_reference VARCHAR NULL
-   assignment_type VARCHAR
-   assigned_at
-   revoked_at NULL

At least one assignee/team reference must be present.

### case_status_history

-   id UUID PK
-   case_id UUID FK
-   old_status VARCHAR NULL
-   new_status VARCHAR
-   changed_by UUID FK
-   changed_at
-   reason TEXT NULL

### documents

-   id UUID PK
-   case_id UUID FK
-   classification ENUM(confidential, restricted)
-   original_filename VARCHAR
-   storage_key VARCHAR
-   mime_type VARCHAR
-   size_bytes BIGINT
-   checksum VARCHAR
-   status ENUM(uploading, scanning, available, quarantined, deleted)
-   uploaded_by UUID FK
-   created_at

Never store document contents directly in application logs.

### document_versions

-   id UUID PK
-   document_id UUID FK
-   version_number INTEGER
-   storage_key VARCHAR
-   checksum VARCHAR
-   size_bytes BIGINT
-   uploaded_by UUID FK
-   created_at

Unique: `(document_id, version_number)`

### notifications

-   id UUID PK
-   recipient_user_id UUID FK
-   type VARCHAR
-   title VARCHAR
-   body TEXT
-   read_at NULL
-   created_at

### sessions

-   id UUID PK
-   user_id UUID FK
-   session_hash VARCHAR
-   device_metadata JSONB NULL
-   created_at
-   expires_at
-   revoked_at NULL
-   last_seen_at

Do not store reusable raw session secrets.

### mfa_factors

-   id UUID PK
-   user_id UUID FK
-   type ENUM(passkey, totp, other_approved_method)
-   label VARCHAR
-   credential_reference TEXT
-   created_at
-   last_used_at NULL
-   revoked_at NULL

Sensitive authentication material must use the authentication provider's
secure storage model.

### audit_logs

-   id UUID PK
-   actor_user_id UUID NULL
-   organization_id UUID NULL
-   event_type VARCHAR
-   action VARCHAR
-   resource_type VARCHAR
-   resource_id UUID NULL
-   result ENUM(success, denied, failure)
-   request_id VARCHAR
-   created_at
-   metadata JSONB NULL

Do not log passwords, access tokens, private keys, or full document
contents.

### security_events

-   id UUID PK
-   user_id UUID NULL
-   organization_id UUID NULL
-   event_type VARCHAR
-   severity ENUM(low, medium, high, critical)
-   source_ip INET NULL
-   request_id VARCHAR NULL
-   details JSONB NULL
-   created_at
-   resolved_at NULL
-   resolved_by UUID NULL

## Tenant isolation rule

Every case query must be scoped by organization.

Bad:

``` sql
SELECT * FROM cases WHERE id = $1;
```

Correct conceptual pattern:

``` sql
SELECT *
FROM cases
WHERE id = $1
  AND organization_id = $2;
```

For privileged Panacea roles, access must still be explicitly authorized
rather than assumed.

## Data classification

Public website data: - Public

Portal operational data: - Internal/Confidential

Case records: - Confidential or Restricted

Sensitive documents: - Restricted

Credentials/secrets: - Restricted

## Database security

-   Private database network
-   TLS
-   Least-privilege DB roles
-   Parameterized queries
-   Encryption at rest
-   Automated backups
-   Point-in-time recovery
-   Restore testing
-   Audit/activity monitoring

## Deletion

Use soft deletion only where required for business/audit/legal reasons.
Do not treat soft deletion as secure erasure. Retention and deletion
rules require Panacea/legal approval.

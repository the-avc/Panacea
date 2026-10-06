# SECURITY ADVISORY: HISTORICAL CREDENTIAL COMPROMISE NOTICE

**Advisory ID:** PANACEA-SEC-ADV-2026-001  
**Severity:** Critical (Informational / Architectural Directive)  
**Status:** Remediated in Source Code — Historical Purge & Policy Enforcement  
**Applicability:** All Development, Staging, and Production Deployments  

---

## 1. Executive Summary

During prototype and preliminary test fixture development, placeholder development passwords and sample TOTP secrets were previously referenced in local seed fixtures (`seed-data.ts`). Although runtime guards prevented their execution in production environments (`NODE_ENV=production`), these historical values were committed to version control.

Under industry standard DevSecOps practices and threat modeling:
> **All credentials, passwords, and TOTP seeds that have ever been committed to this repository MUST be formally deemed compromised.**

---

## 2. Remediated Architecture

The codebase has undergone a complete remediation pass:
1. **Source Code Purge:** All literal passwords, hardcoded default credentials, and static Base32 TOTP secret strings have been completely removed from all source files and test fixtures.
2. **Dynamic Generation:** Development and test environments generate dynamic, high-entropy, cryptographically random credentials at test runtime via CSPRNG (`crypto.randomBytes`).
3. **External Injection:** Developer workstations must use git-ignored `.env.test.local` or `.env.development.local` files for repeatable test executions.
4. **Production Isolation:** In production (`NODE_ENV=production`), all seed fixtures (`SEED_USERS`, `SEED_ORGS`, `SEED_CASES`, `SEED_DOCUMENTS`, `SEED_MFA_FACTORS`) are structurally empty (`[]` or `{}`), and any invocation of `TEST_CREDENTIALS` throws a fatal execution error.

---

## 3. Strict Deployment Directives

1. **Zero Credential Reuse:**
   - Under NO circumstance may any historical password (including former phrases containing `PanaceaSuperAdmin`, `ManagingDirector`, `OperationsDirector`, `ComplianceOfficer`, etc.) or static TOTP seeds (e.g. `JBSWY3DPEHPK3PXP`) be used or accepted in any environment.
2. **Production Provisioning:**
   - All production administrative accounts, service accounts, and institutional client credentials must be generated freshly via secure out-of-band administrative provisioning workflows.
3. **Argon2id and TOTP Key Entropy:**
   - All newly provisioned passwords must strictly satisfy the 16+ character complexity rules enforced by `@panacea/security` (`validatePasswordStrength`).
   - All MFA enrollment secrets must be generated at enrollment time with 160+ bits of entropy via RFC 6238 CSPRNG and stored in PostgreSQL `mfa_factors`.

---

## 4. Verification

Compliance verification is continuously enforced in the test suite by:
- `apps/api/test/security/production-database-consistency.test.ts`
- Static regex analysis preventing credential string literals from ever entering repository branches.

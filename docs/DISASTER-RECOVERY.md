# PANACEA CONSULTANCY PRIVATE LIMITED
## Production Disaster Recovery & Business Continuity Plan

**Document ID:** PAN-SEC-DRP-2026-V1  
**Classification:** Confidential — Internal & Institutional Client Review Only  
**Effective Date:** October 2026  
**Status:** READY FOR PRODUCTION SECURITY REVIEW  

---

### 1. Executive Summary & Recovery Objectives

Panacea Consultancy Private Limited operates secured institutional credit recovery, SARFAESI legal enforcement, and asset investigation management platforms for major Indian scheduled commercial banks and NBFCs.

This document defines disaster recovery, data protection, backup topologies, point-in-time restoration, and incident containment protocols across all persistent tiers:
- **Relational Datastore:** PostgreSQL 16
- **Object Storage:** Private S3-Compatible / MinIO Certified Court Document Repository
- **Centralized Cache & Rate Limiting:** Redis Cluster
- **Audit & Compliance Trail:** Cryptographically Hash-Chained Audit Logs

#### Recovery Targets
| Metric | Target Specification | Operational Requirement |
| :--- | :--- | :--- |
| **RPO (Recovery Point Objective)** | **<= 15 minutes** `[REQUIRES INFRASTRUCTURE CONFIRMATION]` | Achieved via continuous WAL archiving to isolated offsite storage. |
| **RTO (Recovery Time Objective)** | **<= 2 hours** `[REQUIRES INFRASTRUCTURE CONFIRMATION]` | Standby infrastructure orchestration, automated container provisioning. |
| **Document Vault RPO** | **0 seconds (Zero Loss)** `[REQUIRES INFRASTRUCTURE CONFIRMATION]` | Multi-region synchronous object replication and S3 Object Lock (WORM). |
| **Audit Trail RPO** | **0 seconds (Zero Loss)** | Immutable append-only write with SHA-256 cryptographic linkage. |

> [!IMPORTANT]
> Specific RPO and RTO SLA guarantees for client contracts are contingent upon production cloud hosting tier selection (e.g. AWS Multi-AZ RDS vs. On-Premises Co-Location) and require explicit infrastructure confirmation before binding contractual execution.

---

### 2. Backup Topologies & Schedules

#### 2.1 PostgreSQL Database Backup
1. **Continuous WAL Archiving:**
   - WAL (Write-Ahead Logging) archiving enabled (`archive_mode = on`).
   - Compressed WAL segments streamed every 60 seconds to secondary private backup bucket.
2. **Daily Full Snapshots:**
   - Automated full logical and physical snapshot taken daily at 02:00 IST (`pg_dump` with custom compressed format and physical storage volume snapshot).
   - Encryption: AES-256 server-side encryption with KMS customer-managed key.
   - Retention: 30 days active rotation, 365 days monthly compliance archive.
3. **Storage Location:**
   - Air-gapped offsite secondary region S3 bucket with separate IAM role and bucket policy prohibiting deletion.

#### 2.2 Object Storage (Certified Legal Documents) Backup
1. **Bucket Versioning:**
   - Mandatory bucket versioning enabled on `panacea-documents`.
   - Deleted objects create delete markers; underlying versioned byte payload remains intact.
2. **Cross-Region Replication (CRR):**
   - Asynchronous replication enabled from primary object storage bucket to geographically isolated secondary disaster recovery bucket.
3. **Object Lock / WORM Storage:**
   - Certified legal orders (Section 14 DM orders, Section 13(2) notices) protected by Compliance Mode Object Lock for 7 years as required by banking record retention guidelines.
4. **Quarantine Prefix Isolation:**
   - `quarantine/` prefix excluded from backup replication; temporary quarantine artifacts auto-expire after 24 hours via lifecycle rules.

#### 2.3 Cryptographic Audit Trail Preservation
1. **Chain Verification:**
   - The platform calculates chained hashes (`hash = sha256(prev_hash + record)`).
   - Nightly automated cron executes `verifyAuditLogIntegrity(logs)`.
   - Any alert triggers immediate security incident response.
2. **Export to WORM Storage:**
   - Verified audit records batched daily and archived to immutable cold storage.

---

### 3. Step-by-Step Restoration Playbooks

> [!CAUTION]
> A backup that has never been restored is not a verified backup. Production disaster recovery drills MUST be performed quarterly in an isolated staging environment.

#### 3.1 PostgreSQL Point-in-Time Recovery (PITR) Drill
1. **Provision Recovery Target Instance:**
   ```bash
   # Deploy clean PostgreSQL 16 container or target VM instance
   docker run --name panacea-postgres-recovery -e POSTGRES_PASSWORD=${POSTGRES_RECOVERY_PASSWORD} -d postgres:16-alpine
   ```
2. **Restore Base Snapshot:**
   ```bash
   pg_restore --clean --if-exists -h localhost -U panacea_app -d panacea /backups/postgres/panacea_base_snapshot_latest.dump
   ```
3. **Replay WAL Segments up to Recovery Target Time:**
   ```sql
   -- Set recovery_target_time in postgresql.conf
   restore_command = 'cp /backups/wal/%f %p'
   recovery_target_time = '2026-10-06 14:00:00 IST'
   recovery_target_action = 'promote'
   ```
4. **Integrity Validation:**
   - Run verification query: check table record counts, case docket count, and foreign key constraints.
   - Verify audit log hash chain continuity using `verifyAuditLogIntegrity()`.

#### 3.2 Object Storage Restoration Drill
1. **Verify Target Bucket Access:**
   ```bash
   mc alias set recovery-target https://s3-dr.panaceaconsultancy.in $DR_ACCESS_KEY $DR_SECRET_KEY
   ```
2. **Synchronize Missing Objects from DR Bucket:**
   ```bash
   mc mirror --overwrite s3-dr/panacea-documents-dr local/panacea-documents
   ```
3. **Validate Checksum Consistency:**
   - For a sample of 100 restored documents, calculate SHA-256 byte checksum directly from S3 object:
     ```typescript
     const actualHash = crypto.createHash('sha256').update(downloadedBuffer).digest('hex');
     assert(actualHash === dbRecord.checksum);
     ```

---

### 4. Incident Response & System Recovery Workflow

```
[Incident Detected: Datacenter Outage / Ransomware / Corruption]
                        │
                        ▼
            [Declare Disaster State]
                        │
                        ▼
        [Activate Disaster Recovery Team]
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
[PostgreSQL Database]             [Object Storage]
  - Launch standby target           - Switch S3 endpoint to DR replica
  - Apply base dump + WAL           - Verify private bucket policy
  - Verify audit hash chain         - Re-verify SHA-256 hashes
       └────────────────┬────────────────┘
                        │
                        ▼
     [Launch Hardened API Instances in DR Zone]
  - Start API with NODE_ENV=production
  - Startup validator executes:
      * Validates DB connection
      * Validates S3 bucket access & privacy
      * Validates ClamAV scanner
      * Validates Redis rate limiter
      * Validates zero demo accounts
                        │
                        ▼
        [Traffic Cutover via Nginx / DNS]
  - Update DNS record / Nginx upstream proxy
  - Verify /health/live (200)
  - Verify /health/ready (200)
                        │
                        ▼
          [Post-Recovery Incident Review]
  - Perform audit log reconciliation
  - Document lessons learned and update DR plan
```

---

### 5. Disaster Recovery Roles & Contact Matrix

| Role | Responsibility | Contact Channel |
| :--- | :--- | :--- |
| **Incident Commander** | Declares DR state, coordinates teams | `emergency-ic@panaceaconsultancy.in` |
| **Principal DBA** | Database snapshot restoration and PITR | `dba-lead@panaceaconsultancy.in` |
| **SecOps & Infrastructure** | S3 replication, network cutover, TLS certs | `secops@panaceaconsultancy.in` |
| **Directorate Liaison** | Institutional bank nodal officer notifications | `compliance@panaceaconsultancy.in` |

---

### 6. Verification Status

- [x] Fail-closed database policy verified in test suite
- [x] Cryptographic audit chain tamper detection verified in test suite
- [x] Opaque object storage key architecture implemented
- [x] Production startup validation prevents running unconfigured or in-memory stores
- [ ] Physical multi-region replica deployment `[REQUIRES INFRASTRUCTURE CONFIRMATION]`
- [ ] Secondary AWS KMS cross-region replication `[REQUIRES INFRASTRUCTURE CONFIRMATION]`

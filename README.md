# Secured Creditor Enforcement & Institutional Operations Platform
## Enterprise Secured Client & Administrative Command Portal

Production-grade, institutional, security-first digital ecosystem built strictly for secured creditor enforcement, multi-tenant bank recovery tracking, and regulatory compliance under the **SARFAESI Act, 2002** and related statutory frameworks.

---

## 🏛️ Domain Context & Operational Scope

- **Platform Scope:** Institutional Para-Legal & Enforcement Support for Secured Creditors (Scheduled Commercial Banks, Housing Finance Companies, NBFCs, and ARCs).
- **Core Operations:**
  - **SARFAESI Act, 2002 Enforcement:** Section 13(2) Demand Notices, Section 13(4) Possession Notices, Section 14 District Magistrate / Chief Metropolitan Magistrate Petitions & Affidavits, Physical Asset Possession Execution, Police Protection Coordination, and Public Auction Liaison.
  - **Field Investigation & Intelligence:** Pre-enforcement Asset Verification, Borrower Locating, Title Tracing, Valuation Assistance, and Financial Fraud Detection.
- **Operating Jurisdiction:** Multi-state regional jurisdictional enforcement (Eastern Regional Corridors).

---

## 🏗️ Architecture & Monorepo Topology

```
platform/
├── apps/
│   ├── web/           # Public Institutional Portal (Next.js 14 App Router, Port 3000)
│   ├── portal/        # Secure Authenticated Client & Directorate Portal (Next.js 14, Port 3001)
│   └── api/           # Hardened Node.js/Express REST API with Auditing (Port 4000)
├── packages/
│   ├── types/         # Canonical Domain Interfaces, SARFAESI State Machine, DTOs
│   ├── security/      # Cryptographic hashing, MIME/Magic-byte verification, Sanitization
│   ├── config/        # Environment configurations, System Timeouts, System Constants
│   └── ui/            # Institutional Design System & Accessible Component Suite (18 Components)
├── infrastructure/
│   ├── docker/        # PostgreSQL 16 & MinIO S3 Object Storage with Secure Private Bucket Policy
│   └── nginx/         # Hardened Nginx reverse proxy config with TLS 1.3 & Rate Limiting
└── .github/workflows/ # CI/CD Pipeline (Typecheck, Security Tests & Production Build)
```

---

## 🚀 Complete Step-by-Step Setup Guide (Post-Clone)

Follow these exact steps after cloning the repository.

### Prerequisites Check
Before running any commands, ensure your environment meets the minimum version requirements:
- **Node.js:** `>= 20.0.0` (check via `node -v`)
- **pnpm:** `>= 9.0.0` (install via `npm install -g pnpm` or `corepack enable && corepack prepare pnpm@9.12.0 --activate`)
- **Git** installed and available in PATH
- **Docker & Docker Compose** (Optional — only required if running live PostgreSQL and MinIO S3 storage)

> **Windows PowerShell Note:** If running on Windows PowerShell, execute pnpm using `pnpm.cmd` to comply with Windows script execution policies.

---

### Step 1: Clone the Repository
```bash
git clone <REPOSITORY_URL>
cd Panacea
```

---

### Step 2: Install Monorepo Dependencies
Install all workspace dependencies across packages and applications:

**Windows PowerShell:**
```powershell
pnpm.cmd install
```

**Linux / macOS / Git Bash:**
```bash
pnpm install
```

---

### Step 3: Configure Environment Variables
Copy the template configuration to create your local `.env` file:

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

**Linux / macOS / Git Bash:**
```bash
cp .env.example .env
```

*Note: The default `.env.example` comes pre-configured with local development ports (3000, 3001, 4000) and secure defaults.*

---

### Step 4: Build Monorepo Shared Packages
Compile the shared libraries (`@panacea/types`, `@panacea/security`, `@panacea/config`, `@panacea/ui`):

**Windows PowerShell:**
```powershell
pnpm.cmd --filter @panacea/types build
pnpm.cmd --filter @panacea/security build
pnpm.cmd --filter @panacea/config build
pnpm.cmd --filter @panacea/ui build
```

**Linux / macOS / Git Bash:**
```bash
pnpm --filter @panacea/types build
pnpm --filter @panacea/security build
pnpm --filter @panacea/config build
pnpm --filter @panacea/ui build
```

---

### Step 5: (Optional) Start Infrastructure Containers
You can run the platform in one of two modes:

#### Option A: Zero-Configuration Mode (Default / Fastest)
No Docker required. The backend API (`@panacea/api`) includes an **in-memory secure datastore** preloaded with realistic test cases, documents, audit logs, and pre-configured leadership credentials. You can skip directly to **Step 6**.

#### Option B: Live PostgreSQL 16 & MinIO S3 Containers
To run against actual PostgreSQL and MinIO S3 object storage:

**Windows PowerShell:**
```powershell
# 1. Start PostgreSQL 16 & MinIO containers in background
pnpm.cmd docker:up

# 2. Run database migration schema
pnpm.cmd db:migrate

# 3. Seed database with institutional test dockets and users
pnpm.cmd db:seed
```

**Linux / macOS / Git Bash:**
```bash
# 1. Start containers
pnpm docker:up

# 2. Run migrations
pnpm db:migrate

# 3. Seed data
pnpm db:seed
```

To stop containers later:
```bash
pnpm.cmd docker:down   # Windows
pnpm docker:down       # Linux / macOS
```

---

### Step 6: Start All Applications (Development Server)
Launch all 3 applications concurrently with hot-reloading via Turborepo:

**Windows PowerShell:**
```powershell
pnpm.cmd dev
```

**Linux / macOS / Git Bash:**
```bash
pnpm dev
```

#### Running Applications Individually in Separate Terminals:
If you prefer running services in separate terminal windows:
```powershell
# Terminal 1: Backend REST API (Port 4000)
pnpm.cmd --filter @panacea/api dev

# Terminal 2: Public Institutional Website (Port 3000)
pnpm.cmd --filter @panacea/web dev

# Terminal 3: Client & Directorate Portal (Port 3001)
pnpm.cmd --filter @panacea/portal dev
```

---

### Step 7: Access the Applications in Your Browser

Once running, access the services at:

| Service | Local URL | Description |
| :--- | :--- | :--- |
| **Public Institutional Website** | [http://localhost:3000](http://localhost:3000) | Public brand identity, SARFAESI services, operational scope & institutional inquiries |
| **Directorate & Admin Gateway** | [http://localhost:3001/admin/login](http://localhost:3001/admin/login) | Executive Command Center for Directorate Leadership and Operations Staff |
| **Empanelled Bank Client Desk** | [http://localhost:3001/login?portal=client](http://localhost:3001/login?portal=client) | Restricted portal for Bank Nodal Recovery Desks |
| **Platform Command Center** | [http://localhost:3001/admin](http://localhost:3001/admin) | System administration, personnel onboarding & statutory audit trails |
| **Backend REST API** | [http://localhost:4000/api/v1](http://localhost:4000/api/v1) | Authenticated REST API & cryptographic audit engine |

---

## 🔑 Demonstration Personas & RBAC Tiers

All pre-configured testing accounts use the universal demonstration password: **`PanaceaSecure2026!#`**

| Role / Title | RBAC Tier | Access Scope | Login Method |
| :--- | :--- | :--- | :--- |
| **Managing Director** | `platform_super_admin` | Full cross-bank portfolio oversight, system governance, and legal mandate authority | Click persona button on `/admin/login` |
| **Director — Operations** | `operations_admin` | Field operations oversight, officer assignments, and statutory enforcement management | Click persona button on `/admin/login` |
| **Systems Administrator** | `platform_super_admin` | Tenant configuration, security audit logs, and account lifecycle management | Click persona button on `/admin/login` |
| **Legal Recovery Lead** | `panacea_legal_recovery_user` | Section 13(2) notices, Section 14 DM court petitions, and affidavits | Click persona button on `/login` (Staff tab) |
| **Chief Investigator** | `panacea_investigation_user` | Asset verification, title tracing, and borrower fraud investigation | Click persona button on `/login` (Staff tab) |
| **Bank Nodal Officer (Bank 1)**| `institutional_client_admin` | Strictly scoped to Bank 1 recovery dockets; BOLA isolated | Click persona button on `/login` (Client tab) |
| **Bank Recovery Desk (Bank 2)** | `institutional_client_user` | Strictly scoped to Bank 2 recovery dockets; BOLA isolated | Click persona button on `/login` (Client tab) |

*(Note: On both the unified login page and the dedicated Admin Gateway, one-click persona switcher buttons automatically autofill credentials for instant testing).*

---

## 🧪 Validation & Automated Testing Commands

### 1. Monorepo TypeScript Typecheck
Verify strict type-safety across all 7 workspace packages and apps:
```powershell
pnpm.cmd typecheck
```
*(Linux/macOS: `pnpm typecheck`)*

### 2. Automated Security Test Suite (16 / 16 Passing — 100%)
Execute the institutional security and authorization test suite:
```powershell
pnpm.cmd --filter @panacea/api test
```
*(Linux/macOS: `pnpm --filter @panacea/api test`)*

#### Verified Test Assertions:
- `[PASS]` Rejects unauthenticated requests with 401
- `[PASS]` Rejects forged or invalid session tokens with 401
- `[PASS]` Prevents error disclosure and stack trace leakage
- `[PASS]` Enforces multi-tenant BOLA isolation (cross-tenant queries strictly forbidden)
- `[PASS]` Permits authorized cross-tenant oversight for Director personas
- `[PASS]` Prevents illegal status skips in the SARFAESI state machine
- `[PASS]` Allows authorized sequential state progression
- `[PASS]` Validates file MIME types and inspects binary magic bytes
- `[PASS]` Enforces strict 50 MB document size ceiling
- `[PASS]` Sanitizes directory traversal attacks in file names
- `[PASS]` Never exposes private `storage_key` to client applications
- `[PASS]` Rejects cross-tenant document download requests
- `[PASS]` Forbids non-admin users from reading cryptographic audit logs
- `[PASS]` Forbids non-admin users from disabling user accounts
- `[PASS]` Allows Super Admin full audit trail and security event management

### 3. Production Build Compilation
Verify optimized production bundles for all applications:
```powershell
pnpm.cmd build
```
*(Linux/macOS: `pnpm build`)*

---

## 🐳 Production Container Deployment

To build production Docker containers with multi-stage builds and non-root users:

```bash
# 1. Build API Container
docker build -f apps/api/Dockerfile -t platform-api:latest .

# 2. Build Web Application Container
docker build -f apps/web/Dockerfile -t platform-web:latest .

# 3. Build Portal Application Container
docker build -f apps/portal/Dockerfile -t platform-portal:latest .
```

For full production server setup, Nginx reverse proxy configuration, and SSL instructions, refer to [`docs/DEPLOYMENT.md`](file:///e:/Panacea/docs/DEPLOYMENT.md).

---

## 🛡️ Security Hardening & Controls

1. **Multi-Tenant Isolation & BOLA/IDOR Prevention:**
   - Strict database-level and middleware tenant scoping (`requireTenantAccess`). Client organizations can never enumerate or access cross-tenant dockets or documents.
2. **Deterministic State Machine Enforcement:**
   - Case progress follows an unskippable sequence: `intake` → `demand_notice_served` → `possession_notice_issued` → `sec14_application_filed` → `dm_order_obtained` → `possession_taken` → `auction_scheduled` → `resolved`.
3. **MIME & Magic-Byte Document Protection:**
   - Files are validated against allowlisted MIME types (`application/pdf`, images, office docs), magic bytes, and a strict 50 MB limit. Storage keys are strictly opaque and never exposed to client browsers.
4. **Session Security & Concurrent Session Revocation:**
   - HttpOnly, Secure, SameSite=Strict cookies. Dual-tier session timeouts (30 min client / 15 min admin). User self-revocation of concurrent sessions.
5. **Tamper-Evident Audit Logging:**
   - Every read, update, status advance, and document access is immutably recorded with actor ID, organization context, request ID, timestamp, and IP.
6. **Information Disclosure Prevention:**
   - Production error filters strip stack traces and database details.
   - Portal pages serve `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
   - Clear authorization disclaimers accompany all institutional experience records.

---

## ⚖️ Legal & Compliance Disclaimer

This platform operates as a specialized enforcement and corporate consultancy system acting strictly on written instructions, legal authorizations, and valid empanelment mandates issued by secured creditor banks and financial institutions. The platform does not act as a court or tribunal, does not originate independent lending recovery actions without creditor mandate, and operates in strict adherence with the SARFAESI Act, 2002, Security Interest (Enforcement) Rules, 2002, and applicable judicial guidelines.

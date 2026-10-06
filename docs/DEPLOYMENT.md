# Panacea Consultancy Private Limited — Production Deployment Guide

This document outlines the deployment, container orchestration, SSL certificate configuration, and database provisioning steps for **Panacea Consultancy Private Limited**.

---

## 1. System Topology & Port Mapping

| Service | Internal Port | Public URL / Host | Purpose |
| :--- | :--- | :--- | :--- |
| **Public Website** (`apps/web`) | `3000` | `https://panaceaconsultancy.in` | Public brand presentation, credentials, and institutional services |
| **Client & Directorate Portal** (`apps/portal`) | `3001` | `https://portal.panaceaconsultancy.in` | Restricted secured creditor & Directorate command center (`noindex`) |
| **Hardened API Engine** (`apps/api`) | `4000` | `https://api.panaceaconsultancy.in` | Multi-tenant REST API, RBAC, session engine & audit logging |
| **PostgreSQL 16 Database** | `5432` | Internal VPC only | Relational data store for cases, documents, audit logs, and users |
| **MinIO / AWS S3** | `9000` | Internal VPC only | Private document bucket (`panacea-documents`) with zero public access |

---

## 2. Environment Configuration

Create a production `.env` file in the project root:

```ini
NODE_ENV=production

# Public Web & Portal URLs
NEXT_PUBLIC_API_URL=https://api.panaceaconsultancy.in/api/v1
NEXT_PUBLIC_PORTAL_URL=https://portal.panaceaconsultancy.in

# Database Configuration (PostgreSQL 16)
DATABASE_URL=postgresql://panacea_app:STRONG_GENERATED_PASSWORD@postgres:5432/panacea
DATABASE_SSL=false

# Storage Configuration (MinIO or AWS S3)
STORAGE_PROVIDER=s3
S3_ENDPOINT=http://minio:9000
S3_REGION=ap-south-1
S3_BUCKET=panacea-documents
S3_ACCESS_KEY_ID=YOUR_MINIO_ROOT_USER
S3_SECRET_ACCESS_KEY=YOUR_MINIO_ROOT_PASSWORD

# Security & Session Secrets
SESSION_SECRET=GENERATE_64_BYTE_RANDOM_HEX_STRING
COOKIE_DOMAIN=.panaceaconsultancy.in
RATE_LIMIT_REDIS_URL=redis://redis:6379

# Company Contact (Verified Profile)
COMPANY_EMAIL=panaceaconsultancypvtltd@gmail.com
COMPANY_PHONE_PATNA=+91-9304897257
COMPANY_PHONE_JHARKHAND=+91-9431432983
```

---

## 3. Database Initialization & Seeding

1. Start database containers:
   ```bash
   docker compose -f infrastructure/docker/docker-compose.yml up -d postgres minio minio-init
   ```

2. Execute SQL schema migration:
   ```bash
   pnpm db:migrate
   ```

3. Seed initial leadership personas and test dockets:
   ```bash
   pnpm db:seed
   ```

---

## 4. Reverse Proxy & SSL Configuration (Nginx + Certbot)

1. Install Certbot on host server:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx -y
   ```

2. Generate certificates for the 3 domains:
   ```bash
   sudo certbot certonly --standalone -d panaceaconsultancy.in -d www.panaceaconsultancy.in
   sudo certbot certonly --standalone -d portal.panaceaconsultancy.in
   sudo certbot certonly --standalone -d api.panaceaconsultancy.in
   ```

3. Copy hardened Nginx configuration:
   ```bash
   sudo cp infrastructure/nginx/nginx.conf /etc/nginx/nginx.conf
   sudo nginx -t && sudo systemctl reload nginx
   ```

---

## 5. Dockerized Monorepo Production Build

Each application includes a multi-stage Dockerfile:

```bash
# Build API container
docker build -f apps/api/Dockerfile -t panacea-api:latest .

# Build Web container
docker build -f apps/web/Dockerfile -t panacea-web:latest .

# Build Portal container
docker build -f apps/portal/Dockerfile -t panacea-portal:latest .
```

---

## 6. Verification Checklist

Before releasing to client banks:
- [ ] Run automated security test suite: `pnpm --filter @panacea/api test` (must pass 16/16).
- [ ] Verify `portal.panaceaconsultancy.in` returns `X-Robots-Tag: noindex, nofollow, noarchive`.
- [ ] Verify file uploads enforce 50MB ceiling and reject `.exe` / `.bat` / `.sh` files.
- [ ] Verify BOLA isolation prevents ICICI Bank from querying Axis Bank cases.
- [ ] Verify session cookies have `HttpOnly`, `SameSite=Strict`, and `Secure` attributes enabled.

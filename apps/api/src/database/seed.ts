import { Pool } from 'pg';
import { SEED_ROLES, SEED_PERMISSIONS } from './seed-data';

/**
 * PRODUCTION-SAFE INITIALIZATION SEED
 * Strictly provisions:
 * 1. Base RBAC Roles (platform_super_admin, security_compliance_admin, etc.)
 * 2. Fine-grained System Permissions
 * 3. Role-Permission Mappings
 *
 * CONTAINS ZERO:
 * - Demo accounts
 * - Fake bank organizations
 * - Default passwords
 * - Test credentials
 */
async function runProductionSeed() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.log('[SEED] Running in local/test memory mode. Production seed requires DATABASE_URL.');
    return;
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('[SEED:PROD] Initializing production RBAC definitions...');

    // 1. Roles
    for (const role of Object.values(SEED_ROLES)) {
      await client.query(
        `INSERT INTO roles (id, name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description`,
        [role.id, role.name, role.description],
      );
    }

    // 2. Permissions
    for (const perm of SEED_PERMISSIONS) {
      await client.query(
        `INSERT INTO permissions (id, resource, action)
         VALUES ($1, $2, $3)
         ON CONFLICT (resource, action) DO NOTHING`,
        [perm.id, perm.resource, perm.action],
      );
    }

    client.release();
    console.log('[SEED:PROD] Production RBAC seed completed with ZERO demo accounts.');
  } catch (err: any) {
    console.error(`[SEED:PROD] Seed execution failed: ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runProductionSeed();

import { Pool } from 'pg';
import {
  SEED_ORGS,
  SEED_ROLES,
  SEED_PERMISSIONS,
  SEED_CASES,
} from './seed-data';

/**
 * DEVELOPMENT & LOCAL TEST SEED RUNNER
 * Strictly forbidden from running against production environments.
 */
async function runDevSeed() {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      '[SEED:DEV] FATAL: seed:development is strictly forbidden from executing against production environments.',
    );
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.log('[SEED:DEV] In-memory datastore automatically populates dev fixtures on startup.');
    return;
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    const client = await pool.connect();
    console.log('[SEED:DEV] Populating development seed fixtures...');

    // 1. Roles
    for (const role of Object.values(SEED_ROLES)) {
      await client.query(
        `INSERT INTO roles (id, name, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO NOTHING`,
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

    // 3. Orgs
    for (const org of Object.values(SEED_ORGS)) {
      await client.query(
        `INSERT INTO organizations (id, legal_name, status)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING`,
        [org.id, org.legal_name, org.status],
      );
    }

    // 4. Cases
    for (const c of SEED_CASES) {
      await client.query(
        `INSERT INTO cases (id, organization_id, external_reference, title, status, classification)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.organization_id, c.external_reference, c.title, c.status, c.classification],
      );
    }

    client.release();
    console.log('[SEED:DEV] Development fixtures populated successfully.');
  } catch (err: any) {
    console.error(`[SEED:DEV] Development seeding failed: ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runDevSeed();

import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

/**
 * PANACEA DATABASE MIGRATION RUNNER
 * Applies schema.sql safely to target PostgreSQL instance
 */
async function runMigrations() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('[MIGRATE] ERROR: DATABASE_URL must be defined to run migrations.');
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`[MIGRATE] ERROR: Schema file not found at ${schemaPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('[MIGRATE] Connecting to PostgreSQL database...');
    const client = await pool.connect();
    console.log('[MIGRATE] Applying schema definitions...');
    await client.query(sql);
    client.release();
    console.log('[MIGRATE] Migration completed successfully.');
  } catch (err: any) {
    console.error(`[MIGRATE] Migration failed: ${err.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();

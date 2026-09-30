/**
 * Pre-start script: removes stuck/failed Prisma migration records
 * from the production database so that `prisma migrate deploy` can run cleanly.
 *
 * This is necessary because Neon (serverless Postgres) has a cold-start delay
 * (~8-10s) that causes `prisma migrate resolve --rolled-back` to time out.
 * This script uses the `pg` driver directly with a 30-second connection timeout
 * to reliably handle Neon cold starts.
 */

const { Client } = require('pg');

const STUCK_MIGRATIONS = [
  '20260930100000_webp_extension_update',
];

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log('[fix-migrations] No DATABASE_URL found, skipping.');
  process.exit(0);
}

const client = new Client({
  connectionString,
  connectionTimeoutMillis: 30000,
  query_timeout: 15000,
  ssl: connectionString.includes('neon.tech') || connectionString.includes('amazonaws')
    ? { rejectUnauthorized: false }
    : false,
});

async function main() {
  try {
    console.log('[fix-migrations] Connecting to database...');
    await client.connect();
    console.log('[fix-migrations] Connected.');

    for (const migrationName of STUCK_MIGRATIONS) {
      const result = await client.query(
        `DELETE FROM "_prisma_migrations" WHERE "migration_name" = $1`,
        [migrationName]
      );
      if (result.rowCount > 0) {
        console.log(`[fix-migrations] ✓ Removed stuck record: ${migrationName}`);
      } else {
        console.log(`[fix-migrations] ✓ No stuck record found for: ${migrationName} (already clean)`);
      }
    }
  } catch (err) {
    // Non-fatal: log the warning and exit 0 so the server can still attempt to start
    console.warn('[fix-migrations] Warning (non-fatal):', err.message);
  } finally {
    try { await client.end(); } catch {}
  }
}

main().then(() => process.exit(0)).catch(() => process.exit(0));

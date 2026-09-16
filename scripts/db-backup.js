#!/usr/bin/env node

/**
 * Dumps the Supabase Postgres database and uploads it to R2. Supabase's
 * free tier has no point-in-time recovery — see docs/production-readiness.md
 * Phase 3 — so this is the actual backup mechanism until/unless the
 * project upgrades plans. Run on a schedule via
 * .github/workflows/db-backup.yml; needs `pg_dump` on PATH.
 *
 * Uploads directly via aws4fetch rather than importing lib/storage/r2.ts —
 * that file is TypeScript/ESM (fine inside the Next.js app), but this
 * script runs as plain CommonJS Node in CI with no build step.
 */

const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { AwsClient } = require("aws4fetch");

async function uploadToR2(key, body) {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    throw new Error("R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME must all be set");
  }
  const client = new AwsClient({ accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY, service: "s3", region: "auto" });
  const url = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${encodeURIComponent(key)}`;
  const res = await client.fetch(url, { method: "PUT", body, headers: { "Content-Type": "application/octet-stream" } });
  if (!res.ok) {
    throw new Error(`R2 upload failed for "${key}": ${res.status} ${await res.text()}`);
  }
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dumpPath = path.join(os.tmpdir(), `whhf-db-backup-${timestamp}.dump`);

  console.log("Running pg_dump...");
  execFileSync("pg_dump", ["--format=custom", "--file", dumpPath, databaseUrl], { stdio: "inherit" });

  const stats = fs.statSync(dumpPath);
  console.log(`Dump written: ${dumpPath} (${(stats.size / 1024).toFixed(1)} KB)`);

  const key = `db-backups/whhf-${timestamp}.dump`;
  console.log(`Uploading to R2 at "${key}"...`);
  await uploadToR2(key, fs.readFileSync(dumpPath));

  fs.unlinkSync(dumpPath);
  console.log("Backup uploaded and local dump file cleaned up.");
}

main().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});

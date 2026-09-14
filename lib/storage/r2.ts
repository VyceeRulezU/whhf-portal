import { AwsClient } from "aws4fetch";

/**
 * Cloudflare R2 (S3-compatible) object storage — site images, backups,
 * and general file storage, kept separate from Supabase storage so that
 * doesn't fill up. See .env.example for the required variables and where
 * to get each one.
 *
 * Uses aws4fetch (a thin request-signer over fetch) rather than the full
 * AWS SDK — Cloudflare's own recommendation for R2 on Workers, since the
 * full SDK's dependency weight is a real problem for Workers bundle size
 * (see the Next.js/React/database compatibility work already done for
 * this project's Workers deployment). It also just means one code path works
 * identically in local Node dev and on Workers, no fallback needed.
 */

function getClient(): AwsClient {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY are not set — required for R2 storage. See .env.example."
    );
  }
  return new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" });
}

function getObjectUrl(key: string): string {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !bucket) {
    throw new Error("R2_ACCOUNT_ID / R2_BUCKET_NAME are not set — required for R2 storage. See .env.example.");
  }
  return `https://${accountId}.r2.cloudflarestorage.com/${bucket}/${encodeURIComponent(key)}`;
}

/** Uploads a file to the bucket at `key`, overwriting any existing object there. */
export async function uploadToR2(key: string, body: BodyInit, contentType: string): Promise<void> {
  const res = await getClient().fetch(getObjectUrl(key), {
    method: "PUT",
    body,
    headers: { "Content-Type": contentType }
  });
  if (!res.ok) {
    throw new Error(`R2 upload failed for "${key}": ${res.status} ${await res.text()}`);
  }
}

/** Deletes an object from the bucket. No-ops (does not throw) if the key doesn't exist. */
export async function deleteFromR2(key: string): Promise<void> {
  const res = await getClient().fetch(getObjectUrl(key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) {
    throw new Error(`R2 delete failed for "${key}": ${res.status}`);
  }
}

/**
 * Public URL for a key — only meaningful for objects in a bucket with
 * public access enabled (R2_PUBLIC_URL set). Do not use this for
 * anything that should stay private (e.g. raw donor data exports); those
 * should be fetched server-side via uploadToR2/getClient instead.
 */
export function getPublicR2Url(key: string): string {
  const base = process.env.R2_PUBLIC_URL;
  if (!base) {
    throw new Error("R2_PUBLIC_URL is not set — required to build public URLs. See .env.example.");
  }
  return `${base.replace(/\/$/, "")}/${key}`;
}

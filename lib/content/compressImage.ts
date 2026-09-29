// Client-only: shrinks a photo before it ever reaches the upload endpoint.
// Admin-uploaded images (mostly raw phone photos, often 3-8MB) were going
// straight to R2 and being served at full size to every visitor — Next's
// built-in image optimizer doesn't actually resize anything on this app's
// Cloudflare Workers deployment (verified: a /_next/image request at
// w=256 returns the exact same byte count as the original), so this is
// the one place in the pipeline that can still shrink an image. Runs in
// every browser that uploads through ImageUploadInput, so it benefits
// every image field in the CMS from one change.
const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 0.82;

export async function compressImageFile(file: File): Promise<File> {
  // Animated GIFs would be flattened to a single frame by the canvas
  // round-trip — leave them untouched rather than silently breaking them.
  if (file.type === "image/gif") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], newName, { type: "image/webp" });
  } catch {
    // Any decode/encode failure (unsupported format, canvas exhaustion,
    // etc.) — upload the original rather than blocking the admin.
    return file;
  }
}

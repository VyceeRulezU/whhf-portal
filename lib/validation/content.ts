import { z } from "zod";

/**
 * Validates admin content-editor save requests against the actual field
 * declared in lib/content/registry.ts — the registry is the source of
 * truth for what's a valid key/shape, these schemas just validate the
 * request envelope shape before that lookup happens in the route handler.
 * See app/api/admin/content/*.
 */
export const saveFieldSchema = z.object({
  fieldKey: z.string().min(1),
  value: z.string().max(20000)
});
export type SaveFieldInput = z.infer<typeof saveFieldSchema>;

export const saveListSchema = z.object({
  fieldKey: z.string().min(1),
  items: z.array(z.record(z.string(), z.string().max(20000))).max(100)
});
export type SaveListInput = z.infer<typeof saveListSchema>;

// Images only — matches what an <input type="file" accept="image/*"> would
// actually produce; anything else is rejected before it ever reaches R2.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB, matches ComposeEmailModal's attachment limit

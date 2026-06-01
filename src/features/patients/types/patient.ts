import { z } from 'zod';

// Permissive ingestion schema: coerces dirty API fields to their expected types.
// Each field uses .catch() so a bad value (e.g. avatar:{}) becomes a safe default
// instead of a parse error. Zod strips unknown fields (password, body, etc.) by default.
export const patientApiSchema = z.object({
  id: z.string().catch(''),
  createdAt: z.string().catch(''),
  name: z.string().catch(''),
  avatar: z.string().catch(''),
  description: z.string().catch(''),
  website: z.string().catch(''),
});

export type Patient = z.infer<typeof patientApiSchema>;

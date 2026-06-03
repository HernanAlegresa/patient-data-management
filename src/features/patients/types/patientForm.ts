import { z } from 'zod';
import { isValidImageUrl, isValidWebsiteUrl } from '../../../lib/urlUtils';

export const patientFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  avatar: z
    .string()
    .refine((v) => v === '' || isValidImageUrl(v), 'Must be a valid URL'),
  website: z
    .string()
    .refine((v) => v === '' || isValidWebsiteUrl(v), 'Must be a valid URL'),
  description: z.string().max(500, 'Max 500 characters'),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;

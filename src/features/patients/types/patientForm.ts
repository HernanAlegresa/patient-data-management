import { z } from 'zod';

export const patientFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  avatar: z.string().url('Must be a valid URL').or(z.literal('')),
  website: z.string().url('Must be a valid URL').or(z.literal('')),
  description: z.string().max(500, 'Max 500 characters'),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;

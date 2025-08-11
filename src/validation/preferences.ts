import { z } from 'zod';

export const preferencesSchema = z.object({
  units: z.enum(['metric', 'imperial']),
  gps: z.boolean(),
  lang: z.enum(['fr', 'en']),
  theme: z.enum(['system', 'light', 'dark']),
});

export type PreferencesValues = z.infer<typeof preferencesSchema>;

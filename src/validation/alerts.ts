import { z } from 'zod';

export const alertsSchema = z.object({
  optimum: z.boolean(),
  newZone: z.boolean(),
});

export type AlertsValues = z.infer<typeof alertsSchema>;

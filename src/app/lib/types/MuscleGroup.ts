import { z } from 'zod';

export const MuscleGroup = z.object({
  id: z.string(),
  name: z.string()
})

export type MuscleGroupType = z.infer<typeof MuscleGroup>;

import { z } from 'zod';
import { MuscleGroup } from './MuscleGroup'

export const ExerciseListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  muscle_groups: z.array(MuscleGroup).nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().nullable().optional()
})

export const ExerciseListItemCreateInputSchema = z.object({
  name: z.string(),
  muscle_groups: z.array(MuscleGroup).optional()
})

export type ExerciseListItemType = z.infer<typeof ExerciseListItemSchema>;
export type ExerciseListItemCreateInputType = z.infer<typeof ExerciseListItemCreateInputSchema>;

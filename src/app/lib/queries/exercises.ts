import { ExerciseListItemCreateInputType, ExerciseListItemSchema, ExerciseListItemType } from "../types/Exercise";
import { prisma } from "../db";
import { Prisma } from '@prisma/client';

// Fetch all exercises for a user
export async function GetExerciseList(userId: string) {
  const dbResponse: ExerciseListItemType[] = await prisma.exercise.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      muscle_groups: true
    }
  });

  return ExerciseListItemSchema.array().parse(dbResponse);

}

// Fetch a single exercise by ID, and verify it belongs to the user
export async function getExercise(userId: string, exerciseId: string) {
  const exercise = await prisma.exercise.findUnique({
    where: { id: exerciseId },
  });

  if (!exercise || exercise.userId !== userId) {
    return null;
  }

  return exercise;
}

// Create an exercise and link it to the user
export async function createExercise(
  userId: string,
  exercise: ExerciseListItemCreateInputType
): Promise<ExerciseListItemType> {
  const dbResponse = await prisma.exercise.create({
    data: {
      name: exercise.name,
      muscle_groups: {
        connectOrCreate: (exercise.muscle_groups || []).map(group => ({
          // Criteria to find an existing record
          where: {
            name: group.name,
          },
          // Data to create if not found
          create: {
            name: group.name,
          },
        })),
      },
      userId,
    },
    include: {
      muscle_groups: true
    },
  });

  return dbResponse;
}

// Delete only if the exercise belongs to the user
export async function deleteExercise(userId: string, exerciseId: string) {
  const result = await prisma.exercise.deleteMany({
    where: {
      id: exerciseId,
      userId: userId,
    },
  });

  return result.count > 0;
}

// Update only if the exercise belongs to the user
export async function updateExercise(
  userId: string,
  exerciseId: string,
  exercise: Omit<Prisma.ExerciseUpdateInput, 'User'>
) {
  const result = await prisma.exercise.updateMany({
    where: {
      id: exerciseId,
      userId: userId,
    },
    data: {
      ...exercise,
    },
  });

  return result.count > 0 ? { id: exerciseId, ...exercise } : null;
}

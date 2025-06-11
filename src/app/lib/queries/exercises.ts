import { prisma } from "../db";
import { Prisma } from '@prisma/client';

// Fetch all exercises for a user
export async function getAllExercises(userId: string) {
  return await prisma.exercise.findMany({
    where: { userId },
  });
}

// Fetch a single exercise by ID, and verify it belongs to the user
export async function getExercise(userId: string, exerciseId: number) {
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
  exercise: Omit<Prisma.ExerciseUncheckedCreateInput, 'userId'>
) {
  return await prisma.exercise.create({
    data: {
      ...exercise,
      userId,
    },
  });
}

// Delete only if the exercise belongs to the user
export async function deleteExercise(userId: string, exerciseId: number) {
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
  exerciseId: number,
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

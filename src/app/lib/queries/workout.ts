import { prisma } from "../db";
import { Prisma } from '@prisma/client';

export async function getWorkout(userId: string, workoutId: number) {
  const workout = await prisma.exercise.findUnique({
    where: { id: workoutId },
  });

  if (!workout || workout.userId !== userId) {
    return null;
  }
  return workout;
}

export async function getAllWorkouts(userId: string) {
  return await prisma.workout.findMany({ where: { userId } });
}

export async function createWorkout(userId: string, workout: Omit<Prisma.WorkoutUncheckedCreateInput, 'userId'>) {
  return await prisma.workout.create({ data: { ...workout, userId } });
}

export async function deleteWorkout(userId: string, workoutId: number) {
  const result = await prisma.workout.deleteMany({ where: { id: workoutId, userId } });
  return result.count > 0;
}

export async function updateWorkout(userId: string, workoutId: number, data: Omit<Prisma.WorkoutUpdateInput, 'User'>) {
  const result = await prisma.workout.updateMany({ where: { id: workoutId, userId }, data });
  return result.count > 0 ? { id: workoutId, ...data } : null;
}

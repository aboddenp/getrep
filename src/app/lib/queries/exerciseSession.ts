import { prisma } from "../db";
import { Prisma } from '@prisma/client';

// Fetch a single exercise by ID, and verify it belongs to the user
export async function getExerciseSession(userId: string, exerciseSessionId: string, includeSets: boolean) {
  const exerciseSession = await prisma.exerciseSession.findUnique({
    where: { id: exerciseSessionId },
    include: { sets: includeSets }
  });

  if (!exerciseSession || exerciseSession.userId !== userId) {
    return null;
  }

  return exerciseSession;
}

export async function getAllExerciseSessions(userId: string) {
  return await prisma.exerciseSession.findMany({ where: { userId } });
}

export async function createExerciseSession(userId: string, session: Omit<Prisma.ExerciseSessionUncheckedCreateInput, 'userId'>) {
  return await prisma.exerciseSession.create({
    data: { ...session, userId },
  });
}

export async function deleteExerciseSession(userId: string, sessionId: string) {
  const result = await prisma.exerciseSession.deleteMany({ where: { id: sessionId, userId } });
  return result.count > 0;
}

export async function updateExerciseSession(userId: string, sessionId: string, data: Omit<Prisma.ExerciseSessionUpdateInput, 'User'>) {
  const result = await prisma.exerciseSession.updateMany({ where: { id: sessionId, userId }, data });
  return result.count > 0 ? { id: sessionId, ...data } : null;
}

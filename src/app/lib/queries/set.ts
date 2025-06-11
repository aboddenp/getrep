import { prisma } from "../db";
import { Prisma } from '@prisma/client';

// gets all the sets for a specifc exercise for a user 
export async function getAllSets(userId: string, exerciseId: number) {
  return await prisma.set.findMany({
    where: {
      exerciseId,
      ExerciseSession: {
        userId: userId,
      }
    },
  });
}

export async function createSet(
  exerciseSessionId: number,
  set: Omit<Prisma.SetUncheckedCreateInput, 'exerciseSessionId'>
) {
  const session = await prisma.exerciseSession.findUnique({
    where: { id: exerciseSessionId },
    select: { exerciseId: true },
  });

  if (!session) throw new Error("Exercise session not found");

  return await prisma.set.create({
    data: {
      ...set,
      exerciseSessionId,
      exerciseId: session.exerciseId,
    },
  });
}

export async function deleteSet(userId: string, setId: number) {
  const result = await prisma.set.deleteMany({
    where: {
      id: setId, ExerciseSession: {
        userId
      }
    }
  });
  return result.count > 0;
}

export async function updateSet(userId: string, setId: number, data: Omit<Prisma.SetUncheckedUpdateInput, 'exerciseSessionId' | 'exerciseId'>) {
  const result = await prisma.set.updateMany({ where: { id: setId, ExerciseSession: { userId } }, data });
  return result.count > 0 ? { id: setId, ...data } : null;
}



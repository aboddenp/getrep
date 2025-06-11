import { prisma } from "../db";
import { Prisma } from '@prisma/client';

export async function getGoal(userId: string, goalId: number) {
  const goal = await prisma.exercise.findUnique({
    where: { id: goalId },
  });

  if (!goal || goal.userId !== userId) {
    return null;
  }
  return goal;
}

export async function getAllGoals(userId: string) {
  return await prisma.goal.findMany({ where: { userId } });
}

export async function createGoal(userId: string, goal: Omit<Prisma.GoalUncheckedCreateInput, 'userId'>) {
  return await prisma.goal.create({ data: { ...goal, userId } });
}

export async function deleteGoal(userId: string, goalId: number) {
  const result = await prisma.goal.deleteMany({ where: { id: goalId, userId } });
  return result.count > 0;
}

export async function updateGoal(userId: string, goalId: number, data: Omit<Prisma.GoalUpdateInput, 'User'>) {
  const result = await prisma.goal.updateMany({ where: { id: goalId, userId }, data });
  return result.count > 0 ? { id: goalId, ...data } : null;
}

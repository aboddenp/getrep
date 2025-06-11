import { prisma } from "../db";

export async function getAllMuscleGroups() {
  return await prisma.muscleGroup.findMany();
}

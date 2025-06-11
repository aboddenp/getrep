import { prisma } from "../db";
import { Prisma } from '@prisma/client';

export async function getUser(userId: string) {
  return await prisma.user.findUnique({ where: { id: userId } });
}

export async function updateUser(userId: string, data: Prisma.UserUpdateInput) {
  return await prisma.user.update({ where: { id: userId }, data });
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({ where: { id: userId } });
}

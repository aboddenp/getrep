import { currentUser } from "@clerk/nextjs/server";
import { prisma } from '@/app/lib/db';
import { Prisma } from '@prisma/client';

export async function syncUserDB() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo: Prisma.UserCreateInput = {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? 'invalid@email.com',
    first_name: user.firstName ?? 'anon_user',
    last_name: user.lastName ?? '',
    image_url: user.imageUrl,
    weight_unit: "KG",
  };

  await prisma.user.upsert({
    where: { id: user.id },
    update: userInfo,
    create: userInfo
  });

  return userInfo;
}

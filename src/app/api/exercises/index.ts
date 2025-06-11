import { requireUser } from "@/app/lib/auth/requireUser";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userIdOrResponse = requireUser(req);

  if (userIdOrResponse instanceof NextResponse) {
    return userIdOrResponse; // unauthorized response
  }

  const user = userIdOrResponse;

  const exercises = await prisma.exercise.findMany({ where: { userId: user.userId } })

  return NextResponse.json(exercises, { status: 200 })

}

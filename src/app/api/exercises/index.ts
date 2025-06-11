import { requireUser } from "@/app/lib/auth/requireUser";
import { getAllExercises } from "@/app/lib/queries/exercises";
import { withErrorHandler } from "@/app/lib/withErrorHandler";
import { NextRequest, NextResponse } from "next/server";

async function get(req: NextRequest) {
  const user = requireUser(req);

  if (!user.ok) {
    return user.response;
  }

  const exercises = await getAllExercises(user.userId)

  return NextResponse.json(exercises, { status: 200 })
}

export const GET = withErrorHandler(get);

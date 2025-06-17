import { requireUser } from "@/app/lib/auth/requireUser";
import { createExercise, GetExerciseList, deleteExercise } from "@/app/lib/queries/exercises";
import { ExerciseListItemCreateInputSchema } from "@/app/lib/types/Exercise";
import { withErrorHandler } from "@/app/lib/withErrorHandler";
import { NextRequest, NextResponse } from "next/server";

async function get(req: NextRequest) {
  const user = requireUser(req);

  if (!user.ok) {
    return user.response;
  }
  const exercises = await GetExerciseList(user.userId)

  return NextResponse.json(exercises, { status: 200 })
}

async function post(req: NextRequest) {
  const user = requireUser(req);

  if (!user.ok) {
    return user.response;
  }

  const data = await req.json();

  const dataParsed = ExerciseListItemCreateInputSchema.parse(data);

  const newExercise = await createExercise(user.userId, dataParsed)
  return NextResponse.json(newExercise, { status: 200 })

}

async function dExercise(req: NextRequest) {

  const user = requireUser(req);

  if (!user.ok) {
    return user.response;
  }

  const data = await req.json();

  await deleteExercise(user.userId, data.id)
  return NextResponse.json({ message: 'success' }, { status: 200 })

}

export const GET = withErrorHandler(get);
export const POST = withErrorHandler(post);
export const DELETE = withErrorHandler(dExercise);

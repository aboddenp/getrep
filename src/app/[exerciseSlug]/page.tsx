import { getExercise } from "../lib/queries/exercises";
import { currentUser } from "@clerk/nextjs/server";




export default async function ExerciseDetail({
  params,
}: {
  params: { exerciseSlug: string };
}) {
  const { exerciseSlug } = params;
  const user = await currentUser();

  if (!user) {
    return <div className="p-4">Please sign in to view this exercise.</div>;
  }
  const exercise = await getExercise(user.id, exerciseSlug);


  return (
    <div>
      <main>
        <h1 className="text-3xl font-bold underline bg-teal-300">
          Working on exercise: {exercise?.name}
        </h1>
      </main>
    </div>
  );
}

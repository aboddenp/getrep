import { GetExerciseList } from "./lib/queries/exercises";
import styles from "./page.module.css";
import { currentUser } from "@clerk/nextjs/server";
import ExerciseList from '@/components/ExerciseList';

export default async function Home() {

  const user = await currentUser();

  if (!user) {
    return <div className="p-4 text-center">Please sign in to view your exercises.</div>;
  }


  let exercises;
  try {
    exercises = await GetExerciseList(user.id);
  } catch (error) {
    console.error("GetExerciseList error", error);
    return <div className="text-red-500">Failed to load exercises.</div>;
  }

  return (
    <div >
      <main>
        <h1 className="text-3xl font-bold">
          Welcome {user.firstName}
        </h1>
        < ExerciseList exercises={exercises} />
      </main>
    </div>
  );
}

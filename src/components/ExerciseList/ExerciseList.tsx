'use client'
import { ExerciseListItemCreateInputSchema, ExerciseListItemCreateInputType, ExerciseListItemType, ExerciseListItemUpdateSchema } from '@/app/lib/types/Exercise';
import React from 'react';
import { FormEvent } from 'react'
import { Fetcher } from 'swr';
import useSWR from 'swr';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ExerciseItems } from './ExerciseItems';
import { getUUID } from '@/lib/utils';


const fetcher: Fetcher<ExerciseListItemType[], string> = (url) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch exercises');
    return res.json();
  });

function ExerciseList({ exercises }: { exercises: ExerciseListItemType[] }) {
  const [exName, setExName] = React.useState<string>('');
  const { data, error, isLoading, mutate } = useSWR<ExerciseListItemType[]>(`/api/exercises`, fetcher, { fallbackData: exercises })

  async function deleteExercise(id: string) {

    await mutate(
      async () => {
        const res = await fetch('/api/exercises', {
          method: 'DELETE',
          body: JSON.stringify({ id }),
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error('Failed');
        return undefined;
      },
      {
        optimisticData: (current) => ([...(current?.filter((ex) => ex.id != id) || [])]),
        rollbackOnError: true,
        populateCache: false,
        revalidate: false,
      }
    );
  }

  async function handlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = ExerciseListItemCreateInputSchema.safeParse({ name: exName.trim() })

    const tempID = getUUID();
    setExName('')

    await mutate(
      async (current) => {
        const res = await fetch('/api/exercises', {
          method: 'POST',
          body: JSON.stringify(payload.data),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed');

        const created = await res.json();

        return [...(current?.filter((ex) => (ex.id != tempID)) || []), created];
      },
      {
        optimisticData: (current) => [...(current || []), { id: tempID, name: exName, muscle_groups: [] }],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );

  }

  async function pushUpdate(editedName: string, editedId?: string) {

    if (!editedId) {
      return;
    }
    const payload = ExerciseListItemUpdateSchema.safeParse({ id: editedId, name: editedName.trim() })

    function changeName(exercise: ExerciseListItemType) {
      if (exercise.id != editedId) {
        return exercise;
      }

      exercise.name = editedName;
      return exercise;
    }

    await mutate(
      async () => {
        const res = await fetch('/api/exercises', {
          method: 'PUT',
          body: JSON.stringify(payload.data),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed');

        return undefined;
      },
      {
        optimisticData: (current) => [...(current || [])].filter((e) => changeName(e)),
        rollbackOnError: true,
        populateCache: false,
        revalidate: false,
      }

    )
  }

  return <div className='mx-auto max-w-3xl'>

    <ExerciseItems exercises={data || []} onDelete={deleteExercise} onEdit={pushUpdate} />
    <form className='mt-4 flex flex-col gap-3 ' onSubmit={(e) => handlSubmit(e)}>
      <label>
        <Input required id="exerciseName" name="exerciseName" value={exName} onChange={(e) => setExName(e.target.value)} type='text' placeholder='Bench Press' />
      </label>
      <Button className='w-full'>Create </Button>
    </form>
  </div>;
}

export default ExerciseList;

'use client'
import { ExerciseListItemCreateInputSchema, ExerciseListItemCreateInputType, ExerciseListItemType } from '@/app/lib/types/Exercise';
import React from 'react';
import { FormEvent } from 'react'
import { Fetcher } from 'swr';
import useSWR from 'swr';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { z } from 'zod';
import { TrashIcon, X } from 'lucide-react';

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
        return [...(exercises.filter((ex) => ex.id != id) || [])];
      },
      {
        optimisticData: [...(exercises.filter((ex) => ex.id != id) || [])],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );


  }

  async function handlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = ExerciseListItemCreateInputSchema.safeParse({ name: exName })

    await mutate(
      async (current) => {
        const res = await fetch('/api/exercises', {
          method: 'POST',
          body: JSON.stringify(payload.data),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error('Failed');

        const created = await res.json();
        return [...(current || []), created];
      },
      {
        optimisticData: [...(exercises || []), { id: 'temp', name: exName, muscle_groups: [] }],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );

  }

  return <div className='mx-auto max-w-3xl'>

    <div className='w-full flex flex-col gap-5'>
      {data?.map((ex: ExerciseListItemType) => (
        <Card key={ex.id} className='w-full' >
          <CardContent className='flex'>
            <span> {ex.name}</span> <span> {JSON.stringify(ex.muscle_groups)}  </span>
            <TrashIcon onClick={() => deleteExercise(ex.id)} className='ml-auto cursor-pointer' />
          </CardContent>
        </Card>
      ))}

    </div>
    <form onSubmit={(e) => handlSubmit(e)}>
      <label>
        <input required id="exerciseName" name="exerciseName" value={exName} onChange={(e) => setExName(e.target.value)} type='text' placeholder='Bench Press' />
      </label>
      <Button className='w-full'>Create </Button>
    </form>
  </div>;
}

export default ExerciseList;

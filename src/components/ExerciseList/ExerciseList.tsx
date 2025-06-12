'use client'
import { ExerciseListItemCreateInputType, ExerciseListItemType } from '@/app/lib/types/Exercise';
import React from 'react';
import { FormEvent } from 'react'
import { Fetcher } from 'swr';
import useSWR from 'swr';

const fetcher: Fetcher<ExerciseListItemType[], string> = (url) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch exercises');
    return res.json();
  });

function ExerciseList({ exercises }: { exercises: ExerciseListItemType[] }) {
  const [exName, setExName] = React.useState<string>('');
  const { data, error, isLoading, mutate } = useSWR<ExerciseListItemType[]>(`/api/exercises`, fetcher, { fallbackData: exercises })

  async function handlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: ExerciseListItemCreateInputType = {
      name: exName,
    };

    await mutate(
      async (current) => {
        const res = await fetch('/api/exercises', {
          method: 'POST',
          body: JSON.stringify(payload),
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

  return <div>
    {data?.map((ex: ExerciseListItemType) => (
      <div key={ex.id}>
        <span> {ex.name}</span>
        <span> {ex.id}</span>
        <span> {JSON.stringify(ex.muscle_groups)}  </span>
      </div>
    ))}
    <form onSubmit={(e) => handlSubmit(e)}>
      <label>
        <input id="exerciseName" name="exerciseName" value={exName} onChange={(e) => setExName(e.target.value)} type='text' placeholder='Bench Press' />
      </label>
      <button>Create</button>
    </form>
  </div>;
}

export default ExerciseList;

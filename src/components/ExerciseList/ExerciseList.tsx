'use client'
import { ExerciseListItemCreateInputSchema, ExerciseListItemCreateInputType, ExerciseListItemType, ExerciseListItemUpdateSchema } from '@/app/lib/types/Exercise';
import React, { KeyboardEvent } from 'react';
import { FormEvent } from 'react'
import { Fetcher } from 'swr';
import useSWR from 'swr';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { EllipsisVertical, Settings2 } from 'lucide-react';
import { Input } from '../ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const fetcher: Fetcher<ExerciseListItemType[], string> = (url) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error('Failed to fetch exercises');
    return res.json();
  });

function ExerciseList({ exercises }: { exercises: ExerciseListItemType[] }) {
  const [exName, setExName] = React.useState<string>('');
  const { data, error, isLoading, mutate } = useSWR<ExerciseListItemType[]>(`/api/exercises`, fetcher, { fallbackData: exercises })

  const [canEdit, setCanEdit] = React.useState<string | undefined>();
  const [editedName, setEditedName] = React.useState<string>('');
  const inputs = React.useRef<Record<string, HTMLInputElement | null>>({});


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

    const tempID = crypto.randomUUID();
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
      async (current) => {
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

    <div className='w-full flex flex-col gap-5'>
      {data?.map(({ id, name }: ExerciseListItemType) => (
        <Card key={id} className={`w-full ${id === canEdit ? 'bg-accent outline-1 outline-emerald-50' : ''}`} >
          <CardContent className='flex'>
            <input name="exerciseName"
              ref={(elRef) => { inputs.current[id] = elRef }}
              onBlur={() => (pushUpdate(editedName, canEdit), setEditedName(''), setCanEdit(undefined))}
              onKeyDown={(e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                  pushUpdate(editedName, canEdit), setEditedName(''), setCanEdit(undefined)
                }
              }}
              onChange={(e) => setEditedName(e.target.value)}
              value={canEdit == id ? editedName : name}
              readOnly={canEdit !== id}
              className='bg-transparent outline-0 w-full border-0 p-0 m-0 focus:outline-none focus:ring-0' />
            <DropdownMenu>
              <DropdownMenuTrigger className='ml-auto shrink-0 cursor-pointer'>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setCanEdit(id), setEditedName(name), setTimeout(() => inputs.current[id]?.focus(), 300) }}>Rename</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { deleteExercise(id) }}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      ))}

    </div>
    <form className='mt-4 flex flex-col gap-3 ' onSubmit={(e) => handlSubmit(e)}>
      <label>
        <Input required id="exerciseName" name="exerciseName" value={exName} onChange={(e) => setExName(e.target.value)} type='text' placeholder='Bench Press' />
      </label>
      <Button className='w-full'>Create </Button>
    </form>
  </div>;
}

export default ExerciseList;

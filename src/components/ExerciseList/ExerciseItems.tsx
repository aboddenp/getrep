import * as React from 'react'
import { deleteExercise } from "@/app/lib/queries/exercises"
import { ExerciseListItemType } from "@/app/lib/types/Exercise"
import { EllipsisVertical } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenu, DropdownMenuLabel, DropdownMenuContent } from '../ui/dropdown-menu'

type ExerciseItemsProps = {
  exercises: ExerciseListItemType[],
  onEdit: (editedName: string, editedId?: string) => void
  onDelete: (id: string) => void
}

export function ExerciseItems({ exercises, onEdit, onDelete }: ExerciseItemsProps) {


  return (
    <div className='w-full flex flex-col gap-5'>
      {exercises?.map((exercise: ExerciseListItemType) => (
        <ExerciseItem key={exercise.id} exercise={exercise} onDelete={onDelete} onBlurOrEnter={onEdit} />
      ))
      }

    </div >
  )
}

type ExerciseItemProps = {
  exercise: ExerciseListItemType;
  onBlurOrEnter: (newName: string, id: string) => void;
  onDelete: (id: string) => void;
}

const ExerciseItem = ({
  exercise, onBlurOrEnter, onDelete
}: ExerciseItemProps) => {

  const [isEditing, setIsEditing] = React.useState<boolean>(false)
  const [editedName, setEditedName] = React.useState<string>(exercise.name)
  const input = React.useRef<HTMLInputElement | null>(null);

  function handleEdit() {
    if (editedName && exercise.name != editedName.trim()) onBlurOrEnter(editedName, exercise.id);
    setIsEditing(false);
  }

  return (
    <Card className={`w-full ${isEditing ? 'bg-accent outline-1 outline-emerald-50' : ''}`}>
      <CardContent className="flex">
        <input
          name="exerciseName"
          ref={input}
          onBlur={() => handleEdit()}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleEdit()
          }}
          onChange={(e) => setEditedName(e.target.value)}
          value={isEditing ? editedName : exercise.name}
          readOnly={!isEditing}
          className="bg-transparent outline-0 w-full border-0 p-0 m-0 focus:outline-none focus:ring-0"
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto shrink-0 cursor-pointer">
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (setIsEditing(true), setTimeout(() => input.current?.focus(), 300))}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(exercise.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  )
}

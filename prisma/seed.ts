const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


async function main() {
  const userId = 'user_2yIB7tg8yFbrgQ4dyGQHOAGj99B' // ← Replace with real Clerk user ID
  const email = 'larry.lobster@musclecode.dev'

  // Seed user
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: email,
      first_name: 'Larry',
      last_name: 'Lobster',
      username: 'larryswole',
      image_url: 'https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ5SUJFSHJIZTBsdG9IWkZudDVHa0t2V2Y2bCJ9',
    },
  })

  // Seed muscle groups
  const chest = await prisma.muscleGroup.upsert({
    where: { name: 'Chest' },
    update: {},
    create: { name: 'Chest' },
  })

  const legs = await prisma.muscleGroup.upsert({
    where: { name: 'Legs' },
    update: {},
    create: { name: 'Legs' },
  })

  // Seed exercises
  const benchPress = await prisma.exercise.create({
    data: {
      name: 'Bench Press',
      userId: user.id,
      muscle_groups: {
        connect: [{ id: chest.id }],
      },
    },
  })

  const squat = await prisma.exercise.create({
    data: {
      name: 'Squat',
      userId: user.id,
      muscle_groups: {
        connect: [{ id: legs.id }],
      },
    },
  })

  // Seed goals
  await prisma.goal.create({
    data: {
      name: 'Bench 100kg',
      target_weight: 100,
      target_reps: 5,
      target_sets: 3,
      exerciseId: benchPress.id,
      userId: user.id,
    },
  })

  await prisma.goal.create({
    data: {
      name: 'Squat 140kg',
      target_weight: 140,
      target_reps: 5,
      target_sets: 3,
      exerciseId: squat.id,
      userId: user.id,
    },
  })

  // Seed a workout + session
  const workout = await prisma.workout.create({
    data: {
      name: 'Push Day',
      effort: 7,
      note: 'Felt strong!',
      userId: user.id,
      exercise_sessions: {
        create: {
          exerciseId: benchPress.id,
          userId: user.id,
          effort: 8,
          target_weight: 80,
          note: 'Good warmup',
          sets: {
            createMany: {
              data: [
                { order: 1, weight: 60, reps: 10, exerciseId: benchPress.id },
                { order: 2, weight: 70, reps: 8, exerciseId: benchPress.id },
                { order: 3, weight: 80, reps: 5, exerciseId: benchPress.id },
              ],
            },
          },
        },
      },
    },
  })

  console.log(`✅ Seeded data for ${email} with workout: ${workout.name}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

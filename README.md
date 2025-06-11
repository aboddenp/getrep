# 🏋️‍♂️Work in progress: GetRep

**GetRep** is a fitness tracking app that helps users log exercises, track workouts, and stay consistent with their training goals.

## 🧠 Schema Diagram & User Stories

View the full schema diagram and user stories in Miro:  
👉 [Open Miro Board](https://miro.com/app/board/uXjVIrSuMVk=/?share_link_id=378624079543)

## 🚀 Features

- User account system
- Exercise logging
- Workout history tracking
- Prisma + PostgreSQL schema
- Vercel-ready deployment

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/) for hosting

## 🧪 Local Development

# 🛠️ Prisma CLI Commands Explained

## `npx prisma generate`

📦 **Generates the Prisma Client** based on your `schema.prisma` file.

- Creates a fully typed TypeScript/JavaScript client for interacting with your database.
- Must be re-run whenever you change your schema.

```bash
npx prisma generate
```

---

## `npx prisma migrate dev --name init`

⚙️ **Creates and applies a new database migration** with the name `init`.

- Updates your database structure based on your schema.
- Automatically runs `prisma generate` afterward.
- Recommended for development use.

```bash
npx prisma migrate dev --name init
```

---

## `npx prisma db push`

📤 **Pushes the current schema to your database** without creating a migration file.

- Useful for rapid prototyping.
- Doesn't maintain a migration history (not ideal for production).

```bash
npx prisma db push
```

---

## `npx prisma db seed`

🌱 **Runs your seed script** to populate your database with initial data.

- Use it to insert mock or starter data (users, exercises, etc).

```bash
npx prisma db seed
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

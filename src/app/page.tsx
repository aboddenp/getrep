import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className="text-3xl font-bold underline bg-teal-300 ">
          GET REP WEBAPP
        </h1>
      </main>
    </div>
  );
}

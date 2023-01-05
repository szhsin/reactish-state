import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const TITLE = 'Reactish-State examples';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={TITLE} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>{TITLE}</h1>
        <div className={styles.grid}>
          <Link href="/counter" className={styles.card}>
            <h2>Counter</h2>
          </Link>
          <Link href="/todo" className={styles.card}>
            <h2>Todo</h2>
          </Link>
          <Link href="/async" className={styles.card}>
            <h2>Async</h2>
          </Link>
        </div>
      </main>
    </div>
  );
}

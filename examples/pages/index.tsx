import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Examples</title>
        <meta name="description" content="reactish-state examples" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}>
          <Link href="/counter" className={styles.card}>
            <h2>Counter</h2>
          </Link>
        </div>
      </main>
    </div>
  );
}

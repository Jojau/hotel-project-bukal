import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {

  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const data = fetch("http://localhost/api/hotel")
      .then((response) => response.json())
      .then(setHotels);
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Hotels</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hotels list
        </h1>

        <div>
          {hotels.map((hotel) => <div>
            <h2>{hotel.name}</h2>
            <p>{hotel.description}</p>
            <p><strong>Max capapcity: </strong>{hotel.max_capacity}</p>
            <Link href={`/hotel/${hotel.id}`}>See more details</Link>
          </div>)}
        </div>
      </main>

    </div>
  );
}

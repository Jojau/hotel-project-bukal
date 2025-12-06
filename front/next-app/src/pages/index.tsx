import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Hotel } from "../types/types"

export default function Home() {

  interface HotelsResponse {
    data: Hotel[],
    links: {
      first: string,
      last: string,
      prev?: string,
      next?: string,
    },
    meta: {
      current_page: number,
      from: number,
      last_page: number,
      links: Array<{
        url?: string,
        label: string,
        active: boolean,
      }>,
      path : string,
      per_page: number,
      to: number,
      total: number,
    }
  }

  const [hotels, setHotels] = useState<HotelsResponse>({
    data: [],
    links: {
      first: 'http://localhost/api/hotel?page=1',
      last: '',
    },
    meta: {
      current_page: 0,
      from: 0,
      last_page: 0,
      links: [],
      path : 'http://localhost/api/hotel',
      per_page: 0,
      to: 0,
      total: 0
    }
  });

  useEffect(() => {
    const data = fetch("http://localhost/api/hotel")
      .then((response) => response.json())
      .then(setHotels);
  }, []);

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
          {hotels.data.map((hotel) => <div>
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

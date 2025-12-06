import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Hotel } from "../types/types"
import { Button, Card, Flex, Heading, Text, Image } from "@chakra-ui/react";

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
      path: string,
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
      path: 'http://localhost/api/hotel',
      per_page: 0,
      to: 0,
      total: 0
    }
  });

  useEffect(() => {
    const data = fetch("http://localhost/api/hotel?page=3")
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
        <Heading size={'6xl'} as={'h1'}>Hotels</Heading>

        <Flex gap={'24px'} justifyContent={'center'} flexWrap={'wrap'} margin={'48px'}>
          {hotels.data.map((hotel) => 
            <Card.Root maxW="sm" overflow="hidden" key={hotel.id}>
              {hotel.pictures && hotel.pictures.length > 0 && (
                <Image
                  src={hotel.pictures[0].file_path}
                  alt={hotel.name}
                  height={'250px'}
                />
              )}
              <Card.Body gap="2">
                <Card.Title>{hotel.name}</Card.Title>
                <Card.Description>
                  <Text lineClamp={2}>{hotel.description}</Text>
                </Card.Description>
                <Text textStyle="md" fontWeight="medium" letterSpacing="tight" mt="2">
                  ${hotel.price_per_night} per night
                </Text>
              </Card.Body>
              <Card.Footer gap="2">
                <Link href={`/hotel/${hotel.id}`}><Button variant="solid">See details</Button></Link>
                <Link href={`/hotel/${hotel.id}/edit`}><Button variant="ghost">Edit</Button></Link>
              </Card.Footer>
            </Card.Root>
          )}
        </Flex>
      </main>

    </div>
  );
}

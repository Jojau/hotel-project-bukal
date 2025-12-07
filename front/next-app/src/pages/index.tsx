import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Hotel } from "../types/types"
import { Button, Card, Flex, Heading, Text, Image, Center, Stack, Container, Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

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

  const [currentPage, setCurrentPage] = useState(1);

  const fetchHotels = (page: number) => {
    fetch(`http://localhost/api/hotel?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setHotels(data);
        setCurrentPage(page);
      });
  };

  useEffect(() => {
    fetchHotels(1);
  }, []);

  return (
    <Container>
      <Head>
        <title>Hotels list</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center>
        <Stack gap={'48px'} margin={'48px'} width={'8xl'}>
          <Heading size={'6xl'} textAlign={'center'}>Hotels</Heading>

          <Center>
            <Link href={'/hotel/new'}>
              <Button size={'2xl'} width={'fit-content'}>Create new hotel</Button>
            </Link>
          </Center>

          <Stack gapY={'24px'}>
            <Flex gap={'24px'} justifyContent={'center'} flexWrap={'wrap'}>
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

            <Center>
              <Pagination.Root count={hotels.meta.total} pageSize={hotels.meta.per_page} defaultPage={1} onPageChange={(e) => fetchHotels(e.page)}>
                <ButtonGroup gap="4" size="sm" variant="ghost">
                  <Pagination.PrevTrigger asChild>
                    <IconButton onClick={() => currentPage > 1 && fetchHotels(currentPage - 1)}>
                      <HiChevronLeft />
                    </IconButton>
                  </Pagination.PrevTrigger>
                  <Pagination.PageText />
                  <Pagination.NextTrigger asChild>
                    <IconButton onClick={() => currentPage < hotels.meta.last_page && fetchHotels(currentPage + 1)}>
                      <HiChevronRight />
                    </IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Center>
          </Stack>
        </Stack>
      </Center>
    </Container>
  );
}

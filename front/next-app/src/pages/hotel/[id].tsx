import { Box, Button, Container, FormatNumber, Group, Heading, Stack, Text, Carousel, IconButton, Image } from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { useRouter } from 'next/router'

export default function Page({ hotel }) {
  const router = useRouter()

  const pictures = hotel.pictures ? hotel.pictures.sort(function (a, b) {
    return a.index - b.index;
  }) : [];

  const deleteFunction = async () => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      const response = await fetch(`http://localhost/api/hotel/${hotel.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        router.push('/');
      } else {
        alert("Sorry, an error occurred and the hotel could not be deleted.");
        console.log(response);
      }
    }
  }

  return (
    <Stack gap={'48px'} margin={'48px'}>
      <Heading size={'4xl'} textAlign={'center'}>{hotel.name}</Heading>

      {/* Hotel pictures carousel */}
      {pictures && pictures.length > 0 && (
        <Carousel.Root slideCount={pictures.length} allowMouseDrag={true} autoplay={true} loop={true}  >
          <Carousel.Control justifyContent="center" gap="4" width="full">
            <Carousel.PrevTrigger asChild>
              <IconButton size="xs" variant="outline">
                <LuChevronLeft />
              </IconButton>
            </Carousel.PrevTrigger>

            <Carousel.ItemGroup width="full">
              {pictures.map((item, index) => (
                <Carousel.Item key={index} index={index}>
                  <Image
                    aspectRatio="16/9"
                    src={item.file_path}
                    alt={'Picture '+index+' of hotel '+hotel.name}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Carousel.Item>
              ))}
            </Carousel.ItemGroup>

            <Carousel.NextTrigger asChild>
              <IconButton size="xs" variant="outline">
                <LuChevronRight />
              </IconButton>
            </Carousel.NextTrigger>
          </Carousel.Control>

          <Carousel.IndicatorGroup>
            {pictures.map((item, index) => (
              <Carousel.Indicator
                key={index}
                index={index}
                unstyled
                _current={{
                  outline: "2px solid currentColor",
                  outlineOffset: "2px",
                }}
              >
                <Image
                  w="20"
                  aspectRatio="16/9"
                  src={item.file_path}
                  alt={'Picture '+index+' of hotel '+hotel.name}
                  objectFit="cover"
                />
              </Carousel.Indicator>
            ))}
          </Carousel.IndicatorGroup>
        </Carousel.Root>
      )}

      {/* Content */}
      <Stack direction={'row'} gap={'24px'}>
        {/* Left column */}
        <Stack flexBasis={'70%'} gap={'24px'}>
          <Text>{hotel.description}</Text>

          {/* Admin actions box */}
          <Box borderWidth={'1px'} padding={4}>
            <Heading size={'lg'}>Admin actions</Heading>
            <Group>
              <Button onClick={() => router.push(`/hotel/${hotel.id}/edit`)}>Edit hotel</Button>
              <Button colorPalette={'red'} onClick={deleteFunction}>Delete hotel</Button>
            </Group>
          </Box>
        </Stack>

        {/* Right column */}
        <Stack flexBasis={'30%'} gap={'24px'}>
          {/* Adress box */}
          <Box borderWidth={'1px'} padding={'12px'}>
            <Heading size={'lg'}>Address</Heading>
            <Text>{hotel.address}</Text>
            {hotel.address2 ?? <Text>{hotel.address2}</Text>}
            <Text>{hotel.zipcode} {hotel.city}, {hotel.country}</Text>
          </Box>

          {/* Capacity & Price box */}
          <Stack gapY={'12px'} borderWidth={'1px'} padding={'12px'}>
            <Container fluid padding={0}>
              <Heading size={'lg'}>Maximum capacity</Heading>
              <FormatNumber value={hotel.max_capacity}></FormatNumber>
            </Container>

            <Container fluid padding={0}>
              <Heading size={'lg'}>Price per night</Heading>
              <FormatNumber value={hotel.price_per_night} style='currency' currency='USD'></FormatNumber>
            </Container>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export async function getStaticProps({ params }) {
  const hotel = await fetch(`http://localhost/api/hotel/${params.id}`).then(response => response.json());

  return {
    props: {
      hotel: hotel.data
    }
  }
}

export async function getStaticPaths() {
  const data = await fetch("http://localhost/api/hotel-ids").then((response) => response.json())

  return {
    paths: data.map(id => ({
      params: { id: id.toString() }
    })),
    fallback: false
  }
}

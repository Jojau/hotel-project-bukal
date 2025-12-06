import { Box, Button, ButtonGroup, Container, Flex, FormatNumber, Group, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router'

export default function Page({ hotel }) {
  const router = useRouter()

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
      {hotel.pictures && hotel.pictures.length > 0 && (
        <div>
          {hotel.pictures.sort(function (a, b) {
            return a.index - b.index;
          }).map((picture, index) => (
            <img key={index} style={{ maxHeight: '500px', maxWidth: '500px' }} src={picture.file_path}></img>
          ))}
        </div>
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

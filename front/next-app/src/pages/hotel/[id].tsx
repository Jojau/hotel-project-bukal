import { useRouter } from 'next/router'
 
export default function Page({ hotel }) {
  const router = useRouter()
  console.log(hotel);
  return (
    <div>
      <h1>{hotel.name}</h1>
      <p>{hotel.description}</p>

      <h2>Adresse</h2>
      <div>
        <p>{hotel.address}</p>
        {hotel.address2 ? <p>{hotel.address2}</p> : null}
        <p>{hotel.zipcode} {hotel.city}, {hotel.country}</p>
      </div>

      <p><strong>Maximum capacity: </strong>{hotel.max_capacity}</p>
      <p><strong>Price per night: </strong>{hotel.price_per_night}</p>
    </div>
  )
}

export async function getStaticProps({params}) {
 const hotel = await fetch(`http://localhost/api/hotel/${params.id}`).then(response => response.json());
 
 return {
   props: {
     hotel
   }
 }
}

export async function getStaticPaths() {
  const data = await fetch("http://localhost/api/hotel").then((response) => response.json())
  
  return {
    paths: data.map(hotel => ({
      params: { id: hotel.id.toString() }
    })),
    fallback: false
  }
}

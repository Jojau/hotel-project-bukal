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
    <div>
      <h1>{hotel.name}</h1>
      <p>{hotel.description}</p>

      {hotel.pictures && hotel.pictures.length > 0 && (
        <div>
          {hotel.pictures.sort(function (a, b) {
            return a.index - b.index;
          }).map((picture, index) => (
            <img key={index} style={{ maxHeight: '500px', maxWidth: '500px' }} src={picture.file_path}></img>
          ))}
        </div>
      )}

      <h2>Adresse</h2>
      <div>
        <p>{hotel.address}</p>
        {hotel.address2 ? <p>{hotel.address2}</p> : null}
        <p>{hotel.zipcode} {hotel.city}, {hotel.country}</p>
      </div>

      <p><strong>Maximum capacity: </strong>{hotel.max_capacity}</p>
      <p><strong>Price per night: </strong>{hotel.price_per_night}</p>

      <aside>
        <h2>Admin actions</h2>
        <button onClick={() => router.push(`/hotel/${hotel.id}/edit`)}>Edit hotel</button>
        <button onClick={ deleteFunction }>Delete hotel</button>
      </aside>
    </div>
  )
}

export async function getStaticProps({ params }) {
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

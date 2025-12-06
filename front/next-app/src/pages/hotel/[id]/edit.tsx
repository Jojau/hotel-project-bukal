import { useState } from "react";
import styles from '../../../styles/Form.module.css'
import { Router, useRouter } from "next/router";

export default function Page({ hotel }) {
  const router = useRouter()

  const [errors, setErrors] = useState([]);

  /** Handle validation errors from the API and update the errors state
   * @param response The fetch Response object
   * @return array An array of error messages
   * 
   * Example response body from the API on error:
   *{
      "success": false,
      "message": "Validation error",
      "errors": {
        "longitude": [
          "The longitude field must be at least -180."
        ],
        "latitude": [
          "The latitude field must not be greater than 90."
        ]
      }
    }
   */
  const handleResponseErrors = async (response: Response) => {
    if (response.status == 422) {
      const jsonResponse = await response.json();
      if (jsonResponse && jsonResponse.errors) {
        const responseErrors = [];
        for (const field in jsonResponse.errors) {
          // For each field, get the array of errors and add them to the responseErrors array
          const fieldErrorsArray = jsonResponse.errors[field];
          responseErrors.push(...fieldErrorsArray);
        }
        // Add the responseErrors array to the errors state
        setErrors(prev => [...prev, ...responseErrors]);
        return responseErrors;
      } else return [];
    }
    else return [];
  }

  const handleHotelFormSubmit = async (event) => {
    event.preventDefault();

    // Get all form data
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validations could be added here before submission...

    try {
      setErrors([]);

      // Update hotel 
      const updateHotelResponse = await fetch('http://localhost/api/hotel/' + hotel.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Handle hotel validation errors
      const HotelValidationErrors = await handleResponseErrors(updateHotelResponse);
      if (HotelValidationErrors.length > 0) return;

      // If hotel has been successfully updated
      const updatedHotel = await updateHotelResponse.json();
      setErrors([]);
      // Redirect to the hotel's details page
      router.push(`/hotel/${updatedHotel.id}`);

    } catch (err) {
      // Handle other errors
      console.error('Submit error', err);
      setErrors(prev => prev.length ? prev : ['An unexpected error occurred.']);
    }
  }

  const handlePicturesFormSubmit = async (event) => {
    event.preventDefault();

    // Get all form data
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validation rules could be added here before submission...

    // Update each picture's index
    let hasErrors = false
    for (const key in data) {
      // As the key follows the format picture_index_{id}, we extract the id by getting the last element after splitting by '_'
      const pictureId = key.split('_').pop();

      try {
        const updatePictureResponse = await fetch(`http://localhost/api/picture/${pictureId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ index: data[key] }),
        });

        // Handle picture validation errors
        const pictureValidationErrors = await handleResponseErrors(updatePictureResponse);
        if (pictureValidationErrors.length > 0) hasErrors = true;

      } catch (error) {
        // Handle other errors
        console.error('Submit error', error);
        setErrors(prev => prev.length ? prev : ['An unexpected error occurred.']);
      }
    }
    if (!hasErrors) {
      // If all pictures have been successfully updated, redirect to details page
      router.push(`/hotel/${hotel.id}`);
    }
  }

  const deletePicture = async (event) => {
    event.preventDefault();
    const pictureId = event.target.getAttribute('data-picture-id');

    if (confirm("Are you sure you want to delete this picture? This action cannot be undone.")) {
      const response = await fetch(`http://localhost/api/picture/${pictureId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Remove picture from UI ??
      } else {
        alert("Sorry, an error occurred and the image could not be deleted.");
        console.log(response);
      }
    }
  }

  return (
    <div>
      <h1>Edit {hotel.name}</h1>
      <p>All fields are required unless stated otherwise</p>

      {/* Validation errors */}
      {errors && errors.length > 0 && (
        <div>
          {errors.map((message, index) => (
            <p key={index} style={{ color: 'red', margin: '6px 0' }}>{message}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleHotelFormSubmit} className={styles.form}>
        <label htmlFor="name">Hotel name</label>
        <input type="text" name="name" defaultValue={hotel.name} required />

        <label htmlFor="address">Address (number, street)</label>
        <input type="text" name="address" defaultValue={hotel.address} required />

        <label htmlFor="address2">Complementary address (optional)</label>
        <input type="text" name="address2" defaultValue={hotel.address2} />

        <label htmlFor="zipcode">Zipcode</label>
        <input type="text" name="zipcode" defaultValue={hotel.zipcode} required />

        <label htmlFor="city">City</label>
        <input type="text" name="city" defaultValue={hotel.city} required />

        <label htmlFor="country">Country</label>
        <input type="text" name="country" defaultValue={hotel.country} required />

        <label htmlFor="latitude">Latitude</label>
        <input type="number" name="latitude" defaultValue={hotel.latitude} step="0.00000000000001" required />

        <label htmlFor="longitude">Longitude</label>
        <input type="number" name="longitude" defaultValue={hotel.longitude} step="0.00000000000001" required />

        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required>{hotel.description}</textarea>

        <label htmlFor="max_capacity">Maximum capacity</label>
        <input type="number" name="max_capacity" defaultValue={hotel.max_capacity} required />

        <label htmlFor="price_per_night">Price per night (in USD)</label>
        <input type="number" name="price_per_night" defaultValue={hotel.price_per_night} required />

        <button type="submit">Edit hotel</button>
      </form>

      {hotel.pictures && hotel.pictures.length > 0 && (
        <form onSubmit={handlePicturesFormSubmit} className={styles.form}>
          {hotel.pictures.sort(function (a, b) {
            return a.index - b.index;
          }).map((picture, index) => (
            <div>
              <img key={index} style={{ maxHeight: '200px', maxWidth: '200px' }} src={picture.file_path}></img>
              <label htmlFor={`picture_index_${picture.id}`}>Position in slideshow</label>
              <input type="number" name={`picture_index_${picture.id}`} defaultValue={picture.index} required min={0} />
              <button onClick={deletePicture} data-picture-id={picture.id}>Delete picture</button>
            </div>
          ))}
          <button type="submit">Update pictures order</button>
        </form>
      )}
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

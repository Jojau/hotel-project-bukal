import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '../../styles/Form.module.css'

export default function Page() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get all form data
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validations could be added here before submission...

    try {
      setErrors([]);

      // Create hotel 
      const createHotelResponse = await fetch('http://localhost/api/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // Handle hotel validation errors
      const HotelValidationErrors = await handleResponseErrors(createHotelResponse);
      if (HotelValidationErrors.length > 0) return;

      // If hotel has been successfully created
      const createdHotel = await createHotelResponse.json();
      setErrors([]);

      // Handle pictures
      const pictures = formData.getAll('pictures');
      let hasErrors = false;
      for (let index = 0; index < pictures.length; index++) {
        const element = pictures[index];
        
        const pictureFormData = new FormData();
        pictureFormData.append('picture', element);
        pictureFormData.append('index', index.toString());
        pictureFormData.append('hotel_id', createdHotel.id);

        // Create picture 
        const uploadPictureResponse = await fetch('http://localhost/api/picture', {
          method: 'POST',
          body: pictureFormData
        });

        // Handle picture validation errors
        const pictureValidationErrors = await handleResponseErrors(uploadPictureResponse);
        if (pictureValidationErrors.length > 0) {
          hasErrors = true;
        }
      }

      // Handle pictures errors
      if(hasErrors){
        // If there were at least one error uploading pictures, the created hotel should be deleted to avoid confusion
        fetch("http://localhost/api/hotel/"+createdHotel.id, {
          method: "DELETE"
        });
      } else {
        // Redirect to the created hotel's details page
        router.push(`/hotel/${createdHotel.id}`);
      }


    } catch (err) {
      // Handle other errors
      console.error('Submit error', err);
      setErrors(prev => prev.length ? prev : ['An unexpected error occurred.']);
    }
  };

  return (
    <div>
      <h1>Register a new hotel</h1>
      <p>All fields are required unless stated otherwise</p>

      {/* Validation errors */}
      {errors && errors.length > 0 && (
        <div>
          {errors.map((message, index) => (
            <p key={index} style={{ color: 'red', margin: '6px 0' }}>{message}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="name">Hotel name</label>
        <input type="text" name="name" placeholder="The Cloud One Hotel New York-Downtown" required />

        <label htmlFor="address">Address (number, street)</label>
        <input type="text" name="address" placeholder="133 Greenwich St" required />

        <label htmlFor="address2">Complementary address (optional)</label>
        <input type="text" name="address2" placeholder="" />

        <label htmlFor="zipcode">Zipcode</label>
        <input type="text" name="zipcode" placeholder="NY 10006" required />

        <label htmlFor="city">City</label>
        <input type="text" name="city" placeholder="New York" required />

        <label htmlFor="country">Country</label>
        <input type="text" name="country" placeholder="United States of America" required />

        <label htmlFor="latitude">Latitude</label>
        <input type="number" name="latitude" placeholder="40.70967754745341" step="0.00000000000001" required />

        <label htmlFor="longitude">Longitude</label>
        <input type="number" name="longitude" placeholder="-74.01277611534421" step="0.00000000000001" required />

        <label htmlFor="description">Description</label>
        <textarea name="description" id="description" required></textarea>

        <label htmlFor="max_capacity">Maximum capacity</label>
        <input type="number" name="max_capacity" placeholder="200" required />

        <label htmlFor="price_per_night">Price per night (in USD)</label>
        <input type="number" name="price_per_night" placeholder="250" required />

        <label htmlFor="pictures">Upload pictures (multiple images can be added at once)</label>
        <input type="file" name="pictures" id="pictures" multiple accept="image/*" />

        <button type="submit">Create hotel</button>
      </form>
    </div>
  )
}

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '../../styles/Form.module.css'

export default function Page() {
  const router = useRouter()

  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get all form data
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validations could be added here before submission...

    try {
      setErrors([]);

      const response = await fetch('http://localhost/api/hotel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      /** Handle validation errors from the API
       * Example response:
       * {
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
      if (response.status == 422) {
        const jsonResponse = await response.json();
        const responseErrors = [];
        if (jsonResponse && jsonResponse.errors) {
          for (const field in jsonResponse.errors) {
            // For each field, get the array of errors and add them to the responseErrors array
            const fieldErrorsArray = jsonResponse.errors[field];
            responseErrors.push(...fieldErrorsArray);
          }
        }
        setErrors(responseErrors);
        return;
      }

      // Handle success
      const result = await response.json();
      setErrors([]);
      router.push(`/hotel/${result.id}`);

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

        <button type="submit">Create hotel</button>
      </form>
    </div>
  )
}

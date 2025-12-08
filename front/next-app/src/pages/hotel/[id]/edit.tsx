import { useState } from "react";
import { useRouter } from "next/router";
import { Alert, Badge, Box, Breadcrumb, Button, Card, Center, Container, Field, FileUpload, Heading, Image, Input, InputGroup, List, NumberInput, Stack, Text, Textarea } from '@chakra-ui/react';
import { LuFileImage } from 'react-icons/lu';

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

  const handlePicturesUpload = async (event) => {
    event.preventDefault();

    // Get all form data
    const form = event.target;
    const formData = new FormData(form);
    const allPictures = formData.getAll('pictures');
    // Filter out empty files (FileUpload creates empty files when no selection is made)
    const pictures = allPictures.filter((file: File) => file.size > 0);

    setErrors([]);
    let hasErrors = false;
    let uploadedPictureIds = [];
    for (let index = 0; index < pictures.length; index++) {
      const element = pictures[index];

      const pictureFormData = new FormData();
      pictureFormData.append('picture', element);
      pictureFormData.append('index', index.toString());
      pictureFormData.append('hotel_id', hotel.id);

      try {
        // Create picture 
        const uploadPictureResponse = await fetch('http://localhost/api/picture', {
          method: 'POST',
          body: pictureFormData
        });

        // Handle picture validation errors
        const pictureValidationErrors = await handleResponseErrors(uploadPictureResponse);
        if (pictureValidationErrors.length > 0) {
          hasErrors = true;
        } else {
          const uploadedPicture = await uploadPictureResponse.json();
          uploadedPictureIds.push(uploadedPicture.id);
        }
      } catch (error) {
        // Handle other errors
        console.error('Submit error', error);
        setErrors(prev => prev.length ? prev : ['An unexpected error occurred.']);
      }
    }
    if (hasErrors) {
      // Delete any pictures that were successfully uploaded before the errors occurred
      for (const pictureId of uploadedPictureIds) {
        await fetch(`http://localhost/api/picture/${pictureId}`, {
          method: 'DELETE'
        });
      }
    } else {
      // If all pictures have been successfully uploaded, reload the page to display them for re-order
      router.reload();
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
        // Reload the page to reflect the changes
        router.reload();
      } else {
        alert("Sorry, an error occurred and the image could not be deleted.");
        console.log(response);
      }
    }
  }

  return (
    <Center>
      <Stack gap={'48px'} margin={'48px'} width={'8xl'}>
        {/* Hotel name & breadcrumb */}
        <Container gapY={'12px'}>
          <Heading size={'4xl'} textAlign={'center'}>Edit "{hotel.name}"</Heading>

          <Center>
            <Breadcrumb.Root>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.Link href={'/hotel/' + hotel.id}>{hotel.name}</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink>Edit</Breadcrumb.CurrentLink>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </Center>
        </Container>

        {/* Content & Form */}
        <Stack gapY={'24px'}>
          <Text>All fields are required unless stated otherwise</Text>

          {/* Validation errors */}
          {errors && errors.length > 0 && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title fontWeight={'bold'}>Update {errors.length > 1 ? 'errors' : 'error'}</Alert.Title>
                <Alert.Description>
                  <List.Root>
                    {errors.map((message, index) => (
                      <List.Item key={index}>{message}</List.Item>
                    ))}
                  </List.Root>
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}

          {/* Hotel Fields */}
          <Stack gapY={'12px'}>
            <Heading size={'lg'} >Edit hotel information</Heading>
            <Box borderWidth={'1px'} padding={'24px'}>
              <form onSubmit={handleHotelFormSubmit}>
                <Stack gapY={'24px'}>
                  <Field.Root required>
                    <Field.Label>
                      Hotel name
                    </Field.Label>
                    <Input required name='name' type='text' defaultValue={hotel.name} />
                    <Field.HelperText>May be up to 255 characters maximum</Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Address
                    </Field.Label>
                    <Input required name='address' type='text' defaultValue={hotel.address} />
                    <Field.HelperText>Number and street name</Field.HelperText>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>
                      Complementary address
                      <Field.RequiredIndicator
                        fallback={
                          <Badge size="sm" variant="surface">
                            Optional
                          </Badge>
                        } />
                    </Field.Label>
                    <Input name='address2' type='text' defaultValue={hotel.address2} />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Zipcode
                    </Field.Label>
                    <Input required name='zipcode' type='text' defaultValue={hotel.zipcode} />
                    <Field.HelperText>May be up to 20 characters maximum, may contain numbers, letters and spaces</Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      City
                    </Field.Label>
                    <Input required name='city' type='text' defaultValue={hotel.city} />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Country
                    </Field.Label>
                    <Input required name='country' type='text' defaultValue={hotel.country} />
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Latitude
                    </Field.Label>
                    <NumberInput.Root required name='latitude' step={0.00000000000001} min={-90} max={90}>
                      <NumberInput.Control />
                      <NumberInput.Input defaultValue={hotel.latitude} />
                    </NumberInput.Root>
                    <Field.HelperText>Must be between -90 and 90, may be decimal (if so, use the dot and not the comma). Example : 40.70967754745341</Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Longitude
                    </Field.Label>
                    <NumberInput.Root required name='longitude' step={0.00000000000001} min={-180} max={180}>
                      <NumberInput.Control />
                      <NumberInput.Input defaultValue={hotel.longitude} />
                    </NumberInput.Root>
                    <Field.HelperText>Must be between -180 and 180, may be decimal (if so, use the dot and not the comma). Example : -74.01277611534421</Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Description
                    </Field.Label>
                    <Textarea required name='description' maxLength={5000} defaultValue={hotel.description} />
                    <Field.HelperText>May be up to 5000 characters maximum</Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Maximum capacity
                    </Field.Label>
                    <NumberInput.Root required name='max_capacity' defaultValue={hotel.max_capacity} step={1} min={1} max={200}>
                      <NumberInput.Control />
                      <NumberInput.Input />
                    </NumberInput.Root>
                    <Field.HelperText>Must be an integer between 1 and 200</Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>
                      Price per night
                    </Field.Label>
                    <InputGroup startAddon="$" endAddon="USD per night">
                      <NumberInput.Root required name='price_per_night' min={0} step={0.01}>
                        <NumberInput.Control />
                        <NumberInput.Input defaultValue={hotel.price_per_night} />
                      </NumberInput.Root>
                    </InputGroup>
                    <Field.HelperText>In USD, must be positive, may be decimal (if so, use the dot and not the comma)</Field.HelperText>
                  </Field.Root>

                  <Button type="submit" size={'xl'}>Update hotel</Button>
                </Stack>
              </form>
            </Box>
          </Stack>

          {/* Add new pictures */}
          <Stack gapY={'12px'}>
            <Heading size={'lg'} >Add new pictures</Heading>
            <Box borderWidth={'1px'} padding={'24px'}>
              <form onSubmit={handlePicturesUpload}>
                <Stack gapY={'24px'}>
                  <Field.Root>
                    <Field.Label>
                      Upload pictures
                    </Field.Label>
                    <FileUpload.Root maxFiles={10} accept="image/*" name="pictures">
                      <FileUpload.HiddenInput />
                      <FileUpload.Trigger asChild>
                        <Button variant="outline" size="sm">
                          <LuFileImage /> Upload pictures
                        </Button>
                      </FileUpload.Trigger>
                      <FileUpload.List showSize clearable />
                    </FileUpload.Root>
                    <Field.HelperText>Maximum size : 2MB. You can upload up to 10 pictures at once. Each picture will be added to the slideshow in the order they are selected.</Field.HelperText>
                  </Field.Root>

                  <Button type="submit" size={'xl'}>Upload pictures</Button>
                </Stack>
              </form>
            </Box>
          </Stack>

          {/* Pictures order & delete */}
          {hotel.pictures && hotel.pictures.length > 0 && (
            <Stack gapY={'12px'}>
              <Heading size={'lg'} >Edit pictures order</Heading>
              <Box borderWidth={'1px'} padding={'24px'}>
                <form onSubmit={handlePicturesFormSubmit}>
                  <Stack gapY={'24px'}>
                    <Stack direction={'row'} gap={'12px'} wrap={'wrap'}>
                      {hotel.pictures.sort(function (a, b) {
                        return a.index - b.index;
                      }).map((picture, index) => (
                        <Card.Root key={picture.id} maxW="sm" overflow="hidden">
                          <Image
                            src={picture.file_path}
                            alt={'Picture ' + index + ' of hotel ' + hotel.name}
                          />
                          <Card.Body gap="2">
                            <Field.Root required>
                              <Field.Label>Position in slideshow</Field.Label>
                              <NumberInput.Root required name={`picture_index_${picture.id}`} step={1} min={0} defaultValue={picture.index} >
                                <NumberInput.Control />
                                <NumberInput.Input />
                              </NumberInput.Root>
                              <Field.HelperText>Number must be a positive integer</Field.HelperText>
                            </Field.Root>
                          </Card.Body>
                          <Card.Footer gap="2">
                            <Button onClick={deletePicture} data-picture-id={picture.id} colorPalette={'red'}>Delete picture</Button>
                          </Card.Footer>
                        </Card.Root>
                      ))}
                    </Stack>
                    <Button type="submit" size={'xl'}>Update pictures order</Button>
                  </Stack>
                </form>
              </Box>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Center>
  )
}

export async function getStaticProps({ params }) {
  const hotel = await fetch(`http://web:80/api/hotel/${params.id}`).then(response => response.json());

  return {
    props: {
      hotel: hotel.data
    }
  }
}

export async function getStaticPaths() {
  const data = await fetch("http://web:80/api/hotel-ids").then((response) => response.json())

  return {
    paths: data.map(id => ({
      params: { id: id.toString() }
    })),
    fallback: false
  }
}

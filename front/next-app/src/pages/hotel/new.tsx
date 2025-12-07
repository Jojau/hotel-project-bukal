import { useRouter } from 'next/router';
import { useState } from 'react';
import { Alert, Badge, Box, Breadcrumb, Button, Center, Container, Field, FileUpload, Heading, Input, InputGroup, List, NumberInput, Stack, Text, Textarea } from '@chakra-ui/react';
import { LuFileImage } from 'react-icons/lu';

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
      const allPictures = formData.getAll('pictures');
      // Filter out empty files (FileUpload creates empty files when no selection is made)
      const pictures = allPictures.filter((file: File) => file.size > 0);
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
      if (hasErrors) {
        // If there were at least one error uploading pictures, the created hotel should be deleted to avoid confusion
        fetch("http://localhost/api/hotel/" + createdHotel.id, {
          method: "DELETE"
        });
      } else {
        // Redirect to the created hotel's details page
        // FIXME Created hotel page returns 404 (but manually reloading said page works)
        router.push(`/hotel/${createdHotel.id}`);
      }


    } catch (err) {
      // Handle other errors
      console.error('Submit error', err);
      setErrors(prev => prev.length ? prev : ['An unexpected error occurred.']);
    }
  };

  return (
    <Center>
      <Stack gap={'48px'} margin={'48px'} width={'8xl'}>
        {/* Hotel name & breadcrumb */}
        <Container gapY={'12px'}>
          <Heading size={'4xl'} textAlign={'center'}>Create a new hotel</Heading>

          <Center>
            <Breadcrumb.Root>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator />
                <Breadcrumb.Item>
                  <Breadcrumb.CurrentLink>Create hotel</Breadcrumb.CurrentLink>
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
                <Alert.Title fontWeight={'bold'}>Hotel creation {errors.length > 1 ? 'errors' : 'error'}</Alert.Title>
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

          {/* Fields */}
          <Box borderWidth={'1px'} padding={'24px'}>
            <form onSubmit={handleSubmit}>
              <Stack gapY={'24px'}>
                <Field.Root required>
                  <Field.Label>
                    Hotel name
                  </Field.Label>
                  <Input required name='name' type='text' placeholder="The Cloud One Hotel New York-Downtown" />
                  <Field.HelperText>May be up to 255 characters maximum</Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Address
                  </Field.Label>
                  <Input required name='address' type='text' placeholder="133 Greenwich St" />
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
                  <Input name='address2' type='text' />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Zipcode
                  </Field.Label>
                  <Input required name='zipcode' type='text' placeholder="NY 10006" />
                  <Field.HelperText>May be up to 20 characters maximum, may contain numbers, letters and spaces</Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    City
                  </Field.Label>
                  <Input required name='city' type='text' placeholder="New York" />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Country
                  </Field.Label>
                  <Input required name='country' type='text' placeholder="United States of America" />
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Latitude
                  </Field.Label>
                  <NumberInput.Root required name='latitude' step={0.00000000000001} min={-90} max={90}>
                    <NumberInput.Control />
                    <NumberInput.Input placeholder='40.70967754745341' />
                  </NumberInput.Root>
                  <Field.HelperText>Must be between -90 and 90, may be decimal (if so, use the dot and not the comma). Example : 40.70967754745341</Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Longitude
                  </Field.Label>
                  <NumberInput.Root required name='longitude' step={0.00000000000001} min={-180} max={180}>
                    <NumberInput.Control />
                    <NumberInput.Input placeholder='-74.01277611534421' />
                  </NumberInput.Root>
                  <Field.HelperText>Must be between -180 and 180, may be decimal (if so, use the dot and not the comma). Example : -74.01277611534421</Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Description
                  </Field.Label>
                  <Textarea required name='description' maxLength={5000} placeholder="Describe the hotel in less than 5000 characters..." />
                  <Field.HelperText>May be up to 5000 characters maximum</Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>
                    Maximum capacity
                  </Field.Label>
                  <NumberInput.Root required name='max_capacity' defaultValue="1" step={1} min={1} max={200}>
                    <NumberInput.Control />
                    <NumberInput.Input /*placeholder='100'*/ /> {/* Note : Unfortunately the default value takes over the placeholder, and is required as an empty value causes the input to be considered invalid */}
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
                      <NumberInput.Input placeholder='250' />
                    </NumberInput.Root>
                  </InputGroup>
                  <Field.HelperText>In USD, must be positive, may be decimal (if so, use the dot and not the comma)</Field.HelperText>
                </Field.Root>

                <Field.Root>
                  <Field.Label>
                    Upload pictures
                    <Field.RequiredIndicator
                      fallback={
                        <Badge size="sm" variant="surface">
                          Optional
                        </Badge>
                      }
                    />
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

                <Button type="submit" size={'xl'}>Create hotel</Button>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Stack>
    </Center>
  )
}

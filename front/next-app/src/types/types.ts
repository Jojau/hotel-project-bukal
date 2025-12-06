export interface Hotel {
  id: string;
  name: string;
    address: string;
    address2?: string;
    zipcode: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    description: string;
    max_capacity: number;
    price_per_night: number;
    pictures?: Array<{
      id: string;
      file_path: string;
      index: number;
    }>;
}

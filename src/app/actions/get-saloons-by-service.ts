// src/app/actions/get-saloons-by-service.ts
import { API_BASE_URL } from "../../../config/constants";

export interface SaloonImage {
  id: string;
  saloonId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Saloon {
  id: string;
  name: string;
  description: string;
  shortIntro: string;
  rating: number;
  address: string;
  images?: SaloonImage[];
  createdAt: string;
  updatedAt: string;
}

export interface SaloonService {
  saloonId: string;
  serviceId: string;
  price: number;
  durationMinutes: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  saloon: Saloon;
}

export interface ServiceWithSaloons {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  parentServiceId: string | null;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
  saloonServices: SaloonService[];
}

export interface SaloonData {
  id: string;
  name: string;
  shortIntro: string;
  price: number;
  durationMinutes: number;
  isAvailable: boolean;
  rating: number;
  address: string;
  imageUrl?: string;
  images?: string[];
}

const getSaloonsByService = async (serviceId: string): Promise<SaloonData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${serviceId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ServiceWithSaloons = await response.json();
    console.log('Raw API response for service:', JSON.stringify(data, null, 2));
    console.log('First saloon service data:', JSON.stringify(data.saloonServices[0], null, 2));
    
    // Extract saloon data from the response - images are already included
    const saloonsData: SaloonData[] = data.saloonServices
      .filter(saloonService => saloonService.isAvailable) // Only include available services
      .map(saloonService => {
        console.log('Processing saloon:', saloonService.saloon.name, 'Images:', saloonService.saloon.images);
        return {
          id: saloonService.saloon.id,
          name: saloonService.saloon.name,
          shortIntro: saloonService.saloon.shortIntro,
          price: saloonService.price,
          durationMinutes: saloonService.durationMinutes,
          isAvailable: saloonService.isAvailable,
          rating: saloonService.saloon.rating,
          address: saloonService.saloon.address,
          imageUrl: saloonService.saloon.images && saloonService.saloon.images.length > 0 
            ? saloonService.saloon.images[0].url 
            : undefined,
          images: saloonService.saloon.images ? saloonService.saloon.images.map((img: any) => img.url) : undefined,
        };
      });

    console.log('Saloons with images:', saloonsData);
    return saloonsData;
  } catch (error) {
    console.error('Error fetching saloons by service:', error);
    throw error;
  }
};

export default getSaloonsByService;
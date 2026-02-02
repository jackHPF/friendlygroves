import { Property, Booking, Availability, Review } from '@/types';
import { loadProperties, saveProperties, loadReviews, saveReviews, loadBookings, saveBookings } from './storage';

// Default properties (used for initial setup)
const DEFAULT_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Friendly Groves MVP',
    location: 'MVP Colony, Visakhapatnam',
    city: 'Visakhapatnam',
    description: 'Beautiful and spacious apartment in MVP Colony, one of the most sought-after neighborhoods in Vizag. Perfect for families and business travelers with modern amenities and excellent connectivity.',
    pricePerNight: 2500,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      '/images/fgmvp-1.jpg',
      '/images/fgmvp-2.jpg',
      '/images/fgmvp-3.jpg',
      '/images/fgmvp-4.jpg',
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Parking',
      'Balcony',
      'Washing Machine',
      'TV',
      'City View',
    ],
    slug: 'fgmvp',
    featured: true,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    airbnbUrl: 'https://www.airbnb.co.in/h/fgmvp',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=MVP+Colony,+Visakhapatnam',
  },
  {
    id: '2',
    name: 'Panorama Sea View Apartment',
    location: 'Beach Road, Visakhapatnam',
    city: 'Visakhapatnam',
    description: 'Stunning apartment with breathtaking panoramic sea views. Located on Beach Road, this property offers direct access to the beach and spectacular sunrise and sunset views. Perfect for a memorable stay in Vizag.',
    pricePerNight: 3500,
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      '/images/panoramaseaviewappt-1.jpg',
      '/images/panoramaseaviewappt-2.jpg',
      '/images/panoramaseaviewappt-3.jpg',
      '/images/panoramaseaviewappt-4.jpg',
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Full Kitchen',
      'Parking',
      'Balcony',
      'Washing Machine',
      'Smart TV',
      'Sea View',
      'Near Beach',
    ],
    slug: 'panoramaseaviewappt',
    featured: true,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    airbnbUrl: 'https://www.airbnb.co.in/h/panoramaseaviewappt',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Beach+Road,+Visakhapatnam',
  },
  {
    id: '3',
    name: 'Rishikonda Bay View',
    location: 'Rishikonda, Visakhapatnam',
    city: 'Visakhapatnam',
    description: 'Luxurious apartment with stunning bay views in the serene Rishikonda area. Close to the famous Rishikonda Beach, this property offers peace and tranquility while being well-connected to the city.',
    pricePerNight: 3000,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      '/images/1763618853943-sud07whly6r.jpeg',
      '/images/1763618842126-sjru2vbhmd.jpeg',
      '/images/1763618847707-29vkbqm75w.jpeg',
      '/images/1763618333210-lzjkju5yjyb.jpeg',
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Parking',
      'Balcony',
      'Washing Machine',
      'TV',
      'Bay View',
      'Near Beach',
    ],
    slug: 'rishikondabayview',
    featured: true,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    airbnbUrl: 'https://www.airbnb.co.in/h/rishikondabayview',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rishikonda,+Visakhapatnam',
  },
  {
    id: '4',
    name: 'Century View',
    location: 'Century Towers, Visakhapatnam',
    city: 'Visakhapatnam',
    description: 'Modern apartment in Century Towers with excellent city views. Located in a prime area with easy access to shopping, dining, and entertainment. Ideal for both short and long stays.',
    pricePerNight: 2800,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      '/images/1763618217252-q97ahjoo6sr.jpeg',
      '/images/1763618228063-stp2zf08cm.jpeg',
      '/images/1763618234553-tsnpnxz0zuh.jpeg',
      '/images/1763618320397-us1clranz6.jpeg',
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Parking',
      'Elevator',
      'Washing Machine',
      'Smart TV',
      'City View',
      'Gym Access',
    ],
    slug: 'centuryview',
    featured: true,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    airbnbUrl: 'https://www.airbnb.co.in/h/centuryview',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Century+Towers,+Visakhapatnam',
  },
  {
    id: '5',
    name: 'Mangroves Farm House',
    location: 'Mangroves Area, Visakhapatnam',
    city: 'Visakhapatnam',
    description: 'Unique farmhouse experience surrounded by mangroves. A perfect getaway for nature lovers seeking tranquility. This property offers a blend of modern comfort and natural beauty.',
    pricePerNight: 4000,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      '/images/1763618326670-w1u1ry8p7p.jpeg',
      '/images/1763618333210-lzjkju5yjyb.jpeg',
      '/images/1763618842126-sjru2vbhmd.jpeg',
      '/images/1763618847707-29vkbqm75w.jpeg',
    ],
    amenities: [
      'WiFi',
      'Air Conditioning',
      'Full Kitchen',
      'Parking',
      'Garden',
      'Washing Machine',
      'TV',
      'Nature View',
      'Private Space',
    ],
    slug: 'mangrovesframhouse',
    featured: true,
    hidden: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    airbnbUrl: 'https://www.airbnb.co.in/h/mangrovesframhouse',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mangroves+Area,+Visakhapatnam',
  },
];

// In-memory cache (loaded from file)
let propertiesCache: Property[] | null = null;
let reviewsCache: Review[] | null = null;
let bookingsCache: Booking[] | null = null;

// Clear cache to force reload from file
export function clearPropertiesCache() {
  propertiesCache = null;
}

export function clearReviewsCache() {
  reviewsCache = null;
}

export function clearBookingsCache() {
  bookingsCache = null;
}

// Initialize data on first load
async function initializeData() {
  if (propertiesCache === null) {
    const loaded = await loadProperties();
    // Only use defaults if:
    // 1. No data loaded AND
    // 2. KV is not configured (meaning we're in local dev or KV isn't set up yet)
    const isKVConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
    
    if (loaded.length === 0 && !isKVConfigured) {
      // First time in local dev - save default properties
      propertiesCache = DEFAULT_PROPERTIES;
      try {
        await saveProperties(propertiesCache);
      } catch (error) {
        // If save fails (e.g., read-only filesystem), continue with in-memory cache
        console.warn('Could not save default properties, using in-memory cache');
      }
    } else {
      // Use loaded data (from KV or file), or empty array if KV is configured but empty
      propertiesCache = loaded;
    }
  }
  if (reviewsCache === null) {
    reviewsCache = await loadReviews();
  }
  if (bookingsCache === null) {
    bookingsCache = await loadBookings();
  }
}

// Helper functions - now async
export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  await initializeData();
  return propertiesCache!.find(p => p.slug === slug);
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  await initializeData();
  return propertiesCache!.find(p => p.id === id);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  // Always reload from file to get latest data
  propertiesCache = null;
  await initializeData();
  return propertiesCache!.filter(p => p.featured && !p.hidden);
}

export async function getAllProperties(includeHidden: boolean = false): Promise<Property[]> {
  // Always reload from file to get latest data
  propertiesCache = null;
  await initializeData();
  if (includeHidden) {
    return [...propertiesCache!];
  }
  return propertiesCache!.filter(p => !p.hidden);
}

// Admin functions for property management
export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  await initializeData();
  const newProperty: Property = {
    ...propertyData,
    id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hidden: propertyData.hidden || false,
    videos: propertyData.videos || [],
  };
  propertiesCache!.push(newProperty);
  await saveProperties(propertiesCache!);
  // Clear cache to force reload on next request
  clearPropertiesCache();
  return newProperty;
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  await initializeData();
  const index = propertiesCache!.findIndex(p => p.id === id);
  if (index === -1) {
    return null;
  }
  
  const updatedProperty: Property = {
    ...propertiesCache![index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };
  
  propertiesCache![index] = updatedProperty;
  await saveProperties(propertiesCache!);
  // Clear cache to force reload on next request
  clearPropertiesCache();
  return updatedProperty;
}

export async function deleteProperty(id: string): Promise<boolean> {
  await initializeData();
  const index = propertiesCache!.findIndex(p => p.id === id);
  if (index === -1) {
    return false;
  }
  propertiesCache!.splice(index, 1);
  await saveProperties(propertiesCache!);
  // Clear cache to force reload on next request
  clearPropertiesCache();
  return true;
}

export async function togglePropertyVisibility(id: string): Promise<Property | null> {
  await initializeData();
  const property = propertiesCache!.find(p => p.id === id);
  if (!property) {
    return null;
  }
  return updateProperty(id, { hidden: !property.hidden });
}

export async function getAllPropertiesForAdmin(): Promise<Property[]> {
  await initializeData();
  return [...propertiesCache!];
}

// Review functions
export async function getReviewsByPropertyId(propertyId: string): Promise<Review[]> {
  await initializeData();
  return reviewsCache!.filter(r => r.propertyId === propertyId);
}

export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  await initializeData();
  const newReview: Review = {
    ...reviewData,
    id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  reviewsCache!.push(newReview);
  await saveReviews(reviewsCache!);
  return newReview;
}

export async function getAllReviews(): Promise<Review[]> {
  await initializeData();
  return [...reviewsCache!];
}

// Booking functions
export async function checkAvailability(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  await initializeData();
  const propertyBookings = bookingsCache!.filter(
    b => b.propertyId === propertyId && b.status === 'confirmed'
  );

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  for (const booking of propertyBookings) {
    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);

    // Check for date overlap
    if (
      (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
      (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
      (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
    ) {
      return false;
    }
  }

  return true;
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
  await initializeData();
  const newBooking: Booking = {
    ...bookingData,
    id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  bookingsCache!.push(newBooking);
  await saveBookings(bookingsCache!);
  return newBooking;
}

export async function getBookingsByEmail(email: string): Promise<Booking[]> {
  await initializeData();
  return bookingsCache!.filter(b => b.guestEmail === email && b.status === 'confirmed');
}

// For backward compatibility - synchronous versions that use cache
// These should only be used after initializeData has been called
export function getPropertyBySlugSync(slug: string): Property | undefined {
  if (propertiesCache === null) return undefined;
  return propertiesCache.find(p => p.slug === slug);
}

export function getAllPropertiesSync(includeHidden: boolean = false): Property[] {
  if (propertiesCache === null) return [];
  if (includeHidden) {
    return [...propertiesCache];
  }
  return propertiesCache.filter(p => !p.hidden);
}

export function getFeaturedPropertiesSync(): Property[] {
  if (propertiesCache === null) return [];
  return propertiesCache.filter(p => p.featured && !p.hidden);
}

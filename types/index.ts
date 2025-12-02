export interface Property {
  id: string;
  name: string;
  location: string;
  city: string;
  address?: string; // Full address for Google Maps
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  videos?: string[]; // Video URLs (YouTube, Vimeo, or direct links)
  amenities: string[];
  slug: string;
  featured: boolean;
  hidden?: boolean; // Hide from public listings
  createdAt: string;
  updatedAt: string;
  googleMapsUrl?: string; // Google Maps URL for the property location
  airbnbUrl?: string; // Airbnb listing URL
  houseRules?: string[]; // House rules array
  cancellationPolicy?: string; // Cancellation policy text
}

export interface PropertyFormData {
  name: string;
  location: string;
  city: string;
  address?: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  videos?: string[];
  amenities: string[];
  slug: string;
  featured: boolean;
  hidden?: boolean;
  googleMapsUrl?: string;
  airbnbUrl?: string;
  houseRules?: string[];
  cancellationPolicy?: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}

export interface Availability {
  propertyId: string;
  date: string;
  available: boolean;
  bookingId?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  message: string;
  inquiryType: 'general' | 'discount' | 'booking';
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string;
}

export interface BookingRequest {
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  source: 'airbnb' | 'customer' | 'manual'; // Where the review came from
  guestName: string;
  guestAvatar?: string; // URL to avatar image
  rating: number; // 1-5 stars
  comment: string;
  stayDate?: string; // Date of stay (for customer reviews)
  checkIn?: string;
  checkOut?: string;
  verified?: boolean; // Whether the review is verified
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewFormData {
  propertyId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  rating: number;
  comment: string;
  checkIn: string;
  checkOut: string;
  bookingId?: string; // Optional: link to booking
}

export interface ContactDetails {
  id: string;
  phoneNumbers: string[]; // Array of phone numbers
  emails: string[]; // Array of email addresses
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  businessHours: {
    days: string; // e.g., "Monday - Sunday"
    hours: string; // e.g., "9:00 AM - 8:00 PM IST"
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  updatedAt: string;
}

export interface StaticContent {
  id: string;
  aboutUs: {
    title: string;
    description: string;
  };
  ourStory: {
    title: string;
    content: string; // Multi-paragraph content
  };
  whatWeStandFor: {
    title: string;
    values: Array<{
      title: string;
      description: string;
      icon?: string; // Icon name for display
    }>;
  };
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  username: string;
  passwordHash: string; // Hashed password
  email?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}


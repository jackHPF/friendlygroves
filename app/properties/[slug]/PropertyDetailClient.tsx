'use client';

import { Property } from '@/types';
import BookingCalendar from '@/components/BookingCalendar';
import ContactForm from '@/components/ContactForm';
// import ReviewsSection from '@/components/ReviewsSection'; // Hidden per user request
// import FeedbackForm from '@/components/FeedbackForm'; // Hidden per user request
import ImageGallery from '@/components/ImageGallery';
import {
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  ChefHat,
  Tv,
  Wind,
  Waves,
  Home,
  Building,
  Dumbbell,
  Sparkles,
  Eye,
  Mountain,
  TreePine,
  Flower2,
  Lock,
  Volume2,
  Umbrella,
  Shield,
  Star,
  Share2,
  Heart,
} from 'lucide-react';
import { useState } from 'react';

interface PropertyDetailClientProps {
  property: Property;
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'WiFi': Wifi,
  'Air Conditioning': Wind,
  'Kitchen': ChefHat,
  'Full Kitchen': ChefHat,
  'Parking': Car,
  'Balcony': Building,
  'Washing Machine': Waves,
  'TV': Tv,
  'Smart TV': Tv,
  'Elevator': Building,
  'Gym Access': Dumbbell,
  'Swimming Pool': Sparkles,
  'Sea View': Eye,
  'City View': Building,
  'Bay View': Eye,
  'Hill View': Mountain,
  'Nature View': TreePine,
  'Near Beach': Umbrella,
  'Garden': Flower2,
  'Private Space': Lock,
  'Quiet Location': Volume2,
};

// Helper function to convert Google Maps URL to embeddable format
function getEmbeddableMapUrl(url: string | undefined, address: string | undefined, location: string, city: string): string {
  // Build query from address or location
  const query = address || `${location}, ${city}`;
  const encodedQuery = encodeURIComponent(query);
  
  // If we have a URL, try to extract useful information
  if (url) {
    // Extract coordinates if present (format: @lat,lng)
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      return `https://www.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed`;
    }
    
    // Extract place name if it's a place URL
    const placeMatch = url.match(/place\/([^\/\?]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://www.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
    }
    
    // For shortened URLs (maps.app.goo.gl), use address
    if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
      return `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
    }
  }
  
  // Default: use address/location query
  return `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.pricePerNight);

  // Get embeddable map URL
  const mapEmbedUrl = getEmbeddableMapUrl(
    property.googleMapsUrl,
    property.address,
    property.location,
    property.city
  );

  const handleBookingSubmit = async (data: {
    checkIn: string;
    checkOut: string;
    guests: number;
  }) => {
    try {
      const response = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
        }),
      });

      const result = await response.json();
      const available = result.available;

      if (available) {
        const params = new URLSearchParams({
          propertyId: property.id,
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          guests: data.guests.toString(),
        });
        window.location.href = `/booking?${params.toString()}`;
      } else {
        alert('Sorry, this property is not available for the selected dates.');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking availability. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Gallery - Airbnb Style */}
      <div className="mx-auto max-w-[1760px] px-4 pt-6 lg:px-8">
        <ImageGallery images={property.images || []} propertyName={property.name} />
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-[1760px] px-4 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
          {/* Left Column - Main Content */}
          <div className="min-w-0">
            {/* Property Header - Airbnb Style */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="mb-2 text-2xl font-semibold text-gray-900 md:text-3xl">
                    {property.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {property.googleMapsUrl ? (
                      <a
                        href={property.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-blue-600 transition-colors underline"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}, {property.city}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{property.location}, {property.city}</span>
                      </div>
                    )}
                    {property.airbnbUrl && (
                      <a
                        href={property.airbnbUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Star className="h-4 w-4" />
                        <span>View on Airbnb</span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: property.name,
                          text: property.description,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50">
                    <Heart className="h-4 w-4" />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                </div>
              </div>

              {/* Property Highlights - Airbnb Style */}
              <div className="flex flex-wrap items-center gap-6 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.maxGuests} {property.maxGuests === 1 ? 'guest' : 'guests'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">
                    {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                  </span>
                </div>
              </div>
            </div>

            {/* Host Section - Airbnb Style */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                  <span className="text-2xl font-bold text-white">
                    {property.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">
                    Hosted by Friendly Groves
                  </h3>
                  <p className="text-sm text-gray-600">
                    Professional host · 5+ years hosting
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                About this place
              </h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="whitespace-pre-line leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Amenities Section - Airbnb Style */}
            <div className="mb-8 border-b border-gray-200 pb-8">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {property.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || Home;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-gray-700"
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0 text-gray-900" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Section */}
            {(property.googleMapsUrl || property.address) && (
              <div className="mb-8 border-b border-gray-200 pb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Where you'll be
                </h2>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <iframe
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbedUrl}
                    className="w-full"
                    title={`Map showing location of ${property.name}`}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {property.address || `${property.location}, ${property.city}`}
                  </p>
                  {property.googleMapsUrl && (
                    <a
                      href={property.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* House Rules Section */}
            {property.houseRules && property.houseRules.length > 0 && (
              <div className="mb-8 border-b border-gray-200 pb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  House rules
                </h2>
                <div className="space-y-3 text-sm text-gray-700">
                  {property.houseRules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 flex-shrink-0">
                        <Shield className="h-5 w-5 text-gray-700" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{rule}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cancellation Policy */}
            {property.cancellationPolicy && (
              <div className="mb-8 border-b border-gray-200 pb-8">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Cancellation policy
                </h2>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {property.cancellationPolicy}
                  </p>
                </div>
              </div>
            )}

            {/* Reviews Section - Hidden per user request */}
            {/* <div className="mb-8 border-b border-gray-200 pb-8">
              <ReviewsSection propertyId={property.id} />
            </div> */}

            {/* Feedback Form - Hidden per user request */}
            {/* <div className="mb-8 border-b border-gray-200 pb-8">
              <FeedbackForm
                propertyId={property.id}
                propertyName={property.name}
              />
            </div> */}

            {/* Contact Form */}
            <div className="mb-8" id="contact-section">
              <ContactForm
                propertyId={property.id}
                propertyName={property.name}
              />
            </div>
          </div>

          {/* Right Column - Sticky Booking Sidebar - Airbnb Style */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <BookingCalendar
              property={property}
              onBookingSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

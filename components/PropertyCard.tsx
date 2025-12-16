'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types';
import { 
  MapPin, Users, Bed, Bath, Star, Home, 
  Wifi, Wind, ChefHat, Car, Building2, 
  Waves, Tv, Monitor, Building, Dumbbell, 
  Eye, Mountain, TreePine, 
  Flower2, Lock, Volume2, Sparkles, Umbrella
} from 'lucide-react';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
}

// Amenity icon mapping
const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'WiFi': Wifi,
  'Air Conditioning': Wind,
  'Kitchen': ChefHat,
  'Full Kitchen': ChefHat,
  'Parking': Car,
  'Balcony': Building2,
  'Washing Machine': Waves,
  'TV': Tv,
  'Smart TV': Monitor,
  'Elevator': Building,
  'Gym Access': Dumbbell,
  'Swimming Pool': Sparkles,
  'Sea View': Eye,
  'City View': Building2,
  'Bay View': Eye,
  'Hill View': Mountain,
  'Nature View': TreePine,
  'Near Beach': Umbrella,
  'Garden': Flower2,
  'Private Space': Lock,
  'Quiet Location': Volume2,
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(property.pricePerNight);

  const [imageError, setImageError] = useState(false);
  const imageSrc = property.images?.[0];
  // Unoptimize Vercel Blob URLs and local /images/ paths
  const shouldUnoptimize = imageSrc?.includes('blob.vercel-storage.com') || imageSrc?.startsWith('/images/');

  return (
    <Link href={`/properties/${property.slug}`}>
      <div className="group flex h-full flex-col cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200">
          {!imageError && imageSrc ? (
            <Image
              src={imageSrc}
              alt={property.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={shouldUnoptimize}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <Home className="mx-auto h-16 w-16 text-blue-400" />
                <p className="mt-2 text-sm font-medium text-blue-600">Image Coming Soon</p>
              </div>
            </div>
          )}
          {property.featured && (
            <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-black">
              Featured
            </div>
          )}
          <div className="absolute bottom-4 right-4 rounded-lg bg-black/60 px-3 py-2 text-white backdrop-blur-sm">
            <span className="text-lg font-bold">{formattedPrice}</span>
            <span className="text-sm">/night</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-1">
            {property.name}
          </h3>
          
          <div className="mb-3 flex items-center text-gray-600">
            {property.googleMapsUrl ? (
              <a
                href={property.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-blue-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MapPin className="mr-1 h-4 w-4 cursor-pointer" />
                <span className="text-sm">{property.location}</span>
              </a>
            ) : (
              <>
                <MapPin className="mr-1 h-4 w-4" />
                <span className="text-sm">{property.location}</span>
              </>
            )}
          </div>

          {/* Property Details */}
          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>{property.maxGuests} guests</span>
            </div>
            <div className="flex items-center">
              <Bed className="mr-1 h-4 w-4" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <Bath className="mr-1 h-4 w-4" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Amenities Preview - Icons with Tooltips */}
          <div className="mb-4 flex flex-wrap gap-2 min-h-[40px]">
            {property.amenities.slice(0, 8).map((amenity, index) => {
              const IconComponent = amenityIcons[amenity] || Home;
              return (
                <div
                  key={index}
                  className="amenity-icon-wrapper group/icon relative flex items-center justify-center"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-all duration-200 hover:bg-blue-100 hover:scale-110">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  {/* Tooltip - only shows on hover of this specific icon */}
                  <div className="absolute bottom-full left-1/2 mb-2 z-50 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 pointer-events-none group-hover/icon:opacity-100">
                    {amenity}
                    <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              );
            })}
            {property.amenities.length > 8 && (
              <div className="amenity-icon-wrapper group/icon relative flex items-center justify-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:scale-110">
                  <span className="text-xs font-semibold">+{property.amenities.length - 8}</span>
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 mb-2 z-50 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 pointer-events-none group-hover/icon:opacity-100">
                  {property.amenities.length - 8} more amenities
                  <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>

          {/* Description Preview */}
          <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 min-h-[40px]">
            {property.description}
          </p>

          {/* View Details Button */}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}


'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  propertyName: string;
}

export default function ImageGallery({ images, propertyName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  if (!images || images.length === 0) {
    return (
      <div className="relative h-[400px] w-full bg-gradient-to-br from-blue-100 to-blue-200 md:h-[500px]">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <Home className="mx-auto h-24 w-24 text-blue-400" />
            <p className="mt-4 text-lg font-medium text-blue-600">Image Coming Soon</p>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  // Airbnb-style grid layout
  if (images.length === 1) {
    return (
      <div className="relative h-[400px] w-full overflow-hidden rounded-t-2xl md:h-[500px]">
        <Image
          src={mainImage}
          alt={propertyName}
          fill
          className="object-cover"
          priority
          onError={() => handleImageError(currentIndex)}
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="grid h-[400px] grid-cols-2 gap-2 overflow-hidden rounded-t-2xl md:h-[500px]">
        {images.map((image, index) => (
          <div key={index} className="relative overflow-hidden">
            <Image
              src={image}
              alt={`${propertyName} - Image ${index + 1}`}
              fill
              className="object-cover"
              onError={() => handleImageError(index)}
            />
          </div>
        ))}
      </div>
    );
  }

  // 3+ images: Main large image + grid of smaller images
  const thumbnailImages = images.slice(1, 5); // Show up to 4 thumbnails

  return (
    <div className="relative h-[400px] overflow-hidden rounded-t-2xl md:h-[500px]">
      <div className="grid h-full grid-cols-4 gap-2">
        {/* Main large image (left side, 2 columns) */}
        <div className="relative col-span-4 overflow-hidden md:col-span-2">
          {!imageErrors.has(currentIndex) ? (
            <Image
              src={mainImage}
              alt={propertyName}
              fill
              className="object-cover"
              priority
              onError={() => handleImageError(currentIndex)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <Home className="h-16 w-16 text-gray-400" />
            </div>
          )}
          
          {/* Navigation arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-all hover:bg-white hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-gray-900" />
              </button>
            </>
          )}

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail grid (right side, 2 columns) */}
        {thumbnailImages.length > 0 && (
          <div className="col-span-4 grid grid-cols-2 gap-2 md:col-span-2">
            {thumbnailImages.map((image, index) => {
              const actualIndex = index + 1;
              const isActive = actualIndex === currentIndex;
              return (
                <button
                  key={actualIndex}
                  onClick={() => goToImage(actualIndex)}
                  className={`relative overflow-hidden rounded-lg transition-all ${
                    isActive ? 'ring-2 ring-black' : 'hover:opacity-90'
                  }`}
                >
                  {!imageErrors.has(actualIndex) ? (
                    <Image
                      src={image}
                      alt={`${propertyName} - Image ${actualIndex + 1}`}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(actualIndex)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200">
                      <Home className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {actualIndex === 4 && images.length > 5 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      <span className="text-sm font-semibold">+{images.length - 5}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Show all images button */}
      {images.length > 5 && (
        <button
          onClick={() => {
            // Could open a modal gallery here
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-lg transition-all hover:bg-gray-50"
        >
          Show all {images.length} photos
        </button>
      )}
    </div>
  );
}


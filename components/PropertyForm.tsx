'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Property, PropertyFormData } from '@/types';
import { X, Plus, Image as ImageIcon, Video, Save } from 'lucide-react';

interface PropertyFormProps {
  property?: Property;
}

const COMMON_AMENITIES = [
  'WiFi',
  'Air Conditioning',
  'Kitchen',
  'Full Kitchen',
  'Parking',
  'Balcony',
  'Washing Machine',
  'TV',
  'Smart TV',
  'Elevator',
  'Gym Access',
  'Swimming Pool',
  'Sea View',
  'City View',
  'Bay View',
  'Hill View',
  'Nature View',
  'Near Beach',
  'Garden',
  'Private Space',
  'Quiet Location',
];

export default function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    name: property?.name || '',
    location: property?.location || '',
    city: property?.city || '',
    address: property?.address || '',
    description: property?.description || '',
    pricePerNight: property?.pricePerNight || 0,
    maxGuests: property?.maxGuests || 1,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    images: property?.images || [],
    videos: property?.videos || [],
    amenities: property?.amenities || [],
    slug: property?.slug || '',
    featured: property?.featured || false,
    hidden: property?.hidden || false,
    googleMapsUrl: property?.googleMapsUrl || '',
    airbnbUrl: property?.airbnbUrl || '',
    houseRules: property?.houseRules || [],
    cancellationPolicy: property?.cancellationPolicy || '',
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newHouseRule, setNewHouseRule] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Auto-generate slug from name
  useEffect(() => {
    if (!property && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, property]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'number'
          ? parseFloat(value) || 0
          : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addVideo = () => {
    if (newVideoUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), newVideoUrl.trim()],
      }));
      setNewVideoUrl('');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'video');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        videos: [...(prev.videos || []), data.url],
      }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos?.filter((_, i) => i !== index) || [],
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const addHouseRule = () => {
    if (newHouseRule.trim() && !formData.houseRules?.includes(newHouseRule.trim())) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...(prev.houseRules || []), newHouseRule.trim()],
      }));
      setNewHouseRule('');
    }
  };

  const removeHouseRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules?.filter((_, i) => i !== index) || [],
    }));
  };

  // Auto-generate Google Maps URL from address (only if googleMapsUrl is empty)
  useEffect(() => {
    if (formData.address && formData.address.trim() && !formData.googleMapsUrl) {
      const encodedAddress = encodeURIComponent(formData.address);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      setFormData(prev => ({
        ...prev,
        googleMapsUrl: mapsUrl,
      }));
    }
  }, [formData.address, formData.googleMapsUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const url = property
        ? '/api/properties'
        : '/api/properties';
      const method = property ? 'PUT' : 'POST';

      const payload = property
        ? { ...formData, id: property.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save property');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-8 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 p-4 text-green-800">
            Property {property ? 'updated' : 'created'} successfully! Redirecting...
          </div>
        )}

        {/* Basic Information */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                pattern="[a-z0-9-]+"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="property-slug"
              />
              <p className="mt-1 text-xs text-gray-500">
                URL-friendly identifier (lowercase, hyphens only)
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Address (for Google Maps) *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="e.g., Flat 301, ABC Apartments, Beach Road, Visakhapatnam, Andhra Pradesh 530001"
              />
              <p className="mt-1 text-xs text-gray-500">
                Full address will be used to generate Google Maps link automatically
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Pricing & Capacity
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price per Night (₹) *
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                required
                min="0"
                step="100"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Max Guests *
              </label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Bedrooms *
              </label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Bathrooms *
              </label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Images</h2>
          
          {/* Upload from Computer */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload Image from Computer
            </label>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <ImageIcon className="h-4 w-4" />
                {uploadingImage ? 'Uploading...' : 'Choose Image'}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500">
                Max 10MB (JPEG, PNG, WebP, GIF)
              </span>
            </div>
          </div>

          {/* Or Add URL */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Or Add Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Enter image URL (e.g., /images/property-1.jpg)"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addImage();
                  }
                }}
              />
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <ImageIcon className="h-4 w-4" />
                Add URL
              </button>
            </div>
          </div>

          {uploadError && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {uploadError}
            </div>
          )}

          {/* Image Gallery */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Videos</h2>
          
          {/* Upload from Computer */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload Video from Computer
            </label>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Video className="h-4 w-4" />
                {uploadingVideo ? 'Uploading...' : 'Choose Video'}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg,video/quicktime"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-500">
                Max 100MB (MP4, WebM, OGG, QuickTime)
              </span>
            </div>
          </div>

          {/* Or Add URL */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Or Add Video URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, or direct link)"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addVideo();
                  }
                }}
              />
              <button
                type="button"
                onClick={addVideo}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <Video className="h-4 w-4" />
                Add URL
              </button>
            </div>
          </div>

          {/* Video List */}
          {formData.videos && formData.videos.length > 0 && (
            <div className="space-y-2">
              {formData.videos.map((video, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                  <span className="truncate text-sm text-gray-700">{video}</span>
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="ml-2 rounded p-1 text-red-600 hover:bg-red-50"
                    title="Remove video"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Amenities</h2>
          <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {COMMON_AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add custom amenity"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomAmenity();
                }
              }}
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {/* House Rules */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">House Rules</h2>
          <p className="mb-4 text-sm text-gray-600">
            Add rules that guests should follow during their stay
          </p>
          
          {/* Existing House Rules */}
          {formData.houseRules && formData.houseRules.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.houseRules.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <span className="text-sm text-gray-700">{rule}</span>
                  <button
                    type="button"
                    onClick={() => removeHouseRule(index)}
                    className="rounded-full p-1 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New House Rule */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newHouseRule}
              onChange={(e) => setNewHouseRule(e.target.value)}
              placeholder="e.g., No smoking, No parties, Check-in after 3 PM"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addHouseRule();
                }
              }}
            />
            <button
              type="button"
              onClick={addHouseRule}
              className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              <Plus className="h-4 w-4" />
              Add Rule
            </button>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Cancellation Policy
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Describe your cancellation policy for guests
          </p>
          <textarea
            name="cancellationPolicy"
            value={formData.cancellationPolicy}
            onChange={handleInputChange}
            rows={6}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g., Free cancellation before check-in date. Get a full refund if you cancel at least 30 days before check-in. After that, you'll get a 50% refund up to 7 days before check-in. No refund for cancellations within 7 days of check-in."
          />
          <p className="mt-2 text-xs text-gray-500">
            This policy will be displayed to guests on the property page
          </p>
        </div>

        {/* Additional URLs */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Google Maps URL
              </label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Auto-generated from address or enter manually"
              />
              <p className="mt-1 text-xs text-gray-500">
                Auto-generated from address above, or enter manually
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Airbnb URL
              </label>
              <input
                type="url"
                name="airbnbUrl"
                value={formData.airbnbUrl}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="https://www.airbnb.co.in/h/..."
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Options</h2>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Featured Property</span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="hidden"
                checked={formData.hidden}
                onChange={handleCheckboxChange}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Hide from public listings</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
}


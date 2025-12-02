import PropertyCard from '@/components/PropertyCard';
import Hero from '@/components/Hero';
import ContactForm from '@/components/ContactForm';
import { Property } from '@/types';
import { Sparkles, Shield, Heart, Star } from 'lucide-react';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getFeaturedProperties(): Promise<Property[]> {
  // Directly access the data - no caching
  const dataModule = await import('@/lib/data');
  const properties = await dataModule.getAllProperties(false); // false = exclude hidden
  
  // Filter for featured properties
  const featured = properties.filter(p => p.featured && !p.hidden);
  
  return featured;
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero />

      {/* Featured Properties Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600">
              Discover our handpicked selection of premium rental apartments
            </p>
          </div>

          {featuredProperties.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-12 text-center">
              <p className="text-gray-600">No featured properties available at the moment.</p>
              <p className="mt-2 text-sm text-gray-500">
                Make sure properties are marked as "Featured" and not "Hidden" in the admin panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <a
              href="/properties"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              View All Properties
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Why Choose Friendly Groves?
          </h2>
          <p className="text-base text-gray-600">
            Experience the perfect blend of comfort, luxury, and hospitality
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Premium Properties
            </h3>
            <p className="text-sm text-gray-600">
              Carefully selected apartments with modern amenities and stylish
              interiors
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Safe & Secure
            </h3>
            <p className="text-sm text-gray-600">
              Your safety and security are our top priorities
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
              <Heart className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Excellent Service
            </h3>
            <p className="text-sm text-gray-600">
              Dedicated support team available 24/7 to assist you
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 text-center shadow-md">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Best Locations
            </h3>
            <p className="text-sm text-gray-600">
              Prime locations near beaches, restaurants, and attractions
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}

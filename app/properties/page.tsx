import PropertyCard from '@/components/PropertyCard';
import { Search } from 'lucide-react';

// Force dynamic rendering to always get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAllProperties() {
  // Use dynamic import to avoid module caching issues
  const { getAllProperties } = await import('@/lib/data');
  return await getAllProperties();
}

interface PropertiesPageProps {
  searchParams: { search?: string };
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const allProperties = await getAllProperties();
  const searchQuery = searchParams.search?.toLowerCase() || '';

  const filteredProperties = searchQuery
    ? allProperties.filter(
        (property) =>
          property.name.toLowerCase().includes(searchQuery) ||
          property.location.toLowerCase().includes(searchQuery) ||
          property.city.toLowerCase().includes(searchQuery) ||
          property.description.toLowerCase().includes(searchQuery)
      )
    : allProperties;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            All Properties
          </h1>
          <p className="text-xl text-blue-100">
            Discover all our rental apartments in Vizag
          </p>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4">
            <Search className="h-5 w-5 text-blue-600" />
            <p className="text-gray-700">
              Found <span className="font-semibold">{filteredProperties.length}</span>{' '}
              property{filteredProperties.length !== 1 ? 'ies' : ''} matching "{searchQuery}"
            </p>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <Search className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-2xl font-semibold text-gray-900">
              No properties found
            </h3>
            <p className="mb-6 text-gray-600">
              Try adjusting your search terms or{' '}
              <a href="/properties" className="text-blue-600 hover:underline">
                view all properties
              </a>
            </p>
          </div>
        )}
      </section>
    </main>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types';
import { Plus, Edit, Trash2, Eye, EyeOff, Home } from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties?admin=true');
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/properties?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      await fetchProperties();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      const response = await fetch(`/api/properties?id=${id}&action=toggle-visibility`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle visibility');
      }

      await fetchProperties();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">Property Management</h1>
              <p className="text-blue-100">Manage your property listings</p>
            </div>
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
            >
              <Plus className="h-5 w-5" />
              Add New Property
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <Home className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-2xl font-semibold text-gray-900">
              No properties found
            </h3>
            <p className="mb-6 text-gray-600">
              Get started by adding your first property listing.
            </p>
            <Link
              href="/admin/properties/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add New Property
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price/Night
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {properties.map((property) => (
                  <tr key={property.id} className={property.hidden ? 'bg-gray-50 opacity-75' : ''}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-4">
                          <Home className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.name}
                            {property.featured && (
                              <span className="ml-2 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-black">
                                Featured
                              </span>
                            )}
                            {property.hidden && (
                              <span className="ml-2 rounded-full bg-gray-400 px-2 py-0.5 text-xs font-semibold text-white">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.maxGuests} guests
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {property.location}, {property.city}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{property.pricePerNight.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {property.hidden ? (
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                          Hidden
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                          Visible
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleVisibility(property.id)}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                          title={property.hidden ? 'Show property' : 'Hide property'}
                        >
                          {property.hidden ? (
                            <Eye className="h-5 w-5" />
                          ) : (
                            <EyeOff className="h-5 w-5" />
                          )}
                        </button>
                        <Link
                          href={`/admin/properties/${property.id}/edit`}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
                          title="Edit property"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                          title="Delete property"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}


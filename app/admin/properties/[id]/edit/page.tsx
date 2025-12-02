'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm from '@/components/PropertyForm';
import { Property } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties?id=${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error || 'Property not found'}</p>
          <Link
            href="/admin"
            className="text-blue-600 hover:underline"
          >
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/admin"
            className="mb-4 inline-flex items-center gap-2 text-blue-100 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold md:text-4xl">Edit Property</h1>
          <p className="mt-2 text-blue-100">Update property details</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <PropertyForm property={property} />
      </div>
    </main>
  );
}


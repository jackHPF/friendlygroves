import { use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPropertyBySlug } from '@/lib/data';
import PropertyDetailClient from './PropertyDetailClient';
import {
  MapPin,
  Users,
  Bed,
  Bath,
} from 'lucide-react';

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <PropertyDetailClient property={property} />
    </main>
  );
}


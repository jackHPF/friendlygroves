'use client';

import Link from 'next/link';
import PropertyForm from '@/components/PropertyForm';
import { ArrowLeft } from 'lucide-react';

export default function NewPropertyPage() {
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
          <h1 className="text-3xl font-bold md:text-4xl">Add New Property</h1>
          <p className="mt-2 text-blue-100">Create a new property listing</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <PropertyForm />
      </div>
    </main>
  );
}


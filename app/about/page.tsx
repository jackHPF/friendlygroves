'use client';

import { useState, useEffect } from 'react';
import AboutContent from '@/components/AboutContent';
import { StaticContent } from '@/types';

export default function AboutPage() {
  const [content, setContent] = useState<StaticContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/static-content')
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            {content?.aboutUs?.title || 'About Friendly Groves'}
          </h1>
          <p className="text-xl text-blue-100">
            {content?.aboutUs?.description || 'Your trusted partner for premium rental accommodations in Visakhapatnam'}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <AboutContent />
        )}

        {/* Why Choose Us */}
        <section className="mb-12 rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">Why Choose Friendly Groves?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  Prime Locations
                </h3>
                <p className="text-gray-700">
                  Our properties are located in the best neighborhoods of Visakhapatnam, 
                  offering easy access to beaches, shopping, dining, and business districts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  Fully Furnished
                </h3>
                <p className="text-gray-700">
                  Every property comes fully furnished with modern amenities including 
                  WiFi, air conditioning, fully equipped kitchens, and more.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  Flexible Stays
                </h3>
                <p className="text-gray-700">
                  Whether you need a place for a few days or several months, we offer 
                  flexible booking options to suit your needs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  24/7 Support
                </h3>
                <p className="text-gray-700">
                  Our dedicated support team is available around the clock to assist 
                  you with any questions or concerns during your stay.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
              <div>
                <h3 className="mb-1 text-xl font-semibold text-gray-900">
                  Competitive Pricing
                </h3>
                <p className="text-gray-700">
                  We offer transparent, competitive pricing with no hidden fees. 
                  Special discounts available for extended stays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Perfect Stay?</h2>
          <p className="mb-6 text-xl text-blue-100">
            Browse our properties and book your ideal accommodation in Visakhapatnam today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/properties"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
            >
              View All Properties
            </a>
            <a
              href="/contact"
              className="rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-600"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}


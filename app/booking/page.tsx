'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Property, BookingRequest } from '@/types';
import { Calendar, User, Mail, Phone, CreditCard } from 'lucide-react';

function BookingPageContent() {
  const searchParams = useSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<BookingRequest>({
    propertyId: searchParams.get('propertyId') || '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1'),
    specialRequests: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (formData.propertyId) {
      const fetchProperty = async () => {
        try {
          const response = await fetch(`/api/properties?id=${formData.propertyId}`);
          if (response.ok) {
            const prop = await response.json();
            setProperty(prop);
          }
        } catch (error) {
          console.error('Error fetching property:', error);
        }
      };
      fetchProperty();
    }
  }, [formData.propertyId]);

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
          <a href="/properties" className="mt-4 text-blue-600 hover:underline">
            Browse all properties
          </a>
        </div>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const days = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * property.pricePerNight;
  };

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(calculateTotalPrice());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        // In production, redirect to payment or confirmation page
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Complete Your Booking</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Guest Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="h-4 w-4" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="guestName"
                      value={formData.guestName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="guestEmail"
                      value={formData.guestEmail}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="guestPhone"
                      value={formData.guestPhone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="+91 1234567890"
                    />
                  </div>

                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Calendar className="h-4 w-4" />
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Any special requests or requirements..."
                    />
                  </div>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="rounded-lg bg-green-50 p-4 text-green-800">
                  Booking request submitted successfully! We'll contact you shortly to confirm.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="rounded-lg bg-red-50 p-4 text-red-800">
                  An error occurred. Please try again or contact us directly.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <CreditCard className="h-5 w-5" />
                {isSubmitting ? 'Processing...' : 'Confirm Booking Request'}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Booking Summary</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">{property.name}</h4>
                <p className="text-sm text-gray-600">{property.location}</p>
              </div>

              <div className="space-y-2 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium text-gray-900">
                    {formData.checkIn ? new Date(formData.checkIn).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium text-gray-900">
                    {formData.checkOut ? new Date(formData.checkOut).toLocaleDateString() : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium text-gray-900">{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-medium text-gray-900">
                    {formData.checkIn && formData.checkOut
                      ? Math.ceil(
                          (new Date(formData.checkOut).getTime() -
                            new Date(formData.checkIn).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      : '-'}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                * Final confirmation subject to availability and payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}


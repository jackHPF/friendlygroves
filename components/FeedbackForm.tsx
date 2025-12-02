'use client';

import { useState } from 'react';
import { ReviewFormData } from '@/types';
import { Star, Send, CheckCircle } from 'lucide-react';

interface FeedbackFormProps {
  propertyId: string;
  propertyName: string;
  guestEmail?: string;
  checkIn?: string;
  checkOut?: string;
  bookingId?: string;
}

export default function FeedbackForm({
  propertyId,
  propertyName,
  guestEmail,
  checkIn,
  checkOut,
  bookingId,
}: FeedbackFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    propertyId,
    guestName: '',
    guestEmail: guestEmail || '',
    guestPhone: '',
    rating: 5,
    comment: '',
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    bookingId,
  });

  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (rating: number) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setSubmitStatus('success');
      setFormData({
        ...formData,
        guestName: '',
        guestEmail: guestEmail || '',
        guestPhone: '',
        rating: 5,
        comment: '',
      });
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`h-8 w-8 ${
                star <= (hoveredStar || formData.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {formData.rating} out of 5
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-2xl font-bold text-gray-900">
        Share Your Experience
      </h3>
      <p className="mb-6 text-gray-600">
        Help other guests by sharing your feedback about your stay at{' '}
        <span className="font-semibold">{propertyName}</span>
      </p>

      {submitStatus === 'success' && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800">
          <CheckCircle className="h-5 w-5" />
          <span>Thank you for your feedback! Your review has been submitted.</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
          {errorMessage || 'Something went wrong. Please try again.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Name *
          </label>
          <input
            type="text"
            name="guestName"
            value={formData.guestName}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            name="guestEmail"
            value={formData.guestEmail}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="your.email@example.com"
          />
        </div>

        {!checkIn && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Check-in Date *
              </label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Check-out Date *
              </label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Rating *
          </label>
          {renderStars()}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Your Review *
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Share your experience, what you liked, and any suggestions..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <Send className="h-5 w-5" />
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}


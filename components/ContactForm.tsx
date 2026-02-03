'use client';

import { useState } from 'react';
import { Send, Mail, Phone, User } from 'lucide-react';

interface ContactFormProps {
  propertyId?: string;
  propertyName?: string;
}

export default function ContactForm({
  propertyId,
  propertyName,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    inquiryType: 'general' as 'general' | 'discount' | 'booking',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          propertyId: propertyId || null,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          inquiryType: 'general',
        });
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-section" className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-2xl font-bold text-gray-900">
        {propertyId ? `Contact us about ${propertyName}` : 'Get in Touch'}
      </h3>
      <p className="mb-6 text-gray-600">
        Have questions or want to request a discount? Fill out the form below
        and we'll get back to you as soon as possible.
      </p>

      {submitStatus === 'success' && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
          Something went wrong. Please try again or contact us directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="inquiryType"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Inquiry Type
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="general">General Inquiry</option>
            <option value="discount">Request Discount</option>
            <option value="booking">Booking Question</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <User className="h-4 w-4" />
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Mail className="h-4 w-4" />
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
          >
            <Phone className="h-4 w-4" />
            Phone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="+91 1234567890"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Tell us about your inquiry, special requests, or questions..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <Send className="h-5 w-5" />
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>

        <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="mb-2 text-sm font-medium text-gray-700">Direct Contact:</p>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            friendlygroves@gmail.com
          </p>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            +91 8007775341
          </p>
        </div>
      </div>
    </div>
  );
}


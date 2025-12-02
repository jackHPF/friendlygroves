'use client';

import { useEffect, useState } from 'react';
import { ContactDetails } from '@/types';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function ContactInfo() {
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact-details')
      .then((res) => res.json())
      .then((data) => {
        setContact(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!contact) {
    return null;
  }

  const addressParts = [
    contact.address.street,
    contact.address.city,
    contact.address.state,
    contact.address.zipCode,
    contact.address.country,
  ].filter(Boolean);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Get in Touch</h2>

      <div className="space-y-6">
        {/* Phone Numbers */}
        {contact.phoneNumbers.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">Phone</h3>
              {contact.phoneNumbers.map((phone, index) => (
                <a
                  key={index}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="block text-gray-600 hover:text-blue-600"
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Email Addresses */}
        {contact.emails.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">Email</h3>
              {contact.emails.map((email, index) => (
                <a
                  key={index}
                  href={`mailto:${email}`}
                  className="block text-blue-600 hover:underline"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-900">Address</h3>
            <p className="text-gray-600">
              {addressParts.join(', ')}
            </p>
          </div>
        </div>

        {/* Business Hours */}
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-900">Business Hours</h3>
            <p className="text-gray-600">
              {contact.businessHours.days}
              <br />
              {contact.businessHours.hours}
            </p>
          </div>
        </div>
      </div>

      {/* Social Media */}
      {contact.socialMedia && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="mb-4 font-semibold text-gray-900">Follow Us</h3>
          <div className="flex gap-4">
            {contact.socialMedia.facebook && (
              <a
                href={contact.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {contact.socialMedia.instagram && (
              <a
                href={contact.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {contact.socialMedia.twitter && (
              <a
                href={contact.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {contact.socialMedia.linkedin && (
              <a
                href={contact.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


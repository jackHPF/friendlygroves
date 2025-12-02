'use client';

import { useState, useEffect } from 'react';
import { ContactDetails } from '@/types';
import { Save, Plus, X, Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function AdminContactPage() {
  const [contact, setContact] = useState<ContactDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/contact');
      if (!response.ok) throw new Error('Failed to fetch contact details');
      const data = await response.json();
      setContact(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contact) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (!response.ok) throw new Error('Failed to save contact details');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addPhone = () => {
    if (newPhone.trim() && contact) {
      setContact({
        ...contact,
        phoneNumbers: [...contact.phoneNumbers, newPhone.trim()],
      });
      setNewPhone('');
    }
  };

  const removePhone = (index: number) => {
    if (contact) {
      setContact({
        ...contact,
        phoneNumbers: contact.phoneNumbers.filter((_, i) => i !== index),
      });
    }
  };

  const addEmail = () => {
    if (newEmail.trim() && contact) {
      setContact({
        ...contact,
        emails: [...contact.emails, newEmail.trim()],
      });
      setNewEmail('');
    }
  };

  const removeEmail = (index: number) => {
    if (contact) {
      setContact({
        ...contact,
        emails: contact.emails.filter((_, i) => i !== index),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return <div className="p-8 text-red-600">Failed to load contact details</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Contact Details Management</h1>
          <p className="text-gray-600">Manage contact information displayed on the contact page</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">
            Contact details saved successfully!
          </div>
        )}

        <div className="space-y-6">
          {/* Phone Numbers */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Phone className="h-5 w-5" />
              Phone Numbers
            </h2>
            <div className="space-y-3">
              {contact.phoneNumbers.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      const updated = [...contact.phoneNumbers];
                      updated[index] = e.target.value;
                      setContact({ ...contact, phoneNumbers: updated });
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => removePhone(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Add new phone number"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPhone();
                    }
                  }}
                />
                <button
                  onClick={addPhone}
                  className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Email Addresses */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Mail className="h-5 w-5" />
              Email Addresses
            </h2>
            <div className="space-y-3">
              {contact.emails.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      const updated = [...contact.emails];
                      updated[index] = e.target.value;
                      setContact({ ...contact, emails: updated });
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => removeEmail(index)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Add new email address"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                />
                <button
                  onClick={addEmail}
                  className="flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <MapPin className="h-5 w-5" />
              Address
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Street</label>
                <input
                  type="text"
                  value={contact.address.street || ''}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, street: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">City *</label>
                <input
                  type="text"
                  value={contact.address.city}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, city: e.target.value },
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">State *</label>
                <input
                  type="text"
                  value={contact.address.state}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, state: e.target.value },
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Country *</label>
                <input
                  type="text"
                  value={contact.address.country}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, country: e.target.value },
                    })
                  }
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Zip Code</label>
                <input
                  type="text"
                  value={contact.address.zipCode || ''}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      address: { ...contact.address, zipCode: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
              <Clock className="h-5 w-5" />
              Business Hours
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Days</label>
                <input
                  type="text"
                  value={contact.businessHours.days}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      businessHours: { ...contact.businessHours, days: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., Monday - Sunday"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Hours</label>
                <input
                  type="text"
                  value={contact.businessHours.hours}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      businessHours: { ...contact.businessHours, hours: e.target.value },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g., 9:00 AM - 8:00 PM IST"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Social Media Links</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Facebook className="h-4 w-4" />
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={contact.socialMedia?.facebook || ''}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        facebook: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Instagram className="h-4 w-4" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={contact.socialMedia?.instagram || ''}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Twitter className="h-4 w-4" />
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={contact.socialMedia?.twitter || ''}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        twitter: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={contact.socialMedia?.linkedin || ''}
                  onChange={(e) =>
                    setContact({
                      ...contact,
                      socialMedia: {
                        ...contact.socialMedia,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


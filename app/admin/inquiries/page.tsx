'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, User, Calendar, MessageSquare, CheckCircle, XCircle, Filter } from 'lucide-react';
import { ContactInquiry } from '@/types';

export default function InquiriesPage() {
  const [allInquiries, setAllInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllInquiries();
  }, []);

  const fetchAllInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/inquiries');
      if (response.ok) {
        const data = await response.json();
        // Sort by most recent first
        const sorted = data.sort((a: ContactInquiry, b: ContactInquiry) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAllInquiries(sorted);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter inquiries based on selected filter
  const inquiries = filter === 'all' 
    ? allInquiries 
    : allInquiries.filter(inq => inq.status === filter);

  const handleStatusChange = async (inquiryId: string, newStatus: 'open' | 'closed') => {
    try {
      setUpdatingId(inquiryId);
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inquiryId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // Refresh inquiries
        await fetchAllInquiries();
      } else {
        alert('Failed to update inquiry status');
      }
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      alert('Error updating inquiry status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getInquiryTypeBadge = (type: string) => {
    const colors = {
      general: 'bg-blue-100 text-blue-800',
      discount: 'bg-yellow-100 text-yellow-800',
      booking: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[type as keyof typeof colors] || colors.general}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Contact Inquiries</h1>
          <p className="mt-2 text-gray-600">Manage and respond to customer inquiries</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'open'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Open ({inquiries.filter(i => i.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'closed'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Closed ({inquiries.filter(i => i.status === 'closed').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({inquiries.length})
          </button>
        </div>

        {/* Inquiries List */}
        {inquiries.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No inquiries found</h3>
            <p className="mt-2 text-gray-600">
              {filter === 'open' 
                ? 'All inquiries have been closed.' 
                : 'No inquiries match the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className={`rounded-lg bg-white p-6 shadow transition-all ${
                  inquiry.status === 'open' ? 'border-l-4 border-blue-600' : 'border-l-4 border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {inquiry.status === 'open' ? (
                          <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                        ) : (
                          <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{inquiry.name}</h3>
                      </div>
                      {getInquiryTypeBadge(inquiry.inquiryType)}
                      {inquiry.status === 'open' ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                          Open
                        </span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                          Closed
                        </span>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-blue-600">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${inquiry.phone}`} className="hover:text-blue-600">
                          {inquiry.phone}
                        </a>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4 rounded-lg bg-gray-50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700">{inquiry.message}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Received: {formatDate(inquiry.createdAt)}
                      </div>
                      {inquiry.closedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Closed: {formatDate(inquiry.closedAt)}
                        </div>
                      )}
                      {inquiry.propertyId && (
                        <div className="text-blue-600">
                          Property ID: {inquiry.propertyId}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-4 flex flex-col gap-2">
                    {inquiry.status === 'open' ? (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'closed')}
                        disabled={updatingId === inquiry.id}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === inquiry.id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Closing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Close Inquiry
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(inquiry.id, 'open')}
                        disabled={updatingId === inquiry.id}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingId === inquiry.id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Opening...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            Reopen Inquiry
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


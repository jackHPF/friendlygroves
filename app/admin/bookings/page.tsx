'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, User, Calendar, CreditCard, CheckCircle, XCircle, Clock, Filter, Home } from 'lucide-react';
import { Booking } from '@/types';

export default function BookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Record<string, { name: string; location: string }>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAllBookings();
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties?admin=true');
      if (response.ok) {
        const data = await response.json();
        const propsMap: Record<string, { name: string; location: string }> = {};
        data.forEach((prop: any) => {
          propsMap[prop.id] = { name: prop.name, location: prop.location };
        });
        setProperties(propsMap);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings');
      if (response.ok) {
        const data = await response.json();
        // Sort by most recent first
        const sorted = data.sort((a: Booking, b: Booking) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAllBookings(sorted);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings based on selected filter
  const bookings = filter === 'all' 
    ? allBookings 
    : allBookings.filter(booking => booking.status === filter);

  const handleStatusChange = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      setUpdatingId(bookingId);
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      });

      if (response.ok) {
        // Refresh bookings
        await fetchAllBookings();
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[status as keyof typeof colors] || colors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="mt-2 text-gray-600">Manage and track all property bookings</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'all'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({allBookings.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'pending'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending ({allBookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'confirmed'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Confirmed ({allBookings.filter(b => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 font-medium transition-colors ${
              filter === 'cancelled'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cancelled ({allBookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-2 text-gray-600">
              {filter === 'all' 
                ? 'No bookings have been made yet.' 
                : `No ${filter} bookings found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const property = properties[booking.propertyId];
              const nights = calculateNights(booking.checkIn, booking.checkOut);
              
              return (
                <div
                  key={booking.id}
                  className={`rounded-lg bg-white p-6 shadow transition-all ${
                    booking.status === 'pending' 
                      ? 'border-l-4 border-yellow-600' 
                      : booking.status === 'confirmed'
                      ? 'border-l-4 border-green-600'
                      : 'border-l-4 border-red-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="mb-4 flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          {booking.status === 'pending' && (
                            <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
                          )}
                          {booking.status === 'confirmed' && (
                            <div className="h-3 w-3 rounded-full bg-green-600"></div>
                          )}
                          {booking.status === 'cancelled' && (
                            <div className="h-3 w-3 rounded-full bg-red-600"></div>
                          )}
                          <h3 className="text-lg font-semibold text-gray-900">{booking.guestName}</h3>
                        </div>
                        {getStatusBadge(booking.status)}
                        {property && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Home className="h-4 w-4" />
                            <span>{property.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Guest Info */}
                      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${booking.guestEmail}`} className="hover:text-blue-600">
                            {booking.guestEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${booking.guestPhone}`} className="hover:text-blue-600">
                            {booking.guestPhone}
                          </a>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <span className="font-medium text-gray-900">Check-in:</span>{' '}
                            {formatDate(booking.checkIn)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <span className="font-medium text-gray-900">Check-out:</span>{' '}
                            {formatDate(booking.checkOut)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <div>
                            <span className="font-medium text-gray-900">Guests:</span>{' '}
                            {booking.guests}
                          </div>
                        </div>
                      </div>

                      {/* Price and Nights */}
                      <div className="mb-4 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium text-gray-900">Total:</span>{' '}
                          {formatCurrency(booking.totalPrice)}
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium text-gray-900">Nights:</span> {nights}
                        </div>
                      </div>

                      {/* Special Requests */}
                      {booking.specialRequests && (
                        <div className="mb-4 rounded-lg bg-gray-50 p-4">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Special Requests:
                          </div>
                          <p className="whitespace-pre-wrap text-sm text-gray-700">{booking.specialRequests}</p>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Created: {formatDateTime(booking.createdAt)}
                        </div>
                        {property && (
                          <div className="text-blue-600">
                            Location: {property.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="ml-4 flex flex-col gap-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            disabled={updatingId === booking.id}
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {updatingId === booking.id ? (
                              <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Confirm
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            disabled={updatingId === booking.id}
                            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          disabled={updatingId === booking.id}
                          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === booking.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Cancel Booking
                            </>
                          )}
                        </button>
                      )}
                      {booking.status === 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'pending')}
                          disabled={updatingId === booking.id}
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {updatingId === booking.id ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                              Reopening...
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              Reopen
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


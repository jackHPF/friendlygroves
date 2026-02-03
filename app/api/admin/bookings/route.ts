import { NextResponse } from 'next/server';
import { getAllBookings } from '@/lib/data';

export async function GET() {
  try {
    console.log('GET /api/admin/bookings: Fetching all bookings...');
    // Clear cache to ensure fresh data
    const { clearBookingsCache } = await import('@/lib/data');
    clearBookingsCache();
    
    const bookings = await getAllBookings();
    console.log(`GET /api/admin/bookings: Found ${bookings.length} bookings`);
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Missing bookingId or status' },
        { status: 400 }
      );
    }

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, confirmed, or cancelled' },
        { status: 400 }
      );
    }

    const { updateBookingStatus } = await import('@/lib/data');
    const updatedBooking = await updateBookingStatus(bookingId, status as 'pending' | 'confirmed' | 'cancelled');

    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}


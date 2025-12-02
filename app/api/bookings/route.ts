import { NextResponse } from 'next/server';
import { BookingRequest } from '@/types';
import { checkAvailability, createBooking } from '@/lib/data';

export async function POST(request: Request) {
  try {
    const bookingData: BookingRequest = await request.json();

    // Validate required fields
    if (
      !bookingData.propertyId ||
      !bookingData.guestName ||
      !bookingData.guestEmail ||
      !bookingData.guestPhone ||
      !bookingData.checkIn ||
      !bookingData.checkOut ||
      !bookingData.guests
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check availability
    const available = await checkAvailability(
      bookingData.propertyId,
      bookingData.checkIn,
      bookingData.checkOut
    );

    if (!available) {
      return NextResponse.json(
        { error: 'Property not available for selected dates' },
        { status: 409 }
      );
    }

    // In production, save to database
    // For now, just return success
    // TODO: Integrate with database (MongoDB/PostgreSQL)
    // TODO: Send confirmation email
    // TODO: Integrate payment gateway

    // Calculate total price
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const { getPropertyById } = await import('@/lib/data');
    const property = await getPropertyById(bookingData.propertyId);
    const totalPrice = property ? nights * property.pricePerNight : 0;

    const booking = await createBooking({
      ...bookingData,
      status: 'pending' as const,
      totalPrice,
    });

    return NextResponse.json(
      {
        message: 'Booking request submitted successfully',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


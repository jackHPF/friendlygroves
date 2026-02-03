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

    // Check for duplicate bookings (same guest, property, and dates within last 5 minutes)
    // Temporarily disabled to debug booking creation issue
    // try {
    //   const { getAllBookings } = await import('@/lib/data');
    //   const allBookings = await getAllBookings();
    //   const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    //   
    //   const duplicateBooking = allBookings.find(booking => 
    //     booking.propertyId === bookingData.propertyId &&
    //     booking.guestEmail === bookingData.guestEmail &&
    //     booking.checkIn === bookingData.checkIn &&
    //     booking.checkOut === bookingData.checkOut &&
    //     new Date(booking.createdAt) > new Date(fiveMinutesAgo)
    //   );
    //
    //   if (duplicateBooking) {
    //     return NextResponse.json(
    //       { error: 'A booking request for these dates has already been submitted. Please wait a few minutes before submitting again.' },
    //       { status: 409 }
    //     );
    //   }
    // } catch (error) {
    //   // If duplicate check fails, log but continue (don't block booking creation)
    //   console.warn('Error checking for duplicate bookings:', error);
    // }

    // In production, save to database
    // For now, just return success
    // TODO: Integrate with database (MongoDB/PostgreSQL)
    // TODO: Send confirmation email
    // TODO: Integrate payment gateway

    // Calculate total price
    console.log('Calculating total price...');
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log(`Nights: ${nights}`);
    
    const { getPropertyById } = await import('@/lib/data');
    const property = await getPropertyById(bookingData.propertyId);
    console.log('Property found:', property ? property.name : 'NOT FOUND');
    
    const totalPrice = property ? nights * property.pricePerNight : 0;
    console.log(`Total price: ${totalPrice}`);

    console.log('Creating booking...');
    const booking = await createBooking({
      ...bookingData,
      status: 'pending' as const,
      totalPrice,
    });

    console.log('Booking created successfully:', booking.id);
    console.log('Booking data:', JSON.stringify(booking, null, 2));
    
    return NextResponse.json(
      {
        message: 'Booking request submitted successfully',
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}


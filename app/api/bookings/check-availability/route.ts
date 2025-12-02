import { NextRequest, NextResponse } from 'next/server';
import { checkAvailability } from '@/lib/data';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { propertyId, checkIn, checkOut } = data;

    if (!propertyId || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const available = await checkAvailability(propertyId, checkIn, checkOut);

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


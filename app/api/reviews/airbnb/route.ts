import { NextRequest, NextResponse } from 'next/server';
import { Review } from '@/types';
import { createReview, getPropertyById } from '@/lib/data';

// This endpoint allows manual import of Airbnb reviews
// In production, you could integrate with Airbnb API or use web scraping
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.propertyId ||
      !data.guestName ||
      !data.rating ||
      !data.comment
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify property exists
    const property = await getPropertyById(data.propertyId);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const newReview: Review = {
      id: '', // Will be generated
      propertyId: data.propertyId,
      source: 'airbnb',
      guestName: data.guestName,
      guestAvatar: data.guestAvatar,
      rating: data.rating,
      comment: data.comment,
      stayDate: data.stayDate,
      verified: data.verified || true, // Airbnb reviews are typically verified
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: undefined,
    };

    const review = await createReview(newReview);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error importing Airbnb review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { Review, ReviewFormData } from '@/types';
import { createReview, getReviewsByPropertyId, getAllReviews } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (propertyId) {
      const reviews = await getReviewsByPropertyId(propertyId);
      return NextResponse.json(reviews);
    }

    const allReviews = await getAllReviews();
    return NextResponse.json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ReviewFormData = await request.json();

    // Validate required fields
    if (
      !data.propertyId ||
      !data.guestName ||
      !data.guestEmail ||
      !data.rating ||
      !data.comment ||
      !data.checkIn ||
      !data.checkOut
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const newReview: Review = {
      id: '', // Will be generated
      propertyId: data.propertyId,
      source: 'customer',
      guestName: data.guestName,
      rating: data.rating,
      comment: data.comment,
      stayDate: data.checkIn,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      verified: false,
      createdAt: '',
      updatedAt: undefined,
    };

    const review = await createReview(newReview);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


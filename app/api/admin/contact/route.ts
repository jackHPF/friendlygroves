import { NextRequest, NextResponse } from 'next/server';
import { getContactDetails, updateContactDetails } from '@/lib/admin-data';
import { ContactDetails } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const contact = await getContactDetails();
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error fetching contact details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates: Partial<ContactDetails> = await request.json();
    const updated = await updateContactDetails(updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating contact details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


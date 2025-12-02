import { NextResponse } from 'next/server';
import { getContactDetails } from '@/lib/admin-data';

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


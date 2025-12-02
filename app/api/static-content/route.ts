import { NextResponse } from 'next/server';
import { getStaticContent } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const content = await getStaticContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching static content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


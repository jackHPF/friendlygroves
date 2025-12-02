import { NextRequest, NextResponse } from 'next/server';
import { getStaticContent, updateStaticContent } from '@/lib/admin-data';
import { StaticContent } from '@/types';

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

export async function PUT(request: NextRequest) {
  try {
    const updates: Partial<StaticContent> = await request.json();
    const updated = await updateStaticContent(updates);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating static content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


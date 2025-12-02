import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, getAdminProfile, updateAdminProfile } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminPassword(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update last login
    const admin = await getAdminProfile();
    if (admin) {
      await updateAdminProfile({ lastLogin: new Date().toISOString() });
    }

    // In production, use JWT tokens or sessions
    // For now, return success (client should store session)
    return NextResponse.json({ success: true, username });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


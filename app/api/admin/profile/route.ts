import { NextRequest, NextResponse } from 'next/server';
import { getAdminProfile, updateAdminProfile } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAdminProfile();
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin profile not found' },
        { status: 404 }
      );
    }

    // Don't return password hash
    const { passwordHash, ...adminWithoutPassword } = admin;
    return NextResponse.json(adminWithoutPassword);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();

    // If password is provided, it will be hashed in updateAdminProfile
    const updated = await updateAdminProfile(updates);

    // Don't return password hash
    const { passwordHash, ...adminWithoutPassword } = updated;
    return NextResponse.json(adminWithoutPassword);
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


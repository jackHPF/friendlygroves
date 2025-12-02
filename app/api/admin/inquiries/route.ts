import { NextResponse } from 'next/server';
import { getAllContactInquiries, getOpenContactInquiries, updateContactInquiryStatus } from '@/lib/contact-storage';

export const dynamic = 'force-dynamic';

// GET all inquiries or open inquiries only
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    if (status === 'open') {
      const inquiries = await getOpenContactInquiries();
      return NextResponse.json(inquiries);
    }
    
    const inquiries = await getAllContactInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH to update inquiry status
export async function PATCH(request: Request) {
  try {
    const { inquiryId, status } = await request.json();
    
    if (!inquiryId || !status) {
      return NextResponse.json(
        { error: 'Missing inquiryId or status' },
        { status: 400 }
      );
    }
    
    if (status !== 'open' && status !== 'closed') {
      return NextResponse.json(
        { error: 'Status must be "open" or "closed"' },
        { status: 400 }
      );
    }
    
    const updatedInquiry = await updateContactInquiryStatus(inquiryId, status);
    
    if (!updatedInquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Inquiry status updated successfully',
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


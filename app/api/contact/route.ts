import { NextResponse } from 'next/server';
import { ContactInquiry } from '@/types';
import { saveContactInquiry } from '@/lib/contact-storage';
import { getContactDetails } from '@/lib/admin-data';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const inquiryData = await request.json();

    // Validate required fields
    if (
      !inquiryData.name ||
      !inquiryData.email ||
      !inquiryData.phone ||
      !inquiryData.message
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const inquiry: ContactInquiry = {
      id: `inquiry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      propertyId: inquiryData.propertyId || undefined,
      message: inquiryData.message,
      inquiryType: inquiryData.inquiryType || 'general',
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    // Save inquiry to persistent storage
    await saveContactInquiry(inquiry);

    // Get contact details to send email notification
    try {
      const contactDetails = await getContactDetails();
      const recipientEmails = contactDetails.emails || ['info@friendlygroves.co.in'];
      
      // Log the inquiry (in production, send email here)
      console.log('=== NEW CONTACT INQUIRY ===');
      console.log('To:', recipientEmails.join(', '));
      console.log('Subject:', `New ${inquiry.inquiryType} inquiry from ${inquiry.name}`);
      console.log('From:', inquiry.email);
      console.log('Phone:', inquiry.phone);
      console.log('Message:', inquiry.message);
      console.log('Property ID:', inquiry.propertyId || 'N/A');
      console.log('==========================');

      // TODO: Uncomment and configure email service when ready
      // Example with SendGrid:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send({
      //   to: recipientEmails,
      //   from: 'noreply@friendlygroves.co.in',
      //   subject: `New ${inquiry.inquiryType} inquiry from ${inquiry.name}`,
      //   html: `
      //     <h2>New Contact Inquiry</h2>
      //     <p><strong>Name:</strong> ${inquiry.name}</p>
      //     <p><strong>Email:</strong> ${inquiry.email}</p>
      //     <p><strong>Phone:</strong> ${inquiry.phone}</p>
      //     <p><strong>Inquiry Type:</strong> ${inquiry.inquiryType}</p>
      //     ${inquiry.propertyId ? `<p><strong>Property ID:</strong> ${inquiry.propertyId}</p>` : ''}
      //     <p><strong>Message:</strong></p>
      //     <p>${inquiry.message}</p>
      //   `,
      // });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Inquiry submitted successfully. We will get back to you soon!',
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing contact inquiry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve inquiries (for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    
    const { getAllContactInquiries, getContactInquiriesByPropertyId } = await import('@/lib/contact-storage');
    
    if (propertyId) {
      const inquiries = await getContactInquiriesByPropertyId(propertyId);
      return NextResponse.json(inquiries);
    }
    
    const inquiries = await getAllContactInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching contact inquiries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



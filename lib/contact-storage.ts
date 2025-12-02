import { readJsonFile, writeJsonFile } from './storage';
import { ContactInquiry } from '@/types';

const CONTACT_INQUIRIES_FILE = 'contact-inquiries.json';

export async function getAllContactInquiries(): Promise<ContactInquiry[]> {
  return readJsonFile<ContactInquiry[]>(CONTACT_INQUIRIES_FILE, []);
}

export async function getOpenContactInquiries(): Promise<ContactInquiry[]> {
  const inquiries = await getAllContactInquiries();
  return inquiries.filter(inquiry => inquiry.status === 'open');
}

export async function saveContactInquiry(inquiry: ContactInquiry): Promise<void> {
  const inquiries = await getAllContactInquiries();
  inquiries.push(inquiry);
  await writeJsonFile(CONTACT_INQUIRIES_FILE, inquiries);
}

export async function getContactInquiriesByPropertyId(propertyId: string): Promise<ContactInquiry[]> {
  const inquiries = await getAllContactInquiries();
  return inquiries.filter(inquiry => inquiry.propertyId === propertyId);
}

export async function updateContactInquiryStatus(
  inquiryId: string,
  status: 'open' | 'closed'
): Promise<ContactInquiry | null> {
  const inquiries = await getAllContactInquiries();
  const inquiryIndex = inquiries.findIndex(inq => inq.id === inquiryId);
  
  if (inquiryIndex === -1) {
    return null;
  }
  
  inquiries[inquiryIndex] = {
    ...inquiries[inquiryIndex],
    status,
    closedAt: status === 'closed' ? new Date().toISOString() : undefined,
  };
  
  await writeJsonFile(CONTACT_INQUIRIES_FILE, inquiries);
  return inquiries[inquiryIndex];
}


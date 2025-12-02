import { readJsonFile, writeJsonFile } from './storage';
import { ContactDetails, StaticContent, AdminProfile } from '@/types';
import crypto from 'crypto';

// Password hashing utilities (simple SHA-256 for now - in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
}

// Contact Details
export async function getContactDetails(): Promise<ContactDetails> {
  const defaultContact: ContactDetails = {
    id: 'contact-1',
    phoneNumbers: ['+91 XXXXX XXXXX', '+91 XXXXX XXXXX'],
    emails: ['info@friendlygroves.co.in', 'bookings@friendlygroves.co.in'],
    address: {
      city: 'Visakhapatnam',
      state: 'Andhra Pradesh',
      country: 'India',
    },
    businessHours: {
      days: 'Monday - Sunday',
      hours: '9:00 AM - 8:00 PM IST',
    },
    updatedAt: new Date().toISOString(),
  };

  try {
    return await readJsonFile<ContactDetails>('contact.json', defaultContact);
  } catch (error) {
    console.error('Error getting contact details:', error);
    return defaultContact;
  }
}

export async function updateContactDetails(updates: Partial<ContactDetails>): Promise<ContactDetails> {
  const current = await getContactDetails();
  const updated: ContactDetails = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile('contact.json', updated);
  return updated;
}

// Static Content
export async function getStaticContent(): Promise<StaticContent> {
  const defaultContent: StaticContent = {
    id: 'content-1',
    aboutUs: {
      title: 'About Friendly Groves',
      description: 'Your trusted partner for premium rental accommodations in Visakhapatnam',
    },
    ourStory: {
      title: 'Our Story',
      content: `Welcome to Friendly Groves, your premier destination for exceptional rental accommodations in the beautiful city of Visakhapatnam (Vizag). We are dedicated to providing you with comfortable, well-maintained properties that feel like home, whether you're visiting for a short vacation or an extended stay.

Founded with a vision to make quality accommodation accessible to everyone, Friendly Groves has grown to become one of the most trusted names in Vizag's rental market. We understand that finding the perfect place to stay is crucial to your experience, and that's why we carefully curate each property to ensure it meets our high standards of comfort, cleanliness, and convenience.

Our properties are strategically located across Visakhapatnam, from the bustling city center to serene beachfront locations. Each property is fully furnished and equipped with modern amenities to make your stay as comfortable as possible. Whether you're traveling for business, leisure, or relocating to Vizag, we have the perfect accommodation waiting for you.`,
    },
    whatWeStandFor: {
      title: 'What We Stand For',
      values: [
        {
          title: 'Quality Homes',
          description: 'Every property is carefully selected and maintained to ensure the highest standards of quality and comfort.',
          icon: 'Home',
        },
        {
          title: 'Customer First',
          description: "Your satisfaction is our priority. We're committed to providing exceptional service and support throughout your stay.",
          icon: 'Users',
        },
        {
          title: 'Trusted Service',
          description: "With years of experience in the hospitality industry, we've built a reputation for reliability and trustworthiness.",
          icon: 'Award',
        },
        {
          title: 'Local Expertise',
          description: 'As locals, we know Vizag inside out and can help you discover the best the city has to offer.',
          icon: 'Heart',
        },
      ],
    },
    updatedAt: new Date().toISOString(),
  };

  try {
    return await readJsonFile<StaticContent>('static-content.json', defaultContent);
  } catch (error) {
    console.error('Error getting static content:', error);
    return defaultContent;
  }
}

export async function updateStaticContent(updates: Partial<StaticContent>): Promise<StaticContent> {
  const current = await getStaticContent();
  const updated: StaticContent = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile('static-content.json', updated);
  return updated;
}

// Admin Profile & Authentication
export async function getAdminProfile(): Promise<AdminProfile | null> {
  const defaultAdmin: AdminProfile = {
    id: 'admin-1',
    username: 'admin',
    passwordHash: hashPassword('admin123'), // Default password - should be changed!
    email: 'admin@friendlygroves.co.in',
    name: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    return await readJsonFile<AdminProfile>('admin.json', defaultAdmin);
  } catch (error) {
    // If file doesn't exist or error reading, create with default
    console.error('Error reading admin profile, creating default:', error);
    try {
      await writeJsonFile('admin.json', defaultAdmin);
      return defaultAdmin;
    } catch (writeError) {
      console.error('Error writing default admin profile:', writeError);
      // Return default even if write fails
      return defaultAdmin;
    }
  }
}

export async function updateAdminProfile(updates: Partial<AdminProfile>): Promise<AdminProfile> {
  const current = await getAdminProfile();
  if (!current) {
    throw new Error('Admin profile not found');
  }

  const updated: AdminProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // If password is being updated, hash it
  if (updates.passwordHash && !updates.passwordHash.startsWith('$2')) {
    updated.passwordHash = hashPassword(updates.passwordHash);
  }

  await writeJsonFile('admin.json', updated);
  return updated;
}

export async function verifyAdminPassword(username: string, password: string): Promise<boolean> {
  const admin = await getAdminProfile();
  if (!admin || admin.username !== username) {
    return false;
  }

  return verifyPassword(password, admin.passwordHash);
}


import { Property, Review, Booking } from '@/types';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Use /tmp for Vercel (writable) or data/ for other platforms
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
const DATA_DIR = IS_VERCEL 
  ? path.join('/tmp', 'friendlygroves-data')
  : path.join(process.cwd(), 'data');

const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    if (!existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  } catch (error: any) {
    // On Vercel or read-only filesystems, this might fail
    // We'll handle it gracefully in read/write functions
    console.warn('Could not create data directory (read-only filesystem?):', error.message);
  }
}

// Generic JSON file read/write functions
export async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  // Try KV first (for Vercel production)
  try {
    const { readKV } = await import('./kv-storage');
    const kvData = await readKV<T>(filename, defaultValue);
    // If KV returns non-default data or KV is configured, use it
    if (process.env.KV_REST_API_URL && (kvData !== defaultValue || JSON.stringify(kvData) !== JSON.stringify(defaultValue))) {
      return kvData;
    }
  } catch (error) {
    // KV not configured or error, fall back to file storage
    console.log('KV not available for readJsonFile, using file storage');
  }

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
  } catch (error) {
    // If we can't create directory, return default (read-only filesystem)
    return defaultValue;
  }
  
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, try to create it (might fail on read-only FS)
      try {
        await writeJsonFile(filename, defaultValue);
      } catch (writeError) {
        // If write fails (read-only), just return default
        console.warn(`Could not create ${filename} (read-only filesystem), using defaults`);
      }
      return defaultValue;
    }
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  // Try KV first (for Vercel production)
  try {
    const { writeKV } = await import('./kv-storage');
    await writeKV(filename, data);
    // If KV save succeeds, also try to save to file (for local backup)
    // but don't fail if file save fails
  } catch (error) {
    // KV not configured or error, fall back to file storage
    console.log('KV not available for writeJsonFile, using file storage');
  }

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
  } catch (error) {
    // If we can't create directory, this is likely a read-only filesystem
    console.warn(`Cannot write ${filename} - read-only filesystem (Vercel serverless). KV storage is recommended for production.`);
    // Don't throw - allow app to continue in read-only mode
    return;
  }
  
  const filePath = path.join(DATA_DIR, filename);
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error: any) {
    // On Vercel, writes to /tmp work but don't persist across deployments
    // Don't throw - log warning and continue
    if (error.code === 'EACCES' || error.code === 'EROFS') {
      console.warn(`Cannot write ${filename} - read-only filesystem. KV storage is recommended for production.`);
      return;
    }
    console.error(`Error writing ${filename}:`, error);
    // Only throw if it's not a filesystem permission error
    if (error.code !== 'EACCES' && error.code !== 'EROFS') {
      throw error;
    }
  }
}

// Load properties from JSON file or KV
export async function loadProperties(): Promise<Property[]> {
  // Try KV first (for Vercel production)
  const isKVConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  
  if (isKVConfigured) {
    try {
      const { loadPropertiesFromKV } = await import('./kv-storage');
      const kvProperties = await loadPropertiesFromKV();
      // If KV is configured, always use KV data (even if empty)
      return kvProperties;
    } catch (error) {
      console.error('Error loading from KV, falling back to file storage:', error);
      // Fall through to file storage
    }
  }
  
  // Fall back to file storage (for local development or if KV not configured)
  try {
    console.log('Loading from file storage (KV not configured or failed)');
    await ensureDataDir();
    if (!existsSync(PROPERTIES_FILE)) {
      return [];
    }
    const data = await readFile(PROPERTIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading properties:', error);
    return [];
  }
}

// Save properties to KV or JSON file
export async function saveProperties(properties: Property[]): Promise<void> {
  const isKVConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
  
  // Try KV first (for Vercel production)
  if (isKVConfigured) {
    try {
      const { savePropertiesToKV } = await import('./kv-storage');
      await savePropertiesToKV(properties);
      console.log(`✅ Successfully saved ${properties.length} properties to KV`);
      // If KV save succeeds, return early (don't save to file on Vercel)
      return;
    } catch (error) {
      console.error('❌ Error saving to KV:', error);
      // On Vercel, if KV fails, we can't save to file storage (read-only)
      if (isVercel) {
        throw new Error('Failed to save to KV and file storage is not available on Vercel. Please check KV configuration.');
      }
      // Fall through to file storage as backup (local dev only)
    }
  }
  
  // Fall back to file storage (for local development only)
  if (isVercel && !isKVConfigured) {
    console.error('❌ Cannot save properties on Vercel without KV configured. Data will not persist.');
    throw new Error('Vercel KV is not configured. Please set up KV storage (see VERCEL_KV_SETUP.md)');
  }
  
  console.log('Saving to file storage (local development)');

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
    await writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf-8');
  } catch (error: any) {
    // On Vercel, writes might fail due to read-only filesystem
    if (error.code === 'EACCES' || error.code === 'EROFS') {
      console.warn('Cannot save properties - read-only filesystem. KV storage is recommended for production.');
      return;
    }
    console.error('Error saving properties:', error);
    // Only throw if it's not a filesystem permission error
    if (error.code !== 'EACCES' && error.code !== 'EROFS') {
      throw error;
    }
  }
}

// Load reviews from KV or JSON file
export async function loadReviews(): Promise<Review[]> {
  // Try KV first (for Vercel production)
  try {
    const { loadReviewsFromKV } = await import('./kv-storage');
    const kvReviews = await loadReviewsFromKV();
    if (kvReviews.length > 0 || process.env.KV_REST_API_URL) {
      return kvReviews;
    }
  } catch (error) {
    // KV not configured or error, fall back to file storage
    console.log('KV not available, using file storage');
  }

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
    if (!existsSync(REVIEWS_FILE)) {
      return [];
    }
    const data = await readFile(REVIEWS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading reviews:', error);
    return [];
  }
}

// Save reviews to KV or JSON file
export async function saveReviews(reviews: Review[]): Promise<void> {
  // Try KV first (for Vercel production)
  try {
    const { saveReviewsToKV } = await import('./kv-storage');
    await saveReviewsToKV(reviews);
  } catch (error) {
    // KV not configured or error, fall back to file storage
    console.log('KV not available, using file storage');
  }

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
    await writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (error: any) {
    // On Vercel, writes might fail due to read-only filesystem
    if (error.code === 'EACCES' || error.code === 'EROFS') {
      console.warn('Cannot save reviews - read-only filesystem. KV storage is recommended for production.');
      return;
    }
    console.error('Error saving reviews:', error);
    // Only throw if it's not a filesystem permission error
    if (error.code !== 'EACCES' && error.code !== 'EROFS') {
      throw error;
    }
  }
}

// Load bookings from KV or JSON file
export async function loadBookings(): Promise<Booking[]> {
  // Try KV first (for Vercel production)
  try {
    const { loadBookingsFromKV } = await import('./kv-storage');
    const kvBookings = await loadBookingsFromKV();
    if (kvBookings.length > 0 || process.env.KV_REST_API_URL) {
      return kvBookings;
    }
  } catch (error) {
    // KV not configured or error, fall back to file storage
    console.log('KV not available, using file storage');
  }

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
    if (!existsSync(BOOKINGS_FILE)) {
      return [];
    }
    const data = await readFile(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
}

// Save bookings to KV or JSON file
export async function saveBookings(bookings: Booking[]): Promise<void> {
  // Try KV first (for Vercel production)
  try {
    const { saveBookingsToKV } = await import('./kv-storage');
    await saveBookingsToKV(bookings);
  } catch (error) {
    // KV not configured or error, fall back to file storage
    console.log('KV not available, using file storage');
  }

  // Fall back to file storage (for local development)
  try {
    await ensureDataDir();
    await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error: any) {
    // On Vercel, writes might fail due to read-only filesystem
    if (error.code === 'EACCES' || error.code === 'EROFS') {
      console.warn('Cannot save bookings - read-only filesystem. KV storage is recommended for production.');
      return;
    }
    console.error('Error saving bookings:', error);
    // Only throw if it's not a filesystem permission error
    if (error.code !== 'EACCES' && error.code !== 'EROFS') {
      throw error;
    }
  }
}


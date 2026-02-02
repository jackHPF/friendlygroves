import { Property, Review, Booking } from '@/types';

// Vercel KV storage adapter for persistent data storage
// This replaces file-based storage on Vercel

const KV_PREFIX = 'friendlygroves:';

// Lazy load KV to handle cases where package isn't installed
let kvClient: any = null;

async function getKVClient() {
  if (kvClient !== null) {
    return kvClient;
  }

  try {
    const kvModule = await import('@vercel/kv');
    kvClient = kvModule.kv;
    return kvClient;
  } catch (error) {
    console.warn('@vercel/kv not available:', error);
    return null;
  }
}

// Check if Vercel KV is configured
function isKVConfigured(): boolean {
  return !!(
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  );
}

// Generic KV read/write functions
export async function readKV<T>(key: string, defaultValue: T): Promise<T> {
  if (!isKVConfigured()) {
    return defaultValue;
  }

  try {
    const kv = await getKVClient();
    if (!kv) {
      return defaultValue;
    }

    const fullKey = `${KV_PREFIX}${key}`;
    const data = await kv.get(fullKey) as T | null;
    return data ?? defaultValue;
  } catch (error) {
    console.error(`Error reading KV key ${key}:`, error);
    return defaultValue;
  }
}

export async function writeKV<T>(key: string, data: T): Promise<void> {
  if (!isKVConfigured()) {
    const error = new Error(`KV not configured, cannot write ${key}. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.`);
    console.error(error.message);
    throw error;
  }

  try {
    const kv = await getKVClient();
    if (!kv) {
      const error = new Error('KV client not available. @vercel/kv package may not be installed or KV connection failed.');
      console.error(error.message);
      throw error;
    }

    const fullKey = `${KV_PREFIX}${key}`;
    console.log(`Writing to KV: ${fullKey} (data size: ${JSON.stringify(data).length} bytes)`);
    await kv.set(fullKey, data);
    console.log(`✅ Successfully wrote to KV: ${fullKey}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error(`❌ Error writing KV key ${key}:`, errorMessage);
    console.error('Error details:', errorDetails);
    throw new Error(`Failed to write to KV storage (${key}): ${errorMessage}`);
  }
}

// Property storage functions
export async function loadPropertiesFromKV(): Promise<Property[]> {
  return readKV<Property[]>('properties', []);
}

export async function savePropertiesToKV(properties: Property[]): Promise<void> {
  await writeKV('properties', properties);
}

// Review storage functions
export async function loadReviewsFromKV(): Promise<Review[]> {
  return readKV<Review[]>('reviews', []);
}

export async function saveReviewsToKV(reviews: Review[]): Promise<void> {
  await writeKV('reviews', reviews);
}

// Booking storage functions
export async function loadBookingsFromKV(): Promise<Booking[]> {
  return readKV<Booking[]>('bookings', []);
}

export async function saveBookingsToKV(bookings: Booking[]): Promise<void> {
  await writeKV('bookings', bookings);
}


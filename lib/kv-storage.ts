import { Property, Review, Booking } from '@/types';

// Upstash Redis storage adapter for persistent data storage
// This replaces file-based storage on Vercel
// Note: Vercel KV has been deprecated and moved to Upstash Redis via Marketplace

const KV_PREFIX = 'friendlygroves:';

// Lazy load Redis client to handle cases where package isn't installed
let redisClient: any = null;

async function getRedisClient() {
  if (redisClient !== null) {
    return redisClient;
  }

  try {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    });
    return redisClient;
  } catch (error) {
    console.warn('@upstash/redis not available:', error);
    return null;
  }
}

// Check if Redis/KV is configured
function isKVConfigured(): boolean {
  return !!(
    (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) &&
    (process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN)
  );
}

// Generic Redis read/write functions
export async function readKV<T>(key: string, defaultValue: T): Promise<T> {
  if (!isKVConfigured()) {
    return defaultValue;
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      return defaultValue;
    }

    const fullKey = `${KV_PREFIX}${key}`;
    const data = await redis.get(fullKey) as T | null;
    return data ?? defaultValue;
  } catch (error) {
    console.error(`Error reading Redis key ${key}:`, error);
    return defaultValue;
  }
}

export async function writeKV<T>(key: string, data: T): Promise<void> {
  if (!isKVConfigured()) {
    throw new Error(`Redis/KV not configured, cannot write ${key}. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_URL and KV_REST_API_TOKEN) environment variables.`);
  }

  try {
    const redis = await getRedisClient();
    if (!redis) {
      const error = new Error('Redis client not available. @upstash/redis package may not be installed or Redis connection failed.');
      console.error(error.message);
      throw error;
    }

    const fullKey = `${KV_PREFIX}${key}`;
    const dataSize = JSON.stringify(data).length;
    console.log(`Writing to Redis: ${fullKey} (data size: ${dataSize} bytes)`);
    await redis.set(fullKey, data);
    console.log(`✅ Successfully wrote to Redis: ${fullKey}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    console.error(`❌ Error writing Redis key ${key}:`, errorMessage);
    console.error('Error details:', errorDetails);
    throw new Error(`Failed to write to Redis storage (${key}): ${errorMessage}`);
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


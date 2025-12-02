import { Property, Review, Booking } from '@/types';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data directory exists
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic JSON file read/write functions
export async function readJsonFile<T>(filename: string, defaultValue: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await writeJsonFile(filename, defaultValue);
      return defaultValue;
    }
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Load properties from JSON file
export async function loadProperties(): Promise<Property[]> {
  try {
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

// Save properties to JSON file
export async function saveProperties(properties: Property[]): Promise<void> {
  try {
    await ensureDataDir();
    await writeFile(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving properties:', error);
    throw error;
  }
}

// Load reviews from JSON file
export async function loadReviews(): Promise<Review[]> {
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

// Save reviews to JSON file
export async function saveReviews(reviews: Review[]): Promise<void> {
  try {
    await ensureDataDir();
    await writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving reviews:', error);
    throw error;
  }
}

// Load bookings from JSON file
export async function loadBookings(): Promise<Booking[]> {
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

// Save bookings to JSON file
export async function saveBookings(bookings: Booking[]): Promise<void> {
  try {
    await ensureDataDir();
    await writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving bookings:', error);
    throw error;
  }
}


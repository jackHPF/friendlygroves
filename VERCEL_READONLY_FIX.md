# Vercel Read-Only Filesystem Fix

## Problem
Vercel's serverless environment has a **read-only filesystem** (except `/tmp`). The application was trying to write to the `data/` directory, causing server-side errors.

## Solution
Updated the storage layer to:
1. **Detect Vercel environment** and use `/tmp` directory (writable but not persistent)
2. **Handle write failures gracefully** - log warnings but don't crash
3. **Return default data** if files can't be read

## Changes Made

### `lib/storage.ts`
- Detects Vercel environment using `process.env.VERCEL`
- Uses `/tmp/friendlygroves-data` on Vercel, `data/` locally
- Write operations fail silently on read-only filesystems
- Read operations return defaults if files don't exist

### `lib/data.ts`
- `initializeData()` handles save failures gracefully
- Continues with in-memory cache if file writes fail

## Current Behavior

### ✅ What Works
- **App loads successfully** - no more server errors
- **Read operations** - properties, reviews, bookings display correctly
- **Default data** - shows default properties if files don't exist

### ⚠️ Limitations on Vercel
- **Writes don't persist** - data saved to `/tmp` is lost on each deployment
- **Admin changes** - properties, contact details, etc. won't persist
- **New bookings/reviews** - won't be saved permanently

## Production Solution

For production on Vercel, you need to migrate to a **database**:

### Recommended Options:
1. **Vercel Postgres** (easiest integration)
2. **MongoDB Atlas** (free tier available)
3. **Supabase** (PostgreSQL with free tier)
4. **PlanetScale** (MySQL with free tier)

### Quick Migration Path:
1. Set up database (e.g., Vercel Postgres)
2. Replace `lib/storage.ts` functions with database queries
3. Keep the same API interface
4. Deploy

## Temporary Workaround

For now, the app will:
- ✅ Load and display default properties
- ✅ Show the homepage, properties page, etc.
- ⚠️ Not save admin changes (they'll be lost on next deployment)
- ⚠️ Not persist bookings/reviews

**To make changes persistent:**
- Use a local development environment
- Or migrate to a database (recommended for production)

## Next Steps

1. ✅ **Immediate:** App should now load on Vercel
2. **Short-term:** Consider using Vercel Postgres for data persistence
3. **Long-term:** Full database migration for production use

---

**Note:** The app is now functional on Vercel, but data persistence requires a database migration for production use.


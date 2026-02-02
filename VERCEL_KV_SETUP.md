# Vercel KV Setup Guide

## Problem Fixed
The application was losing data (images, admin password changes) because Vercel's `/tmp` directory is ephemeral and gets cleared between deployments. This fix implements **Vercel KV** (Key-Value store) for persistent data storage.

## What Changed
1. ✅ Added `@vercel/kv` package dependency
2. ✅ Created `lib/kv-storage.ts` - KV storage adapter
3. ✅ Updated `lib/storage.ts` - Now uses KV when available, falls back to file storage
4. ✅ All data (properties, reviews, bookings, admin profile) now persists via KV

## Setup Instructions

### Step 1: Install the Package
Run this command in your project directory:
```bash
npm install @vercel/kv
```

### Step 2: Create Vercel KV Database
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: **friendlygroves**
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **KV** (Key-Value)
6. Give it a name (e.g., `friendlygroves-kv`)
7. Select a region (choose closest to your users)
8. Click **Create**

### Step 3: Link KV to Your Project
1. After creating the KV database, click **Connect** or **.env.local**
2. Copy the environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Step 4: Add Environment Variables to Vercel
1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add the following variables:
   - **Key**: `KV_REST_API_URL`
     **Value**: (paste from Step 3)
   - **Key**: `KV_REST_API_TOKEN`
     **Value**: (paste from Step 3)
3. Make sure to select **Production**, **Preview**, and **Development** environments
4. Click **Save**

### Step 5: Redeploy
1. Vercel will automatically redeploy when you push changes
2. Or manually trigger a redeploy from the Vercel dashboard

## How It Works

### Storage Priority
1. **Vercel KV** (if `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set)
2. **File Storage** (local development or fallback)

### Data Persistence
- ✅ **Properties** - Saved to KV, persist across deployments
- ✅ **Reviews** - Saved to KV, persist across deployments
- ✅ **Bookings** - Saved to KV, persist across deployments
- ✅ **Admin Profile** (password, settings) - Saved to KV, persist across deployments
- ✅ **Contact Details** - Saved to KV, persist across deployments
- ✅ **Static Content** - Saved to KV, persist across deployments

### Migration
- Existing data in `/tmp` will be lost (this is expected)
- New data will be saved to KV and persist
- If you have important data, export it from the admin panel before deploying

## Verification

After setup, verify it's working:
1. Log into admin panel
2. Change admin password
3. Wait a few minutes
4. Log out and log back in with new password
5. If it works, KV is configured correctly ✅

## Troubleshooting

### Images Still Not Persisting
- Make sure `BLOB_READ_WRITE_TOKEN` is set (for image uploads)
- Images are stored in Vercel Blob, not KV
- See `DEPLOYMENT.md` for Blob setup

### Admin Password Resets
- Check Vercel logs for KV errors
- Verify `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set correctly
- Make sure KV database is created and linked to your project

### Data Not Loading
- Check Vercel function logs
- Verify KV database is in the same region as your deployment
- Check that environment variables are set for all environments (Production, Preview, Development)

## Cost
- **Vercel KV Free Tier**: 256 MB storage, 30,000 requests/day
- This should be sufficient for most use cases
- See Vercel pricing for details: https://vercel.com/pricing

## Support
If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure KV database is created and linked
4. Check that `@vercel/kv` package is installed


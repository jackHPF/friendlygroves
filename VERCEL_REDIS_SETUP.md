# Upstash Redis Setup Guide (Replaces Vercel KV)

## Important: Vercel KV is Deprecated

Vercel KV has been **deprecated** and moved to the **Vercel Marketplace**. You now need to use **Upstash Redis** instead, which provides the same functionality.

## Quick Setup (5 minutes)

### Step 1: Install the Package
```bash
npm install @upstash/redis
```

### Step 2: Create Upstash Redis Database via Vercel Marketplace

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: **friendlygroves**
3. **Go to Storage tab** (or click "Add Integration" if you see it)
4. **Click "Marketplace"** or look for "Marketplace Database Providers"
5. **Find "Upstash"** in the list
6. **Click the arrow (→)** next to Upstash (or "Create" if available)
7. **Follow the setup wizard**:
   - Select "Redis" as the database type
   - Choose a region (closest to your users)
   - Give it a name (e.g., `friendlygroves-redis`)
   - Click "Create" or "Add Integration"

### Step 3: Get Environment Variables

After creating the Upstash Redis database:

1. **Vercel will automatically add environment variables** to your project:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

2. **Verify they're set**:
   - Go to **Settings** → **Environment Variables**
   - Make sure both variables are present
   - They should be set for **Production**, **Preview**, and **Development**

### Step 4: Redeploy

1. Vercel will automatically redeploy when you push code changes
2. Or manually trigger a redeploy from the Vercel dashboard

## Alternative: Manual Setup via Upstash Dashboard

If you prefer to set up directly on Upstash:

1. **Go to Upstash**: https://console.upstash.com/
2. **Sign up/Login** (free tier available)
3. **Create a Redis database**
4. **Copy the REST URL and Token**
5. **Add to Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `UPSTASH_REDIS_REST_URL` = (your REST URL)
     - `UPSTASH_REDIS_REST_TOKEN` = (your REST Token)
   - Make sure to select all environments (Production, Preview, Development)

## Verification

After setup, verify it's working:

1. **Check Vercel logs** when saving a property
2. **Look for**: `✅ Successfully saved X properties to Redis`
3. **If you see errors**: Check that environment variables are set correctly

## Migration from Vercel KV

If you were using Vercel KV before:

- The code has been updated to use `@upstash/redis`
- It still supports old `KV_REST_API_URL` and `KV_REST_API_TOKEN` for backward compatibility
- But you should migrate to `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

## Cost

- **Upstash Free Tier**: 10,000 commands/day, 256 MB storage
- This should be sufficient for most use cases
- See Upstash pricing: https://upstash.com/pricing

## Troubleshooting

### "Redis client not available"
- Make sure `@upstash/redis` is installed: `npm install @upstash/redis`
- Check that environment variables are set

### "Redis/KV not configured"
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in Vercel
- Make sure they're set for all environments (Production, Preview, Development)

### "Failed to write to Redis"
- Check Vercel function logs for detailed error
- Verify your Upstash Redis database is active
- Check if you've exceeded free tier limits

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables are set
3. Ensure Upstash Redis database is created and active
4. Check that `@upstash/redis` package is installed


# Vercel Blob Setup Guide

## ✅ What's Been Done

I've updated the upload functionality to use Vercel Blob. The code will:
- ✅ Use Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set
- ✅ Fall back to local filesystem for development
- ✅ Show clear error messages if Blob is not configured

## 🔧 Setup Instructions

### Step 1: Get Your Vercel Blob Token

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **friendlygroves**
3. Go to **Settings** → **Storage** → **Blob**
4. If you haven't created a Blob store yet:
   - Click **"Create Blob Store"**
   - Give it a name (e.g., "friendlygroves-storage")
   - Click **"Create"**
5. Copy the **"Read/Write Token"** (starts with `vercel_blob_rw_...`)

### Step 2: Add Environment Variable in Vercel

1. In your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Click **"Add New"**
4. Add:
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Paste your token (starts with `vercel_blob_rw_...`)
   - **Environment:** Select all (Production, Preview, Development)
5. Click **"Save"**

### Step 3: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

### Step 4: Test Upload

1. Go to your admin panel: `https://friendlygroves.vercel.app/admin`
2. Login
3. Go to **Properties** → **New Property** or edit an existing property
4. Try uploading an image
5. It should work! ✅

## 🧪 Local Development Setup

For local development, you can either:

### Option 1: Use Local Filesystem (Default)
- No setup needed
- Files will be saved to `public/images/` and `public/videos/`
- Works out of the box

### Option 2: Use Vercel Blob Locally
1. Create `.env.local` file:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
   ```
2. Restart your dev server:
   ```bash
   npm run dev
   ```

## 📋 Environment Variables

### Required for Production (Vercel)
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
```

### Optional (for local development)
```env
# If you want to use Vercel Blob locally
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your_token_here
```

## ✅ Verification

After setup, verify it's working:

1. **Check Environment Variable:**
   - Vercel Dashboard → Settings → Environment Variables
   - Should see `BLOB_READ_WRITE_TOKEN` listed

2. **Test Upload:**
   - Admin panel → Properties → Upload image
   - Should upload successfully
   - Image URL should be from `*.public.blob.vercel-storage.com`

3. **Check Blob Store:**
   - Vercel Dashboard → Storage → Blob
   - Should see uploaded files in the store

## 🎯 How It Works

- **On Vercel (Production):**
  - Uses Vercel Blob if `BLOB_READ_WRITE_TOKEN` is set
  - Files are stored in your Blob store
  - URLs are public and accessible

- **Local Development:**
  - Uses Vercel Blob if `BLOB_READ_WRITE_TOKEN` is in `.env.local`
  - Otherwise uses local filesystem (`public/images/`, `public/videos/`)

## 🆘 Troubleshooting

### "Failed to upload to Vercel Blob"
- ✅ Check that `BLOB_READ_WRITE_TOKEN` is set in Vercel
- ✅ Verify the token is correct (starts with `vercel_blob_rw_`)
- ✅ Make sure you've redeployed after adding the environment variable

### "File uploads require Vercel Blob on Vercel"
- ✅ This means `BLOB_READ_WRITE_TOKEN` is not set
- ✅ Follow Step 2 above to add the environment variable
- ✅ Redeploy your application

### Images not showing after upload
- ✅ Check the image URL in the property data
- ✅ Verify the URL is from `*.public.blob.vercel-storage.com`
- ✅ Check browser console for any CORS or loading errors

## 📝 Notes

- **File Size Limits:**
  - Images: 10MB max
  - Videos: 100MB max
  - Vercel Blob has its own limits (check Vercel docs)

- **File Organization:**
  - Images: Stored in `images/` folder in Blob
  - Videos: Stored in `videos/` folder in Blob
  - Filenames are auto-generated with timestamps

- **Public Access:**
  - All uploaded files are publicly accessible
  - URLs are permanent (unless you delete them)

---

**Status:** ✅ Code is ready! Just add the `BLOB_READ_WRITE_TOKEN` environment variable in Vercel and redeploy.


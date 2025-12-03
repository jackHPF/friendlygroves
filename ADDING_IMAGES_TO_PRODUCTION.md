# Adding Images to Production on Vercel

## Problem

Vercel's serverless environment has a **read-only filesystem**, which means:
- ❌ File uploads through the admin panel won't work
- ❌ Uploaded files won't persist
- ✅ Images must be committed to the repository

## Solution: Add Images via Git

Since Vercel deploys from your Git repository, you need to add images to the repository and push them.

### Method 1: Add Images Locally and Commit

1. **Add images to your local repository:**
   ```bash
   # Copy your images to the public/images directory
   cp /path/to/your/image.jpg public/images/
   
   # Or if you uploaded them locally, they should already be in public/images/
   ```

2. **Check which images are tracked:**
   ```bash
   git status public/images/
   ```

3. **Add new images to git:**
   ```bash
   git add public/images/your-new-image.jpg
   git commit -m "Add property images"
   git push origin main
   ```

4. **Vercel will automatically redeploy** with the new images

### Method 2: Use Image URLs Instead

Instead of uploading files, you can use external image URLs:

1. **Upload images to a cloud service:**
   - [Cloudinary](https://cloudinary.com) (free tier available)
   - [Imgur](https://imgur.com) (free)
   - [AWS S3](https://aws.amazon.com/s3/)
   - [Google Cloud Storage](https://cloud.google.com/storage)

2. **In the admin panel**, use the "Add Image URL" field instead of uploading

3. **The images will be loaded from the external URL**

## Recommended: Set Up Cloud Storage

For production, you should set up a cloud storage service:

### Option 1: Vercel Blob (Easiest)

1. Install Vercel Blob:
   ```bash
   npm install @vercel/blob
   ```

2. Get your blob store token from Vercel dashboard

3. Update the upload route to use Vercel Blob

### Option 2: Cloudinary (Recommended for Images)

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your API keys
3. Update the upload route to use Cloudinary SDK

### Option 3: AWS S3

1. Set up an S3 bucket
2. Configure IAM permissions
3. Update the upload route to use AWS SDK

## Current Status

✅ **19 image files are already in the repository** and should be deployed

To check if your images are in production:
1. Visit `https://friendlygroves.vercel.app/images/[filename]`
2. Replace `[filename]` with one of your image filenames

## Quick Fix: Add Missing Images

If images uploaded locally aren't showing in production:

1. **Check if they're in git:**
   ```bash
   git ls-files public/images/
   ```

2. **If not, add them:**
   ```bash
   git add public/images/*.jpg public/images/*.jpeg public/images/*.png
   git commit -m "Add property images"
   git push origin main
   ```

3. **Wait for Vercel to redeploy** (2-3 minutes)

## Troubleshooting

### Images show locally but not in production

- ✅ Check if images are committed: `git ls-files public/images/`
- ✅ Check if images are pushed: `git log --oneline --all -- public/images/`
- ✅ Verify image paths in properties data match actual filenames
- ✅ Check Vercel build logs for any errors

### Upload button shows error

- This is expected on Vercel - use "Add Image URL" instead
- Or add images via git (see Method 1 above)

### Images are too large

- Optimize images before committing (use tools like [TinyPNG](https://tinypng.com))
- Recommended: Max 1-2MB per image for web

## Next Steps

For a production-ready solution:
1. Set up Cloudinary or Vercel Blob for image uploads
2. Update the upload API route to use cloud storage
3. Images will then persist and be accessible

---

**Note:** For now, the app works with images added via git. The upload feature will work once cloud storage is configured.


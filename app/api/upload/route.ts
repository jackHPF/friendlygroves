import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Check if we're on Vercel (read-only filesystem)
const IS_VERCEL = process.env.VERCEL === '1' || process.env.VERCEL_ENV;
// Check if Vercel Blob is configured
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const USE_VERCEL_BLOB = !!BLOB_READ_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || (type !== 'image' && type !== 'video')) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "image" or "video"' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    
    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid image type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid video type. Allowed: MP4, WebM, OGG, QuickTime' },
        { status: 400 }
      );
    }

    // Check file size (10MB for images, 100MB for videos)
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    
    if (type === 'image' && file.size > maxImageSize) {
      return NextResponse.json(
        { error: 'Image size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    if (type === 'video' && file.size > maxVideoSize) {
      return NextResponse.json(
        { error: 'Video size exceeds 100MB limit' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = path.extname(originalName) || (type === 'image' ? '.jpg' : '.mp4');
    const filename = `${timestamp}-${randomString}${extension}`;

    // Use Vercel Blob if configured, otherwise use local filesystem
    if (USE_VERCEL_BLOB) {
      try {
        // Upload to Vercel Blob
        const blobPath = type === 'image' ? `images/${filename}` : `videos/${filename}`;
        const blob = await put(blobPath, buffer, {
          access: 'public',
          token: BLOB_READ_WRITE_TOKEN,
        });

        return NextResponse.json({
          success: true,
          url: blob.url,
          filename: filename,
        });
      } catch (error: any) {
        console.error('Error uploading to Vercel Blob:', error);
        return NextResponse.json(
          { 
            error: 'Failed to upload to Vercel Blob. Please check your BLOB_READ_WRITE_TOKEN environment variable.',
            requiresCloudStorage: true
          },
          { status: 500 }
        );
      }
    }

    // Fallback to local filesystem (for local development)
    if (IS_VERCEL && !USE_VERCEL_BLOB) {
      return NextResponse.json(
        { 
          error: 'File uploads require Vercel Blob on Vercel. Please set BLOB_READ_WRITE_TOKEN environment variable in Vercel dashboard.',
          requiresCloudStorage: true
        },
        { status: 501 }
      );
    }

    // Local filesystem upload (development only)
    const uploadDir = type === 'image' ? 'public/images' : 'public/videos';
    const uploadPath = path.join(process.cwd(), uploadDir);

    // Create directory if it doesn't exist
    try {
      if (!existsSync(uploadPath)) {
        await mkdir(uploadPath, { recursive: true });
      }
    } catch (error: any) {
      if (error.code === 'EACCES' || error.code === 'EROFS') {
        return NextResponse.json(
          { 
            error: 'Cannot write to filesystem. The filesystem is read-only. Please use a cloud storage service for file uploads.',
            requiresCloudStorage: true
          },
          { status: 503 }
        );
      }
      throw error;
    }

    // Save file
    const filePath = path.join(uploadPath, filename);
    try {
      await writeFile(filePath, buffer);
    } catch (error: any) {
      if (error.code === 'EACCES' || error.code === 'EROFS') {
        return NextResponse.json(
          { 
            error: 'Cannot write to filesystem. The filesystem is read-only. Please use a cloud storage service for file uploads.',
            requiresCloudStorage: true
          },
          { status: 503 }
        );
      }
      throw error;
    }

    // Return the public URL
    const publicUrl = type === 'image' 
      ? `/images/${filename}`
      : `/videos/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload file',
        requiresCloudStorage: IS_VERCEL
      },
      { status: 500 }
    );
  }
}


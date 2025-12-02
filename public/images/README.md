# Property Images

Add your property images to this directory.

## Recommended Structure

- `property1-1.jpg`, `property1-2.jpg`, etc. - Images for property 1
- `property2-1.jpg`, `property2-2.jpg`, etc. - Images for property 2
- `property3-1.jpg`, `property3-2.jpg`, etc. - Images for property 3
- `hero-bg.jpg` - Background image for hero section
- `placeholder.jpg` - Placeholder image for missing images

## Image Guidelines

- **Format**: JPG or WebP (WebP preferred for better compression)
- **Hero Image**: 1920x1080px (or similar 16:9 ratio)
- **Property Card Images**: 800x600px (4:3 ratio)
- **Property Detail Gallery**: 1200x800px (3:2 ratio)
- **File Size**: Keep images optimized (under 500KB each)
- **Compression**: Use tools like TinyPNG, ImageOptim, or Squoosh

## Image Optimization

Use Next.js Image Optimization API (automatic) or optimize images before uploading:

```bash
# Example with ImageMagick
convert input.jpg -resize 1200x800 -quality 85 output.jpg

# Or use online tools
# https://squoosh.app/
# https://tinypng.com/
```

## Adding New Images

1. Add images to this directory
2. Update `lib/data.ts` with the correct image paths
3. Ensure filenames match the paths in your property data


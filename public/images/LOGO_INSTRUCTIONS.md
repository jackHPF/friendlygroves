# Friendly Groves Logo

The logo appears in the header on all pages of the website.

## Logo Location
Place your Friendly Groves logo image at:
```
public/images/friendly-groves-logo.png
```

## Supported Formats
- `.png` (recommended - supports transparency)
- `.jpg` or `.jpeg`
- `.webp`
- `.svg` (best for scalability)

## Image Requirements
- **Recommended size:** 200x200px to 400x400px
- **Aspect ratio:** Square (1:1) works best
- **File size:** Keep under 500KB for fast loading
- **Background:** Transparent PNG is preferred for best appearance

## How to Add
1. Save your Friendly Groves logo image
2. Rename it to `friendly-groves-logo.png` (or update the path in `components/Header.tsx`)
3. Place it in the `public/images/` directory
4. The logo will automatically appear in the header on all pages

## Alternative: Use Different Format
If you have the logo in a different format:
- For `.jpg` or `.jpeg`: Update the path in `components/Header.tsx` line 18
- For `.svg`: Update the path and consider using a regular `<img>` tag instead of Next.js Image component
- For `.webp`: Update the path in `components/Header.tsx` line 18

## Current Implementation
The logo is displayed:
- In the header navigation (top of every page)
- Responsive sizing: 48px on mobile, 64px on desktop
- Clickable - links to homepage
- Text "Friendly Groves" appears next to logo on desktop, hidden on mobile


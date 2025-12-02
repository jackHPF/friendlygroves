# Quick Start Guide

Get your Friendly Groves website up and running in minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd friendlygroves
npm install
```

### 2. Add Your Property Images

1. Add your property images to `public/images/`
2. Update image paths in `lib/data.ts` to match your filenames
3. Recommended: Use image optimization tools (TinyPNG, Squoosh)

### 3. Update Property Data

Edit `lib/data.ts` to add your properties:

```typescript
export const properties: Property[] = [
  {
    id: '1',
    name: 'Your Property Name',
    location: 'Your Location, Vizag',
    city: 'Visakhapatnam',
    description: 'Your property description...',
    pricePerNight: 2500,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: ['/images/your-image.jpg'],
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen'],
    slug: 'your-property-slug',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Add more properties...
];
```

### 4. Update Contact Information

Update these files with your contact details:

- `components/ContactForm.tsx` - Update email and phone
- `components/Footer.tsx` - Update contact information
- `app/layout.tsx` - Update site metadata

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your website!

## 📝 Next Steps

### For Production:

1. **Set up Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your configuration

2. **Deploy**
   - See `DEPLOYMENT.md` for detailed instructions
   - Recommended: Deploy to Vercel for easiest setup

3. **Add Database** (Optional)
   - See `README.md` for database setup options
   - Currently using in-memory data (good for testing)

4. **Set up Email Service**
   - Configure email service for contact forms
   - See `README.md` for options (SendGrid, AWS SES, etc.)

5. **Configure Domain**
   - Point `www.friendlygroves.co.in` to your hosting
   - Set up SSL certificate

## 🎨 Customization Tips

### Change Colors

Update Tailwind classes throughout components:
- Primary blue: `bg-blue-600` → Change to your brand color
- Or update `tailwind.config.ts` (if you add one)

### Add More Pages

Create new pages in `app/` directory:
- `app/about/page.tsx` - About page
- `app/terms/page.tsx` - Terms and conditions

### Modify Components

All components are in `components/` directory:
- `PropertyCard.tsx` - Property listing card
- `BookingCalendar.tsx` - Booking widget
- `ContactForm.tsx` - Contact form

## 🔧 Common Customizations

### Change Site Name

1. `app/layout.tsx` - Update metadata title
2. `components/Header.tsx` - Update logo text
3. `components/Footer.tsx` - Update footer text

### Add More Properties

1. Add images to `public/images/`
2. Add property data to `lib/data.ts`
3. Images will appear automatically!

### Customize Hero Section

Edit `components/Hero.tsx` to:
- Change hero image
- Update hero text
- Modify search functionality

## 🐛 Troubleshooting

### Images Not Showing

- Check image paths in `lib/data.ts`
- Ensure images exist in `public/images/`
- Use absolute paths starting with `/images/`

### Build Errors

- Run `npm run build` to check for errors
- Ensure all TypeScript types are correct
- Check for missing imports

### API Errors

- API routes are in `app/api/`
- Check browser console for errors
- Verify API endpoint URLs

## 📚 Need Help?

- See `README.md` for detailed documentation
- See `DEPLOYMENT.md` for deployment instructions
- Check Next.js documentation: https://nextjs.org/docs

## ✅ Checklist Before Going Live

- [ ] All property images added
- [ ] Property data updated
- [ ] Contact information updated
- [ ] Tested booking flow
- [ ] Tested contact form
- [ ] Tested on mobile devices
- [ ] Environment variables configured
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Analytics set up (optional)

Happy hosting! 🎉


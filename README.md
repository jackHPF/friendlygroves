# Friendly Groves - Rental Property Website

A modern, responsive website for managing and showcasing rental apartments in Visakhapatnam (Vizag). Built with Next.js 16, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Property Listings**: Browse all available rental apartments with detailed information
- **Property Details**: Comprehensive property pages with image galleries, amenities, and descriptions
- **Booking System**: Interactive calendar-based booking with availability checking
- **Contact Forms**: Easy communication for inquiries and discount requests
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **SEO Optimized**: Built-in SEO features for better search engine visibility
- **Modern UI/UX**: Clean, professional design with smooth animations

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Picker**: React DatePicker
- **Deployment Ready**: Vercel, AWS, or any Node.js hosting

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

## 🚀 Getting Started

### 1. Clone the repository

```bash
cd friendlygroves
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### 4. Build for production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
friendlygroves/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── bookings/      # Booking API endpoints
│   │   ├── contact/       # Contact form API
│   │   └── properties/    # Property data API
│   ├── properties/        # Property listing and detail pages
│   ├── booking/           # Booking confirmation page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PropertyCard.tsx
│   ├── Hero.tsx
│   ├── BookingCalendar.tsx
│   ├── ContactForm.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/                   # Utility functions and data
│   └── data.ts           # Property data and helper functions
├── types/                # TypeScript type definitions
│   └── index.ts
├── public/               # Static assets
│   └── images/          # Property images (add your images here)
└── package.json
```

## 📸 Adding Property Images

1. Add your property images to the `public/images/` directory
2. Update the image paths in `lib/data.ts` to match your filenames
3. Recommended image sizes:
   - Hero images: 1920x1080px
   - Property cards: 800x600px
   - Property detail gallery: 1200x800px

Example structure:
```
public/images/
├── property1-1.jpg
├── property1-2.jpg
├── property1-3.jpg
├── property2-1.jpg
├── hero-bg.jpg
└── placeholder.jpg
```

## 🗄️ Database Setup (Production)

Currently, the app uses in-memory data. For production, integrate a database:

### Option 1: MongoDB

```bash
npm install mongodb mongoose
```

Create a `lib/db.ts` file:
```typescript
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function connectDB() {
  await client.connect();
  return client.db('friendlygroves');
}
```

### Option 2: PostgreSQL

```bash
npm install pg prisma @prisma/client
npx prisma init
```

Update `prisma/schema.prisma` with your models and run `npx prisma migrate dev`.

### Option 3: Supabase

```bash
npm install @supabase/supabase-js
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Database (if using)
MONGODB_URI=your_mongodb_connection_string
# or
DATABASE_URL=your_postgres_connection_string

# Email Service (for contact forms)
SENDGRID_API_KEY=your_sendgrid_api_key
# or
AWS_SES_REGION=your_aws_region
AWS_SES_ACCESS_KEY=your_access_key
AWS_SES_SECRET_KEY=your_secret_key

# Contact Email
CONTACT_EMAIL=info@friendlygroves.co.in

# Payment Gateway (optional)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
# or
STRIPE_PUBLIC_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Deploy to AWS

```bash
npm install -g @vercel/aws
vercel aws
```

### Deploy to Other Platforms

The app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Heroku

## 📝 Customization

### Update Property Data

Edit `lib/data.ts` to add/remove properties:

```typescript
export const properties: Property[] = [
  {
    id: '1',
    name: 'Your Property Name',
    location: 'Location, Vizag',
    // ... other fields
  },
];
```

### Update Contact Information

1. Update contact details in `components/ContactForm.tsx`
2. Update footer information in `components/Footer.tsx`
3. Update metadata in `app/layout.tsx`

### Customize Colors

Edit `tailwind.config.ts` or update Tailwind classes throughout components.

## 🔐 Security Considerations

- Implement rate limiting for API routes
- Add input validation and sanitization
- Use HTTPS in production
- Implement CAPTCHA for contact forms
- Add authentication for admin panel (future)

## 📧 Email Integration

To send emails for bookings and inquiries, integrate with:

- **SendGrid**: `npm install @sendgrid/mail`
- **AWS SES**: `npm install @aws-sdk/client-ses`
- **Resend**: `npm install resend`
- **Nodemailer**: `npm install nodemailer`

## 💳 Payment Integration (Future)

For online payments, integrate:

- **Razorpay** (India): `npm install razorpay`
- **Stripe**: `npm install stripe`
- **PayPal**: `npm install @paypal/checkout-server-sdk`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or support:
- Email: info@friendlygroves.co.in
- Website: www.friendlygroves.co.in

## 🎯 Future Enhancements

- [ ] Admin dashboard for managing properties and bookings
- [ ] Integration with Airbnb/Booking.com APIs
- [ ] Real-time availability calendar
- [ ] User accounts and booking history
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced search and filters
- [ ] Reviews and ratings system
- [ ] Email notifications
- [ ] SMS notifications

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalability, performance, and user experience.

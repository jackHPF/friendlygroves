# Production Deployment Guide for friendlygroves.co.in

This guide will help you deploy Friendly Groves to production with your domain `https://friendlygroves.co.in`.

## 🚀 Recommended: Deploy to Vercel (Easiest for Next.js)

Vercel is the recommended platform for Next.js applications and provides:
- Automatic SSL certificates
- Global CDN
- Easy domain configuration
- Automatic deployments from GitHub
- Free tier available

### Step 1: Prepare Your Code

1. **Ensure all changes are committed:**
   ```bash
   git status
   git add .
   git commit -m "Ready for production deployment"
   ```

2. **Create a GitHub repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/friendlygroves.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Create New Project:**
   - Click "Add New..." → "Project"
   - Import your `friendlygroves` repository
   - Vercel will auto-detect Next.js settings

3. **Configure Project Settings:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

4. **Environment Variables (if needed):**
   - Click "Environment Variables"
   - Add any required variables (currently none are mandatory)
   - For future email services, you might add:
     - `SENDGRID_API_KEY` (if using SendGrid)
     - `CONTACT_EMAIL` (your contact email)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - You'll get a URL like: `friendlygroves.vercel.app`

### Step 3: Configure Your Domain

1. **Add Domain in Vercel:**
   - Go to your project dashboard
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter: `friendlygroves.co.in`
   - Also add: `www.friendlygroves.co.in` (optional but recommended)

2. **Configure DNS Records:**
   
   Vercel will provide you with DNS records to add. You need to add these to your domain registrar (where you bought the domain).

   **Option A: Using A Records (if Vercel provides IP addresses):**
   ```
   Type: A
   Name: @
   Value: [Vercel's IP address]
   TTL: 3600
   
   Type: A
   Name: www
   Value: [Vercel's IP address]
   TTL: 3600
   ```

   **Option B: Using CNAME (Recommended):**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   TTL: 3600
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

   **Option C: Using Nameservers (Easiest):**
   - Vercel will provide nameservers
   - Update your domain's nameservers at your registrar to point to Vercel's nameservers

3. **Wait for DNS Propagation:**
   - DNS changes can take 24-48 hours, but usually complete within a few hours
   - Vercel will automatically issue SSL certificates once DNS is configured
   - You can check status in Vercel dashboard

4. **Verify Domain:**
   - Once DNS propagates, Vercel will automatically configure SSL
   - Your site will be accessible at `https://friendlygroves.co.in`

### Step 4: Post-Deployment Configuration

1. **Update Base URL (if needed):**
   - Check if any hardcoded URLs need updating
   - Update metadata in `app/layout.tsx` if needed

2. **Test Everything:**
   - ✅ Homepage loads
   - ✅ Properties page works
   - ✅ Property detail pages work
   - ✅ Contact form submits
   - ✅ Admin login works
   - ✅ Images load correctly
   - ✅ Mobile responsive
   - ✅ Booking flow works

3. **Set up Monitoring:**
   - Enable Vercel Analytics (optional, in project settings)
   - Set up uptime monitoring (UptimeRobot, Pingdom, etc.)

## 🌐 Alternative: Deploy to AWS (More Control)

If you prefer AWS or need more control:

### Option 1: AWS Amplify (Easiest AWS Option)

1. **Go to AWS Amplify Console:**
   - Sign in to AWS Console
   - Navigate to AWS Amplify
   - Click "New app" → "Host web app"

2. **Connect Repository:**
   - Connect your GitHub repository
   - Select branch: `main`
   - Amplify auto-detects Next.js

3. **Configure Build:**
   - Build settings (auto-detected):
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```

4. **Add Custom Domain:**
   - Go to "Domain management"
   - Add `friendlygroves.co.in`
   - Follow DNS configuration instructions
   - SSL certificate is automatically provisioned

### Option 2: AWS EC2 (Full Control)

See detailed instructions in `DEPLOYMENT.md` for EC2 setup with Nginx and SSL.

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All code is committed and pushed to GitHub
- [ ] Application builds successfully locally (`npm run build`)
- [ ] All features tested locally
- [ ] Images are optimized
- [ ] Contact information is correct
- [ ] Admin credentials are secure (change default password)
- [ ] Environment variables are documented
- [ ] `.gitignore` includes sensitive files
- [ ] No hardcoded localhost URLs
- [ ] Error handling is in place

## 🔧 Production Optimizations

### 1. Update next.config.ts for Production

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    domains: ['friendlygroves.co.in'],
    formats: ['image/avif', 'image/webp'],
  },
  // Enable compression
  compress: true,
  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
```

### 2. Environment Variables

Create a `.env.production` file (don't commit this):

```env
# Production URL
NEXT_PUBLIC_SITE_URL=https://friendlygroves.co.in

# Email Service (when you set it up)
SENDGRID_API_KEY=your_sendgrid_key
CONTACT_EMAIL=info@friendlygroves.co.in

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

### 3. Update Metadata

Update `app/layout.tsx` with production URL:

```typescript
export const metadata: Metadata = {
  // ... existing metadata
  openGraph: {
    url: 'https://friendlygroves.co.in',
    // ... rest of config
  },
};
```

## 🔐 Security Checklist

- [ ] HTTPS is enabled (automatic with Vercel/AWS)
- [ ] Admin password is changed from default
- [ ] Environment variables are secure
- [ ] No sensitive data in code
- [ ] Rate limiting configured (if needed)
- [ ] Security headers configured
- [ ] Regular backups of data directory

## 📊 Post-Deployment Tasks

1. **SEO Setup:**
   - Submit sitemap to Google Search Console
   - Verify domain ownership
   - Test meta tags with social media debuggers

2. **Analytics:**
   - Set up Google Analytics (optional)
   - Configure Vercel Analytics (optional)

3. **Monitoring:**
   - Set up error tracking (Sentry, optional)
   - Configure uptime monitoring
   - Set up email alerts for downtime

4. **Backup Strategy:**
   - The `data/` directory contains all your data
   - Set up automated backups
   - Consider using a database for production (MongoDB, PostgreSQL)

## 🚨 Important Notes

1. **Data Persistence:**
   - Currently, data is stored in `data/` directory as JSON files
   - On Vercel, this works but data is ephemeral (lost on redeploy)
   - **For production, consider migrating to a database:**
     - MongoDB Atlas (free tier available)
     - PostgreSQL (Supabase, Railway, etc.)
     - Or use Vercel's storage solutions

2. **File Uploads:**
   - Images are stored in `public/images/`
   - For production, use cloud storage:
     - AWS S3
     - Cloudinary
     - Vercel Blob Storage

3. **Email Service:**
   - Contact forms currently log to console
   - Set up SendGrid, Resend, or AWS SES for production emails

## 🔄 Continuous Deployment

Once set up, every push to your `main` branch will automatically deploy:

1. Push code to GitHub
2. Vercel detects changes
3. Builds and deploys automatically
4. Your site updates within 2-3 minutes

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify DNS configuration
3. Test locally first
4. Check browser console for errors

## 🎉 Success!

Once deployed, your site will be live at:
- **Primary:** https://friendlygroves.co.in
- **WWW:** https://www.friendlygroves.co.in (if configured)

Congratulations! Your Friendly Groves website is now live! 🚀


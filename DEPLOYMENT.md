# Deployment Guide

This guide will help you deploy Friendly Groves to various hosting platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables (see `.env.example`)
   - Click "Deploy"

3. **Configure Domain**
   - In Vercel dashboard, go to Project Settings > Domains
   - Add `www.friendlygroves.co.in` and `friendlygroves.co.in`
   - Update DNS records as instructed by Vercel

## 🌐 Deploy to AWS

### Option 1: AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Configure build settings (auto-detected for Next.js)

2. **Environment Variables**
   - Add all environment variables from `.env.example`
   - Set up custom domain

### Option 2: EC2 with PM2

1. **Launch EC2 Instance**
   ```bash
   # SSH into your EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and Build**
   ```bash
   git clone <your-repo-url>
   cd friendlygroves
   npm install
   npm run build
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "friendlygroves" -- start
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/friendlygroves
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name www.friendlygroves.co.in friendlygroves.co.in;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/friendlygroves /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d friendlygroves.co.in -d www.friendlygroves.co.in
   ```

## ☁️ Deploy to DigitalOcean

### Option 1: App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository
   - Select Node.js
   - Configure environment variables
   - Deploy

### Option 2: Droplet

Similar to AWS EC2 setup above, but with DigitalOcean Droplet.

## 🏗️ Deploy to Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Note**: Netlify works better with static exports. Consider using `next export` or Netlify's Next.js plugin.

## 📦 Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.ts`:

```typescript
const nextConfig = {
  output: 'standalone',
};
```

Build and run:
```bash
docker build -t friendlygroves .
docker run -p 3000:3000 friendlygroves
```

## 🔧 Pre-Deployment Checklist

- [ ] Update all environment variables
- [ ] Test all functionality locally
- [ ] Optimize images
- [ ] Set up database (if using)
- [ ] Configure email service
- [ ] Update contact information
- [ ] Test booking flow
- [ ] Test contact forms
- [ ] Verify mobile responsiveness
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Configure error monitoring (Sentry, etc.)
- [ ] Set up backups
- [ ] Configure SSL certificate
- [ ] Update DNS records
- [ ] Test domain configuration

## 🔍 Post-Deployment

1. **Test Everything**
   - Homepage loads correctly
   - Property pages work
   - Booking form submits
   - Contact form sends emails
   - Images load properly
   - Mobile view works

2. **Monitor**
   - Set up uptime monitoring
   - Monitor error logs
   - Track performance metrics

3. **SEO**
   - Submit sitemap to Google Search Console
   - Verify meta tags
   - Test social media sharing

## 📊 Performance Optimization

- Enable Next.js Image Optimization
- Use CDN for static assets
- Enable caching headers
- Optimize database queries
- Use Redis for caching (if needed)
- Enable compression (gzip/brotli)

## 🔐 Security

- Enable HTTPS (SSL)
- Set security headers
- Implement rate limiting
- Regular security updates
- Monitor for vulnerabilities
- Use environment variables for secrets


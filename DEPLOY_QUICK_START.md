# Quick Start: Deploy to Production

## 🚀 Fastest Path to Production (Vercel - 10 minutes)

### Prerequisites
- GitHub account
- Domain: friendlygroves.co.in
- Access to your domain's DNS settings

### Steps

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Production ready"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/friendlygroves.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Click "Deploy" (no configuration needed)

3. **Add Your Domain:**
   - In Vercel dashboard → Settings → Domains
   - Add: `friendlygroves.co.in`
   - Add: `www.friendlygroves.co.in` (optional)
   - Follow DNS instructions provided by Vercel

4. **Update DNS:**
   - Go to your domain registrar
   - Add the DNS records Vercel provides
   - Wait 5-60 minutes for DNS propagation

5. **Done!** ✅
   - SSL certificate is automatic
   - Your site is live at https://friendlygroves.co.in

## 📝 Important Notes

### Data Storage
⚠️ **Current Setup:** Data is stored in `data/` folder as JSON files.

**For Production, you have two options:**

**Option 1: Keep JSON files (Simple but limited)**
- Works on Vercel
- Data persists between deployments
- Good for small sites
- No additional setup needed

**Option 2: Use Database (Recommended for scale)**
- Migrate to MongoDB Atlas (free tier) or PostgreSQL
- More reliable for production
- Better for handling concurrent users
- Requires code changes

### File Uploads
Currently, uploaded images go to `public/images/`. For production:
- **Option 1:** Keep as-is (works on Vercel)
- **Option 2:** Use cloud storage (AWS S3, Cloudinary, Vercel Blob)

### Email Service
Contact forms currently log to console. To send real emails:
1. Sign up for SendGrid (free tier: 100 emails/day)
2. Get API key
3. Add to Vercel environment variables:
   - `SENDGRID_API_KEY=your_key_here`
4. Update `app/api/contact/route.ts` to use SendGrid

## 🔧 Post-Deployment Checklist

- [ ] Test homepage: https://friendlygroves.co.in
- [ ] Test properties page
- [ ] Test contact form
- [ ] Test admin login
- [ ] Verify images load
- [ ] Test on mobile
- [ ] Check SSL certificate (should be automatic)
- [ ] Update admin password (if still using default)

## 🆘 Troubleshooting

**Site not loading?**
- Check DNS propagation: https://dnschecker.org
- Verify DNS records match Vercel's instructions
- Check Vercel deployment logs

**Images not showing?**
- Ensure images are in `public/images/` folder
- Check image paths in code
- Verify file permissions

**Admin panel not working?**
- Clear browser localStorage
- Try logging in again
- Check browser console for errors

## 📞 Need Help?

1. Check Vercel deployment logs
2. Review `PRODUCTION_DEPLOYMENT.md` for detailed guide
3. Test locally first: `npm run build && npm start`

---

**Ready to deploy?** Follow the 5 steps above and your site will be live in minutes! 🎉


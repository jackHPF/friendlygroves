# Vercel Deployment Troubleshooting

## Issue: Seeing "To get started, edit the page.tsx file" Message

This means Vercel is showing the default Next.js starter page instead of your Friendly Groves application.

## 🔍 Common Causes & Solutions

### 1. Wrong Repository/Branch Deployed

**Check:**
- In Vercel dashboard → Settings → Git
- Verify the correct repository is connected
- Verify the correct branch is set (usually `main` or `master`)

**Fix:**
- Go to Vercel dashboard
- Project Settings → Git
- Reconnect the correct repository
- Ensure branch is `main` (or your default branch)

### 2. Files Not Committed/Pushed

**Check:**
```bash
git status
git log --oneline -5
```

**Fix:**
```bash
# Make sure all files are committed
git add .
git commit -m "Production deployment"
git push origin main
```

Then trigger a new deployment in Vercel:
- Go to Vercel dashboard
- Click "Redeploy" or wait for automatic deployment

### 3. Build Failed Silently

**Check:**
- Go to Vercel dashboard
- Click on your deployment
- Check "Build Logs" tab
- Look for any errors

**Common Build Errors:**
- Missing dependencies
- TypeScript errors
- Import errors
- Environment variable issues

### 4. Root Directory Issue

**Check:**
- Vercel dashboard → Settings → General
- Verify "Root Directory" is set to `.` (current directory)

**Fix:**
- If your code is in a subdirectory, set Root Directory to that path
- For this project, it should be `.` (root)

### 5. Framework Detection Issue

**Check:**
- Vercel dashboard → Settings → General
- Verify "Framework Preset" is set to "Next.js"

**Fix:**
- If not set correctly, change it to "Next.js"
- Or delete `vercel.json` and let Vercel auto-detect

## 🚀 Quick Fix Steps

### Step 1: Verify Your Code is Pushed

```bash
# Check if you're in a git repository
git status

# If not initialized, initialize it
git init
git add .
git commit -m "Initial commit for production"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/friendlygroves.git
git branch -M main
git push -u origin main
```

### Step 2: Verify Vercel Configuration

1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → General
4. Verify:
   - **Framework Preset:** Next.js
   - **Root Directory:** `.` (or leave empty)
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `.next` (or leave default)
   - **Install Command:** `npm install` (or leave default)

### Step 3: Check Build Logs

1. Go to Vercel dashboard
2. Click on the latest deployment
3. Check "Build Logs" tab
4. Look for:
   - ✅ "Build successful"
   - ❌ Any error messages
   - ⚠️ Warnings (usually okay)

### Step 4: Force Redeploy

1. In Vercel dashboard
2. Go to Deployments
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Or push a new commit to trigger deployment

### Step 5: Clear Vercel Cache

1. Vercel dashboard → Settings → General
2. Scroll to "Clear Build Cache"
3. Click "Clear"
4. Redeploy

## 🔧 Manual Verification

### Test Build Locally

```bash
# Make sure build works locally
npm run build

# If build succeeds, the issue is with Vercel configuration
# If build fails, fix the errors first
```

### Verify page.tsx Content

Your `app/page.tsx` should contain the Friendly Groves homepage code, not the default Next.js starter.

**Correct content should include:**
- `Hero` component
- `PropertyCard` components
- `ContactForm` component
- "Featured Properties" section

## 📋 Vercel Configuration Checklist

- [ ] Repository is connected correctly
- [ ] Branch is set to `main` (or your default branch)
- [ ] Framework Preset is "Next.js"
- [ ] Root Directory is `.` (or empty)
- [ ] Build Command is `npm run build` (or default)
- [ ] All files are committed and pushed
- [ ] Build logs show success
- [ ] No environment variable errors

## 🆘 Still Not Working?

### Option 1: Delete and Recreate Project

1. In Vercel dashboard, delete the current project
2. Create a new project
3. Import the same repository
4. Deploy

### Option 2: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No (create new)
# - Which scope? (select your account)
# - Link to existing project? Yes (if recreating)
# - What's your project's name? friendlygroves
# - In which directory is your code located? ./
```

### Option 3: Check for Hidden Files

Make sure `.gitignore` isn't excluding important files:

```bash
# Check what's being ignored
git status --ignored

# Make sure these are NOT ignored:
# - app/
# - components/
# - lib/
# - public/
# - package.json
# - next.config.ts
```

## 🔍 Debugging Commands

```bash
# Check if all files are tracked
git ls-files | grep -E "(app|components|lib)" | head -20

# Verify page.tsx exists and has content
cat app/page.tsx | head -30

# Check build output
npm run build 2>&1 | grep -i error

# Verify package.json scripts
cat package.json | grep -A 5 scripts
```

## ✅ Expected Vercel Build Output

When deployment is successful, you should see:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

And routes should include:
- `/` (homepage)
- `/properties`
- `/admin`
- `/contact`
- `/about`
- etc.

## 🎯 Most Likely Solution

**90% of the time, this is because:**
1. Wrong repository was connected, OR
2. Files weren't pushed to GitHub, OR
3. Wrong branch is being deployed

**Quick fix:**
1. Verify all code is pushed: `git push origin main`
2. In Vercel, go to Settings → Git
3. Verify correct repo and branch
4. Click "Redeploy" or push a new commit

---

**If you're still seeing the default page after these steps, share:**
1. Vercel build logs (screenshot or copy)
2. Output of `git status`
3. Output of `npm run build` (local)


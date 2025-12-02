# Troubleshooting Localhost Issues

## ✅ Server Status: RUNNING

The development server is running on port 3000.

## Quick Fixes

### 1. Clear Browser Cache
- **Chrome/Edge:** Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- **Firefox:** Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Or try **Hard Refresh:** `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### 2. Check Browser Console
1. Open your browser
2. Press `F12` or right-click → "Inspect"
3. Go to the **Console** tab
4. Look for any red error messages
5. Share the errors if you see any

### 3. Try Different Browser
- Try opening `http://localhost:3000` in:
  - Chrome
  - Firefox
  - Safari
  - Edge

### 4. Check the URL
Make sure you're visiting:
```
http://localhost:3000
```
NOT:
- `https://localhost:3000` (no https)
- `localhost:3001` (wrong port)
- `127.0.0.1:3000` (should work, but try localhost first)

### 5. Restart the Server
If the page is still blank:

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### 6. Check Terminal for Errors
Look at the terminal where `npm run dev` is running. If you see red error messages, share them.

## Common Issues

### Issue: "This site can't be reached"
**Solution:** The server isn't running. Start it with `npm run dev`

### Issue: Blank white page
**Possible causes:**
1. Browser cache - try hard refresh (Cmd+Shift+R)
2. JavaScript error - check browser console
3. CSS not loading - check Network tab in DevTools

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

## Verify Server is Working

Run this command to test:
```bash
curl http://localhost:3000
```

If you see HTML output, the server is working and the issue is likely browser-related.

## Still Not Working?

1. **Check terminal output** - Look for error messages
2. **Check browser console** - Press F12 and look for errors
3. **Try incognito/private mode** - Rules out browser extensions
4. **Check firewall** - Make sure port 3000 isn't blocked

## Need Help?

Share:
1. What you see (blank page, error message, etc.)
2. Browser console errors (F12 → Console tab)
3. Terminal output from `npm run dev`


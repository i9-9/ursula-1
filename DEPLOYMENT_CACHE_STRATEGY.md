# Deployment Cache Strategy - Ensuring Fresh Content for All Users

## Problem Solved

Previously, users (both new and returning) were seeing cached versions of the site because cache-bust headers were hardcoded with static timestamps. Now, **every deployment automatically generates fresh cache-bust headers** that force all users to see the latest version.

## What Changed

### 1. Dynamic Cache-Bust Headers in `next.config.mjs`

```javascript
async headers() {
  // Generate dynamic cache-bust value on every build
  const buildTimestamp = Date.now();
  const buildVersion = `v${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${buildTimestamp}`;

  return [
    // ... headers with buildVersion variable
  ];
}
```

**Impact**: Every build generates a new cache-bust version automatically.

### 2. Middleware for Runtime Cache Headers (`middleware.ts`)

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate dynamic cache-bust value on every request
  const buildTimestamp = Date.now();
  const buildVersion = `v${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${buildTimestamp}`;

  // Set aggressive no-cache headers
  response.headers.set('X-Cache-Bust', buildVersion);
  response.headers.set('X-Build-Timestamp', buildTimestamp.toString());
  // ...
}
```

**Impact**: Every request gets fresh cache-bust headers, ensuring no cached content is served.

### 3. Cleaned Up `vercel.json`

Removed all hardcoded cache-bust headers like:
- ~~`"value": "naked-domain-v20251015"`~~
- ~~`"value": "mobile-work-v20251015"`~~
- ~~`"value": "home-v20250115"`~~

**Impact**: Vercel config now focuses on static asset caching while middleware handles dynamic content.

## How It Works

### Before Deployment

1. Run `npm run cache-bust` (optional, but recommended)
   - Updates `package.json` with new version
   - Creates `/public/version.json` with build timestamp
   - Cleans `.next` cache

### During Build

2. Next.js builds with dynamic headers
   - `next.config.mjs` generates fresh timestamps
   - Middleware is compiled with cache invalidation logic

### After Deployment

3. Every request gets fresh headers
   - Middleware runs on every request
   - Generates new cache-bust timestamp
   - Sets `no-cache, no-store, must-revalidate` headers
   - Adds `X-Cache-Bust` and `X-Build-Timestamp` headers

### Result

- New users: See latest deployment immediately
- Returning users: See latest deployment immediately (no stale cache)
- All domains: ursulabenavidez.com, www.ursulabenavidez.com, ursula-b.vercel.app

## Deployment Steps

### Standard Deployment

```bash
# Deploy to Vercel (automatic cache-bust)
git add .
git commit -m "Update content"
git push

# Vercel automatically deploys and builds with fresh cache headers
```

### Force Cache Invalidation (Optional)

```bash
# Run cache-bust script before deployment
npm run cache-bust

# Build and deploy
git add .
git commit -m "Force cache invalidation"
git push
```

### Emergency Cache Clear

```bash
# 1. Trigger revalidation API
curl -X POST https://www.ursulabenavidez.com/api/revalidate

# 2. Force new deployment
git commit --allow-empty -m "Force cache clear"
git push
```

## Verification

### Check Cache Headers

```bash
# Test production headers
curl -I https://www.ursulabenavidez.com

# Look for:
# Cache-Control: no-cache, no-store, must-revalidate
# X-Cache-Bust: v20251018-1760800563426  (should be current date/time)
# X-Build-Timestamp: 1760800563426
# X-Domain-Source: www-domain
```

### Verify in Browser

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page (Cmd/Ctrl + Shift + R)
4. Click on document request
5. Check Response Headers:
   - `X-Cache-Bust` should have current date
   - `Cache-Control` should be `no-cache, no-store`

### Test All Domains

```bash
# Run automated test script
npm run test:multi-domain

# Or verify manually
curl -I https://ursulabenavidez.com
curl -I https://www.ursulabenavidez.com
curl -I https://ursula-b.vercel.app
```

## Cache Strategy Summary

| Content Type | Strategy | Duration | Headers |
|--------------|----------|----------|---------|
| HTML Pages | No cache | 0s | `no-cache, no-store, must-revalidate` |
| API Routes | No cache | 0s | `no-cache, no-store, must-revalidate` |
| Static Assets (`/_next/static`) | Long cache | 1 year | `public, max-age=31536000, immutable` |
| Images | Medium cache | 30 days | `public, max-age=2592000, must-revalidate` |

## Monitoring

### Check Current Version

```bash
# View current cache-bust version
cat public/version.json

# Output:
# {
#   "version": "v20251018-1760800440518",
#   "timestamp": 1760800440518,
#   "buildDate": "2025-10-18T15:14:00.519Z",
#   "cacheBusting": true
# }
```

### Verify Cache Invalidation

```bash
# Run verification script
npm run verify:cache

# Check cache-verification-report.json for results
```

## Troubleshooting

### Users Still See Old Content

1. Check headers: `curl -I https://www.ursulabenavidez.com`
2. Verify `X-Cache-Bust` has current date
3. Force revalidation: `curl -X POST https://www.ursulabenavidez.com/api/revalidate`
4. Hard refresh in browser: `Cmd/Ctrl + Shift + R`

### Deployment Not Showing Changes

1. Verify deployment completed on Vercel
2. Check build logs for errors
3. Run `npm run cache-bust` locally
4. Commit and push again
5. Monitor Vercel deployment logs

### Cache Headers Not Working

1. Check `middleware.ts` is at root level
2. Verify middleware is compiled: Look for "ƒ Middleware" in build output
3. Check Vercel deployment settings
4. Ensure no conflicting cache plugins

## Benefits

- **Instant Updates**: All users see new deployments immediately
- **No Manual Cache Clearing**: Automatic on every deployment
- **Multi-Domain Support**: Works across all domains
- **Mobile Optimized**: Proper headers for mobile devices
- **Performance**: Static assets still cached efficiently
- **Debugging**: Headers include timestamps and domain info

## What to Expect

### After Deploying These Changes

1. Users will always see the latest content
2. No need to manually clear cache
3. No need to tell users to "hard refresh"
4. Every deployment is immediately visible
5. Cache-bust headers update automatically

### Performance Impact

- **Minimal**: Only HTML pages bypass cache
- **Optimized**: Static assets (JS, CSS, images) still cached
- **Smart**: Middleware only runs on necessary routes

---

**Last Updated**: 2025-10-18
**Current Version**: v20251018-1760800440518
**Status**: Ready for deployment

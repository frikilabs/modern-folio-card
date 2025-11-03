# Dokploy Deployment Setup Guide

This guide explains how to set up the vCards project on Dokploy with custom domain paths.

## Overview

- **Default Dokploy Domain**: Works at root path `/`
  - Example: `https://vcards-vcardfrikilabs-vzctbr-aec406-154-12-246-193.traefik.me/`

- **Custom Domain with Path**: For subpath deployment
  - Example: `https://holaa.shop/edgarmtz`

## Key Files

### 1. `.dokploy/dokploy.json`
Configuration for Dokploy that includes:
- `VITE_BASE_PATH=/edgarmtz` - Sets the base path for asset URLs
- `buildCommand` - Passes the path during build
- `healthCheck.path=/edgarmtz` - Health checks the correct path

### 2. `vite.config.ts`
- Uses `VITE_BASE_PATH` environment variable
- Defaults to `/` if not set
- This ensures all asset URLs are generated with the correct prefix

### 3. `.traefik/docker-compose.override.yml`
Traefik router configuration for the custom domain:
- Routes `holaa.shop/edgarmtz` to your app
- Strips the `/edgarmtz` prefix before reaching the app
- Redirects HTTP to HTTPS

## Deployment Steps

### For Root Path Deployment (Default)
No special configuration needed. The project works as-is.

```bash
# Assets will be served from:
# /assets/index-[hash].js
# /assets/index-[hash].css
```

### For Subpath Deployment (holaa.shop/edgarmtz)

1. **Update .dokploy/dokploy.json**
   - Change `VITE_BASE_PATH` to your desired path
   - Update `buildCommand` with the same path
   - Update `healthCheck.path` to match

2. **Update .traefik/docker-compose.override.yml**
   - Change `PathPrefix(/edgarmtz)` to your path
   - Update middleware prefix

3. **Rebuild in Dokploy**
   - Dokploy will detect the changes
   - Build with new environment variable
   - Deploy with correct routing

### Example: For `/myprofile` path

1. Edit `.dokploy/dokploy.json`:
```json
{
  "app": {
    "buildCommand": "npm ci && VITE_BASE_PATH=/myprofile npm run build",
    "environment": {
      "VITE_BASE_PATH": "/myprofile"
    }
  },
  "healthCheck": {
    "path": "/myprofile"
  }
}
```

2. Edit `.traefik/docker-compose.override.yml`:
```yaml
- "traefik.http.routers.vcards.rule=Host(`holaa.shop`) && PathPrefix(`/myprofile`)"
- "traefik.http.middlewares.vcards-stripprefix.stripprefix.prefixes=/myprofile"
```

3. Push to GitHub and trigger rebuild in Dokploy

## How It Works

1. **Build Time**
   - Vite reads `VITE_BASE_PATH` environment variable
   - Generates HTML and assets with proper base path
   - Example: `<script src="/edgarmtz/assets/index-[hash].js"></script>`

2. **Traefik Routing**
   - Intercepts requests to `holaa.shop/edgarmtz`
   - Strips `/edgarmtz` prefix with middleware
   - Routes to app at `/`
   - App serves correct assets (with `/edgarmtz` prefix in HTML)

3. **Browser**
   - Receives HTML with base path set
   - Requests assets from `/edgarmtz/assets/...`
   - Traefik routes back to app and serves them

## Troubleshooting

### Assets return 404
- Check that `VITE_BASE_PATH` is set correctly in `.dokploy/dokploy.json`
- Verify `buildCommand` includes the path
- Check browser console for actual asset URLs being requested

### Path prefix not being stripped
- Verify `.traefik/docker-compose.override.yml` exists
- Ensure middleware is correctly applied in router configuration
- Restart Dokploy container/service

### Health checks failing
- Ensure `healthCheck.path` matches your `VITE_BASE_PATH`
- Default `/` won't work if app only responds to `/edgarmtz`

### Testing locally
```bash
# Set environment variable and run preview
VITE_BASE_PATH=/edgarmtz npm run preview

# Or build with the path
VITE_BASE_PATH=/edgarmtz npm run build
npm run preview
```

## Performance Tips

1. **Browser Caching**
   - Assets with hashes are cached for 1 year
   - index.html is always revalidated
   - Safe for production updates

2. **Build Optimization**
   - Uses esbuild (fast minification)
   - Disables sourcemaps in production
   - Gzip compression on the server

3. **Deploy Strategy**
   - Each rebuild generates new hashes
   - Old assets remain cached
   - No 404 errors on updates
   - Zero-downtime deployments

## Current Setup

- **Domain**: holaa.shop
- **Path**: /edgarmtz
- **Full URL**: https://holaa.shop/edgarmtz
- **Build Path**: VITE_BASE_PATH=/edgarmtz

## Additional Notes

- The Traefik override file is only used if Dokploy detects it
- If using a different VPS setup, adapt the routing layer accordingly
- The base path setup is frontend-only and doesn't affect API calls

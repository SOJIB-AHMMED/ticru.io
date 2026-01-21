# Ticru.io Deployment Guide

## Quick Deployment to Production

This guide will help you deploy Ticru.io to production in minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- A hosting platform account (Vercel, Netlify, or similar)

## Step 1: Prepare Your Application

```bash
# Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update environment variables
nano .env
```

## Step 2: Build for Production

```bash
# Run production build
npm run build

# Preview the build locally
npm run preview
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option B: Using GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables from `.env`
6. Click "Deploy"

## Step 4: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

## Step 5: Configure Custom Domain

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

## Environment Variables

Make sure to set these environment variables in your hosting platform:

```
VITE_APP_NAME=Ticru.io
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.ticru.io
VITE_ENABLE_ANALYTICS=true
NODE_ENV=production
```

## Performance Optimization

### Enable CDN

Both Vercel and Netlify provide automatic CDN configuration.

### Enable Caching

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Enable Compression

Compression is automatically enabled on both platforms.

## Monitoring and Analytics

### Set up monitoring:

1. **Vercel Analytics**: Enable in project settings
2. **Google Analytics**: Add tracking ID to environment variables
3. **Error Tracking**: Integrate Sentry or similar service

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Rollback Strategy

### Vercel:
```bash
vercel rollback
```

### Netlify:
Use the Netlify dashboard to rollback to a previous deployment.

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] API rate limiting enabled
- [ ] Security headers configured
- [ ] Dependencies updated

## Post-Deployment

1. Test all functionality in production
2. Monitor error logs
3. Check performance metrics
4. Set up uptime monitoring
5. Configure backup strategy

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Issues

- Check build logs in platform dashboard
- Verify environment variables are set correctly
- Ensure all dependencies are in package.json

## Support

For deployment support, contact:
- Email: support@ticru.io
- Documentation: https://docs.ticru.io

## Next Steps

- Set up SSL certificate
- Configure monitoring alerts
- Enable automatic deployments
- Set up staging environment

---

**Deployment Status**: ✅ Ready for Production

Last Updated: January 2026

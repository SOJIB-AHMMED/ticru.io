# Ticru.io Production Deployment Guide

Comprehensive guide for deploying Ticru.io to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Frontend Deployment](#frontend-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Best Practices](#security-best-practices)
8. [Scaling Strategies](#scaling-strategies)

## Prerequisites

### Required Software

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **Git**
- **Vercel CLI** or **Netlify CLI**

### Required Accounts

- GitHub account
- Vercel or Netlify account
- PostgreSQL hosting (e.g., Supabase, Neon, AWS RDS)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io
```

### 2. Install Dependencies

```bash
# Install npm dependencies
npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```bash
# Application
VITE_APP_NAME=Ticru.io
VITE_APP_VERSION=1.0.0
NODE_ENV=production

# API Configuration
VITE_API_URL=https://api.ticru.io
PORT=8000
HOST=0.0.0.0
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@host:5432/ticru_db

# Security
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
ALLOWED_ORIGINS=https://ticru.io,https://www.ticru.io

# Third-party Services (if needed)
STRIPE_API_KEY=sk_live_...
MAILCHIMP_API_KEY=...
GOOGLE_ANALYTICS_ID=...
```

## Database Configuration

### 1. Create Database

On your PostgreSQL hosting provider:

```sql
CREATE DATABASE ticru_db;
```

### 2. Run Migrations

```bash
# Using CLI
npm run cli init-db

# Or directly with psql
psql $DATABASE_URL -f BUILD-DATABASE.sql
```

### 3. Verify Database

```bash
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

Expected tables:
- users
- contact_messages
- campaigns
- sentiment_logs
- integrations
- agent_conversations
- roleplay_scenarios

## Frontend Deployment

### Vercel Deployment

#### Option 1: GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import `SOJIB-AHMMED/ticru.io` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add environment variables in Vercel dashboard
6. Click "Deploy"

#### Option 2: CLI Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Custom Domain Configuration

#### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records:
   ```
   A Record:    @ → 76.76.21.21
   CNAME:       www → cname.vercel-dns.com
   ```

#### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records:
   ```
   A Record:    @ → 75.2.60.5
   CNAME:       www → your-site.netlify.app
   ```

## Backend Deployment

### Option 1: Vercel Serverless Functions (Recommended)

The Fastify API is configured for Vercel serverless deployment via `vercel.json`.

#### Deploy via GitHub Integration:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration
3. Environment variables can be set in Vercel dashboard
4. Push to main branch triggers automatic deployment

#### Deploy via CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

The `api/index.ts` file will be deployed as a serverless function automatically.

### Option 2: Dedicated Server (e.g., DigitalOcean, AWS EC2)

#### 1. Server Setup

```bash
# SSH into server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL and nginx
sudo apt install postgresql nginx -y

# Clone repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# Install dependencies
npm install

# Build API server
npm run build:api
```

#### 2. Configure PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start API server
pm2 start npm --name "ticru-api" -- run start:api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 3. Configure Systemd Service (Alternative to PM2)

Create `/etc/systemd/system/ticru-api.service`:

```ini
[Unit]
Description=Ticru.io API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/ticru.io
Environment="PATH=/usr/local/bin:/usr/bin"
Environment="NODE_ENV=production"
Environment="PORT=8000"
ExecStart=/usr/bin/node api/index.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable ticru-api
sudo systemctl start ticru-api
sudo systemctl status ticru-api
```

#### 4. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/ticru-api`:

```nginx
server {
    listen 80;
    server_name api.ticru.io;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/ticru-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.ticru.io
```

### Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "api-server:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t ticru-api .
docker run -d -p 8000:8000 --env-file .env ticru-api
```

## Monitoring & Logging

### Application Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Google Analytics**: Add tracking ID to environment variables
3. **Sentry**: For error tracking

```bash
npm install @sentry/browser
```

### Server Monitoring

```bash
# Install monitoring tools
sudo apt install prometheus grafana

# Configure monitoring for API
# Add metrics endpoint to api-server.py
```

### Log Management

```bash
# View API logs
sudo journalctl -u ticru-api -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Security Best Practices

### 1. Environment Variables

- Never commit `.env` files
- Use environment variable management (Vercel Environment Variables, AWS Secrets Manager)
- Rotate secrets regularly

### 2. HTTPS/SSL

- Always use HTTPS in production
- Enable HSTS headers
- Configure security headers in `vercel.json`

### 3. Database Security

```sql
-- Create read-only user for reporting
CREATE USER ticru_readonly WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE ticru_db TO ticru_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ticru_readonly;

-- Create application user with limited privileges
CREATE USER ticru_app WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE ticru_db TO ticru_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ticru_app;
```

### 4. API Security

- Implement rate limiting
- Use JWT authentication
- Validate all inputs
- Enable CORS only for trusted origins

### 5. Regular Updates

```bash
# Update dependencies regularly
npm update
pip install --upgrade -r requirements.txt

# Check for security vulnerabilities
npm audit
pip-audit
```

## Scaling Strategies

### Horizontal Scaling

1. **Frontend**: Automatic with Vercel/Netlify CDN
2. **API**: Use load balancer (Nginx, AWS ALB)
3. **Database**: Read replicas, connection pooling

### Vertical Scaling

- Upgrade server resources
- Optimize database queries
- Enable caching (Redis)

### Caching Strategy

```python
# Add Redis caching to API
import redis
cache = redis.Redis(host='localhost', port=6379)

@app.get("/api/campaigns")
async def get_campaigns():
    cached = cache.get('campaigns')
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    campaigns = fetch_campaigns()
    cache.setex('campaigns', 300, json.dumps(campaigns))
    return campaigns
```

## Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel list

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or checkout specific commit
git checkout <commit-hash>
git push origin main --force
```

## Health Checks

Create monitoring endpoints:

```python
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "version": "1.0.0"
    }

@app.get("/health/db")
async def health_db():
    # Check database connection
    try:
        db.execute("SELECT 1")
        return {"database": "healthy"}
    except:
        return {"database": "unhealthy"}
```

## Support & Troubleshooting

### Common Issues

1. **Build fails**: Check Node.js version, clear cache
2. **API not responding**: Check server logs, firewall rules
3. **Database connection errors**: Verify DATABASE_URL, network access

### Getting Help

- Documentation: https://docs.ticru.io
- GitHub Issues: https://github.com/SOJIB-AHMMED/ticru.io/issues
- Email: support@ticru.io

---

**Production Checklist**

- [ ] Environment variables configured
- [ ] Database initialized and backed up
- [ ] Frontend deployed to CDN
- [ ] API server running with SSL
- [ ] Custom domain configured
- [ ] Monitoring and logging enabled
- [ ] Security headers configured
- [ ] Backup strategy in place
- [ ] CI/CD pipeline set up
- [ ] Load testing completed

**Last Updated**: January 2026

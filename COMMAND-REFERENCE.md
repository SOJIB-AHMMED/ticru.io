# Ticru.io Command Reference

Quick reference guide for all Ticru.io commands and scripts.

## CLI Commands

### Setup & Installation

```bash
# Complete setup wizard
node ticru-cli.js setup

# Install all dependencies
node ticru-cli.js install

# Install npm dependencies only
npm install
```

### Development

```bash
# Start both frontend and backend servers concurrently (recommended)
node ticru-cli.js run
node ticru-cli.js run --frontend-port 3000 --backend-port 8080

# Start development server only (port 5173)
node ticru-cli.js dev
node ticru-cli.js dev --port 3000

# Start API server only (port 8000)
node ticru-cli.js serve
node ticru-cli.js serve --port 8080 --host 0.0.0.0
npm run api:dev

# Start both servers manually (alternative)
npm run dev & npm run api:dev
```

### Building

```bash
# Build for production
node ticru-cli.js build
npm run build

# Build with custom build system
node build-system.js --all

# Build individual steps
node build-system.js --clean
node build-system.js --install
node build-system.js --lint
node build-system.js --type-check
node build-system.js --build
```

### Testing & Quality

```bash
# Run linting
node ticru-cli.js lint
npm run lint

# Type checking
npm run type-check

# Run tests
node ticru-cli.js test
```

### Database

```bash
# Initialize database
node ticru-cli.js init-db

# Initialize with custom SQL file
node ticru-cli.js init-db --sql-file custom-schema.sql

# Direct PostgreSQL access
psql postgresql://localhost/ticru_db -f BUILD-DATABASE.sql
```

### Deployment

```bash
# Deploy to Vercel
node ticru-cli.js deploy --platform vercel
./deploy-vercel.sh

# Deploy to Netlify
node ticru-cli.js deploy --platform netlify
netlify deploy --prod

# Manual Vercel deployment
vercel --prod

# Manual Netlify deployment
netlify deploy --prod --dir=dist
```

### Maintenance

```bash
# Clean build artifacts
node ticru-cli.js clean

# Check application status
node ticru-cli.js status

# View CLI help
node ticru-cli.js --help
node ticru-cli.js <command> --help
```

## NPM Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check

# API server (development with hot reload)
npm run api:dev

# API server (production)
npm run api:start

# Run CLI tool
npm run cli <command>

# Run build system
npm run build:system
```

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required variables:
- `VITE_APP_NAME` - Application name
- `VITE_API_URL` - API endpoint URL
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `HOST` - API server host (default: 0.0.0.0)
- `PORT` - API server port (default: 8000)
- `LOG_LEVEL` - Logging level (default: info)

## Quick Start Guide

### First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# 2. Run setup wizard
node ticru-cli.js setup

# 3. Initialize database (optional)
node ticru-cli.js init-db

# 4. Start development
node ticru-cli.js run
```

### Daily Development Workflow

```bash
# Start both frontend and backend servers (single command)
node ticru-cli.js run

# OR start servers separately in different terminals:
# Terminal 1: Start development server
npm run dev

# Terminal 2: Start API server
npm run api:dev

# Make changes, then lint before committing
npm run lint
npm run type-check
```

### Production Deployment

```bash
# Build the application
node ticru-cli.js build

# Deploy to Vercel
node ticru-cli.js deploy --platform vercel
```

## API Server Endpoints

### Health Check
```
GET /
GET /api/health
```

### Contacts
```
POST /api/contacts
GET  /api/contacts
```

### Campaigns
```
POST /api/campaigns
GET  /api/campaigns
GET  /api/campaigns/{id}
```

### Sentiment Analysis
```
POST /api/sentiment
```

## Build System Options

The `build-system.js` supports multiple flags:

- `--clean` - Remove build artifacts
- `--install` - Install dependencies
- `--lint` - Run code linting
- `--type-check` - Check TypeScript types
- `--build` - Build the application
- `--test` - Run tests
- `--all` - Run complete pipeline (default)

## Troubleshooting

### Port already in use
```bash
# Find process using port
lsof -i :8000
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Dependencies issues
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Clean and rebuild
node ticru-cli.js clean
node ticru-cli.js build
```

## Support

For more information, see:
- [Deployment Guide](docs/DEPLOY-TICRU-IO.md)
- [Production Guide](docs/TICRU-PRODUCTION-GUIDE.pdf)
- [GitHub Repository](https://github.com/SOJIB-AHMMED/ticru.io)

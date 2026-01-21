# Ticru.io Command Reference

Quick reference guide for all Ticru.io commands and scripts.

## CLI Commands

### Setup & Installation

```bash
# Complete setup wizard
npm run cli setup

# Install all dependencies
npm run cli install

# Install npm dependencies only
npm install
```

### Development

```bash
# Start both frontend and backend servers concurrently (recommended)
npm run cli run
npm run cli run --frontend-port 3000 --backend-port 8080

# Start development server only (port 5173)
npm run cli dev
npm run cli dev --port 3000

# Start API server only (port 8000)
npm run cli serve
npm run cli serve --port 8080 --host 0.0.0.0

# Alternative API server commands
npm run dev:api
npm run start:api

# Start both servers manually (alternative)
npm run dev & npm run dev:api
```

### Building

```bash
# Build for production
npm run cli build
npm run build

# Build API server
npm run build:api

# Build with custom build system
node build-system.ts --all

# Build individual steps
node build-system.ts --clean
node build-system.ts --install
node build-system.ts --lint
node build-system.ts --type-check
node build-system.ts --build
node build-system.ts --build-api
```

### Testing & Quality

```bash
# Run linting
npm run cli lint
npm run lint

# Type checking
npm run type-check

# Run tests
npm run cli test
npm test
```

### Database

```bash
# Initialize database
npm run cli init-db

# Initialize with custom SQL file
npm run cli init-db --sql-file custom-schema.sql

# Direct PostgreSQL access
psql postgresql://localhost/ticru_db -f BUILD-DATABASE.sql
```

### Deployment

```bash
# Deploy to Vercel
npm run cli deploy --platform vercel
./deploy-vercel.sh

# Deploy to Netlify
npm run cli deploy --platform netlify
netlify deploy --prod

# Manual Vercel deployment
vercel --prod

# Manual Netlify deployment
netlify deploy --prod --dir=dist
```

### Maintenance

```bash
# Clean build artifacts
npm run cli clean

# Check application status
npm run cli status

# View CLI help
npm run cli -- --help
npm run cli <command> -- --help
```

## NPM Scripts

```bash
# Development
npm run dev              # Frontend dev server
npm run dev:api          # API dev server with auto-reload
npm run start:api        # API server (production mode)

# Building
npm run build            # Build frontend
npm run build:api        # Build API server
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# CLI
npm run cli -- <command> # Run CLI commands
```

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Required variables:
- `VITE_APP_NAME` - Application name
- `VITE_API_URL` - API endpoint URL
- `DATABASE_URL` - PostgreSQL connection string (e.g., `postgresql://localhost/ticru_db`)
- `NODE_ENV` - Environment (development/production)
- `PORT` - API server port (default: 8000)
- `HOST` - API server host (default: 0.0.0.0)
- `LOG_LEVEL` - API logging level (info/debug/error)

## Quick Start Guide

### First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# 2. Run setup wizard
npm run cli setup

# 3. Initialize database (optional)
npm run cli init-db

# 4. Start development
npm run cli run
```

### Daily Development Workflow

```bash
# Start both frontend and backend servers (single command)
npm run cli run

# OR start servers separately in different terminals:
# Terminal 1: Start frontend dev server
npm run dev

# Terminal 2: Start API server
npm run dev:api

# Make changes, then lint before committing
npm run lint
npm run type-check
```

### Production Deployment

```bash
# Build the application
npm run cli build

# Deploy to Vercel
npm run cli deploy --platform vercel
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

The `build-system.ts` supports multiple flags:

- `--clean` - Remove build artifacts
- `--install` - Install dependencies
- `--lint` - Run code linting
- `--type-check` - Check TypeScript types
- `--build` - Build the frontend
- `--build-api` - Build the API server
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
npm run cli clean
npm run cli build
```

### TypeScript errors
```bash
# Check for type errors
npm run type-check

# Build API server to verify TypeScript compilation
npm run build:api
```

## Migration from Python

This project has been migrated from Python FastAPI to Node.js Fastify:

**Old Commands:**
- `python3 ticru-cli.py <command>` → `npm run cli <command>`
- `python3 build-system.py --all` → `node build-system.ts --all`
- `python3 ticru-cli.py serve` → `npm run dev:api`
- `pip install -r requirements.txt` → `npm install`

**File Changes:**
- `api-server.py` → `api/index.ts`
- `ticru-cli.py` → `ticru-cli.ts`
- `build-system.py` → `build-system.ts`
- `requirements.txt` → Deprecated (use `package.json`)

## Support

For more information, see:
- [README.md](README.md)
- [Deployment Guide](docs/DEPLOY-TICRU-IO.md)
- [Production Guide](PRODUCTION-DEPLOYMENT-GUIDE.md)
- [GitHub Repository](https://github.com/SOJIB-AHMMED/ticru.io)

# Ticru.io Command Reference

Quick reference guide for all Ticru.io commands and scripts.

## CLI Commands

### Setup & Installation

```bash
# Complete setup wizard
python3 ticru-cli.py setup

# Install all dependencies
python3 ticru-cli.py install

# Install npm dependencies only
npm install

# Install Python dependencies only
pip install -r requirements.txt
```

### Development

```bash
# Start development server (port 5173)
python3 ticru-cli.py dev
python3 ticru-cli.py dev --port 3000

# Start API server (port 8000)
python3 ticru-cli.py serve
python3 ticru-cli.py serve --port 8080 --host 0.0.0.0

# Start both servers
npm run dev & python3 ticru-cli.py serve
```

### Building

```bash
# Build for production
python3 ticru-cli.py build
npm run build

# Build with custom build system
python3 build-system.py --all

# Build individual steps
python3 build-system.py --clean
python3 build-system.py --install
python3 build-system.py --lint
python3 build-system.py --type-check
python3 build-system.py --build
```

### Testing & Quality

```bash
# Run linting
python3 ticru-cli.py lint
npm run lint

# Type checking
npm run type-check

# Run tests
python3 ticru-cli.py test
npm test
```

### Database

```bash
# Initialize database
python3 ticru-cli.py init-db

# Initialize with custom SQL file
python3 ticru-cli.py init-db --sql-file custom-schema.sql

# Direct PostgreSQL access
psql postgresql://localhost/ticru_db -f BUILD-DATABASE.sql
```

### Deployment

```bash
# Deploy to Vercel
python3 ticru-cli.py deploy --platform vercel
./deploy-vercel.sh

# Deploy to Netlify
python3 ticru-cli.py deploy --platform netlify
netlify deploy --prod

# Manual Vercel deployment
vercel --prod

# Manual Netlify deployment
netlify deploy --prod --dir=dist
```

### Maintenance

```bash
# Clean build artifacts
python3 ticru-cli.py clean
npm run clean

# Check application status
python3 ticru-cli.py status

# View CLI help
python3 ticru-cli.py --help
python3 ticru-cli.py <command> --help
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

## Quick Start Guide

### First Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# 2. Run setup wizard
python3 ticru-cli.py setup

# 3. Initialize database (optional)
python3 ticru-cli.py init-db

# 4. Start development
python3 ticru-cli.py dev
```

### Daily Development Workflow

```bash
# Start development server
npm run dev

# In another terminal, start API server
python3 ticru-cli.py serve

# Make changes, then lint before committing
npm run lint
npm run type-check
```

### Production Deployment

```bash
# Build the application
python3 ticru-cli.py build

# Deploy to Vercel
python3 ticru-cli.py deploy --platform vercel
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

The `build-system.py` supports multiple flags:

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

# Python dependencies
pip install -r requirements.txt --force-reinstall
```

### Build fails
```bash
# Clean and rebuild
python3 ticru-cli.py clean
python3 ticru-cli.py build
```

## Support

For more information, see:
- [Deployment Guide](docs/DEPLOY-TICRU-IO.md)
- [Production Guide](docs/TICRU-PRODUCTION-GUIDE.pdf)
- [GitHub Repository](https://github.com/SOJIB-AHMMED/ticru.io)

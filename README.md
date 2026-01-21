# ticru.io

Modern full-stack web application with TypeScript, React, Node.js Fastify backend, and PostgreSQL database.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# Run the setup script
./setup-local.sh

# Start both frontend and backend servers
npm run cli run             # Starts both servers concurrently

# OR start servers separately
npm run dev                 # Frontend (port 5173)
npm run dev:api            # Backend API (port 8000)
```

## 📁 Project Structure

```
ticru.io/
├── src/                      # TypeScript/React source files
│   ├── 60-second-setup-wizard.ts
│   ├── campaign-manager-ui.tsx
│   ├── sentiment-analysis.ts
│   ├── integration-marketplace.tsx
│   ├── multi-mode-agent.ts
│   └── role-play-simulator.ts
├── api/                      # Fastify backend server
│   ├── index.ts             # Main API server
│   └── types.ts             # TypeScript type definitions
├── docs/                     # Documentation
│   ├── DEPLOY-TICRU-IO.md
│   ├── TICRU-PRODUCTION-GUIDE.pdf
│   └── TICRU-COMMAND-REFERENCE.pdf
├── index.html               # Main HTML entry point
├── styles.css               # Application styles
├── app.js                   # Client-side JavaScript
├── BUILD-DATABASE.sql      # PostgreSQL schema
├── build-system.ts         # Build automation
├── ticru-cli.ts            # CLI tool
├── deploy-vercel.sh        # Deployment script
├── setup-local.sh          # Local setup script
├── package.json            # npm dependencies
├── tsconfig.json           # TypeScript config
├── tsconfig.api.json       # API TypeScript config
├── vercel.json             # Vercel deployment config
├── COMMAND-REFERENCE.md    # CLI commands reference
└── PRODUCTION-DEPLOYMENT-GUIDE.md
```

## 🛠️ Features

### Frontend
- ✨ Responsive web design
- 🎨 Modern UI with smooth animations
- 📱 Mobile-first approach
- ⚡ TypeScript for type safety
- ⚛️ React components

### Backend
- 🚀 Fastify REST API
- 🗄️ PostgreSQL database
- 🔐 Secure authentication
- 📊 Sentiment analysis
- 🤖 AI agent with multiple modes
- 📈 Campaign management
- ✅ Zod schema validation
- 🎯 Full TypeScript support

### Deployment
- ☁️ Vercel/Netlify ready
- 🐳 Docker support
- 📦 Automated build system
- 🔄 CI/CD pipeline
- 📝 Comprehensive documentation

## 📚 Documentation

- **[Command Reference](COMMAND-REFERENCE.md)** - All CLI commands
- **[Deployment Guide](docs/DEPLOY-TICRU-IO.md)** - Quick deployment
- **[Production Guide](PRODUCTION-DEPLOYMENT-GUIDE.md)** - Full production setup

## 🔧 Development

```bash
# Start both frontend and backend servers
npm run cli run

# OR start servers separately:
# Frontend development
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check

# Backend development
npm run dev:api
npm run start:api
npm run build:api
npm run cli serve

# Build & deploy
node build-system.ts --all
./deploy-vercel.sh
```

## 🗄️ Database

```bash
# Initialize database
npm run cli init-db

# Direct PostgreSQL
psql $DATABASE_URL -f BUILD-DATABASE.sql
```

## 🚀 Deployment

```bash
# Vercel
./deploy-vercel.sh
vercel --prod

# Netlify
netlify deploy --prod --dir=dist
```

## 🧪 Testing

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Tests
npm run cli test
```

## 🔧 CLI Commands

```bash
# Development
npm run cli dev          # Start frontend dev server
npm run cli serve        # Start API server
npm run cli run          # Start both servers

# Build & Deploy
npm run cli build        # Build application
npm run cli deploy       # Deploy to production

# Database
npm run cli init-db      # Initialize database

# Utilities
npm run cli install      # Install dependencies
npm run cli clean        # Clean build artifacts
npm run cli setup        # Run setup wizard
npm run cli status       # Check app status
npm run cli -- --help    # Show all commands
```

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please read the documentation before submitting PRs.

## 📧 Support

- GitHub Issues: https://github.com/SOJIB-AHMMED/ticru.io/issues
- Documentation: See docs/ folder

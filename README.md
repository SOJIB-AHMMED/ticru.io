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
node ticru-cli.js run        # Starts both servers concurrently

# OR start servers separately
npm run dev                  # Frontend (port 5173)
npm run api:dev              # Backend API (port 8000)
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
├── api/                      # Node.js Fastify API server
│   ├── server.ts            # Main API server
│   └── index.ts             # Vercel serverless function
├── docs/                     # Documentation
│   ├── DEPLOY-TICRU-IO.md
│   ├── TICRU-PRODUCTION-GUIDE.pdf
│   └── TICRU-COMMAND-REFERENCE.pdf
├── index.html               # Main HTML entry point
├── styles.css               # Application styles
├── app.js                   # Client-side JavaScript
├── ticru-cli.js            # CLI tool (Node.js)
├── build-system.js         # Build automation (Node.js)
├── BUILD-DATABASE.sql      # PostgreSQL schema
├── deploy-vercel.sh        # Deployment script
├── setup-local.sh          # Local setup script
├── package.json            # npm dependencies
├── tsconfig.json           # TypeScript config
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
- 🚀 Fastify REST API (Node.js)
- 🗄️ PostgreSQL database support
- 🔐 Request validation with Zod schemas
- 📊 Sentiment analysis
- 🤖 AI agent with multiple modes
- 📈 Campaign management
- ⚡ CORS enabled for frontend origins

### Deployment
- ☁️ Vercel/Netlify ready
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
node ticru-cli.js run

# OR start servers separately:
# Frontend development
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check

# Backend development
npm run api:dev              # Start API server with hot reload
node ticru-cli.js serve      # Alternative API start command

# Build & deploy
node build-system.js --all
./deploy-vercel.sh
```

## 🗄️ Database

```bash
# Initialize database
node ticru-cli.js init-db

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

# API server testing
# Start the server and test endpoints:
curl http://localhost:8000/api/health
```

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please read the documentation before submitting PRs.

## 📧 Support

- GitHub Issues: https://github.com/SOJIB-AHMMED/ticru.io/issues
- Documentation: See docs/ folder

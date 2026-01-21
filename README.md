# ticru.io

Modern full-stack web application with TypeScript, React, Python FastAPI backend, and PostgreSQL database.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SOJIB-AHMMED/ticru.io.git
cd ticru.io

# Run the setup script
./setup-local.sh

# Start both frontend and backend servers
python3 ticru-cli.py run        # Starts both servers concurrently

# OR start servers separately
npm run dev                     # Frontend (port 5173)
python3 ticru-cli.py serve     # Backend API (port 8000)
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
├── docs/                     # Documentation
│   ├── DEPLOY-TICRU-IO.md
│   ├── TICRU-PRODUCTION-GUIDE.pdf
│   └── TICRU-COMMAND-REFERENCE.pdf
├── index.html               # Main HTML entry point
├── styles.css               # Application styles
├── app.js                   # Client-side JavaScript
├── api-server.py           # FastAPI backend server
├── BUILD-DATABASE.sql      # PostgreSQL schema
├── build-system.py         # Build automation
├── ticru-cli.py           # CLI tool
├── deploy-vercel.sh       # Deployment script
├── setup-local.sh         # Local setup script
├── package.json           # npm dependencies
├── tsconfig.json          # TypeScript config
├── vercel.json            # Vercel deployment config
├── requirements.txt       # Python dependencies
├── COMMAND-REFERENCE.md   # CLI commands reference
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
- 🚀 FastAPI REST API
- 🗄️ PostgreSQL database
- 🔐 Secure authentication
- 📊 Sentiment analysis
- 🤖 AI agent with multiple modes
- 📈 Campaign management

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
python3 ticru-cli.py run

# OR start servers separately:
# Frontend development
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check

# Backend development
python3 ticru-cli.py serve
python3 ticru-cli.py dev

# Build & deploy
python3 build-system.py --all
./deploy-vercel.sh
```

## 🗄️ Database

```bash
# Initialize database
python3 ticru-cli.py init-db

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
python3 ticru-cli.py test
```

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please read the documentation before submitting PRs.

## 📧 Support

- GitHub Issues: https://github.com/SOJIB-AHMMED/ticru.io/issues
- Documentation: See docs/ folder

#!/bin/bash
# Local setup script for Ticru.io
# Usage: ./setup-local.sh

set -e

echo "🎯 Ticru.io Local Setup"
echo "======================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm: v$NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}✗ Python 3 not found${NC}"
    echo "Please install Python 3.9+ from https://www.python.org/"
    exit 1
fi

# Check pip
if command -v pip3 &> /dev/null; then
    PIP_VERSION=$(pip3 --version | cut -d' ' -f2)
    echo -e "${GREEN}✓ pip: v$PIP_VERSION${NC}"
else
    echo -e "${RED}✗ pip3 not found${NC}"
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version | cut -d' ' -f3)
    echo -e "${GREEN}✓ Git: v$GIT_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Git not found${NC}"
fi

echo ""
echo "All prerequisites met!"
echo ""

# Install dependencies
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Installing Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "→ Installing npm packages..."
npm install
echo -e "${GREEN}✓ npm packages installed${NC}"
echo ""

if [ -f "requirements.txt" ]; then
    echo "→ Installing Python packages..."
    pip3 install -r requirements.txt
    echo -e "${GREEN}✓ Python packages installed${NC}"
else
    echo -e "${YELLOW}⚠ requirements.txt not found, skipping Python packages${NC}"
fi

# Setup environment
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Setting Up Environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "→ Creating .env file from .env.example..."
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created${NC}"
        echo -e "${YELLOW}⚠ Please edit .env and add your configuration${NC}"
    else
        echo -e "${YELLOW}⚠ .env.example not found${NC}"
    fi
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Database setup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Database Setup (Optional)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "Do you want to initialize the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v psql &> /dev/null; then
        echo "→ Initializing database..."
        if python3 ticru-cli.py init-db; then
            echo -e "${GREEN}✓ Database initialized${NC}"
        else
            echo -e "${YELLOW}⚠ Database initialization failed${NC}"
            echo "You can run 'python3 ticru-cli.py init-db' later"
        fi
    else
        echo -e "${YELLOW}⚠ PostgreSQL (psql) not found${NC}"
        echo "Install PostgreSQL to initialize the database"
    fi
else
    echo "Skipping database setup"
fi

# Make scripts executable
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Making Scripts Executable"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

chmod +x deploy-vercel.sh
chmod +x setup-local.sh
chmod +x ticru-cli.py
chmod +x build-system.py
echo -e "${GREEN}✓ Scripts are now executable${NC}"

# Final summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "  ${BLUE}Development:${NC}"
echo "    • npm run dev              - Start frontend dev server"
echo "    • python3 ticru-cli.py serve - Start API server"
echo ""
echo "  ${BLUE}Building:${NC}"
echo "    • npm run build           - Build for production"
echo "    • python3 build-system.py - Complete build pipeline"
echo ""
echo "  ${BLUE}Deployment:${NC}"
echo "    • ./deploy-vercel.sh      - Deploy to Vercel"
echo "    • vercel --prod           - Deploy with Vercel CLI"
echo ""
echo "  ${BLUE}Tools:${NC}"
echo "    • python3 ticru-cli.py --help  - CLI commands"
echo "    • python3 ticru-cli.py status  - Check app status"
echo ""
echo "For more information, see:"
echo "  • COMMAND-REFERENCE.md"
echo "  • docs/DEPLOY-TICRU-IO.md"
echo "  • PRODUCTION-DEPLOYMENT-GUIDE.md"
echo ""
echo "Happy coding! 🚀"

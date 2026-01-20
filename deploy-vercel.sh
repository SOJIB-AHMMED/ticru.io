#!/bin/bash
# Deploy Ticru.io to Vercel
# Usage: ./deploy-vercel.sh

set -e

echo "🚀 Deploying Ticru.io to Vercel"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}✗ Vercel CLI not found${NC}"
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo -e "${GREEN}✓ Vercel CLI found${NC}"

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠ Not logged in to Vercel${NC}"
    echo "Please login to Vercel..."
    vercel login
fi

echo -e "${GREEN}✓ Logged in to Vercel${NC}"

# Run pre-deployment checks
echo ""
echo "Running pre-deployment checks..."

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠ Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Git status check passed${NC}"

# Run linting
echo ""
echo "Running linting..."
if npm run lint; then
    echo -e "${GREEN}✓ Linting passed${NC}"
else
    echo -e "${RED}✗ Linting failed${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

# Run type checking
echo ""
echo "Running type check..."
if npm run type-check; then
    echo -e "${GREEN}✓ Type check passed${NC}"
else
    echo -e "${RED}✗ Type check failed${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 1
    fi
fi

# Build the application
echo ""
echo "Building application..."
if npm run build; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Check build output
if [ ! -d "dist" ]; then
    echo -e "${RED}✗ Build output directory not found${NC}"
    exit 1
fi

FILE_COUNT=$(find dist -type f | wc -l)
echo -e "${GREEN}✓ Build output: $FILE_COUNT files${NC}"

# Deployment type
echo ""
echo "Select deployment type:"
echo "1) Production (--prod)"
echo "2) Preview"
read -p "Enter choice (1 or 2): " -n 1 -r
echo

if [[ $REPLY == "1" ]]; then
    DEPLOY_ENV="--prod"
    ENV_NAME="production"
else
    DEPLOY_ENV=""
    ENV_NAME="preview"
fi

# Deploy to Vercel
echo ""
echo "Deploying to Vercel ($ENV_NAME)..."
echo "================================"

if vercel $DEPLOY_ENV; then
    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}================================${NC}"
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls --prod | head -n 2 | tail -n 1 | awk '{print $2}')
    if [ -n "$DEPLOYMENT_URL" ]; then
        echo ""
        echo "Deployment URL: https://$DEPLOYMENT_URL"
    fi
    
    # Post-deployment checks
    echo ""
    echo "Running post-deployment checks..."
    sleep 5
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$DEPLOYMENT_URL")
        if [ "$HTTP_STATUS" == "200" ]; then
            echo -e "${GREEN}✓ Site is accessible (HTTP $HTTP_STATUS)${NC}"
        else
            echo -e "${YELLOW}⚠ Site returned HTTP $HTTP_STATUS${NC}"
        fi
    fi
    
    echo ""
    echo "Next steps:"
    echo "  • Test the deployment thoroughly"
    echo "  • Monitor error logs and analytics"
    echo "  • Update DNS if needed"
    
else
    echo ""
    echo -e "${RED}================================${NC}"
    echo -e "${RED}✗ Deployment failed${NC}"
    echo -e "${RED}================================${NC}"
    exit 1
fi

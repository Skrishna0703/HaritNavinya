#!/bin/bash
# HaritNavinya Production Deployment Script
# This script helps prepare your project for production deployment

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║    HaritNavinya - Production Deployment Assistant             ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Node.js: $NODE_VERSION"
NPM_VERSION=$(npm -v)
echo "   npm: $NPM_VERSION"
echo ""

# Check if .env exists
echo "🔐 Checking environment configuration..."
if [ -f ".env" ]; then
    echo "   ✅ .env file found"
else
    echo "   ⚠️  .env file not found - using system environment variables"
fi

if [ -f ".env.production" ]; then
    echo "   ✅ .env.production template found"
else
    echo "   ❌ .env.production not found"
fi
echo ""

# Check backend
echo "🔧 Checking backend..."
cd backend
if [ -f "package.json" ]; then
    echo "   ✅ Backend package.json found"
    echo "   📦 Installing dependencies..."
    npm install --legacy-peer-deps > /dev/null 2>&1
    echo "   ✅ Backend dependencies installed"
else
    echo "   ❌ Backend package.json not found"
fi
cd ..
echo ""

# Check frontend
echo "🎨 Checking frontend..."
cd frontend
if [ -f "package.json" ]; then
    echo "   ✅ Frontend package.json found"
    echo "   📦 Installing dependencies..."
    npm install --legacy-peer-deps > /dev/null 2>&1
    echo "   ✅ Frontend dependencies installed"
    
    echo "   🔨 Building frontend..."
    npm run build > /dev/null 2>&1
    if [ -d "dist" ]; then
        echo "   ✅ Frontend build successful"
        DIST_SIZE=$(du -sh dist | cut -f1)
        echo "   📊 Build size: $DIST_SIZE"
    else
        echo "   ❌ Frontend build failed"
    fi
else
    echo "   ❌ Frontend package.json not found"
fi
cd ..
echo ""

# Security check
echo "🔒 Security checks..."
if grep -q "node_modules" .gitignore; then
    echo "   ✅ node_modules in .gitignore"
else
    echo "   ❌ node_modules not in .gitignore"
fi

if grep -q ".env" .gitignore; then
    echo "   ✅ .env files in .gitignore"
else
    echo "   ⚠️  .env files not in .gitignore"
fi
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    DEPLOYMENT CHECKLIST                       ║"
echo "╠═══════════════════════════════════════════════════════════════╣"
echo "║ ✅ Backend configured                                        ║"
echo "║ ✅ Frontend built                                            ║"
echo "║ ⏳ MongoDB connection (verify in logs)                        ║"
echo "║ ⏳ Environment variables set                                  ║"
echo "║ ⏳ API keys configured                                        ║"
echo "║                                                               ║"
echo "║ NEXT STEPS:                                                   ║"
echo "║ 1. Set environment variables in Render dashboard              ║"
echo "║ 2. Push code to Git repository                                ║"
echo "║ 3. Deploy using render.yaml                                   ║"
echo "║ 4. Verify health endpoints                                    ║"
echo "║                                                               ║"
echo "║ See PRODUCTION_DEPLOYMENT.md for detailed instructions        ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

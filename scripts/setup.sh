#!/bin/bash
set -e

echo "🚀 Setting up GymPulse development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker not found. You'll need it for local services."; }
command -v supabase >/dev/null 2>&1 || { echo "⚠️  Supabase CLI not found. Install: npm install -g supabase"; }

# Install root dependencies
echo "📦 Installing root dependencies..."
pnpm install

# Install mobile dependencies
echo "📱 Installing Flutter dependencies..."
cd apps/mobile
flutter pub get
cd ../..

# Setup Python AI service
echo "🐍 Setting up AI service..."
cd services/ai-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd ../..

# Copy env file if not exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual credentials!"
fi

# Start Supabase locally
echo "🗄️  Starting Supabase locally..."
supabase start

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env with your credentials"
echo "  2. pnpm docker:up    # Start backend services"
echo "  3. pnpm mobile:dev   # Start Flutter app"
echo "  4. pnpm web:admin:dev # Start admin panel"
echo "  5. pnpm web:shop:dev  # Start e-commerce"
echo ""

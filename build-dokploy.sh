#!/bin/bash
set -e

echo "🔨 Starting build process for Dokploy..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.vite

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Build the project
echo "🏗️  Building React app..."
npm run build

# Verify build
echo "✅ Verifying build..."
if [ ! -d "dist" ]; then
  echo "❌ Build failed: dist directory not found"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo "❌ Build failed: index.html not found"
  exit 1
fi

echo "✨ Build completed successfully!"
echo "📊 Build output:"
ls -lh dist/assets/ || true

#!/bin/bash
# web-artifacts-builder — bundle-artifact.sh
# Source: https://github.com/anthropics/skills (Apache 2.0)
set -e

echo "📦 Bundling React app to single HTML artifact..."

if [ ! -f "package.json" ]; then
  echo "❌ Error: No package.json found. Run this script from your project root."
  exit 1
fi

if [ ! -f "index.html" ]; then
  echo "❌ Error: No index.html found in project root."
  exit 1
fi

echo "📦 Installing bundling dependencies..."
pnpm add -D parcel @parcel/config-default parcel-resolver-tspaths html-inline

if [ ! -f ".parcelrc" ]; then
  echo "🔧 Creating Parcel configuration with path alias support..."
  cat > .parcelrc << 'EOF'
{
  "extends": "@parcel/config-default",
  "resolvers": ["parcel-resolver-tspaths", "..."]
}
EOF
fi

echo "🧹 Cleaning previous build..."
rm -rf dist bundle.html

echo "🔨 Building with Parcel..."
pnpm exec parcel build index.html --dist-dir dist --no-source-maps

echo "🎯 Inlining all assets into single HTML file..."
pnpm exec html-inline dist/index.html > bundle.html

FILE_SIZE=$(du -h bundle.html | cut -f1)
echo ""
echo "✅ Bundle complete! Output: bundle.html ($FILE_SIZE)"
echo "   Open bundle.html in a browser to test."

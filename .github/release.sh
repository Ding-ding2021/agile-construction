#!/bin/bash
# release.sh — 发布创建脚本
# Usage: .github/release.sh <milestone-name> [tag]
# Example: .github/release.sh "M1 - Phase 1 底座搭建" v1.0.0

set -euo pipefail

MILESTONE="${1:?Usage: .github/release.sh <milestone-name> [tag]}"
TAG="${2:-}"

echo "=== Pre-release Checklist ==="

# 1. Build check
echo "[1/5] Running build check..."
npm run build 2>/dev/null || { echo "FAILED: build"; exit 1; }
echo "  ✓ build passed"

# 2. Lint check
echo "[2/5] Running lint check..."
npm run lint 2>/dev/null || { echo "FAILED: lint"; exit 1; }
echo "  ✓ lint passed"

# 3. Test check
echo "[3/5] Running tests..."
npm run test:run 2>/dev/null || { echo "FAILED: tests"; exit 1; }
echo "  ✓ tests passed"

# 4. Create release via script
echo "[4/5] Creating GitHub release..."
TAG_ARG=""
if [ -n "$TAG" ]; then
    TAG_ARG="--tag $TAG"
fi
python scripts/gh-release.py --milestone "$MILESTONE" $TAG_ARG
echo "  ✓ release created"

# 5. Update development plan status
echo "[5/5] Update development-plan-v1.2.md progress..."
echo "  ⚠  Manual step: update the progress status in development-plan-v1.2.md"

echo ""
echo "✓ Release process complete!"
echo "Next: push the tag and verify GitHub Release page."

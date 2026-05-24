#!/bin/bash
set -e

echo "==> Fixing ecommerce-frontend repo..."

# 1. Remove dist from git tracking
git rm -r --cached dist/ 2>/dev/null && echo "✓ Removed dist/ from git tracking" || echo "dist/ already untracked"

# 2. Rewrite .gitignore as clean UTF-8
cat > .gitignore << 'GITIGNORE'
node_modules/
dist/
.env
.env.local
.env.production
.DS_Store
*.log
GITIGNORE
echo "✓ Fixed .gitignore"

# 3. Move src/.env to root if it has content
if [ -s src/.env ]; then
  cp src/.env .env
  git rm --cached src/.env 2>/dev/null || true
  echo "✓ Moved src/.env to root .env"
fi

# 4. Commit and push
git add -A
git commit -m "fix: remove committed dist/, fix .gitignore, force Vercel rebuild"
git push

echo ""
echo "==> Done! Vercel will now rebuild from source."
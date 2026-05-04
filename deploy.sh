#!/bin/bash
# Commit edits and deploy florbotanica-site to Vercel.
# Usage:  ./deploy.sh "describe what changed"
#         ./deploy.sh                    (uses a default message)

set -e
cd "$(dirname "$0")"

MSG="${1:-Update site}"

if ! (git diff --quiet && git diff --cached --quiet); then
  git add -A
  git commit -m "$MSG"
  git push
  echo "✓ Committed and pushed to GitHub."
else
  echo "(no git changes to commit)"
fi

echo "Deploying to Vercel..."
vercel deploy --prod --yes >/dev/null 2>&1 && echo "✓ Live: https://florbotanica-site.vercel.app/"

#/usr/bin/env bash

set -e

cd $(dirname "$0")/..

if [ -z "$CI" ]; then
  npm run lint
  npm run typecheck
  npm test --ci
  npm run apicheck
else
  npm run lint --quiet
  npm run typecheck
  npm test --ci --runInBand --coverage
  npm run apicheck
fi

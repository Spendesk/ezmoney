#/usr/bin/env bash

set -e

cd $(dirname "$0")/..

if [ -z "$CI" ]; then
  yarn lint
  yarn typecheck
  yarn test --ci
  yarn apicheck
else
  yarn lint --quiet
  yarn typecheck
  yarn test --ci --runInBand --coverage
  yarn apicheck
fi

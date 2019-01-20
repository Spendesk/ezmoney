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
  export JEST_JUNIT_OUTPUT=".temp/test-reports/junit/results.xml"
  yarn test --ci --runInBand --coverage --reporters="jest-junit"
  yarn apicheck
fi

#!/usr/bin/env bash

# Runs a command on each commit since master

set -e

cd $(dirname "$0")/..

if [ "$CIRCLE_BRANCH" = "master" ]; then
  eval "$1"
else
  git checkout $CIRCLE_BRANCH
  GIT_SEQUENCE_EDITOR=true \
    git rebase master \
    --interactive \
    --autosquash \
    --exec "eval '$1'"
fi

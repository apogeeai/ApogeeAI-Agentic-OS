#!/bin/bash
set -e

if [ -f package-lock.json ]; then
  npm install --no-audit --no-fund --loglevel=error
fi

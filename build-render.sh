#!/bin/bash

echo "=== Simple Build Script Started ==="

# Just build the frontend assets
echo "=== Installing Node Dependencies ==="
npm ci --production=false

echo "=== Building Frontend Assets ==="
npm run build

echo "=== Build Script Completed ==="

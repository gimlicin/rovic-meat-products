#!/bin/bash

echo "=== Starting Simple Static Server ==="

# Install a simple HTTP server
npm install -g http-server

# Serve the built assets
echo "Starting static server on port $PORT"
cd public
http-server -p $PORT -a 0.0.0.0

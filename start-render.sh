#!/bin/bash

echo "=== Starting RovicApp ==="

# Ensure PHP is available
php --version

# Start Laravel server
echo "Starting Laravel on port $PORT"
php artisan serve --host=0.0.0.0 --port=$PORT

#!/usr/bin/env bash
# Render.com build script for RovicAppv2

echo "Starting RovicAppv2 build process..."

# Install PHP dependencies
echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction

# Install Node.js dependencies  
echo "Installing NPM dependencies..."
npm ci

# Build frontend assets
echo "Building frontend assets..."
npm run build

# Generate application key if not set
echo "Setting up Laravel application..."
php artisan key:generate --force

# Cache Laravel configuration
echo "Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache  
php artisan view:cache

# Create storage link
echo "Creating storage link..."
php artisan storage:link

echo "Build process completed successfully!"

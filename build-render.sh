#!/bin/bash

echo "=== Render Build Script Started ==="

# Update package lists
apt-get update

# Install PHP 8.2 and required extensions
apt-get install -y software-properties-common
add-apt-repository -y ppa:ondrej/php
apt-get update
apt-get install -y \
    php8.2 \
    php8.2-cli \
    php8.2-fpm \
    php8.2-mysql \
    php8.2-pgsql \
    php8.2-sqlite3 \
    php8.2-redis \
    php8.2-xml \
    php8.2-mbstring \
    php8.2-curl \
    php8.2-zip \
    php8.2-intl \
    php8.2-bcmath \
    php8.2-gd \
    unzip

# Install Composer
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# Set PHP as default
update-alternatives --set php /usr/bin/php8.2

# Verify installations
php --version
composer --version
node --version
npm --version

echo "=== Installing PHP Dependencies ==="
# Set composer settings for better memory handling
export COMPOSER_MEMORY_LIMIT=-1
export COMPOSER_PROCESS_TIMEOUT=0

# Install PHP dependencies
composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

echo "=== Installing Node Dependencies ==="
npm ci --production=false

echo "=== Building Assets ==="
npm run build

echo "=== Laravel Setup ==="
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate --force

# Set permissions
chmod -R 755 storage bootstrap/cache

echo "=== Build Script Completed ==="

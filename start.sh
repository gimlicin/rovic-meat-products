#!/bin/bash

echo "Starting RovicApp with database setup..."

# Wait a moment for services to be ready
sleep 5

# Debug environment variables
echo "=== Environment Debug ==="
echo "DATABASE_URL: ${DATABASE_URL:-NOT_SET}"
echo "DB_CONNECTION: ${DB_CONNECTION:-NOT_SET}"
echo "DB_HOST: ${DB_HOST:-NOT_SET}"
echo "DB_DATABASE: ${DB_DATABASE:-NOT_SET}"
echo "========================="

# Run database setup if DATABASE_URL is available
if [ ! -z "$DATABASE_URL" ]; then
    echo "Database URL found, running setup..."
    echo "Full DATABASE_URL: $DATABASE_URL"
    php artisan migrate --force || echo "Migration skipped"
    php artisan db:seed --force || echo "Seeding skipped" 
    php artisan storage:link || echo "Storage link skipped"
    php artisan config:cache || echo "Config cache skipped"
    echo "Database setup completed"
else
    echo "No DATABASE_URL found, skipping database setup"
fi

# Configure nginx with proper PORT
echo "Configuring nginx for port $PORT..."
sed -i "s/listen 80/listen $PORT/g" /etc/nginx/sites-available/default

# Start supervisor to run nginx + php-fpm
echo "Starting web services..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf

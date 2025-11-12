# Rovic Meatshop - E-commerce Application

A modern e-commerce web application built for Rovic Meatshop, featuring product management, order processing, and customer management with support for both guest and authenticated users.

## 🚀 Tech Stack

### Backend
- **Laravel 12** - PHP Framework
- **PHP 8.2+** - Server-side language
- **SQLite** - Default database (configurable to MySQL/PostgreSQL)
- **Inertia.js** - Modern monolith architecture

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Vite 7** - Build tool and dev server

### Additional Tools
- **Laravel Socialite** - Social authentication (Facebook, Google)
- **Pest** - Testing framework
- **Laravel Pint** - Code style fixer
- **ESLint & Prettier** - Code quality tools

## 📋 Features

### Customer Features
- Browse products by category
- Shopping cart functionality
- Guest and authenticated checkout
- Multiple payment methods (Cash, QR Code)
- Order tracking for guest users
- Order history for registered users
- Social login (Facebook, Google)
- Reorder functionality

### Admin Features
- Product management (CRUD operations)
- Category management
- Order management and status updates
- Stock tracking and inventory management
- Payment proof verification
- Low stock alerts
- Dashboard analytics

### Wholesaler Features
- Bulk order capabilities
- Special pricing (configurable)

## 🛠️ Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite (or MySQL/PostgreSQL)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd RovicAppv2
```

### Step 2: Install PHP Dependencies
```bash
composer install
```

### Step 3: Install JavaScript Dependencies
```bash
npm install
```

### Step 4: Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 5: Configure Environment Variables
Edit `.env` file and configure the following:

```env
APP_NAME="Rovic Meatshop"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (SQLite by default)
DB_CONNECTION=sqlite

# For MySQL/PostgreSQL, uncomment and configure:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=rovicshop
# DB_USERNAME=root
# DB_PASSWORD=

# Session Configuration (8 hours = 480 minutes)
SESSION_DRIVER=database
SESSION_LIFETIME=480

# Social Authentication (Optional)
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Step 6: Database Setup
```bash
# Create SQLite database file (if using SQLite)
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### Step 7: Storage Setup
```bash
# Create symbolic link for storage
php artisan storage:link
```

### Step 8: Start Development Servers
```bash
# Option 1: Use the built-in dev script (recommended)
composer dev

# Option 2: Run servers separately
# Terminal 1 - Laravel server
php artisan serve

# Terminal 2 - Queue worker
php artisan queue:listen

# Terminal 3 - Vite dev server
npm run dev
```

The application will be available at `http://localhost:8000`

## 🧪 Testing

```bash
# Run all tests
composer test

# Run tests with coverage
php artisan test --coverage

# Run specific test file
php artisan test tests/Feature/OrderTest.php
```

## 🎨 Code Quality

```bash
# Fix PHP code style
./vendor/bin/pint

# Check TypeScript types
npm run types

# Lint JavaScript/TypeScript
npm run lint

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## 📦 Building for Production

### Step 1: Optimize Configuration
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache
```

### Step 2: Build Frontend Assets
```bash
npm run build
```

### Step 3: Set Production Environment
Update `.env`:
```env
APP_ENV=production
APP_DEBUG=false
```

### Step 4: Optimize Composer Autoloader
```bash
composer install --optimize-autoloader --no-dev
```

## 🗂️ Project Structure

```
RovicAppv2/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # Application controllers
│   │   ├── Middleware/       # Custom middleware
│   │   ├── Requests/         # Form request validation
│   │   └── Resources/        # API resources
│   ├── Models/               # Eloquent models
│   └── Policies/             # Authorization policies
├── database/
│   ├── migrations/           # Database migrations
│   ├── seeders/              # Database seeders
│   └── factories/            # Model factories
├── resources/
│   ├── js/
│   │   ├── components/       # React components
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Inertia pages
│   │   └── contexts/         # React contexts
│   └── css/                  # Stylesheets
├── routes/
│   ├── web.php               # Web routes
│   ├── api.php               # API routes
│   ├── auth.php              # Authentication routes
│   └── settings.php          # Settings routes
└── public/                   # Public assets
```

## 🔐 User Roles

### Admin
- Full access to all features
- Product and category management
- Order management
- User management

### Wholesaler
- Bulk order capabilities
- View own orders
- Standard customer features

### Customer
- Browse and purchase products
- View order history
- Manage profile

### Guest
- Browse products
- Place orders
- Track orders via Order ID

## 📱 Key Routes

### Public Routes
- `/` - Home page
- `/products` - Product listing
- `/products/{id}` - Product details
- `/checkout` - Checkout page
- `/track-order` - Guest order tracking

### Authenticated Routes
- `/dashboard` - User dashboard
- `/my-orders` - Order history
- `/orders/{id}` - Order details

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management

## 🔧 Configuration

### Payment Methods
Configure payment methods in `app/Models/Order.php`:
- Cash on Delivery/Pickup
- QR Code Payment (with proof upload)

### Stock Management
Products support:
- Stock tracking (enable/disable per product)
- Reserved stock for pending orders
- Low stock alerts
- Maximum order quantity limits

### Order Statuses
- `pending` - Order placed, awaiting payment
- `payment_submitted` - Payment proof uploaded
- `payment_approved` - Payment verified
- `payment_rejected` - Payment rejected
- `confirmed` - Order confirmed
- `preparing` - Order being prepared
- `ready` - Ready for pickup/delivery
- `completed` - Order completed
- `cancelled` - Order cancelled

### Session Management
The application uses an **8-hour session lifetime** (480 minutes) to provide a better user experience:
- **Why 8 hours?** Allows admin users to work throughout the day without interruption
- **Security:** CSRF protection remains enabled for all requests
- **Customization:** Adjust `SESSION_LIFETIME` in `.env` if needed
- **Production:** Consider reducing to 4-6 hours for tighter security

**Session expires when:**
- User is inactive for 8 hours
- User logs out
- Browser cookies are cleared

**To change session lifetime:**
```env
# .env
SESSION_LIFETIME=240  # 4 hours
SESSION_LIFETIME=360  # 6 hours  
SESSION_LIFETIME=480  # 8 hours (default)
```

## 🐛 Troubleshooting

### Issue: Vite not connecting
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Issue: Database locked (SQLite)
```bash
# Stop all artisan processes
# Delete database/database.sqlite-journal if exists
# Restart the application
```

### Issue: Storage link not working
```bash
php artisan storage:link
```

### Issue: Permission denied on storage
```bash
chmod -R 775 storage bootstrap/cache
```

### Issue: 419 Page Expired / CSRF Token Mismatch
This error occurs when the session expires. The application is configured with an 8-hour session lifetime to minimize this issue.

**Quick Fix:**
1. Refresh the page (F5)
2. The page will automatically reload with a new CSRF token
3. Your session will be restored if you're still logged in

**If error persists:**
```bash
# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan session:table  # Verify sessions table exists

# Check .env configuration
SESSION_DRIVER=database
SESSION_LIFETIME=480
```

**For Development:**
- Increase session lifetime in `.env` if needed
- The app will auto-refresh on 419 errors

**For Production:**
- 8-hour session is recommended for admin users
- Consider 4-6 hours for customer-facing areas

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | Laravel |
| `APP_ENV` | Environment (local/production) | local |
| `APP_DEBUG` | Debug mode | true |
| `DB_CONNECTION` | Database driver | sqlite |
| `SESSION_DRIVER` | Session storage driver | database |
| `SESSION_LIFETIME` | Session lifetime in minutes | 480 |
| `QUEUE_CONNECTION` | Queue driver | database |
| `MAIL_MAILER` | Mail driver | log |
| `FACEBOOK_CLIENT_ID` | Facebook OAuth ID | - |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, please contact the development team or open an issue in the repository.

## 🔄 Development Workflow

### Daily Development
```bash
# Start all services
composer dev

# Watch for file changes
# Vite will auto-reload
# Laravel will serve the application
```

### Database Management
```bash
# Fresh migration with seeding
php artisan migrate:fresh --seed

# Rollback last migration
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

### Cache Management
```bash
# Clear all caches
php artisan optimize:clear

# Clear specific caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## 🚀 Deployment Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure production database
- [ ] Set up proper mail driver
- [ ] Configure social auth credentials
- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `npm run build`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Set proper file permissions
- [ ] Configure queue worker (supervisor)
- [ ] Set up SSL certificate
- [ ] Configure backup strategy

---

**Built with ❤️ for Rovic Meatshop**

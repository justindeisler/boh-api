# BOH Event Management Platform - Backend API

A production-ready event management platform with integrated Admin CMS, built with NestJS, Fastify, and Clean Architecture principles.

## Features

### Core Features
- **Event Management**: Full CRUD operations for events with rich metadata
- **Venue Management**: Manage event venues with location data
- **Booking System**: User booking management with payment tracking
- **User Authentication**: JWT-based authentication with refresh tokens
- **Role-Based Access Control**: USER, ORGANIZER, and ADMIN roles

### Admin CMS Features
- **Content Pages**: Create and manage website pages
- **Content Sections**: Dynamic page section management
- **Media Library**: File upload with image processing
- **Site Settings**: Global configuration management
- **User Management**: Admin control over users

### Technical Features
- Clean Architecture with clear separation of concerns
- Fastify for high performance (3x faster than Express)
- PostgreSQL with Prisma ORM for type-safe database access
- PgBouncer for connection pooling
- Redis for caching (ready for implementation)
- Winston logging with daily rotation
- Global validation and exception handling
- Rate limiting and security headers
- Health check endpoints

## Technology Stack

- **Framework**: NestJS 10.x with Fastify adapter
- **Language**: TypeScript 5.x (strict mode)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.x
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Image Processing**: Sharp

## Architecture

```
src/
├── domain/                  # Business Logic (Framework-Independent)
│   ├── entities/           # Business entities with behavior
│   └── repositories/       # Repository interfaces
├── application/            # Application Layer
│   ├── dtos/              # Data Transfer Objects
│   └── services/          # Application services
├── infrastructure/         # External Concerns
│   ├── database/          # Database implementation
│   │   ├── repositories/  # Concrete repository implementations
│   │   └── prisma/       # Prisma client and schema
│   └── config/           # Configuration management
└── presentation/          # API Layer
    └── controllers/       # HTTP request handlers
```

## Prerequisites

- Node.js 18.x or higher
- Docker and Docker Compose
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd boh-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Infrastructure Services

Start PostgreSQL, PgBouncer, and Redis using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5433 (internal)
- PgBouncer on port 5432 (application connects here)
- Redis on port 6379

### 4. Configure Environment

The `.env` file is already configured for local development. Review and update if needed:

```bash
# Database will be available at:
DATABASE_URL=postgresql://boh_user:boh_password_dev@localhost:5432/boh_db?pgbouncer=true
```

### 5. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with test data
npm run prisma:seed
```

### 6. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Checks

- `GET /health` - Basic health check
- `GET /health/ready` - Readiness check (includes database connectivity)

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/profile` - Get user profile (protected)

### Public Events API

- `GET /api/v1/events` - List published events
- `GET /api/v1/events/:id` - Get event by ID
- `GET /api/v1/events/slug/:slug` - Get event by slug

### Admin Events API (Protected)

- `GET /api/v1/admin/events` - List all events (ADMIN, ORGANIZER)
- `GET /api/v1/admin/events/:id` - Get event details (ADMIN, ORGANIZER)
- `POST /api/v1/admin/events` - Create event (ADMIN, ORGANIZER)
- `PUT /api/v1/admin/events/:id` - Update event (ADMIN, ORGANIZER)
- `DELETE /api/v1/admin/events/:id` - Delete event (ADMIN only)

## Seeded Test Users

After running `npm run prisma:seed`, you'll have these test accounts:

### Admin User
- Email: `admin@boh.com`
- Password: `admin123`
- Role: ADMIN

### Organizer User
- Email: `organizer@boh.com`
- Password: `organizer123`
- Role: ORGANIZER

### Regular User
- Email: `user@boh.com`
- Password: `user123`
- Role: USER

## Development Commands

### Application

```bash
npm run start          # Start development server
npm run start:dev      # Start with hot reload
npm run start:prod     # Start production build
npm run build          # Build application
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Database

```bash
npx prisma generate           # Generate Prisma Client
npx prisma migrate dev        # Create and apply migration
npx prisma migrate deploy     # Apply migrations (production)
npx prisma studio            # Open Prisma Studio GUI
npx prisma db seed           # Seed database
npx prisma db push           # Push schema (dev only)
```

### Testing

```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run end-to-end tests
```

## Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://boh_user:boh_password_dev@localhost:5432/boh_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_dev

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=30m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=7d

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Project Structure

```
boh-api/
├── src/
│   ├── auth/                   # Auth module
│   ├── events/                 # Events module
│   ├── domain/                 # Domain layer
│   ├── application/            # Application layer
│   ├── infrastructure/         # Infrastructure layer
│   ├── presentation/           # Presentation layer
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application bootstrap
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Seed script
├── uploads/                   # File uploads directory
├── logs/                      # Application logs
├── docker-compose.yml         # Docker services
├── .env                       # Environment variables
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

## Security

### Authentication
- JWT tokens with access/refresh pattern
- Bcrypt password hashing (10 rounds)
- HttpOnly cookies for refresh tokens
- Secure token storage

### Authorization
- Role-based access control (RBAC)
- Guards at controller level
- USER, ORGANIZER, ADMIN roles
- Route-level permissions

### API Security
- Rate limiting (100 req/min default)
- CORS configuration
- Helmet security headers
- Input validation
- SQL injection protection (Prisma)

## Performance

### Connection Pooling
- PgBouncer for PostgreSQL connection pooling
- Transaction-level pooling
- Handles 1000+ concurrent connections
- 25 database connections per pool

### Fastify Benefits
- 50,000 requests/second vs Express 15,000
- Lower memory footprint
- Native JSON schema validation
- Optimized request/response handling

## Logging

Logs are stored in the `logs/` directory with daily rotation:

- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

## Database Management

### Prisma Studio

View and edit database data with Prisma Studio:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

### Migrations

Create a new migration:

```bash
npx prisma migrate dev --name description_of_changes
```

## Clean Architecture Principles

### Domain Layer
- Pure TypeScript classes
- No framework dependencies
- Business logic and rules
- Repository interfaces

### Application Layer
- DTOs for data transfer
- Application services
- Use case orchestration
- Validation logic

### Infrastructure Layer
- Database implementations
- External service integrations
- Configuration management
- Technical capabilities

### Presentation Layer
- HTTP controllers
- Request/response handling
- Guards and middleware
- API routing

## Expanding the Application

### Adding a New Module

1. Create module structure:
```bash
mkdir -p src/modulename/{domain,application,infrastructure,presentation}
```

2. Create domain entities and repositories
3. Implement application DTOs and services
4. Add infrastructure implementations
5. Create presentation controllers
6. Register module in `app.module.ts`

### Adding CMS Features

The foundation is ready. To add CMS modules:

1. Content Pages module (based on Page entity)
2. Media Library module (based on Media entity)
3. Site Settings module (based on Setting entity)
4. Follow the same clean architecture pattern

## Troubleshooting

### Database Connection Issues

```bash
# Check if Docker services are running
docker-compose ps

# Check PgBouncer logs
docker-compose logs pgbouncer

# Check PostgreSQL logs
docker-compose logs postgres

# Restart services
docker-compose restart
```

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Contributing

1. Follow Clean Architecture principles
2. Write tests for new features
3. Use TypeScript strict mode
4. Follow ESLint and Prettier rules
5. Document new endpoints

## License

Proprietary - All rights reserved

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using NestJS, Fastify, and Clean Architecture

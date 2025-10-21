# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BOH Event Management Platform Backend API - A production-ready NestJS application with Fastify adapter, built using Clean Architecture principles. This system provides both a public API for event management and booking, plus an admin CMS API for content management.

**Technology Stack:**
- NestJS 10.x with Fastify adapter (3x faster than Express)
- PostgreSQL 16 with Prisma ORM 6.x
- JWT authentication with refresh tokens
- Docker Compose for local infrastructure (PostgreSQL, PgBouncer, Redis)
- TypeScript 5.x in strict mode

## Essential Commands

### Development Workflow

```bash
# Start infrastructure services (PostgreSQL, PgBouncer, Redis)
docker-compose up -d

# Database setup and migrations
npx prisma generate          # Generate Prisma Client (after schema changes)
npx prisma migrate dev       # Create and apply migration
npm run prisma:seed          # Seed database with test data

# Development server
npm run start:dev            # Start with hot reload (recommended)
npm run start:debug          # Start with debugging enabled

# Building
npm run build                # Compile TypeScript to dist/

# Code quality
npm run lint                 # Run ESLint
npm run format               # Format code with Prettier

# Testing
npm run test                 # Run unit tests
npm run test:watch           # Run tests in watch mode
npm run test:cov             # Run tests with coverage
npm run test:e2e             # Run end-to-end tests

# Database tools
npx prisma studio            # Open Prisma Studio GUI at http://localhost:5555
npx prisma migrate deploy    # Apply migrations (production)
npx prisma db push           # Push schema without migration (dev only)
```

### Running a Single Test

```bash
npm run test -- auth.service.spec.ts              # Run specific test file
npm run test -- --testNamePattern="should login"  # Run tests matching pattern
```

### Database Connection

The application connects to PostgreSQL through PgBouncer for connection pooling:
- PgBouncer runs on port 5432
- PostgreSQL runs on port 5433 (internal)
- Connection string must include `?pgbouncer=true`

## Architecture Overview

This project follows **Clean Architecture** with strict layer separation:

```
src/
├── domain/                    # Business entities and repository interfaces (framework-independent)
├── application/              # DTOs and application services (orchestration)
├── infrastructure/           # Database implementations, config, external integrations
└── presentation/             # HTTP controllers (thin layer)
```

### Critical Architecture Principles

1. **Domain Layer Independence**: Domain entities contain business logic and have ZERO framework dependencies. They are pure TypeScript classes.

2. **Repository Pattern**:
   - Repository interfaces defined in `domain/repositories/`
   - Concrete implementations in `infrastructure/database/repositories/`
   - Services depend on interfaces, not implementations

3. **Dependency Flow**: Presentation → Application → Domain ← Infrastructure

4. **Never Expose Prisma Models**: Always map Prisma models to domain entities before returning from repositories. API responses use DTOs, never raw database models.

### Module Organization

**Public vs Admin Separation:**
- Public controllers: `/api/v1/events` (public event browsing)
- Admin controllers: `/api/v1/admin/events` (protected event management)
- Admin routes protected with `@Roles('ADMIN')` or `@Roles('ORGANIZER')` decorators
- Clear separation prevents accidental exposure of admin functionality

**Feature Modules:**
- Each domain has its own module (auth, events, venues, bookings)
- Admin CMS features should be grouped under `/admin` parent module
- Modules are self-contained with their own controllers, services, and repositories

## Database Schema Key Concepts

**User Roles:**
- `USER`: Can book events, manage own bookings
- `ORGANIZER`: Can create and manage own events
- `ADMIN`: Full access including CMS features

**Event Lifecycle:**
- Status flow: `DRAFT` → `PUBLISHED` → `COMPLETED` or `CANCELLED`
- Only `PUBLISHED` events visible to public API
- Admin API can access all statuses

**CMS Models:**
- `ContentPage`: Dynamic pages with slug-based routing
- `ContentSection`: Page sections with type (HERO, TEXT, IMAGE, VIDEO, GALLERY, EVENT_LIST)
- `MediaFile`: Uploaded media with thumbnails and metadata
- `SiteSetting`: Key-value configuration with types (TEXT, NUMBER, BOOLEAN, JSON, IMAGE)

**Important Indexes:**
- Events indexed on `status`, `startDate`, `category`, and combinations
- Always filter events by status for public queries
- Use composite index `(status, startDate)` for published event listings

## Authentication & Authorization

**JWT Strategy:**
- Access tokens: 15-30 minute expiration (stored in memory client-side)
- Refresh tokens: 7 days (stored in httpOnly cookie)
- Tokens rotated on refresh for security

**Guards:**
- `JwtAuthGuard`: Validates JWT and attaches user to request
- `RolesGuard`: Checks user role against `@Roles()` decorator
- Use `@Public()` decorator to bypass authentication

**Protecting Routes:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'ORGANIZER')
@Controller('api/v1/admin/events')
export class AdminEventsController { }
```

## File Upload & Media Management

**Upload Configuration:**
- Max file size: 10MB for images, 100MB for videos
- Supported formats: JPEG, PNG, WebP, AVIF, GIF, MP4, WebM, PDF
- Files stored in `uploads/` directory (organized by date)

**Image Processing Pipeline:**
1. Validate file type via magic numbers (not just Content-Type header)
2. Generate unique filename (UUID-based)
3. Resize to max dimensions (2000px)
4. Generate thumbnails (400px, 800px)
5. Convert to WebP/AVIF formats
6. Strip EXIF metadata
7. Save metadata to `MediaFile` model

**Security:**
- Admin-only upload access (`@Roles('ADMIN')`)
- Validate via magic numbers to prevent type spoofing
- Process/re-encode all images to neutralize potential exploits

## Performance Considerations

**Fastify vs Express:**
- Fastify handles 50,000 req/s vs Express 15,000 req/s
- Lower memory footprint
- Native JSON schema validation
- Configured in `main.ts` with `FastifyAdapter`

**Connection Pooling:**
- PgBouncer manages connection pooling (25 connections per pool)
- Handles 1000+ concurrent users
- Transaction-level pooling for web applications
- Always use `?pgbouncer=true` in DATABASE_URL

**Query Optimization:**
- Use Prisma's `select` to fetch only needed fields
- Implement cursor-based pagination for large datasets
- Use composite indexes for filtered date queries
- Avoid N+1 queries by using `include` strategically

**Caching Strategy (Redis ready):**
- Cache event listings (1 hour TTL)
- Cache venue details (24 hours TTL)
- Invalidate on updates
- Redis configured in docker-compose but not yet implemented

## Testing Strategy

**Test Organization:**
- Unit tests: Test domain entities and services in isolation
- Integration tests: Test repository implementations with real database
- E2E tests: Test complete API flows

**Running Database Tests:**
- Tests use the same PostgreSQL instance
- Clean database between test suites
- Use transactions to isolate tests when possible

## Common Development Tasks

### Adding a New Feature Module

1. Create directory structure following Clean Architecture:
   ```
   src/
   ├── domain/
   │   ├── entities/feature.entity.ts
   │   └── repositories/feature.repository.interface.ts
   ├── application/
   │   ├── dtos/feature/
   │   └── services/feature.service.ts
   ├── infrastructure/database/repositories/
   │   └── feature.repository.ts
   └── presentation/controllers/
       └── feature.controller.ts
   ```

2. Create Prisma model in `prisma/schema.prisma`
3. Run `npx prisma migrate dev --name add_feature`
4. Implement domain entity (pure TypeScript, no dependencies)
5. Define repository interface in domain layer
6. Implement repository in infrastructure layer
7. Create DTOs with validation decorators
8. Implement service in application layer
9. Create controller in presentation layer
10. Register module in `app.module.ts`

### Adding a Database Migration

```bash
# 1. Modify prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name description_of_changes

# 3. Verify migration was created in prisma/migrations/
# 4. Test migration by resetting database
npx prisma migrate reset  # WARNING: Deletes all data
npm run prisma:seed
```

### Adding Admin CMS Functionality

- Group under admin module namespace
- Protect with `@Roles('ADMIN')` decorator
- Use `/api/v1/admin/*` route prefix
- Return complete data (unlike public APIs which return limited fields)
- Log all admin actions for audit trail

## Security Requirements

**Input Validation:**
- ALL user input must be validated using class-validator decorators
- Never trust client-side validation
- Return 422 status with field-specific errors

**SQL Injection Prevention:**
- Prisma uses parameterized queries (automatic protection)
- Never concatenate user input into raw queries
- Validate input types strictly

**Rate Limiting:**
- Authentication endpoints: 5 attempts per 15 minutes
- API endpoints: 100 requests per 15 minutes
- Configured via `@nestjs/throttler`

**CORS Configuration:**
- Development: All origins allowed
- Production: Whitelist specific origins in environment config
- Credentials enabled for cookie-based auth

## Environment Variables

**Critical Variables:**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/db?pgbouncer=true
JWT_SECRET=your-secret-key           # Min 256-bit
JWT_REFRESH_SECRET=refresh-secret
PORT=3000
NODE_ENV=development
```

**Validation:**
- Application validates required environment variables at startup
- Fails fast with clear error message if configuration is invalid
- Never commit `.env` files to git

## Troubleshooting

**Database Connection Issues:**
```bash
docker-compose ps                 # Check if services are running
docker-compose logs pgbouncer     # Check PgBouncer logs
docker-compose logs postgres      # Check PostgreSQL logs
docker-compose restart            # Restart services
```

**Prisma Client Not Found:**
```bash
npx prisma generate              # Regenerate Prisma Client
rm -rf node_modules/.prisma      # Clear Prisma cache
npm install                      # Reinstall dependencies
```

**Port Already in Use:**
```bash
lsof -i :3000                    # Find process using port
kill -9 <PID>                    # Kill the process
# Or change PORT in .env file
```

**Migration Conflicts:**
```bash
npx prisma migrate reset         # Reset database (deletes data!)
npx prisma migrate deploy        # Reapply all migrations
npm run prisma:seed              # Reseed data
```

## API Documentation

- Swagger UI available at: `http://localhost:3001/api/docs`
- Automatically generated from DTOs and decorators
- Includes request/response schemas and authentication

## Test Users (After Seeding)

```
Admin:     admin@boh.com / admin123
Organizer: organizer@boh.com / organizer123
User:      user@boh.com / user123
```

## Logging

- Winston logger with daily rotation
- Logs stored in `logs/` directory
- Log levels: error, warn, info, debug, verbose
- All errors logged with full stack traces
- Request/response logging in development mode

## Code Style & Conventions

- Follow Clean Architecture layers strictly
- Use dependency injection for all services
- DTOs for all inputs and outputs
- Never return Prisma models directly from APIs
- Repository pattern for all data access
- Async/await for all asynchronous operations
- Descriptive variable and function names
- JSDoc comments for public APIs
- TypeScript strict mode enabled

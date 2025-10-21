# Backend Architecture Guidelines

This file provides guidance when working with the event management platform backend. Follow these standards to ensure scalable, maintainable, and high-performance API architecture.

## Important: Clean Architecture Principles

**MANDATORY**: When creating or modifying backend features, you MUST follow Clean Architecture with clear separation between domain, application, infrastructure, and presentation layers. Business logic must remain framework-agnostic.

## Technology Stack Overview

**Event Management API with CMS** is a production-ready backend built with NestJS and Fastify adapter, featuring Clean Architecture, PostgreSQL with Prisma ORM, and comprehensive dependency injection. The system includes both a public API for event bookings and an admin CMS API for content management, optimized for handling thousands of concurrent bookings with sub-100ms response times.

## Development Commands

### Essential NestJS Commands
- `npm run start` - Start development server with watch mode
- `npm run start:dev` - Start with hot reload enabled
- `npm run start:prod` - Start optimized production server
- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint` - Run ESLint static analysis
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage report

### Database Management
- `npx prisma migrate dev` - Create and apply development migration
- `npx prisma migrate deploy` - Apply migrations to production
- `npx prisma generate` - Generate Prisma Client after schema changes
- `npx prisma studio` - Open database GUI for inspection
- `npx prisma db seed` - Seed database with test data
- `npx prisma db push` - Push schema changes without migration (dev only)

### Development Workflow
- Hot reload applies changes automatically in development
- TypeScript compilation happens on save
- Prisma Client regenerates after schema changes
- Run migrations before starting development server

## Architecture & Structure

### Clean Architecture Layers

```
src/
├── domain/                      # Business Logic (Framework-Independent)
│   ├── entities/               # Business entities with behavior
│   ├── repositories/           # Repository interfaces (abstractions)
│   └── use-cases/             # Application business rules
├── application/                # Application Layer
│   ├── dtos/                  # Data Transfer Objects
│   ├── services/              # Application services (orchestration)
│   └── validators/            # Input validation logic
├── infrastructure/             # External Concerns
│   ├── database/              # Database implementation
│   │   ├── repositories/      # Concrete repository implementations
│   │   └── prisma/           # Prisma client and schema
│   ├── external/              # Third-party integrations
│   │   ├── email/            # Email service providers
│   │   ├── payment/          # Payment gateway integrations
│   │   └── storage/          # File storage services
│   └── config/               # Configuration management
└── presentation/               # API Layer
    └── controllers/           # HTTP request handlers
```

### Layer Responsibilities

**Domain Layer:**
- Contains core business logic and entities
- Zero dependencies on frameworks or libraries
- Pure TypeScript classes with business rules
- Repository interfaces define data contracts
- Use cases implement business operations

**Application Layer:**
- Orchestrates domain operations
- Transforms data between layers
- Validates input from presentation layer
- Handles application-specific logic
- Coordinates multiple use cases

**Infrastructure Layer:**
- Implements domain repository interfaces
- Handles database operations with Prisma
- Integrates with external services
- Manages configuration and secrets
- Provides technical capabilities
- File upload and media processing
- Image resizing and thumbnail generation

**Presentation Layer:**
- Handles HTTP requests and responses
- Routes requests to application services
- Applies guards and middleware
- Formats responses according to API standards
- Thin layer, delegates to application services
- Enforces role-based access control

## Dual API Architecture: Public + Admin CMS

### Overall Architecture

**Overall Grade: A+** - Separation between public and admin APIs ensures security and maintainability.

**Public API Modules:**
- Events (list, search, filter, detail)
- Venues (list, search, detail)
- Bookings (create, list user bookings, cancel)
- Authentication (register, login, profile)
- Content Pages (public view of CMS content)

**Admin CMS API Modules:**
- Content Management (create/edit pages, sections)
- Media Library (upload, organize, manage assets)
- Site Settings (global configuration)
- Event Management (full CRUD with advanced features)
- User Management (list users, assign roles)

**Access Control:**
- Public routes: No authentication required or USER role
- Admin routes: ADMIN role required
- Organizer routes: ORGANIZER role required
- Implement guards at controller level

### Module Organization Strategy

**Feature-Based Modules:**
```
src/
├── events/              # Public + Admin event features
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│       ├── public.controller.ts    # Public event endpoints
│       └── admin.controller.ts     # Admin event management
├── content/             # CMS Content Management
│   ├── domain/
│   │   ├── page.entity.ts
│   │   └── section.entity.ts
│   ├── application/
│   │   ├── page.service.ts
│   │   └── dtos/
│   ├── infrastructure/
│   └── presentation/
│       └── admin.controller.ts     # Admin-only
├── media/              # CMS Media Library
│   ├── domain/
│   ├── application/
│   │   ├── media.service.ts
│   │   ├── upload.service.ts
│   │   └── image-processing.service.ts
│   ├── infrastructure/
│   │   └── storage/               # File storage implementation
│   └── presentation/
│       └── admin.controller.ts     # Admin-only
├── settings/           # CMS Site Settings
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── presentation/
│       ├── public.controller.ts    # Public settings
│       └── admin.controller.ts     # Admin management
└── users/              # User Management
    ├── domain/
    ├── application/
    ├── infrastructure/
    └── presentation/
        └── admin.controller.ts     # Admin user management
```

**Separation Principles:**
- ✅ Separate controllers for public vs admin
- ✅ Guard admin routes with RoleGuard
- ✅ Different DTOs for public vs admin
- ✅ Public endpoints return limited data
- ✅ Admin endpoints return complete data with metadata
- ❌ Never expose admin functionality on public routes
- ❌ Don't mix public and admin logic in same controller

## NestJS with Fastify Setup

### Why Fastify Over Express

**Overall Grade: A+** - Fastify delivers 3x better performance than Express.

**Performance Benefits:**
- 50,000 requests/second vs Express 15,000
- Lower memory footprint
- Native JSON schema validation
- Better request/response handling
- Schema-based serialization

**When to Use Fastify:**
- High-traffic event booking scenarios
- Real-time seat availability updates
- Concurrent user handling (1000+ simultaneous)
- API-heavy applications
- Microservices architecture

### Bootstrap Configuration

**Server Setup:**
- Use FastifyAdapter instead of default Express
- Enable CORS with specific origin whitelist
- Configure global validation pipe
- Set up global exception filters
- Enable request logging in development

**Performance Settings:**
- Enable HTTP/2 support
- Configure connection timeouts
- Set body size limits (10MB for uploads)
- Enable compression (gzip/brotli)
- Configure keep-alive connections

## Clean Architecture Implementation

### Domain Layer Design

**Entity Principles:**
- ✅ Contain business behavior, not just data
- ✅ Validate business rules internally
- ✅ No dependencies on frameworks
- ✅ Pure TypeScript classes
- ❌ No Prisma models in domain layer

**Entity Design:**
- Encapsulate business logic in methods
- Validate invariants in constructor
- Throw domain exceptions for violations
- Return results, not modify external state
- Keep entities focused (Single Responsibility)

**Use Case Structure:**
- One use case per business operation
- Accept dependencies through constructor
- Return success/failure results
- Handle business logic only
- Delegate persistence to repositories

### Repository Pattern

**Overall Grade: A** - Repository pattern provides clean abstraction over data access.

**Interface Design:**
- Define repository interfaces in domain layer
- Implement concrete repositories in infrastructure
- Use dependency injection to inject implementations
- Abstract database-specific logic
- Enable easy testing with mocks

**Repository Responsibilities:**
- CRUD operations for entities
- Query methods for specific needs
- Transaction management
- No business logic in repositories
- Return domain entities, not database models

### Dependency Injection

**Module Organization:**
- Feature-based modules (EventModule, BookingModule)
- Shared DatabaseModule for common dependencies
- ConfigModule for environment configuration
- AuthModule for authentication/authorization
- Global modules for cross-cutting concerns

**Provider Registration:**
- Register use cases as providers
- Register services in application layer
- Register repositories with interface tokens
- Use factory providers for complex initialization
- Scope providers appropriately (singleton, request, transient)

## Database Design with Prisma

### Why Prisma ORM

**Overall Grade: A+** - Prisma provides exceptional TypeScript integration.

**Key Benefits:**
- Fully-typed database client
- Schema-first development
- Automatic migration generation
- Type-safe query building
- Prevents SQL injection by design

**Prisma vs Alternatives:**
- **vs TypeORM**: Better types, simpler API, faster queries
- **vs Drizzle**: Easier learning curve, better DX, larger ecosystem
- **vs Raw SQL**: Type safety, reduced boilerplate, migration management

### Schema Design Principles

**Table Organization:**
- Use singular table names mapped to plural in schema
- Define clear primary keys (UUIDs recommended)
- Implement foreign key relationships
- Add indexes for frequently queried fields
- Use enums for fixed value sets

**Relationship Patterns:**
- One-to-Many: Events to Bookings
- Many-to-Many: Events to Tags (junction table)
- One-to-One: User to Profile
- Always define both sides of relationship
- Configure cascade behavior appropriately

**Data Types:**
- Use Decimal for monetary values (precision)
- DateTime with timezone awareness
- UUID for primary keys (not auto-increment)
- JSON for flexible metadata
- Enum for fixed categorical data

### Migration Strategy

**Development Migrations:**
- Create migrations for all schema changes
- Test migrations before committing
- Include both up and down paths
- Keep migrations small and focused
- Name migrations descriptively

**Production Migrations:**
- Never modify applied migrations
- Test in staging environment first
- Plan for zero-downtime deployments
- Separate schema and data migrations
- Maintain backward compatibility during transitions

**Safe Migration Patterns:**
1. Add new column as nullable
2. Deploy code handling both old/new schema
3. Populate new column from old data
4. Make new column required
5. Remove old column in next release

## Connection Pooling with PgBouncer

### Why Connection Pooling

**Overall Grade: A+** - Essential for handling concurrent users efficiently.

**Problem Without Pooling:**
- PostgreSQL creates process per connection
- Process creation overhead is expensive
- Limited connections (typically 100-200)
- Cannot handle 1000+ concurrent users
- Memory consumption grows linearly

**PgBouncer Benefits:**
- Multiplexes thousands of client connections
- Maintains small pool of actual database connections
- Transaction-level pooling for web apps
- Reduces PostgreSQL memory usage
- Enables horizontal scaling

### Configuration Requirements

**Pool Sizing:**
- Default pool size: 25 connections per database
- Reserve pool: 5 connections for emergency
- Maximum client connections: 1000+
- Pool mode: transaction (for web applications)
- Server lifetime: 3600 seconds

**Application Configuration:**
- Connect through PgBouncer port (6432)
- Add ?pgbouncer=true to connection string
- Configure statement timeout
- Handle connection errors gracefully
- Implement retry logic with backoff

## API Design Standards

### RESTful Principles

**Overall Grade: A** - REST provides simplicity and universal compatibility.

**Resource Naming:**
- ✅ Use plural nouns for collections (/events)
- ✅ Use hierarchical URIs (/events/{id}/bookings)
- ✅ Lowercase with hyphens for multi-word
- ❌ Never use verbs in URIs (/getEvents)
- ❌ Avoid deep nesting (max 2 levels)

**HTTP Method Semantics:**
- GET: Retrieve resources (safe, idempotent)
- POST: Create resources (returns 201 with Location)
- PUT: Full resource replacement (idempotent)
- PATCH: Partial resource update
- DELETE: Remove resources (idempotent)

**Status Code Usage:**
- 200 OK: Successful GET, PUT, PATCH, DELETE
- 201 Created: Successful POST with resource creation
- 204 No Content: Successful DELETE with no body
- 400 Bad Request: Malformed syntax
- 401 Unauthorized: Missing/invalid authentication
- 403 Forbidden: Valid auth, insufficient permissions
- 404 Not Found: Resource doesn't exist
- 422 Unprocessable Entity: Validation failures
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server-side failure

### Response Structure Standards

**Success Responses:**
- Return complete resource representation
- Include resource ID in response
- Add timestamps (createdAt, updatedAt)
- Nest related resources appropriately
- Use consistent field naming (camelCase)

**Error Responses (RFC 9457):**
- Include type URL for error documentation
- Provide human-readable title
- Add detailed explanation in detail field
- Include request ID for tracing
- Add timestamp for debugging
- List field-level errors in errors array

**Pagination Metadata:**
- Include total count of items
- Provide next/previous cursors
- Add hasMore boolean flag
- Include current limit/offset
- Return page information

## Validation and Error Handling

### Input Validation

**Overall Grade: A+** - Server-side validation is mandatory for security.

**Validation Requirements:**
- ✅ Validate ALL user input server-side
- ✅ Never trust client-side validation
- ✅ Use class-validator decorators in DTOs
- ✅ Validate before business logic executes
- ✅ Return 422 with field-specific errors

**DTO Design:**
- One DTO per endpoint input
- Apply validation decorators to all fields
- Set appropriate constraints (min, max, length)
- Use custom validators for complex rules
- Transform input types appropriately

**Validation Rules:**
- Email: RFC 5322 format validation
- Phone: E.164 international format
- Names: 2-100 characters, HTML escaped
- Dates: ISO 8601 format, future dates where needed
- Numbers: Range validation, decimal precision

### Global Exception Handling

**Exception Filter:**
- Catch all unhandled exceptions
- Log errors with full stack trace
- Return consistent error format
- Include request ID for tracing
- Sanitize error messages (no sensitive data)

**Error Logging:**
- Log all 500-level errors
- Include request context
- Add user information (if authenticated)
- Track error frequency
- Alert on error rate spikes

## Authentication and Authorization

### JWT Token Strategy

**Overall Grade: A** - Short-lived access tokens with refresh tokens provide security.

**Access Token Design:**
- Short lifetime (15-30 minutes)
- Stored in memory only on client
- Contains minimal claims (user ID, role)
- Signed with strong secret (256-bit minimum)
- No sensitive data in payload (not encrypted)

**Refresh Token Design:**
- Longer lifetime (7 days)
- Stored in httpOnly cookie
- Includes secure flag (HTTPS only)
- Set sameSite=strict (CSRF protection)
- Rotated on use for security

**Token Claims:**
- User ID (subject)
- Role or permissions
- Issued at timestamp
- Expiration timestamp
- Issuer identification
- Never include passwords or sensitive data

### Guard Implementation

**Authentication Guards:**
- Verify JWT signature validity
- Check token expiration
- Extract user information
- Attach user to request context
- Return 401 for missing/invalid tokens

**Authorization Guards:**
- Check user roles/permissions
- Verify resource ownership
- Return 403 for insufficient permissions
- Log authorization failures
- Implement role-based access control (RBAC)

**Role-Based Access Control (RBAC):**
- Define roles: USER, ORGANIZER, ADMIN
- USER: Can book events, manage own bookings
- ORGANIZER: Can create/manage own events
- ADMIN: Full access to all features and CMS
- Apply @Roles() decorator to protected routes
- Combine AuthGuard with RoleGuard on controllers

**Role Guard Implementation Patterns:**
- Protect all admin routes with @Roles('ADMIN')
- Allow multiple roles: @Roles('ADMIN', 'ORGANIZER')
- Check resource ownership for ORGANIZER routes
- Public routes require no guards
- Document role requirements in API docs

## File Upload and Media Management

### Media Upload Strategy

**Overall Grade: A+** - Comprehensive file handling with security and processing.

**Upload Flow:**
1. Client uploads file to /api/v1/admin/media/upload
2. Validate file type and size (guard level)
3. Generate unique filename (UUID)
4. Store original file temporarily
5. Process file (resize, thumbnail generation)
6. Store processed variants
7. Save metadata to database
8. Return media object with URLs

**File Type Support:**
- Images: JPEG, PNG, WebP, AVIF, GIF
- Videos: MP4, WebM, MOV
- Documents: PDF
- Maximum sizes: 10MB images, 100MB videos

**Storage Strategy:**
- Store in filesystem or S3-compatible storage
- Organize by upload date: /uploads/2025/01/20/
- Generate multiple sizes for images
- Create thumbnails automatically
- Serve from CDN or separate domain

### Image Processing

**Automatic Processing:**
- Resize to maximum dimensions (2000px)
- Generate thumbnails (400px, 800px)
- Convert to WebP and AVIF formats
- Strip EXIF metadata
- Optimize file size

**Processing Libraries:**
- Use Sharp for Node.js image processing
- Fast, efficient, production-ready
- Supports all modern formats
- Memory-efficient streaming

**Video Processing:**
- Generate video thumbnails
- Extract metadata (duration, dimensions)
- Optional: Transcode to web-optimized formats
- Use FFmpeg for video operations

### Media Library Features

**Organization:**
- Folder/tag-based organization
- Search by filename, alt text, tags
- Filter by type, date, uploader
- Bulk operations (delete, move, tag)

**Metadata Management:**
- Original filename preservation
- Alt text for accessibility
- File size and dimensions
- Upload date and user
- Usage tracking (where used)

**Security:**
- Admin-only upload access
- Virus scanning on upload
- File type validation via magic numbers
- Size limits enforced
- Serve from separate domain

## Database Performance Optimization

### Indexing Strategy

**Overall Grade: A** - Proper indexing dramatically improves query performance.

**Single Column Indexes:**
- Index all foreign keys
- Index fields used in WHERE clauses
- Index fields used in ORDER BY
- Index fields used in JOINs
- Monitor index usage statistics

**Composite Indexes:**
- Create for multi-column queries
- Order matters (most selective first)
- Supports leftmost prefix matching
- Example: (status, start_date) for filtered date queries

**Partial Indexes:**
- Index subset of rows with WHERE condition
- Smaller index size
- Faster queries on filtered data
- Example: active events only (WHERE status = 'PUBLISHED')

**Index Monitoring:**
- Track index usage with pg_stat_user_indexes
- Identify unused indexes (idx_scan = 0)
- Remove redundant indexes
- Rebuild fragmented indexes
- Update statistics regularly

### Query Optimization

**Query Performance:**
- Use EXPLAIN ANALYZE for slow queries
- Target query time under 100ms
- Implement query result caching
- Avoid N+1 query problems
- Use database functions for aggregations

**Prisma Optimization:**
- Use select to fetch only needed fields
- Implement cursor-based pagination
- Use transactions for multi-step operations
- Batch queries with Promise.all
- Configure connection pool appropriately

## Caching Strategy with Redis

### Cache Patterns

**Overall Grade: A+** - Redis provides sub-millisecond response times.

**Cache-Aside Pattern:**
1. Check cache for data
2. If miss, fetch from database
3. Store in cache before returning
4. Subsequent requests served from cache
5. Invalidate on updates

**What to Cache:**
- ✅ Event listings (high read, low write)
- ✅ Venue details (rarely change)
- ✅ User profiles (read-heavy)
- ✅ Computed aggregations
- ❌ Real-time booking counts (stale data risk)
- ❌ Sensitive user data

**TTL Strategy:**
- Event listings: 1 hour
- Static content: 24 hours
- User sessions: 7 days
- Rate limit counters: 15 minutes
- Short TTL for frequently changing data

### Cache Invalidation

**Invalidation Patterns:**
- Tag-based: Invalidate related entries
- Event-based: Clear on entity updates
- Time-based: TTL expiration
- Manual: Admin-triggered cache clear

**Best Practices:**
- Invalidate specific keys, not entire cache
- Use cache tags for grouped invalidation
- Log invalidation events
- Handle cache failures gracefully
- Never trust cache alone for critical data

## Logging and Monitoring

### Structured Logging

**Overall Grade: A** - Structured logs enable efficient debugging.

**Log Levels:**
- ERROR: Application errors requiring attention
- WARN: Potential issues, degraded performance
- INFO: Important business events
- DEBUG: Detailed diagnostic information
- VERBOSE: Very detailed tracing

**What to Log:**
- ✅ All errors with stack traces
- ✅ Authentication attempts
- ✅ Database query errors
- ✅ External API failures
- ✅ Performance metrics
- ❌ Sensitive data (passwords, tokens)
- ❌ Personal information (without masking)

**Log Format:**
- Use JSON for structured logs
- Include timestamp (ISO 8601)
- Add request ID for correlation
- Include user ID (if authenticated)
- Add service name and version
- Log level and message

### Performance Monitoring

**Metrics to Track:**
- Request duration percentiles (p50, p95, p99)
- Error rates by endpoint
- Database query performance
- Memory usage and garbage collection
- Active connections and pool usage
- Cache hit/miss ratios

**Alerting Thresholds:**
- Error rate > 1% of requests
- Response time p95 > 500ms
- Database connections > 80% of pool
- Memory usage > 85%
- Disk space < 15%

## Security Implementation

### Input Sanitization

**Sanitization Requirements:**
- ✅ Validate and sanitize ALL user input
- ✅ HTML escape user-generated content
- ✅ Validate email formats strictly
- ✅ Sanitize file uploads
- ✅ Trim whitespace appropriately

**SQL Injection Prevention:**
- ✅ Use Prisma parameterized queries (automatic)
- ✅ Never concatenate strings for queries
- ✅ Validate input types strictly
- ❌ Never trust user input in raw queries
- ❌ No dynamic SQL generation from user input

### CSRF Protection

**Token Strategy:**
- SameSite cookies provide primary protection
- Set sameSite=strict on all cookies
- Double-submit cookie pattern for cross-origin
- CSRF tokens for stateful sessions
- Validate Origin/Referer headers

### Rate Limiting

**Rate Limit Tiers:**
- Authentication endpoints: 5 attempts per 15 minutes
- API endpoints: 100 requests per 15 minutes
- Booking endpoints: 10 requests per hour
- Public endpoints: 200 requests per 15 minutes

**Implementation:**
- Use Redis for distributed rate limiting
- Return 429 with Retry-After header
- Log rate limit violations
- Implement progressive backoff
- Whitelist trusted IPs

### File Upload Security

**Validation Layers:**
1. Check Content-Type header (insufficient alone)
2. Verify file magic numbers (actual file type)
3. Scan for malware with antivirus
4. Resize and re-encode images
5. Store outside web root

**File Processing:**
- Strip metadata from images (EXIF data)
- Transcode videos to safe formats
- Rename files randomly (prevent path traversal)
- Limit file sizes (10MB images, 100MB videos)
- Serve from separate domain

## HTTPS and TLS Configuration

### TLS Requirements

**Mandatory in Production:**
- TLS 1.2 minimum (TLS 1.3 preferred)
- Disable older protocols (SSL, TLS 1.0, 1.1)
- Strong cipher suites only
- Forward secrecy enabled
- OCSP stapling for performance

**Certificate Management:**
- Use Let's Encrypt for free certificates
- 90-day validity with automatic renewal
- Set up renewal monitoring
- Test renewal process regularly
- Have backup certificates ready

### Security Headers

**Required Headers:**
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: (restrictive policy)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin

**Header Implementation:**
- Use Helmet.js for header management
- Configure CSP to whitelist trusted sources
- Block inline scripts (prevent XSS)
- Set frame-ancestors to prevent clickjacking
- Log CSP violations for monitoring

## Testing Strategy

### Unit Testing

**Overall Grade: A** - Unit tests ensure business logic reliability.

**What to Test:**
- ✅ Domain entities and business rules
- ✅ Use cases and application services
- ✅ Validation logic
- ✅ Utility functions
- ✅ Custom decorators and guards

**Testing Principles:**
- Test behavior, not implementation
- Mock external dependencies
- Use real database for repository tests
- Test edge cases and error conditions
- Achieve 80-90% coverage for business logic

### Integration Testing

**Database Testing:**
- Use real PostgreSQL instance
- Create database per test suite
- Clean up after each test
- Use IntegSQL for fast database creation
- Mount database as tmpfs for speed

**API Testing:**
- Test complete request/response cycle
- Verify status codes
- Check response structure
- Test authentication/authorization
- Validate error responses

### E2E Testing

**Critical Paths:**
- Complete booking flow
- User authentication
- Payment processing
- Event creation and management
- Search and filtering

**Testing Tools:**
- Use supertest for API testing
- Mock external services (payment, email)
- Test with real database
- Verify database state after operations
- Check side effects (emails sent, events logged)

## Secrets Management

### Production Requirements

**Overall Grade: A+** - Never use environment variables for production secrets.

**Why Not Environment Variables:**
- ❌ Exposed to all child processes
- ❌ Appear in crash dumps and logs
- ❌ No audit trail
- ❌ No rotation capabilities
- ❌ Difficult to manage across deployments

**Recommended Solutions:**
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Secret Manager

**Implementation:**
- Retrieve secrets at startup
- Store in memory only
- Rotate secrets regularly
- Audit secret access
- Never log secrets

### Development Environment

**Local Development:**
- Use dotenv with .env files
- Add .env to .gitignore
- Provide .env.example template
- Document required variables
- Use different values than production

## Deployment Best Practices

### Environment Configuration

**Required Environments:**
- Development: Local development with hot reload
- Staging: Production-like for testing
- Production: Live user-facing environment

**Configuration Management:**
- Environment-specific config files
- Never commit secrets
- Validate configuration at startup
- Fail fast on missing required config
- Document all environment variables

### Health Checks

**Endpoint Requirements:**
- /health: Basic liveness check
- /health/ready: Readiness check (dependencies available)
- /health/live: Liveness check (app responsive)

**Check Implementation:**
- Verify database connectivity
- Check Redis availability
- Confirm external API reachability
- Return 200 when healthy, 503 when not
- Keep checks lightweight (< 1 second)

## Recommended Architecture Grade: A+

**Strengths:**
- ✅ Clean Architecture with clear separation of concerns
- ✅ High-performance Fastify framework
- ✅ Type-safe database access with Prisma
- ✅ Comprehensive dependency injection
- ✅ Production-ready security practices
- ✅ Scalable connection pooling with PgBouncer
- ✅ Efficient caching with Redis
- ✅ Dual API structure (Public + Admin CMS)
- ✅ Role-based access control (RBAC)
- ✅ Comprehensive media management
- ✅ File upload with processing pipeline
- ✅ Content management system capabilities

**Critical Requirements:**
- Maintain domain layer independence
- Never expose Prisma models in API responses
- Always validate input server-side
- Implement comprehensive error handling
- Use connection pooling for production
- Monitor performance continuously
- Keep secrets in proper vault systems
- Protect all admin routes with role guards
- Validate file uploads with magic numbers
- Process and optimize uploaded media
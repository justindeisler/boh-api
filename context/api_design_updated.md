# API Design Guidelines

This file provides guidance when designing and implementing RESTful APIs for the event management platform with integrated CMS. Follow these standards to ensure consistent, maintainable, and developer-friendly API architecture.

## Important: RESTful Design Principles

**MANDATORY**: All API endpoints must follow RESTful conventions. Use resource-based URLs with appropriate HTTP methods. Never include actions in URIs. Return proper HTTP status codes and implement consistent error handling following RFC 9457 Problem Details standard. Implement role-based access control (RBAC) for all protected endpoints.

## API Design Philosophy

**Event Management API with CMS** is a RESTful API built on HTTP standards, emphasizing simplicity, cacheability, and predictable behavior. The API provides both public endpoints for event discovery and booking, and protected admin endpoints for content management. The API prioritizes developer experience with clear resource naming, consistent response structures, role-based security, and comprehensive documentation.

## API Architecture Overview

The API is divided into two main sections:

**Public API:**
- Event browsing and search
- Venue information
- User authentication and registration
- Booking creation and management
- Public content page viewing

**Admin CMS API:**
- Content page management (ADMIN only)
- Content section management (ADMIN only)
- Media library operations (ADMIN only)
- Site settings configuration (ADMIN only)
- Event management (ADMIN and ORGANIZER)
- User management (ADMIN only)

## Role-Based Access Control (RBAC)

### User Roles Overview

**Overall Grade: A+** - Clear role separation ensures security and proper access control.

**USER Role:**
- Browse and search events
- View event details
- Create and manage own bookings
- View own profile and update information
- Cancel own bookings
- View public content pages

**ORGANIZER Role:**
- All USER permissions
- Create new events
- Edit and delete own events
- View own event statistics
- Manage bookings for own events
- Publish/unpublish own events

**ADMIN Role:**
- All USER and ORGANIZER permissions
- Manage all events (any organizer)
- Create, edit, delete content pages
- Manage content sections
- Upload and manage media files
- Configure site settings
- Manage all users
- View platform analytics
- Access admin dashboard

### RBAC Implementation Guidelines

**Authentication Requirements:**
- Public endpoints: No authentication required
- User endpoints: Valid JWT token required (any authenticated user)
- Organizer endpoints: JWT token with ORGANIZER or ADMIN role
- Admin endpoints: JWT token with ADMIN role only

**Authorization Checks:**
- Always verify role before granting access
- Check resource ownership for ORGANIZER actions
- Implement at controller/route level (not in business logic)
- Return 401 for missing/invalid authentication
- Return 403 for insufficient permissions

**Resource Ownership Rules:**
- ORGANIZER can only modify own events
- USER can only modify own bookings and profile
- ADMIN can modify any resource
- Check ownership in database query (not application code)
- Log unauthorized access attempts

## RESTful Resource Design

### Resource Naming Standards

**Overall Grade: A+** - Consistent resource naming improves API usability.

**URI Structure Rules:**
- ✅ Use plural nouns for collections (/events, /bookings, /pages)
- ✅ Use lowercase with hyphens for readability (/event-categories, /site-settings)
- ✅ Hierarchical relationships show parent-child (/events/{id}/bookings, /pages/{id}/sections)
- ✅ Keep URLs shallow (maximum 2-3 levels deep)
- ❌ Never use verbs in URIs (/getEvent, /createBooking)
- ❌ Never use query params for resource identity
- ❌ Avoid file extensions in URLs (/events.json)

**Public API Resource Examples:**
- Collection: GET /api/v1/events
- Single resource: GET /api/v1/events/{slug}
- Nested collection: GET /api/v1/events/{id}/bookings
- Search: GET /api/v1/events/search

**Admin CMS Resource Examples:**
- Collection: GET /api/v1/admin/content/pages
- Single resource: GET /api/v1/admin/content/pages/{id}
- Nested collection: GET /api/v1/admin/content/pages/{id}/sections
- Media upload: POST /api/v1/admin/media/upload

**URI Best Practices:**
- Keep URLs predictable and intuitive
- Use consistent naming across entire API
- Document URL structure clearly
- Version URLs explicitly (/v1/, /v2/)
- Avoid overly complex nesting
- Separate public and admin routes clearly (/api/v1/... vs /api/v1/admin/...)

### HTTP Method Semantics

**Overall Grade: A+** - Proper HTTP methods enable caching and safety guarantees.

**GET - Retrieve Resources:**
- Safe operation (no side effects)
- Idempotent (multiple calls same result)
- Cacheable by default
- Never modify server state
- Use for all read operations

**POST - Create Resources:**
- Not safe (has side effects)
- Not idempotent (multiple calls create multiple resources)
- Returns 201 Created with Location header
- Use for resource creation
- Can be used for complex operations not fitting other methods

**PUT - Full Replacement:**
- Not safe (modifies state)
- Idempotent (same result on multiple calls)
- Replaces entire resource
- Requires all fields
- Returns 200 OK with updated resource

**PATCH - Partial Update:**
- Not safe (modifies state)
- Can be idempotent (depends on implementation)
- Updates specific fields only
- More flexible than PUT
- Returns 200 OK with updated resource

**DELETE - Remove Resource:**
- Not safe (modifies state)
- Idempotent (deleting same resource multiple times)
- Returns 204 No Content (or 200 with body)
- Subsequent calls return 404 Not Found
- Consider soft deletes for auditing

**Method Selection:**
- Use most specific method for operation
- Respect HTTP semantics strictly
- Enable proper caching behavior
- Allow client assumptions about safety
- Support HTTP middleware and proxies

### HTTP Status Codes

**Overall Grade: A+** - Proper status codes communicate outcomes clearly.

**Success Codes (2xx):**
- **200 OK**: Successful GET, PUT, PATCH, DELETE with response body
- **201 Created**: Successful POST, includes Location header
- **204 No Content**: Successful DELETE or PUT with no response body
- **206 Partial Content**: Range request successful

**Client Error Codes (4xx):**
- **400 Bad Request**: Malformed request syntax
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Authenticated but insufficient permissions (role-based)
- **404 Not Found**: Resource doesn't exist
- **405 Method Not Allowed**: HTTP method not supported for resource
- **409 Conflict**: Resource conflict (duplicate email, booking conflict)
- **413 Payload Too Large**: File upload exceeds size limit
- **415 Unsupported Media Type**: Invalid content type for file upload
- **422 Unprocessable Entity**: Validation failed (preferred over 400)
- **429 Too Many Requests**: Rate limit exceeded

**Server Error Codes (5xx):**
- **500 Internal Server Error**: Unexpected server failure
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Temporary overload or maintenance
- **504 Gateway Timeout**: Upstream server timeout

**Status Code Guidelines:**
- Use most specific code appropriate
- Never return 200 for errors (some APIs do this - don't)
- 4xx for client problems, 5xx for server problems
- Log all 5xx errors for investigation
- Include helpful error messages in response body
- Return 403 for role-based access denial (not 401)

## Public API Endpoints

### Authentication Endpoints

**POST /api/v1/auth/register**
- Create new user account
- Role: Public (no authentication)
- Request: email, password, firstName, lastName, phone (optional)
- Response: 201 Created with user object and tokens
- Validation: email format, password strength, unique email
- Error: 409 if email already exists

**POST /api/v1/auth/login**
- Authenticate user and issue tokens
- Role: Public (no authentication)
- Request: email, password
- Response: 200 OK with user object and tokens (access + refresh)
- Error: 401 for invalid credentials
- Rate limit: 5 attempts per 15 minutes

**POST /api/v1/auth/refresh**
- Refresh access token using refresh token
- Role: Authenticated (refresh token in cookie)
- Response: 200 OK with new access token
- Error: 401 for invalid/expired refresh token

**POST /api/v1/auth/logout**
- Invalidate refresh token
- Role: Authenticated
- Response: 204 No Content
- Clear httpOnly cookie

**GET /api/v1/auth/profile**
- Get current user profile
- Role: Authenticated (USER, ORGANIZER, ADMIN)
- Response: 200 OK with user object
- Includes: id, email, firstName, lastName, role, emailVerified

### Event Endpoints

**GET /api/v1/events**
- List all published events
- Role: Public (no authentication)
- Query params: page, limit, category, startDate, endDate, search, sortBy
- Response: 200 OK with paginated event list
- Pagination: cursor-based (recommended) or offset-based
- Filters: category, date range, search term, venue
- Cache: 5-15 minutes

**GET /api/v1/events/{slug}**
- Get single event details
- Role: Public (no authentication)
- Response: 200 OK with event object including venue details
- Error: 404 if event not found or not published
- Cache: 5-15 minutes

**GET /api/v1/events/search**
- Full-text search across events
- Role: Public (no authentication)
- Query params: q (search query), category, limit
- Response: 200 OK with search results
- Performance: < 100ms target

**GET /api/v1/events/categories**
- List all event categories
- Role: Public (no authentication)
- Response: 200 OK with category enum values
- Cache: Long-term (rarely changes)

### Venue Endpoints

**GET /api/v1/venues**
- List all venues
- Role: Public (no authentication)
- Query params: page, limit, city, country
- Response: 200 OK with paginated venue list
- Cache: 15-30 minutes

**GET /api/v1/venues/{slug}**
- Get single venue details
- Role: Public (no authentication)
- Response: 200 OK with venue object
- Error: 404 if venue not found
- Cache: 15-30 minutes

**GET /api/v1/venues/{slug}/events**
- Get events for specific venue
- Role: Public (no authentication)
- Query params: page, limit, upcoming (boolean)
- Response: 200 OK with event list
- Filter: Only published events

### Booking Endpoints

**POST /api/v1/bookings**
- Create new booking
- Role: Authenticated (USER, ORGANIZER, ADMIN)
- Request: eventId, seats, paymentId (optional)
- Response: 201 Created with booking object and Location header
- Validation: seat availability, event published, valid seats count
- Transaction: Check capacity and create booking atomically
- Error: 409 if insufficient capacity, 404 if event not found

**GET /api/v1/bookings**
- List user's own bookings
- Role: Authenticated (USER, ORGANIZER, ADMIN)
- Query params: page, limit, status
- Response: 200 OK with paginated booking list
- Filter: Only current user's bookings (enforced server-side)

**GET /api/v1/bookings/{id}**
- Get single booking details
- Role: Authenticated (USER, ORGANIZER, ADMIN)
- Response: 200 OK with booking object
- Authorization: Only booking owner or ADMIN
- Error: 403 if not owner, 404 if not found

**PATCH /api/v1/bookings/{id}/cancel**
- Cancel existing booking
- Role: Authenticated (USER, ORGANIZER, ADMIN)
- Response: 200 OK with updated booking
- Authorization: Only booking owner or ADMIN
- Business rule: Update booking status, free up capacity
- Error: 409 if already cancelled, 403 if not owner

### Public Content Page Endpoints

**GET /api/v1/pages/{slug}**
- Get published content page
- Role: Public (no authentication)
- Response: 200 OK with page object including sections
- Filter: Only PUBLISHED status pages
- Sections: Ordered by position, only visible sections
- Error: 404 if page not found or not published
- Cache: Aggressive (30-60 minutes for published content)

**GET /api/v1/settings/public**
- Get public site settings
- Role: Public (no authentication)
- Response: 200 OK with settings object
- Filter: Only settings with isPublic = true
- Cache: Long-term (invalidate on update)
- Example: site name, contact email, social media links

## Admin CMS API Endpoints

### Content Page Management (ADMIN Only)

**GET /api/v1/admin/content/pages**
- List all content pages
- Role: ADMIN only
- Query params: page, limit, status (DRAFT, PUBLISHED, ARCHIVED)
- Response: 200 OK with paginated page list
- Includes: All pages regardless of status
- Sort: By updatedAt DESC (most recent first)

**POST /api/v1/admin/content/pages**
- Create new content page
- Role: ADMIN only
- Request: slug, title, metaDescription (optional), status (default DRAFT)
- Response: 201 Created with page object and Location header
- Validation: unique slug, valid status
- Business rule: Set authorId to current user, publishedAt if status PUBLISHED

**GET /api/v1/admin/content/pages/{id}**
- Get content page details
- Role: ADMIN only
- Response: 200 OK with page object including all sections
- Includes: All sections regardless of visible flag
- Sort sections: By position ASC

**PUT /api/v1/admin/content/pages/{id}**
- Update content page
- Role: ADMIN only
- Request: title, metaDescription, status
- Response: 200 OK with updated page
- Business rule: Set publishedAt when status changes to PUBLISHED
- Validation: slug unique if changed

**DELETE /api/v1/admin/content/pages/{id}**
- Delete content page
- Role: ADMIN only
- Response: 204 No Content
- Cascade: Delete all associated sections
- Alternative: Consider soft delete (status = ARCHIVED)

**PATCH /api/v1/admin/content/pages/{id}/publish**
- Publish content page
- Role: ADMIN only
- Response: 200 OK with updated page
- Business rule: Set status = PUBLISHED, set publishedAt = now()

**PATCH /api/v1/admin/content/pages/{id}/unpublish**
- Unpublish content page
- Role: ADMIN only
- Response: 200 OK with updated page
- Business rule: Set status = DRAFT, keep publishedAt

### Content Section Management (ADMIN Only)

**POST /api/v1/admin/content/pages/{pageId}/sections**
- Add section to page
- Role: ADMIN only
- Request: type (enum), position, data (JSON), visible (default true)
- Response: 201 Created with section object
- Validation: valid section type, valid JSON structure for type
- Business rule: Increment position of subsequent sections if needed

**GET /api/v1/admin/content/sections/{id}**
- Get section details
- Role: ADMIN only
- Response: 200 OK with section object
- Includes: Full data JSON

**PUT /api/v1/admin/content/sections/{id}**
- Update section
- Role: ADMIN only
- Request: type, data, visible
- Response: 200 OK with updated section
- Validation: valid JSON structure for section type

**DELETE /api/v1/admin/content/sections/{id}**
- Delete section
- Role: ADMIN only
- Response: 204 No Content
- Business rule: Adjust positions of remaining sections

**PATCH /api/v1/admin/content/sections/{id}/reorder**
- Reorder section position
- Role: ADMIN only
- Request: newPosition (integer)
- Response: 200 OK with updated section
- Business rule: Update positions of affected sections atomically
- Transaction: All position updates in single transaction

**PATCH /api/v1/admin/content/sections/{id}/visibility**
- Toggle section visibility
- Role: ADMIN only
- Request: visible (boolean)
- Response: 200 OK with updated section
- Business rule: Hidden sections not shown on public page

### Media Library Management (ADMIN Only)

**POST /api/v1/admin/media/upload**
- Upload media file
- Role: ADMIN only
- Request: multipart/form-data with file
- Response: 201 Created with media file object and Location header
- Validation: file type (images, videos), file size (max 10MB for images, 100MB for videos)
- Processing: Generate thumbnail, extract dimensions, validate file
- Business rule: Generate unique filename, set uploadedById

**GET /api/v1/admin/media**
- List media files
- Role: ADMIN only
- Query params: page, limit, folder, mimeType, search
- Response: 200 OK with paginated media list
- Filters: folder, mime type, uploader, date range
- Sort: By createdAt DESC (most recent first)
- Search: filename, originalName, altText

**GET /api/v1/admin/media/{id}**
- Get media file details
- Role: ADMIN only
- Response: 200 OK with media file object
- Includes: All metadata, URLs, uploader info

**PATCH /api/v1/admin/media/{id}**
- Update media file metadata
- Role: ADMIN only
- Request: altText, folder
- Response: 200 OK with updated media file
- Business rule: Cannot change file itself, only metadata

**DELETE /api/v1/admin/media/{id}**
- Delete media file
- Role: ADMIN only
- Response: 204 No Content
- Check: Warn if file is referenced in content sections
- Business rule: Delete database record and actual file
- Alternative: Soft delete recommended

**POST /api/v1/admin/media/folders**
- Create media folder
- Role: ADMIN only
- Request: name, parent (optional)
- Response: 201 Created with folder object
- Validation: unique name within parent

**GET /api/v1/admin/media/folders**
- List media folders
- Role: ADMIN only
- Response: 200 OK with folder tree structure
- Includes: File count per folder

### Site Settings Management (ADMIN Only)

**GET /api/v1/admin/settings**
- List all site settings
- Role: ADMIN only
- Query params: group (optional)
- Response: 200 OK with settings array
- Includes: All settings (public and private)
- Group: Filter by setting group (GENERAL, CONTACT, etc.)

**GET /api/v1/admin/settings/{key}**
- Get specific setting
- Role: ADMIN only
- Response: 200 OK with setting object
- Error: 404 if setting not found

**PUT /api/v1/admin/settings/{key}**
- Update setting value
- Role: ADMIN only
- Request: value
- Response: 200 OK with updated setting
- Validation: Validate value based on setting type
- Cache invalidation: Clear settings cache

**GET /api/v1/admin/settings/groups/{group}**
- Get settings by group
- Role: ADMIN only
- Response: 200 OK with settings array
- Filter: All settings in specified group

### Event Management (ADMIN and ORGANIZER)

**POST /api/v1/admin/events**
- Create new event
- Role: ORGANIZER or ADMIN
- Request: title, slug, description, category, venueId, capacity, price, startDate, endDate, status
- Response: 201 Created with event object
- Validation: unique slug, valid dates, valid category
- Business rule: Set authorId to current user

**PUT /api/v1/admin/events/{id}**
- Update event
- Role: ORGANIZER (own events) or ADMIN (any event)
- Request: All event fields
- Response: 200 OK with updated event
- Authorization: ORGANIZER can only update own events (check authorId)
- Validation: Same as create

**DELETE /api/v1/admin/events/{id}**
- Delete event
- Role: ORGANIZER (own events) or ADMIN (any event)
- Response: 204 No Content
- Authorization: Check ownership for ORGANIZER
- Business rule: Check if event has bookings, handle appropriately

**GET /api/v1/admin/events**
- List all events (including drafts)
- Role: ORGANIZER (own events) or ADMIN (all events)
- Query params: page, limit, status, authorId
- Response: 200 OK with event list
- Filter: ORGANIZER sees only own events, ADMIN sees all

**GET /api/v1/admin/events/{id}/bookings**
- Get bookings for event
- Role: ORGANIZER (own events) or ADMIN (any event)
- Response: 200 OK with booking list
- Authorization: Check event ownership for ORGANIZER
- Includes: User details for each booking

### User Management (ADMIN Only)

**GET /api/v1/admin/users**
- List all users
- Role: ADMIN only
- Query params: page, limit, role, search
- Response: 200 OK with paginated user list
- Filters: role, email verification status
- Search: email, name
- Includes: Exclude password hash

**GET /api/v1/admin/users/{id}**
- Get user details
- Role: ADMIN only
- Response: 200 OK with user object
- Includes: Role, email verification, registration date, last login

**PATCH /api/v1/admin/users/{id}/role**
- Change user role
- Role: ADMIN only
- Request: role (USER, ORGANIZER, ADMIN)
- Response: 200 OK with updated user
- Validation: Valid role enum value
- Audit: Log role changes

**PATCH /api/v1/admin/users/{id}/status**
- Activate/deactivate user
- Role: ADMIN only
- Request: active (boolean)
- Response: 200 OK with updated user
- Business rule: Deactivated users cannot login

**DELETE /api/v1/admin/users/{id}**
- Delete user account
- Role: ADMIN only
- Response: 204 No Content
- Business rule: Handle associated data (bookings, events)
- Alternative: Soft delete recommended for audit trail

## Response Structure Standards

### Success Response Format

**Overall Grade: A** - Consistent structure improves client implementation.

**Single Resource Response:**
```
{
  "id": "cuid",
  "title": "Resource title",
  "createdAt": "2025-01-20T10:00:00Z",
  "updatedAt": "2025-01-20T15:30:00Z",
  ... other fields
}
```

**Collection Response:**
```
{
  "data": [
    { "id": "1", ... },
    { "id": "2", ... }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "hasMore": true,
    "nextCursor": "encoded_cursor"
  }
}
```

**Field Naming:**
- Use camelCase consistently (not snake_case)
- Be descriptive but concise
- Avoid abbreviations unless standard (id, url)
- Use consistent names across resources
- Document field meanings clearly

**Nested Resources:**
- Include related resources when needed
- Avoid deep nesting (max 2-3 levels)
- Consider separate endpoints for complex relations
- Document included relationships

### Error Response Format (RFC 9457)

**Overall Grade: A+** - Standardized error format improves debugging.

**Standard Error Response:**
```
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Error",
  "status": 422,
  "detail": "Request validation failed",
  "instance": "/api/v1/events",
  "requestId": "req_abc123",
  "timestamp": "2025-01-20T10:00:00Z",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "Email format is invalid"
    }
  ]
}
```

**Required Fields:**
- **type**: URL to error documentation
- **title**: Short, human-readable summary
- **status**: HTTP status code
- **detail**: Specific explanation
- **instance**: Request URI that caused error

**Additional Fields:**
- **requestId**: Correlation ID for tracing
- **timestamp**: When error occurred
- **errors**: Array of field-level validation errors

**Role-Based Error Messages:**
- 401 Unauthorized: "Authentication required" (missing/invalid token)
- 403 Forbidden: "Insufficient permissions" (wrong role)
- 403 Forbidden: "Access denied to this resource" (not owner)

### Response Headers

**Standard Headers:**
- Content-Type: application/json
- Cache-Control: Caching directives
- ETag: Resource version
- Location: URL of created resource (201)
- Retry-After: When to retry (429, 503)

**Custom Headers:**
- X-Request-ID: Request correlation ID
- X-RateLimit-Limit: Total requests allowed
- X-RateLimit-Remaining: Requests remaining
- X-RateLimit-Reset: When limit resets

**Security Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security: enforce HTTPS

## Pagination Strategies

### Cursor-Based Pagination

**Overall Grade: A+** - Cursor pagination handles real-time data correctly.

**Why Cursor Pagination:**
- No skipped items when data changes
- No duplicate items across pages
- Consistent results during pagination
- Better database performance
- Handles infinite scrolling well

**When to Use:**
- Real-time data feeds (new events published frequently)
- Large datasets (10,000+ items)
- Mobile applications (infinite scroll)
- Data that changes during pagination
- Time-based ordering (newest first)

**Implementation Requirements:**
- Return next cursor in response
- Include hasMore boolean flag
- Support limit parameter (default 20, max 100)
- Order results consistently (typically by ID or createdAt)
- Make cursors opaque (clients shouldn't parse)

**CMS Use Cases:**
- Content page listings
- Media library (files added frequently)
- User activity logs
- Booking history

### Offset-Based Pagination

**Overall Grade: B** - Simple but has consistency issues.

**Why Offset Pagination:**
- Simple to implement
- Enables "jump to page" functionality
- Shows total page count
- Familiar to users
- Works for stable datasets

**When to Use:**
- Admin interfaces with page numbers
- Small datasets (< 1,000 items)
- Reports with stable data
- Search results (short session)
- Rarely changing data

**CMS Use Cases:**
- Admin user management (rarely changes during browsing)
- Settings management (small, stable dataset)
- Event analytics reports

**Limitations:**
- Can skip items when data changes
- Can show duplicate items across pages
- Poor database performance with large offsets
- Inconsistent results during pagination

**Best Practices:**
- Use page and perPage parameters (not offset/limit)
- Return total count and total pages
- Include hasNext and hasPrev flags
- Cap maximum page size (100 items)
- Consider cursor pagination for better UX

## Request Filtering and Sorting

### Query Parameter Standards

**Overall Grade: A** - Consistent query parameters improve API usability.

**Filtering Parameters:**
- Use field name as parameter (category, status, role)
- Support multiple values with comma separation
- Date ranges: startDate and endDate
- Numeric ranges: minPrice and maxPrice
- Boolean filters: featured=true, published=true

**Sorting Parameters:**
- sortBy: Field name to sort on
- sortOrder: asc or desc (default: asc)
- Support multiple sort fields (comma-separated)
- Document available sort fields
- Default sort order documented

**Search Parameters:**
- search or q: Full-text search query
- Minimum length requirement (3 characters)
- Support partial matching
- Document searchable fields
- Return relevance-sorted results

**Field Selection:**
- fields: Comma-separated list of fields to return
- Reduces bandwidth for mobile clients
- Improves performance (fewer joins)
- Document available fields
- Return error for invalid fields

**CMS-Specific Filters:**
- Content pages: status, author, publishedAt range
- Media files: folder, mimeType, uploadedBy, date range
- Settings: group, isPublic
- Events: status, category, venue, date range, authorId (for ORGANIZER)

### Filter Implementation

**Filter Best Practices:**
- ✅ Validate all filter values
- ✅ Return 400 for invalid filters
- ✅ Support common operators (gt, lt, gte, lte)
- ✅ Enable combining multiple filters
- ✅ Document filter behavior clearly
- ❌ Don't expose internal database fields
- ❌ Avoid overly complex filter syntax

**Common Filter Patterns:**
- Exact match: ?status=published
- Multiple values: ?category=music,sports
- Date range: ?startDate=2025-01-01&endDate=2025-12-31
- Numeric range: ?minPrice=50&maxPrice=200
- Boolean: ?featured=true

**Role-Based Filtering:**
- ORGANIZER: Automatically filter to own resources (authorId)
- ADMIN: See all resources (no automatic filtering)
- USER: See only own resources for bookings/profile

## Rate Limiting

### Rate Limit Strategy

**Overall Grade: A+** - Rate limiting prevents abuse and ensures fair usage.

**Why Rate Limiting:**
- Prevents brute force attacks
- Protects against resource exhaustion
- Ensures fair usage across clients
- Prevents accidental DoS from buggy clients
- Enables tiered service levels

**Rate Limit Tiers:**
- **Authentication**: 5 attempts per 15 minutes (prevent brute force)
- **General API**: 100 requests per 15 minutes (authenticated users)
- **Booking**: 10 requests per hour (prevent automated scalping)
- **Public endpoints**: 200 requests per 15 minutes (no auth)
- **Admin CMS**: 200 requests per 15 minutes (ADMIN role)
- **File Upload**: 10 uploads per hour (ADMIN role)

### Rate Limit Implementation

**Headers to Return:**
- X-RateLimit-Limit: Total allowed requests
- X-RateLimit-Remaining: Requests remaining in window
- X-RateLimit-Reset: Timestamp when limit resets
- Retry-After: Seconds to wait (on 429 responses)

**Rate Limit Response:**
- Return 429 Too Many Requests
- Include Retry-After header
- Clear error message explaining limit
- Document rate limits in API docs
- Log rate limit violations

**Best Practices:**
- ✅ Apply per user/IP/API key
- ✅ Use sliding windows (not fixed)
- ✅ Whitelist trusted services
- ✅ Adjust limits for different roles
- ✅ Monitor limit hit rates
- ❌ Don't block legitimate users
- ❌ Don't use in-memory storage (doesn't scale)

## File Upload API Design

### File Upload Endpoints

**Overall Grade: A+** - Proper file upload design ensures security and performance.

**Upload Endpoint Design:**
- Use POST with multipart/form-data
- Return 201 Created with file metadata
- Include Location header with file URL
- Generate unique filename server-side
- Validate before processing

**File Upload Best Practices:**
- ✅ Validate file type (magic numbers, not extension)
- ✅ Validate file size before accepting
- ✅ Generate unique filename (prevent conflicts)
- ✅ Process asynchronously (thumbnails, optimization)
- ✅ Return immediately with processing status
- ❌ Never trust client-provided filename
- ❌ Don't block request while processing
- ❌ Avoid synchronous image processing

**Upload Flow:**
1. Client uploads file to /api/v1/admin/media/upload
2. Server validates type and size
3. Server saves file with unique name
4. Server creates database record
5. Server returns 201 with metadata
6. Background job processes file (thumbnails, optimization)
7. Client polls or receives webhook on completion

**Security Considerations:**
- Validate file type via magic numbers
- Scan for malware
- Limit file size (10MB images, 100MB videos)
- Store outside web root
- Serve from separate domain or CDN
- Generate URLs with expiration (optional)

### Media Serving Strategy

**Direct File Serving:**
- Serve from CDN or separate domain
- Use unique URLs (prevent caching issues)
- Set appropriate Cache-Control headers
- Return 404 for missing files

**Signed URLs (Optional):**
- Generate temporary URLs with expiration
- Prevent unauthorized access to private files
- Include signature in URL
- Validate signature on access

**Thumbnail Generation:**
- Generate multiple sizes (400px, 800px)
- Create automatically on upload
- Store URLs in database
- Serve appropriate size based on usage

## API Versioning

### Versioning Strategy

**Overall Grade: A+** - URI path versioning provides clarity and simplicity.

**Why URI Path Versioning:**
- Explicit and visible in URL
- Easy to route different versions
- Clear for API consumers
- Enables independent caching
- Allows gradual migration

**Version Format:**
- Use /v1/, /v2/ prefix (not /api/1/)
- Include in all URLs
- Start with v1 (not v0)
- Increment for breaking changes
- Keep version number simple

**Example URLs:**
- /api/v1/events
- /api/v1/admin/content/pages
- /api/v2/events (when breaking changes needed)

**Alternative Approaches (Not Recommended):**
- Header versioning: Less visible, harder to debug
- Query parameter: Breaks caching, less RESTful
- Content negotiation: Complex, poorly supported

### Version Lifecycle Management

**Version Support Policy:**
- Maintain minimum 12-18 months support
- Announce deprecation 6 months in advance
- Provide migration guides
- Send deprecation headers
- Monitor version usage metrics

**Deprecation Headers:**
- Sunset: Date when version will be removed
- Deprecation: Boolean indicating deprecated status
- Link: URL to successor version
- Warning: Migration instructions

**Breaking vs Non-Breaking Changes:**

**Breaking Changes (Require New Version):**
- Removing endpoints or fields
- Changing field types
- Renaming fields or endpoints
- Changing error response formats
- Modifying required fields
- Altering authentication methods

**Non-Breaking Changes (Same Version):**
- Adding new endpoints
- Adding optional fields
- Adding new error codes
- Improving performance
- Enhancing documentation
- Adding query parameters (optional)

## API Security Standards

### Authentication Headers

**Bearer Token Format:**
- Authorization: Bearer <access_token>
- Use JWT tokens for stateless auth
- Validate token signature and expiration
- Extract user context from token (id, role)
- Return 401 for invalid/expired tokens

**Token Claims:**
- User ID (sub)
- User role (role)
- Token type (access/refresh)
- Expiration (exp)
- Issued at (iat)

### Authorization Patterns

**Role-Based Authorization:**
- Check role after authentication
- Verify against required roles for endpoint
- Return 403 for insufficient permissions
- Log authorization failures

**Resource Ownership:**
- Verify user owns resource (for ORGANIZER)
- Check in database query (not application code)
- Return 403 for ownership violations
- ADMIN bypasses ownership checks

**Authorization Implementation:**
- Use guards/middleware at route level
- Check authentication first, then authorization
- Fail closed (deny by default)
- Test authorization thoroughly
- Document required roles in API docs

### Input Validation

**Validation Requirements:**
- ✅ Validate ALL user input server-side
- ✅ Never trust client-side validation
- ✅ Reject unexpected fields
- ✅ Enforce type constraints strictly
- ✅ Check length limits on all strings
- ✅ Validate format (email, URL, slug, date)
- ❌ Never accept input without validation

**CMS-Specific Validation:**
- Slug format: lowercase alphanumeric with hyphens
- Section data: Validate JSON structure per type
- Media files: Validate type via magic numbers
- Settings: Validate value based on type
- Dates: Validate date format and logical constraints

### CORS Configuration

**CORS Setup:**
- Whitelist specific origins (not *)
- Allow necessary HTTP methods
- Allow required headers
- Set appropriate preflight cache duration
- Enable credentials if needed

**Security Considerations:**
- ✅ Whitelist specific origins
- ✅ Validate Origin header
- ✅ Return appropriate CORS headers
- ✅ Handle preflight OPTIONS requests
- ❌ Never use * with credentials
- ❌ Don't expose sensitive headers

## API Documentation

### Documentation Requirements

**Overall Grade: A+** - Comprehensive documentation enables easy integration.

**OpenAPI/Swagger Specification:**
- Generate from code (decorators)
- Keep synchronized with implementation
- Include request/response examples
- Document error responses
- Provide authentication guide
- Document rate limits

**Documentation Checklist:**
- Endpoint description and purpose
- HTTP method and path
- Required authentication/authorization
- Request parameters (path, query, body)
- Request body schema
- Response schema (success and error)
- Success and error status codes
- Rate limiting information
- Example requests and responses

**Role-Based Documentation:**
- Clearly mark endpoints by required role
- Document ORGANIZER ownership rules
- Explain ADMIN-only endpoints
- Provide role-specific examples

**CMS Documentation:**
- Document all section types and JSON structures
- Explain content publishing workflow
- Document media upload process and limits
- Explain settings groups and types
- Provide complete examples for each endpoint

## API Testing Strategy

### Test Coverage

**Unit Tests:**
- Validation logic
- Business rules
- Authorization checks
- Helper functions

**Integration Tests:**
- Complete request/response cycles
- Authentication flow
- Authorization enforcement
- Database operations
- Error handling

**E2E Tests:**
- Complete user workflows
- Booking flow
- Content publishing workflow
- Media upload flow
- User management flow

**Role-Based Testing:**
- Test each endpoint with each role
- Test ownership checks for ORGANIZER
- Test unauthorized access (expect 403)
- Test unauthenticated access (expect 401)

## API Performance Optimization

### Response Time Targets

**Public API:**
- Event listings: < 100ms
- Event detail: < 50ms
- Search: < 150ms

**Admin CMS API:**
- Page list: < 100ms
- Page with sections: < 150ms
- Media library: < 100ms
- Settings: < 50ms

**Optimization Strategies:**
- Cache published content aggressively
- Index database queries properly
- Use connection pooling
- Minimize N+1 queries
- Paginate large datasets
- Compress responses

## Recommended API Design Grade: A+

**Strengths:**
- ✅ RESTful principles with resource-based URLs
- ✅ Proper HTTP method semantics
- ✅ Consistent error handling (RFC 9457)
- ✅ Clear role-based access control (RBAC)
- ✅ Comprehensive CMS endpoints
- ✅ File upload with proper validation
- ✅ Cursor-based pagination for real-time data
- ✅ Clear versioning strategy
- ✅ Comprehensive rate limiting
- ✅ Security best practices

**Critical Requirements:**
- Follow RESTful conventions strictly
- Implement proper RBAC for all endpoints
- Return appropriate HTTP status codes
- Implement proper error responses
- Use cursor pagination for changing data
- Version API explicitly
- Rate limit all endpoints appropriately
- Validate all input server-side
- Document API comprehensively
- Test with real client applications
- Protect admin endpoints with role checks
- Validate file uploads thoroughly
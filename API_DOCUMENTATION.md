# API Documentation

BOH Event Management Platform API - Version 1.0

Base URL: `http://localhost:3000/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

## Response Format

All responses follow a consistent format:

**Success Response:**
```json
{
  "data": { ... },
  "meta": { ... }
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "timestamp": "2025-01-20T10:00:00.000Z",
  "path": "/api/v1/events",
  "method": "POST",
  "message": "Validation failed",
  "errors": [ ... ]
}
```

## Endpoints

### Authentication

#### Register User

```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation:**
- Email must be valid format
- Password minimum 8 characters
- First name minimum 2 characters
- Last name minimum 2 characters

---

#### Login

```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials
- `401 Unauthorized` - Account not active

---

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Logout

```http
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `204 No Content`

---

#### Get Profile

```http
GET /api/v1/auth/profile
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

---

### Public Events

#### List Events

```http
GET /api/v1/events?page=1&limit=20
```

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Tech Conference 2025",
      "slug": "tech-conference-2025",
      "description": "The biggest tech conference...",
      "shortDescription": "Annual tech conference...",
      "eventType": "CONFERENCE",
      "status": "PUBLISHED",
      "startDate": "2025-06-15T09:00:00.000Z",
      "endDate": "2025-06-17T18:00:00.000Z",
      "basePrice": "299.99",
      "currency": "USD",
      "availableTickets": 1500,
      "totalTickets": 2000,
      "featuredImage": "https://...",
      "tags": ["technology", "conference"],
      "venue": {
        "id": "uuid",
        "name": "Madison Square Garden",
        "city": "New York",
        "state": "NY"
      },
      "organizer": {
        "id": "uuid",
        "firstName": "Event",
        "lastName": "Organizer"
      },
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 2
  }
}
```

---

#### Get Event by ID

```http
GET /api/v1/events/:id
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "title": "Tech Conference 2025",
  "slug": "tech-conference-2025",
  "description": "Detailed description...",
  "eventType": "CONFERENCE",
  "status": "PUBLISHED",
  "startDate": "2025-06-15T09:00:00.000Z",
  "endDate": "2025-06-17T18:00:00.000Z",
  "basePrice": "299.99",
  "availableTickets": 1500,
  "totalTickets": 2000,
  "venue": { ... },
  "organizer": { ... }
}
```

**Errors:**
- `404 Not Found` - Event not found

---

#### Get Event by Slug

```http
GET /api/v1/events/slug/:slug
```

**Response:** `200 OK` (same as Get Event by ID)

---

### Admin Events

All admin endpoints require authentication and appropriate role.

#### List All Events (Admin)

```http
GET /api/v1/admin/events?page=1&limit=20
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Required Roles:** ADMIN, ORGANIZER

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)

**Response:** `200 OK` (includes all statuses, not just PUBLISHED)

---

#### Get Event Details (Admin)

```http
GET /api/v1/admin/events/:id
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Required Roles:** ADMIN, ORGANIZER

**Response:** `200 OK`

---

#### Create Event

```http
POST /api/v1/admin/events
```

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Required Roles:** ADMIN, ORGANIZER

**Request Body:**
```json
{
  "title": "Summer Music Festival",
  "slug": "summer-music-festival",
  "description": "Three days of amazing music...",
  "shortDescription": "Three-day outdoor festival",
  "eventType": "FESTIVAL",
  "startDate": "2025-07-20T16:00:00.000Z",
  "endDate": "2025-07-22T23:00:00.000Z",
  "basePrice": 149.99,
  "totalTickets": 9000,
  "venueId": "uuid",
  "featuredImage": "https://...",
  "tags": ["music", "festival", "outdoor"]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "title": "Summer Music Festival",
  "slug": "summer-music-festival",
  "status": "DRAFT",
  ...
}
```

**Validation:**
- Title: minimum 3 characters
- Slug: required, unique
- Description: minimum 10 characters
- Event type: valid enum value
- Start/end dates: valid ISO 8601
- Base price: minimum 0
- Total tickets: minimum 1
- Venue ID: must exist

**Errors:**
- `400 Bad Request` - Validation failed
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

---

#### Update Event

```http
PUT /api/v1/admin/events/:id
```

**Headers:**
```
Authorization: Bearer <access-token>
Content-Type: application/json
```

**Required Roles:** ADMIN, ORGANIZER

**Request Body:** (partial update supported)
```json
{
  "title": "Updated Title",
  "basePrice": 199.99
}
```

**Response:** `200 OK`

---

#### Delete Event

```http
DELETE /api/v1/admin/events/:id
```

**Headers:**
```
Authorization: Bearer <access-token>
```

**Required Roles:** ADMIN only

**Response:** `200 OK`
```json
{
  "message": "Event deleted successfully"
}
```

---

### Health Checks

#### Basic Health Check

```http
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

---

#### Readiness Check

```http
GET /health/ready
```

**Response:** `200 OK`
```json
{
  "status": "ready",
  "database": "connected",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

**If unhealthy:** `503 Service Unavailable`
```json
{
  "status": "not ready",
  "database": "disconnected",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

---

## Data Models

### User Roles

- `USER` - Regular user, can book events
- `ORGANIZER` - Can create and manage own events
- `ADMIN` - Full system access

### Event Types

- `CONCERT`
- `CONFERENCE`
- `WORKSHOP`
- `SPORTS`
- `FESTIVAL`
- `EXHIBITION`
- `OTHER`

### Event Status

- `DRAFT` - Not visible to public
- `PUBLISHED` - Visible and bookable
- `CANCELLED` - Event cancelled
- `COMPLETED` - Event finished

### User Status

- `ACTIVE` - Can login and use system
- `SUSPENDED` - Temporarily disabled
- `DELETED` - Soft deleted

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Success, no body |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Default rate limits:
- 100 requests per minute per IP
- Applies to all endpoints

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642680000
```

When exceeded:
```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

---

## CORS

Allowed origins (configured in .env):
- http://localhost:3001
- http://localhost:5173

Allowed methods:
- GET, POST, PUT, PATCH, DELETE, OPTIONS

Credentials: Enabled

---

## Examples

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@boh.com","password":"admin123"}'
```

**Get Events:**
```bash
curl http://localhost:3000/api/v1/events
```

**Create Event (requires token):**
```bash
curl -X POST http://localhost:3000/api/v1/admin/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "New Event",
    "slug": "new-event",
    "description": "Event description here",
    "eventType": "CONFERENCE",
    "startDate": "2025-12-01T10:00:00Z",
    "endDate": "2025-12-01T18:00:00Z",
    "basePrice": 99.99,
    "totalTickets": 100,
    "venueId": "venue-uuid"
  }'
```

### JavaScript/TypeScript Examples

```typescript
// Login
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@boh.com',
    password: 'admin123',
  }),
});
const { accessToken } = await loginResponse.json();

// Get events
const eventsResponse = await fetch('http://localhost:3000/api/v1/events');
const events = await eventsResponse.json();

// Create event (authenticated)
const createResponse = await fetch('http://localhost:3000/api/v1/admin/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: 'New Event',
    // ... other fields
  }),
});
```

---

## Changelog

### Version 1.0.0 (2025-01-20)
- Initial release
- Authentication endpoints
- Events CRUD (public + admin)
- Health checks
- Role-based access control

---

## Support

For API support, please:
1. Check this documentation
2. Review code examples
3. Create an issue in the repository

---

**Last Updated:** 2025-01-20
**API Version:** 1.0.0

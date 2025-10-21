# Quick Start Guide

Get the BOH API running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed

## Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

```bash
docker-compose up -d
```

Wait 10 seconds for services to initialize.

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed test data
npm run prisma:seed
```

### 4. Start Server

```bash
npm run start:dev
```

## Test the API

### Check Health

```bash
curl http://localhost:3000/health
```

### Login as Admin

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@boh.com",
    "password": "admin123"
  }'
```

Save the `accessToken` from the response.

### Get Events

```bash
curl http://localhost:3000/api/v1/events
```

### Create Event (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/admin/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My New Event",
    "slug": "my-new-event",
    "description": "This is a test event",
    "eventType": "CONFERENCE",
    "startDate": "2025-12-01T10:00:00Z",
    "endDate": "2025-12-01T18:00:00Z",
    "basePrice": 99.99,
    "totalTickets": 100,
    "venueId": "YOUR_VENUE_ID"
  }'
```

## Test Users

- **Admin**: admin@boh.com / admin123
- **Organizer**: organizer@boh.com / organizer123
- **User**: user@boh.com / user123

## Next Steps

1. Read the full README.md
2. Explore the API endpoints
3. Check out the Prisma Studio: `npx prisma studio`
4. Review the architecture in `/src`

## Troubleshooting

**Database connection failed?**
```bash
docker-compose restart
```

**Port 3000 in use?**
```bash
# Change PORT in .env file
PORT=3001
```

**Need to reset everything?**
```bash
docker-compose down -v
docker-compose up -d
npx prisma migrate reset
npm run prisma:seed
```

Happy coding! 🚀

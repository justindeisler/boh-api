# Database Seed Data Summary

## Overview
The database has been successfully seeded with comprehensive, realistic German event data following the requirements from `context/database-design.md`.

## Seeded Data

### Users (20 Total)
- **2 ADMIN Users:**
  - admin@boh.de (Anna Schmidt)
  - manager@boh.de (Michael Müller)

- **3 ORGANIZER Users:**
  - organizer1@boh.de (Thomas Weber)
  - organizer2@boh.de (Sarah Fischer)
  - organizer3@boh.de (Markus Becker)

- **15 USER Users:**
  - user1@boh.de through user15@boh.de
  - Mix of users with and without phone numbers
  - All with realistic German names

**All passwords:** `Password123!` (hashed with bcrypt, 10 rounds)

### Venues (5 German Cities)
1. **Berliner Messehalle** - Berlin (5,000 capacity)
2. **Münchner Kulturzentrum** - München (3,000 capacity)
3. **Hamburger Konzerthaus** - Hamburg (2,000 capacity)
4. **Frankfurter Festhalle** - Frankfurt am Main (1,000 capacity)
5. **Stuttgarter Liederhalle** - Stuttgart (500 capacity)

All venues include:
- Realistic German addresses and coordinates
- Various amenities arrays (Parkplatz, WLAN, Barrierefreiheit, etc.)

### Events (50 Events)
Distribution across categories:
- **MUSIC:** Classical concerts, jazz nights, electronic festivals
- **SPORTS:** Bundesliga, marathons, tennis, basketball
- **CONFERENCE:** Tech summits, marketing conferences, startup events
- **WORKSHOP:** Photography, coding bootcamps, yoga retreats, cooking classes
- **THEATER:** Musicals, comedy shows, classic plays
- **EXHIBITION:** Art exhibitions, museums, photography displays
- **FESTIVAL:** Oktoberfest, Christmas markets, food festivals
- **OTHER:** Wine tastings, book readings, charity galas

**Status Distribution:**
- 15 COMPLETED events (past dates)
- 20 PUBLISHED events (future dates, available for booking)
- 10 DRAFT events (not yet published)
- 5 CANCELLED events

**Pricing:**
- Range: €0 (free events) to €500
- Mix of free and paid events
- Realistic German event pricing

### Tags (15 Tags)
- Live Musik, Outdoor, Familienfreundlich, Indoor
- Wochenende, Abendveranstaltung, Klassische Musik
- Pop & Rock, Jazz, Food & Drinks
- Workshop, Networking, Sport, Kultur, Bildung

**Event-Tag Associations:** 148 total (2-4 tags per event)

### Bookings (40 Bookings)
- Random users booking random PUBLISHED events
- Status distribution:
  - 75% CONFIRMED bookings
  - 12.5% PENDING bookings
  - 12.5% CANCELLED bookings
- Seat counts: 1-8 seats per booking
- Correct price calculations (seats × event price)
- Payment IDs for confirmed bookings

### Content Pages (5 Pages)
1. **Home** - Willkommen bei BOH Events
2. **About** - Über Uns
3. **Contact** - Kontakt
4. **Privacy** - Datenschutzerklärung
5. **Terms** - Allgemeine Geschäftsbedingungen

All pages are PUBLISHED with proper meta descriptions

### Content Sections (13 Sections)
Various section types distributed across pages:
- **HERO** sections with background images and CTAs
- **TEXT** sections with German content
- **IMAGE** sections with captions
- **VIDEO** sections
- **GALLERY** sections with multiple images
- **CONTACT_FORM** sections with field configurations
- **EVENT_LIST** sections for dynamic event display

### Site Settings (10 Settings)
**GENERAL Group:**
- site_name: "BOH Events"
- site_description: "Deutschlands führende Event-Plattform"

**CONTACT Group:**
- contact_email: kontakt@boh.de
- contact_phone: +49 30 12345678
- contact_address: Musterstraße 123, 10115 Berlin, Deutschland

**SOCIAL_MEDIA Group:**
- facebook_url, instagram_url, twitter_url

**SEO Group:**
- default_meta_description

**APPEARANCE Group:**
- primary_color: #3B82F6

### Media Files (3 Sample Files)
- Concert crowd image (2MB, 1920×1080)
- Festival stage image (3MB, 2400×1600)
- Workshop room image (1.5MB, 1600×1200)

All with proper metadata, thumbnails, and folder organization

## Running the Seed Script

To seed the database:
```bash
npm run prisma:seed
```

To re-seed (clears existing data first):
```bash
npm run prisma:seed
```

## Test User Credentials

### Admin Access
```
Email: admin@boh.de
Password: Password123!
```

### Organizer Access
```
Email: organizer1@boh.de
Password: Password123!
```

### Regular User Access
```
Email: user1@boh.de
Password: Password123!
```

## Database Statistics

| Table | Count |
|-------|-------|
| Users | 20 |
| Venues | 5 |
| Events | 50 |
| Tags | 15 |
| Event-Tag Associations | 148 |
| Bookings | 40 |
| Content Pages | 5 |
| Content Sections | 13 |
| Site Settings | 10 |
| Media Files | 3 |

## Notes

- All data uses realistic German names, locations, and conventions
- Event dates are distributed across past, present, and future
- Prices are in EUR (€)
- All timestamps are in UTC
- Phone numbers follow German format (+49...)
- Addresses and coordinates are realistic for German cities


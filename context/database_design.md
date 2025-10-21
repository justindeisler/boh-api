# Database Design Guidelines

This file provides guidance when working with PostgreSQL databases for the event management platform with integrated CMS. Follow these standards to ensure data integrity, optimal performance, and maintainable schema design.

## Important: Schema Design Principles

**MANDATORY**: All schema changes must go through migrations. Never modify the database directly in production. Always test migrations in staging before production deployment. Implement safe migration patterns for zero-downtime deployments.

## PostgreSQL 16 Overview

**Event Management Database** uses PostgreSQL 16 with Prisma ORM, featuring advanced indexing strategies, connection pooling, and automated backup systems. The database is optimized for high-concurrency booking scenarios with proper transaction isolation and data integrity constraints. The database also supports a full Content Management System (CMS) with media library, content pages, and site settings.

## Database Configuration

- **Database Name**: boh_db
- **Database User**: boh_user
- **Host**: localhost
- **Port**: 5432
- **Connection Pooling**: PgBouncer on port 6432
- **Character Set**: UTF-8
- **Timezone**: UTC

## Entity Relationship Overview

The database consists of two main domains:

**Event Management Domain:**
- User manages Bookings
- User creates Events (as author)
- Events belong to Venues
- Events have many-to-many relationship with Tags
- Bookings link Users to Events

**Content Management Domain:**
- User creates ContentPages (as author)
- ContentPage has many ContentSections
- User uploads MediaFiles
- SiteSettings store global configuration

## Database Schema Design

### Event Management Tables

#### Users
Stores all platform users with role-based access control.

**Purpose**: Central authentication and authorization for all platform users.

**Key Fields**:
- Unique identifier (CUID)
- Email (unique, used for login)
- Password hash (bcrypt, never plain text)
- Role: USER, ORGANIZER, or ADMIN
- Email verification status
- Contact information (name, phone)

**Relationships**:
- One-to-many with Bookings (users make multiple bookings)
- One-to-many with Events (organizers/admins create events)
- One-to-many with ContentPages (admins create CMS pages)
- One-to-many with MediaFiles (track file uploaders)

**Business Rules**:
- Email must be unique across platform
- Password must be hashed before storage
- Role changes require admin authorization
- Deleted users should soft-delete or anonymize bookings

---

#### Events
Core event information for the platform.

**Purpose**: Store all event data including scheduling, pricing, and availability.

**Key Fields**:
- Slug (URL-friendly unique identifier for SEO)
- Title and description (TEXT type for unlimited length)
- Category (enum for filtering)
- Capacity and booked count (availability calculation)
- Price (use Decimal in production for currency)
- Start and end dates (stored in UTC)
- Status: DRAFT, PUBLISHED, CANCELLED, COMPLETED
- Media URLs (image, video)
- Author reference (who created the event)

**Relationships**:
- Many-to-one with Venue (event location)
- Many-to-one with User (creator)
- One-to-many with Bookings (all event tickets)
- Many-to-many with Tags (flexible categorization)

**Business Rules**:
- Slug must be unique and URL-safe
- End date must be after start date
- Booked count cannot exceed capacity
- Only PUBLISHED events visible to public
- ORGANIZER can only edit own events
- ADMIN can edit all events

---

#### Venues
Physical locations where events take place.

**Purpose**: Centralize venue information for reuse across multiple events.

**Key Fields**:
- Slug (URL-friendly identifier)
- Full location details (address, city, country)
- Geographic coordinates (latitude, longitude)
- Capacity (maximum venue capacity)
- Amenities array (parking, WiFi, accessibility)

**Relationships**:
- One-to-many with Events (venue hosts multiple events)

**Business Rules**:
- Venue capacity is maximum; events can have lower capacity
- Coordinates optional but recommended for maps
- Amenities stored as array for flexible filtering

---

#### Bookings
User event registrations and ticket purchases.

**Purpose**: Track all event bookings with payment and status information.

**Key Fields**:
- Number of seats booked
- Total price (calculated: seats × event price)
- Status: PENDING, CONFIRMED, CANCELLED, REFUNDED
- Payment processor reference
- Booking creation date

**Relationships**:
- Many-to-one with User (booking owner)
- Many-to-one with Event (booked event)

**Business Rules**:
- Booking reduces available capacity
- PENDING bookings should expire after timeout
- CANCELLED bookings free up capacity
- Total price captured at booking time (historical pricing)
- Cannot book more seats than available capacity

**Transaction Requirements**:
- Booking creation must be atomic
- Use database transactions to prevent overbooking
- Consider row-level locking for capacity checks

---

#### Tags
Flexible categorization system for events.

**Purpose**: Enable multiple categorizations beyond primary category field.

**Key Fields**:
- Display name
- URL-friendly slug

**Relationships**:
- Many-to-many with Events (through EventTag junction table)

**Business Rules**:
- Tags are reusable across events
- Name must be unique
- Slug generated from name

**Use Cases**:
- Subcategories: "Live Band", "DJ", "Acoustic"
- Features: "Family Friendly", "Outdoor", "Food Included"
- Themes: "80s Night", "Jazz", "Rock"

---

#### EventTag Junction Table
Links events to multiple tags.

**Purpose**: Enable many-to-many relationship between Events and Tags.

**Key Fields**:
- Composite primary key (eventId, tagId)

**Cascade Behavior**:
- Delete event → delete EventTag entries
- Delete tag → delete EventTag entries (or prevent if tag in use)

---

### Content Management System Tables

#### ContentPage
CMS pages for static website content.

**Purpose**: Manage dynamic pages like About, Contact, Terms of Service, Privacy Policy.

**Key Fields**:
- Slug (URL path, e.g., "about-us" becomes /about-us)
- Title (for page title and headings)
- Meta description (SEO for search engines)
- Status: DRAFT (not visible), PUBLISHED (public), ARCHIVED (hidden but kept)
- Published date (for scheduling)
- Author reference

**Relationships**:
- Many-to-one with User (content creator)
- One-to-many with ContentSection (page composition)

**Business Rules**:
- Slug must be unique and URL-safe
- Only ADMIN can create/edit/delete pages
- Only PUBLISHED pages visible to public
- Published date set automatically on status change to PUBLISHED
- Sections ordered by position field

**SEO Considerations**:
- Meta description should be 150-160 characters
- Title should be under 60 characters
- Slug should be descriptive and keyword-rich

---

#### ContentSection
Modular page building blocks.

**Purpose**: Enable flexible page composition with different section types.

**Key Fields**:
- Section type (HERO, TEXT, IMAGE, VIDEO, GALLERY, CONTACT_FORM, EVENT_LIST)
- Position (ordering, enables drag-and-drop)
- Data (flexible JSON for type-specific content)
- Visibility flag (hide without deletion)

**Relationships**:
- Many-to-one with ContentPage

**Section Types and Data Structures**:

**HERO Section:**
- Heading and subheading text
- Background image URL
- Call-to-action text and link
- Text alignment

**TEXT Section:**
- Rich text HTML content
- Alignment setting

**IMAGE Section:**
- Image URL
- Caption and alt text
- Alignment and width settings

**VIDEO Section:**
- Video URL (YouTube, Vimeo, or direct)
- Thumbnail image
- Caption

**GALLERY Section:**
- Array of images with captions and alt text
- Column layout setting
- Spacing preference

**CONTACT_FORM Section:**
- Field configuration
- Submit button text
- Recipient email
- Success message

**EVENT_LIST Section:**
- Number of events to display
- Category filter
- Sort order
- Display style (grid/list)

**Business Rules**:
- Position determines display order
- Data structure validated based on section type
- Hidden sections remain in database but not rendered

---

#### MediaFile
File upload and media management.

**Purpose**: Store metadata for uploaded images and videos.

**Key Fields**:
- Filename (system-generated unique name)
- Original filename (user's upload name)
- MIME type and file size
- Image dimensions (width, height)
- URLs (original and thumbnail)
- Alt text (accessibility)
- Folder organization
- Uploader reference

**Relationships**:
- Many-to-one with User (uploader tracking)

**Business Rules**:
- Actual files stored in filesystem or cloud storage
- Database stores metadata only
- Generate unique filenames to prevent conflicts
- Create thumbnails automatically for images
- Organize by upload date or folders

**File Management Strategy**:
- Soft delete recommended (mark as deleted, clean up later)
- Check references before deleting (used in sections?)
- Schedule cleanup job for orphaned files
- Keep database and filesystem in sync

**Folder Organization**:
- Default folder: "root"
- Suggested folders: events, pages, general, users
- Enable folder-based filtering in media library

---

#### SiteSetting
Global site configuration.

**Purpose**: Store key-value pairs for site-wide settings.

**Key Fields**:
- Unique key (identifier)
- Value (stored as text)
- Type: TEXT, NUMBER, BOOLEAN, JSON, IMAGE
- Group (GENERAL, CONTACT, SOCIAL_MEDIA, SEO, APPEARANCE)
- Description (admin documentation)
- Public flag (expose to frontend API)

**Business Rules**:
- Key must be unique
- Validate value based on type
- Public settings accessible without authentication
- Private settings require admin access

**Common Settings by Group**:

**GENERAL:**
- Site name and description
- Contact and support emails
- Maintenance mode flag

**CONTACT:**
- Physical address
- Phone number
- Business hours

**SOCIAL_MEDIA:**
- Facebook, Twitter, Instagram, LinkedIn URLs
- Social media handles

**SEO:**
- Default meta description
- Default Open Graph image
- Google Analytics ID

**APPEARANCE:**
- Primary and secondary colors
- Logo and favicon URLs
- Custom CSS

---

## Schema Design Best Practices

### Overall Design Principles

**Overall Grade: A+** - Well-designed schemas prevent future problems.

**Schema Organization:**
- ✅ Use singular model names (Event, not Events)
- ✅ Map to plural table names
- ✅ Define clear primary keys (UUIDs preferred)
- ✅ Establish foreign key relationships explicitly
- ✅ Use enums for fixed value sets
- ❌ Never use auto-incrementing IDs in distributed systems
- ❌ Avoid overly normalized schemas (balance with performance)

**Naming Conventions:**
- Models: PascalCase (Event, Booking, User, ContentPage, MediaFile)
- Fields: camelCase (startDate, userId, totalPrice, metaDescription)
- Tables: snake_case plural (events, bookings, users, content_pages)
- Columns: snake_case (start_date, user_id, total_price)
- Indexes: idx_tablename_columnname
- Foreign keys: fk_tablename_columnname

### Data Type Selection

**Appropriate Types:**
- **IDs**: String with UUID (CUID or UUID format)
- **Money**: Decimal with precision (not Float for currency)
- **Dates**: DateTime with timezone (store in UTC always)
- **Text**: String for short text, Text type for long content
- **Enums**: For categorical data (status, category, type, role)
- **JSON**: For flexible metadata (ContentSection data)
- **Boolean**: For true/false states
- **Arrays**: For simple lists (amenities, tags)

**Type Considerations:**
- Use Decimal for currency (Float has precision issues)
- DateTime includes timezone (always store UTC)
- String vs Text: String for indexed fields, Text for content
- JSON for unstructured data (cannot index efficiently)
- JSON perfect for CMS section data (flexible structure)

### Relationship Design

**One-to-Many Relationships:**
- Most common pattern
- Foreign key on "many" side
- Define both sides in schema for type safety
- Configure cascade behavior

**Examples:**
- Event has many Bookings
- ContentPage has many ContentSections
- User has many Events (as author)
- User has many MediaFiles (as uploader)

**Many-to-Many Relationships:**
- Requires junction table
- Explicit model with compound primary key
- Both foreign keys with indexes
- Configure cascade deletes

**Example:**
- Events and Tags through EventTag junction table

**Relationship Best Practices:**
- ✅ Always define both sides
- ✅ Name relationships explicitly if multiple to same model
- ✅ Set appropriate cascade behavior
- ✅ Index all foreign keys
- ❌ Avoid circular dependencies
- ❌ Don't over-normalize

### Enum Usage

**When to Use Enums:**
- Fixed set of values that rarely change
- Status fields (booking status, content status)
- Categories (event categories)
- Types (section types, setting types)
- Roles (user roles)

**Enum Design:**
- Use UPPER_SNAKE_CASE for values
- Keep values descriptive and clear
- Document meaning of each value
- Plan for future additions

**CMS-Specific Enums:**
- **ContentStatus**: DRAFT, PUBLISHED, ARCHIVED
- **SectionType**: HERO, TEXT, IMAGE, VIDEO, GALLERY, CONTACT_FORM, EVENT_LIST
- **SettingType**: TEXT, NUMBER, BOOLEAN, JSON, IMAGE
- **UserRole**: USER, ORGANIZER, ADMIN
- **EventStatus**: DRAFT, PUBLISHED, CANCELLED, COMPLETED
- **BookingStatus**: PENDING, CONFIRMED, CANCELLED, REFUNDED

**When NOT to Use Enums:**
- Frequently changing values (use reference table)
- Values requiring metadata (use separate table)
- Localized values (use reference table with translations)

## Indexing Strategy

### Index Types and Usage

**Overall Grade: A+** - Proper indexing makes 100x performance difference.

**Single Column Indexes:**
- ✅ Index all foreign keys (JOIN performance)
- ✅ Index fields in WHERE clauses (filtering)
- ✅ Index fields in ORDER BY (sorting)
- ✅ Index unique fields (email, username, slug)

**Important Indexes for Event Management:**
- userId, eventId, venueId, authorId on respective tables
- status, category, role for filtering
- slug for URL lookups
- startDate, bookingDate, publishedAt for date queries

**Important Indexes for CMS:**
- slug on content_pages (fast URL lookups)
- pageId, position on content_sections (ordered retrieval)
- uploadedById, folder, mimeType on media_files
- key, group, isPublic on site_settings

**Composite Indexes:**
- Create for multi-column queries
- Column order matters (most selective first)
- Supports leftmost prefix matching
- More efficient than multiple single indexes

**Recommended Composite Indexes:**
- (status, startDate) for published event listings
- (authorId, status) for user's event dashboard
- (category, startDate) for category browsing
- (status, publishedAt) for published content queries
- (folder, createdAt) for media library browsing

**Partial Indexes:**
- Index subset of rows with WHERE condition
- Smaller index size (faster, less storage)
- Ideal for frequently filtered queries

**Examples:**
- Active events only (WHERE status = 'PUBLISHED')
- Published pages only (WHERE status = 'PUBLISHED')
- Recent uploads (WHERE createdAt > NOW() - INTERVAL '30 days')

**Full-Text Search Indexes:**
- Use GIN indexes for text search
- Enable fast full-text search
- Create for searchable content fields

**Recommended for:**
- Event descriptions
- Content page content
- Media file names and alt text

### Index Maintenance Best Practices

- ✅ Create indexes based on query patterns
- ✅ Monitor index usage before creating more
- ✅ Remove unused indexes (they consume write performance)
- ✅ Update statistics regularly
- ❌ Don't index every column
- ❌ Don't create duplicate indexes

## Migration Patterns

### Migration Workflow

**Overall Grade: A** - Proper migration workflow prevents production issues.

**Development Phase:**
- Create migration with descriptive name
- Review generated SQL before applying
- Test migration locally
- Commit migration files to version control
- Never modify applied migrations

**Staging Deployment:**
- Deploy code to staging
- Apply migrations to staging database
- Test application thoroughly
- Verify data integrity
- Monitor performance

**Production Deployment:**
- Plan maintenance window if needed
- Backup database before migrations
- Apply migrations to production
- Monitor application logs
- Verify functionality
- Have rollback plan ready

### CMS Migration Considerations

**Adding CMS Tables:**
- Add all CMS tables in single migration for consistency
- Seed initial data (default settings, sample pages)
- Create necessary indexes immediately
- Set up default admin user with proper role

**Content Migration:**
- Migrate existing content to new CMS structure
- Convert static pages to ContentPage + ContentSection
- Bulk upload existing media to MediaFile table
- Set default SiteSettings values

**Section Type Changes:**
- Adding new SectionType: simple enum addition
- Changing section data structure: requires data migration
- Update all sections of specific type with new JSON structure
- Validate JSON structure after migration

### Safe Migration Strategies

**Adding Required Fields (Zero-Downtime Pattern):**

**Phase 1: Add Nullable Column**
- Add column as nullable with default value
- Deploy application code supporting both scenarios
- Old code continues working

**Phase 2: Populate Data**
- Run data migration script
- Populate new column from existing data
- Verify data completeness

**Phase 3: Make Required**
- Make column NOT NULL
- Deploy updated application code
- Remove fallback logic

**Removing Columns:**
- Deploy code that stops using column
- Wait for old deployments to drain
- Remove column in next migration
- Never remove in same deployment as code change

**Renaming Columns:**
- Create new column
- Copy data to new column
- Update code to use new column
- Deploy and verify
- Remove old column in next release

**Complex Schema Changes:**
- Use shadow databases for validation
- Test with production-like data volumes
- Measure migration duration
- Plan for large table locks

### Rollback Procedures

**Migration Rollback:**
- Identify migration to reverse
- Create new migration with reverse changes
- Never modify applied migrations
- Test rollback in staging first
- Document rollback procedures

**Data Rollback:**
- Restore from backup if data corrupted
- Use point-in-time recovery
- Verify data integrity after restore
- Test application functionality
- Document incident and lessons learned

## Performance Tuning

### PostgreSQL Configuration

**Memory Settings (for 4GB RAM server):**
- shared_buffers: 1GB (25% of RAM)
- effective_cache_size: 3GB (75% of RAM)
- maintenance_work_mem: 256MB
- work_mem: 5MB per query

**Connection Settings:**
- max_connections: 200 (with PgBouncer, can be lower)
- Connection pooling reduces need for high max_connections
- Monitor actual connection usage
- Adjust based on application needs

**Query Optimization Settings:**
- default_statistics_target: 100 (planner accuracy)
- random_page_cost: 1.1 (for SSD storage)
- effective_io_concurrency: 200 (for SSD)

### Query Performance Analysis

**Query Performance Tools:**
- EXPLAIN ANALYZE shows execution plan and timing
- Slow query logging for queries over 1 second
- pg_stat_statements tracks all executed queries
- Identifies most expensive queries

**Query Optimization Techniques:**
- Ensure WHERE clause uses indexes
- Verify JOIN conditions use indexes
- Check ORDER BY uses indexes
- SELECT only needed columns (not SELECT *)
- Use LIMIT for large result sets

**N+1 Query Prevention:**
- Use eager loading in ORM
- Batch queries together
- Use database JOINs instead of multiple queries
- Monitor query counts in application logs

**CMS-Specific Optimizations:**
- Load ContentPage with sections in single query
- Cache published pages and settings
- Paginate media library results
- Use SELECT for specific fields
- Implement query result caching

## Connection Pool Management

### PgBouncer Configuration

**Overall Grade: A+** - Connection pooling essential for production.

**Why PgBouncer:**
- Multiplexes client connections efficiently
- Reduces PostgreSQL process overhead
- Enables handling 1000+ concurrent users
- Transaction-level pooling for web apps
- Minimal resource usage

**Pool Sizing Strategy:**
- Default pool: 25 connections per database
- Reserve pool: 5 connections for emergencies
- Max client connections: 1000+
- Calculate based on: (CPU cores × 2) + disk spindles

**Pool Modes:**
- **Transaction**: Best for web applications (recommended)
- **Session**: For applications needing session state
- **Statement**: Most aggressive pooling (limited use cases)

### Application Configuration Best Practices

- Connect to PgBouncer port (typically 6432)
- Configure connection timeout
- Set statement timeout (prevent long-running queries)
- Handle connection errors gracefully
- Implement retry logic with exponential backoff
- Never leak connections
- Release connections promptly

## Data Integrity

### Constraints and Validation

**Overall Grade: A+** - Database constraints enforce data integrity.

**Primary Key Constraints:**
- Every table must have primary key
- Use UUIDs for distributed systems
- Never use auto-increment across databases
- Ensure uniqueness at database level

**Foreign Key Constraints:**
- Enforce referential integrity
- Configure cascade behavior appropriately
- ON DELETE CASCADE: Delete dependent records
- ON DELETE SET NULL: Nullify foreign key
- ON DELETE RESTRICT: Prevent deletion
- Always index foreign keys

**CMS Cascade Examples:**
- ContentSections deleted when page deleted (CASCADE)
- EventTags deleted when event deleted (CASCADE)
- Prevent User deletion if has ContentPages (RESTRICT)

**Unique Constraints:**
- Enforce uniqueness (email, slug, setting key)
- Composite unique constraints for combinations
- Creates index automatically
- Handle constraint violations gracefully

**Check Constraints:**
- Validate data ranges (price > 0, capacity > 0)
- Ensure date relationships (end_date > start_date)
- Enforce business rules at database level
- Keep simple (complex logic in application)

**CMS-Specific Constraints:**
- Slug must be unique and not null
- Position must be >= 0
- fileSize must be > 0
- Setting key must be unique
- Email must be unique

### Transaction Management

**Transaction Principles:**
- Use transactions for multi-step operations
- Keep transactions short (minimize locking)
- Read Committed isolation level (default)
- Serializable for critical operations (booking creation)
- Handle deadlocks with retry logic

**ACID Compliance:**
- Atomicity: All or nothing
- Consistency: Valid state transitions
- Isolation: Concurrent transaction safety
- Durability: Persisted after commit

**Transaction Best Practices:**
- ✅ Group related operations in single transaction
- ✅ Commit promptly after operations complete
- ✅ Handle rollback on errors
- ❌ Never hold transactions during user input
- ❌ Avoid long-running transactions

**CMS Transaction Examples:**
- Creating page with multiple sections: wrap in transaction
- Reordering sections: update multiple positions atomically
- Publishing page: update status and publishedAt together
- Deleting page: cascade to sections in single transaction

## Backup and Recovery

### Automated Backup Systems

**Overall Grade: A+** - Regular backups prevent catastrophic data loss.

**Backup Strategies:**

**Logical Backups:**
- Creates SQL dump of database
- Portable between PostgreSQL versions
- Restore to any database
- Slower for large databases
- Good for development/staging

**Physical Backups:**
- Copies entire data directory
- Faster backup and restore
- Same major version only
- Required for point-in-time recovery
- Best for production

**Continuous Archiving (WAL):**
- Captures all database changes
- Enables point-in-time recovery
- Restore to any moment in time
- Essential for production systems

**CMS Backup Considerations:**
- Include media files in backup strategy
- Backup uploads directory alongside database
- Consider separate media storage backup
- Test content restoration (pages, sections, media)
- Document media file restoration procedure

### Backup Schedule

**Frequency Requirements:**
- Full backups: Daily at 2 AM (low traffic)
- WAL archiving: Continuous
- Media files: Daily sync to backup storage
- Retention: 30 days for compliance
- Off-site copies: Replicate to separate region
- Test restores: Monthly

**Backup Verification:**
- Automate backup success checks
- Verify backup file integrity
- Test restore procedures quarterly
- Monitor backup storage space
- Alert on backup failures

### Point-in-Time Recovery

**Recovery Process:**
- Stop PostgreSQL if running
- Clear data directory
- Restore base backup
- Configure recovery settings
- Restore WAL files
- Start PostgreSQL (replays WAL)
- Verify data integrity

**Recovery Time Objective (RTO):**
- Target: 4 hours for full recovery
- Faster for smaller databases
- Test regularly to validate RTO
- Document recovery procedures
- Have recovery plan readily available

### Off-Site Storage

**Storage Requirements:**
- ✅ Geographic redundancy (different region)
- ✅ Encryption at rest and in transit
- ✅ Access controls and auditing
- ✅ Versioning for multiple restore points
- ✅ Cost-effective for long-term retention

**Storage Options:**
- Cloud storage services (S3, B2, GCS, Azure Blob)
- Self-hosted solutions (MinIO)
- Hybrid approaches

**Backup Encryption:**
- Encrypt before uploading
- Never upload unencrypted backups
- Secure key management
- Test decryption regularly
- Document encryption keys location

## Database Maintenance

### Regular Maintenance Tasks

**Overall Grade: A** - Regular maintenance prevents performance degradation.

**VACUUM:**
- Reclaims space from deleted rows
- Updates table statistics
- Prevents transaction ID wraparound
- Runs automatically (autovacuum)
- Manual VACUUM for large deletes

**ANALYZE:**
- Updates query planner statistics
- Improves query plan selection
- Run after bulk operations
- Schedule weekly minimum
- After index creation

**REINDEX:**
- Rebuilds fragmented indexes
- Improves query performance
- Schedule during low traffic
- Use concurrent mode in production
- After large data modifications

**Table Bloat Management:**
- Monitor with statistics views
- VACUUM FULL reclaims space (locks table)
- Online tools for bloat removal
- Regular VACUUM prevents bloat
- Schedule maintenance windows

**CMS-Specific Maintenance:**
- Monitor content_sections table size (rich content)
- VACUUM media_files after bulk deletions
- Rebuild indexes on slug fields after large imports
- Monitor JSON field sizes in ContentSection data
- Archive old ContentPages periodically

### Performance Monitoring

**Essential Monitoring:**
- Active connections
- Lock waits
- Table sizes and growth
- Index usage statistics
- Cache hit ratios

**Performance Metrics:**
- Query execution times (percentiles)
- Slow query counts
- Connection pool usage
- Database size growth
- Replication lag (if applicable)

**Alerting Thresholds:**
- Connections > 80% of max
- Slow queries > 1 second
- Table bloat > 30%
- Disk space < 15%
- Replication lag > 10 seconds

**CMS Metrics to Monitor:**
- ContentPage table size and growth rate
- MediaFile storage usage (database and filesystem)
- ContentSection JSON data size (alert if > 1MB)
- Published vs draft content ratio
- Media upload frequency and file sizes

## Security Best Practices

### Access Control

**Overall Grade: A+** - Principle of least privilege prevents breaches.

**User Permissions:**
- Create application user (not superuser)
- Grant only necessary permissions
- SELECT, INSERT, UPDATE, DELETE on tables
- USAGE on sequences
- Never grant DROP or ALTER in production

**Connection Security:**
- Require SSL connections
- Use strong passwords (32+ characters)
- Rotate credentials regularly
- Limit connections by IP
- Monitor failed connection attempts

**Row-Level Security:**
- Implement for multi-tenant applications
- Filter data by user context
- Create policies for operations
- Test policies thoroughly
- Document security model

**CMS-Specific Security:**
- Only ADMIN role can access CMS tables
- ORGANIZER can only modify own events
- Public API should only access PUBLISHED content
- Prevent unauthorized media file access
- Audit all admin actions

### SQL Injection Prevention

**Prisma Advantages:**
- Parameterized queries by default
- No string concatenation in queries
- Type-safe query building
- Prevents SQL injection automatically

**Additional Measures:**
- ✅ Never use raw SQL with user input
- ✅ Validate input types strictly
- ✅ Use ORM query builder
- ❌ Never concatenate user input in queries
- ❌ Don't trust client-side validation

**CMS Input Validation:**
- Validate slug format (alphanumeric and hyphens only)
- Sanitize rich text content (prevent XSS)
- Validate JSON structure in ContentSection data
- Validate file types and sizes for MediaFile
- Validate setting values based on SettingType

## CMS-Specific Database Patterns

### Content Versioning Strategy

**Simple Approach (Current Schema):**
- Track createdAt and updatedAt timestamps
- Single version per page (latest only)
- Use status field for draft/published workflow
- Archive old content with ARCHIVED status

**Advanced Versioning (Optional Enhancement):**
- Add version number field to ContentPage
- Create ContentPageVersion table for history
- Store complete page state on each publish
- Enable rollback to previous versions
- Track who made changes and when

### Media File Management

**File Storage Strategy:**
- Database stores metadata only
- Actual files stored in filesystem or cloud storage
- Generate unique filenames to prevent conflicts
- Organize by upload date or folders
- Create thumbnails automatically for images

**File Deletion:**
- Soft delete recommended (mark as deleted, clean up later)
- Check references before deleting
- Schedule cleanup job for orphaned files
- Keep database and filesystem in sync

**File Organization:**
- Use folder field for logical organization
- Default folder: "root"
- Suggested folders: events, pages, general, users
- Enable folder-based filtering in media library

### Dynamic Content Rendering

**Section Data JSON Structure:**

Each SectionType has specific JSON structure stored in data field:

**HERO Section:**
- Heading and subheading text
- Background image URL
- Call-to-action text and link
- Text alignment preference

**TEXT Section:**
- Rich text HTML content
- Alignment setting

**IMAGE Section:**
- Image URL
- Caption and alt text
- Alignment and width settings

**VIDEO Section:**
- Video URL (YouTube, Vimeo, direct)
- Thumbnail image
- Caption text

**GALLERY Section:**
- Array of images with captions
- Column layout setting
- Spacing preference

**CONTACT_FORM Section:**
- Field configuration array
- Submit button text
- Recipient email
- Success message

**EVENT_LIST Section:**
- Number of events to display
- Category filter
- Sort order
- Display style (grid/list)

### Site Settings Common Keys

**GENERAL Group:**
- Site name and description
- Contact and support emails
- Maintenance mode flag

**CONTACT Group:**
- Physical address
- Phone number
- Business hours

**SOCIAL_MEDIA Group:**
- Facebook, Twitter, Instagram, LinkedIn URLs
- Social media handles

**SEO Group:**
- Default meta description
- Default Open Graph image
- Analytics tracking ID

**APPEARANCE Group:**
- Primary and secondary colors
- Logo and favicon URLs
- Custom CSS

## Seed Data Strategy

### Initial Database Seeding

**Required Seed Data:**

**Default Admin User:**
- Email and hashed password
- Full name
- Role set to ADMIN
- Email verified status true

**Default Site Settings:**
- Site name and description
- Contact email
- Primary brand color
- Other essential settings

**Sample Content Pages:**
- Home page with hero section
- About page
- Contact page
- Terms and privacy pages (if required)

### Development vs Production Seeds

**Development Seeds:**
- Include sample events, venues, bookings
- Create test users with different roles
- Add sample content pages with various section types
- Upload sample media files
- More data for testing

**Production Seeds:**
- Only essential data (admin user, settings)
- Default content pages (terms, privacy)
- Minimal sample data
- Real configuration values

## Performance Benchmarks

### Expected Query Performance

**Event Management Queries:**
- Event listing (20 items, filtered): < 50ms
- Event detail with venue: < 30ms
- Create booking (with capacity check): < 100ms
- User bookings list: < 40ms

**CMS Queries:**
- Content page with sections: < 50ms
- Media library list (50 items): < 60ms
- Settings by group: < 20ms
- Section reordering: < 30ms

**Complex Queries:**
- Full-text search across events: < 100ms
- Event analytics/statistics: < 200ms
- Media usage tracking: < 150ms

## Database Optimization Strategies

### Read Performance Optimization

**Caching Strategy:**
- Cache published content pages (Redis)
- Cache site settings (rarely change)
- Cache event listings (with short TTL)
- Invalidate cache on content updates
- Use cache-aside pattern

**Query Optimization:**
- Use indexes for all queries
- Minimize JOIN operations where possible
- Use LIMIT for pagination
- Implement cursor-based pagination for large datasets
- Avoid SELECT * (query only needed columns)

**CMS-Specific Optimizations:**
- Cache published pages aggressively
- Preload sections with page in single query
- Index slug fields for fast lookups
- Use partial indexes for published content
- Materialize common aggregations

### Write Performance Optimization

**Batch Operations:**
- Batch multiple inserts together
- Use transactions for related operations
- Minimize index updates
- Schedule heavy operations during low traffic

**CMS Write Patterns:**
- Batch section creation when creating pages
- Update section positions in single transaction
- Defer thumbnail generation to background job
- Process large media uploads asynchronously

### Database Scaling Strategies

**Vertical Scaling:**
- Increase server resources (CPU, RAM, disk)
- Improve disk I/O (SSD, NVMe)
- Optimize PostgreSQL configuration
- Add more connection pool resources

**Horizontal Scaling Options:**
- Read replicas for read-heavy workloads
- Separate analytics queries to replica
- Load balance reads across replicas
- Master for writes, replicas for reads

**Partitioning Strategy:**
- Partition events table by date range (year or month)
- Partition bookings by booking date
- Partition media files by upload date
- Improves query performance on large tables
- Simplifies data archival

## Data Archival and Retention

### Archival Strategy

**Event Data Archival:**
- Archive COMPLETED events older than 2 years
- Move to separate archive schema or table
- Maintain referential integrity
- Keep booking records for accounting

**Content Archival:**
- Use ARCHIVED status for old pages
- Don't delete (preserve for compliance)
- Remove from public queries
- Keep for historical reference

**Media File Archival:**
- Move unused files to cold storage
- Check references before archiving
- Maintain metadata in database
- Document archival process

**Booking Records:**
- Never delete (financial/legal compliance)
- Archive to separate storage after 7 years
- Maintain audit trail
- Comply with data retention laws

### Data Retention Policies

**Legal Requirements:**
- Financial records: 7-10 years
- User data: varies by jurisdiction
- Booking records: minimum 7 years
- Audit logs: 1-5 years

**Practical Retention:**
- Active events: indefinitely
- Past events: 2 years online, archive after
- User accounts: active + 3 years inactive
- Media files: check usage, then archive
- Logs: 90 days operational, 1 year compliance

## Database Documentation Standards

### Schema Documentation

**Table Documentation:**
- Purpose and business context
- Key relationships
- Important business rules
- Index strategy reasoning
- Performance considerations

**Field Documentation:**
- Field purpose and usage
- Valid values and constraints
- Format requirements
- Default values explanation
- Relationship to other fields

**Migration Documentation:**
- Reason for schema change
- Impact on existing data
- Rollback procedure
- Performance implications
- Testing requirements

### Query Documentation

**Complex Query Documentation:**
- Purpose and business logic
- Expected performance
- Index dependencies
- Known limitations
- Optimization history

**Stored Procedure Documentation:**
- Input parameters and validation
- Output format
- Business logic flow
- Error handling
- Usage examples

## Database Testing Strategy

### Test Database Management

**Test Database Setup:**
- Separate database per test suite
- Use same PostgreSQL version as production
- Apply all migrations before tests
- Seed with minimal required data
- Clean up after test completion

**Test Data Strategy:**
- Use factories for test data generation
- Create realistic data patterns
- Test with various data volumes
- Include edge cases
- Document test data requirements

**CMS Testing Considerations:**
- Test all section types
- Test section reordering
- Test media upload and deletion
- Test slug uniqueness constraints
- Test published vs draft filtering

### Integration Testing

**Database Integration Tests:**
- Test with real database (not mocks)
- Test transaction behavior
- Test constraint violations
- Test cascade operations
- Test concurrent access scenarios

**CMS Integration Tests:**
- Create page with multiple sections
- Publish and unpublish pages
- Reorder sections
- Delete page with sections (cascade)
- Upload and reference media files

## Disaster Recovery Planning

### Recovery Procedures

**Database Corruption:**
- Identify corruption extent
- Stop write operations
- Restore from last clean backup
- Apply WAL logs for point-in-time recovery
- Verify data integrity
- Resume operations

**Data Loss Prevention:**
- Regular automated backups
- Multiple backup copies
- Off-site backup storage
- Test restore procedures
- Monitor backup success

**Recovery Time Objectives:**
- Critical data (bookings): 1 hour RTO
- User data: 4 hours RTO
- Content data: 8 hours RTO
- Media files: 24 hours RTO
- Analytics data: 48 hours RTO

### Incident Response

**Incident Detection:**
- Automated monitoring alerts
- User-reported issues
- Performance degradation
- Data inconsistencies
- Failed backups

**Response Procedures:**
- Assess impact and severity
- Notify stakeholders
- Implement temporary fixes
- Restore from backup if needed
- Document incident and resolution
- Conduct post-mortem

## Compliance and Auditing

### Data Privacy Compliance

**GDPR Compliance:**
- User data minimization
- Right to access (data export)
- Right to erasure (account deletion)
- Data portability
- Consent management
- Audit trail for data access

**Data Subject Rights Implementation:**
- Export user data on request
- Delete user account and data
- Anonymize booking records
- Remove personal information
- Maintain audit logs

**CMS Privacy Considerations:**
- Author information in pages
- Uploader tracking in media files
- User activity logging
- Personal data in content
- Cookie consent for analytics

### Audit Logging

**What to Audit:**
- User account changes (role changes)
- Content page modifications
- Media file uploads/deletions
- Site settings changes
- Admin actions
- Failed login attempts

**Audit Log Requirements:**
- Who (user ID)
- What (action performed)
- When (timestamp)
- Where (IP address)
- Result (success/failure)
- Before/after values (for changes)

**Audit Retention:**
- Security events: 1 year minimum
- Compliance events: 7 years
- Administrative actions: 2 years
- Access logs: 90 days

## Database Monitoring and Alerting

### Key Metrics to Monitor

**Performance Metrics:**
- Query execution time (p50, p95, p99)
- Transactions per second
- Connection pool usage
- Cache hit ratio
- Disk I/O wait times

**Capacity Metrics:**
- Database size and growth rate
- Table and index sizes
- Disk space usage
- Connection count
- Memory usage

**Health Metrics:**
- Replication lag (if applicable)
- Failed queries count
- Lock wait times
- Deadlock frequency
- Autovacuum activity

**CMS-Specific Metrics:**
- Content page count by status
- Media file storage usage
- Average sections per page
- Content update frequency
- Media upload rate

### Alerting Configuration

**Critical Alerts (Immediate Response):**
- Database unreachable
- Disk space < 10%
- Replication stopped
- Connection pool exhausted
- Data corruption detected

**Warning Alerts (1-Hour Response):**
- Disk space < 20%
- Connections > 80% of max
- Slow query count increasing
- Cache hit ratio < 80%
- Unusual data growth

**Informational Alerts (Review Daily):**
- Backup completion status
- Performance trend changes
- New slow queries
- Index usage statistics
- Table bloat levels

## Database Best Practices Summary

### Design Principles

**Overall Grade: A+** - Following these principles ensures maintainable database.

**Schema Design:**
- ✅ Use descriptive and consistent naming
- ✅ Normalize appropriately (balance with performance)
- ✅ Define relationships explicitly
- ✅ Use appropriate data types
- ✅ Document business rules
- ❌ Don't over-normalize
- ❌ Avoid premature optimization

**Performance:**
- ✅ Index strategically based on query patterns
- ✅ Monitor and optimize slow queries
- ✅ Use connection pooling
- ✅ Implement caching where appropriate
- ✅ Regular maintenance (VACUUM, ANALYZE)
- ❌ Don't index every column
- ❌ Avoid long-running transactions

**Security:**
- ✅ Use least privilege access
- ✅ Encrypt sensitive data
- ✅ Require SSL connections
- ✅ Regular security audits
- ✅ Implement row-level security if needed
- ❌ Never store plain text passwords
- ❌ Don't expose database directly

**Reliability:**
- ✅ Automated daily backups
- ✅ Test restore procedures regularly
- ✅ Point-in-time recovery capability
- ✅ Off-site backup storage
- ✅ Documented recovery procedures
- ❌ Don't skip backup testing
- ❌ Avoid single point of failure

**Maintainability:**
- ✅ Document schema and changes
- ✅ Use migration files for all changes
- ✅ Version control for schema
- ✅ Clear naming conventions
- ✅ Regular maintenance schedule
- ❌ Never modify production directly
- ❌ Don't skip migration documentation

## CMS Database Best Practices

### Content Management Specifics

**Page Management:**
- Use slug for URLs (SEO-friendly)
- Implement draft/published workflow
- Version content for rollback capability
- Cache published pages aggressively
- Index status and slug fields

**Section Management:**
- Flexible JSON data structure
- Position-based ordering
- Validate JSON structure per type
- Enable section reordering
- Support visibility toggle

**Media Management:**
- Store metadata in database
- Keep files in separate storage
- Generate thumbnails automatically
- Organize with folder structure
- Implement soft delete

**Settings Management:**
- Key-value pair approach
- Type-specific validation
- Group related settings
- Public/private flag for API access
- Cache settings in memory

### CMS Performance Optimization

**Query Optimization:**
- Load page with sections in single query
- Use partial indexes for published content
- Cache published pages and settings
- Paginate media library results
- Use SELECT for specific fields only

**Write Optimization:**
- Batch section operations
- Use transactions for page updates
- Defer thumbnail generation
- Process large uploads asynchronously
- Update positions atomically

**Caching Strategy:**
- Cache published pages (long TTL)
- Cache site settings (invalidate on update)
- Cache media library listings (short TTL)
- Use cache-aside pattern
- Implement cache warming for popular pages

## Recommended Database Grade: A+

**Strengths:**
- ✅ PostgreSQL 16 with advanced features
- ✅ Prisma ORM for type-safe queries
- ✅ Comprehensive schema covering events and CMS
- ✅ Proper indexing strategy for both domains
- ✅ Connection pooling with PgBouncer
- ✅ Automated backup systems
- ✅ Safe migration patterns
- ✅ Comprehensive monitoring
- ✅ Strong security practices
- ✅ Clear documentation standards
- ✅ Flexible CMS architecture
- ✅ Scalable design for growth

**Critical Requirements:**
- Implement automated backups immediately
- Test restore procedures regularly
- Monitor query performance continuously
- Use connection pooling in production
- Apply security best practices
- Maintain regular database maintenance schedule
- Document all schema changes
- Follow migration patterns strictly
- Cache CMS content appropriately
- Validate all user input at database level

**CMS-Specific Requirements:**
- Index all slug fields for fast lookups
- Implement proper cascade deletes for sections
- Cache published content aggressively
- Validate JSON structure in sections
- Monitor media file storage growth
- Document section type data structures
- Test content publishing workflow
- Implement soft delete for media files
- Backup media files separately
- Monitor CMS query performance

## Next Steps

### Initial Setup Checklist

- [ ] Set up PostgreSQL 16 database
- [ ] Configure PgBouncer connection pooling
- [ ] Install and configure Prisma
- [ ] Create initial schema with migrations
- [ ] Set up automated backup system
- [ ] Configure monitoring and alerting
- [ ] Create seed data for development
- [ ] Test backup and restore procedures
- [ ] Document recovery procedures
- [ ] Configure security settings

### CMS Setup Checklist

- [ ] Add CMS tables to schema
- [ ] Create default admin user
- [ ] Seed default site settings
- [ ] Set up media upload directory
- [ ] Configure media processing
- [ ] Create sample content pages
- [ ] Test section types
- [ ] Configure cache for published content
- [ ] Set up media file cleanup job
- [ ] Document CMS data structures

### Production Readiness

- [ ] Performance testing completed
- [ ] Security audit passed
- [ ] Backup system verified
- [ ] Monitoring configured
- [ ] Alerts tested
- [ ] Documentation complete
- [ ] Recovery procedures tested
- [ ] Compliance requirements met
- [ ] Team training completed
- [ ] Support procedures documented
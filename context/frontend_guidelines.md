# Frontend Guidelines

This file provides guidance when working with the BOH Platform frontend applications. Follow these standards to ensure production-ready implementation with optimal performance and maintainability.

## Important: React 19 Optimization Rules

**MANDATORY**: When building components, trust the React Compiler for optimization. Do NOT manually wrap components in React.memo, useMemo, or useCallback unless profiling shows specific performance issues. The compiler handles this automatically.

## Technology Stack Overview

**BOH Platform Frontends** consist of two production-ready web applications built with React 19, Vite, and Zustand state management. The applications emphasize performance, type safety, and modern development practices.

### Public Frontend (boh-frontend)
- Event discovery and booking for end users
- Performance and SEO optimization
- Mobile-first responsive design  
- Dynamic content rendering from CMS
- Optimized for high-traffic scenarios

### Admin Frontend (boh-admin)
- Content management system (CMS)
- Rich text editing and media management
- Event and user administration
- Dashboard and analytics
- Productivity-focused workflows

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with instant HMR
- `npm run build` - Create optimized production build
- `npm run preview` - Test production build locally
- `npm run lint` - Run ESLint static analysis
- `npx tsc --noEmit` - Type check without building

### Build Analysis
- `npm run build -- --analyze` - Generate bundle size report
- Review bundle sizes after adding dependencies
- Keep initial bundle under 200KB gzipped

### Development Workflow
- Hot reload applies changes in under 50ms
- TypeScript compilation happens automatically
- No build_runner needed (unlike Flutter)
- Vite handles all bundling and transformation

## Architecture & Structure

### Project Organization - Public Frontend (boh-frontend)

**Directory Structure:**
- `components/` - Reusable UI components
  - `common/` - Shared components (Button, Card, Modal)
  - `event/` - Event-specific components
  - `booking/` - Booking flow components
  - `layout/` - Layout components (Header, Footer, Nav)
  - `content/` - CMS content rendering components
- `pages/` - Route components
  - `Home/` - Dynamic home page from CMS
  - `EventList/` - Event listing with filters
  - `EventDetail/` - Single event view
  - `Checkout/` - Booking checkout flow
  - `Dashboard/` - User dashboard
  - `[slug]/` - Dynamic CMS pages
- `stores/` - Zustand state stores
  - Event data and filters
  - Booking cart and state
  - User authentication state
  - CMS content cache
- `hooks/` - Custom React hooks
  - Event data management
  - Booking operations
  - Authentication
  - CMS content fetching
- `utils/` - Utility functions
  - API client configuration
  - Form validation helpers
  - Date formatting utilities
- `types/` - TypeScript type definitions
  - Event types
  - Booking types
  - Content types (CMS)
  - API types
- `assets/` - Static assets (images, icons)

### Project Organization - Admin Frontend (boh-admin)

**Directory Structure:**
- `components/` - Admin UI components
  - `ui/` - shadcn/ui primitives
  - `common/` - Shared admin components
  - `content/` - Content management components
    - ContentEditor - Page content editor
    - SectionBuilder - Dynamic section builder
    - RichTextEditor - TipTap/Lexical wrapper
    - LivePreview - Content preview pane
  - `media/` - Media library components
    - MediaBrowser - Media selection interface
    - MediaUploader - Drag-drop upload
    - ImageEditor - Crop, resize, filters
    - MediaGrid - Grid view with lazy loading
  - `events/` - Event management components
    - EventForm, EventList, EventPreview
  - `forms/` - Form components
    - FormBuilder, DynamicForm, ValidationDisplay
  - `layout/` - Admin layout components
    - AdminHeader, Sidebar, Breadcrumbs
- `pages/` - Admin page components
  - `Dashboard/` - Admin dashboard & analytics
  - `ContentPages/` - Page management (list, create, edit)
  - `MediaLibrary/` - Media management interface
  - `Events/` - Event CRUD operations
  - `Users/` - User management
  - `Settings/` - Site settings configuration
  - `Login/` - Admin authentication
- `stores/` - Zustand stores
  - Admin authentication
  - Content editing state
  - Media library state
  - Site settings
  - UI state (sidebar, modals)
- `hooks/` - Custom hooks
  - Authentication management
  - Content operations
  - Media operations
  - Settings management
  - Debounce utilities
  - Drag-drop handlers
- `lib/` - Utilities and services
  - `api/` - API client and endpoint modules
    - Content API, Media API, Events API, Users API
  - `utils/` - Helper functions
    - Validation, Formatting, Content helpers
- `types/` - TypeScript definitions
  - Content types, Media types, Settings types
  - Event types, User types
- `styles/` - Global styles (Tailwind imports)

### Key Architecture Decisions

**1. Two Separate Frontend Applications:**
- Public frontend optimized for end users (performance, SEO)
- Admin frontend optimized for content editors (productivity, features)
- Shared API backend serving both applications
- Independent deployment cycles
- Different optimization strategies per audience

**2. State Management Strategy:**
- Zustand for client state (lightweight, minimal boilerplate)
- TanStack Query for server state (caching, refetching)
- Context API for theme/auth propagation only
- No Redux needed (Zustand sufficient for complexity)

**3. Component Library:**
- shadcn/ui for UI primitives (especially admin)
- Tailwind CSS for styling
- Lucide React for icons
- Composable, accessible components

**4. CMS Content Rendering (Public Frontend):**
- Server-fetched content via API
- Client-side rendering with hydration
- Dynamic routing for CMS pages using slug parameter
- Content caching for performance
- Section-based page composition

**5. Rich Content Editing (Admin Frontend):**
- TipTap or Lexical for rich text (modern, extensible)
- Block-based section builder (drag-drop)
- Live preview pane for changes
- Auto-save with debouncing

**6. Media Management:**
- Centralized media library
- Drag-drop upload with validation
- Automatic thumbnail generation (backend)
- Image selection modal for editors
- Organization with folders/categories

**7. Role-Based UI:**
- Admin routes protected by ADMIN role
- Conditional rendering based on permissions
- Organizer-specific event management
- User-specific profile/bookings
- Navigation filtered by role

**8. Authentication Flow:**
- JWT access tokens (memory storage)
- Refresh tokens (httpOnly cookies)
- Role claim in access token
- Protected routes with guards
- Separate admin authentication

**Component Architecture:**
- **Presentation**: Pure components with no business logic
- **Container**: Connected to stores, handle data fetching
- **Layout**: Page structure, navigation, global UI
- **Utility**: Context providers, error boundaries, wrappers

**File Organization:**
- One component per file
- Colocate tests with components
- Place shared components in common directory
- Organize by feature for larger apps

**Component Sizing:**
- Keep components under 200 lines
- Extract complex logic to custom hooks
- Split large components into smaller pieces
- Single Responsibility Principle

### TypeScript Standards

**Type Safety Requirements:**
- ✅ Enable strict mode in tsconfig.json
- ✅ Define interfaces for all props
- ✅ Type all function parameters and returns
- ✅ Use discriminated unions for variants
- ❌ Avoid `any` type except when absolutely necessary

**Type Organization:**
- Colocate types with components when specific
- Share common types in types directory
- Export types for external consumption
- Use type inference where obvious

### Naming Conventions

**Files:**
- Components: PascalCase (EventCard.tsx)
- Hooks: camelCase (useEventData.ts)
- Utilities: camelCase (formatDate.ts)
- Types: camelCase (event.types.ts)

**Code:**
- Components: PascalCase
- Hooks: camelCase with "use" prefix
- Constants: UPPER_SNAKE_CASE
- Variables/functions: camelCase

## CMS-Specific Frontend Features

### Content Management Interface (Admin Frontend)

**Overall Grade: A** - Modern CMS interface with productivity-focused features.

#### Rich Text Editor Requirements

**Recommended Editor: TipTap (based on ProseMirror)**

**Selection Criteria:**
- Modern, extensible architecture
- Excellent TypeScript support
- Framework-agnostic core
- Built-in collaboration features
- Extensive plugin ecosystem
- Headless (full styling control)
- Active maintenance and community

**Alternative: Lexical (by Meta)**
- Modern React-first editor
- Excellent performance
- Strong TypeScript support
- Plugin architecture

**Required Editor Features:**
- Basic formatting (bold, italic, underline, strikethrough)
- Headings (H1-H6)
- Lists (ordered, unordered, checklists)
- Links with URL validation
- Images from media library integration
- Code blocks with syntax highlighting
- Tables with merge cells
- Blockquotes
- Horizontal rules
- Undo/Redo functionality
- Keyboard shortcuts (Ctrl/Cmd+B, etc.)
- Paste from Word/Google Docs support
- Markdown shortcuts support

**Editor Security Considerations:**
- Sanitize HTML output before saving to database
- Validate image URLs from media library
- Strip dangerous tags (script, iframe unless explicitly allowed)
- Use DOMPurify library for sanitization
- Configure allowed HTML tags server-side
- Never execute user-provided JavaScript
- Validate all links for XSS prevention

**Editor Performance Optimization:**
- Debounce auto-save operations (500ms-1000ms)
- Use controlled component pattern sparingly
- Lazy load heavy editor extensions
- Virtual scrolling for long documents
- Optimize re-renders with proper memoization

**Editor Accessibility:**
- Full keyboard navigation support
- Screen reader compatible
- ARIA labels for toolbar buttons
- Focus management
- Skip links for long content

#### Content Section Builder

**Overall Grade: A** - Flexible block-based content building system.

**Supported Section Types:**
- **HERO** - Hero section with image/video background, overlay text, CTA
- **TEXT** - Rich text content block with alignment options
- **IMAGE** - Single image with caption and alt text
- **VIDEO** - Embedded video (YouTube, Vimeo, self-hosted)
- **GALLERY** - Image gallery with multiple layout options (grid, carousel, masonry)
- **CONTACT_FORM** - Contact form block with customizable fields
- **EVENT_LIST** - Dynamic event listing with filtering
- **CTA** - Call-to-action block with button
- **TESTIMONIALS** - Customer testimonials carousel
- **FAQ** - Accordion-style FAQ section
- **STATS** - Statistics/metrics display
- **TEAM** - Team member grid
- **FEATURES** - Feature highlights grid

**Section Builder Interface Requirements:**
- Drag-and-drop section reordering using accessible library (dnd-kit)
- "Add Section" button with type selector modal
- Inline editing for each section type
- Section visibility toggle (show/hide without deleting)
- Duplicate section functionality
- Delete section with confirmation dialog
- Section collapse/expand for better overview
- Keyboard navigation support

**Section Data Structure Principles:**
- Each section has consistent base properties (id, pageId, type, position, visible)
- Section-specific data stored in flexible JSON field
- Data structure validates against defined schemas
- Support for media references (URLs from media library)
- Support for nested structures where appropriate
- Version tracking for content history

**Section Configuration Options:**
- Custom CSS classes for styling variations
- Spacing controls (padding, margin)
- Background options (color, image, video)
- Width constraints (full-width, contained, narrow)
- Animation options (fade-in, slide-in)
- Conditional visibility (show only on certain pages)

#### Live Preview Feature

**Overall Grade: A** - Real-time preview enhances editing experience.

**Implementation Approaches:**

**Option 1: Split-Pane Editor (Recommended for Desktop):**
- Left pane: Content editor with section builder
- Right pane: Live preview with public frontend styles
- Synchronized scrolling (optional, can be disruptive)
- Adjustable pane sizes
- Desktop-optimized layout

**Option 2: Toggle Preview Mode (Better for Mobile):**
- Switch between edit mode and preview mode
- Mobile-friendly approach
- Saves screen space
- Cleaner interface
- Full-screen preview

**Preview Requirements:**
- Real-time updates without manual refresh
- Renders content with actual public frontend styles
- Responsive preview mode toggle (mobile/tablet/desktop views)
- Shows section visibility settings correctly
- Includes navigation/header/footer context
- Handles dynamic content (event lists, etc.)
- Shows placeholder for unpublished content

**Preview Performance:**
- Debounce preview updates during rapid changes
- Optimize rendering for large content
- Use virtual scrolling for long pages
- Cache preview styles

**Preview Accuracy:**
- Use actual frontend React components where possible
- Match exact CSS framework (Tailwind) configuration
- Include all fonts and assets
- Respect breakpoints and media queries
- Show actual data when possible (or realistic placeholders)

#### Media Library Interface

**Overall Grade: A+** - Centralized media management with efficient workflows.

**Core Features:**

**1. Media Browser/Grid:**
- Grid view with responsive columns (2-6 columns based on screen size)
- Thumbnail previews with lazy loading
- Infinite scroll or pagination (configurable)
- Multi-select capability with checkboxes
- Folder/category organization
- File type icons for non-image files
- File size and dimensions overlay on hover
- Quick actions menu (download, delete, edit)

**2. Upload Interface:**
- Drag-and-drop upload area (primary method)
- Click-to-browse file selector (fallback)
- Multiple file selection support
- Upload progress indicators per file
- Client-side validation before upload (type, size)
- Batch upload support (up to 20 files)
- Retry failed uploads
- Cancel in-progress uploads

**3. Media Details Panel:**
- Large preview for images
- Metadata display for videos (duration, format)
- File information (name, size, dimensions, format, upload date)
- Alt text editor with character counter (for accessibility)
- Title/caption editor
- URL copy button with "Copied!" feedback
- Usage information (list of pages/events using this media)
- Delete button with usage warning if in use
- Replace file functionality
- Download original file

**4. Search and Filters:**
- Search by filename or alt text
- Filter by type (image/video/document)
- Filter by upload date range
- Filter by uploader (admin feature)
- Sort options (date uploaded, name, size, usage count)
- Folder/category navigation
- Recently uploaded quick filter
- Unused media filter

**5. Folder/Organization System:**
- Create nested folder structure
- Move media between folders
- Rename folders
- Delete folders (with content handling options)
- Breadcrumb navigation
- Folder color coding or icons

**Upload Validation Rules:**

**Images:**
- Maximum file size: 10MB
- Allowed formats: JPEG, PNG, WebP, GIF
- Minimum dimensions: 100x100px (configurable)
- Maximum dimensions: 10000x10000px
- Automatic orientation correction based on EXIF data

**Videos:**
- Maximum file size: 100MB
- Allowed formats: MP4, WebM, MOV
- Recommended codecs: H.264, VP9
- Maximum duration: 10 minutes (configurable)

**Documents:**
- Maximum file size: 5MB
- Allowed formats: PDF
- Scan for malicious content

**General Upload Rules:**
- Reject files with no extension
- Sanitize filenames (remove special characters)
- Check for duplicate files (hash comparison)
- Virus/malware scanning (if available)
- Respect total storage quota per user/organization

**Media Selection Modal:**
- Appears when inserting media into content
- Compact view of media library
- Quick upload without leaving modal
- Filter by recently uploaded
- Filter by media type automatically based on context
- Single or multiple selection mode
- Insert button with selected media count
- Cancel button returns to editor

**Performance Considerations:**
- Lazy load thumbnails as user scrolls
- Progressive image loading (blur-up technique)
- Request appropriately sized thumbnails from backend
- Cache media grid results
- Optimize grid rendering for large libraries (virtualization)

#### Auto-Save Functionality

**Overall Grade: A** - Prevents data loss and improves user experience.

**Auto-Save Strategy:**
- Debounce save operations (1000ms recommended)
- Save on significant events (section added, deleted, reordered)
- Save on editor blur (user clicks away)
- Don't save on every keystroke (too aggressive)
- Clear save indicator shows current state

**Save Indicators:**
- "Saving..." indicator during save operation
- "Saved" indicator with timestamp on success
- "Unsaved changes" warning when changes pending
- Error indicator with retry option on failure
- Network status indicator (offline warning)

**Error Handling:**
- Automatic retry on save failure (3 attempts)
- Exponential backoff between retries
- Store failed save in localStorage as backup
- Show prominent error message after retry exhaustion
- Offer manual save button as fallback
- Log errors for debugging

**Browser Navigation Protection:**
- Warn user before leaving page with unsaved changes
- Use beforeunload event to show browser warning
- Only show warning when isDirty flag is true
- Disable warning after successful save
- Handle page refresh attempts

**Conflict Resolution:**
- Detect if content was modified by another user
- Show conflict resolution dialog
- Allow viewing both versions
- Let user choose which version to keep
- Prevent overwriting without acknowledgment

**Offline Support:**
- Queue saves when offline
- Show offline indicator clearly
- Sync queued saves when connection restored
- Store draft in localStorage continuously
- Offer "Continue editing offline" mode

**Version History (Optional but Recommended):**
- Save snapshots at regular intervals
- Allow restoring previous versions
- Show diff between versions
- Limit history retention (e.g., last 50 versions)
- Clean up old versions automatically

### Dynamic Content Rendering (Public Frontend)

**Overall Grade: A** - CMS content integrated seamlessly into public site.

#### Dynamic Page Routing

**Routing Strategy:**
- Use catch-all route pattern for dynamic CMS pages
- Route slug parameter maps to page.slug in database
- Static routes (events, bookings) take precedence
- Handle 404 for non-existent slugs gracefully
- SEO-friendly URLs without query parameters

**Page Loading Flow:**
1. Extract slug from URL parameters
2. Fetch page data from API by slug
3. Handle loading state with skeleton
4. Handle 404 if page not found or unpublished
5. Render page with content sections
6. Set page title and meta tags

**URL Structure:**
- Homepage: `/`
- Static pages: `/events`, `/events/:id`, `/profile`
- Dynamic CMS pages: `/:slug` (e.g., `/about-us`, `/contact`)
- Nested pages: `/:parentSlug/:childSlug` (optional)

**SEO Considerations:**
- Set appropriate meta title from page.title
- Set meta description from page.metaDescription
- Generate OpenGraph tags for social sharing
- Set canonical URL
- Include structured data where appropriate
- Ensure proper heading hierarchy (H1 only once)

#### Content Section Rendering

**Rendering Principles:**
- Render only visible sections (section.visible === true)
- Respect section position ordering (sort by position)
- Apply appropriate styling and spacing between sections
- Handle missing/null data gracefully with fallbacks
- Optimize images (lazy loading, responsive srcset)
- Sanitize HTML content from rich text editor
- Never execute user-provided JavaScript

**Section Component Pattern:**
- Each section type has dedicated component
- Components receive section data as props
- Components handle their own styling
- Components are self-contained and reusable
- Components handle loading and error states
- Unknown section types are skipped (with console warning)

**Responsive Section Rendering:**
- All sections must be mobile-responsive
- Use mobile-first CSS approach
- Test sections at all breakpoints
- Images must have responsive srcset
- Videos must scale properly
- Text must be readable at all sizes
- Touch targets minimum 44x44px

**Section Styling Consistency:**
- Use consistent spacing system
- Apply theme colors from design system
- Maintain typography scale
- Ensure proper contrast ratios
- Follow brand guidelines

**Performance Optimization:**
- Lazy load images below the fold
- Defer loading of video embeds
- Minimize layout shifts (CLS optimization)
- Preload critical resources
- Optimize LCP elements

#### Content Caching Strategy

**Cache Configuration with TanStack Query:**
- Static content: Long cache duration (5-10 minutes)
- Dynamic content: Short cache or no cache
- Invalidate cache after admin updates (webhook or polling)
- Prefetch common pages (home, about) on app load
- Background refetch for stale data

**Cache Keys:**
- Page content: `['page', slug]`
- Section data: `['sections', pageId]`
- Media files: `['media', mediaId]`
- Global settings: `['settings', group]`

**Stale-While-Revalidate Pattern:**
- Show cached content immediately (if available)
- Fetch fresh data in background
- Update UI when fresh data arrives
- Handle errors gracefully (keep showing stale data)

**Cache Invalidation:**
- Invalidate on admin publish action
- Time-based invalidation (TTL)
- Manual refresh option for users
- Invalidate related content (cascade)

## Admin-Specific UI Patterns

### Dashboard Design

**Overall Grade: A** - Clean, informative dashboard with actionable insights.

**Key Metrics to Display:**
- Total events (breakdown: published/draft/cancelled)
- Recent bookings count and trend
- Active users count and growth
- Popular events (ranked by bookings)
- Revenue statistics (if payments implemented)
- Recent activity log (last 10 actions)
- Storage usage (media library)
- System health indicators

**Dashboard Layout Principles:**
- Most important metrics at top
- Use cards/panels for metric grouping
- Show trends with small charts or percentages
- Use color coding (green for positive, red for negative)
- Responsive grid layout (4 columns on desktop, 2 on tablet, 1 on mobile)
- Quick actions prominently displayed
- Recent activity in chronological order

**Charts and Visualizations:**
- Bookings over time (line chart)
- Event categories distribution (pie/donut chart)
- Revenue trends (bar chart)
- User growth (area chart)
- Use consistent color scheme
- Include legends and labels
- Make charts responsive
- Provide data tables as alternative

**Quick Actions:**
- Create new event
- Create new page
- Upload media
- View latest bookings
- Manage users
- One-click access to common tasks

### Role-Based UI Rendering

**Overall Grade: A+** - Proper authorization prevents unauthorized access.

**Permission System:**
- ADMIN role: Full access to all features
- ORGANIZER role: Manage own events, limited CMS access
- USER role: No admin access (public frontend only)

**UI Permissions:**
- `canManageContent`: ADMIN only (pages, sections, settings)
- `canManageOwnEvents`: ORGANIZER and ADMIN
- `canManageAllEvents`: ADMIN only
- `canManageUsers`: ADMIN only
- `canManageSettings`: ADMIN only
- `canAccessMediaLibrary`: ADMIN and ORGANIZER
- `canDeleteMedia`: ADMIN only

**Navigation Filtering:**
- Show/hide menu items based on permissions
- Disable actions user doesn't have permission for
- Hide UI elements completely (not just disable)
- Provide helpful messages for restricted features
- Log permission denials for security auditing

**Protected Actions:**
- Wrap destructive actions (delete, publish) with permission checks
- Show "Insufficient permissions" message when appropriate
- Never expose admin API endpoints to non-admin roles
- Validate permissions on backend (never trust frontend)

**Graceful Permission Denials:**
- Friendly error messages
- Suggest contacting administrator
- Log attempted unauthorized access
- Don't expose system internals in error messages

### Form Handling Best Practices

**Overall Grade: A** - Type-safe forms with comprehensive validation.

**Form Library Recommendations:**
- React Hook Form for form state management
- Zod for schema-based validation
- Integration with TypeScript for type safety
- Built-in error handling
- Optimal re-render performance

**Form Validation Principles:**
- Validate on blur (user leaves field)
- Show inline errors immediately
- Highlight invalid fields visually
- Prevent submission if invalid
- Show summary of all errors on submit attempt
- Validate on backend as well (never trust client)

**Common Validation Rules:**

**Text Fields:**
- Required field validation
- Minimum/maximum length
- Pattern matching (regex)
- Trim whitespace automatically
- No leading/trailing spaces

**Slug Fields:**
- Lowercase only
- Allow hyphens, no spaces
- No special characters
- Must be unique (check with API)
- Auto-generate from title option

**Email Fields:**
- Valid email format
- Not disposable email (optional)
- Unique if required (user registration)

**URL Fields:**
- Valid URL format
- HTTP/HTTPS protocol required
- Reachable URL (optional check)

**Number Fields:**
- Minimum/maximum values
- Integer or decimal validation
- Non-negative where appropriate

**Date Fields:**
- Valid date format
- Not in past (event dates)
- Start before end (date ranges)

**File Upload Fields:**
- File size limits
- File type restrictions
- Scan for malware
- Image dimension requirements

**Form UX Guidelines:**
- Label all fields clearly
- Use placeholder text appropriately (not as labels)
- Group related fields
- Show character counters for limited fields
- Provide helpful hints or examples
- Disable submit button during submission
- Show loading state during submit
- Display success message after successful submit
- Clear form or redirect after success
- Handle network errors gracefully

**Accessibility Requirements:**
- All inputs have associated labels
- Error messages linked with aria-describedby
- Required fields marked with aria-required
- Form validation errors announced to screen readers
- Logical tab order
- Focus management after errors

### Drag-and-Drop Implementation

**Overall Grade: A** - Accessible drag-drop with modern library.

**Recommended Library: dnd-kit**

**Selection Criteria:**
- Excellent accessibility (full keyboard navigation)
- Framework-agnostic core
- Strong TypeScript support
- Customizable sensors (touch, mouse, keyboard)
- Built-in collision detection
- Active maintenance
- No jQuery dependency
- Performant for large lists

**Drag-Drop Use Cases:**
- Section reordering in page builder
- Media file organization
- Dashboard widget arrangement
- Event list reordering
- Navigation menu customization

**Accessibility Requirements:**
- Full keyboard navigation (Space to grab, Arrows to move)
- Screen reader announcements for drag state
- Visual focus indicators
- Announcements for drop position
- Cancel drag with Escape key

**Visual Feedback:**
- Show dragged item as semi-transparent
- Highlight valid drop zones
- Show insertion indicator (line or gap)
- Cursor change to indicate draggability
- Smooth animations for reordering

**Touch Support:**
- Long press to initiate drag on touch devices
- Scroll page while dragging on mobile
- Visual feedback adapted for touch
- Prevent conflicts with scroll gestures

**Performance Considerations:**
- Virtualize long lists when dragging
- Debounce position updates
- Optimize re-renders during drag
- Clean up event listeners

## Testing Strategy

### Testing Principles

**Overall Grade: A** - Comprehensive testing ensures reliability across both frontends.

**Test Philosophy:**
- Test user behavior, not implementation details
- Query by accessible labels and visible text
- Simulate realistic user interactions
- Assert on visible output, not internal state
- Write tests that resemble how users interact

**Testing Pyramid:**
- Many unit tests (fast, isolated)
- Some integration tests (component interactions)
- Few E2E tests (critical user journeys only)

### Coverage Requirements

**Unit Tests:**
- Business logic: 80-90% coverage
- Utility functions: 90%+ coverage
- Custom hooks: 80%+ coverage
- Content rendering components: 70-80% coverage
- Form validation logic: 90%+ coverage

**Integration Tests:**
- Component interactions: 70-80% coverage
- State management: 80%+ coverage
- API integration: 70%+ coverage
- Content section rendering: 80%+ coverage
- Media library workflows: 70-80% coverage

**E2E Tests (Public Frontend):**
- Event browsing and booking flow: complete coverage
- Dynamic CMS page navigation: complete coverage
- User authentication: complete coverage
- Payment flow: complete coverage (if implemented)

**E2E Tests (Admin Frontend):**
- Content creation and editing workflow: complete coverage
- Media upload and selection: complete coverage
- Event management CRUD: 80%+ coverage
- User management: 70%+ coverage
- Settings configuration: 70%+ coverage

### Testing Tools

**Unit & Integration:**
- Vitest (10x faster than Jest)
- React Testing Library
- Mock Service Worker (MSW) for API mocking
- Testing Library User Event for interactions

**E2E Testing:**
- Playwright (cross-browser support)
- Free parallelization
- Auto-waiting eliminates flaky tests
- Trace viewer for debugging
- Screenshot and video recording

### CMS-Specific Testing Scenarios

**Rich Text Editor Testing:**
- Apply formatting (bold, italic, etc.)
- Insert links with validation
- Insert images from media library
- Paste content from external sources
- Undo/redo operations
- Keyboard shortcuts work correctly
- HTML sanitization (no script tags)
- Long content performance

**Media Upload Testing:**
- Validate file size limits
- Validate file type restrictions
- Handle upload errors gracefully
- Show progress during upload
- Cancel in-progress upload
- Upload multiple files simultaneously
- Drag-drop upload
- Click-to-browse upload

**Content Section Drag-Drop Testing:**
- Reorder sections by dragging
- Keyboard reordering works
- Visual feedback during drag
- Drop zones highlighted correctly
- Position updates saved correctly
- Can't drop in invalid locations

**Auto-Save Testing:**
- Saves after debounce period
- Shows "Saving..." indicator
- Shows "Saved" after success
- Retries on failure
- Warns before leaving with unsaved changes
- Queues saves when offline

**Live Preview Testing:**
- Updates in real-time without manual refresh
- Matches public frontend styles exactly
- Responsive mode toggle works
- Shows hidden sections correctly
- Handles large content efficiently

**Complete Workflow E2E Tests:**
- Admin creates new page with multiple sections
- Admin uploads media and inserts into content
- Admin publishes page
- Public user navigates to new page
- Content displays correctly on public site

## Tailwind CSS Standards

### Configuration Requirements

**Setup Checklist:**
- ✅ Configure content paths for all source files
- ✅ Extend theme with brand colors
- ✅ Add custom spacing if needed
- ✅ Enable JIT mode (enabled by default in v3)
- ✅ Configure PurgeCSS for production

**Theme Extension:**
- Define brand colors in config
- Add custom breakpoints if needed
- Extend spacing scale cautiously
- Keep configuration minimal

### Usage Principles

**Overall Grade: A** - Utility-first approach maximizes performance and consistency.

**Composition Strategy:**
- ✅ Use utility classes directly in JSX
- ✅ Compose complex styles from utilities
- ✅ Extract repeated patterns to components
- ❌ Do NOT create custom CSS classes

**Responsive Design:**
- Mobile-first approach (default styles for mobile)
- Use sm, md, lg, xl, 2xl breakpoints
- Test at all breakpoints during development
- Prioritize mobile experience first

**Performance Benefits:**
- Final CSS bundle: ~3KB gzipped
- PurgeCSS removes all unused styles
- Utility classes cache better than custom CSS
- Minimal runtime overhead

### Component Extraction

**When to Extract:**
- Pattern repeats 3+ times
- Complex composition (10+ utility classes)
- Need to enforce consistent styling
- Share across multiple features

**When NOT to Extract:**
- One-off styles (keep inline)
- Simple compositions (2-3 classes)
- Rapid prototyping phase
- Minor variations needed

## Progressive Web App Standards

### Service Worker Configuration

**Caching Strategies:**

**API Responses:**
- Strategy: NetworkFirst
- Fallback to cache if offline
- Fresh data prioritized
- Cache timeout: 5 seconds

**Images:**
- Strategy: CacheFirst
- Instant repeated loads
- Long cache duration (30 days)
- Update only on version change

**Static Assets:**
- Strategy: CacheFirst with immutable flag
- Never revalidate versioned files
- Bust cache on version change
- Far-future expiration (1 year)

### Offline Functionality

**Core Requirements:**
- ✅ Cache critical pages for offline viewing
- ✅ Store failed requests for retry
- ✅ Show meaningful offline indicators
- ✅ Queue bookings for sync when online
- ✅ Content editor works offline (admin)

**User Experience:**
- Display clear offline status
- Allow browsing cached content
- Prevent actions requiring connectivity
- Auto-sync when connection restores
- Show queued actions counter

### Web App Manifest

**Required Configuration:**
- App name and short name
- Icons (192x192, 512x512 PNG)
- Theme color matching brand
- Background color for splash screen
- Display mode: standalone
- Start URL for consistent launch

### Push Notifications

**Implementation Guidelines:**
- Generate VAPID keys for Web Push API
- Request permissions at appropriate moments
- Store subscriptions on backend
- Send booking confirmations and reminders

**Best Practices:**
- ❌ Never request on page load
- ✅ Request after user shows interest
- ✅ Explain value before requesting
- ✅ Provide preference management
- ✅ Handle denials gracefully

## Image and Media Optimization

### Lazy Loading Standards

**Native Lazy Loading:**
- Use loading="lazy" on all below-fold images
- Reserve loading="eager" for hero images
- Apply to all images except first 2-3
- Reduces initial bandwidth by 40-60%

**Intersection Observer:**
- Implement for fine-grained control
- Load images at 10% viewport threshold
- Unobserve after loading completes
- Show placeholder until image loads

### Responsive Image Strategy

**Format Priority:**
1. **AVIF** - 50%+ smaller than JPEG, universal browser support (2025)
2. **WebP** - 30% smaller than JPEG, universal browser support
3. **JPEG** - Fallback for older browsers

**Srcset Implementation:**
- Provide 3-5 size variants (320w, 640w, 960w, 1280w, 1920w)
- Use width descriptors (w) not density (x)
- Let browser choose appropriate size
- Reduce bandwidth by 50-70% on average

**Picture Element:**
- Use for art direction (different crops at different sizes)
- Specify different images for mobile vs desktop
- Control exactly which image loads at which breakpoint

### Video Optimization

**Video Formats:**
- Primary: MP4 with H.264 codec (universal support)
- Alternative: WebM with VP9 (better compression)
- Fallback: Poster image for unsupported browsers

**Video Loading:**
- Use loading="lazy" attribute
- Preload only above-the-fold videos
- Use poster image for all videos
- Defer video load until user interaction

**Embedded Videos:**
- Lazy load YouTube/Vimeo embeds with facade
- Load actual embed on click
- Saves ~500KB per video embed
- Use lite-youtube-embed or similar

## Performance Optimization

### Code Splitting Strategies

**Route-Based Splitting:**
- ✅ Split every major page into separate bundle
- ✅ Use React.lazy for all route components
- ✅ Wrap with Suspense for loading states
- ✅ Load only visited routes

**Component-Based Splitting:**
- ✅ Lazy load rich text editor (heavy dependency)
- ✅ Split image galleries and carousels
- ✅ Defer loading of modal/dialog content
- ✅ Split third-party component libraries
- ✅ Lazy load admin-only components in admin app

**Vendor Splitting:**
- Group React ecosystem (react, react-dom, react-router)
- Separate UI library (shadcn-ui, tailwind)
- Split analytics and tracking scripts
- Bundle frequently updated code separately
- Separate TipTap/Lexical (admin only)

### Build Optimization

**Automatic Optimizations:**
- Tree shaking removes unused code
- Minification compresses JavaScript
- CSS purging removes unused styles
- Asset optimization (images, fonts)

**Manual Configuration:**
- Set chunk size warning limit to 1000KB
- Configure manualChunks for vendor splitting
- Enable source maps only in development
- Disable source maps in production for security

### Bundle Size Targets

**Public Frontend:**
- Initial bundle: < 150KB gzipped
- Route chunks: < 50KB each
- Total JavaScript: < 300KB gzipped

**Admin Frontend:**
- Initial bundle: < 250KB gzipped (rich features acceptable)
- Route chunks: < 100KB each
- Editor bundle: < 200KB gzipped (separate chunk)
- Total JavaScript: < 800KB gzipped (acceptable for admin)

## State Management with Zustand

### Store Organization Principles

**Overall Grade: A** - Zustand provides minimal boilerplate with maximum flexibility.

**Store Structure:**
- ✅ One store per domain (events, bookings, user, content)
- ✅ Keep stores focused and single-purpose
- ✅ Avoid monolithic global state
- ✅ Colocate related state and actions

**State Design:**
- Define state properties clearly
- Create actions for mutations
- Add computed getters for derived data
- Minimize business logic in stores
- Keep stores shallow (avoid deep nesting)

**Store Size:**
- Small stores (3-5 state properties) preferred
- Split large domains into multiple stores
- Each store should have clear responsibility
- Avoid deeply nested state structures

**Store Examples by Application:**

**Public Frontend Stores:**
- eventStore: Event data, filters, search state
- bookingStore: Shopping cart, booking process
- userStore: Authentication, user profile
- contentStore: CMS content cache

**Admin Frontend Stores:**
- authStore: Admin authentication
- contentStore: Content editing state, current page
- mediaStore: Media library state, selected files
- settingsStore: Site settings cache
- uiStore: Sidebar state, modal visibility, notifications

### Persistence Strategy

**What to Persist:**
- ✅ User preferences and settings
- ✅ Bookmarked/favorited events
- ✅ Shopping cart contents
- ✅ Filter selections and UI state
- ✅ Admin UI preferences (sidebar state, view mode)

**What NOT to Persist:**
- ❌ Authentication tokens (use httpOnly cookies)
- ❌ Sensitive user data
- ❌ Temporary UI states (modals, tooltips)
- ❌ Server data (re-fetch on page load)
- ❌ Content being edited (use auto-save instead)

**Implementation Guidelines:**
- Use Zustand's persist middleware
- Configure partial persistence (select specific keys)
- Clear persisted state on logout
- Version persisted data for schema changes
- Handle migration for old persisted data

## Security Standards

### Token Storage

**Access Tokens:**
- ❌ Never store in localStorage (XSS vulnerable)
- ✅ Store in memory only
- ✅ Short-lived (15-30 minutes)
- ✅ Refresh automatically before expiration

**Refresh Tokens:**
- ✅ Store in httpOnly cookies only
- ✅ Longer-lived (7 days)
- ✅ Include secure flag (HTTPS only)
- ✅ Set sameSite=strict (CSRF protection)

### XSS Prevention

**Input Sanitization:**
- React automatically escapes JSX content
- Sanitize HTML before using dangerouslySetInnerHTML
- Validate URLs before href/src attributes
- Never execute user-provided JavaScript
- Use DOMPurify for rich text content

**Content Security Policy:**
- Configure CSP headers on server
- Whitelist trusted script sources
- Disallow inline scripts (except with nonce)
- Block unsafe-eval
- Report CSP violations

### HTTPS Requirements

**Mandatory in Production:**
- All traffic over HTTPS
- HSTS headers with 1-year max-age
- Upgrade insecure requests
- Never send tokens over HTTP
- Secure flag on all cookies

## Monitoring & Analytics

### Performance Monitoring

**Real User Monitoring:**
- Track Core Web Vitals in production
- Monitor bundle sizes over time
- Measure API response times
- Set up performance budgets
- Alert on performance regression

**Performance Budgets:**
- Initial bundle: 200KB gzipped (fail build if exceeded)
- Route chunks: 100KB each
- LCP: < 2.5 seconds
- FID: < 100 milliseconds
- CLS: < 0.1

### Error Tracking

**Error Monitoring:**
- Capture unhandled exceptions
- Include user context and breadcrumbs
- Track error rates and new error types
- Alert on error rate spikes
- Group similar errors

**Implementation:**
- Set up error boundary components
- Send errors to monitoring service (Sentry, etc.)
- Include source maps for debugging (in monitoring service only)
- PII filtering for privacy
- Log errors with context

### Analytics

**User Behavior Tracking:**
- Track booking funnel steps
- Monitor conversion rates
- Identify drop-off points
- A/B test critical features

**Admin Analytics:**
- Content creation frequency
- Media upload statistics
- Most edited pages
- User activity logs
- Feature usage tracking

**Event Tracking:**
- Page views
- Button clicks
- Form submissions
- Booking completions
- Content publishes
- Media uploads

## Deployment Checklist

### Pre-Deployment (Both Applications)

- [ ] Run full test suite (`npm test`)
- [ ] Type check passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] Bundle size within targets
- [ ] Core Web Vitals meet targets
- [ ] Images optimized with responsive variants
- [ ] Service worker configured correctly
- [ ] Environment variables set
- [ ] API endpoints configured correctly
- [ ] No console.log statements in production code

### Public Frontend Specific

- [ ] Dynamic routing works for all CMS pages
- [ ] Content sections render correctly
- [ ] SEO meta tags populated
- [ ] Social sharing works
- [ ] Booking flow end-to-end tested

### Admin Frontend Specific

- [ ] All admin routes protected
- [ ] Rich text editor works correctly
- [ ] Media upload and library functional
- [ ] Content preview accurate
- [ ] Auto-save tested
- [ ] Role-based UI verified
- [ ] All CRUD operations work

### Production Configuration

- [ ] Enable production mode
- [ ] Disable source maps
- [ ] Configure HTTPS/TLS
- [ ] Set security headers (CSP, HSTS)
- [ ] Enable compression (gzip/brotli)
- [ ] Configure CDN for assets
- [ ] Set up monitoring and alerts
- [ ] Test on multiple devices/browsers
- [ ] Verify CORS configuration
- [ ] Check rate limiting

### Post-Deployment

- [ ] Verify all features functional
- [ ] Check Core Web Vitals in production
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Validate analytics tracking
- [ ] Test PWA installation
- [ ] Confirm offline functionality
- [ ] Verify content updates appear on public site
- [ ] Test admin workflows end-to-end

## Recommended Architecture Grade: A

**Strengths:**
- ✅ Modern React 19 with automatic optimization
- ✅ Separation of concerns (public vs admin frontends)
- ✅ Minimal bundle sizes with aggressive code splitting
- ✅ Type-safe development with TypeScript strict mode
- ✅ Lightweight state management with Zustand
- ✅ Production-ready PWA capabilities
- ✅ Comprehensive CMS with rich editing features
- ✅ Flexible content section system
- ✅ Robust media management
- ✅ Performance monitoring and optimization
- ✅ Strong security practices

**Areas for Excellence:**
- Maintain bundle sizes under targets
- Trust React Compiler, avoid premature optimization
- Implement comprehensive testing before launch
- Monitor Core Web Vitals continuously
- Keep dependencies minimal and up-to-date
- Regularly audit security practices
- Optimize CMS workflows based on user feedback
- Continuously improve content editor UX
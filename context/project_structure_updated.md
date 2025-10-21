# Project Structure Guidelines

This file provides guidance when organizing code and managing the event management platform with integrated CMS codebase. Follow these standards to ensure consistent structure, maintainable code, and efficient team collaboration.

## Important: Structure and Organization Principles

**MANDATORY**: Follow the established directory structure strictly. Never create new top-level directories without team discussion. Keep related files together using feature-based organization. Maintain consistent naming conventions across the entire codebase. Document architectural decisions in ADR format. Enforce structure through linting and code review. The project consists of three separate applications: Backend API, Public Frontend, and Admin CMS Frontend.

## Project Organization Philosophy

**BOH Platform Structure** uses feature-based organization with clear separation between backend API and two frontend applications (public and admin). The structure prioritizes developer experience, scalability, and maintainability through consistent patterns, logical grouping, and comprehensive documentation. Each application maintains its own repository while sharing common type definitions and API contracts.

## Repository Strategy

### Separate Repositories (Recommended)

**Overall Grade: A** - Separate repositories provide independence while maintaining simplicity.

**Repository Structure:**
```
boh-platform/
├── boh-api/              # Backend API (NestJS)
├── boh-frontend/         # Public Frontend (React/Next.js)
└── boh-admin/            # Admin CMS Frontend (React/Vite)
```

**Why Separate Repositories:**
- Independent deployment cycles
- Simpler CI/CD pipelines
- Clear ownership boundaries
- Easier to understand for new developers
- No monorepo tooling overhead
- Better for small to medium teams

**When to Use Separate Repos:**
- Frontend and backend can deploy independently
- Different teams own different codebases
- Simple deployment requirements
- Team size under 20 developers
- Want to avoid monorepo complexity

**Repository Purposes:**

**boh-api (Backend):**
- Unified API for both public and admin
- NestJS with Fastify adapter
- PostgreSQL with Prisma
- Handles authentication for both frontends
- Serves both public and admin endpoints

**boh-frontend (Public):**
- Event discovery and booking
- Next.js for SEO optimization
- Public content page rendering
- User authentication and profile
- Mobile-responsive design

**boh-admin (Admin CMS):**
- Content management interface
- Event management for organizers/admins
- Media library
- User management
- Site settings configuration
- Dashboard and analytics

## Backend Directory Structure (boh-api)

### NestJS Application Organization

**Overall Grade: A+** - Clean Architecture with feature modules and CMS separation.

**Complete Backend Structure:**
```
boh-api/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── migrations/                # Database migrations
│   └── seeds/                     # Seed data scripts
│       ├── dev.seed.ts           # Development seed data
│       └── prod.seed.ts          # Production seed data
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── common/                    # Shared utilities
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── interfaces/
│   │       └── pagination.interface.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── upload.config.ts
│   │   └── cors.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── refresh-jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── register.dto.ts
│   │   │       ├── login.dto.ts
│   │   │       └── token-response.dto.ts
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts      # User profile endpoints
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   └── dto/
│   │   ├── events/
│   │   │   ├── events.module.ts
│   │   │   ├── events.controller.ts     # Public event endpoints
│   │   │   ├── events.service.ts
│   │   │   ├── events.repository.ts
│   │   │   └── dto/
│   │   ├── venues/
│   │   │   ├── venues.module.ts
│   │   │   ├── venues.controller.ts
│   │   │   ├── venues.service.ts
│   │   │   ├── venues.repository.ts
│   │   │   └── dto/
│   │   ├── bookings/
│   │   │   ├── bookings.module.ts
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.service.ts
│   │   │   ├── bookings.repository.ts
│   │   │   └── dto/
│   │   ├── tags/
│   │   │   ├── tags.module.ts
│   │   │   ├── tags.controller.ts
│   │   │   ├── tags.service.ts
│   │   │   ├── tags.repository.ts
│   │   │   └── dto/
│   │   └── admin/                       # Admin CMS module
│   │       ├── admin.module.ts
│   │       ├── content/                 # Content management
│   │       │   ├── content.module.ts
│   │       │   ├── pages.controller.ts
│   │       │   ├── sections.controller.ts
│   │       │   ├── content.service.ts
│   │       │   ├── pages.repository.ts
│   │       │   ├── sections.repository.ts
│   │       │   └── dto/
│   │       │       ├── create-page.dto.ts
│   │       │       ├── update-page.dto.ts
│   │       │       ├── create-section.dto.ts
│   │       │       └── reorder-section.dto.ts
│   │       ├── media/                   # Media library
│   │       │   ├── media.module.ts
│   │       │   ├── media.controller.ts
│   │       │   ├── media.service.ts
│   │       │   ├── media.repository.ts
│   │       │   ├── upload.service.ts
│   │       │   ├── image-processing.service.ts
│   │       │   └── dto/
│   │       │       ├── upload-media.dto.ts
│   │       │       └── update-media.dto.ts
│   │       ├── settings/                # Site settings
│   │       │   ├── settings.module.ts
│   │       │   ├── settings.controller.ts
│   │       │   ├── settings.service.ts
│   │       │   ├── settings.repository.ts
│   │       │   └── dto/
│   │       │       └── update-setting.dto.ts
│   │       ├── events/                  # Admin event management
│   │       │   ├── admin-events.controller.ts
│   │       │   └── admin-events.service.ts
│   │       └── users/                   # User management
│   │           ├── admin-users.controller.ts
│   │           ├── admin-users.service.ts
│   │           └── dto/
│   │               ├── update-role.dto.ts
│   │               └── update-status.dto.ts
│   └── database/
│       ├── database.module.ts
│       └── prisma.service.ts
├── uploads/                             # File upload directory
│   ├── images/
│   ├── videos/
│   └── thumbnails/
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── api/                             # API documentation
│   └── adr/                             # Architecture decision records
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

### Backend Module Organization

**Feature Module Structure:**
- Each domain has its own module (events, bookings, users)
- Admin features grouped under /admin parent module
- Modules are self-contained and independent
- Clear separation between public and admin controllers
- Shared services accessible across modules

**Admin Module Strategy:**
- Separate admin module acts as namespace
- All admin endpoints prefixed with /admin
- Role guards applied at module level
- Clear distinction from public endpoints
- Easier to secure and monitor

**File Organization Best Practices:**
- ✅ Group by feature (not by file type)
- ✅ Colocate related files (controller, service, repository, DTOs)
- ✅ Keep modules focused and single-purpose
- ✅ Use clear naming conventions
- ✅ Separate public and admin controllers
- ❌ Don't create god modules
- ❌ Avoid deep nesting (max 3 levels)
- ❌ Don't mix public and admin logic

## Public Frontend Structure (boh-frontend)

### Next.js Application Organization

**Overall Grade: A+** - Next.js App Router with server components for optimal performance.

**Complete Frontend Structure:**
```
boh-frontend/
├── public/                              # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Home page
│   │   ├── events/
│   │   │   ├── page.tsx                 # Event list
│   │   │   └── [slug]/
│   │   │       └── page.tsx             # Event detail
│   │   ├── venues/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── booking/
│   │   │   └── page.tsx                 # Booking flow
│   │   ├── dashboard/
│   │   │   ├── page.tsx                 # User dashboard
│   │   │   ├── bookings/
│   │   │   └── profile/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   └── [slug]/                      # Dynamic CMS pages
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── input.tsx
│   │   ├── common/                      # Shared components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── events/                      # Event components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventList.tsx
│   │   │   ├── EventFilters.tsx
│   │   │   └── EventDetail.tsx
│   │   ├── booking/                     # Booking components
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingSummary.tsx
│   │   │   └── PaymentForm.tsx
│   │   └── cms/                         # CMS content components
│   │       ├── HeroSection.tsx
│   │       ├── TextSection.tsx
│   │       ├── ImageSection.tsx
│   │       ├── VideoSection.tsx
│   │       ├── GallerySection.tsx
│   │       └── EventListSection.tsx
│   ├── lib/
│   │   ├── api.ts                       # API client
│   │   ├── auth.ts                      # Auth utilities
│   │   └── utils.ts                     # Utility functions
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   ├── useBooking.ts
│   │   └── useDebounce.ts
│   ├── stores/                          # Zustand stores
│   │   ├── authStore.ts
│   │   ├── bookingStore.ts
│   │   └── eventStore.ts
│   ├── types/
│   │   ├── event.ts
│   │   ├── booking.ts
│   │   ├── user.ts
│   │   └── api.ts
│   └── styles/
│       └── globals.css                  # Global styles (Tailwind)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.local.example
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Public Frontend Best Practices

**App Router Structure:**
- Use server components by default
- Client components only when needed (interactivity)
- Colocate route-specific components in route folders
- Use loading.tsx and error.tsx for better UX
- Implement proper metadata for SEO

**Component Organization:**
- Separate UI primitives from business components
- Group by feature for business components
- Keep component files focused (< 200 lines)
- Colocate tests with components
- Use index.ts for clean imports

**State Management:**
- Use Zustand for global state (auth, cart)
- React Query for server state (events, bookings)
- Local state for component-specific needs
- Avoid prop drilling with composition

## Admin Frontend Structure (boh-admin)

### React + Vite Application Organization

**Overall Grade: A+** - React with Vite for fast development and admin-specific features.

**Complete Admin Structure:**
```
boh-admin/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── main.tsx                         # Application entry
│   ├── App.tsx                          # Root component
│   ├── router.tsx                       # React Router config
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Dashboard.test.tsx
│   │   │   └── index.ts
│   │   ├── Login/
│   │   │   └── Login.tsx
│   │   ├── Content/
│   │   │   ├── PageList.tsx            # Content page listing
│   │   │   ├── PageEditor.tsx          # Page creation/editing
│   │   │   ├── SectionBuilder.tsx      # Section builder
│   │   │   └── index.ts
│   │   ├── Media/
│   │   │   ├── MediaLibrary.tsx        # Media library grid
│   │   │   ├── MediaUpload.tsx         # Upload interface
│   │   │   ├── MediaDetail.tsx         # File details/edit
│   │   │   └── index.ts
│   │   ├── Events/
│   │   │   ├── EventList.tsx           # Admin event management
│   │   │   ├── EventEditor.tsx         # Event form
│   │   │   ├── EventAnalytics.tsx      # Event statistics
│   │   │   └── index.ts
│   │   ├── Settings/
│   │   │   ├── GeneralSettings.tsx
│   │   │   ├── ContactSettings.tsx
│   │   │   ├── SocialSettings.tsx
│   │   │   ├── SEOSettings.tsx
│   │   │   └── index.ts
│   │   └── Users/
│   │       ├── UserList.tsx
│   │       ├── UserDetail.tsx
│   │       └── index.ts
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   └── form.tsx
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx         # Main admin layout
│   │   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   │   ├── Header.tsx              # Top header
│   │   │   └── Breadcrumbs.tsx
│   │   ├── content/                     # Content management
│   │   │   ├── RichTextEditor.tsx      # TipTap/Lexical editor
│   │   │   ├── SectionTypeSelector.tsx
│   │   │   ├── HeroSectionForm.tsx
│   │   │   ├── TextSectionForm.tsx
│   │   │   ├── ImageSectionForm.tsx
│   │   │   ├── VideoSectionForm.tsx
│   │   │   ├── GallerySectionForm.tsx
│   │   │   └── SectionList.tsx         # Drag-drop section list
│   │   ├── media/
│   │   │   ├── MediaGrid.tsx           # Media library grid
│   │   │   ├── MediaCard.tsx           # Single media item
│   │   │   ├── MediaUploader.tsx       # Drag-drop uploader
│   │   │   ├── MediaSelector.tsx       # Modal for selecting media
│   │   │   └── FolderTree.tsx          # Folder navigation
│   │   ├── forms/
│   │   │   ├── EventForm.tsx
│   │   │   ├── VenueForm.tsx
│   │   │   └── SettingForm.tsx
│   │   └── common/
│   │       ├── DataTable.tsx           # Reusable table
│   │       ├── ConfirmDialog.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   ├── lib/
│   │   ├── api.ts                       # API client
│   │   ├── auth.ts                      # Auth utilities
│   │   ├── upload.ts                    # File upload utilities
│   │   └── validation.ts                # Form validation
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useContent.ts
│   │   ├── useMedia.ts
│   │   ├── useSettings.ts
│   │   └── useDebounce.ts
│   ├── stores/                          # Zustand stores
│   │   ├── authStore.ts
│   │   ├── contentStore.ts
│   │   ├── mediaStore.ts
│   │   └── settingsStore.ts
│   ├── types/
│   │   ├── content.ts
│   │   ├── media.ts
│   │   ├── settings.ts
│   │   ├── event.ts
│   │   └── user.ts
│   └── styles/
│       └── globals.css                  # Global styles (Tailwind)
├── tests/
├── .env.example
├── .gitignore
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Admin Frontend Best Practices

**Page Organization:**
- Each major feature has its own page directory
- Complex pages split into smaller components
- Keep pages focused on composition
- Extract business logic to hooks/services

**Component Organization:**
- UI primitives in /ui (shadcn/ui)
- Feature-specific components in feature folders
- Reusable patterns in /common
- Keep components under 200 lines

**Rich Text Editor:**
- Use TipTap or Lexical (modern editors)
- Configure allowed HTML tags strictly
- Implement image upload integration
- Support mentions and shortcuts
- Save as sanitized HTML

**Drag-and-Drop:**
- Use dnd-kit for accessibility
- Section reordering in page builder
- Media file organization
- Dashboard widget arrangement

**Form Management:**
- React Hook Form for form state
- Zod for validation schemas
- Type-safe form handling
- Error handling and display

## File Naming Conventions

### Naming Standards

**Overall Grade: A+** - Consistent naming improves navigation and understanding.

**Frontend Files (Both Apps):**
- Components: PascalCase (EventCard.tsx, PageEditor.tsx)
- Pages: PascalCase (Dashboard.tsx, MediaLibrary.tsx)
- Hooks: camelCase with "use" prefix (useEventData.ts, useMedia.ts)
- Utilities: camelCase (formatDate.ts, uploadFile.ts)
- Types: camelCase with .ts suffix (event.ts, content.ts)
- Stores: camelCase with Store suffix (authStore.ts, contentStore.ts)
- Tests: Same as source with .test suffix (EventCard.test.tsx)

**Backend Files:**
- Controllers: kebab-case with .controller suffix (events.controller.ts, pages.controller.ts)
- Services: kebab-case with .service suffix (events.service.ts, media.service.ts)
- Repositories: kebab-case with .repository suffix (events.repository.ts)
- DTOs: kebab-case with .dto suffix (create-event.dto.ts, update-page.dto.ts)
- Modules: kebab-case with .module suffix (events.module.ts, content.module.ts)
- Guards: kebab-case with .guard suffix (jwt-auth.guard.ts, roles.guard.ts)

**General Files:**
- Configuration: lowercase (tsconfig.json, .eslintrc.js, vite.config.ts)
- Documentation: UPPERCASE (README.md, CONTRIBUTING.md)
- Environment: lowercase with dot prefix (.env, .env.example)

**Directory Names:**
- Lowercase with hyphens (event-detail, media-library)
- No camelCase or PascalCase for directories
- Descriptive and concise
- Plural for collections (events, users, pages, media)
- Singular for single concept (config, shared, common, admin)

**Best Practices:**
- ✅ Consistent naming across entire codebase
- ✅ Self-documenting file names
- ✅ Include file type in name (.service, .controller, .test)
- ✅ Use standard suffixes (.test, .spec, .types)
- ✅ Distinguish admin from public (admin- prefix when needed)
- ❌ Don't use abbreviations unless standard
- ❌ Avoid generic names (utils.ts, helpers.ts without context)
- ❌ Never use spaces in file names

## Git Workflow

### Branching Strategy

**Overall Grade: A+** - Git Flow provides structured release management.

**Branch Types:**
- **main**: Production-ready code, always deployable
- **develop**: Integration branch for features
- **feature/***: New features (feature/content-editor, feature/media-library)
- **bugfix/***: Bug fixes (bugfix/booking-validation)
- **hotfix/***: Emergency production fixes (hotfix/payment-error)
- **release/***: Release preparation (release/v1.2.0)

**Branch Naming:**
- Use lowercase with hyphens
- Include ticket number if applicable (feature/CMS-123-page-editor)
- Descriptive but concise
- Format: type/description or type/ticket-description
- Specify app if needed (feature/admin-media-library)

**Multi-Repository Workflow:**
- Each repository maintains its own branches
- Coordinate releases across repositories
- Tag releases in each repository
- Document cross-repository dependencies
- Use semantic versioning

**Workflow Process:**
1. Create feature branch from develop
2. Develop feature with commits
3. Push branch and create pull request
4. Code review and approval
5. Merge to develop
6. Delete feature branch
7. Deploy develop to staging for testing

**Release Process:**
1. Create release branch from develop
2. Version bump and changelog update
3. Test thoroughly in staging
4. Merge to main and tag release
5. Merge back to develop
6. Deploy to production

**Hotfix Process:**
1. Create hotfix branch from main
2. Fix critical issue
3. Test fix thoroughly
4. Merge to main and tag
5. Merge to develop
6. Deploy immediately

### Commit Message Standards

**Overall Grade: A+** - Conventional commits enable automation and clarity.

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

**Scopes (Backend):**
- auth, events, bookings, venues, users
- content, media, settings (for CMS modules)
- admin (for admin-specific changes)

**Scopes (Frontend):**
- pages, components, hooks, stores
- cms (for CMS content rendering)
- admin (for admin app)

**Example Commits:**
```
feat(content): add rich text editor for page content

Implement TipTap editor with image upload support.
Allow admins to create formatted content with images.

Closes #CMS-45

---

fix(media): resolve thumbnail generation failure

Fix Sharp library configuration for AVIF format.
Ensure thumbnails generated for all image types.

Fixes #CMS-78

---

feat(admin): implement media library grid view

Add grid layout for media library with infinite scroll.
Include folder navigation and search functionality.

Closes #CMS-123
```

**Commit Best Practices:**
- ✅ Write clear, descriptive subjects
- ✅ Use imperative mood ("add" not "added")
- ✅ Keep subject under 72 characters
- ✅ Separate subject from body with blank line
- ✅ Explain why, not what (body explains context)
- ✅ Reference tickets in footer
- ✅ Specify which app if cross-cutting change
- ❌ Don't commit broken code
- ❌ Avoid vague messages ("fix bug", "update")
- ❌ Never commit secrets or sensitive data

### Pull Request Process

**Overall Grade: A+** - Structured PR process ensures code quality.

**PR Requirements:**
- Clear title following commit conventions
- Description explaining changes and context
- Screenshots for UI changes (required for admin)
- Link to related tickets
- All tests passing
- No merge conflicts
- Appropriate reviewers assigned
- Specify affected application (backend/frontend/admin)

**PR Template:**
```markdown
## Application
- [ ] Backend API
- [ ] Public Frontend
- [ ] Admin Frontend

## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] CMS feature

## Testing
How to test these changes

## Screenshots (if applicable)
Before and after screenshots (required for admin UI)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guide
- [ ] No console.log statements
- [ ] Reviewed own code first
- [ ] Admin functionality tested (if applicable)
```

**Code Review Guidelines:**
- Review within 24 hours
- Focus on logic, not style (automated)
- Be constructive and specific
- Ask questions to understand
- Test admin features thoroughly
- Approve when satisfied
- Request changes if needed

**PR Size Guidelines:**
- Small PRs (< 200 lines): Ideal, quick review
- Medium PRs (200-500 lines): Acceptable
- Large PRs (> 500 lines): Break into smaller PRs
- Massive PRs (> 1000 lines): Must break up

## Configuration Management

### Environment Configuration

**Overall Grade: A+** - Proper configuration management prevents deployment issues.

**Backend Environment Files:**
```
boh-api/
├── .env.development      # Local development
├── .env.staging          # Staging environment
├── .env.production       # Production (never committed)
└── .env.example          # Template with all variables
```

**Frontend Environment Files:**
```
boh-frontend/
├── .env.local            # Local development
├── .env.staging          # Staging
├── .env.production       # Production
└── .env.local.example    # Template

boh-admin/
├── .env.local            # Local development
├── .env.staging          # Staging
├── .env.production       # Production
└── .env.local.example    # Template
```

**Backend Environment Variables:**
```
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/boh_db
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# API
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

**Public Frontend Environment Variables:**
```
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Admin Frontend Environment Variables:**
```
# API
VITE_API_URL=http://localhost:3000/api/v1

# Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```

**Best Practices:**
- ✅ Prefix frontend variables (NEXT_PUBLIC_, VITE_)
- ✅ Use descriptive variable names
- ✅ Group related variables
- ✅ Document variable purpose in .env.example
- ✅ Validate on application startup
- ✅ Separate configs for each application
- ❌ Never commit .env files with secrets
- ❌ Don't use different variable names across environments
- ❌ Avoid complex values (use simple strings)

## Documentation Standards

### Code Documentation

**Overall Grade: A** - Good documentation improves maintainability.

**What to Document:**
- ✅ Complex business logic
- ✅ Non-obvious algorithms
- ✅ Public API functions
- ✅ Configuration options
- ✅ Architecture decisions
- ✅ CMS section types and data structures
- ✅ Admin-specific workflows
- ❌ Don't document obvious code
- ❌ Avoid redundant comments
- ❌ Never leave commented-out code

**JSDoc/TSDoc Comments:**
- Use for public functions and classes
- Describe parameters and return values
- Include usage examples for complex functions
- Document thrown exceptions
- Keep documentation updated with code

**README Requirements (Each Repository):**
- Project overview and purpose
- Installation instructions
- Development setup guide
- Running tests
- Deployment instructions
- Environment variables documentation
- Contributing guidelines
- License information

**Application-Specific Documentation:**

**Backend README:**
- API architecture overview
- Module structure explanation
- Database schema overview
- Authentication flow
- Admin endpoint protection
- Running migrations
- Seeding data

**Frontend README:**
- Application architecture
- Component structure
- State management strategy
- Routing setup
- Environment configuration
- Building for production

**Admin README:**
- Admin-specific features
- User roles and permissions
- Content management workflow
- Media library usage
- Settings configuration
- Development guidelines

### Architecture Decision Records (ADR)

**ADR Structure:**
- Store in docs/adr/ directory
- Number sequentially (001-choosing-database.md)
- Include: Context, Decision, Consequences
- Document significant decisions only
- Update when decisions change

**Example ADR Topics:**
- Separate vs monorepo structure
- Backend framework selection (NestJS)
- Frontend framework choice (Next.js vs Vite)
- State management library (Zustand)
- Database selection (PostgreSQL)
- ORM choice (Prisma)
- Rich text editor selection (TipTap)
- Authentication strategy (JWT)
- File storage approach (local vs cloud)

## TypeScript Configuration

### Shared Type Definitions

**Overall Grade: A** - Shared types ensure consistency across applications.

**Type Sharing Strategy:**
- Define API types in backend
- Export from shared types package (optional)
- Or duplicate types in frontend (simpler)
- Keep types synchronized
- Use code generation tools (optional)

**Backend Types (Export):**
- API request/response DTOs
- Database entities (Prisma types)
- Enum definitions
- Error types

**Frontend Types (Import or Duplicate):**
- API response types
- Form data types
- Component prop types
- Store state types

**TypeScript Config Best Practices:**
- Enable strict mode in all projects
- Use consistent compiler options
- Configure path aliases (@/ for src/)
- Set appropriate target (ES2020+)
- Enable source maps for debugging

## Testing Organization

### Test Structure (All Applications)

**Overall Grade: A** - Consistent test structure improves maintainability.

**Test File Organization:**
- Colocate tests with source files
- Use .test.ts or .spec.ts suffix
- Mirror directory structure in test directories
- Keep test files focused

**Test Categories:**
- Unit tests: Individual functions and classes
- Integration tests: Module interactions
- E2E tests: Complete user workflows

**Backend Test Structure:**
```
test/
├── unit/
│   ├── auth/
│   ├── events/
│   └── admin/
│       ├── content/
│       ├── media/
│       └── settings/
├── integration/
│   ├── events/
│   ├── bookings/
│   └── admin/
└── e2e/
    ├── booking-flow.spec.ts
    └── content-management.spec.ts
```

**Frontend Test Structure:**
```
tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── integration/
│   └── pages/
└── e2e/
    ├── event-booking.spec.ts
    └── user-registration.spec.ts
```

**Admin Test Structure:**
```
tests/
├── unit/
│   ├── components/
│   └── forms/
├── integration/
│   └── pages/
└── e2e/
    ├── content-creation.spec.ts
    ├── media-upload.spec.ts
    └── user-management.spec.ts
```

## Linting and Code Quality

### ESLint Configuration

**Overall Grade: A+** - Automated linting enforces consistent code style.

**Shared ESLint Rules (All Projects):**
- Extend recommended configs
- Enforce consistent code style
- Catch common errors
- TypeScript-specific rules
- No console.log in production code

**Backend-Specific Rules:**
- NestJS decorators formatting
- Dependency injection patterns
- Module structure enforcement

**Frontend-Specific Rules:**
- React hooks rules
- JSX formatting
- Component naming conventions
- Import order

**Pre-commit Hooks:**
- Run linter on staged files
- Run formatter (Prettier)
- Run type checking
- Run tests for changed files
- Prevent commits if checks fail

### Prettier Configuration

**Overall Grade: A+** - Automatic formatting eliminates style debates.

**Shared Prettier Settings (All Projects):**
- Single quotes for strings
- Semicolons required
- 2-space indentation
- Trailing commas (es5)
- Print width 100 characters
- Arrow function parentheses (always)

**Integration:**
- Format on save in editor
- Pre-commit hook formatting
- CI/CD check for formatting
- Integrate with ESLint
- Consistent across team

## Development Standards

### Definition of Done

**Overall Grade: A+** - Clear criteria ensure completeness.

**Feature Checklist:**
- [ ] Code implemented and reviewed
- [ ] Tests written and passing (unit + integration)
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Tested in staging
- [ ] Product owner approval
- [ ] Performance validated
- [ ] Security reviewed
- [ ] Monitoring configured
- [ ] Ready for production
- [ ] Admin functionality tested (if applicable)
- [ ] Cross-browser tested (for frontends)

**CMS Feature Checklist:**
- [ ] Content creation/editing works
- [ ] Content publishing workflow verified
- [ ] Media upload and management tested
- [ ] Rich text editor functionality verified
- [ ] Section types render correctly
- [ ] Mobile responsive (admin interface)
- [ ] Role-based access control verified
- [ ] Audit logging functional

**Bug Fix Checklist:**
- [ ] Root cause identified
- [ ] Fix implemented and reviewed
- [ ] Regression tests added
- [ ] Tested in staging
- [ ] No side effects verified
- [ ] Related bugs checked
- [ ] Documentation updated
- [ ] Deployed to production
- [ ] Verified in production

## Recommended Project Structure Grade: A+

**Strengths:**
- ✅ Clear separation between three applications
- ✅ Feature-based organization for scalability
- ✅ Clean Architecture in backend
- ✅ Consistent naming conventions across all apps
- ✅ Structured Git workflow
- ✅ Conventional commit messages
- ✅ Comprehensive documentation standards
- ✅ Automated code quality enforcement
- ✅ Clear admin module separation
- ✅ CMS-specific organization patterns

**Critical Requirements:**
- Follow established directory structure
- Use consistent file naming across all applications
- Write conventional commit messages
- Create small, focused pull requests
- Document architecture decisions
- Maintain .env.example files for all apps
- Keep documentation updated
- Run linting before commits
- Review code systematically
- Define and follow Definition of Done
- Test admin features thoroughly
- Coordinate releases across repositories
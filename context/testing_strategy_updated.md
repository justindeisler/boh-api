# Testing Strategy Guidelines

This file provides guidance when implementing comprehensive testing for the BOH Platform event management system with integrated CMS. Follow these standards to ensure code reliability, catch bugs early, and enable confident refactoring across all applications.

## Important: Test-Driven Development Principles

**MANDATORY**: Write tests for all business logic before deployment. Test user behavior, not implementation details. Achieve minimum 80% code coverage for critical paths. Run full test suite in CI/CD before merging to main branch. Never skip tests to meet deadlines. CMS content management and media operations must be thoroughly tested due to their critical role in the platform.

## Testing Philosophy

**BOH Platform Testing** implements a comprehensive testing pyramid with unit tests for business logic, integration tests for API endpoints and CMS operations, and end-to-end tests for critical user journeys including content management workflows. The strategy emphasizes fast feedback, reliable tests, and high coverage for production confidence across public frontend, admin CMS, and backend API.

## Testing Pyramid

### Testing Levels Overview

**Overall Grade: A+** - Balanced test pyramid provides confidence without excessive maintenance.

**Unit Tests (70% of tests):**
- Fast execution (milliseconds)
- Test individual functions and classes
- Mock external dependencies
- High coverage of business logic
- Run on every file save
- Test CMS content validation logic
- Test media file validation rules

**Integration Tests (20% of tests):**
- Test component interactions
- Real database connections
- API endpoint testing
- Verify data flow between layers
- Run before commits
- Test CMS API endpoints
- Test media upload workflows
- Test content publishing flows

**End-to-End Tests (10% of tests):**
- Test complete user workflows
- Real browser automation
- Critical path coverage only
- Slowest but highest confidence
- Run before deployment
- Test complete content creation workflow
- Test media library interactions
- Test content preview and publishing

**Why This Distribution:**
- Unit tests catch logic errors early
- Fast feedback loop for developers
- Integration tests verify component contracts
- E2E tests validate user experience
- Balanced maintenance burden
- CMS workflows require thorough integration testing

## Unit Testing Standards

### Unit Test Principles

**Overall Grade: A+** - Comprehensive unit testing provides foundation for reliability.

**What to Unit Test:**
- ✅ Business logic and domain entities
- ✅ Use cases and application services
- ✅ Validation logic and business rules
- ✅ Utility functions and helpers
- ✅ Custom hooks (React)
- ✅ State management logic
- ✅ Content section data validation
- ✅ Media file validation logic
- ✅ Rich text sanitization functions
- ✅ Slug generation algorithms
- ❌ Framework code (React, NestJS internals)
- ❌ Third-party libraries
- ❌ Simple getters/setters

**Test Characteristics:**
- Fast: < 10ms per test
- Isolated: No shared state between tests
- Repeatable: Same result every run
- Independent: Run in any order
- Focused: Test one thing at a time

**Mocking Strategy:**
- Mock external dependencies (APIs, databases)
- Mock at boundaries (repository interfaces)
- Don't mock internal domain logic
- Use test doubles sparingly
- Prefer real implementations when fast
- Mock media upload services in unit tests
- Mock rich text editor dependencies

### Frontend Unit Testing

**Component Testing Focus:**
- Test user-visible behavior
- Query by accessible labels and text
- Simulate realistic user interactions
- Assert on rendered output
- Avoid testing implementation details
- Test content section rendering components
- Test media selection modals
- Test form validation in admin interface

**What NOT to Test:**
- Component internal state directly
- CSS class names or styles
- React lifecycle methods
- Framework-specific behavior
- Implementation details that may change
- Rich text editor internals (library responsibility)

**React Testing Principles:**
- Use React Testing Library (not Enzyme)
- Find elements by accessible queries
- Simulate user events realistically
- Test from user's perspective
- Avoid shallow rendering

**Custom Hook Testing:**
- Test hooks in isolation
- Use renderHook utility
- Test all hook states and transitions
- Verify side effects
- Test error conditions
- Test content management hooks (useContent, useMedia)
- Test auto-save debounce logic
- Test drag-and-drop hooks

### Backend Unit Testing

**Domain Logic Testing:**
- Test entity behavior thoroughly
- Verify business rule enforcement
- Test edge cases and boundaries
- Validate error conditions
- Ensure immutability
- Test content page entity validation
- Test media file entity constraints
- Test section type validation

**Use Case Testing:**
- Test complete business operations
- Mock repository interfaces
- Verify correct repository calls
- Test success and failure paths
- Validate return values
- Test content publishing workflow
- Test media upload orchestration
- Test section reordering logic

**Service Testing:**
- Test orchestration logic
- Mock all external dependencies
- Verify correct service interactions
- Test error handling
- Validate data transformations
- Test content sanitization service
- Test thumbnail generation service (mock external calls)
- Test media storage service interactions

### CMS-Specific Unit Testing

**Overall Grade: A** - Thorough unit testing of CMS logic ensures data integrity.

**Content Validation Testing:**
- Test slug uniqueness validation
- Test slug format validation (lowercase, hyphens only)
- Test title length constraints
- Test meta description length limits
- Test content status transitions (draft → published)
- Test required field validation
- Test section type validation
- Test section position validation

**Media Validation Testing:**
- Test file size limits (images: 10MB, videos: 100MB)
- Test file type validation (MIME type checking)
- Test file extension validation
- Test image dimension validation
- Test filename sanitization
- Test duplicate file detection
- Test storage quota validation
- Test alt text length constraints

**Rich Text Sanitization Testing:**
- Test dangerous tag removal (script, iframe)
- Test allowed tag preservation (p, strong, em, etc.)
- Test attribute sanitization (remove onclick, onerror)
- Test URL validation in links
- Test HTML entity encoding
- Test nested structure handling
- Test empty content handling
- Test extremely long content

**Section Builder Logic Testing:**
- Test section position calculation
- Test section reordering algorithm
- Test section data schema validation
- Test section visibility toggle
- Test section duplication logic
- Test section deletion with cascade
- Test default section data generation
- Test section type-specific validation

**Auto-Save Logic Testing:**
- Test debounce timing (should wait 1000ms)
- Test multiple rapid changes (should only save once)
- Test save retry logic on failure
- Test conflict detection
- Test offline queue logic
- Test isDirty flag management
- Test localStorage backup
- Test save indicator state transitions

## Integration Testing Standards

### Integration Test Principles

**Overall Grade: A** - Integration tests verify component interactions work correctly.

**What to Integration Test:**
- ✅ API endpoint request/response cycles
- ✅ Database query operations
- ✅ Authentication and authorization flows
- ✅ State management with real stores
- ✅ External service integrations (mocked)
- ✅ Error handling across layers
- ✅ CMS content CRUD operations
- ✅ Media upload and storage workflows
- ✅ Content publishing pipelines
- ✅ Role-based access control enforcement

**Database Testing Strategy:**
- Use real PostgreSQL instance (not SQLite)
- Create separate database per test suite
- Clean database between tests
- Use transactions for test isolation
- Seed required reference data
- Test cascade deletes for CMS content
- Test unique constraints on slugs
- Test foreign key relationships

**Why Real Database:**
- Tests actual database behavior
- Catches query issues (syntax, indexes)
- Verifies migrations work correctly
- Tests database constraints
- Validates transaction handling
- Tests JSON field storage (section data)
- Validates full-text search functionality

### API Integration Testing

**Endpoint Testing Focus:**
- Test complete request/response cycle
- Verify HTTP status codes
- Validate response structure
- Check error responses
- Test pagination and filtering
- Test sorting and searching
- Test content endpoint filtering by status
- Test media endpoint filtering by type

**Authentication Testing:**
- Test without authentication (expect 401)
- Test with invalid token (expect 401)
- Test with expired token (expect 401)
- Test with valid token (expect 200)
- Test insufficient permissions (expect 403)
- Test ADMIN-only endpoints as USER (expect 403)
- Test ORGANIZER endpoints as USER (expect 403)
- Test content management as non-admin (expect 403)

**Validation Testing:**
- Test with missing required fields (400/422)
- Test with invalid data types (400/422)
- Test with out-of-range values (400/422)
- Test with invalid formats (400/422)
- Verify detailed error messages
- Test duplicate slug creation (409 conflict)
- Test invalid section type (400)
- Test oversized file upload (413)

**Database State Verification:**
- Query database directly after operations
- Verify correct data created/updated
- Check side effects (timestamps, counters)
- Validate cascade operations
- Confirm data integrity
- Verify section positions after reorder
- Verify media file references are updated
- Verify published timestamp is set

### CMS API Integration Testing

**Overall Grade: A+** - Comprehensive CMS API testing ensures reliability.

**Content Pages API Testing:**

**Create Page Tests:**
- Test successful page creation with valid data
- Test automatic slug generation from title
- Test slug uniqueness enforcement (409 on duplicate)
- Test default status is DRAFT
- Test author is set to authenticated user
- Test empty sections array is created
- Test creation without optional fields (meta description)
- Test validation errors for invalid data

**Update Page Tests:**
- Test updating all fields successfully
- Test partial updates (PATCH semantics)
- Test slug change updates references
- Test status change from DRAFT to PUBLISHED
- Test publishedAt timestamp set on publish
- Test cannot change author
- Test validation on update
- Test concurrent update conflict detection

**Delete Page Tests:**
- Test successful page deletion
- Test cascade delete of sections
- Test deletion of page with media references (should not delete media)
- Test cannot delete non-existent page (404)
- Test soft delete vs hard delete (if implemented)
- Test deletion permission check

**List Pages Tests:**
- Test pagination (limit, offset)
- Test filtering by status (draft, published, archived)
- Test filtering by author
- Test search by title or slug
- Test sorting (by title, date, etc.)
- Test default ordering (newest first)
- Test empty result handling

**Content Sections API Testing:**

**Create Section Tests:**
- Test creating section with valid type
- Test section position auto-increment
- Test default visibility is true
- Test section data validation by type
- Test creating multiple sections
- Test invalid section type rejection
- Test required pageId validation

**Update Section Tests:**
- Test updating section data
- Test updating section position (reorder)
- Test toggling visibility
- Test changing section type (if allowed)
- Test validation of type-specific data
- Test concurrent update handling

**Reorder Sections Tests:**
- Test bulk position update
- Test moving section up in order
- Test moving section down in order
- Test moving to first position
- Test moving to last position
- Test invalid position handling
- Test transaction rollback on error

**Delete Section Tests:**
- Test successful section deletion
- Test positions recalculated for remaining sections
- Test cannot delete non-existent section
- Test permission check
- Test deletion with media references

**Media Library API Testing:**

**Upload Media Tests:**
- Test successful image upload (JPEG, PNG, WebP)
- Test successful video upload (MP4, WebM)
- Test file size validation (reject oversized files)
- Test file type validation (reject invalid types)
- Test filename sanitization
- Test thumbnail generation (async process)
- Test metadata extraction (dimensions, duration)
- Test storage quota check
- Test duplicate file handling
- Test concurrent uploads

**List Media Tests:**
- Test pagination works correctly
- Test filtering by type (image/video)
- Test filtering by folder
- Test search by filename
- Test sorting options
- Test thumbnail URLs are correct
- Test media used in content is tracked

**Update Media Tests:**
- Test updating alt text
- Test updating caption/title
- Test moving to different folder
- Test updating tags
- Test cannot update file itself (replace only)
- Test validation on update

**Delete Media Tests:**
- Test successful deletion
- Test file removed from storage
- Test thumbnail removed
- Test cannot delete if in use (return warning or error)
- Test cascade deletion of references (optional)
- Test soft delete with recovery period

**Replace Media Tests:**
- Test replacing file keeps same ID
- Test new thumbnail generated
- Test metadata updated
- Test all references remain valid
- Test file size validation on replace

**Site Settings API Testing:**

**Get Settings Tests:**
- Test retrieving all settings
- Test filtering by group (GENERAL, CONTACT, etc.)
- Test filtering by public/private
- Test only public settings returned to non-admin
- Test default values returned if not set

**Update Settings Tests:**
- Test updating multiple settings at once
- Test type validation (TEXT, NUMBER, BOOLEAN, JSON)
- Test JSON validation for JSON type
- Test number validation for NUMBER type
- Test ADMIN permission required
- Test settings cache invalidation after update

### Database Testing Optimization

**Fast Database Creation:**
- Use IntegSQL or similar tools
- Create template database once
- Copy template for each test suite
- Mount as tmpfs for speed
- Reduces setup from 3s to 500ms

**Test Isolation:**
- Each test suite gets own database
- Clean up after each test
- Use transactions when possible
- Reset sequences and indexes
- Avoid shared state between tests
- Clear media files from test storage

**Seed Data Strategy:**
- Define minimal seed data
- Create factory functions for test data
- Use realistic data (not "test123")
- Randomize non-critical values
- Document seed data purpose
- Seed default section types
- Seed sample media files for testing

**CMS Test Data Factories:**
- createPage() - generates valid page with sections
- createSection() - generates section with type-specific data
- createMediaFile() - generates media with metadata
- createUser() - generates user with role
- createSettings() - generates site settings

## End-to-End Testing Standards

### E2E Test Principles

**Overall Grade: A+** - E2E tests validate complete user workflows.

**What to E2E Test:**
- Critical user journeys only
- Happy path scenarios
- Important error scenarios
- Cross-browser compatibility
- Mobile responsive behavior
- Complete content management workflows
- Media upload and insertion workflows
- Content publishing and preview workflows

**E2E Test Characteristics:**
- Slow: seconds to minutes per test
- Test real user interactions
- Use real browsers (Chrome, Firefox, Safari)
- Test against staging environment
- Run less frequently than unit/integration tests

**Browser Coverage:**
- Chrome: Latest stable version
- Firefox: Latest stable version
- Safari: Latest stable version (Mac/iOS)
- Edge: Latest stable version
- Mobile browsers: Chrome Mobile, Safari Mobile

**E2E Best Practices:**
- Use Playwright for modern E2E testing
- Implement page object pattern
- Use data-testid attributes for stable selectors
- Avoid CSS selectors that may change
- Wait for elements properly (Playwright auto-waits)
- Take screenshots on failure
- Record traces for debugging
- Run in headless mode in CI
- Parallelize tests when possible

### Critical User Journeys

**Public Frontend E2E Tests:**

**Event Booking Flow (Must Test):**
1. Browse event listings
2. Filter and search events
3. View event details
4. Select event and tickets
5. Add to cart
6. Proceed to checkout
7. Enter payment information
8. Complete booking
9. Receive confirmation

**Dynamic Content Navigation (Must Test):**
1. Navigate to CMS-generated pages (About, Contact)
2. Verify content sections render correctly
3. Verify images load from media library
4. Verify responsive layout on mobile
5. Verify navigation works across CMS pages

**Authentication Flow (Must Test):**
1. Register new account
2. Verify email
3. Login with credentials
4. Access protected resources
5. Logout
6. Password reset flow

**Search and Filter (Must Test):**
1. Search for events by keyword
2. Filter by category
3. Filter by date range
4. Sort results
5. View filtered results

**Admin Frontend E2E Tests:**

**Content Creation Workflow (Must Test):**
1. Admin logs in
2. Navigate to Content Pages
3. Click "Create New Page"
4. Enter page title and slug
5. Add Hero section with background image
6. Select image from media library
7. Add Text section with rich text content
8. Format text (bold, italic, links)
9. Add Image section
10. Upload new image via media library
11. Preview content in live preview pane
12. Save as draft (auto-save also tested)
13. Publish page
14. Verify page appears on public site

**Media Library Workflow (Must Test):**
1. Navigate to Media Library
2. Drag-drop upload multiple images
3. Verify upload progress indicators
4. Edit image alt text and caption
5. Organize files into folders
6. Search for specific media file
7. Select media for use in content
8. Delete unused media file
9. Verify deletion confirmation

**Event Management Workflow (Must Test):**
1. Organizer logs in
2. Navigate to Events
3. Create new event
4. Upload event image from media library
5. Set event details (date, venue, price)
6. Publish event
7. Verify event appears on public site
8. Edit event details
9. Cancel event
10. View booking statistics

**Section Builder Workflow (Must Test):**
1. Create new page
2. Add multiple section types (Hero, Text, Gallery, CTA)
3. Reorder sections by dragging
4. Toggle section visibility
5. Edit section content inline
6. Duplicate a section
7. Delete a section
8. Preview changes in real-time
9. Save and publish page

**User Management Workflow (Must Test):**
1. Admin navigates to Users
2. View list of all users
3. Search for specific user
4. Change user role (USER to ORGANIZER)
5. Deactivate user account
6. Verify user cannot login
7. Reactivate user account
8. Delete user (with confirmation)

**Settings Management Workflow (Must Test):**
1. Navigate to Settings
2. Update site title and description
3. Update contact information
4. Update social media links
5. Upload logo image
6. Change theme colors
7. Save settings
8. Verify settings reflected on public site

### E2E Testing Challenges and Solutions

**Flaky Test Prevention:**
- Use Playwright's auto-wait features
- Avoid fixed timeouts (use wait for conditions)
- Retry flaky tests automatically (max 1 retry)
- Investigate and fix root cause of flakiness
- Use data-testid for stable selectors
- Clear browser state between tests
- Don't rely on specific timing

**Async Operations:**
- Wait for media upload completion indicators
- Wait for auto-save "Saved" indicator
- Wait for navigation to complete
- Wait for API responses (Playwright intercepts)
- Handle loading states properly
- Use proper awaits in test code

**File Upload Testing:**
- Test with real files (store in fixtures/)
- Test various file formats
- Test file size limits
- Test drag-drop upload
- Test click-to-upload
- Verify upload progress
- Verify file appears in media library

**Rich Text Editor Testing:**
- Focus editor properly
- Type text naturally
- Use keyboard shortcuts for formatting
- Verify formatted content in preview
- Test link insertion
- Test image insertion from media library
- Don't test editor internals (library responsibility)

**Drag-and-Drop Testing:**
- Use Playwright's drag methods
- Verify visual feedback during drag
- Verify final position after drop
- Test keyboard-based reordering
- Test invalid drop targets
- Verify database updated after reorder

## Test Coverage Requirements

### Coverage Targets

**Overall Grade: A** - Balanced coverage provides confidence without diminishing returns.

**Unit Test Coverage:**
- Business logic: 80-90% coverage
- Domain entities: 90%+ coverage
- Use cases: 85%+ coverage
- Utility functions: 90%+ coverage
- Content validation logic: 90%+ coverage
- Media validation logic: 90%+ coverage
- Rich text sanitization: 95%+ coverage
- Overall backend: 80%+ coverage
- Overall frontend: 70%+ coverage

**Integration Test Coverage:**
- API endpoints: 70-80% coverage
- Critical paths: 95%+ coverage
- Authentication: 100% coverage
- Payment processing: 100% coverage
- CMS content CRUD: 90%+ coverage
- Media upload/delete: 90%+ coverage
- Content publishing flow: 95%+ coverage

**E2E Test Coverage:**
- Critical user journeys: 100% coverage
- Happy paths: Complete coverage
- Error scenarios: Major errors only
- Content management workflows: 100% coverage
- Media library workflows: 100% coverage
- Event management (organizer): 90%+ coverage
- User management (admin): 80%+ coverage

**What Coverage Doesn't Measure:**
- Code quality
- Test quality (can test wrong things)
- Edge case handling
- Real-world usage patterns
- User experience

**Coverage Best Practices:**
- ✅ Set coverage thresholds in CI/CD
- ✅ Fail builds below threshold
- ✅ Focus on critical business logic
- ✅ Review coverage reports regularly
- ✅ Test edge cases explicitly
- ✅ Prioritize CMS validation and sanitization coverage
- ❌ Don't chase 100% coverage
- ❌ Don't write tests just for coverage
- ❌ Don't ignore uncovered critical paths

### CMS-Specific Coverage Requirements

**Content Management Coverage:**
- Content page CRUD operations: 90%+ coverage
- Section CRUD operations: 90%+ coverage
- Content validation: 95%+ coverage
- Publishing workflow: 100% coverage
- Content sanitization: 100% coverage

**Media Management Coverage:**
- Media upload operations: 90%+ coverage
- Media validation: 95%+ coverage
- Thumbnail generation: 80%+ coverage
- Media deletion: 90%+ coverage
- Storage quota checks: 90%+ coverage

**Admin Features Coverage:**
- Role-based access control: 100% coverage
- User management: 80%+ coverage
- Settings management: 80%+ coverage
- Dashboard statistics: 70%+ coverage

## Testing Tools and Frameworks

### Frontend Testing Tools

**Overall Grade: A+** - Modern tools provide excellent developer experience.

**Vitest (Unit Testing):**
- 10x faster than Jest
- Native ES module support
- Vite integration (shared config)
- Hot module replacement for tests
- Jest-compatible API (easy migration)

**React Testing Library:**
- Test user behavior (not implementation)
- Accessible queries (by label, text, role)
- Encourages best practices
- Works with all React features
- Strong community support
- Perfect for testing admin UI components

**Playwright (E2E Testing):**
- Cross-browser support included
- Free parallelization
- Auto-waiting eliminates flakiness
- Excellent debugging tools
- TypeScript first-class support
- Trace viewer for debugging
- Screenshot and video recording
- Network request interception

**Testing Library User Event:**
- Realistic user interactions
- Better than fireEvent
- Async by default
- Covers edge cases
- Great for admin form testing

### Backend Testing Tools

**Vitest (Unit Testing):**
- Same benefits as frontend
- Fast execution
- TypeScript support
- Coverage reporting built-in
- Watch mode for development

**Supertest (API Testing):**
- Test HTTP endpoints without running server
- Fluent assertion API
- Works with Express and Fastify
- No network overhead
- Integrates with any test framework

**Prisma Testing:**
- Use real PostgreSQL instance
- Create test database automatically
- Clean database between tests
- Test migrations
- Verify database constraints
- Test JSON field storage (section data)

### Mocking Libraries

**Vitest Built-in Mocking:**
- Mock modules with vi.mock()
- Spy on function calls
- Mock timers and dates
- Auto-mocking support
- Clear mocks between tests

**Mock Service Worker (MSW):**
- Mock API requests in tests
- Intercept network requests
- Same handlers for tests and development
- No test-specific code in application
- Works in Node and browser
- Mock media upload endpoints
- Mock external service APIs

**Test Data Builders:**
- Create factory functions for test data
- Generate realistic data
- Randomize non-critical fields
- Override specific fields easily
- Reduce test setup boilerplate
- CMS content factories
- Media file factories
- User factories with roles

## Test Organization

### File Structure

**Overall Grade: A** - Clear organization improves test maintainability.

**Frontend Structure:**
- Colocate tests with components
- ComponentName.test.tsx next to ComponentName.tsx
- Shared test utilities in __tests__/utils
- Integration tests in __tests__/integration
- E2E tests in separate e2e directory
- CMS component tests in components/content/__tests__
- Media library tests in components/media/__tests__

**Backend Structure:**
- Mirror source directory structure
- Place tests in test directory
- Unit tests: test/unit/feature/file.test.ts
- Integration tests: test/integration/feature/file.test.ts
- E2E tests: test/e2e/workflow.test.ts
- CMS tests: test/integration/cms/
- Media tests: test/integration/media/

**Naming Conventions:**
- Test files: *.test.ts or *.spec.ts
- Test suites: describe('FeatureName', ...)
- Test cases: it('should do something', ...)
- Use descriptive names
- Follow "should" convention
- Group CMS tests by feature (content, media, settings)

### Test Setup and Teardown

**Setup Patterns:**
- Use beforeAll for expensive setup (database)
- Use beforeEach for test isolation
- Create helper functions for common setup
- Keep setup minimal and focused
- Document setup requirements
- Initialize test media storage
- Seed default section types

**Teardown Patterns:**
- Use afterEach for cleanup
- Use afterAll for expensive teardown
- Always clean up resources
- Reset mocks between tests
- Clear test data from database
- Clear uploaded test media files
- Reset test storage quota

**Best Practices:**
- ✅ Keep tests independent
- ✅ Clean up after each test
- ✅ Use consistent setup patterns
- ✅ Document required setup
- ✅ Clean up media files after tests
- ❌ Don't share state between tests
- ❌ Don't rely on test execution order
- ❌ Don't leave orphaned media files

## Continuous Integration Testing

### CI/CD Test Execution

**Overall Grade: A+** - Automated testing prevents bugs from reaching production.

**Test Stages in CI:**
1. **Lint and Type Check**: Fast feedback on code quality
2. **Unit Tests**: Run all unit tests in parallel
3. **Integration Tests**: Test API and database operations
4. **E2E Tests**: Critical path validation
5. **Coverage Check**: Enforce minimum thresholds
6. **CMS Workflow Tests**: Complete content management validation

**Parallel Execution:**
- Run unit tests in parallel (all CPU cores)
- Run integration tests in parallel (separate databases)
- Run E2E tests in parallel (Playwright workers)
- Reduces total CI time significantly
- Balance parallelization with resource usage
- Parallelize CMS tests by feature (content, media, settings)

**Failure Handling:**
- Fail build on any test failure
- Retry flaky E2E tests once only
- Report test results to PR
- Store test artifacts (screenshots, traces)
- Alert team on test failures
- Create GitHub issues for persistent failures

**Performance Optimization:**
- Cache dependencies between runs
- Use Docker layer caching
- Parallelize test execution
- Run fast tests first (fail fast)
- Skip tests for documentation-only changes
- Cache media fixtures for E2E tests

### Test Reporting

**Coverage Reports:**
- Generate on every CI run
- Post coverage to PR comments
- Track coverage trends over time
- Fail if coverage drops significantly
- Visualize coverage in dashboard
- Highlight uncovered CMS-critical paths

**Test Results:**
- Report pass/fail status to PR
- Show test execution time
- Highlight flaky tests
- Track test suite performance
- Alert on increasing test duration
- Track CMS test suite separately

**Artifact Storage:**
- Store failed test screenshots
- Store Playwright traces
- Store uploaded test media samples
- Store test database dumps on failure
- Retain artifacts for 30 days
- Allow download from CI interface

## Testing Best Practices

### Writing Effective Tests

**Overall Grade: A+** - High-quality tests provide maximum value.

**Test Naming:**
- Describe what is being tested
- Include expected outcome
- Use "should" convention
- Be specific and clear
- Avoid test1, test2, etc.
- Include CMS context in name

**Test Structure (AAA Pattern):**
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify expected outcome
- Keep each section clear and separated
- One logical assertion per test

**Assertion Quality:**
- Assert on meaningful outcomes
- Use specific assertions (not just truthy)
- Test behavior, not implementation
- Verify side effects when relevant
- Check error messages and codes
- Verify section positions after reorder
- Verify media file exists in storage
- Verify content is sanitized

**Test Maintainability:**
- Keep tests simple and readable
- Avoid complex logic in tests
- Extract common setup to helpers
- Don't repeat yourself (DRY)
- Update tests when requirements change
- Use test data factories
- Document complex test scenarios

### Common Testing Pitfalls

**Pitfalls to Avoid:**
- ❌ Testing implementation details
- ❌ Brittle selectors (CSS classes)
- ❌ Shared mutable state
- ❌ Tests depending on execution order
- ❌ Overly complex test setup
- ❌ Testing framework code
- ❌ Ignoring failing tests
- ❌ Skipping tests to meet deadlines
- ❌ Not cleaning up uploaded test files
- ❌ Hardcoding file paths in tests

**Flaky Test Prevention:**
- Use deterministic test data
- Avoid timing dependencies
- Clean up after each test
- Don't rely on external services
- Use proper waiting mechanisms
- Isolate test environments
- Use Playwright auto-wait features
- Wait for auto-save completion properly
- Wait for media upload completion
- Use unique file names to avoid conflicts

### Test-Driven Development

**TDD Process:**
1. Write failing test first
2. Write minimal code to pass
3. Refactor while keeping tests green
4. Repeat for next feature

**TDD Benefits:**
- Forces thinking about design
- Provides immediate feedback
- Creates comprehensive test suite
- Enables confident refactoring
- Reduces debugging time

**When to Use TDD:**
- Complex business logic
- Algorithm implementation
- Bug fixes (test reproduces bug first)
- Critical functionality
- Unfamiliar code areas
- CMS content validation logic
- Media upload validation
- Content sanitization

**TDD for CMS Features:**
- Write test for slug validation before implementing
- Write test for section reordering before coding
- Write test for media upload before implementation
- Write test for content publishing flow first
- Write test for auto-save logic before implementation

## Performance Testing

### Load Testing Requirements

**Overall Grade: A** - Performance testing ensures system handles expected load.

**What to Test:**
- Concurrent user capacity
- Response time under load
- Database query performance
- API endpoint throughput
- Resource utilization (CPU, memory)
- Media upload concurrency
- Content publishing throughput
- Media library browsing performance

**Load Testing Scenarios:**
- Normal load: Average daily traffic
- Peak load: Maximum expected traffic
- Stress test: Beyond peak capacity
- Endurance test: Sustained load over hours
- Spike test: Sudden traffic increase
- Media upload spike: Multiple concurrent uploads
- Content publishing burst: Many pages published simultaneously

**Performance Targets:**
- API response time: < 100ms (p95)
- Database queries: < 50ms (p95)
- Page load time: < 2 seconds (LCP)
- Concurrent users: 1000+ simultaneous
- Throughput: 10,000+ requests/minute
- Media upload: 20 concurrent uploads
- Content API: < 50ms response time
- Media library loading: < 200ms

**CMS Performance Targets:**
- Content page load: < 100ms
- Section list query: < 50ms
- Media library listing: < 150ms (with thumbnails)
- Content search: < 200ms
- Rich text save: < 100ms
- Section reorder: < 50ms

**Load Testing Tools:**
- k6: Modern load testing tool (recommended)
- Apache JMeter: Established tool with GUI
- Gatling: Scala-based with great reports
- Artillery: Simple configuration-based testing

### Performance Monitoring

**Metrics to Track:**
- Request duration percentiles (p50, p95, p99)
- Error rate by endpoint
- Database connection pool usage
- Memory consumption
- CPU utilization
- Media storage usage
- Content cache hit rate
- Thumbnail generation queue length

**Performance Budgets:**
- Set maximum response times
- Define acceptable error rates
- Monitor resource usage limits
- Alert on budget violations
- Track performance trends
- Monitor CMS endpoint performance separately
- Alert on slow media uploads

**CMS-Specific Monitoring:**
- Content page creation time
- Section reordering performance
- Media upload duration
- Thumbnail generation time
- Content publish latency
- Rich text sanitization time
- Search query performance
- Cache effectiveness

## CMS-Specific Testing Scenarios

### Content Management Testing

**Overall Grade: A+** - Comprehensive CMS testing ensures content integrity.

**Slug Management Testing:**
- Test automatic slug generation from title
- Test slug uniqueness enforcement
- Test slug format validation
- Test slug update propagation
- Test slug conflicts across pages
- Test slug URL-encoding edge cases

**Content Status Workflow Testing:**
- Test draft creation
- Test draft to published transition
- Test published to archived transition
- Test cannot unpublish without permission
- Test publishedAt timestamp behavior
- Test status filtering in API

**Content Versioning Testing (if implemented):**
- Test version creation on save
- Test version history retrieval
- Test reverting to previous version
- Test version diff calculation
- Test version retention limits

**Content Search Testing:**
- Test full-text search on titles
- Test full-text search on content
- Test search with special characters
- Test search performance with large dataset
- Test search result ranking
- Test empty search results

### Section Builder Testing

**Overall Grade: A** - Section builder testing ensures content structure integrity.

**Section Type Testing:**
- Test all section types can be created
- Test type-specific data validation
- Test required fields per type
- Test optional fields per type
- Test default values per type
- Test data schema evolution

**Section Reordering Testing:**
- Test moving section up
- Test moving section down
- Test moving to first position
- Test moving to last position
- Test bulk reordering multiple sections
- Test position gap handling
- Test concurrent reorder conflicts

**Section Visibility Testing:**
- Test toggle visibility
- Test hidden sections not rendered
- Test visibility in preview vs published
- Test bulk visibility change
- Test visibility permission checks

**Section Operations Testing:**
- Test section duplication (deep copy)
- Test section deletion
- Test cascade delete on page deletion
- Test section data migration
- Test section export/import

### Media Library Testing

**Overall Grade: A+** - Media library testing ensures file integrity and security.

**Upload Validation Testing:**
- Test file size limits enforced
- Test file type validation (MIME and extension)
- Test image dimension validation
- Test filename sanitization (remove special chars)
- Test duplicate file detection (hash comparison)
- Test storage quota enforcement
- Test concurrent upload limits
- Test virus scanning (if implemented)

**Thumbnail Generation Testing:**
- Test thumbnail created for images
- Test multiple thumbnail sizes
- Test thumbnail format (WebP)
- Test async generation doesn't block response
- Test regeneration on replace
- Test fallback for failed generation

**Media Organization Testing:**
- Test folder creation
- Test nested folder structure
- Test move media between folders
- Test folder deletion with contents
- Test folder rename propagation

**Media Usage Tracking Testing:**
- Test media usage recorded on insertion
- Test usage count accurate
- Test usage locations tracked
- Test cannot delete media in use (warning)
- Test usage updated on content deletion

**Media Search and Filter Testing:**
- Test search by filename
- Test search by alt text
- Test filter by type (image/video)
- Test filter by upload date
- Test filter by folder
- Test filter by usage (used/unused)
- Test sort by date, name, size

### Rich Text Editor Testing

**Overall Grade: A** - Editor testing ensures content safety and functionality.

**Sanitization Testing:**
- Test script tags removed
- Test iframe removed (unless whitelisted)
- Test onclick handlers removed
- Test onerror handlers removed
- Test javascript: URLs removed
- Test data: URLs handled safely
- Test allowed tags preserved (p, strong, em, etc.)
- Test nested structures preserved

**Editor Functionality Testing:**
- Test basic formatting (bold, italic, underline)
- Test headings (H1-H6)
- Test lists (ordered, unordered, checklists)
- Test link insertion and validation
- Test image insertion from media library
- Test code blocks
- Test tables
- Test keyboard shortcuts

**Content Preservation Testing:**
- Test paste from Word preserves formatting
- Test paste from Google Docs
- Test paste plain text
- Test copy/cut/paste within editor
- Test undo/redo operations
- Test content survives editor reload

### Auto-Save Testing

**Overall Grade: A** - Auto-save testing prevents data loss.

**Debounce Testing:**
- Test no save on first keystroke
- Test save after debounce period (1000ms)
- Test multiple rapid changes trigger one save
- Test save immediately on blur
- Test save on section add/delete/reorder

**Save Indicator Testing:**
- Test "Saving..." shown during save
- Test "Saved" shown after success
- Test timestamp updated after save
- Test "Unsaved changes" shown when dirty
- Test error message on save failure

**Retry Logic Testing:**
- Test automatic retry on network error
- Test exponential backoff between retries
- Test max retry limit (3 attempts)
- Test manual save button after retry exhaustion
- Test queued saves when offline

**Conflict Resolution Testing:**
- Test concurrent edit detection
- Test conflict dialog shown
- Test user can choose version to keep
- Test merge options (if implemented)
- Test pessimistic locking (if implemented)

### Role-Based Access Testing

**Overall Grade: A+** - RBAC testing ensures security and proper authorization.

**Admin Role Testing:**
- Test admin can create/edit all content
- Test admin can manage all users
- Test admin can access settings
- Test admin can publish any content
- Test admin can delete any content
- Test admin can access media library
- Test admin can manage folders

**Organizer Role Testing:**
- Test organizer can create own events
- Test organizer cannot edit others' events
- Test organizer can access media library
- Test organizer cannot access user management
- Test organizer cannot access settings
- Test organizer can upload media
- Test organizer cannot delete others' media

**User Role Testing:**
- Test user cannot access admin panel
- Test user redirected from admin URLs
- Test user can only access public pages
- Test user can manage own profile
- Test user can view own bookings

**Permission Enforcement Testing:**
- Test API endpoints check role
- Test frontend hides unauthorized UI
- Test direct API calls blocked without permission
- Test role changes apply immediately
- Test deleted users cannot login

## Recommended Testing Grade: A+

**Strengths:**
- ✅ Comprehensive test pyramid implementation
- ✅ Fast unit tests with Vitest
- ✅ Real database for integration tests
- ✅ Cross-browser E2E testing with Playwright
- ✅ High coverage requirements for critical paths
- ✅ Automated testing in CI/CD
- ✅ Performance testing strategy
- ✅ Comprehensive CMS workflow testing
- ✅ Media library security testing
- ✅ Role-based access control testing
- ✅ Content sanitization testing
- ✅ Auto-save reliability testing

**Critical Requirements:**
- Achieve 80%+ coverage for business logic
- Achieve 90%+ coverage for CMS content validation
- Achieve 95%+ coverage for content sanitization
- Test critical user journeys with E2E tests
- Test complete content creation workflow
- Test media upload and management workflows
- Run full test suite in CI/CD
- Use real database for integration tests
- Implement test data factories for CMS entities
- Monitor test suite performance
- Fix flaky tests immediately
- Never skip tests to meet deadlines
- Update tests when requirements change
- Clean up test media files after test runs
- Test role-based access control thoroughly
- Test content publishing workflows end-to-end
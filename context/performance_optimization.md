# Performance Optimization Guidelines

This file provides guidance when optimizing performance for the event management platform. Follow these standards to ensure fast load times, responsive interactions, and efficient resource utilization across frontend, backend, and infrastructure.

## Important: Performance Budget Requirements

**MANDATORY**: Maintain strict performance budgets throughout development. Initial bundle size must stay under 200KB gzipped. Largest Contentful Paint must be under 2.5 seconds. API response times must be under 100ms for cached queries. Fail CI/CD builds that exceed performance budgets. Optimize before launching, not after user complaints.

## Performance Philosophy

**Event Management Performance** emphasizes user-perceived speed through aggressive optimization at every layer. The system targets sub-2-second page loads, instant interactions, and efficient resource usage through bundle optimization, intelligent caching, image compression, and database query optimization.

## Core Web Vitals Targets

### Web Vitals Overview

**Overall Grade: A+** - Core Web Vitals directly impact user experience and SEO rankings.

**Why Core Web Vitals Matter:**
- Google ranking factor (SEO impact)
- Direct correlation with user satisfaction
- Measurable user experience metrics
- Industry-standard benchmarks
- Objective performance targets

**Three Core Metrics:**
- **LCP (Largest Contentful Paint)**: Loading performance
- **FID (First Input Delay)**: Interactivity responsiveness
- **CLS (Cumulative Layout Shift)**: Visual stability

### Largest Contentful Paint (LCP)

**Overall Grade: A+** - LCP measures loading performance from user perspective.

**Target: < 2.5 seconds**
- Good: < 2.5 seconds
- Needs Improvement: 2.5 - 4.0 seconds
- Poor: > 4.0 seconds

**What LCP Measures:**
- Time until largest content element renders
- Usually hero image, video, or large text block
- User-perceived loading time
- Most important performance metric

**How to Optimize LCP:**
- Optimize and compress hero images (AVIF format)
- Preload critical resources (fonts, hero images)
- Minimize render-blocking JavaScript and CSS
- Use server-side rendering for initial content
- Optimize server response times (< 600ms TTFB)
- Implement efficient caching strategies

**Common LCP Elements:**
- Hero images on landing pages
- Event detail page header images
- Large video embeds
- Full-width background images
- Text blocks above the fold

### First Input Delay (FID)

**Overall Grade: A+** - FID measures interactivity and responsiveness.

**Target: < 100 milliseconds**
- Good: < 100ms
- Needs Improvement: 100 - 300ms
- Poor: > 300ms

**What FID Measures:**
- Time from user interaction to browser response
- Measures when button clicks, taps actually work
- Indicates main thread availability
- Critical for user satisfaction

**How to Optimize FID:**
- Break up long JavaScript tasks (> 50ms)
- Use web workers for heavy computations
- Implement code splitting aggressively
- Defer non-essential JavaScript
- Minimize main thread work
- Use React transitions for heavy updates

**Common FID Problems:**
- Large JavaScript bundles blocking main thread
- Expensive operations on click handlers
- Synchronous API calls
- Complex state updates
- Unoptimized animations

### Cumulative Layout Shift (CLS)

**Overall Grade: A+** - CLS measures visual stability during page load.

**Target: < 0.1**
- Good: < 0.1
- Needs Improvement: 0.1 - 0.25
- Poor: > 0.25

**What CLS Measures:**
- Unexpected layout shifts during load
- Content jumping around as page loads
- Visual stability and predictability
- User frustration from misclicks

**How to Optimize CLS:**
- Set width and height attributes on images
- Reserve space for ads and embeds
- Avoid inserting content above existing content
- Use transform for animations (not top/left/width/height)
- Preload custom fonts to prevent font swap shift
- Set explicit sizes for video players

**Common CLS Causes:**
- Images without dimensions
- Ads, embeds, iframes without reserved space
- Web fonts causing text reflow (FOUT/FOIT)
- Dynamically injected content
- Animations causing layout changes

## Bundle Optimization

### Code Splitting Strategy

**Overall Grade: A+** - Proper code splitting reduces initial load by 50-70%.

**Why Code Splitting:**
- Users only download code they need
- Faster initial page load
- Better caching (unchanged routes stay cached)
- Improved Time to Interactive
- Critical for large applications

**Route-Based Splitting:**
- Split every major route into separate bundle
- Lazy load route components with React.lazy
- Wrap with Suspense for loading states
- Users never download code for unvisited routes
- Reduces initial bundle by 60-80%

**Component-Based Splitting:**
- Lazy load heavy components (video players, editors)
- Split large third-party libraries
- Defer loading of modal and dialog content
- Load image galleries on demand
- Split analytics and tracking scripts

**Vendor Code Splitting:**
- Separate React ecosystem (react, react-dom, router)
- Split UI libraries (chakra-ui, emotion)
- Bundle frequently changing code separately
- Extract rarely changing dependencies
- Improves long-term caching

**Bundle Size Targets:**
- Initial bundle: 150-200KB gzipped (absolute maximum)
- Route chunks: 50-100KB each
- Vendor chunks: 100-150KB total
- Critical CSS: < 14KB (first roundtrip)

**Best Practices:**
- ✅ Split all routes automatically
- ✅ Lazy load below-fold components
- ✅ Split large dependencies separately
- ✅ Monitor bundle sizes continuously
- ✅ Set size budgets in CI/CD
- ❌ Don't split too aggressively (too many requests)
- ❌ Avoid loading same code multiple times

### Tree Shaking Optimization

**Overall Grade: A+** - Tree shaking eliminates 20-40% of unused code.

**Why Tree Shaking:**
- Removes unused exports from bundles
- Reduces bundle size automatically
- No runtime overhead
- Works with ES6 modules
- Build-time optimization

**Enabling Tree Shaking:**
- Use ES6 imports (not CommonJS require)
- Avoid importing entire libraries
- Configure sideEffects in package.json
- Use production builds (dead code elimination)
- Import specific components, not defaults

**Import Optimization:**
- Bad: `import _ from 'lodash'` (entire library)
- Good: `import debounce from 'lodash/debounce'` (one function)
- Bad: `import * as Icons from 'react-icons'` (all icons)
- Good: `import { FiUser } from 'react-icons/fi'` (one icon)

**Measuring Tree Shaking:**
- Analyze bundle with webpack-bundle-analyzer
- Check for duplicate dependencies
- Identify unused code in bundles
- Verify sideEffects configuration
- Monitor bundle size trends

### Dependency Audit

**Overall Grade: A** - Regular audits prevent dependency bloat.

**Why Audit Dependencies:**
- Dependencies often account for 70-80% of bundle
- Many packages include unnecessary code
- Alternatives may be smaller and faster
- Unused dependencies waste bandwidth
- Security vulnerabilities in dependencies

**Audit Process:**
- Review bundle analysis regularly (monthly)
- Identify largest dependencies
- Search for smaller alternatives
- Remove unused dependencies
- Update dependencies for optimizations

**Common Heavy Dependencies to Replace:**
- moment.js (2.8MB) → date-fns (6KB modular)
- lodash (entire) → lodash-es (tree-shakeable)
- Material-UI (large) → Tailwind (minimal runtime)
- Axios (13KB) → fetch (native, 0KB)

**Best Practices:**
- ✅ Audit dependencies monthly
- ✅ Use bundle analyzer regularly
- ✅ Choose smaller alternatives
- ✅ Import only needed functions
- ✅ Remove unused dependencies
- ❌ Don't install packages unnecessarily
- ❌ Avoid duplicate dependencies

## Image and Video Optimization

### Image Format Selection

**Overall Grade: A+** - Modern formats reduce bandwidth by 50%+ while improving quality.

**Format Priority (2025):**
1. **AVIF**: Best compression (50%+ smaller than JPEG), universal support
2. **WebP**: Good compression (30% smaller), excellent compatibility
3. **JPEG**: Universal fallback, optimize quality settings
4. **PNG**: For graphics/icons with transparency only

**Why AVIF First:**
- 50-60% smaller than JPEG at same quality
- Better quality than WebP at same size
- Universal browser support (2025: 95%+)
- Supports transparency and animation
- No patent concerns (royalty-free)

**Format Selection Guidelines:**
- **Photos**: AVIF > WebP > JPEG
- **Graphics/Logos**: AVIF > WebP > PNG
- **Icons**: SVG (vector, scalable)
- **Screenshots**: AVIF > WebP > PNG

### Image Processing Pipeline

**Overall Grade: A+** - Automated processing ensures consistent optimization.

**Upload Processing Steps:**
1. **Resize**: Maximum dimensions (2000px for heroes, 800px thumbnails)
2. **Strip metadata**: Remove EXIF data (privacy + file size)
3. **Convert formats**: Generate AVIF, WebP, JPEG variants
4. **Create variants**: Multiple sizes for responsive images
5. **Optimize**: Compress each variant appropriately

**Responsive Image Sizes:**
- Thumbnails: 400px, 800px
- Content images: 800px, 1200px, 1600px
- Hero images: 1200px, 1600px, 2000px
- Profile images: 200px, 400px

**Quality Settings:**
- AVIF: quality 75-80
- WebP: quality 80-85
- JPEG: quality 85-90
- PNG: lossless compression with optimization

**Storage Organization:**
- Original uploaded file preserved (backup)
- Processed variants in CDN-friendly structure
- Descriptive filenames with dimensions
- Separate folders by format
- Automatic cleanup of old variants

### Lazy Loading Implementation

**Overall Grade: A+** - Lazy loading reduces initial bandwidth by 40-60%.

**Native Lazy Loading:**
- Use loading="lazy" on all below-fold images
- Browser decides when to load based on viewport
- Zero JavaScript required
- Excellent browser support (95%+)
- Reserve loading="eager" for hero images only

**Intersection Observer:**
- More control than native lazy loading
- Load images at specific viewport thresholds
- Can show placeholders or blur-ups
- Unobserve after loading completes
- Useful for progressive enhancement

**Progressive Image Loading:**
- Show low-quality placeholder immediately (LQIP)
- Load full-quality image in background
- Smooth transition from placeholder to full
- Perceived performance improvement
- Better UX than blank space

**Best Practices:**
- ✅ Lazy load all below-fold images
- ✅ Use native lazy loading as default
- ✅ Intersection Observer for custom behavior
- ✅ Show placeholders during load
- ✅ Preload critical above-fold images
- ❌ Don't lazy load hero images
- ❌ Avoid loading all images on scroll
- ❌ Don't lazy load without placeholders

### Video Optimization

**Overall Grade: A** - Proper video optimization prevents bandwidth waste.

**Adaptive Bitrate Streaming:**
- Use HLS (HTTP Live Streaming) for best compatibility
- Generate multiple quality levels (240p, 480p, 720p, 1080p)
- Segment videos into 2-10 second chunks
- Client automatically switches quality based on bandwidth
- Smooth playback on all connection speeds

**Video Codec Selection:**
- **H.264**: Universal baseline (all devices)
- **H.265/HEVC**: 40% better compression (limited support)
- **AV1**: 50% better compression (growing support 80%+)
- **VP9**: Google codec (good compression, wide support)

**Video Encoding Guidelines:**
- Always encode H.264 for compatibility
- Add AV1 for bandwidth savings (future-proofing)
- Use variable bitrate (VBR) encoding
- Optimize keyframe intervals (2 seconds)
- Generate thumbnail/poster images

**Video Delivery:**
- Use picture element with multiple sources
- Serve AV1 to supporting browsers
- Fallback to H.264 universally
- Implement lazy loading for videos
- Preload="none" for below-fold videos

**Best Practices:**
- ✅ Generate multiple quality levels
- ✅ Use adaptive streaming (HLS)
- ✅ Encode in H.264 + AV1
- ✅ Lazy load video content
- ✅ Optimize poster images
- ❌ Don't serve single quality only
- ❌ Avoid autoplay with sound
- ❌ Don't embed large videos directly

## Caching Strategies

### Browser Caching

**Overall Grade: A+** - Proper caching reduces repeat visit load time by 80-90%.

**Cache-Control Headers:**
- **Static assets** (images, fonts, JS, CSS): 1 year immutable
- **API responses** (dynamic): no-cache or short TTL (5 minutes)
- **HTML documents**: no-cache (always validate)
- **User-uploaded content**: 30 days, must-revalidate

**Versioned Assets:**
- Include hash in filename (app.abc123.js)
- Change hash when content changes
- Far-future expiration (1 year)
- Use immutable directive
- Automatic with bundlers (Vite, Webpack)

**Cache Busting:**
- Version query parameters (not recommended)
- Filename hashing (recommended)
- Update HTML references automatically
- Clients fetch only changed files
- Old versions naturally expire

**ETag and Conditional Requests:**
- Server generates ETag (hash of content)
- Client sends If-None-Match header
- Server returns 304 Not Modified if unchanged
- Reduces bandwidth even when cache expired
- Validates freshness efficiently

**Best Practices:**
- ✅ Use far-future expiration for versioned assets
- ✅ Implement cache busting via filename hashing
- ✅ Set immutable for static assets
- ✅ Use ETags for validation
- ✅ Cache aggressively, invalidate smartly
- ❌ Never cache HTML without validation
- ❌ Don't use query params for cache busting
- ❌ Avoid short cache times on static assets

### CDN Caching

**Overall Grade: A+** - CDN caching delivers content 3-10x faster globally.

**Why Use CDN:**
- Serves content from edge locations (closest to user)
- Reduces latency (geographic proximity)
- Offloads origin server (bandwidth savings)
- DDoS protection and security
- Automatic global distribution

**What to Cache on CDN:**
- ✅ All static assets (images, JS, CSS, fonts)
- ✅ User-uploaded media
- ✅ API responses (with careful TTL)
- ❌ Authenticated API responses
- ❌ Personalized content
- ❌ Frequently changing data

**CDN Configuration:**
- Cache static assets for 30 days minimum
- Respect Cache-Control headers from origin
- Implement cache purging for updates
- Use cache keys for variations (Accept-Encoding)
- Monitor cache hit ratios (target 90%+)

**Stale-While-Revalidate:**
- Serve stale content immediately
- Fetch fresh content in background
- Update cache for next request
- Optimizes for perceived performance
- Reduces user-visible latency

**Best Practices:**
- ✅ Use CDN for all static assets
- ✅ Configure appropriate cache TTLs
- ✅ Implement cache purging mechanism
- ✅ Monitor cache hit ratios
- ✅ Use stale-while-revalidate
- ❌ Don't cache authenticated responses
- ❌ Avoid caching personalized content
- ❌ Never cache without purge strategy

### Server-Side Caching with Redis

**Overall Grade: A+** - Redis caching reduces database load by 70-90%.

**Cache-Aside Pattern:**
1. Check Redis for cached data
2. If cache hit: return immediately
3. If cache miss: query database
4. Store result in Redis before returning
5. Subsequent requests served from cache

**What to Cache:**
- ✅ Event listings (high read, low write)
- ✅ Venue details (rarely change)
- ✅ User profiles (read-heavy)
- ✅ Computed aggregations (expensive queries)
- ❌ Real-time booking counts (stale data risk)
- ❌ Sensitive personal data (security risk)

**TTL Strategy:**
- Event listings: 1 hour
- Static content: 24 hours
- User sessions: 7 days
- Rate limit counters: 15 minutes
- Computed values: Based on change frequency

**Cache Invalidation:**
- **Time-based**: TTL expiration (simplest)
- **Event-based**: Clear on updates (most accurate)
- **Tag-based**: Invalidate related entries
- **Least Recently Used**: Automatic eviction when full

**Cache Key Design:**
- Include resource type: `event:list:page:1`
- Include query parameters: `events:category:music:date:2025`
- Use consistent naming conventions
- Enable pattern-based invalidation
- Keep keys short but descriptive

**Best Practices:**
- ✅ Cache expensive database queries
- ✅ Set appropriate TTLs per data type
- ✅ Implement cache invalidation strategy
- ✅ Monitor cache hit/miss ratios
- ✅ Use Redis for session storage
- ❌ Don't cache everything blindly
- ❌ Never cache without expiration
- ❌ Avoid very short TTLs (defeats purpose)

## Database Query Optimization

### Query Performance

**Overall Grade: A+** - Optimized queries respond in under 50ms.

**Target Response Times:**
- Simple queries (indexed): < 10ms
- Complex queries (joins): < 50ms
- Aggregations: < 100ms
- Full-text search: < 100ms
- Report generation: < 500ms

**Query Optimization Techniques:**
- Use EXPLAIN ANALYZE for slow queries
- Add indexes for WHERE clauses
- Optimize JOIN conditions
- Avoid SELECT * (select specific columns)
- Use LIMIT for large result sets
- Implement pagination (cursor-based preferred)

**N+1 Query Prevention:**
- Use eager loading (Prisma include)
- Batch related queries with Promise.all
- Use database JOINs instead of multiple queries
- Implement DataLoader for GraphQL
- Monitor query counts in logs

**Index Strategy:**
- Index all foreign keys
- Composite indexes for multi-column queries
- Partial indexes for filtered queries
- Full-text indexes for search
- Monitor index usage (remove unused)

**Best Practices:**
- ✅ Profile slow queries (> 100ms)
- ✅ Use indexes appropriately
- ✅ Prevent N+1 queries
- ✅ Select only needed columns
- ✅ Use pagination for large datasets
- ❌ Don't index every column
- ❌ Avoid complex subqueries when JOINs work
- ❌ Never fetch all records without LIMIT

### Connection Pooling

**Overall Grade: A+** - Proper pooling enables 10x concurrent user capacity.

**Why Connection Pooling:**
- Multiplexes client connections efficiently
- Reduces database connection overhead
- Enables handling 1000+ concurrent users
- Prevents connection exhaustion
- Improves response times

**PgBouncer Configuration:**
- Pool size: 25 connections per database
- Reserve pool: 5 connections
- Max client connections: 1000+
- Transaction pooling mode (for web apps)
- Monitor pool utilization continuously

**Application Configuration:**
- Connect through PgBouncer port
- Handle connection failures gracefully
- Implement retry logic with backoff
- Release connections promptly
- Never leak connections

## API Response Optimization

### Response Size Reduction

**Overall Grade: A** - Smaller responses improve load times and reduce bandwidth costs.

**Compression:**
- Enable gzip compression (70-80% reduction)
- Use brotli compression (5-10% better than gzip)
- Compress responses over 1KB
- Configure at reverse proxy level
- Support compression negotiation

**Field Selection:**
- Allow clients to specify needed fields
- Implement fields query parameter
- Reduces over-fetching
- Saves bandwidth on mobile
- GraphQL-style field selection for REST

**Pagination:**
- Never return unbounded lists
- Default limit: 20 items
- Maximum limit: 100 items
- Use cursor-based pagination for consistency
- Include total count when reasonable

**Response Trimming:**
- Remove null values (optional)
- Exclude empty arrays if appropriate
- Use consistent JSON structure
- Avoid deeply nested responses
- Keep response structure flat

### Response Caching

**Overall Grade: A+** - Cached responses serve in sub-millisecond time.

**Cache-Control Headers:**
- Set appropriate max-age values
- Use stale-while-revalidate
- Public vs private caching
- No-cache for authenticated responses
- Vary header for content negotiation

**ETag Implementation:**
- Generate ETags for cacheable responses
- Validate with If-None-Match
- Return 304 Not Modified when unchanged
- Saves bandwidth and processing
- Works with CDN and browser caches

## Frontend Performance

### Rendering Optimization

**Overall Grade: A** - Efficient rendering keeps UI responsive.

**React Optimization:**
- Trust React Compiler for automatic optimization
- Use React.memo selectively (after profiling)
- Implement virtualization for long lists (100+ items)
- Debounce expensive operations (300ms)
- Use transition API for non-urgent updates

**Animation Performance:**
- Use CSS transforms (not top/left)
- Prefer opacity and transform (GPU accelerated)
- Avoid animating layout properties
- Use will-change sparingly
- Monitor frame rates (60fps target)

**Memory Management:**
- Clean up event listeners in useEffect
- Cancel promises on component unmount
- Clear intervals and timeouts
- Limit client-side cache sizes
- Monitor memory leaks in DevTools

### JavaScript Performance

**Overall Grade: A** - Efficient JavaScript execution prevents main thread blocking.

**Long Task Prevention:**
- Break tasks longer than 50ms
- Use Web Workers for CPU-intensive work
- Implement requestIdleCallback for low-priority work
- Yield to browser between operations
- Monitor Total Blocking Time (TBT)

**Debouncing and Throttling:**
- Debounce search inputs (300ms)
- Throttle scroll handlers (100ms)
- Throttle resize handlers (200ms)
- Use built-in browser APIs when possible
- Consider lodash.debounce/throttle

## Monitoring Performance

### Real User Monitoring (RUM)

**Overall Grade: A+** - RUM provides actual user experience data.

**What to Monitor:**
- Core Web Vitals (LCP, FID, CLS)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

**Performance Budgets:**
- Set maximum thresholds for all metrics
- Fail builds exceeding budgets
- Track performance trends over time
- Alert on regressions
- Monitor by device type and connection speed

**Lighthouse CI:**
- Run Lighthouse on every deployment
- Track scores over time
- Fail builds on score drops
- Generate performance reports
- Automate performance audits

## Recommended Performance Grade: A+

**Strengths:**
- ✅ Aggressive bundle optimization with code splitting
- ✅ Modern image formats (AVIF) with lazy loading
- ✅ Multi-layer caching (browser, CDN, Redis)
- ✅ Database query optimization with indexing
- ✅ Connection pooling for concurrent users
- ✅ Core Web Vitals monitoring
- ✅ Performance budgets in CI/CD

**Critical Requirements:**
- Maintain bundle sizes under 200KB gzipped
- Achieve LCP < 2.5 seconds
- Implement lazy loading for all below-fold content
- Use AVIF format for all images
- Configure aggressive browser caching
- Implement Redis caching for expensive queries
- Monitor Core Web Vitals continuously
- Set performance budgets in CI/CD
- Optimize before launching, not after complaints
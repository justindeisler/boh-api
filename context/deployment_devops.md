# Deployment and DevOps Guidelines

This file provides guidance when deploying and operating the event management platform. Follow these standards to ensure reliable deployments, minimal downtime, and efficient infrastructure management.

## Important: Zero-Downtime Deployment Requirements

**MANDATORY**: All production deployments must be zero-downtime. Never take the application offline for updates. Use rolling deployments or blue-green strategies. Always test deployments in staging before production. Implement proper health checks before routing traffic to new instances. Have rollback procedures documented and tested.

## DevOps Philosophy

**Event Management DevOps** emphasizes automation, reliability, and self-hosted infrastructure control. The deployment strategy uses Docker containerization, automated CI/CD pipelines, process management with PM2, and comprehensive monitoring to ensure high availability and rapid recovery from failures.

## Docker Containerization

### Why Docker Containers

**Overall Grade: A+** - Docker ensures consistency across all environments.

**Benefits of Containerization:**
- Eliminates "works on my machine" problems
- Identical environments from development to production
- Easy to scale horizontally
- Fast deployment and rollback
- Efficient resource utilization
- Simplified dependency management

**When to Use Docker:**
- All production deployments
- Staging and QA environments
- Development environment (optional but recommended)
- CI/CD build environments
- Microservices architecture

### Dockerfile Best Practices

**Overall Grade: A+** - Optimized Dockerfiles reduce image size and build time.

**Multi-Stage Builds:**
- Separate build stage from runtime stage
- Install build dependencies only in build stage
- Copy only necessary artifacts to runtime stage
- Results in 100-200MB images vs 500MB+ without multi-stage
- Reduces attack surface (fewer packages in production)

**Layer Optimization:**
- Order layers from least to most frequently changing
- Copy package.json and install before copying source code
- Leverage build cache for faster rebuilds
- Combine related RUN commands to reduce layers
- Clean up temporary files in same layer

**Security Hardening:**
- Use official base images (node:20-alpine)
- Run as non-root user (nodejs:nodejs)
- Don't include secrets in image
- Scan images for vulnerabilities
- Keep base images updated

**Image Size Reduction:**
- Use Alpine Linux base images (smallest)
- Remove development dependencies in production
- Use .dockerignore to exclude unnecessary files
- Multi-stage builds (as mentioned above)
- Clean package manager cache

**Best Practices:**
- ✅ Use multi-stage builds always
- ✅ Run as non-root user
- ✅ Pin specific base image versions
- ✅ Minimize number of layers
- ✅ Use .dockerignore
- ✅ Label images with metadata
- ❌ Never include secrets in images
- ❌ Don't run as root user
- ❌ Avoid large base images (debian, ubuntu)

## Docker Compose Orchestration

### Multi-Container Architecture

**Overall Grade: A+** - Docker Compose simplifies multi-service deployments.

**Why Docker Compose:**
- Declarative service configuration
- Manages multiple containers together
- Handles networking automatically
- Volume management simplified
- Environment variable injection
- Development and production use

**Service Organization:**
- Application service (NestJS API)
- Database service (PostgreSQL)
- Cache service (Redis)
- Reverse proxy (Nginx or Caddy)
- Optional: PgBouncer for connection pooling

**Networking Strategy:**
- Default bridge network for service communication
- Expose only necessary ports to host
- Services communicate by service name
- No need for IP addresses
- Automatic DNS resolution

**Volume Management:**
- Named volumes for database persistence
- Named volumes for Redis data
- Bind mounts for development (hot reload)
- Never use volumes for secrets
- Backup volume data regularly

**Health Check Configuration:**
- Define health checks for all services
- Application waits for database ready
- Prevent requests before application ready
- Implement graceful startup sequence
- Monitor health check failures

**Best Practices:**
- ✅ Use docker-compose.yml for configuration
- ✅ Separate dev and prod compose files
- ✅ Use named volumes for persistence
- ✅ Implement health checks
- ✅ Set restart policies (unless-stopped)
- ✅ Use environment variables for configuration
- ❌ Never commit .env files with secrets
- ❌ Don't expose all ports to host
- ❌ Avoid host network mode in production

## CI/CD Pipeline Implementation

### Pipeline Architecture

**Overall Grade: A+** - Automated pipelines prevent human error and accelerate delivery.

**Why Automated CI/CD:**
- Consistent build and deployment process
- Catches errors before production
- Enables frequent deployments
- Reduces manual work and human error
- Provides audit trail
- Enables rollback capabilities

**Pipeline Stages:**
1. **Code Quality**: Linting and type checking
2. **Unit Tests**: Fast feedback on logic errors
3. **Build**: Compile and bundle application
4. **Integration Tests**: API and database testing
5. **Security Scan**: Dependency vulnerabilities
6. **Build Docker Image**: Create deployment artifact
7. **Deploy to Staging**: Automatic deployment
8. **E2E Tests**: Validate in staging environment
9. **Deploy to Production**: Manual approval gate

### GitHub Actions Implementation

**Overall Grade: A+** - GitHub Actions provides seamless integration and free minutes.

**Why GitHub Actions:**
- Built into GitHub (no separate service)
- Free for public repos, generous for private
- Extensive marketplace of actions
- YAML-based configuration
- Parallel job execution
- Matrix builds for multiple environments

**Workflow Structure:**
- Trigger on push to main/develop branches
- Trigger on pull requests
- Run tests in parallel across Node versions
- Cache dependencies for faster builds
- Upload artifacts between jobs
- Deploy only after all tests pass

**Secrets Management:**
- Store secrets in repository settings
- Encrypt secrets automatically
- Access via secrets context
- Never log secrets
- Rotate secrets regularly

**Caching Strategy:**
- Cache node_modules by package-lock.json hash
- Reduces dependency install from minutes to seconds
- Cache Docker layers for faster builds
- Invalidate cache on dependency changes
- Monitor cache hit rates

**Best Practices:**
- ✅ Run tests before deployment
- ✅ Use matrix builds for multiple environments
- ✅ Cache dependencies aggressively
- ✅ Fail fast on critical errors
- ✅ Store test results as artifacts
- ✅ Send notifications on failures
- ❌ Never commit secrets to workflows
- ❌ Don't skip tests to speed up pipeline
- ❌ Avoid running untrusted code in workflows

### GitLab CI Alternative

**Overall Grade: A** - GitLab CI provides complete DevOps platform.

**Why GitLab CI:**
- Integrated with GitLab repositories
- Built-in container registry
- GitLab Pages for documentation
- Self-hosted GitLab Runners
- Complete DevOps lifecycle

**Pipeline Configuration:**
- .gitlab-ci.yml defines stages
- Stages run sequentially
- Jobs within stage run parallel
- Artifacts pass between stages
- Deploy to self-hosted infrastructure

**GitLab Runner Setup:**
- Self-hosted for complete control
- Docker executor for isolated builds
- Shell executor for deployment
- Register runners with GitLab instance
- Scale runners horizontally

## Process Management with PM2

### Why PM2

**Overall Grade: A+** - PM2 provides production-grade process management.

**PM2 Benefits:**
- Automatic restarts on crashes
- Zero-downtime reloads
- Cluster mode for multi-core utilization
- Log management and rotation
- Process monitoring built-in
- Load balancing across workers

**When to Use PM2:**
- Production Node.js applications
- Self-hosted infrastructure
- Multi-core server utilization
- Process monitoring requirements
- Not needed with Docker orchestrators (Kubernetes, Swarm)

### PM2 Cluster Mode

**Overall Grade: A+** - Cluster mode maximizes CPU utilization.

**Why Cluster Mode:**
- Spawns workers across all CPU cores
- Built-in load balancing between workers
- Zero-downtime reloads (rolling restart)
- Automatic worker restart on crashes
- Increases throughput significantly

**Worker Management:**
- Spawn one worker per CPU core (default: max)
- Set max memory per worker
- Workers share same port (PM2 load balances)
- Independent worker lifecycle
- Graceful worker shutdown

**Zero-Downtime Reload:**
- Start new workers with updated code
- Wait for workers to signal ready
- Gracefully shutdown old workers
- No dropped connections
- Rollback if new workers fail

**Staged Startup:**
- Workers connect to database before accepting traffic
- Call process.send('ready') when initialized
- PM2 waits for ready signal before routing traffic
- Prevents failed requests during startup
- Implements graceful initialization

**Best Practices:**
- ✅ Use cluster mode in production
- ✅ Set memory limits per worker
- ✅ Implement ready signal (wait_ready)
- ✅ Use ecosystem.config.js for configuration
- ✅ Enable log rotation
- ✅ Monitor worker restarts
- ❌ Don't use fork mode in production
- ❌ Avoid storing state in workers (use Redis)

### PM2 Configuration

**Ecosystem File:**
- Define all application settings
- Separate configurations per environment
- Manage multiple applications
- Version control configuration
- Simplifies deployment commands

**Log Management:**
- Separate log files per application
- Automatic log rotation by size/date
- Configurable retention period
- Merge logs from all workers
- Stream logs to external service

**Monitoring Integration:**
- PM2 Plus for cloud monitoring (optional)
- Custom monitoring via PM2 API
- Metrics collection (CPU, memory, restarts)
- Alert on high restart rates
- Track application performance

## Reverse Proxy Configuration

### Reverse Proxy Selection

**Overall Grade: A+** - Reverse proxies provide essential production capabilities.

**Why Reverse Proxy:**
- TLS termination
- Load balancing
- Static file serving
- Request rate limiting
- Compression (gzip/brotli)
- Caching layer

**Caddy vs Nginx:**

**Caddy Benefits:**
- Automatic HTTPS with Let's Encrypt
- Zero configuration for simple cases
- Modern, developer-friendly syntax
- Automatic certificate renewal
- Three-line configuration files

**Nginx Benefits:**
- More granular control
- Battle-tested at massive scale
- Extensive module ecosystem
- Better documentation and community
- More complex configuration syntax

**Choose Caddy When:**
- Simple deployment requirements
- Want automatic HTTPS with zero config
- Prefer modern, clean configuration
- Don't need advanced features
- Rapid deployment priority

**Choose Nginx When:**
- Need advanced configuration options
- Require specific modules
- Team familiar with Nginx
- Complex routing requirements
- Large-scale deployment

### Reverse Proxy Configuration

**TLS Termination:**
- Handle HTTPS at reverse proxy
- Backend services use HTTP internally
- Reduces TLS overhead on application
- Centralized certificate management
- Automatic renewal with ACME protocol

**Load Balancing:**
- Distribute requests across multiple backend instances
- Round-robin, least connections, IP hash strategies
- Health checks before routing traffic
- Automatic removal of unhealthy backends
- Session affinity if needed (prefer stateless)

**Static File Serving:**
- Serve static assets directly from reverse proxy
- Faster than application server
- Reduce application server load
- Set far-future cache headers
- Compress before sending

**HTTP/2 Support:**
- Enable HTTP/2 for multiplexing
- Reduces latency for resource-heavy pages
- Automatic in modern reverse proxies
- Requires HTTPS
- Significant performance improvement

**Best Practices:**
- ✅ Enable TLS 1.2 minimum (TLS 1.3 preferred)
- ✅ Use strong cipher suites
- ✅ Enable HTTP/2
- ✅ Implement rate limiting
- ✅ Configure compression (gzip/brotli)
- ✅ Set security headers
- ❌ Never expose backend directly to internet
- ❌ Don't disable TLS verification

## Deployment Strategies

### Rolling Deployment

**Overall Grade: A** - Rolling deployments balance simplicity and safety.

**How Rolling Deployment Works:**
1. Deploy to first instance
2. Health check new instance
3. Route traffic to new instance
4. Repeat for remaining instances
5. All instances updated gradually

**Benefits:**
- Zero downtime during deployment
- Gradual rollout reduces risk
- Easy to automate
- No additional infrastructure required
- Works with existing setup

**Limitations:**
- Both versions run simultaneously (compatibility required)
- Slower than blue-green (sequential updates)
- Difficult to test new version in isolation
- Rollback requires reverse rolling update

**When to Use:**
- Standard deployments
- Backward-compatible changes
- Limited infrastructure resources
- Microservices architecture

### Blue-Green Deployment

**Overall Grade: A+** - Blue-green deployments enable instant rollback.

**How Blue-Green Deployment Works:**
1. Blue environment serves production traffic
2. Deploy new version to green environment
3. Test green environment thoroughly
4. Switch load balancer to green
5. Blue becomes standby (instant rollback)

**Benefits:**
- Instant rollback (switch back to blue)
- Test production environment before switch
- Zero downtime during deployment
- Clear separation between versions
- Full traffic cutover (not gradual)

**Requirements:**
- Two complete production environments
- Load balancer to switch traffic
- Database migrations compatible with both versions
- Double infrastructure cost temporarily
- Automated health checking

**Database Considerations:**
- Migrations must support both versions during transition
- Use expand/contract pattern for schema changes
- Test with both application versions
- Plan migration strategy carefully
- Consider data synchronization

**When to Use:**
- High-risk deployments
- Major version updates
- Database schema changes
- Need instant rollback capability
- Have infrastructure capacity

### Canary Deployment

**Overall Grade: A** - Canary deployments minimize blast radius of bugs.

**How Canary Deployment Works:**
1. Deploy new version to small subset (5-10%)
2. Monitor metrics closely
3. Gradually increase traffic to new version
4. Roll back if issues detected
5. Complete rollout if successful

**Benefits:**
- Limits impact of bugs (only 5-10% affected)
- Real-world testing with production traffic
- Gradual confidence building
- Metrics-driven decisions
- Easy rollback

**Requirements:**
- Advanced load balancer (traffic splitting)
- Comprehensive monitoring
- Automated rollback triggers
- Clear success criteria
- Multiple backend instances

**When to Use:**
- High-traffic applications
- Critical deployments
- User-facing changes
- A/B testing requirements
- Risk-averse organizations

## Infrastructure Setup

### Self-Hosted Infrastructure

**Overall Grade: A** - Self-hosting provides maximum control and cost efficiency.

**Why Self-Hosted:**
- Complete control over infrastructure
- No vendor lock-in
- Predictable costs (no usage-based pricing)
- Data sovereignty and privacy
- Learning opportunity

**Infrastructure Components:**
- Virtual Private Server (VPS) or dedicated server
- Docker and Docker Compose
- Reverse proxy (Caddy or Nginx)
- PostgreSQL database
- Redis cache
- Monitoring stack (Prometheus, Grafana)

**VPS Provider Selection:**
- DigitalOcean: Developer-friendly, good documentation
- Hetzner: Best price/performance ratio in Europe
- Linode: Solid features, competitive pricing
- Vultr: Global locations, good performance
- OVH: Budget-friendly, European data centers

**Server Sizing:**
- Start small: 2 vCPU, 4GB RAM ($20-40/month)
- Monitor resource usage
- Scale vertically when needed
- Consider horizontal scaling for traffic growth
- Database on separate server for production

### Environment Configuration

**Environment Separation:**
- **Development**: Local machine or dev server
- **Staging**: Production-like for testing
- **Production**: Live user-facing environment

**Configuration Management:**
- Environment-specific .env files
- Never commit production secrets
- Use secrets management service in production
- Validate configuration on startup
- Document all required variables

**Environment Parity:**
- Keep staging similar to production
- Same software versions
- Similar data volumes (sanitized production data)
- Same deployment process
- Test in staging before production

**Best Practices:**
- ✅ Separate environments clearly
- ✅ Use staging for final validation
- ✅ Keep environments in sync (versions)
- ✅ Use infrastructure as code
- ✅ Document environment differences
- ❌ Never test directly in production
- ❌ Don't skip staging deployments
- ❌ Avoid divergent configurations

## Health Checks and Monitoring

### Health Check Implementation

**Overall Grade: A+** - Health checks enable automatic recovery and zero-downtime deployments.

**Why Health Checks:**
- Automatic detection of unhealthy instances
- Remove failing instances from load balancer
- Prevent requests to initializing services
- Enable zero-downtime deployments
- Support auto-scaling decisions

**Health Check Endpoints:**
- **/health**: Basic liveness check (is process running?)
- **/health/ready**: Readiness check (can handle traffic?)
- **/health/live**: Detailed health status

**Liveness Check:**
- Returns 200 if application is running
- Fast response (< 100ms)
- Minimal dependencies checked
- Used by orchestrators for restart decisions
- Should almost always succeed

**Readiness Check:**
- Returns 200 if ready to accept traffic
- Checks critical dependencies (database, Redis)
- Used by load balancers for routing decisions
- Can temporarily return 503 (not ready)
- More comprehensive than liveness

**Check Implementation:**
- Test database connectivity
- Verify Redis connection
- Check external API availability
- Validate configuration loaded
- Return appropriate status codes

**Best Practices:**
- ✅ Implement both liveness and readiness checks
- ✅ Keep checks lightweight (< 1 second)
- ✅ Check critical dependencies only
- ✅ Return proper status codes (200, 503)
- ✅ Log health check failures
- ❌ Don't perform expensive operations
- ❌ Avoid cascading failures from checks

### Startup and Shutdown Procedures

**Graceful Startup:**
- Load configuration and validate
- Connect to database and Redis
- Run database migrations (if needed)
- Warm up caches
- Signal ready to accept traffic
- Begin accepting connections

**Graceful Shutdown:**
- Stop accepting new connections
- Complete in-flight requests (timeout: 30s)
- Close database connections
- Flush logs and metrics
- Exit cleanly
- Signal shutdown complete

**Signal Handling:**
- SIGTERM: Graceful shutdown request
- SIGINT: Interrupt (Ctrl+C)
- SIGKILL: Immediate termination (cannot catch)
- Handle signals appropriately
- Implement timeout for forced shutdown

## Backup and Disaster Recovery

### Backup Strategy

**Overall Grade: A+** - Regular backups prevent catastrophic data loss.

**Backup Requirements:**
- Automated daily backups
- Offsite storage in different region
- Encrypted backups
- Tested restore procedures
- Documented recovery steps

**What to Backup:**
- Database (PostgreSQL dumps)
- Redis data (if persistent)
- User-uploaded files
- Application configuration
- Docker images (optional)
- SSL certificates

**Backup Testing:**
- Test restore quarterly
- Verify backup integrity
- Measure restore time (RTO)
- Document restore procedure
- Practice disaster recovery drills

**Retention Policy:**
- Daily backups: 30 days
- Weekly backups: 3 months
- Monthly backups: 1 year
- Comply with legal requirements
- Balance storage costs vs retention

### Disaster Recovery Plan

**Recovery Time Objective (RTO):**
- Target: 4 hours maximum downtime
- Measured from incident to full recovery
- Includes detection, decision, and restoration time
- Test regularly to validate RTO
- Document steps to meet target

**Recovery Point Objective (RPO):**
- Target: 24 hours maximum data loss
- Determined by backup frequency
- Daily backups = 24-hour RPO
- More frequent backups reduce RPO
- Balance cost vs acceptable data loss

**Disaster Scenarios:**
- Server failure: Restore to new server from backup
- Database corruption: Restore from last clean backup
- Regional outage: Failover to backup region
- Ransomware: Restore from offline backups
- Accidental deletion: Point-in-time recovery

**Communication Plan:**
- Notify stakeholders of incident
- Regular status updates during recovery
- Post-mortem after resolution
- Document lessons learned
- Update procedures based on experience

## Deployment Checklist

### Pre-Deployment

- [ ] All tests pass in CI/CD
- [ ] Code reviewed and approved
- [ ] Database migrations tested in staging
- [ ] Environment variables configured
- [ ] Secrets updated in vault
- [ ] Monitoring alerts configured
- [ ] Backup verified within 24 hours
- [ ] Rollback procedure documented
- [ ] Stakeholders notified of deployment window

### Deployment Execution

- [ ] Deploy to staging first
- [ ] Run smoke tests in staging
- [ ] Monitor staging for 15+ minutes
- [ ] Deploy to production (rolling/blue-green)
- [ ] Verify health checks passing
- [ ] Monitor error rates and metrics
- [ ] Test critical user journeys
- [ ] Verify database migrations applied
- [ ] Check logs for errors

### Post-Deployment

- [ ] Monitor for 1 hour after deployment
- [ ] Verify no error rate increase
- [ ] Check performance metrics
- [ ] Confirm user-reported issues (none expected)
- [ ] Update deployment documentation
- [ ] Notify stakeholders of completion
- [ ] Tag release in version control
- [ ] Update changelog

### Rollback Procedure

- [ ] Identify rollback trigger (errors, performance)
- [ ] Stop new deployments immediately
- [ ] Initiate rollback procedure
- [ ] Verify health checks after rollback
- [ ] Monitor error rates normalize
- [ ] Investigate root cause
- [ ] Document incident
- [ ] Plan fix for next deployment

## Recommended DevOps Grade: A+

**Strengths:**
- ✅ Docker containerization for consistency
- ✅ Automated CI/CD pipelines
- ✅ Zero-downtime deployment strategies
- ✅ Process management with PM2 cluster mode
- ✅ Comprehensive health checks
- ✅ Automated backup systems
- ✅ Self-hosted infrastructure control

**Critical Requirements:**
- Implement zero-downtime deployments
- Test in staging before production
- Configure health checks for all services
- Automate backups and test restores
- Monitor deployments for 1 hour minimum
- Document rollback procedures
- Use Docker for all environments
- Implement graceful shutdown handling
- Never skip staging deployments
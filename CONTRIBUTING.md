# Contributing Guide

Thank you for contributing to the BOH Event Management Platform!

## Development Workflow

### 1. Setting Up Your Environment

```bash
# Clone and install
git clone <repository-url>
cd boh-api
make install

# Start services
make docker-up

# Setup database
make db-setup

# Start development server
make dev
```

### 2. Making Changes

Follow Clean Architecture principles:

```
1. Start with Domain Layer (entities, repositories)
2. Create Application Layer (DTOs, services)
3. Implement Infrastructure Layer (repositories, external services)
4. Add Presentation Layer (controllers)
```

### 3. Code Style

We use ESLint and Prettier for code quality:

```bash
# Format code
make format

# Check linting
make lint

# Auto-fix issues
npm run lint -- --fix
```

## Clean Architecture Guidelines

### Domain Layer Rules

✅ **DO:**
- Create pure TypeScript classes
- Keep business logic in entities
- Define repository interfaces
- Add business validation

❌ **DON'T:**
- Import NestJS decorators
- Use Prisma models
- Access external services
- Import infrastructure code

**Example:**

```typescript
// ✅ Good
export class Event {
  constructor(
    public readonly id: string,
    public title: string,
    // ...
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
  }

  publish(): void {
    if (this.status !== EventStatus.DRAFT) {
      throw new Error('Only draft events can be published');
    }
    this.status = EventStatus.PUBLISHED;
  }
}
```

### Application Layer Rules

✅ **DO:**
- Create DTOs with validation decorators
- Orchestrate business operations in services
- Transform data between layers
- Handle application-specific logic

❌ **DON'T:**
- Put business logic in services
- Access database directly
- Handle HTTP concerns
- Import controllers

**Example:**

```typescript
// ✅ Good - DTO
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEmail()
  email: string;
}

// ✅ Good - Service
@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    const event = new Event(
      uuidv4(),
      dto.title,
      // ...
    );
    return this.eventRepository.create(event);
  }
}
```

### Infrastructure Layer Rules

✅ **DO:**
- Implement repository interfaces
- Handle database operations
- Integrate external services
- Manage configuration

❌ **DON'T:**
- Put business logic here
- Export Prisma models
- Handle HTTP requests

**Example:**

```typescript
// ✅ Good
@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(event: Event): Promise<Event> {
    const created = await this.prisma.event.create({
      data: {
        id: event.id,
        title: event.title,
        // ...
      },
    });
    return this.toDomain(created);
  }

  private toDomain(prismaEvent: any): Event {
    return new Event(
      prismaEvent.id,
      prismaEvent.title,
      // ...
    );
  }
}
```

### Presentation Layer Rules

✅ **DO:**
- Handle HTTP requests/responses
- Apply guards and decorators
- Validate input with DTOs
- Return formatted responses

❌ **DON'T:**
- Put business logic in controllers
- Access database directly
- Handle complex transformations

**Example:**

```typescript
// ✅ Good
@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  async create(@Body() dto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(dto, user.id);
  }
}
```

## Adding a New Module

### Step 1: Create Structure

```bash
mkdir -p src/modulename/{domain,application,infrastructure,presentation}
```

### Step 2: Domain Layer

```typescript
// src/modulename/domain/entities/modulename.entity.ts
export class ModuleName {
  constructor(
    public readonly id: string,
    // properties
  ) {
    this.validate();
  }

  private validate(): void {
    // validation logic
  }
}

// src/modulename/domain/repositories/modulename.repository.interface.ts
export interface IModuleNameRepository {
  findById(id: string): Promise<ModuleName | null>;
  // other methods
}
export const MODULE_NAME_REPOSITORY = Symbol('MODULE_NAME_REPOSITORY');
```

### Step 3: Application Layer

```typescript
// src/modulename/application/dtos/create-modulename.dto.ts
export class CreateModuleNameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

// src/modulename/application/services/modulename.service.ts
@Injectable()
export class ModuleNameService {
  constructor(private readonly prisma: PrismaService) {}
  // service methods
}
```

### Step 4: Infrastructure Layer

```typescript
// src/modulename/infrastructure/repositories/modulename.repository.ts
@Injectable()
export class ModuleNameRepository implements IModuleNameRepository {
  constructor(private readonly prisma: PrismaService) {}
  // implement interface
}
```

### Step 5: Presentation Layer

```typescript
// src/modulename/presentation/controllers/modulename.controller.ts
@Controller('api/v1/modulename')
export class ModuleNameController {
  constructor(private readonly service: ModuleNameService) {}
  // controller methods
}
```

### Step 6: Create Module

```typescript
// src/modulename/modulename.module.ts
@Module({
  imports: [DatabaseModule],
  controllers: [ModuleNameController],
  providers: [ModuleNameService],
  exports: [ModuleNameService],
})
export class ModuleNameModule {}
```

### Step 7: Register in App Module

```typescript
// src/app.module.ts
@Module({
  imports: [
    // ...
    ModuleNameModule,
  ],
})
export class AppModule {}
```

## Database Changes

### Creating a Migration

```bash
# 1. Update schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_feature

# 3. Generate Prisma Client
npx prisma generate
```

### Migration Best Practices

- ✅ Name migrations descriptively
- ✅ Test migrations in development first
- ✅ Review generated SQL
- ✅ Update seed script if needed
- ❌ Never edit applied migrations
- ❌ Don't skip migration reviews

## Testing

### Unit Tests

```typescript
describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
  });

  it('should create an event', async () => {
    // test implementation
  });
});
```

### E2E Tests

```typescript
describe('Events (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1/events (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/events')
      .expect(200);
  });
});
```

## Commit Guidelines

Use conventional commits:

```
feat: add user profile endpoint
fix: resolve authentication token expiry issue
docs: update API documentation
refactor: improve event repository
test: add unit tests for auth service
chore: update dependencies
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following architecture guidelines
3. Add tests for new features
4. Run linter: `make lint`
5. Run tests: `make test`
6. Commit with conventional commits
7. Push and create pull request
8. Wait for review and CI checks

## Common Tasks

### Adding a New Endpoint

1. Create DTO in `application/dtos/`
2. Add method to service in `application/services/`
3. Add route to controller in `presentation/controllers/`
4. Add guards/decorators as needed
5. Test the endpoint

### Adding Authentication to Route

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute(@CurrentUser() user: any) {
  return { user };
}
```

### Adding Role-Based Access

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Delete(':id')
async delete(@Param('id') id: string) {
  await this.service.delete(id);
}
```

### Making Endpoints Public

```typescript
@Public()
@Get()
async publicRoute() {
  return { message: 'This is public' };
}
```

## Troubleshooting

### Prisma Client Out of Sync

```bash
npx prisma generate
```

### Database Connection Issues

```bash
# Restart Docker services
make restart

# Check logs
make docker-logs
```

### TypeScript Errors

```bash
# Rebuild
make clean
make install
make build
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Questions?

- Check existing code examples
- Review architecture documentation in `/context`
- Ask in team chat
- Create an issue for bugs

## License

Proprietary - All rights reserved

---

Thank you for contributing! 🎉

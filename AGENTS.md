# AI Agent Instructions for Node.js Express Application

## Project Overview
This is a Node.js Express application built with TypeScript following Clean Code and SOLID principles. The application uses Sequelize ORM for database operations, Zod for data validation, and Jest for testing.

## Architecture & Structure

### Core Technologies
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Sequelize ORM (supports PostgreSQL, MySQL, SQLite)
- **Validation**: Zod schemas
- **Testing**: Jest with Supertest for API testing
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

### Standard File Structure
```
src/
├── controllers/          # Route handlers (Dependency Injection)
├── services/            # Business logic layer
├── repositories/        # Data access layer (Repository pattern)
├── models/             # Sequelize models and associations
├── schemas/            # Zod validation schemas
├── middleware/         # Express middleware (auth, validation, error handling)
├── routes/             # Route definitions
├── config/             # Database, environment, and app configuration
├── utils/              # Helper functions and utilities
├── types/              # TypeScript type definitions
└── app.ts              # Express app configuration
tests/
├── unit/               # Unit tests for services and utilities
├── integration/        # Integration tests for repositories
└── e2e/                # End-to-end API tests
```

## Development Guidelines

### Clean Code & SOLID Principles

**Single Responsibility Principle (SRP)**
- Controllers: Handle HTTP requests/responses only
- Services: Contain business logic
- Repositories: Handle data persistence
- Models: Define data structure and relationships

**Open/Closed Principle (OCP)**
- Use interfaces for services and repositories
- Implement dependency injection for extensibility

**Liskov Substitution Principle (LSP)**
- Use abstract classes or interfaces for data access
- Ensure implementations are interchangeable

**Interface Segregation Principle (ISP)**
- Create specific interfaces for different functionalities
- Avoid fat interfaces with unused methods

**Dependency Inversion Principle (DIP)**
- Depend on abstractions, not concretions
- Use dependency injection containers

### Code Patterns & Conventions

#### Controller Pattern
```typescript
// controllers/UserController.ts
export class UserController {
  constructor(private userService: IUserService) {}
  
  async create(req: Request, res: Response): Promise<void> {
    const validatedData = CreateUserSchema.parse(req.body);
    const user = await this.userService.createUser(validatedData);
    res.status(201).json(user);
  }
}
```

#### Service Layer Pattern
```typescript
// services/UserService.ts
export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}
  
  async createUser(userData: CreateUserDto): Promise<User> {
    // Business logic here
    return this.userRepository.create(userData);
  }
}
```

#### Repository Pattern
```typescript
// repositories/UserRepository.ts
export class UserRepository implements IUserRepository {
  async create(userData: CreateUserDto): Promise<User> {
    return User.create(userData);
  }
  
  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }
}
```

#### Zod Validation Schemas
```typescript
// schemas/UserSchema.ts
export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().min(18).max(120)
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

#### Sequelize Model Definition
```typescript
// models/User.ts
@Table({ tableName: 'users' })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string;
}
```

### Middleware Implementation

#### Validation Middleware
```typescript
// middleware/validation.ts
export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  };
};
```

#### Error Handling Middleware
```typescript
// middleware/errorHandler.ts
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
};
```

### Testing Patterns

#### Unit Tests (Jest)
```typescript
// tests/unit/UserService.test.ts
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    
    userService = new UserService(mockUserRepository);
  });

  it('should create user successfully', async () => {
    const userData = { email: 'test@example.com', name: 'John' };
    mockUserRepository.create.mockResolvedValue(userData as User);
    
    const result = await userService.createUser(userData);
    
    expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(userData);
  });
});
```

#### E2E Tests (Supertest)
```typescript
// tests/e2e/users.test.ts
describe('Users API', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('POST /users should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'John Doe',
      age: 25
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body.email).toBe(userData.email);
  });
});
```

## Database & Configuration

### Sequelize Configuration
```typescript
// config/database.ts
export const databaseConfig = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }
};
```

### Environment Configuration
```typescript
// config/env.ts
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  database: databaseConfig[process.env.NODE_ENV || 'development']
};
```

## Development Workflow

### Essential Commands
```bash
# Development
npm run dev              # Start development server with hot reload
npm run build           # Build TypeScript to JavaScript
npm run start           # Start production server

# Testing
npm test               # Run all tests
npm run test:unit      # Run unit tests only
npm run test:e2e       # Run end-to-end tests
npm run test:coverage  # Generate test coverage report

# Database
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with test data
npm run db:reset       # Reset database (drop, create, migrate, seed)

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run type-check     # Run TypeScript compiler checks
```

### Git Hooks (Husky)
- **pre-commit**: Runs lint, format, and type-check
- **pre-push**: Runs full test suite

## Key Conventions

1. **Error Handling**: Use custom error classes extending base Error
2. **API Responses**: Standardized JSON response format with status, data, and error fields
3. **Logging**: Use structured logging (Winston) with appropriate log levels
4. **Security**: Implement helmet, cors, rate limiting, and input sanitization
5. **Documentation**: Use JSDoc for functions and OpenAPI/Swagger for API documentation
6. **Environment Variables**: Validate with Zod schemas in config files
7. **Database Migrations**: Version controlled, reversible, and environment-specific
8. **Dependency Injection**: Use a DI container (e.g., tsyringe) for better testability

## AI Assistant Guidelines

When working on this codebase:

1. **Always validate inputs** with Zod schemas before processing
2. **Follow the layered architecture** - don't put business logic in controllers
3. **Write tests first** for new features (TDD approach)
4. **Use TypeScript strictly** - enable strict mode and avoid `any` types
5. **Implement proper error handling** at each layer
6. **Follow SOLID principles** - especially SRP and DIP
7. **Use async/await** consistently, avoid callback hell
8. **Implement proper logging** for debugging and monitoring
9. **Document complex business logic** with clear comments
10. **Ensure database transactions** for multi-step operations

## Common Pitfalls to Avoid

- Don't put business logic in controllers or models
- Don't forget to validate user input at API boundaries
- Don't ignore error handling in async operations
- Don't create tight coupling between layers
- Don't skip writing tests for new functionality
- Don't use synchronous operations for I/O
- Don't expose sensitive data in API responses
- Don't forget to handle database connection errors
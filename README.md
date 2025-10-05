# Node.js Express TypeScript Application

A production-ready Node.js Express application built with TypeScript, following Clean Code and SOLID principles.

## Features

- ✅ **TypeScript** - Type safety and modern JavaScript features
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Sequelize ORM** - Database abstraction with TypeScript support
- ✅ **Zod** - Runtime type validation
- ✅ **Dependency Injection** - Using tsyringe for better testability
- ✅ **Clean Architecture** - Separation of concerns with layers
- ✅ **SOLID Principles** - Maintainable and scalable code
- ✅ **Testing** - Unit and E2E tests with Jest
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Logging** - Structured logging with Winston
- ✅ **Code Quality** - ESLint, Prettier, Husky pre-commit hooks

## Project Structure

```
src/
├── controllers/          # Route handlers (HTTP layer)
├── services/            # Business logic layer
├── repositories/        # Data access layer
├── models/             # Sequelize models
├── schemas/            # Zod validation schemas
├── middleware/         # Express middleware
├── routes/             # Route definitions
├── config/             # Configuration files
├── utils/              # Helper functions
└── types/              # TypeScript type definitions

tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
└── e2e/                # End-to-end tests
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (or SQLite for development)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd copilot-agents-config
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run the application
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Testing
- `npm test` - Run all tests with coverage
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:watch` - Run tests in watch mode

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript compiler checks

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:migrate:undo` - Undo last migration
- `npm run db:seed` - Seed database with test data
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

## API Endpoints

### Users

- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check

- `GET /api/health` - API health check

## Example Usage

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "age": 25
  }'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

### Get User by ID
```bash
curl http://localhost:3000/api/users/{user-id}
```

### Update User
```bash
curl -X PUT http://localhost:3000/api/users/{user-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "age": 30
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/{user-id}
```

## Architecture Principles

### Clean Code
- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

### Layer Structure
1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Contain business logic
3. **Repositories** - Handle data persistence
4. **Models** - Define data structure

### Dependency Injection
Using `tsyringe` for dependency injection to improve testability and maintainability.

## Testing Strategy

- **Unit Tests** - Test individual components in isolation
- **Integration Tests** - Test interaction between components
- **E2E Tests** - Test complete user flows

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

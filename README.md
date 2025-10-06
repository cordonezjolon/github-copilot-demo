# Node.js Express TypeScript Application

A production-ready Node.js Express application built with TypeScript, following Clean Code and SOLID principles.

## Features

- ✅ **TypeScript** - Type safety and modern JavaScript features
- ✅ **Express.js** - Fast, unopinionated web framework
- ✅ **Sequelize ORM** - Database abstraction with TypeScript support
- ✅ **Zod** - Runtime type validation
- ✅ **Doppler** - Optional centralized secrets management (with .env fallback)
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

**Option A: Using Traditional .env (Default)**
```bash
cp .env.example .env
# Edit .env with your configuration
```

**Option B: Using Doppler (Recommended for Teams)**
```bash
# Install Doppler CLI: https://docs.doppler.com/docs/install-cli
doppler login
doppler setup

# Run with Doppler
doppler run -- npm run dev
```

**Option C: Using Doppler Service Token**
```bash
cp .env.doppler.example .env
# Edit .env with your Doppler service token
# Set DOPPLER_ENABLED=true and add your token
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

## 🔐 Doppler Secrets Management

This application supports [Doppler](https://www.doppler.com/) for centralized secrets management, providing enhanced security and team collaboration.

### Why Use Doppler?

- 🔒 **Centralized secrets** across all environments
- 🔄 **Automatic secret rotation** and audit trails
- 👥 **Team collaboration** with fine-grained access controls
- 🚫 **No secrets in git** - never accidentally commit sensitive data
- 🔍 **Compliance ready** with full audit logs

### Getting Started with Doppler

#### 1. Install Doppler CLI

```bash
# macOS
brew install dopplerhq/tap/doppler

# Linux
wget -q -O - https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key | sudo apt-key add -
echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | sudo tee /etc/apt/sources.list.d/doppler-cli.list
sudo apt-get update && sudo apt-get install doppler

# Other platforms: https://docs.doppler.com/docs/install-cli
```

#### 2. Authenticate

```bash
doppler login
```

#### 3. Set Up Your Project

```bash
# Initialize in your project directory
cd your-project
doppler setup

# Select or create project
# Choose environment (dev, staging, prod)
```

#### 4. Run Your Application

```bash
# Development with Doppler
doppler run -- npm run dev

# Or pass secrets to any command
doppler run -- npm test
```

### Alternative: Service Tokens

For CI/CD or environments without interactive CLI:

```bash
# Get a service token from Doppler dashboard
# Add to your .env file:
DOPPLER_ENABLED=true
DOPPLER_TOKEN=<your-doppler-service-token>
DOPPLER_PROJECT=<your-project-name>
DOPPLER_CONFIG=<your-config>

# Run normally
npm run dev
```

### Backward Compatibility

Doppler is **optional** and **disabled by default**. The application works perfectly with traditional `.env` files:

```bash
# Without Doppler (default behavior)
cp .env.example .env
npm run dev
```

### Configuration Priority

The application loads configuration in this order:
1. **Doppler secrets** (if `DOPPLER_ENABLED=true`)
2. **Environment variables** (process.env)
3. **Default values** (from Zod schemas)

### Migrating from .env to Doppler

```bash
# 1. Create Doppler project
doppler projects create your-project-name

# 2. Upload your existing secrets
cat .env | doppler secrets upload

# 3. Verify secrets
doppler secrets

# 4. Start using Doppler
doppler run -- npm run dev
```

### Best Practices

1. **Never commit** `.env` files with real secrets
2. **Use service tokens** in CI/CD, not personal tokens
3. **Separate environments** (dev, staging, prod) in Doppler
4. **Rotate secrets regularly** using Doppler's rotation features
5. **Review audit logs** periodically for security compliance

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

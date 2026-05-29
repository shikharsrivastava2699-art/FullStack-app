# Backend Code Review Guidelines & Best Practices

## Overview
This document outlines the code review standards and best practices for backend development. Use this as a reference during code reviews to ensure consistency, quality, maintainability, and reliability across the backend services.

---

## 1. Project Structure & Organization

### Folder Structure
- **Layered Architecture**: Separate concerns into distinct layers
  ```
  src/
    config/          # Configuration files
    controllers/     # Request handlers
    services/        # Business logic
    repositories/    # Data access layer
    models/          # Data models/schemas
    middlewares/     # Express middlewares
    routes/          # API route definitions
    utils/           # Utility functions
    types/           # TypeScript types/interfaces
    errors/          # Custom error classes
    tests/           # Test files
    index.ts         # Entry point
  ```

### Naming Conventions
- Files: camelCase or kebab-case (consistent throughout project)
- Classes: PascalCase (`UserController`, `DatabaseService`)
- Functions: camelCase (`getUserById`, `validateEmail`)
- Constants: UPPER_SNAKE_CASE (`DB_HOST`, `MAX_RETRIES`)
- Interfaces: PascalCase with `I` prefix or no prefix (`IUser` or `User`)
- Enums: PascalCase (`UserRole`, `RequestStatus`)

---

## 2. TypeScript Best Practices

### Type Safety
- **Strict Mode**: Enable `strict: true` in tsconfig.json
- **No `any`**: Always define specific types; use `unknown` if uncertain
- **Explicit Returns**: All functions must have explicit return type annotations
- **Interfaces for Models**:
  ```typescript
  interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
  }
  
  interface CreateUserDTO {
    email: string;
    name: string;
    password: string;
  }
  ```

### Type Organization
- **DTOs (Data Transfer Objects)**: For API request/response validation
- **Domain Models**: For business logic representation
- **DB Models**: For database schema representation
- **Separate Request/Response Types**: Don't expose internal models directly

### Generics & Utility Types
- Use `Partial<T>`, `Pick<T>`, `Omit<T>` for type variations
- Define generic interfaces for reusable patterns
- Create utility types for common operations

---

## 3. API Design & Endpoints

### RESTful Principles
- **HTTP Methods**: Use appropriate verbs (GET, POST, PUT, DELETE, PATCH)
- **Status Codes**: Return correct codes (200, 201, 204, 400, 401, 403, 404, 500)
- **URL Patterns**: `/api/v1/resource` and `/api/v1/resource/:id`
- **Query Params**: For filtering, pagination, sorting (`?page=1&limit=10&sort=name`)

### Request/Response Format
- **Consistent Format**: 
  ```json
  {
    "success": true,
    "data": { /* payload */ },
    "error": null,
    "timestamp": "2026-05-29T10:00:00Z"
  }
  ```
- **Error Responses**:
  ```json
  {
    "success": false,
    "data": null,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid input",
      "details": []
    }
  }
  ```

### Versioning
- Use API versioning in URL (`/api/v1/...`)
- Maintain backward compatibility or document breaking changes
- Plan for deprecation of old API versions

---

## 4. Error Handling & Validation

### Error Strategy
- **Custom Error Classes**: Create specific error types
  ```typescript
  class ValidationError extends Error {
    constructor(message: string, public code: string) {
      super(message);
    }
  }
  ```
- **Try-Catch Usage**: Wrap async operations; catch specific errors first
- **Error Logging**: Log errors with context (user ID, request ID, stack trace)
- **User-Friendly Messages**: Don't expose system details in responses
- **Error Recovery**: Implement retry logic for transient failures

### Input Validation
- **Validate at Entry Point**: Validate request data immediately
- **Use Validation Library**: Consider `joi`, `zod`, or similar
- **Type Checking**: Leverage TypeScript for compile-time checks
- **Sanitization**: Clean/escape user input to prevent injection attacks

### Example Error Handler
```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    requestId: req.id,
  });

  const statusCode = err instanceof ValidationError ? 400 : 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
    },
  });
});
```

---

## 5. Database & Data Access

### Best Practices
- **Connection Pooling**: Use connection pools for databases
- **Prepared Statements**: Prevent SQL injection (use parameterized queries)
- **Transaction Handling**: Use transactions for multi-step operations
- **Indexes**: Add indexes on frequently queried columns
- **Query Optimization**: Use EXPLAIN to analyze slow queries
- **Migration System**: Version-control database schema changes

### Repository Pattern
```typescript
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### Data Validation
- Validate constraints at both application and database levels
- Use database constraints (NOT NULL, UNIQUE, FOREIGN KEY)
- Implement soft deletes for audit trails
- Keep audit logs for sensitive operations

---

## 6. Authentication & Authorization

### Security Standards
- **Password Hashing**: Use bcrypt or argon2; never store plaintext passwords
- **JWT Tokens**: For stateless authentication
  - Include expiration (`exp`)
  - Use strong secret keys
  - Include minimal claims (user ID, roles)
- **Refresh Tokens**: Store securely (HTTP-only cookies)
- **Session Management**: Clear sessions on logout

### Authorization
- **Role-Based Access Control (RBAC)**: Check user roles for sensitive operations
- **Middleware Guards**: Protect routes with auth middleware
- **Scope-Based Access**: Users access only their own data unless privileged
- **Audit Logs**: Log all sensitive operations

### Example Auth Middleware
```typescript
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

---

## 7. Logging & Monitoring

### Logging Strategy
- **Log Levels**: ERROR, WARN, INFO, DEBUG (use appropriately)
- **Structured Logging**: Log JSON objects for easy parsing
  ```typescript
  logger.info('User created', {
    userId: user.id,
    email: user.email,
    timestamp: new Date(),
    requestId: req.id,
  });
  ```
- **Request Tracking**: Include unique request ID in all logs
- **Performance Metrics**: Log request duration
- **Sensitive Data**: Never log passwords, tokens, or PII

### Monitoring
- **Health Checks**: Implement `/health` endpoint
- **Metrics**: Track request count, errors, response times
- **Alerts**: Set up alerts for errors, high latency
- **Uptime Tracking**: Monitor service availability

---

## 8. Performance Optimization

### Query Performance
- **N+1 Problem**: Use joins or batch loading, not loops
- **Pagination**: Limit results for large datasets
- **Caching**: Cache frequently accessed data (Redis)
- **Lazy Loading**: Load relationships only when needed

### API Performance
- **Compression**: Enable gzip compression
- **Rate Limiting**: Prevent abuse with rate limiters
- **Timeouts**: Set request timeouts
- **Load Balancing**: Distribute traffic across instances

### Code Performance
- **Avoid Blocking Operations**: Use async/await, not synchronous calls
- **Connection Pooling**: Reuse database connections
- **Memory Management**: Monitor heap usage; fix memory leaks
- **Profiling**: Use profilers to identify bottlenecks

---

## 9. Testing

### Test Coverage
- **Unit Tests**: Business logic and utilities (80%+ coverage)
- **Integration Tests**: Database operations and API endpoints
- **End-to-End Tests**: Complete user workflows
- **Error Cases**: Test error scenarios

### Testing Best Practices
- **Arrange-Act-Assert**: Follow AAA pattern
- **Isolated Tests**: Tests shouldn't depend on each other
- **Mock External Services**: Mock API calls, databases
- **Test Fixtures**: Use seed data for consistent tests
- **Async Handling**: Properly handle async operations in tests

### Example Unit Test
```typescript
describe('UserService', () => {
  it('should create a user with valid data', async () => {
    // Arrange
    const userData = { email: 'test@example.com', name: 'John' };
    
    // Act
    const user = await userService.create(userData);
    
    // Assert
    expect(user.email).toBe(userData.email);
    expect(user.id).toBeDefined();
  });
});
```

---

## 10. Middleware & Request Processing

### Common Middleware
- **Logging**: Log all requests and responses
- **Authentication**: Verify user identity
- **Authorization**: Check permissions
- **Validation**: Validate request data
- **Error Handling**: Catch and format errors
- **CORS**: Handle cross-origin requests
- **Rate Limiting**: Throttle requests per IP/user

### Middleware Order (Top to Bottom)
```typescript
app.use(express.json());
app.use(requestIdMiddleware);  // Generate request ID
app.use(loggingMiddleware);    // Log requests
app.use(cors());
app.use(rateLimitMiddleware);
app.use(authMiddleware);       // Authenticate
app.use(apiRoutes);
app.use(errorMiddleware);      // Handle errors
```

---

## 11. Environment & Configuration

### Configuration Management
- **Environment Variables**: Store sensitive config in `.env`
- **Config Files**: Separate dev, staging, production configs
- **Validation**: Validate required env vars on startup
- **No Secrets in Code**: Never commit API keys or passwords

### Example Config
```typescript
export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRY || '7d',
  },
};
```

---

## 12. Dependency Injection

### Best Practices
- **IoC Container**: Use dependency injection for loose coupling
- **Constructor Injection**: Inject dependencies via constructor
- **Service Locator**: Avoid; use proper DI instead
- **Testability**: Easier to mock dependencies

### Example DI Pattern
```typescript
class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const user = await this.userService.create(req.body);
      res.json(user);
    } catch (error) {
      this.logger.error('User creation failed', error);
      res.status(500).json({ error: 'Internal error' });
    }
  }
}
```

---

## 13. Documentation

### Required Documentation
- **API Documentation**: Document all endpoints (Swagger/OpenAPI)
- **Environment Setup**: README with setup instructions
- **Database Schema**: Document tables, relationships
- **Architecture Diagrams**: Show system design
- **JSDoc Comments**: For exported functions and classes

### Example JSDoc
```typescript
/**
 * Creates a new user
 * @param userData - User data to create
 * @returns Promise<User> - Created user
 * @throws ValidationError if data is invalid
 */
export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  // ...
};
```

---

## 14. Code Review Checklist

### Before Submitting PR
- [ ] Code compiles without errors
- [ ] No `console.log` or debugger statements
- [ ] TypeScript strict mode compliant
- [ ] All tests passing
- [ ] No hardcoded values or secrets
- [ ] Error handling implemented
- [ ] Input validation in place
- [ ] Database migrations included (if applicable)
- [ ] Documentation updated

### During Review
- [ ] Code is readable and maintainable
- [ ] Security implications reviewed
- [ ] Performance impact assessed
- [ ] Error cases handled
- [ ] Test coverage adequate
- [ ] Follows REST principles (if applicable)
- [ ] No breaking API changes
- [ ] Database constraints appropriate
- [ ] Logging sufficient for debugging

---

## 15. Common Anti-Patterns to Avoid

- ❌ Storing secrets in code or `.env` files
- ❌ Unhandled promise rejections
- ❌ Missing input validation
- ❌ SQL injection vulnerabilities
- ❌ Synchronous operations blocking event loop
- ❌ Hardcoded API endpoints/configs
- ❌ No error logging
- ❌ Missing pagination on list endpoints
- ❌ Insufficient test coverage
- ❌ No database indexes
- ❌ Circular dependencies
- ❌ Mixing concerns (business logic in controllers)

---

## 16. Tools & Linting

### Configuration
- **TypeScript**: Strict mode enabled
- **ESLint**: Code quality rules
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Jest**: Unit testing framework
- **Swagger**: API documentation

### Pre-commit Checks
```bash
npm run lint        # ESLint check
npm run type-check  # TypeScript check
npm run format      # Prettier format
npm test            # Run tests
npm run build       # Build check
```

---

## 17. Deployment & DevOps

### Best Practices
- **Environment Parity**: Dev, staging, prod should be similar
- **CI/CD Pipeline**: Automated testing and deployment
- **Docker**: Containerize application for consistency
- **Health Checks**: Monitor service health
- **Graceful Shutdown**: Handle signals for clean shutdown
- **Versioning**: Tag releases, maintain changelog

### Health Check Implementation
```typescript
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    version: process.env.APP_VERSION,
  });
});
```

---

## Quick Reference

| Aspect | Standard |
|--------|----------|
| Language | TypeScript (strict mode) |
| Runtime | Node.js |
| Framework | Express.js (or similar) |
| Database | PostgreSQL (or documented choice) |
| Authentication | JWT with refresh tokens |
| Testing | Jest |
| Code Formatting | Prettier |
| Linting | ESLint |
| Package Manager | npm |

---

## Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Documentation](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [REST API Best Practices](https://restfulapi.net)
- [OWASP Security Guidelines](https://owasp.org)
- [Twelve-Factor App](https://12factor.net)

---

*Last Updated: May 2026*

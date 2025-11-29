# Database Module

This module provides database access using Drizzle ORM with proper NestJS dependency injection.

## Usage in Services

To use the database in a service, inject `DatabaseService`:

```typescript
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { activities } from '@corpcal/database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class MyService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.db
      .select()
      .from(activities)
      .where(eq(activities.isActive, true));
  }
}
```

## Type Exports

The `Database` type is exported for type annotations:

```typescript
import type { Database } from '../database';

// Use in function signatures, etc.
function processData(db: Database) {
  // ...
}
```

## Configuration

The database connection is configured via environment variables:

- `DATABASE_URL` (required): PostgreSQL connection string
- `DB_MAX_CONNECTIONS` (optional, default: 10): Maximum number of connections in the pool
- `DB_IDLE_TIMEOUT` (optional, default: 20): Idle timeout in seconds
- `DB_CONNECT_TIMEOUT` (optional, default: 10): Connection timeout in seconds

## Module Structure

- `database.provider.ts`: NestJS provider that creates the Drizzle client with connection pooling
- `database.service.ts`: Injectable service wrapper around the database client
- `database.module.ts`: Global NestJS module that exports the database provider and service
- `index.ts`: Barrel export for convenient imports

## Important Notes

- The `DatabaseModule` is marked as `@Global()`, so it's automatically available to all modules
- Always use `DatabaseService` injection rather than importing `db` directly from `@corpcal/database`
- This ensures proper connection pooling, configuration, and testability

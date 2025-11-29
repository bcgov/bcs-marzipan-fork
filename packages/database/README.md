# Database Package

This package contains Drizzle ORM schema definitions and database client setup.

## Setup

1. Set the `DATABASE_URL` environment variable:

   ```bash
   export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

2. Generate migrations:

   ```bash
   npm run db:generate --workspace=packages/database
   ```

3. Run migrations:

   ```bash
   npm run db:migrate --workspace=packages/database
   ```

   Or push schema directly (development only):

   ```bash
   npm run db:push --workspace=packages/database
   ```

4. Open Drizzle Studio (optional):
   ```bash
   npm run db:studio --workspace=packages/database
   ```

## Schema

The schema is defined in `src/schema/`:

- `activity.ts` - Main activity/calendar entries table
- `calendar.ts` - Legacy calendar table (to be merged with activity)
- Other lookup and relation tables

## Types

Types are automatically inferred from Drizzle schemas in `src/types.ts`:

- `Activity` - Select type (for queries)
- `NewActivity` - Insert type (for creates)

## Usage

```typescript
import { db } from '@corpcal/database';
import { activities } from '@corpcal/database/schema';
import { eq } from 'drizzle-orm';

// Query
const allActivities = await db.select().from(activities);

// Insert
const [newActivity] = await db
  .insert(activities)
  .values({
    title: 'New Activity',
    // ...
  })
  .returning();

// Update
await db
  .update(activities)
  .set({ title: 'Updated' })
  .where(eq(activities.id, 1));
```

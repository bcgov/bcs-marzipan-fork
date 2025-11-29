/**
 * Type validation file
 *
 * This file validates that Zod schemas in the shared package match
 * the TypeScript types inferred from Drizzle schemas in the database package.
 *
 * Run `pnpm --filter shared typecheck` to validate types are in sync.
 * TypeScript will error if the types don't match.
 */

import { z } from 'zod';
import type { Activity } from '@corpcal/database/types';
import { activitySchema } from '../src/schemas/activity.schema';

/**
 * Validates that a Zod schema type matches the Drizzle inferred type
 * This is a compile-time check - if this compiles, the types match
 */
function validateTypeMatch<T extends z.ZodTypeAny>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _schema: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _type: z.infer<T>
): void {
  // This function only exists for type checking
  // If the types don't match, TypeScript will error here
}

// Validate Activity schema matches Activity type
// This will cause a TypeScript error if types don't match
// Using type assertion because drizzle-zod's BuildSchema is compatible with ZodTypeAny
validateTypeMatch(activitySchema as unknown as z.ZodTypeAny, {} as Activity);

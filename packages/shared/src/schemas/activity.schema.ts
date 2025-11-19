import { z } from 'zod';
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { activities } from '@corpcal/database/schema';

/**
 * Activity Zod schemas automatically generated from Drizzle schema
 * These schemas ensure validation matches the database schema exactly
 *
 * Generated from: packages/database/src/schema/activity.ts
 */

/**
 * Schema for selecting activities from the database
 * Matches the shape of data returned from database queries
 */
export const activitySchema = createSelectSchema(activities);

/**
 * Schema for creating a new activity (insert)
 * Automatically excludes generated columns (id, audit fields, etc.)
 */
export const createActivitySchema = createInsertSchema(activities);

/**
 * Schema for updating an activity (partial update)
 * Automatically excludes generated columns and makes all fields optional
 */
export const updateActivitySchema = createUpdateSchema(activities);

/**
 * Schema for creating a new activity via HTTP request
 * Dates are accepted as ISO datetime strings (as they come from HTTP)
 * This is the schema that should be used for API request validation
 *
 * Note: Type assertion is necessary because drizzle-zod's BuildSchema type
 * doesn't perfectly align with Zod's .omit() and .extend() methods
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createActivityRequestSchema = (createActivitySchema as any)
  .omit({
    startDateTime: true,
    endDateTime: true,
    nrDateTime: true,
  })
  .extend({
    // Override datetime fields to accept ISO strings from HTTP requests
    startDateTime: z.string().datetime().optional().nullable(),
    endDateTime: z.string().datetime().optional().nullable(),
    nrDateTime: z.string().datetime().optional().nullable(),
  });

/**
 * Schema for updating an activity via HTTP request
 * Dates are accepted as ISO datetime strings (as they come from HTTP)
 * ID is not included in the request body (it comes from the URL parameter)
 * This is the schema that should be used for API request validation
 *
 * Note: Type assertion is necessary because drizzle-zod's BuildSchema type
 * doesn't perfectly align with Zod's .omit() and .extend() methods
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateActivityRequestSchema = (updateActivitySchema as any)
  .omit({
    startDateTime: true,
    endDateTime: true,
    nrDateTime: true,
  })
  .extend({
    // Override datetime fields to accept ISO strings from HTTP requests
    startDateTime: z.string().datetime().optional().nullable(),
    endDateTime: z.string().datetime().optional().nullable(),
    nrDateTime: z.string().datetime().optional().nullable(),
  });

/**
 * Schema for filtering activities (query parameters)
 * Uses z.coerce for query parameters which come as strings from HTTP
 */
export const filterActivitiesSchema = z.object({
  title: z.string().optional(),
  startDateFrom: z.string().datetime().optional(),
  startDateTo: z.string().datetime().optional(),
  endDateFrom: z.string().datetime().optional(),
  endDateTo: z.string().datetime().optional(),
  statusId: z.coerce.number().int().optional(),
  hqStatusId: z.coerce.number().int().optional(),
  contactMinistryId: z.string().uuid().optional(),
  cityId: z.coerce.number().int().optional(),
  isActive: z.coerce.boolean().optional(),
  isConfirmed: z.coerce.boolean().optional(),
  isConfidential: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().min(1).max(100).default(20),
});

/**
 * TypeScript types inferred from Zod schemas
 * These should match the types from @corpcal/database
 * Note: Using type assertions because drizzle-zod's BuildSchema type
 * is compatible with Zod but TypeScript needs help recognizing it
 */
export type Activity = z.infer<z.ZodTypeAny & typeof activitySchema>;
export type CreateActivity = z.infer<
  z.ZodTypeAny & typeof createActivitySchema
>;
export type UpdateActivity = z.infer<
  z.ZodTypeAny & typeof updateActivitySchema
>;
export type CreateActivityRequest = z.infer<
  z.ZodTypeAny & typeof createActivityRequestSchema
>;
export type UpdateActivityRequest = z.infer<
  z.ZodTypeAny & typeof updateActivityRequestSchema
>;
export type FilterActivities = z.infer<typeof filterActivitiesSchema>;

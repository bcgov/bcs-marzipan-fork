import { z } from 'zod';

/**
 * Activity API Response Schema
 * Represents the API contract, decoupled from the database schema.
 * Dates are ISO strings for JSON serialization.
 *
 * This schema is the single source of truth for the ActivityResponse type.
 * It should be used to:
 * - Infer the ActivityResponse type
 * - Validate API responses at runtime (in development)
 * - Ensure DTOs match the API contract
 */
export const activityResponseSchema = z.object({
  id: z.number().int().positive(),

  // Date/Time fields (ISO strings)
  startDateTime: z.string().datetime().nullable(),
  endDateTime: z.string().datetime().nullable(),
  nrDateTime: z.string().datetime().nullable(),

  // Text fields
  title: z.string().nullable(),
  details: z.string().nullable(),
  comments: z.string().nullable(),
  leadOrganization: z.string().nullable(),
  venue: z.string().nullable(),
  otherCity: z.string().nullable(),
  schedule: z.string().nullable(),
  significance: z.string().nullable(),
  strategy: z.string().nullable(),
  potentialDates: z.string().nullable(),
  translations: z.string().nullable(),

  // Foreign keys
  statusId: z.number().int().nullable(),
  hqStatusId: z.number().int().nullable(),
  nrDistributionId: z.number().int().nullable(),
  premierRequestedId: z.number().int().nullable(),
  contactMinistryId: z.string().uuid().nullable(),
  governmentRepresentativeId: z.number().int().nullable(),
  communicationContactId: z.number().int().nullable(),
  eventPlannerId: z.number().int().nullable(),
  videographerId: z.number().int().nullable(),
  cityId: z.number().int().nullable(),

  // Boolean flags
  isActive: z.boolean(),
  isConfirmed: z.boolean(),
  isAllDay: z.boolean(),
  isAtLegislature: z.boolean(),
  isConfidential: z.boolean(),
  isCrossGovernment: z.boolean(),
  isIssue: z.boolean(),
  isMilestone: z.boolean(),

  // HQ Section
  hqSection: z.number().int(),

  // Audit fields (public-facing)
  createdDateTime: z.string().datetime().nullable(),
  lastUpdatedDateTime: z.string().datetime().nullable(),
});

/**
 * Paginated Response Schema
 * Generic schema for paginated API responses.
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      totalPages: z.number().int().nonnegative(),
    }),
  });

/**
 * TypeScript types inferred from Zod schemas
 * These are the single source of truth for API response types
 */
export type ActivityResponse = z.infer<typeof activityResponseSchema>;
export type PaginatedActivityResponse = z.infer<
  ReturnType<typeof paginatedResponseSchema<typeof activityResponseSchema>>
>;

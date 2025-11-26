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
  displayId: z.string().nullable(), // MIN-###### format

  // Entry status and category
  entryStatus: z.string(), // EntryStatus enum value
  category: z.array(z.string()), // Array of category names/IDs

  // Basic info
  title: z.string(),
  summary: z.string().nullable(), // 1000 char limit
  issue: z.boolean(),
  oicRelated: z.boolean(),

  // Organizations
  leadOrg: z.string().uuid().nullable(), // organizationId
  jointOrg: z.array(z.string().uuid()).optional(), // Array of organizationIds

  // Related entries and tags
  relatedEntries: z.array(z.string()).optional(), // Array of activity IDs
  tags: z
    .array(z.object({ id: z.string().uuid(), text: z.string() }))
    .optional(),

  // Approvals
  significance: z.string().nullable(), // 500 char limit
  pitchStatus: z.string(), // PitchStatus enum value
  pitchComments: z.string().nullable(), // 500 char limit
  confidential: z.boolean(),

  // Scheduling
  schedulingStatus: z.string(), // SchedulingStatus enum value
  isAllDay: z.boolean(),
  startDate: z.string().nullable(), // ISO date string (YYYY-MM-DD)
  startTime: z.string().nullable(), // Time string (HH:mm format)
  endDate: z.string().nullable(), // ISO date string (YYYY-MM-DD)
  endTime: z.string().nullable(), // Time string (HH:mm format)
  schedulingConsiderations: z.string().nullable(), // 500 char limit

  // Comms
  commsLead: z.string().nullable(), // userId
  commsMaterials: z.array(z.string()).optional(), // Array of CommsMaterials enum values
  strategy: z.string().nullable(), // 500 char limit
  newsReleaseId: z.string().uuid().nullable(),
  translationsRequired: z.array(z.string()).optional(), // Array of TranslatedLanguage enum values

  // Event
  eventLeadOrg: z.string().uuid().nullable(), // organizationId
  jointEventOrg: z.array(z.string().uuid()).optional(), // Array of organizationIds
  representativesAttending: z
    .array(
      z.object({
        representative: z.string(), // Representative enum value
        attendingStatus: z.enum(['requested', 'declined', 'confirmed']),
      })
    )
    .optional(),
  venueAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      provinceOrState: z.string(),
      country: z.string(),
    })
    .nullable(),
  eventLead: z.string().nullable(), // userId
  videographer: z.string().nullable(), // userId
  graphics: z.string().nullable(), // userId

  // Reports
  notForLookAhead: z.boolean(),
  lookAheadStatus: z.enum(['none', 'new', 'changed']),
  lookAheadSection: z.enum(['events', 'issues', 'news', 'awareness']),
  planningReport: z.boolean(),
  thirtySixtyNinetyReport: z.boolean(),

  // Sharing
  owner: z.string().nullable(), // userId
  sharedWith: z.array(z.string().uuid()).optional(), // Array of organizationIds
  canEdit: z.array(z.string()).optional(), // Array of userIds
  canView: z.array(z.string()).optional(), // Array of userIds
  calendarVisibility: z.enum(['visible', 'partial', 'hidden']),

  // Meta
  createdDateTime: z.string().datetime(),
  createdBy: z.string(), // userId
  lastUpdatedDateTime: z.string().datetime(),
  lastUpdatedBy: z.string(), // userId
});

/**
 * Paginated Response Schema
 * Generic schema for paginated API responses.
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  itemSchema: T
) =>
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

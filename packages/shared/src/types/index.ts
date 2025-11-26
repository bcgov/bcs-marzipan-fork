/**
 * TypeScript types re-exported from @bcs-marzipan/database
 * These types are inferred from Drizzle schema tables and match the database schema
 *
 * Frontend and backend should import types from here for consistency
 */

// Re-export types from database package
export type {
  Activity,
  NewActivity,
  SystemUser,
  NewSystemUser,
  Ministry,
  NewMinistry,
  Status,
  NewStatus,
  City,
  NewCity,
  GovernmentRepresentative,
  NewGovernmentRepresentative,
  CommunicationContact,
  NewCommunicationContact,
  EventPlanner,
  NewEventPlanner,
  Videographer,
  NewVideographer,
  Category,
  NewCategory,
  Theme,
  NewTheme,
  Tag,
  NewTag,
} from '@corpcal/database';

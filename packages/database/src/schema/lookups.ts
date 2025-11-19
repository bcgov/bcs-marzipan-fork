import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Status lookup table - Activity statuses
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/Status.cs
 */
export const statuses = pgTable('statuses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  description: text('description'),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * City lookup table - Cities for activities
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/City.cs
 */
export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  province: varchar('province', { length: 100 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Government Representative lookup table - Representatives for activities
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/GovernmentRepresentative.cs
 */
export const governmentRepresentatives = pgTable('government_representatives', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  title: varchar('title', { length: 255 }),
  email: varchar('email', { length: 255 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Communication Contact lookup table - Communication contacts for activities
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/CommunicationContact.cs
 */
export const communicationContacts = pgTable('communication_contacts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Event Planner lookup table - Event planners for activities
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/EventPlanner.cs
 */
export const eventPlanners = pgTable('event_planners', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Videographer lookup table - Videographers for activities
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/Videographer.cs
 */
export const videographers = pgTable('videographers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Category lookup table - Classification categories for activities
 * Extensible by admins via admin UI.
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/Category.cs
 */
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  description: text('description'),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Theme lookup table - Classification themes for activities
 * Uses UUID primary key (unlike Category which uses serial).
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/Theme.cs
 */
export const themes = pgTable('themes', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  topReleaseId: uuid('top_release_id'), // FK to News Release (integration)
  featureReleaseId: uuid('feature_release_id'), // FK to News Release (integration)
});

/**
 * Tag lookup table - Classification tags for activities
 * Uses UUID primary key (unlike Category which uses serial).
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/Tag.cs
 */
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: varchar('key', { length: 100 }),
  displayName: varchar('display_name', { length: 255 }),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
});

// NOTE: Initiative and Keyword tables are intentionally deferred
// These will be added in a future phase when needed.
// See MIGRATION_PLAN.md for details.

// Relations for lookup tables
// Note: Reverse relations are defined in activity.ts to avoid circular dependencies

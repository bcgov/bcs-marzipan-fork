import { pgTable, integer, boolean, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { activities } from './activity';
import { themes, tags } from './lookups';
import { systemUsers } from './user';

/**
 * ActivityThemes junction table - Many-to-many relationship between Activities and Themes
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/ActivityTheme.cs
 */
export const activityThemes = pgTable(
  'activity_themes',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    themeId: uuid('theme_id')
      .notNull()
      .references(() => themes.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true }).notNull().defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  table => ({
    pk: primaryKey({ columns: [table.activityId, table.themeId] }),
  })
);

/**
 * ActivityTags junction table - Many-to-many relationship between Activities and Tags
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/ActivityTags.cs
 */
export const activityTags = pgTable(
  'activity_tags',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true }).notNull().defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  table => ({
    pk: primaryKey({ columns: [table.activityId, table.tagId] }),
  })
);

// Relations for junction tables
export const activityThemesRelations = relations(activityThemes, ({ one }) => ({
  activity: one(activities, {
    fields: [activityThemes.activityId],
    references: [activities.id],
  }),
  theme: one(themes, {
    fields: [activityThemes.themeId],
    references: [themes.id],
  }),
  createdByUser: one(systemUsers, {
    fields: [activityThemes.createdBy],
    references: [systemUsers.id],
    relationName: 'activityThemeCreatedBy',
  }),
  updatedByUser: one(systemUsers, {
    fields: [activityThemes.lastUpdatedBy],
    references: [systemUsers.id],
    relationName: 'activityThemeUpdatedBy',
  }),
}));

export const activityTagsRelations = relations(activityTags, ({ one }) => ({
  activity: one(activities, {
    fields: [activityTags.activityId],
    references: [activities.id],
  }),
  tag: one(tags, {
    fields: [activityTags.tagId],
    references: [tags.id],
  }),
  createdByUser: one(systemUsers, {
    fields: [activityTags.createdBy],
    references: [systemUsers.id],
    relationName: 'activityTagCreatedBy',
  }),
  updatedByUser: one(systemUsers, {
    fields: [activityTags.lastUpdatedBy],
    references: [systemUsers.id],
    relationName: 'activityTagUpdatedBy',
  }),
}));

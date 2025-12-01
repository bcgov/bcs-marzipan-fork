import {
  pgTable,
  integer,
  boolean,
  timestamp,
  uuid,
  primaryKey,
  varchar,
  text,
  serial,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { activities } from './activity';
import {
  themes,
  tags,
  categories,
  commsMaterials,
  translatedLanguages,
  activityStatuses,
} from './lookups';
import { organizations } from './organizations';
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
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.themeId] })]
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
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.tagId] })]
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

/**
 * ActivityCategories junction table - Many-to-many relationship between Activities and Categories
 */
export const activityCategories = pgTable(
  'activity_categories',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.categoryId] })]
);

/**
 * ActivityJointOrganizations junction table - Many-to-many relationship between Activities and Organizations (joint orgs)
 */
export const activityJointOrganizations = pgTable(
  'activity_joint_organizations',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.organizationId] })]
);

/**
 * ActivityRelatedEntries junction table - Self-referential many-to-many relationship between Activities
 */
export const activityRelatedEntries = pgTable(
  'activity_related_entries',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    relatedActivityId: integer('related_activity_id')
      .notNull()
      .references(() => activities.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [
    primaryKey({ columns: [table.activityId, table.relatedActivityId] }),
  ]
);

/**
 * ActivityCommsMaterials junction table - Many-to-many relationship between Activities and CommsMaterials
 */
export const activityCommsMaterials = pgTable(
  'activity_comms_materials',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    commsMaterialId: integer('comms_material_id')
      .notNull()
      .references(() => commsMaterials.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [
    primaryKey({ columns: [table.activityId, table.commsMaterialId] }),
  ]
);

/**
 * ActivityTranslationLanguages junction table - Many-to-many relationship between Activities and TranslatedLanguages
 */
export const activityTranslationLanguages = pgTable(
  'activity_translation_languages',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    languageId: integer('language_id')
      .notNull()
      .references(() => translatedLanguages.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.languageId] })]
);

/**
 * ActivityJointEventOrganizations junction table - Many-to-many relationship between Activities and Organizations (joint event orgs)
 */
export const activityJointEventOrganizations = pgTable(
  'activity_joint_event_organizations',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.organizationId] })]
);

/**
 * ActivityRepresentatives junction table - Many-to-many relationship between Activities and Representatives with attending status
 * Uses free-text representativeName (governmentRepresentatives lookup table has been removed)
 */
export const activityRepresentatives = pgTable('activity_representatives', {
  id: serial('id').primaryKey(),
  activityId: integer('activity_id')
    .notNull()
    .references(() => activities.id),
  representativeId: integer('representative_id'), // Legacy field - no longer references governmentRepresentatives
  representativeName: varchar('representative_name', { length: 255 }), // Free text for representatives
  attendingStatus: varchar('attending_status', { length: 50 }).notNull(), // 'requested', 'declined', 'confirmed'
  isActive: boolean('is_active').notNull().default(true),
  createdDateTime: timestamp('created_date_time', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdBy: integer('created_by')
    .notNull()
    .references(() => systemUsers.id),
  lastUpdatedDateTime: timestamp('last_updated_date_time', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  lastUpdatedBy: integer('last_updated_by')
    .notNull()
    .references(() => systemUsers.id),
});

/**
 * ActivitySharedWithOrganizations junction table - Many-to-many relationship between Activities and Organizations shared with
 */
export const activitySharedWithOrganizations = pgTable(
  'activity_shared_with_organizations',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.organizationId] })]
);

/**
 * ActivityCanEditUsers junction table - Many-to-many relationship between Activities and SystemUsers (can edit)
 */
export const activityCanEditUsers = pgTable(
  'activity_can_edit_users',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    userId: integer('user_id')
      .notNull()
      .references(() => systemUsers.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.userId] })]
);

/**
 * ActivityCanViewUsers junction table - Many-to-many relationship between Activities and SystemUsers (can view)
 */
export const activityCanViewUsers = pgTable(
  'activity_can_view_users',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id),
    userId: integer('user_id')
      .notNull()
      .references(() => systemUsers.id),
    isActive: boolean('is_active').notNull().default(true),
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by')
      .notNull()
      .references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by')
      .notNull()
      .references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.userId] })]
);

// Relations for new junction tables
export const activityCategoriesRelations = relations(
  activityCategories,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityCategories.activityId],
      references: [activities.id],
    }),
    category: one(categories, {
      fields: [activityCategories.categoryId],
      references: [categories.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityCategories.createdBy],
      references: [systemUsers.id],
      relationName: 'activityCategoryCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityCategories.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityCategoryUpdatedBy',
    }),
  })
);

export const activityJointOrganizationsRelations = relations(
  activityJointOrganizations,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityJointOrganizations.activityId],
      references: [activities.id],
    }),
    organization: one(organizations, {
      fields: [activityJointOrganizations.organizationId],
      references: [organizations.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityJointOrganizations.createdBy],
      references: [systemUsers.id],
      relationName: 'activityJointOrgCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityJointOrganizations.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityJointOrgUpdatedBy',
    }),
  })
);

export const activityRelatedEntriesRelations = relations(
  activityRelatedEntries,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityRelatedEntries.activityId],
      references: [activities.id],
      relationName: 'activity',
    }),
    relatedActivity: one(activities, {
      fields: [activityRelatedEntries.relatedActivityId],
      references: [activities.id],
      relationName: 'relatedActivity',
    }),
    createdByUser: one(systemUsers, {
      fields: [activityRelatedEntries.createdBy],
      references: [systemUsers.id],
      relationName: 'activityRelatedEntryCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityRelatedEntries.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityRelatedEntryUpdatedBy',
    }),
  })
);

export const activityCommsMaterialsRelations = relations(
  activityCommsMaterials,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityCommsMaterials.activityId],
      references: [activities.id],
    }),
    commsMaterial: one(commsMaterials, {
      fields: [activityCommsMaterials.commsMaterialId],
      references: [commsMaterials.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityCommsMaterials.createdBy],
      references: [systemUsers.id],
      relationName: 'activityCommsMaterialCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityCommsMaterials.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityCommsMaterialUpdatedBy',
    }),
  })
);

export const activityTranslationLanguagesRelations = relations(
  activityTranslationLanguages,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityTranslationLanguages.activityId],
      references: [activities.id],
    }),
    language: one(translatedLanguages, {
      fields: [activityTranslationLanguages.languageId],
      references: [translatedLanguages.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityTranslationLanguages.createdBy],
      references: [systemUsers.id],
      relationName: 'activityTranslationLanguageCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityTranslationLanguages.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityTranslationLanguageUpdatedBy',
    }),
  })
);

export const activityJointEventOrganizationsRelations = relations(
  activityJointEventOrganizations,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityJointEventOrganizations.activityId],
      references: [activities.id],
    }),
    organization: one(organizations, {
      fields: [activityJointEventOrganizations.organizationId],
      references: [organizations.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityJointEventOrganizations.createdBy],
      references: [systemUsers.id],
      relationName: 'activityJointEventOrgCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityJointEventOrganizations.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityJointEventOrgUpdatedBy',
    }),
  })
);

export const activityRepresentativesRelations = relations(
  activityRepresentatives,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityRepresentatives.activityId],
      references: [activities.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityRepresentatives.createdBy],
      references: [systemUsers.id],
      relationName: 'activityRepresentativeCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityRepresentatives.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityRepresentativeUpdatedBy',
    }),
  })
);

export const activitySharedWithOrganizationsRelations = relations(
  activitySharedWithOrganizations,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activitySharedWithOrganizations.activityId],
      references: [activities.id],
    }),
    organization: one(organizations, {
      fields: [activitySharedWithOrganizations.organizationId],
      references: [organizations.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activitySharedWithOrganizations.createdBy],
      references: [systemUsers.id],
      relationName: 'activitySharedWithOrgCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activitySharedWithOrganizations.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activitySharedWithOrgUpdatedBy',
    }),
  })
);

export const activityCanEditUsersRelations = relations(
  activityCanEditUsers,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityCanEditUsers.activityId],
      references: [activities.id],
    }),
    user: one(systemUsers, {
      fields: [activityCanEditUsers.userId],
      references: [systemUsers.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityCanEditUsers.createdBy],
      references: [systemUsers.id],
      relationName: 'activityCanEditUserCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityCanEditUsers.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityCanEditUserUpdatedBy',
    }),
  })
);

export const activityCanViewUsersRelations = relations(
  activityCanViewUsers,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityCanViewUsers.activityId],
      references: [activities.id],
    }),
    user: one(systemUsers, {
      fields: [activityCanViewUsers.userId],
      references: [systemUsers.id],
    }),
    createdByUser: one(systemUsers, {
      fields: [activityCanViewUsers.createdBy],
      references: [systemUsers.id],
      relationName: 'activityCanViewUserCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityCanViewUsers.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'activityCanViewUserUpdatedBy',
    }),
  })
);

/**
 * ActivityFieldReviewStatuses junction table - Tracks review status for each field of an activity
 * Replaces the boolean "needs review" flags with a more flexible status system
 * Field names: 'title', 'details', 'representative', 'city', 'start_date', 'end_date',
 * 'categories', 'active', 'comm_materials', 'significance', 'strategy',
 * 'scheduling_considerations', 'internal_notes', 'lead_organization', 'initiatives',
 * 'tags', 'origin', 'distribution', 'translations_required', 'premier_requested',
 * 'venue', 'event_planner', 'digital'
 */
export const activityFieldReviewStatuses = pgTable(
  'activity_field_review_statuses',
  {
    activityId: integer('activity_id')
      .notNull()
      .references(() => activities.id, { onDelete: 'cascade' }),
    fieldName: varchar('field_name', { length: 100 }).notNull(), // e.g., 'title', 'details', etc.
    reviewStatusId: integer('review_status_id')
      .notNull()
      .references(() => activityStatuses.id),
    requestedBy: integer('requested_by').references(() => systemUsers.id),
    requestedAt: timestamp('requested_at', { withTimezone: true }),
    reviewedBy: integer('reviewed_by').references(() => systemUsers.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    notes: text('notes'), // Optional notes about the review
    createdDateTime: timestamp('created_date_time', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdBy: integer('created_by').references(() => systemUsers.id),
    lastUpdatedDateTime: timestamp('last_updated_date_time', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    lastUpdatedBy: integer('last_updated_by').references(() => systemUsers.id),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.fieldName] })]
);

export const activityFieldReviewStatusesRelations = relations(
  activityFieldReviewStatuses,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityFieldReviewStatuses.activityId],
      references: [activities.id],
    }),
    reviewStatus: one(activityStatuses, {
      fields: [activityFieldReviewStatuses.reviewStatusId],
      references: [activityStatuses.id],
    }),
    requestedByUser: one(systemUsers, {
      fields: [activityFieldReviewStatuses.requestedBy],
      references: [systemUsers.id],
      relationName: 'fieldReviewRequestedBy',
    }),
    reviewedByUser: one(systemUsers, {
      fields: [activityFieldReviewStatuses.reviewedBy],
      references: [systemUsers.id],
      relationName: 'fieldReviewReviewedBy',
    }),
    createdByUser: one(systemUsers, {
      fields: [activityFieldReviewStatuses.createdBy],
      references: [systemUsers.id],
      relationName: 'fieldReviewCreatedBy',
    }),
    updatedByUser: one(systemUsers, {
      fields: [activityFieldReviewStatuses.lastUpdatedBy],
      references: [systemUsers.id],
      relationName: 'fieldReviewUpdatedBy',
    }),
  })
);

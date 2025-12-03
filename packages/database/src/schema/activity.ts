import {
  pgTable,
  serial,
  timestamp,
  date,
  time,
  varchar,
  text,
  integer,
  boolean,
  uuid,
  bigint,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Import table objects for relations
import {
  activityStatuses,
  cities,
  pitchStatuses,
  schedulingStatuses,
} from './lookups';
import { ministries } from './ministry';
import { organizations } from './organizations';
import { systemUsers } from './user';
import {
  activityThemes,
  activityTags,
  activityCategories,
  activityJointOrganizations,
  activityRelatedEntries,
  activityCommsMaterials,
  activityTranslationLanguages,
  activityJointEventOrganizations,
  activityRepresentatives,
  activitySharedWithOrganizations,
  activityCanEditUsers,
  activityCanViewUsers,
  activityFieldReviewStatuses,
} from './relations';

/**
 * Activity table - Core entity for calendar events
 * Inferred from Hub.Legacy/Gcpe.Calendar.Data/Entity/Activity.cs
 */
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),

  // Display ID (computed: MIN-###### format)
  displayId: varchar('display_id', { length: 50 }), // Computed field: {ministryAcronym}-{paddedId}

  // Scheduling

  startDate: date('start_date'),
  startTime: time('start_time'),
  endDate: date('end_date'),
  endTime: time('end_time'),
  // Date/Time fields (deprecated - kept for backward compatibility)
  // startDateTime: timestamp('start_date_time', { withTimezone: true }),
  // endDateTime: timestamp('end_date_time', { withTimezone: true }),
  // nrDateTime: timestamp('nr_date_time', { withTimezone: true }), // News Release date
  schedulingStatusId: integer('scheduling_status_id'), // FK to SchedulingStatusˆ
  // isConfirmed: boolean('is_confirmed').notNull().default(false), // Deprecated - use schedulingStatusId
  schedulingConsiderations: text('scheduling_considerations'), // Renamed from schedule (500 char limit)
  // schedule: text('schedule'), // Deprecated - kept for backward compatibility

  // Overview and approval
  title: varchar('title', { length: 500 }),
  summary: text('summary'), // Renamed from details (1000 char limit in new type)
  // details: text('details'), // Deprecated - kept for backward compatibility
  comments: text('comments'), // Deprecated - kept for backward compatibility
  // hqComments: text('hq_comments'), // Deprecated - kept for backward compatibility
  leadOrganization: varchar('lead_organization', { length: 255 }), // Deprecated - replaced by leadOrgId
  venue: varchar('venue', { length: 500 }), // Deprecated - replaced by venueAddress
  venueAddress: jsonb('venue_address'), // New: {street, city, provinceOrState, country}
  // otherCity: varchar('other_city', { length: 255 }), // Deprecated - kept for backward compatibility
  significance: text('significance'),
  // strategy: text('strategy'), // 500 char limit in new type
  pitchComments: text('pitch_comments'), // New (500 char limit)
  //potentialDates: text('potential_dates'), // Deprecated - kept for backward compatibility
  // translations: text('translations'), // Deprecated - replaced by junction table
  newsReleaseId: uuid('news_release_id'), // New

  // Foreign keys (new)
  activityStatusId: integer('entry_status_id'), // FK to ActivityStatus
  // statusId: integer('status_id'), // FK to Status (deprecated - use activityStatusId)
  pitchStatusId: integer('pitch_status_id'), // FK to PitchStatus
  leadOrgId: uuid('lead_org_id'), // FK to Organizations
  eventLeadOrgId: uuid('event_lead_org_id'), // FK to Organizations
  commsLeadId: integer('comms_lead_id'), // FK to SystemUser
  eventLeadId: integer('event_lead_id'), // FK to SystemUser (mutually exclusive with eventLeadName)
  eventLeadName: varchar('event_lead_name', { length: 255 }), // Free text for non-system user event leads (mutually exclusive with eventLeadId)
  videographerUserId: integer('videographer_user_id'), // FK to SystemUser (replaces videographerId lookup)
  graphicsUserId: integer('graphics_user_id'), // FK to SystemUser (replaces graphicsId lookup)
  ownerId: integer('owner_id'), // FK to SystemUser

  // Foreign keys
  // hqStatusId: integer('hq_status_id'), // FK to Status (deprecated - use activityStatusId)
  nrDistributionId: integer('nr_distribution_id'), // FK to NRDistribution
  premierRequestedId: integer('premier_requested_id'), // FK to PremierRequested
  contactMinistryId: uuid('contact_ministry_id'), // FK to Ministry
  // governmentRepresentativeId: integer('government_representative_id'), // FK to GovernmentRepresentative (deprecated - use junction table)
  // communicationContactId: integer('communication_contact_id'), // FK to CommunicationContact (deprecated - use commsLeadId)
  // eventPlannerId: integer('event_planner_id'), // FK to EventPlanner (deprecated - use eventLeadId)
  // videographerId: integer('videographer_id'), // FK to Videographer  (TODO: may be deprecated)
  // graphicsId: integer('graphics_id'), // FK to Graphics (TODO: may be deprecated)
  cityId: integer('city_id'), // FK to City

  // Boolean flags (new)
  isAllDay: boolean('is_all_day').notNull().default(false),
  oicRelated: boolean('oic_related').notNull().default(false), // New
  notForLookAhead: boolean('not_for_look_ahead').notNull().default(false), // New
  planningReport: boolean('planning_report').notNull().default(false), // New
  thirtySixtyNinetyReport: boolean('thirty_sixty_ninety_report')
    .notNull()
    .default(false), // New (fixed typo from "thrity")

  // Boolean flags
  isActive: boolean('is_active').notNull().default(true), // Relates to activityStatusId

  // isAtLegislature: boolean('is_at_legislature').notNull().default(false), // Deprecated
  isConfidential: boolean('is_confidential').notNull().default(false), // Deprecated - use confidential
  // isCrossGovernment: boolean('is_cross_government').notNull().default(false), // Deprecated
  isIssue: boolean('is_issue').notNull().default(false),
  // isMilestone: boolean('is_milestone').notNull().default(false), // Deprecated

  // Enums (stored as varchar)
  lookAheadStatus: varchar('look_ahead_status', { length: 50 }), // 'none', 'new', 'changed'
  lookAheadSection: varchar('look_ahead_section', { length: 50 }), // 'events', 'issues', 'news', 'awareness'
  calendarVisibility: varchar('calendar_visibility', { length: 50 }), // 'visible', 'partial', 'hidden'

  // HQ Section (deprecated - kept for backward compatibility)
  hqSection: integer('hq_section').notNull().default(0), // TODO: unsure what this is for?

  // "Needs Review" flags (legacy boolean fields for granular review)
  // Deprecated - use activityFieldReviewStatuses junction table instead
  // isTitleNeedsReview: boolean('is_title_needs_review').notNull().default(false),
  // isDetailsNeedsReview: boolean('is_details_needs_review')
  //   .notNull()
  //   .default(false),
  // isRepresentativeNeedsReview: boolean('is_representative_needs_review')
  //   .notNull()
  //   .default(false),
  // isCityNeedsReview: boolean('is_city_needs_review').notNull().default(false),
  // isStartDateNeedsReview: boolean('is_start_date_needs_review')
  //   .notNull()
  //   .default(false),
  // isEndDateNeedsReview: boolean('is_end_date_needs_review')
  //   .notNull()
  //   .default(false),
  // isCategoriesNeedsReview: boolean('is_categories_needs_review')
  //   .notNull()
  //   .default(false),
  // isActiveNeedsReview: boolean('is_active_needs_review')
  //   .notNull()
  //   .default(false),
  // isCommMaterialsNeedsReview: boolean('is_comm_materials_needs_review')
  //   .notNull()
  //   .default(false),
  // isSignificanceNeedsReview: boolean('is_significance_needs_review')
  //   .notNull()
  //   .default(false),
  // isStrategyNeedsReview: boolean('is_strategy_needs_review')
  //   .notNull()
  //   .default(false),
  // isSchedulingConsiderationsNeedsReview: boolean(
  //   'is_scheduling_considerations_needs_review'
  // )
  //   .notNull()
  //   .default(false),
  // isInternalNotesNeedsReview: boolean('is_internal_notes_needs_review')
  //   .notNull()
  //   .default(false),
  // isLeadOrganizationNeedsReview: boolean('is_lead_organization_needs_review')
  //   .notNull()
  //   .default(false),
  // isInitiativesNeedsReview: boolean('is_initiatives_needs_review')
  //   .notNull()
  //   .default(false),
  // isTagsNeedsReview: boolean('is_tags_needs_review').notNull().default(false),
  // isOriginNeedsReview: boolean('is_origin_needs_review')
  //   .notNull()
  //   .default(false),
  // isDistributionNeedsReview: boolean('is_distribution_needs_review')
  //   .notNull()
  //   .default(false),
  // isTranslationsRequiredNeedsReview: boolean(
  //   'is_translations_required_needs_review'
  // )
  //   .notNull()
  //   .default(false),
  // isPremierRequestedNeedsReview: boolean('is_premier_requested_needs_review')
  //   .notNull()
  //   .default(false),
  // isVenueNeedsReview: boolean('is_venue_needs_review').notNull().default(false),
  // isEventPlannerNeedsReview: boolean('is_event_planner_needs_review')
  //   .notNull()
  //   .default(false),
  // isDigitalNeedsReview: boolean('is_digital_needs_review')
  //   .notNull()
  //   .default(false),

  // Audit fields
  createdDateTime: timestamp('created_date_time', { withTimezone: true }),
  createdBy: integer('created_by'), // FK to SystemUser
  lastUpdatedDateTime: timestamp('last_updated_date_time', {
    withTimezone: true,
  }),
  lastUpdatedBy: integer('last_updated_by'), // FK to SystemUser
  rowVersion: bigint('row_version', { mode: 'number' }).notNull().default(0), // Optimistic concurrency control
  rowGuid: uuid('row_guid'),
});

// Relations - using actual table objects for type safety
export const activitiesRelations = relations(activities, ({ one, many }) => ({
  activityStatus: one(activityStatuses, {
    fields: [activities.activityStatusId],
    references: [activityStatuses.id],
  }),
  // Deprecated relation - statusId field no longer exists (replaced by activityStatusId)
  // status: one(activityStatuses, {
  //   fields: [activities.statusId],
  //   references: [activityStatuses.id],
  // }),
  pitchStatus: one(pitchStatuses, {
    fields: [activities.pitchStatusId],
    references: [pitchStatuses.id],
  }),
  schedulingStatus: one(schedulingStatuses, {
    fields: [activities.schedulingStatusId],
    references: [schedulingStatuses.id],
  }),
  leadOrg: one(organizations, {
    fields: [activities.leadOrgId],
    references: [organizations.id],
  }),
  eventLeadOrg: one(organizations, {
    fields: [activities.eventLeadOrgId],
    references: [organizations.id],
    relationName: 'eventLeadOrg',
  }),
  commsLead: one(systemUsers, {
    fields: [activities.commsLeadId],
    references: [systemUsers.id],
    relationName: 'commsLead',
  }),
  eventLead: one(systemUsers, {
    fields: [activities.eventLeadId],
    references: [systemUsers.id],
    relationName: 'eventLead',
  }),
  videographerUser: one(systemUsers, {
    fields: [activities.videographerUserId],
    references: [systemUsers.id],
    relationName: 'videographerUser',
  }),
  graphics: one(systemUsers, {
    fields: [activities.graphicsUserId],
    references: [systemUsers.id],
    relationName: 'graphics',
  }),
  owner: one(systemUsers, {
    fields: [activities.ownerId],
    references: [systemUsers.id],
    relationName: 'owner',
  }),

  // Deprecated relations (kept for backward compatibility)
  // hqStatus: one(activityStatuses, {
  //   fields: [activities.hqStatusId],
  //   references: [activityStatuses.id],
  //   relationName: 'hqStatus',
  // }),
  contactMinistry: one(ministries, {
    fields: [activities.contactMinistryId],
    references: [ministries.id],
  }),
  city: one(cities, {
    fields: [activities.cityId],
    references: [cities.id],
  }),
  // governmentRepresentative: one(governmentRepresentatives, {
  //   fields: [activities.governmentRepresentativeId],
  //   references: [governmentRepresentatives.id],
  // }),
  // communicationContact: one(communicationContacts, {
  //   fields: [activities.communicationContactId],
  //   references: [communicationContacts.id],
  // }),
  // eventPlanner: one(eventPlanners, {
  //   fields: [activities.eventPlannerId],
  //   references: [eventPlanners.id],
  // }),
  // videographer: one(videographers, {
  //   fields: [activities.videographerId],
  //   references: [videographers.id],
  // }),
  createdByUser: one(systemUsers, {
    fields: [activities.createdBy],
    references: [systemUsers.id],
    relationName: 'createdBy',
  }),
  updatedByUser: one(systemUsers, {
    fields: [activities.lastUpdatedBy],
    references: [systemUsers.id],
    relationName: 'updatedBy',
  }),

  // Junction tables (new)
  activityCategories: many(activityCategories),
  activityJointOrganizations: many(activityJointOrganizations),
  activityRelatedEntries: many(activityRelatedEntries),
  activityCommsMaterials: many(activityCommsMaterials),
  activityTranslationLanguages: many(activityTranslationLanguages),
  activityJointEventOrganizations: many(activityJointEventOrganizations),
  activityRepresentatives: many(activityRepresentatives),
  activitySharedWithOrganizations: many(activitySharedWithOrganizations),
  activityCanEditUsers: many(activityCanEditUsers),
  activityCanViewUsers: many(activityCanViewUsers),
  activityFieldReviewStatuses: many(activityFieldReviewStatuses),

  // Junction tables (existing)
  activityThemes: many(activityThemes),
  activityTags: many(activityTags),

  // Deprecated junction table references (deferred to future phase)
  // activityInitiatives: many('activityInitiatives'),
  // activityKeywords: many('activityKeywords'),
  // activityNROrigins: many('activityNROrigins'),
  // activitySectors: many('activitySectors'),
  // activityFiles: many('activityFiles'),
  // activityFavorites: many('activityFavorites'),
  // logs: many('logs'),
  // newsFeeds: many('newsFeeds'),
}));

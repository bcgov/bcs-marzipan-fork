-- Activity Schema Migration
-- This migration adds new tables, columns, and relationships for the updated Activity schema
-- Based on the new Activity type definition in .local/types.ts

-- ============================================================================
-- 1. CREATE NEW LOOKUP TABLES
-- ============================================================================

-- EntryStatus lookup table
CREATE TABLE IF NOT EXISTS entry_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- PitchStatus lookup table
CREATE TABLE IF NOT EXISTS pitch_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- SchedulingStatus lookup table
CREATE TABLE IF NOT EXISTS scheduling_statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- CommsMaterials lookup table
CREATE TABLE IF NOT EXISTS comms_materials (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- TranslatedLanguage lookup table
CREATE TABLE IF NOT EXISTS translated_languages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  organization_type VARCHAR(50), -- 'bcgov', 'provincial', 'federal', 'other'
  ministry_id UUID REFERENCES ministries(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. CREATE NEW JUNCTION TABLES
-- ============================================================================

-- ActivityCategories junction table
CREATE TABLE IF NOT EXISTS activity_categories (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  category_id INTEGER NOT NULL REFERENCES categories(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, category_id)
);

-- ActivityJointOrganizations junction table
CREATE TABLE IF NOT EXISTS activity_joint_organizations (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, organization_id)
);

-- ActivityRelatedEntries junction table (self-referential)
CREATE TABLE IF NOT EXISTS activity_related_entries (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  related_activity_id INTEGER NOT NULL REFERENCES activities(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, related_activity_id)
);

-- ActivityCommsMaterials junction table
CREATE TABLE IF NOT EXISTS activity_comms_materials (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  comms_material_id INTEGER NOT NULL REFERENCES comms_materials(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, comms_material_id)
);

-- ActivityTranslationLanguages junction table
CREATE TABLE IF NOT EXISTS activity_translation_languages (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  language_id INTEGER NOT NULL REFERENCES translated_languages(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, language_id)
);

-- ActivityJointEventOrganizations junction table
CREATE TABLE IF NOT EXISTS activity_joint_event_organizations (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, organization_id)
);

-- ActivityRepresentatives junction table
CREATE TABLE IF NOT EXISTS activity_representatives (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  representative_id INTEGER NOT NULL REFERENCES government_representatives(id),
  attending_status VARCHAR(50) NOT NULL, -- 'requested', 'declined', 'confirmed'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, representative_id)
);

-- ActivitySharedWithOrganizations junction table
CREATE TABLE IF NOT EXISTS activity_shared_with_organizations (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, organization_id)
);

-- ActivityCanEditUsers junction table
CREATE TABLE IF NOT EXISTS activity_can_edit_users (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  user_id INTEGER NOT NULL REFERENCES system_users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, user_id)
);

-- ActivityCanViewUsers junction table
CREATE TABLE IF NOT EXISTS activity_can_view_users (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  user_id INTEGER NOT NULL REFERENCES system_users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, user_id)
);

-- ============================================================================
-- 3. CREATE ACTIVITY HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS activity_history (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  user_id INTEGER NOT NULL REFERENCES system_users(id),
  action_type VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', etc.
  changes JSONB, -- Array of change objects: [{field, oldValue, newValue}]
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS activity_history_activity_id_idx ON activity_history(activity_id);
CREATE INDEX IF NOT EXISTS activity_history_user_id_idx ON activity_history(user_id);
CREATE INDEX IF NOT EXISTS activity_history_timestamp_idx ON activity_history(timestamp);

-- ============================================================================
-- 4. ADD NEW COLUMNS TO ACTIVITIES TABLE
-- ============================================================================

-- Display ID
ALTER TABLE activities ADD COLUMN IF NOT EXISTS display_id VARCHAR(50);

-- New date/time columns (separate date and time)
ALTER TABLE activities ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS end_time TIME;

-- Renamed/New text fields
ALTER TABLE activities ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS scheduling_considerations TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS pitch_comments TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS venue_address JSONB;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS news_release_id UUID;

-- New boolean flags
ALTER TABLE activities ADD COLUMN IF NOT EXISTS issue BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS confidential BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS oic_related BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS not_for_look_ahead BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS planning_report BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS thirty_sixty_ninety_report BOOLEAN NOT NULL DEFAULT false;

-- New enum columns (stored as varchar)
ALTER TABLE activities ADD COLUMN IF NOT EXISTS look_ahead_status VARCHAR(50);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS look_ahead_section VARCHAR(50);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS calendar_visibility VARCHAR(50);

-- New foreign keys
ALTER TABLE activities ADD COLUMN IF NOT EXISTS entry_status_id INTEGER REFERENCES entry_statuses(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS pitch_status_id INTEGER REFERENCES pitch_statuses(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS scheduling_status_id INTEGER REFERENCES scheduling_statuses(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS lead_org_id UUID REFERENCES organizations(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS event_lead_org_id UUID REFERENCES organizations(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS comms_lead_id INTEGER REFERENCES system_users(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS event_lead_id INTEGER REFERENCES system_users(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS videographer_user_id INTEGER REFERENCES system_users(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS graphics_id INTEGER REFERENCES system_users(id);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES system_users(id);

-- ============================================================================
-- 5. DATA MIGRATION NOTES
-- ============================================================================

-- Note: The following fields are kept for backward compatibility but are deprecated:
-- - startDateTime, endDateTime (use startDate/startTime, endDate/endTime)
-- - details (use summary)
-- - schedule (use schedulingConsiderations)
-- - isIssue (use issue)
-- - isConfidential (use confidential)
-- - statusId (use entryStatusId)
-- - videographerId (use videographerUserId)
-- - governmentRepresentativeId (use activityRepresentatives junction table)
-- - communicationContactId (use commsLeadId)
-- - leadOrganization varchar (use leadOrgId FK)

-- Migration of existing data should be done in a separate data migration script
-- after this schema migration is applied.


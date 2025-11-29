-- Base Schema Migration
-- TODO: this schema needs to be refined with legacy column names removed/deprecated
-- This migration creates the core tables that subsequent migrations depend on
-- After this, use `db:push` to sync the full schema from Drizzle definitions

-- ============================================================================
-- 1. SYSTEM USERS (required by all junction tables and activities)
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'ReadOnly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  external_id VARCHAR(255),
  ad_username VARCHAR(255),
  phone VARCHAR(50),
  department VARCHAR(255),
  notes TEXT,
  last_login_date_time TIMESTAMP WITH TIME ZONE,
  created_date_time TIMESTAMP WITH TIME ZONE,
  created_by INTEGER REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE,
  last_updated_by INTEGER REFERENCES system_users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 2. MINISTRIES (required by organizations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  key VARCHAR(100),
  display_name VARCHAR(255),
  abbreviation VARCHAR(50),
  display_additional_name VARCHAR(255),
  minister_name VARCHAR(255),
  minister_email VARCHAR(255),
  minister_address TEXT,
  minister_summary TEXT,
  minister_photo_url VARCHAR(500),
  minister_page_html TEXT,
  twitter_username VARCHAR(100),
  flickr_url VARCHAR(500),
  youtube_url VARCHAR(500),
  audio_url VARCHAR(500),
  facebook_embed_html TEXT,
  youtube_embed_html TEXT,
  audio_embed_html TEXT,
  misc_html TEXT,
  misc_right_html TEXT,
  ministry_url VARCHAR(500),
  contact_user_id INTEGER REFERENCES system_users(id),
  second_contact_user_id INTEGER REFERENCES system_users(id),
  weekend_contact_number VARCHAR(50),
  top_release_id UUID,
  feature_release_id UUID,
  parent_id UUID REFERENCES ministries(id),
  eod_finalized_date_time TIMESTAMP WITH TIME ZONE,
  eod_last_run_user_id INTEGER REFERENCES system_users(id),
  eod_last_run_date_time TIMESTAMP WITH TIME ZONE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. ORGANIZATIONS (required by activities and junction tables)
-- ============================================================================

CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  organization_type VARCHAR(50),
  ministry_id UUID REFERENCES ministries(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. LOOKUP TABLES (required by activities and junction tables)
-- ============================================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Statuses (deprecated but still used)
CREATE TABLE IF NOT EXISTS statuses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  province VARCHAR(100),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Government Representatives
CREATE TABLE IF NOT EXISTS government_representatives (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  title VARCHAR(255),
  email VARCHAR(255),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Communication Contacts
CREATE TABLE IF NOT EXISTS communication_contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  email VARCHAR(255),
  phone VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Event Planners
CREATE TABLE IF NOT EXISTS event_planners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  email VARCHAR(255),
  phone VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Videographers
CREATE TABLE IF NOT EXISTS videographers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  email VARCHAR(255),
  phone VARCHAR(50),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Themes
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100),
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  top_release_id UUID,
  feature_release_id UUID
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100),
  display_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================================
-- 5. ACTIVITIES TABLE (main table - base structure)
-- ============================================================================

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  
  -- Display ID (computed: MIN-###### format)
  display_id VARCHAR(50),
  
  -- Date/Time fields (new - separate date and time)
  start_date DATE,
  start_time TIME,
  end_date DATE,
  end_time TIME,
  
  -- Date/Time fields (deprecated - kept for backward compatibility)
  start_date_time TIMESTAMP WITH TIME ZONE,
  end_date_time TIMESTAMP WITH TIME ZONE,
  nr_date_time TIMESTAMP WITH TIME ZONE,
  
  -- Text fields
  title VARCHAR(500),
  summary TEXT,
  details TEXT,
  comments TEXT,
  hq_comments TEXT,
  lead_organization VARCHAR(255),
  venue VARCHAR(500),
  venue_address JSONB,
  other_city VARCHAR(255),
  scheduling_considerations TEXT,
  schedule TEXT,
  significance TEXT,
  strategy TEXT,
  pitch_comments TEXT,
  potential_dates TEXT,
  translations TEXT,
  news_release_id UUID,
  
  -- Foreign keys (new)
  entry_status_id INTEGER,
  pitch_status_id INTEGER,
  scheduling_status_id INTEGER,
  lead_org_id UUID REFERENCES organizations(id),
  event_lead_org_id UUID REFERENCES organizations(id),
  comms_lead_id INTEGER REFERENCES system_users(id),
  event_lead_id INTEGER REFERENCES system_users(id),
  videographer_user_id INTEGER REFERENCES system_users(id),
  graphics_id INTEGER REFERENCES system_users(id),
  owner_id INTEGER REFERENCES system_users(id),
  
  -- Foreign keys (deprecated - kept for backward compatibility)
  status_id INTEGER REFERENCES statuses(id),
  hq_status_id INTEGER REFERENCES statuses(id),
  nr_distribution_id INTEGER,
  premier_requested_id INTEGER,
  contact_ministry_id UUID REFERENCES ministries(id),
  government_representative_id INTEGER REFERENCES government_representatives(id),
  communication_contact_id INTEGER REFERENCES communication_contacts(id),
  event_planner_id INTEGER REFERENCES event_planners(id),
  videographer_id INTEGER REFERENCES videographers(id),
  city_id INTEGER REFERENCES cities(id),
  
  -- Boolean flags (new)
  issue BOOLEAN NOT NULL DEFAULT false,
  confidential BOOLEAN NOT NULL DEFAULT false,
  oic_related BOOLEAN NOT NULL DEFAULT false,
  not_for_look_ahead BOOLEAN NOT NULL DEFAULT false,
  planning_report BOOLEAN NOT NULL DEFAULT false,
  thirty_sixty_ninety_report BOOLEAN NOT NULL DEFAULT false,
  
  -- Boolean flags (deprecated - kept for backward compatibility)
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_confirmed BOOLEAN NOT NULL DEFAULT false,
  is_all_day BOOLEAN NOT NULL DEFAULT false,
  is_at_legislature BOOLEAN NOT NULL DEFAULT false,
  is_confidential BOOLEAN NOT NULL DEFAULT false,
  is_cross_government BOOLEAN NOT NULL DEFAULT false,
  is_issue BOOLEAN NOT NULL DEFAULT false,
  is_milestone BOOLEAN NOT NULL DEFAULT false,
  
  -- Enums (stored as varchar)
  look_ahead_status VARCHAR(50),
  look_ahead_section VARCHAR(50),
  calendar_visibility VARCHAR(50),
  
  -- HQ Section (deprecated - kept for backward compatibility)
  hq_section INTEGER NOT NULL DEFAULT 0,
  
  -- "Needs Review" flags (15+ boolean fields for granular review)
  is_title_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_details_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_representative_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_city_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_start_date_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_end_date_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_categories_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_active_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_comm_materials_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_significance_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_strategy_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_scheduling_considerations_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_internal_notes_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_lead_organization_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_initiatives_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_tags_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_origin_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_distribution_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_translations_required_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_premier_requested_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_venue_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_event_planner_needs_review BOOLEAN NOT NULL DEFAULT false,
  is_digital_needs_review BOOLEAN NOT NULL DEFAULT false,
  
  -- Audit fields
  created_date_time TIMESTAMP WITH TIME ZONE,
  created_by INTEGER REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE,
  last_updated_by INTEGER REFERENCES system_users(id),
  row_version BIGINT NOT NULL DEFAULT 0,
  row_guid UUID
);

-- ============================================================================
-- 6. EXISTING JUNCTION TABLES (referenced in migration 001)
-- ============================================================================

-- ActivityThemes
CREATE TABLE IF NOT EXISTS activity_themes (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  theme_id UUID NOT NULL REFERENCES themes(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, theme_id)
);

-- ActivityTags
CREATE TABLE IF NOT EXISTS activity_tags (
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  tag_id UUID NOT NULL REFERENCES tags(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by INTEGER NOT NULL REFERENCES system_users(id),
  last_updated_date_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_updated_by INTEGER NOT NULL REFERENCES system_users(id),
  PRIMARY KEY (activity_id, tag_id)
);


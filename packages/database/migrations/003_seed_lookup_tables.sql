-- Seed Script for Lookup Tables
-- This script seeds all lookup tables with their initial values
-- Based on the current schema definitions in src/schema/lookups.ts
-- Run this after applying the base migration (0000_brown_the_executioner.sql)

-- ============================================================================
-- ACTIVITY STATUSES
-- Used for both activity entry status and field review statuses
-- Values: 'new', 'queued', 'reviewed', 'changed', 'paused', 'deleted'
-- ============================================================================

INSERT INTO activity_statuses (name, display_name, sort_order, is_active, description) VALUES
  ('new', 'New', 1, true, 'Newly created entry'),
  ('queued', 'Queued', 2, true, 'Entry is queued for review'),
  ('reviewed', 'Reviewed', 3, true, 'Entry has been reviewed'),
  ('changed', 'Changed', 4, true, 'Entry has been changed'),
  ('paused', 'Paused', 5, true, 'Entry is paused'),
  ('deleted', 'Deleted', 6, true, 'Entry is deleted')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PITCH STATUSES
-- Pitch approval statuses
-- Values: 'not required', 'submitted', 'pitched', 'approved'
-- ============================================================================

INSERT INTO pitch_statuses (name, display_name, sort_order, is_active, description) VALUES
  ('not required', 'Not Required', 1, true, 'Pitch approval is not required'),
  ('submitted', 'Submitted', 2, true, 'Pitch has been submitted'),
  ('pitched', 'Pitched', 3, true, 'Pitch has been presented'),
  ('approved', 'Approved', 4, true, 'Pitch has been approved')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHEDULING STATUSES
-- Event scheduling statuses
-- Values: 'unknown', 'tentative', 'confirmed'
-- ============================================================================

INSERT INTO scheduling_statuses (name, display_name, sort_order, is_active, description) VALUES
  ('unknown', 'Unknown', 1, true, 'Scheduling status is unknown'),
  ('tentative', 'Tentative', 2, true, 'Event is tentatively scheduled'),
  ('confirmed', 'Confirmed', 3, true, 'Event is confirmed')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CATEGORIES
-- Classification categories for activities
-- Values: 'event', 'release', 'awareness', 'conference', 'fyi', 'social media', 'speech', 'tv radio'
-- ============================================================================

INSERT INTO categories (name, display_name, sort_order, pitch_not_required, is_active, description) VALUES
  ('event', 'Event', 1, false, true, 'Event category (may require pitch approval)'),
  ('release', 'Release', 2, false, true, 'Release category (may require pitch approval)'),
  ('awareness', 'Awareness', 3, false, true, 'Awareness category'),
  ('conference', 'Conference', 4, false, true, 'Conference category'),
  ('fyi', 'FYI', 5, true, true, 'For Your Information category'),
  ('social media', 'Social Media', 6, false, true, 'Social Media category'),
  ('speech', 'Speech', 7, false, true, 'Speech category'),
  ('tv radio', 'TV/Radio', 8, false, true, 'TV/Radio category')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMS MATERIALS
-- Communication materials types
-- Common values: 'Media Advisory', 'Q&As', 'Key Messages', 'News Release', etc.
-- ============================================================================

INSERT INTO comms_materials (name, display_name, sort_order, is_active, description) VALUES
  ('media advisory', 'Media Advisory', 1, true, 'Media advisory materials'),
  ('q and a', 'Q&As', 2, true, 'Question and answer materials'),
  ('key messages', 'Key Messages', 3, true, 'Key messaging materials'),
  ('news release', 'News Release', 4, true, 'News release materials'),
  ('backgrounder', 'Backgrounder', 5, true, 'Background information materials'),
  ('factsheet', 'Factsheet', 6, true, 'Fact sheet materials'),
  ('speaking notes', 'Speaking Notes', 7, true, 'Speaking notes materials')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TRANSLATED LANGUAGES
-- Languages for translations
-- Common values: 'French', 'Chinese Simplified', 'Spanish', etc.
-- ============================================================================

INSERT INTO translated_languages (name, display_name, sort_order, is_active, description) VALUES
  ('french', 'French', 1, true, 'French translation required'),
  ('chinese simplified', 'Chinese Simplified', 2, true, 'Simplified Chinese translation required'),
  ('chinese traditional', 'Chinese Traditional', 3, true, 'Traditional Chinese translation required'),
  ('spanish', 'Spanish', 4, true, 'Spanish translation required'),
  ('punjabi', 'Punjabi', 5, true, 'Punjabi translation required'),
  ('tagalog', 'Tagalog', 6, true, 'Tagalog translation required'),
  ('arabic', 'Arabic', 7, true, 'Arabic translation required'),
  ('hindi', 'Hindi', 8, true, 'Hindi translation required')
ON CONFLICT DO NOTHING;


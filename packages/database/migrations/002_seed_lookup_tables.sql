-- Seed Script for Lookup Tables
-- This script seeds all lookup tables with their initial values
-- Based on the Activity schema migration requirements

-- ============================================================================
-- ENTRY STATUSES
-- ============================================================================

INSERT INTO entry_statuses (name, display_name, sort_order, is_active, description) VALUES
  ('new', 'New', 1, true, 'Newly created entry'),
  ('queued', 'Queued', 2, true, 'Entry is queued for review'),
  ('reviewed', 'Reviewed', 3, true, 'Entry has been reviewed'),
  ('changed', 'Changed', 4, true, 'Entry has been changed'),
  ('paused', 'Paused', 5, true, 'Entry is paused'),
  ('deleted', 'Deleted', 6, true, 'Entry is deleted')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PITCH STATUSES
-- ============================================================================

INSERT INTO pitch_statuses (name, display_name, sort_order, is_active, description) VALUES
  ('not required', 'Not Required', 1, true, 'Pitch approval is not required'),
  ('submitted', 'Submitted', 2, true, 'Pitch has been submitted'),
  ('pitched', 'Pitched', 3, true, 'Pitch has been presented'),
  ('approved', 'Approved', 4, true, 'Pitch has been approved')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SCHEDULING STATUSES
-- ============================================================================

INSERT INTO scheduling_statuses (name, display_name, sort_order, is_active, description) VALUES
  ('unknown', 'Unknown', 1, true, 'Scheduling status is unknown'),
  ('tentative', 'Tentative', 2, true, 'Event is tentatively scheduled'),
  ('confirmed', 'Confirmed', 3, true, 'Event is confirmed')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMMS MATERIALS
-- ============================================================================

INSERT INTO comms_materials (name, display_name, sort_order, is_active, description) VALUES
  ('media advisory', 'Media Advisory', 1, true, 'Media advisory materials'),
  ('q and a', 'Q and A', 2, true, 'Question and answer materials')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TRANSLATED LANGUAGES
-- ============================================================================

INSERT INTO translated_languages (name, display_name, sort_order, is_active, description) VALUES
  ('french', 'French', 1, true, 'French translation required'),
  ('simplified chinese', 'Simplified Chinese', 2, true, 'Simplified Chinese translation required')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- CATEGORIES
-- Note: These should already exist, but ensuring they are seeded
-- ============================================================================

INSERT INTO categories (name, display_name, sort_order, is_active, description) VALUES
  ('placeholder', 'Placeholder', 1, true, 'Placeholder category'),
  ('event', 'Event', 2, true, 'Event category (may require pitch approval)'),
  ('release', 'Release', 3, true, 'Release category (may require pitch approval)'),
  ('awareness', 'Awareness', 4, true, 'Awareness category'),
  ('conference', 'Conference', 5, true, 'Conference category'),
  ('fyi', 'FYI', 6, true, 'For Your Information category'),
  ('social media', 'Social Media', 7, true, 'Social Media category'),
  ('speech', 'Speech', 8, true, 'Speech category'),
  ('tv radio', 'TV/Radio', 9, true, 'TV/Radio category')
ON CONFLICT DO NOTHING;


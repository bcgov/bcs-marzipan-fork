# Legacy Schema Reference

This directory contains snapshots of schemas from the legacy application. These files are preserved for reference during data migration and should **not** be used in production code.

## Purpose

- **Reference for data migration**: Understand the exact structure of legacy data
- **Field mapping documentation**: Track how legacy fields map to new schema fields
- **Migration planning**: Reference point when creating migration transformers
- **Historical record**: Preserve the legacy structure for future reference

## Important Notes

**DO NOT**:

- Import these schemas in production code
- Modify these schemas (they represent the legacy structure)
- Use these schemas for new features

**DO**:

- Reference these schemas when planning migrations
- Use these schemas to understand legacy data structure
- Create migration transformers based on these schemas

## Files

### `activity.legacy.ts`

Snapshot of the Activity schema from the legacy application. This represents the exact structure as it existed when initially ported from:

- **Source**: `Hub.Legacy/Gcpe.Calendar.Data/Entity/Activity.cs`
- **Snapshot Date**: 2024 (initial port)

The legacy schema includes:

- All original field names and types
- Legacy foreign key relationships
- Legacy boolean flags (including the extensive "Needs Review" flags)
- Original audit fields

## Related Legacy Schemas

The following Zod schemas in `packages/shared/src/schemas/` were also part of the legacy structure:

- `activity.schema.ts` - Legacy Zod validation schemas (auto-generated from legacy Drizzle schema)

## Migration Planning

When ready to migrate data from the legacy application:

1. **Create migration transformers** in `packages/database/src/migrations/`
   - Transform legacy data structure to new schema
   - Handle field mappings and data type conversions
   - Apply business rules and data validation

2. **Create migration scripts** in `packages/database/src/migrations/scripts/`
   - One-time data migration scripts
   - Batch processing utilities
   - Validation and rollback procedures

3. **Document field mappings** in migration transformers
   - Map legacy fields to new fields
   - Document any data transformations
   - Note any fields that are deprecated or removed

## Schema Evolution

The active, evolving schemas are located in:

- `../schema/activity.ts` - Current Drizzle schema (evolving)
- `../../shared/src/schemas/activity.schema.ts` - Current Zod schemas (evolving)

As the application evolves, the active schemas will diverge from these legacy references. This is expected and intentional.

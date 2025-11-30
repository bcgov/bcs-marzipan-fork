import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, SQL, gte, lte, inArray } from 'drizzle-orm';
import {
  activities,
  pitchStatuses,
  schedulingStatuses,
  activityCategories,
  activityTags,
  categories,
  tags,
} from '@corpcal/database/schema';
import type { Activity, NewActivity } from '@corpcal/database/types';
import type {
  CreateActivityRequest,
  UpdateActivityRequest,
  FilterActivities,
} from '@corpcal/shared/schemas';
import type { ActivityResponse } from '@corpcal/shared/api';
import { activityResponseSchema } from '@corpcal/shared/schemas';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly databaseService: DatabaseService) {}
  /**
   * Create a new activity
   */
  async create(dto: CreateActivityRequest): Promise<ActivityResponse> {
    const newActivity: NewActivity = {
      ...(dto as Partial<NewActivity>),
      createdDateTime: new Date(),
    };

    const [created] = await this.databaseService.db
      .insert(activities)
      .values(newActivity)
      .returning();
    // For create, we don't have related data yet, so pass empty defaults
    return this.mapToResponseDto(created, {
      categories: [],
      tags: [],
    });
  }

  /**
   * Find all activities with optional filtering
   */
  async findAll(filters?: FilterActivities): Promise<ActivityResponse[]> {
    let activityResults: Activity[];

    if (filters) {
      const conditions: SQL[] = [];
      if (filters.title) {
        conditions.push(eq(activities.title, filters.title));
      }
      if (filters.activityStatusId !== undefined) {
        conditions.push(
          eq(activities.activityStatusId, filters.activityStatusId)
        );
      }
      if (filters.isActive !== undefined) {
        conditions.push(eq(activities.isActive, filters.isActive));
      }
      if (filters.isConfidential !== undefined) {
        conditions.push(eq(activities.isConfidential, filters.isConfidential));
      }
      if (filters.isIssue !== undefined) {
        conditions.push(eq(activities.isIssue, filters.isIssue));
      }
      if (filters.contactMinistryId) {
        conditions.push(
          eq(activities.contactMinistryId, filters.contactMinistryId)
        );
      }
      if (filters.cityId) {
        conditions.push(eq(activities.cityId, filters.cityId));
      }
      if (filters.startDateFrom) {
        conditions.push(gte(activities.startDate, filters.startDateFrom));
      }
      if (filters.startDateTo) {
        conditions.push(lte(activities.startDate, filters.startDateTo));
      }
      if (filters.endDateFrom) {
        conditions.push(gte(activities.endDate, filters.endDateFrom));
      }
      if (filters.endDateTo) {
        conditions.push(lte(activities.endDate, filters.endDateTo));
      }
      if (conditions.length > 0) {
        activityResults = await this.databaseService.db
          .select()
          .from(activities)
          .where(and(...conditions));
      } else {
        activityResults = await this.databaseService.db
          .select()
          .from(activities);
      }
    } else {
      activityResults = await this.databaseService.db.select().from(activities);
    }

    // Fetch related data for all activities
    const activityIds = activityResults.map((a) => a.id);
    const [categoriesMap, tagsMap, pitchStatusesMap, schedulingStatusesMap] =
      await Promise.all([
        this.fetchCategoriesForActivities(activityIds),
        this.fetchTagsForActivities(activityIds),
        this.fetchPitchStatusesForActivities(activityIds),
        this.fetchSchedulingStatusesForActivities(activityIds),
      ]);

    return activityResults.map((activity) =>
      this.mapToResponseDto(activity, {
        categories: categoriesMap.get(activity.id) ?? [],
        tags: tagsMap.get(activity.id) ?? [],
        pitchStatus: pitchStatusesMap.get(activity.id),
        schedulingStatus: schedulingStatusesMap.get(activity.id),
      })
    );
  }

  /**
   * Find one activity by ID
   */
  async findOne(id: number): Promise<ActivityResponse> {
    const [activity] = await this.databaseService.db
      .select()
      .from(activities)
      .where(eq(activities.id, id))
      .limit(1);

    if (!activity) {
      throw new NotFoundException(`Activity #${id} not found`);
    }

    // Fetch related data
    const [categoriesList, tagsList, pitchStatus, schedulingStatus] =
      await Promise.all([
        this.fetchCategoriesForActivities([id]),
        this.fetchTagsForActivities([id]),
        this.fetchPitchStatusesForActivities([id]),
        this.fetchSchedulingStatusesForActivities([id]),
      ]);

    return this.mapToResponseDto(activity, {
      categories: categoriesList.get(id) ?? [],
      tags: tagsList.get(id) ?? [],
      pitchStatus: pitchStatus.get(id),
      schedulingStatus: schedulingStatus.get(id),
    });
  }

  /**
   * Update an activity
   */
  async update(
    id: number,
    dto: UpdateActivityRequest
  ): Promise<ActivityResponse> {
    // Verify activity exists (throws NotFoundException if not found)
    await this.findOne(id);

    const updateData: Partial<Activity> = {
      ...(dto as Partial<Activity>),
      lastUpdatedDateTime: new Date(),
    };

    const [updated] = await this.databaseService.db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();

    // Fetch related data for the updated activity
    const [categoriesList, tagsList, pitchStatus, schedulingStatus] =
      await Promise.all([
        this.fetchCategoriesForActivities([id]),
        this.fetchTagsForActivities([id]),
        this.fetchPitchStatusesForActivities([id]),
        this.fetchSchedulingStatusesForActivities([id]),
      ]);

    return this.mapToResponseDto(updated, {
      categories: categoriesList.get(id) ?? [],
      tags: tagsList.get(id) ?? [],
      pitchStatus: pitchStatus.get(id),
      schedulingStatus: schedulingStatus.get(id),
    });
  }

  /**
   * Remove an activity (hard delete)
   */
  async remove(id: number): Promise<{ message: string }> {
    await this.databaseService.db
      .delete(activities)
      .where(eq(activities.id, id));
    return { message: `Activity #${id} deleted successfully` };
  }

  /**
   * Soft delete (set isActive to false)
   */
  async softDelete(id: number): Promise<ActivityResponse> {
    const [updated] = await this.databaseService.db
      .update(activities)
      .set({
        isActive: false,
        lastUpdatedDateTime: new Date(),
      })
      .where(eq(activities.id, id))
      .returning();

    // Fetch related data for the soft-deleted activity
    const [categoriesList, tagsList, pitchStatus, schedulingStatus] =
      await Promise.all([
        this.fetchCategoriesForActivities([id]),
        this.fetchTagsForActivities([id]),
        this.fetchPitchStatusesForActivities([id]),
        this.fetchSchedulingStatusesForActivities([id]),
      ]);

    return this.mapToResponseDto(updated, {
      categories: categoriesList.get(id) ?? [],
      tags: tagsList.get(id) ?? [],
      pitchStatus: pitchStatus.get(id),
      schedulingStatus: schedulingStatus.get(id),
    });
  }

  /**
   * Fetch categories for multiple activities
   */
  private async fetchCategoriesForActivities(
    activityIds: number[]
  ): Promise<Map<number, string[]>> {
    if (activityIds.length === 0) {
      return new Map();
    }

    const results = await this.databaseService.db
      .select({
        activityId: activityCategories.activityId,
        categoryName: categories.name,
      })
      .from(activityCategories)
      .innerJoin(categories, eq(activityCategories.categoryId, categories.id))
      .where(
        and(
          inArray(activityCategories.activityId, activityIds),
          eq(activityCategories.isActive, true),
          eq(categories.isActive, true)
        )
      );

    const map = new Map<number, string[]>();
    for (const row of results) {
      const existing = map.get(row.activityId) ?? [];
      existing.push(row.categoryName);
      map.set(row.activityId, existing);
    }
    return map;
  }

  /**
   * Fetch tags for multiple activities
   */
  private async fetchTagsForActivities(
    activityIds: number[]
  ): Promise<Map<number, Array<{ id: string; text: string }>>> {
    if (activityIds.length === 0) {
      return new Map();
    }

    const results = await this.databaseService.db
      .select({
        activityId: activityTags.activityId,
        tagId: tags.id,
        tagDisplayName: tags.displayName,
        tagKey: tags.key,
      })
      .from(activityTags)
      .innerJoin(tags, eq(activityTags.tagId, tags.id))
      .where(
        and(
          inArray(activityTags.activityId, activityIds),
          eq(activityTags.isActive, true),
          eq(tags.isActive, true)
        )
      );

    const map = new Map<number, Array<{ id: string; text: string }>>();
    for (const row of results) {
      const existing = map.get(row.activityId) ?? [];
      existing.push({
        id: row.tagId,
        text: row.tagDisplayName ?? row.tagKey ?? '',
      });
      map.set(row.activityId, existing);
    }
    return map;
  }

  /**
   * Fetch pitch statuses for multiple activities
   */
  private async fetchPitchStatusesForActivities(
    activityIds: number[]
  ): Promise<Map<number, string>> {
    if (activityIds.length === 0) {
      return new Map();
    }

    const activityResults = await this.databaseService.db
      .select({
        id: activities.id,
        pitchStatusId: activities.pitchStatusId,
      })
      .from(activities)
      .where(inArray(activities.id, activityIds));

    const pitchStatusIds = activityResults
      .map((a) => a.pitchStatusId)
      .filter((id): id is number => id !== null && id !== undefined);

    if (pitchStatusIds.length === 0) {
      return new Map();
    }

    const pitchStatusResults = await this.databaseService.db
      .select({
        id: pitchStatuses.id,
        name: pitchStatuses.name,
      })
      .from(pitchStatuses)
      .where(
        and(
          inArray(pitchStatuses.id, pitchStatusIds),
          eq(pitchStatuses.isActive, true)
        )
      );

    const statusMap = new Map(pitchStatusResults.map((s) => [s.id, s.name]));

    const resultMap = new Map<number, string>();
    for (const activity of activityResults) {
      if (activity.pitchStatusId) {
        const statusName = statusMap.get(activity.pitchStatusId);
        if (statusName) {
          resultMap.set(activity.id, statusName);
        }
      }
    }
    return resultMap;
  }

  /**
   * Fetch scheduling statuses for multiple activities
   */
  private async fetchSchedulingStatusesForActivities(
    activityIds: number[]
  ): Promise<Map<number, string>> {
    if (activityIds.length === 0) {
      return new Map();
    }

    const activityResults = await this.databaseService.db
      .select({
        id: activities.id,
        schedulingStatusId: activities.schedulingStatusId,
      })
      .from(activities)
      .where(inArray(activities.id, activityIds));

    const schedulingStatusIds = activityResults
      .map((a) => a.schedulingStatusId)
      .filter((id): id is number => id !== null && id !== undefined);

    if (schedulingStatusIds.length === 0) {
      return new Map();
    }

    const schedulingStatusResults = await this.databaseService.db
      .select({
        id: schedulingStatuses.id,
        name: schedulingStatuses.name,
      })
      .from(schedulingStatuses)
      .where(
        and(
          inArray(schedulingStatuses.id, schedulingStatusIds),
          eq(schedulingStatuses.isActive, true)
        )
      );

    const statusMap = new Map(
      schedulingStatusResults.map((s) => [s.id, s.name])
    );

    const resultMap = new Map<number, string>();
    for (const activity of activityResults) {
      if (activity.schedulingStatusId) {
        const statusName = statusMap.get(activity.schedulingStatusId);
        if (statusName) {
          resultMap.set(activity.id, statusName);
        }
      }
    }
    return resultMap;
  }

  /**
   * Map database Activity to API ActivityResponse
   * Validates against Zod schema to ensure DTO matches schema contract
   *
   * TODO: This mapping needs to be completed with proper joins for:

   * - And other relation fields
   */
  private mapToResponseDto(
    activity: Activity,
    relatedData?: {
      categories?: string[];
      tags?: Array<{ id: string; text: string }>;
      pitchStatus?: string;
      schedulingStatus?: string;
    }
  ): ActivityResponse {
    // Format date to YYYY-MM-DD
    const formatDate = (date: Date | string | null): string | null => {
      if (!date) return null;
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toISOString().split('T')[0] ?? null;
    };

    // Format time to HH:mm
    const formatTime = (time: string | null): string | null => {
      if (!time) return null;
      // If it's already in HH:mm format, return as is
      if (time.match(/^\d{2}:\d{2}$/)) return time;
      // If it's a full time string, extract HH:mm
      return time.substring(0, 5);
    };

    const dto: ActivityResponse = {
      id: activity.id,
      displayId: activity.displayId ?? null,

      // Activity status and category
      activityStatusId: activity.activityStatusId?.toString() ?? 'unknown',
      category: relatedData?.categories ?? [],

      // Basic info
      title: activity.title ?? '',
      summary: activity.summary ?? null,
      isIssue: activity.isIssue ?? false,
      oicRelated: activity.oicRelated ?? false,
      isActive: activity.isActive ?? true,

      // Organizations
      leadOrg: activity.leadOrgId ?? null,
      jointOrg: [], // TODO: join with activity_joint_orgs junction table

      // Related entries and tags
      relatedEntries: [],
      tags: relatedData?.tags ?? [],

      // Approvals
      significance: activity.significance ?? null,
      pitchStatus: relatedData?.pitchStatus ?? 'unknown',
      pitchComments: activity.pitchComments ?? null,
      confidential: activity.isConfidential ?? false,

      // Scheduling
      schedulingStatus: relatedData?.schedulingStatus ?? 'unknown',
      isAllDay: activity.isAllDay ?? false,
      startDate: formatDate(activity.startDate),
      startTime: formatTime(activity.startTime),
      endDate: formatDate(activity.endDate),
      endTime: formatTime(activity.endTime),
      schedulingConsiderations: activity.schedulingConsiderations ?? null,

      // Comms
      commsLead: activity.commsLeadId?.toString() ?? null,
      commsMaterials: [], // TODO: join with activity_comms_materials junction table
      newsReleaseId: activity.newsReleaseId ?? null,
      translationsRequired: [], // TODO: join with activity_translations junction table

      // Event
      eventLeadOrg: activity.eventLeadOrgId ?? null,
      jointEventOrg: [], // TODO: join with activity_joint_event_orgs junction table
      representativesAttending: [], // TODO: join with activity_representatives junction table
      venueAddress:
        (activity.venueAddress as {
          street: string;
          city: string;
          provinceOrState: string;
          country: string;
        } | null) ?? null,
      eventLead:
        activity.eventLeadId?.toString() ??
        ('eventLeadName' in activity &&
        typeof activity.eventLeadName === 'string'
          ? activity.eventLeadName
          : null),
      eventLeadName:
        'eventLeadName' in activity &&
        typeof activity.eventLeadName === 'string'
          ? activity.eventLeadName
          : null,
      videographer: activity.videographerUserId?.toString() ?? null,
      graphics: activity.graphicsId?.toString() ?? null,

      // Reports
      notForLookAhead: activity.notForLookAhead ?? false,
      lookAheadStatus:
        (activity.lookAheadStatus as 'none' | 'new' | 'changed') ?? 'none',
      lookAheadSection:
        (activity.lookAheadSection as
          | 'events'
          | 'issues'
          | 'news'
          | 'awareness') ?? 'events',
      planningReport: activity.planningReport ?? false,
      thirtySixtyNinetyReport: activity.thirtySixtyNinetyReport ?? false,

      // Sharing
      owner: activity.ownerId?.toString() ?? null,
      sharedWith: [], // TODO: join with activity_shared_with junction table
      canEdit: [], // TODO: join with activity_can_edit_users junction table
      canView: [], // TODO: join with activity_can_view_users junction table
      calendarVisibility:
        (activity.calendarVisibility as 'visible' | 'partial' | 'hidden') ??
        'visible',

      // Meta
      createdDateTime:
        activity.createdDateTime?.toISOString() ?? new Date().toISOString(),
      createdBy: activity.createdBy?.toString() ?? 'unknown',
      lastUpdatedDateTime:
        activity.lastUpdatedDateTime?.toISOString() ??
        activity.createdDateTime?.toISOString() ??
        new Date().toISOString(),
      lastUpdatedBy: activity.lastUpdatedBy?.toString() ?? 'unknown',
    };

    // Runtime validation to ensure DTO matches schema contract
    // This catches misalignment between the mapping logic and the schema
    // Runs in all environments to catch issues early
    try {
      activityResponseSchema.parse(dto);
    } catch (error) {
      // Log validation errors with context for debugging
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown validation error';
      console.error(
        `[ActivitiesService] Response DTO validation failed for activity ${activity.id}:`,
        errorMessage
      );
      // In production, we might want to throw here to prevent invalid responses
      // For now, we log and continue to avoid breaking the API
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          `Response DTO validation failed: ${errorMessage}. This indicates a mismatch between the mapping logic and the ActivityResponse schema.`
        );
      }
    }

    return dto;
  }
}

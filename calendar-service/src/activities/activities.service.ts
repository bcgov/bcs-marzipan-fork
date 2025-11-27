import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, SQL } from 'drizzle-orm';
import { activities } from '@corpcal/database/schema';
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
      ...dto,
      createdDateTime: new Date(),
      startDateTime: dto.startDateTime ? new Date(dto.startDateTime) : null,
      endDateTime: dto.endDateTime ? new Date(dto.endDateTime) : null,
      nrDateTime: dto.nrDateTime ? new Date(dto.nrDateTime) : null,
    };

    const [created] = await this.databaseService.db
      .insert(activities)
      .values(newActivity)
      .returning();
    return this.mapToResponseDto(created);
  }

  /**
   * Find all activities with optional filtering
   */
  async findAll(filters?: FilterActivities): Promise<ActivityResponse[]> {
    if (filters) {
      const conditions: SQL[] = [];
      if (filters.title) {
        conditions.push(eq(activities.title, filters.title));
      }
      if (filters.statusId) {
        conditions.push(eq(activities.statusId, filters.statusId));
      }
      if (filters.isActive !== undefined) {
        conditions.push(eq(activities.isActive, filters.isActive));
      }
      if (conditions.length > 0) {
        const results = await this.databaseService.db
          .select()
          .from(activities)
          .where(and(...conditions));
        return results.map((activity) => this.mapToResponseDto(activity));
      }
    }

    const results = await this.databaseService.db.select().from(activities);
    return results.map((activity) => this.mapToResponseDto(activity));
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

    return this.mapToResponseDto(activity);
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
      ...dto,
      lastUpdatedDateTime: new Date(),
      startDateTime: dto.startDateTime
        ? new Date(dto.startDateTime)
        : undefined,
      endDateTime: dto.endDateTime ? new Date(dto.endDateTime) : undefined,
      nrDateTime: dto.nrDateTime ? new Date(dto.nrDateTime) : undefined,
    };

    const [updated] = await this.databaseService.db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();

    return this.mapToResponseDto(updated);
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

    return this.mapToResponseDto(updated);
  }

  /**
   * Map database Activity to API ActivityResponse
   * Validates against Zod schema in development mode
   *
   * TODO: This mapping needs to be completed with proper joins for:
   * - entryStatus (from entryStatusId)
   * - category (from junction table)
   * - pitchStatus (from pitchStatusId)
   * - schedulingStatus (from schedulingStatusId)
   * - And other relation fields
   */
  private mapToResponseDto(activity: Activity): ActivityResponse {
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

      // Entry status and category - TODO: join with lookup tables
      entryStatus: activity.entryStatusId?.toString() ?? 'unknown',
      category: [], // TODO: join with activity_categories junction table

      // Basic info
      title: activity.title ?? '',
      summary: activity.summary ?? null,
      issue: activity.issue ?? false,
      oicRelated: activity.oicRelated ?? false,

      // Organizations
      leadOrg: activity.leadOrgId ?? null,
      jointOrg: [], // TODO: join with activity_joint_orgs junction table

      // Related entries and tags - TODO: join with junction tables
      relatedEntries: [],
      tags: [],

      // Approvals
      significance: activity.significance ?? null,
      pitchStatus: activity.pitchStatusId?.toString() ?? 'unknown', // TODO: join with pitchStatuses
      pitchComments: activity.pitchComments ?? null,
      confidential: activity.confidential ?? false,

      // Scheduling
      schedulingStatus: activity.schedulingStatusId?.toString() ?? 'unknown', // TODO: join with schedulingStatuses
      isAllDay: activity.isAllDay ?? false,
      startDate: formatDate(activity.startDate),
      startTime: formatTime(activity.startTime),
      endDate: formatDate(activity.endDate),
      endTime: formatTime(activity.endTime),
      schedulingConsiderations: activity.schedulingConsiderations ?? null,

      // Comms
      commsLead: activity.commsLeadId?.toString() ?? null,
      commsMaterials: [], // TODO: join with activity_comms_materials junction table
      strategy: activity.strategy ?? null,
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
      eventLead: activity.eventLeadId?.toString() ?? null,
      videographer: activity.videographerUserId?.toString() ?? null,
      graphics: activity.graphicsId?.toString() ?? null,

      // Reports
      notForLookAhead: activity.notForLookAhead ?? false,
      lookAheadStatus: 'none', // TODO: compute from activity data
      lookAheadSection: 'events', // TODO: compute from activity data
      planningReport: activity.planningReport ?? false,
      thirtySixtyNinetyReport: activity.thirtySixtyNinetyReport ?? false,

      // Sharing
      owner: activity.ownerId?.toString() ?? null,
      sharedWith: [], // TODO: join with activity_shared_with junction table
      canEdit: [], // TODO: join with activity_can_edit_users junction table
      canView: [], // TODO: join with activity_can_view_users junction table
      calendarVisibility: 'visible', // TODO: compute from activity data

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

    // Runtime validation in development mode
    if (process.env.NODE_ENV === 'development') {
      activityResponseSchema.parse(dto);
    }

    return dto;
  }
}

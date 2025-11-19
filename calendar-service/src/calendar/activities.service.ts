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
import { db } from '@corpcal/database';

@Injectable()
export class ActivitiesService {
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

    const [created] = await db
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
        const results = await db
          .select()
          .from(activities)
          .where(and(...conditions));
        return results.map((activity) => this.mapToResponseDto(activity));
      }
    }

    const results = await db.select().from(activities);
    return results.map((activity) => this.mapToResponseDto(activity));
  }

  /**
   * Find one activity by ID
   */
  async findOne(id: number): Promise<ActivityResponse> {
    const [activity] = await db
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

    const [updated] = await db
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
    await db.delete(activities).where(eq(activities.id, id));
    return { message: `Activity #${id} deleted successfully` };
  }

  /**
   * Soft delete (set isActive to false)
   */
  async softDelete(id: number): Promise<ActivityResponse> {
    const [updated] = await db
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
   */
  private mapToResponseDto(activity: Activity): ActivityResponse {
    const dto: ActivityResponse = {
      id: activity.id,
      startDateTime: activity.startDateTime?.toISOString() ?? null,
      endDateTime: activity.endDateTime?.toISOString() ?? null,
      nrDateTime: activity.nrDateTime?.toISOString() ?? null,
      title: activity.title ?? null,
      details: activity.details ?? null,
      comments: activity.comments ?? null,
      leadOrganization: activity.leadOrganization ?? null,
      venue: activity.venue ?? null,
      otherCity: activity.otherCity ?? null,
      schedule: activity.schedule ?? null,
      significance: activity.significance ?? null,
      strategy: activity.strategy ?? null,
      potentialDates: activity.potentialDates ?? null,
      translations: activity.translations ?? null,
      statusId: activity.statusId ?? null,
      hqStatusId: activity.hqStatusId ?? null,
      nrDistributionId: activity.nrDistributionId ?? null,
      premierRequestedId: activity.premierRequestedId ?? null,
      contactMinistryId: activity.contactMinistryId ?? null,
      governmentRepresentativeId: activity.governmentRepresentativeId ?? null,
      communicationContactId: activity.communicationContactId ?? null,
      eventPlannerId: activity.eventPlannerId ?? null,
      videographerId: activity.videographerId ?? null,
      cityId: activity.cityId ?? null,
      isActive: activity.isActive,
      isConfirmed: activity.isConfirmed,
      isAllDay: activity.isAllDay,
      isAtLegislature: activity.isAtLegislature,
      isConfidential: activity.isConfidential,
      isCrossGovernment: activity.isCrossGovernment,
      isIssue: activity.isIssue,
      isMilestone: activity.isMilestone,
      hqSection: activity.hqSection,
      createdDateTime: activity.createdDateTime?.toISOString() ?? null,
      lastUpdatedDateTime: activity.lastUpdatedDateTime?.toISOString() ?? null,
    };

    // Runtime validation in development mode
    if (process.env.NODE_ENV === 'development') {
      activityResponseSchema.parse(dto);
    }

    return dto;
  }
}

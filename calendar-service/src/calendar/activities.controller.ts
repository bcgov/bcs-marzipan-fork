import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import {
  createActivityRequestSchema,
  updateActivityRequestSchema,
  filterActivitiesSchema,
} from '@corpcal/shared/schemas';
import type { ActivityResponse } from '@corpcal/shared/api';

@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiOperation({ summary: 'Create activity' })
  @ApiResponse({ status: 201, description: 'Activity created' })
  @ApiBody({ description: 'Activity data' })
  @Post()
  async create(
    @Body() body: unknown
  ): Promise<{ success: boolean; data: ActivityResponse }> {
    const validated = createActivityRequestSchema.parse(body);
    const result = await this.activitiesService.create(validated);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Get all activities' })
  @ApiResponse({ status: 200, description: 'All activities found' })
  @Get()
  async findAll(
    @Query() query: unknown
  ): Promise<{ success: boolean; data: ActivityResponse[] }> {
    const filters = query ? filterActivitiesSchema.parse(query) : undefined;
    const results = await this.activitiesService.findAll(filters);
    return {
      success: true,
      data: results,
    };
  }

  @ApiOperation({ summary: 'Get activity' })
  @ApiResponse({ status: 200, description: 'Activity found' })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ success: boolean; data: ActivityResponse }> {
    const result = await this.activitiesService.findOne(id);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Update activity' })
  @ApiResponse({ status: 200, description: 'Activity updated' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown
  ): Promise<{ success: boolean; data: ActivityResponse }> {
    const validated = updateActivityRequestSchema.parse(body);
    const result = await this.activitiesService.update(id, validated);
    return {
      success: true,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Delete activity' })
  @ApiResponse({ status: 200, description: 'Activity deleted' })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number
  ): Promise<{ message: string }> {
    return this.activitiesService.remove(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Create calendar entry' })
  @ApiResponse({ status: 201, description: 'Entry created' })
  @ApiBody({ type: CreateCalendarDto })
  @Post()
  async create(@Body() dto: CreateCalendarDto) {
    try {
      const result = await this.calendarService.create(dto);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get all calendar entries' })
  @ApiResponse({ status: 200, description: 'All Entries found' })
  @Get()
  findAll() {
    return this.calendarService.findAll();
  }

  @ApiOperation({ summary: 'Get calendar entry' })
  @ApiResponse({ status: 200, description: 'Entry found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.calendarService.findOne(id);
  }

  @ApiOperation({ summary: 'Edit calendar entry' })
  @ApiResponse({ status: 200, description: 'Entry modified' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: UpdateCalendarDto
  ) {
    return this.calendarService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete calendar entry' })
  @ApiResponse({ status: 200, description: 'Entry deleted' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    //maybe not return the id here, and change the status code to 204
    return this.calendarService.remove(id);
  }
}

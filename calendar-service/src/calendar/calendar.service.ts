import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEntity } from './entities/calendar.entity';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>
  ) {}

  async create(dto: CreateCalendarDto) {
    // Transform the nested DTO into your entity structure
    const calendarEntry = this.calendarRepository.create({
      ...dto,
    });

    return await this.calendarRepository.save(calendarEntry);
  }

  async findAll() {
    return this.calendarRepository.find();
  }

  async findOne(id: string) {
    const entry = await this.calendarRepository.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`Entry #${id} not found`);
    return entry;
  }

  async update(id: string, dto: UpdateCalendarDto) {
    const entry = await this.findOne(id);
    Object.assign(entry, dto);
    return this.calendarRepository.save(entry);
  }

  async remove(id: string) {
    const entry = await this.findOne(id);
    await this.calendarRepository.remove(entry);
    return { message: `Entry #${id} deleted successfully` };
  }

  /**
   * Soft delete (status update instead of hard delete)
   */
  async softDelete(id: string, reason?: string): Promise<CalendarEntity> {
    const entry = await this.findOne(id);

    entry.status = 'deleted';
    entry.deleted_on = new Date();
    if (reason) entry.deleted_reason = reason;

    return await this.calendarRepository.save(entry);
  }

  /**
   * Restore deleted entry
   */
  async restore(id: string): Promise<CalendarEntity> {
    const entry = await this.findOne(id);

    entry.status = 'active';
    entry.restored_on = new Date();

    return await this.calendarRepository.save(entry);
  }
}

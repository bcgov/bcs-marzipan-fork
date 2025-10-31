import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntity } from './entities/calendar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEntity])],
  providers: [CalendarService],
  controllers: [CalendarController]
})
export class CalendarModule {}

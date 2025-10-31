import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarDto } from './create-calendar.dto';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateCalendarDto extends PartialType(CreateCalendarDto) {
  @IsOptional()
  @IsString()
  updated_by?: string;

  @IsOptional()
  @IsDateString()
  updated_on?: string;
}

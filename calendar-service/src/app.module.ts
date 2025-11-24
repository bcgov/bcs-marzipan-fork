import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarEntity } from './calendar/entities/calendar.entity'; // use with a real database
import { CalendarModule } from './calendar/calendar.module';
import { TypeOrmModule } from '@nestjs/typeorm'; // use with a real database

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [CalendarEntity],
      synchronize: true,
    }),
    CalendarModule,
  ],
  // imports: [CalendarModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

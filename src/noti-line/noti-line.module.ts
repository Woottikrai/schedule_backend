import { Module } from '@nestjs/common';
import { NotiLineService } from './noti-line.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Calendar } from 'src/calendar/entities/calendar.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Schedule, Calendar]),
    ScheduleModule.forRoot(),
  ],
  providers: [NotiLineService],
  exports: [NotiLineService],
})
export class NotiLineModule {}

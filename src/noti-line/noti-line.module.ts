import { Module } from '@nestjs/common';
import { NotiLineService } from './noti-line.service';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from 'src/schedule/schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Calendar } from 'src/calendar/entities/calendar.entity';

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

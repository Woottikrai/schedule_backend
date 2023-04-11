import { Module } from '@nestjs/common';
import { NotiemailService } from './notiemail.service';
import { NotiemailController } from './notiemail.controller';
import { UserModule } from 'src/user/user.module';
import { ScheduleService } from 'src/schedule/schedule.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { CalendarModule } from 'src/calendar/calendar.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { ScheduleModule } from 'src/schedule/schedule.module';
@Module({
  imports: [
    ScheduleModule,
    UserModule,
    CalendarModule,
    TypeOrmModule.forFeature([Schedule]),
  ],
  controllers: [NotiemailController],
  providers: [NotiemailService],
  exports: [NotiemailService],
})
export class NotiemailModule {}

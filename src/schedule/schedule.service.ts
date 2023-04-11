import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { UserService } from 'src/user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarService } from 'src/calendar/calendar.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as dayjs from 'dayjs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
    private userService: UserService,
    private calendarSerice: CalendarService,
  ) {}

  // @Cron('0 0 0 * * 1,0') //every monday
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async randomuser() {
    try {
      const user = await this.userService.findUserAll();
      const createdate = await this.calendarSerice.createdate();
      const calendar = await this.calendarSerice.findAll();

      const u = Math.ceil(user.length / 5);
      const startDate = dayjs()
        .startOf('week')
        .add(1, 'day')
        .format('YYYY-MM-DD'); // Monday of current week
      const endDate = dayjs()
        .startOf('week')
        .add(5, 'day')
        .format('YYYY-MM-DD'); // Friday of current week
      console.log(startDate);

      const wk = await this.scheduleRepo
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.user', 'scheduleUser') //line user
        .leftJoinAndSelect('schedule.calendar', 'scheduleCalendar') //line calendar
        .where('scheduleCalendar.date BETWEEN :start and :end ', {
          start: startDate,
          end: endDate,
        })
        .getOne();

      if (calendar?.length > 0) {
        for (const c of calendar) {
          if (!wk) {
            for (let i = 0; i <= 2; i++) {
              const randomIndex = Math.floor(Math.random() * user.length);
              const randomuser = user.splice(randomIndex, 1)[0]; //0 for use index splice
              // const randomuser = user[Math.floor(Math.random() * user.length)];
              // const qb = await this.scheduleRepo
              //   .createQueryBuilder('schedule')
              //   .leftJoinAndSelect('schedule.user', 'scheduleUser') // line user (entity)
              //   .leftJoinAndSelect('schedule.calendar', 'scheduleCalendar') // line calendar
              //   .where('scheduleUser.id = :id', { id: randomuser?.id }) //where id user random
              //   .andWhere('scheduleCalendar.id = :id', { id: c?.id }) //id date
              //   .getOne();
              // const wk = await this.scheduleRepo
              //   .createQueryBuilder('schedule')
              //   .leftJoinAndSelect('schedule.user', 'scheduleUser')
              //   .leftJoinAndSelect('schedule.calendar', 'scheduleCalendar')
              //   .where('scheduleUser.id = :id', { id: randomuser?.id })
              //   .andWhere('scheduleCalendar.date BETWEEN :start and :end ', {
              //     start: startDate,
              //     end: endDate,
              //   })
              //   .getOne();
              await this.scheduleRepo.save({
                calendar: c,
                user: randomuser,
              });
              // if (!wk) {
              //   await this.scheduleRepo.save({
              //     calendar: c,
              //     user: randomuser,
              //   });
              // }
            }
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const findAll = await this.scheduleRepo.find({
        relations: ['user', 'calendar'],
      });
      // console.log(findAll);
      return findAll;
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { CreateNotiemailDto } from './dto/create-notiemail.dto';
import { UpdateNotiemailDto } from './dto/update-notiemail.dto';
import * as nodemailer from 'nodemailer';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from 'src/user/user.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Repository } from 'typeorm';
import { CalendarService } from 'src/calendar/calendar.service';
import { ScheduleController } from 'src/schedule/schedule.controller';
import { log } from 'console';
import dayjs from 'dayjs';
import { Notiemail } from './entities/notiemail.entity';

@Injectable()
export class NotiemailService {
  constructor(
    private scheduleService: ScheduleService,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Schedule)
    private readonly notiemail: Repository<Notiemail>,
  ) {}

  private transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: '587',
    secure: false,
    auth: { user: 'phakphumninart@gmail.com', pass: 'yoxwmueyqtkleoiw' },
  });

  // @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_10AM)

  async sendMail() {
    try {
      // const findUser = await this.userService.findUserAll();
      const findSchedule = await this.scheduleService.findAll();
      for (const user of findSchedule) {
        await this.transport.sendMail({
          to: `${user.user.email}`, //Email User
          from: 'phakphumninart@gmail.com',
          subject: 'ทำเวร',
          text: 'ทำเวรด้วยจ้า',
        });
        console.log(user);
      }
      const now = new Date();
      const startDate = dayjs(now).startOf('day').toDate(); //เช็คเที่ยงคืนของเมื่อวาน
      const endDate = dayjs(now).endOf('day').toDate();

      const schedule = await this.scheduleRepository;

      return true;
    } catch (error) {
      throw error;
    }
  }

  async setTime() {
    try {
      const time = await this.notiemail.find({});
      return time;
    } catch (error) {
      throw error;
    }
  }

  // async getschedule() {
  //   try {
  //     const schedule = await this.scheduleRepo.find({
  //       relations: ['user', 'calendar'],
  //     });
  //     // console.log(schedule);
  //     return schedule;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // create(createNotiemailDto: CreateNotiemailDto) {
  //   return 'This action adds a new notiemail';
  // }

  // findAll() {
  //   return `This action returns all notiemail`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} notiemail`;
  // }

  update(id: number, updateNotiemailDto: UpdateNotiemailDto) {
    return `This action updates a #${id} notiemail`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} notiemail`;
  // }
}

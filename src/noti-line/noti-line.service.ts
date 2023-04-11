import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';

@Injectable()
export class NotiLineService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    //Api 10am. ผ่าน ui ,uiจะเป็นคน control
    utcOffset: 7,
  })
  async sendLineNoti() {
    console.log('EVERY_10_SECONDS :: ');
    try {
      const url_line_notification = 'https://notify-api.line.me/api/notify';
      var tokens = [
        'KU56nbEd5ffVVJvIkMjYaCcvnnZH78oUtmgwGYL3Ew1',
        'cpDcEngcDkt8RAP5inLTdjeijzthX4RiMgWPTrBSCva',
      ];
      const now = new Date();
      const startDate = dayjs(now).startOf('day').toDate(); //เช็คเที่ยงคืนของเมื่อวาน
      const endDate = dayjs(now).endOf('day').toDate(); //จนถึง 23.59 วันนี้

      const schedule = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.user', 'scheduleUser') //จอยเอาชื่อ
        .leftJoinAndSelect('schedule.calendar', 'scheduleCalendar') //จอยเอาวันมาเช็ค
        .where('scheduleCalendar.date between :startDate and :endDate', {
          //จอยมาเช็ควันนี้วันเดียว
          startDate: startDate,
          endDate: endDate,
        })
        .getMany(); //เอาทั้งหมดของวันนี้ใน s
      const userList = [];
      schedule.map((value) => {
        return userList.push(value?.user?.name);
      });

      for (var i = 0; i < tokens.length; i++) {
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${tokens[i]}`,
        };
        const data = {
          message: `${userList}`,
        };
        const response = await this.httpService
          .post(url_line_notification, data, { headers })
          .toPromise();
        console.log(response.data);
      }
      return true;
    } catch (error) {
      throw error;
    }
    //}
  }
}

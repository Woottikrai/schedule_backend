import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('notiemail')
export class Notiemail {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  date: string;
}

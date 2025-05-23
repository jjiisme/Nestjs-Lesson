import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  photo: string;

  @Column()
  gender: number;

  @Column()
  address: string;

  @OneToOne(() => User)
  // @JoinColumn({name: 'user_id'}) 可以这样设置字段名，不设置默认是 userId
  @JoinColumn()
  user: User;
}

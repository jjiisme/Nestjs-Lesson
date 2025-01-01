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
  @JoinColumn()
  user: User;
}

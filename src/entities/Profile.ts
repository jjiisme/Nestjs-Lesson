// 测试 typeorm-model-generator 生成的实体类
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Entity('profile', { schema: 'testdb' })
export class Profile {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'photo', length: 255 })
  photo: string;

  @Column('int', { name: 'gender' })
  gender: number;

  @Column('varchar', { name: 'address', length: 255 })
  address: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;
}

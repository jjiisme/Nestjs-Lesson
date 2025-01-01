import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // （typescript -> 数据库）关联关系 mapping
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({ name: 'user_roles' }) // 用于指定关联关系的中间表，在 User 中建立的话中间表名为 user_roles
  roles: Roles[];
}

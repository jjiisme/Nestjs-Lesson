import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  // 第二个参数是反向关系的属性名称
  // 这里的 logs 是 Logs 实体中的 user 属性
  // 这里不会在 User 表中创建外键
  // 事实上这里是创建了 typescript 和数据库之间的关联关系
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  @ManyToMany(() => Roles, (role) => role.users)
  @JoinTable({ name: 'users_roles' }) // 用于指定关联关系的中间表，在 User 中建立的话中间表名为 users_roles
  roles: Roles[];

  @AfterInsert()
  afterInsert() {
    console.log('afterInsert', this.id, this.username);
  }

  @AfterRemove()
  afterRemove() {
    console.log('afterInsert');
  }
}

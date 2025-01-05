import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logs } from './src/logs/logs.entity';
import { Roles } from './src/roles/roles.entity';
import { Profile } from './src/user/profile.entity';
import { User } from './src/user/user.entity';

export default {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'example',
  database: 'testdb',
  // 同步本地 schema 与数据库 schema -> 初始化数据库时使用
  synchronize: true,
  entities: [User, Profile, Logs, Roles],
  // logging: process.env.NODE_ENV === 'development' ? true : ['error'],
  // logging: ['error'],
  logging: false,
} as TypeOrmModuleOptions;

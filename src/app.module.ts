import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { ConfigEnum } from './enum/config.enum';
import { Logs } from './logs/logs.entity';
import { Roles } from './roles/roles.entity';
import { Profile } from './user/profile.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || `development`}`,
      load: [() => ({ env: dotenv.config({ path: '.env' }) })],
      validationSchema: Joi.object({
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        DB_DATABASE: Joi.string().required(),
        DB_TYPE: Joi.string()
          .required()
          .valid('mysql', 'postgres', 'sqlite', 'mssql'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: parseInt(configService.get(ConfigEnum.DB_PORT)),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          // 同步本地 schema 与数据库 schema -> 初始化数据库时使用
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          entities: [User, Profile, Logs, Roles],
          logging: process.env.NODE_ENV === 'development' ? true : ['error'],
          // logging: ['error'],
        }) as TypeOrmModuleOptions,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USER,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB,
    //   // 同步本地 schema 与数据库 schema -> 初始化数据库时使用
    //   synchronize: true,
    //   entities: [],
    //   logging: ['error'],
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

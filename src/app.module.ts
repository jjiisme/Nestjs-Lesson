import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import 'winston-daily-rotate-file';
import { connectionParams } from '../ormconfig';
import { LogsModule } from './logs/logs.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || `development`}`,
      load: [() => ({ env: dotenv.config({ path: '.env' }) })],
      validationSchema: Joi.object({
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        DB_DATABASE: Joi.string().required(),
        DB_TYPE: Joi.string()
          .required()
          .valid('mysql', 'postgres', 'sqlite', 'mssql'),
        LOG_LEVEL: Joi.string(),
        LOG_ON: Joi.boolean(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    RolesModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [],
})
export class AppModule {}

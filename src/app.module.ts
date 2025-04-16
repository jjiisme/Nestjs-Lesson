import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { connectionParams } from '../ormconfig';
import { LogsModule } from './logs/logs.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';
import { UserModule } from './user/user.module';

// 	•	providers：告诉 Nest 这个模块内部可以用哪些服务（注入用的）。
//	•	exports：告诉 Nest 这个模块对外暴露了哪些服务，别的模块引入我时能用哪些服务。
//  如果使用了 @Global() 装饰器，那么这个模块就变成了 全局模块（global module），它 exports 出来的东西会在整个应用中自动可用，其他模块不需要显式 import 也能用！
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

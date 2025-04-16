import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/roles/roles.entity';
import { Logs } from '../logs/logs.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Logs, Roles])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

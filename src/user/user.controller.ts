import {
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Patch,
  Post,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }
  @Get()
  getUsers(): any {
    return this.userService.findAll();
  }

  @Post()
  addUser(): any {
    const user = {
      username: 'tomic',
      password: '123456',
    } as User;
    return this.userService.create(user);
  }

  @Patch()
  updateUser(): any {
    const user = {
      username: 'tomic-update',
      password: '654321',
    } as User;

    throw new Error('Method not implemented.');

    return this.userService.update(1, user);
  }

  @Get('find-by-name')
  findUserByName(): any {
    return this.userService.find('tomic');
  }

  @Delete()
  deleteUser(): any {
    return this.userService.remove(1);
  }

  @Get('/profile')
  findProfile(): any {
    return this.userService.findProfile(2);
  }

  @Get('/logs')
  findUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async findUserLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    return res.map((item) => {
      return {
        result: item.result,
        count: item.count,
      };
    });
  }
}

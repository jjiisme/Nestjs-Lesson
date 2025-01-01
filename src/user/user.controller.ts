import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/config.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @Get()
  getUsers(): any {
    console.log(this.configService.get(ConfigEnum.DB_DATABASE));
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

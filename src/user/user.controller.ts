import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TypeormFilter } from 'src/filter/typeorm.filter';
import { getUserDto } from './dto/get-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseFilters(TypeormFilter)
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // Nest 会去查找 token 为 WINSTON_MODULE_NEST_PROVIDER 的 provider 并注入到 logger 中
    // 如果你不加 @Inject()，Nest 根本不知道要注入哪个类，因为 WINSTON_MODULE_NEST_PROVIDER 是一个 字符串 token，不是类名
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }
  @Get()
  getUsers(@Query() query: getUserDto): any {
    // page,limit,condition(username\role\gender),sort
    return this.userService.findAll(query);
  }

  @Get('/:id')
  getUser(): any {
    return 'hello';
    // return this.userService.findAll();
  }

  @Post()
  addUser(@Body() dto: any): any {
    console.log('🚀 ~ UserController ~ addUser ~ dto:', dto);

    const user = dto as User;
    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Req() req,
    // @Headers('Authorization') headers: any,
  ): any {
    // console.log(
    //   '🚀 ~ file: user.controller.ts ~ line 76 ~ UserController ~ headers',
    //   headers,
    // );
    if (id === parseInt(req.user?.userId)) {
      console.log(123);
      // 说明是同一个用户在修改
      // todo
      // 权限1：判断用户是否是自己
      // 权限2：判断用户是否有更新user的权限
      // 返回数据：不能包含敏感的password等信息
      const user = dto as User;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
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
  findProfile(@Query('id') id: any): any {
    return this.userService.findProfile(id);
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

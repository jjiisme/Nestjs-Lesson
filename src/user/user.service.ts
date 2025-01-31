import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userTmp = await this.userRepository.create(user);
    return this.userRepository.save(userTmp);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: { user },
      // relations: {
      //   user: true,
      // },
    });
  }

  async findLogsByGroup(id: number) {
    // SELECT `logs`.`result` AS `logs_result`,
    //  `user`.`id` AS `user_id`,
    //  `user`.`username` AS `user_username`,
    //  `user`.`password` AS `user_password`,
    //  COUNT("logs.result") AS `count`
    // FROM `logs` `logs`
    //  LEFT JOIN `user` `user` ON `user`.`id`=`logs`.`userId`
    // WHERE `user`.`id` = ? GROUP BY `logs`.`result`

    // 可以直接使用 this.logsRepository.query() 方法执行原生 SQL 语句
    return this.logsRepository
      .createQueryBuilder('logs')
      .select('logs.result', 'result')
      .addSelect('COUNT("logs.result")', 'count')
      .leftJoinAndSelect('logs.user', 'user')
      .where('user.id = :id', { id })
      .groupBy('logs.result')
      .orderBy('logs.result', 'DESC')
      .getRawMany();
  }
}

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filter/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');

  const httpAdapter = app.get(HttpAdapterHost);
  // 全局 Filter 只能有一个
  const logger = new Logger();
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

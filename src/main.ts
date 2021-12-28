import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as Mongoose from 'mongoose';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Logging DB Query
   */
  Mongoose.set('debug', (collectionName, method, query, doc, options) => {
    Logger.log(
      `${collectionName}.${method} - ${JSON.stringify(query)}`,
      'Mongoose',
    );
  });

  /**
   * Global Pipes
   */
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();

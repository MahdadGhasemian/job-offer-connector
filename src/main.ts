import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const documentOptions = new DocumentBuilder()
    .setTitle('Job Offer Connector App')
    .setDescription('Authentication Manager')
    .setVersion('1.0')
    .addServer(
      `${configService.getOrThrow<string>('SWAGGER_SERVER_HOST')}`,
      'Server',
    )
    .addTag('Job Offers')
    .build();

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configService.get<number>('HTTP_PORT', 3000));
}
bootstrap();

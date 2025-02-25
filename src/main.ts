import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const documentOptions = new DocumentBuilder()
    .setTitle('Job Offer Connector App')
    .setVersion('1.0')
    .addServer(
      `${configService.getOrThrow<string>('SWAGGER_SERVER_HOST')}`,
      'Server',
    )
    .addTag('Job Offers')
    .build();

  app.useLogger(app.get(Logger));
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(configService.get<number>('HTTP_PORT', 3000));
}
void bootstrap();

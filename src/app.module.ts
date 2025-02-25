import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { JobOffer, LoggerModule } from '@common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobService } from './job.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        SWAGGER_SERVER_HOST: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USERNAME: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DATABASE_NAME: Joi.string().required(),
        POSTGRES_SYNCHRONIZE: Joi.boolean().optional(),
        POSTGRES_AUTO_LOAD_ENTITIES: Joi.boolean().optional(),
      }),
    }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DATABASE_NAME'),
        synchronize: configService.get<boolean>('POSTGRES_SYNCHRONIZE', true),
        autoLoadEntities: configService.get(
          'POSTGRES_AUTO_LOAD_ENTITIES',
          true,
        ),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([JobOffer]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, JobService],
})
export class AppModule {}

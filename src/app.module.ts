import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JobOffersModule } from './job-offers/job-offers.module';
import { CronsModule } from './crons/crons.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_APP: Joi.number().required(),
        POSTGRES_DATABASE_NAME: Joi.string().required(),
      }),
    }),
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.get('POSTGRES_DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
    JobOffersModule,
    CronsModule,
  ],
})
export class AuthModule {}

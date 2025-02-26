import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { JobOffersService } from './job-offers.service';
import { JobOffersController } from './job-offers.controller';
import { JobOffersRepository } from './job-offers.repository';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { JobOffer } from '@app/app';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    TypeOrmModule.forFeature([JobOffer]),
    ScheduleModule.forRoot(),
  ],
  controllers: [JobOffersController],
  providers: [JobOffersService, JobOffersRepository],
})
export class JobOffersModule {}

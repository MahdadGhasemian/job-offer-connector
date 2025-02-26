import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { HttpModule } from '@nestjs/axios';
import { JobTransformer } from '@app/common';
import { JobOffersModule } from 'src/job-offers/job-offers.module';

@Module({
  imports: [HttpModule, JobOffersModule],
  providers: [CronsService, JobTransformer],
  exports: [CronsService],
})
export class CronsModule {}

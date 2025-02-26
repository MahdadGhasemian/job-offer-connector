import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { HttpModule } from '@nestjs/axios';
import { JobTransformer } from '@app/common';

@Module({
  imports: [HttpModule],
  providers: [CronsService, JobTransformer],
  exports: [CronsService],
})
export class CronsModule {}

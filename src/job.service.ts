import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobService {
  protected readonly logger = new Logger(JobService.name);

  constructor() {}

  // Runs every day at midnight
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleMidnightJob() {
    this.logger.log(' Cron Job ---------------------------');
  }
}

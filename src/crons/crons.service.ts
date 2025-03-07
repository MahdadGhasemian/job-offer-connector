import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JobTransformer } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { JobOffersService } from '../job-offers/job-offers.service';

@Injectable()
export class CronsService implements OnModuleInit {
  protected readonly logger = new Logger(CronsService.name);
  private cronJob: CronJob;

  constructor(
    private readonly jobTransformer: JobTransformer,
    private readonly jobOffersService: JobOffersService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    const cronExpression = this.getCronInterval();

    // Create a new cron job
    this.cronJob = new CronJob(cronExpression, async () => {
      this.logger.debug('Fetching jobs...');
      await this.fetchJob();
    });

    // Add the cron job to the scheduler
    this.schedulerRegistry.addCronJob('job-fetcher', this.cronJob);

    // Start the cron job
    this.cronJob.start();
  }

  private getCronInterval(): string {
    return this.configService.get('JOB_CRON_EXPRESSION', '*/10 * * * * *');
  }

  private async fetchJob() {
    try {
      const transformedJobs = await this.jobTransformer.fetchProviders();

      transformedJobs?.map(async (job) => {
        this.logger.debug(`Transformed Job: ${job.job_id} - ${job.title}`);

        // create job
        const result = await this.jobOffersService.create({
          ...job,
        });

        this.logger.debug(`Created Job: ${result.id}`);
      });
    } catch (error) {
      this.logger.error(`Error fetching jobs ${error.message}`);
    }
  }
}

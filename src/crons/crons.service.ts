import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CurrencyType, EmploymentType, JobTransformer } from '@app/common';
import { JobOffersService } from 'src/job-offers/job-offers.service';
import { ConfigService } from '@nestjs/config';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

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
          employment_type: EmploymentType.FULL_TIME,
          currency: CurrencyType.USD,
        });

        this.logger.debug(`Created Job: ${result.id}`);
      });
    } catch (error) {
      this.logger.error(`Error fetching jobs ${error.message}`);
    }
  }
}

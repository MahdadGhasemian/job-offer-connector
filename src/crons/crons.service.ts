import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JobTransformer } from '@app/common';

@Injectable()
export class CronsService {
  protected readonly logger = new Logger(CronsService.name);
  private readonly jobProviders = [
    {
      providerName: 'provider1',
      apiUrl: 'https://assignment.devotel.io/api/provider1/jobs',
    },
    {
      providerName: 'provider2',
      apiUrl: 'https://assignment.devotel.io/api/provider2/jobs',
    },
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly jobTransformer: JobTransformer,
  ) {}

  // Runs every day at midnight
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleMidnightJob() {
    this.logger.log('Fetching jobs...');
    this.fetchJob();
  }

  private async fetchJob() {
    this.logger.log('Fetching Job ---------------------------');

    for (const provider of this.jobProviders) {
      try {
        const response = await lastValueFrom(
          this.httpService.get(provider.apiUrl),
        );

        const transformedJobs = this.jobTransformer.transform(
          provider.providerName,
          response.data,
        );
        transformedJobs.forEach((job) => {
          this.logger.log(`Transformed Job: ${job.job_id} - ${job.title}`);
          console.log(job);
        });
        transformedJobs.forEach((job) => {
          this.logger.log(`Transformed Job: ${job.job_id} - ${job.title}`);
          console.log(job);
        });
      } catch (error) {
        this.logger.error(
          `Error fetching jobs from ${provider.providerName}: ${error.message}`,
        );
      }
    }
  }
}

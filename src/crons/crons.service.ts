import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CurrencyType, EmploymentType, JobTransformer } from '@app/common';
import { JobOffersService } from 'src/job-offers/job-offers.service';

@Injectable()
export class CronsService {
  protected readonly logger = new Logger(CronsService.name);

  constructor(
    private readonly jobTransformer: JobTransformer,
    private readonly jobOffersService: JobOffersService,
  ) {}

  //
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleJob() {
    this.logger.debug('Fetching jobs...');
    this.fetchJob();
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

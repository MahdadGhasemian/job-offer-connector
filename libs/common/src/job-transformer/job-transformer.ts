import { Injectable, Logger } from '@nestjs/common';
import * as jmespath from 'jmespath';
import { PROVIDER_CONFIGS, ProviderConfig } from './providers.config';
import { StandardizedJob } from './standardized-job.interface';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class JobTransformer {
  private readonly logger = new Logger(JobTransformer.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchProviders() {
    for (const provider of PROVIDER_CONFIGS) {
      try {
        const response = await lastValueFrom(
          this.httpService.get(provider.apiUrl),
        );

        const transformedJobs = this.transform(provider, response.data);

        return transformedJobs;
      } catch (error) {
        this.logger.error(
          `Error fetching jobs from ${provider.providerName}: ${error.message}`,
        );

        throw error;
      }
    }
  }

  transform(providerConfig: ProviderConfig, response: any): StandardizedJob[] {
    const jobs = jmespath.search(response, providerConfig.jobListPath) ?? [];

    return Object.entries(jobs).map(([jobId, job]: [string, any]) => {
      return this.transformJob(job, providerConfig, jobId);
    });
  }

  private transformJob(
    job: any,
    providerConfig: ProviderConfig,
    jobId: string,
  ): StandardizedJob {
    const transformedJob: Partial<StandardizedJob> = { raw_data: job };

    for (const [key, query] of Object.entries(providerConfig.mappings)) {
      transformedJob[key] =
        query === '@key'
          ? jobId
          : (jmespath.search(job, query) ?? providerConfig.defaults?.[key]);
    }

    transformedJob.min_salary = this.extractSalaryIfNeeded(
      transformedJob.min_salary,
    );
    transformedJob.max_salary = this.extractSalaryIfNeeded(
      transformedJob.max_salary,
    );

    transformedJob.posted_date = new Date(transformedJob.posted_date as any);

    return transformedJob as StandardizedJob;
  }

  private extractSalaryIfNeeded(
    salaryRange: string | number | undefined,
  ): number | undefined {
    if (typeof salaryRange === 'string') {
      const salary = this.extractSalary(salaryRange);
      return salary.min;
    }
    return salaryRange;
  }

  private extractSalary(salaryRange: string): { min: number; max: number } {
    const match = salaryRange.match(
      /\$(\d+(?:,\d{3})*)\s*-\s*\$(\d+(?:,\d{3})*)/,
    );
    return match
      ? {
          min: parseInt(match[1].replace(',', ''), 10),
          max: parseInt(match[2].replace(',', ''), 10),
        }
      : { min: 0, max: 0 };
  }
}

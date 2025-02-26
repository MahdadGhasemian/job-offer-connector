import { Injectable, Logger } from '@nestjs/common';
import * as jmespath from 'jmespath';
import { PROVIDER_CONFIGS } from './providers.config';
import { StandardizedJob } from './standardized-job.interface';

@Injectable()
export class JobTransformer {
  private readonly logger = new Logger(JobTransformer.name);

  transform(provider: string, response: any): StandardizedJob[] {
    const config = PROVIDER_CONFIGS[provider];
    if (!config) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const jobs = jmespath.search(response, config.jobListPath) ?? [];
    return Object.entries(jobs).map(([jobId, job]: [string, any]) => {
      return this.transformJob(job, config, jobId);
    });
  }

  private transformJob(
    job: any,
    config: (typeof PROVIDER_CONFIGS)['provider1'],
    jobId: string,
  ): StandardizedJob {
    const transformedJob: Partial<StandardizedJob> = { raw_data: job };

    for (const [key, query] of Object.entries(config.mappings)) {
      transformedJob[key] =
        query === '@key'
          ? jobId
          : (jmespath.search(job, query) ?? config.defaults?.[key]);
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

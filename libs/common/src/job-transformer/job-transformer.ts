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
    const jobs = [];

    for (const provider of PROVIDER_CONFIGS) {
      try {
        const response = await lastValueFrom(
          this.httpService.get(provider.apiUrl),
        );

        const transformedJobs = this.transform(provider, response.data);

        jobs.push(...transformedJobs);
      } catch (error) {
        this.logger.error(
          `Error fetching jobs from ${provider.providerName}: ${error.message}`,
        );

        throw error;
      }
    }

    return jobs;
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

    const { min_salary, max_salary } = this.extractSalaryIfNeeded(
      providerConfig.slaryRangeRegex,
      transformedJob.salary_range,
      transformedJob.min_salary,
      transformedJob.max_salary,
    );

    transformedJob.min_salary = min_salary;
    transformedJob.max_salary = max_salary;

    transformedJob.posted_date = new Date(transformedJob.posted_date as any);

    return transformedJob as StandardizedJob;
  }

  private extractSalaryIfNeeded(
    regex: RegExp,
    salary_range: string | undefined,
    min_salary: number | undefined,
    max_salary: number | undefined,
  ): { min_salary: number; max_salary: number } | undefined {
    if (salary_range && regex) {
      const salary = this.extractSalary(salary_range, regex);

      return { min_salary: salary.min, max_salary: salary.max };
    }

    return { min_salary: +min_salary, max_salary: +max_salary };
  }

  private extractSalary(
    salaryRange: string,
    regex: RegExp,
  ): { min: number; max: number } | null {
    const match = salaryRange.match(regex);
    if (match) {
      const minSalary = parseFloat(match[1]) * (match[2] === 'k' ? 1000 : 1);
      const maxSalary = parseFloat(match[3]) * (match[4] === 'k' ? 1000 : 1);

      return { min: minSalary, max: maxSalary };
    }

    return null;
  }
}

import { StandardizedJob } from './standardized-job.interface';

interface ProviderConfig {
  jobListPath: string;
  mappings: Record<string, string>;
  defaults?: Partial<StandardizedJob>;
}

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  provider1: {
    jobListPath: 'jobs',
    mappings: {
      job_id: 'jobId',
      title: 'title',
      location: 'details.location',
      employment_type: 'details.type',
      min_salary: 'details.salaryRange',
      max_salary: 'details.salaryRange',
      company_name: 'company.name',
      industry: 'company.industry',
      skills: 'skills',
      posted_date: 'postedDate',
    },
    defaults: {
      currency: 'USD',
    },
  },
  provider2: {
    jobListPath: 'data.jobsList',
    mappings: {
      job_id: '@key',
      title: 'position',
      location: "join(', ', [location.city, location.state])",
      remote: 'location.remote',
      employment_type: "'Full-Time'", // Hardcoded assumption
      min_salary: 'compensation.min',
      max_salary: 'compensation.max',
      currency: 'compensation.currency',
      company_name: 'employer.companyName',
      company_website: 'employer.website',
      skills: 'requirements.technologies',
      experience: 'requirements.experience',
      posted_date: 'datePosted',
    },
  },
};

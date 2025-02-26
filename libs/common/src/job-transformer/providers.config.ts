import { CurrencyType, EmploymentType } from '../enum';

export interface ProviderConfig {
  providerName: string;
  apiUrl: string;
  jobListPath: string;
  mappings: Record<string, string>;
  slaryRangeRegex?: RegExp;
  employmentTypeMap?: Record<string, EmploymentType>;
  currenyMap?: Record<string, CurrencyType>;
}

export const PROVIDER_CONFIGS: ProviderConfig[] = [
  // Provider 1
  {
    providerName: 'provider1',
    apiUrl: 'https://assignment.devotel.io/api/provider1/jobs',
    jobListPath: 'jobs',
    mappings: {
      provider_name: "'provider1'",
      job_id: 'jobId',
      title: 'title',
      location: 'details.location',
      employment_type: 'details.type',
      salary_range: 'details.salaryRange',
      company_name: 'company.name',
      industry: 'company.industry',
      skills: 'skills',
      posted_date: 'postedDate',
    },
    slaryRangeRegex: /\$(\d+)(k?)\s*-\s*\$(\d+)(k?)/,
    employmentTypeMap: {
      Contract: EmploymentType.CONTRACT,
      'Full-Time': EmploymentType.FULL_TIME,
    },
  },
  // Provider 2
  {
    providerName: 'provider2',
    apiUrl: 'https://assignment.devotel.io/api/provider2/jobs',
    jobListPath: 'data.jobsList',
    mappings: {
      provider_name: "'provider2'",
      job_id: '@key',
      title: 'position',
      location: "join(', ', [location.city, location.state])",
      remote: 'location.remote',
      min_salary: 'compensation.min',
      max_salary: 'compensation.max',
      currency: 'compensation.currency',
      company_name: 'employer.companyName',
      company_website: 'employer.website',
      skills: 'requirements.technologies',
      experience: 'requirements.experience',
      posted_date: 'datePosted',
    },
    currenyMap: {
      USD: CurrencyType.USD,
      EUR: CurrencyType.EUR,
    },
  },
];

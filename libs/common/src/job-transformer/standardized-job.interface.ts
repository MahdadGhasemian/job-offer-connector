import { CurrencyType, EmploymentType } from '../enum';

export interface StandardizedJob {
  provider_name: string;
  job_id: string;
  title: string;
  location: string;
  remote?: boolean;
  employment_type: EmploymentType;
  salary_range?: string;
  min_salary?: number;
  max_salary?: number;
  currency: CurrencyType;
  company_name: string;
  company_website?: string;
  industry?: string;
  skills: string[];
  experience?: number;
  posted_date: Date;
  raw_data: object;
}

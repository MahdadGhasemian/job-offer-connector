import { JobOffer } from '@app/app';
import { PaginateConfig } from 'nestjs-paginate';

export const JOB_OFFER_PAGINATION_CONFIG: PaginateConfig<JobOffer> = {
  sortableColumns: ['id', 'title', 'location', 'min_salary', 'max_salary'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title', 'location', 'min_salary', 'max_salary'],
  filterableColumns: {
    id: true,
    title: true,
    location: true,
    min_salary: true,
    max_salary: true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};

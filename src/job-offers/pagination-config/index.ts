import { JobOffer } from '@app/app';
import { PaginateConfig } from 'nestjs-paginate';

export const JOB_OFFER_PAGINATION_CONFIG: PaginateConfig<JobOffer> = {
  sortableColumns: ['id', 'title'],
  nullSort: 'last',
  defaultSortBy: [['id', 'DESC']],
  searchableColumns: ['title'],
  filterableColumns: {
    id: true,
    name: true,
  },
  maxLimit: 100,
  defaultLimit: 10,
};

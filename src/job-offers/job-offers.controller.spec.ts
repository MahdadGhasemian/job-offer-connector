import { Test, TestingModule } from '@nestjs/testing';
import { JobOffersController } from './job-offers.controller';
import { JobOffersService } from './job-offers.service';
import { Paginated } from 'nestjs-paginate';
import { JobOffer } from '@app/app';
import { CurrencyType, EmploymentType } from '@app/common';

describe('JobOffersController', () => {
  let jobOffersController: JobOffersController;
  let jobOffersService: JobOffersService;

  class MockJobOffersService {
    create = jest.fn();
    findAll = jest.fn();
    findOne = jest.fn();
    update = jest.fn();
    remove = jest.fn();
    clearItems = jest.fn();
    cancelOrder = jest.fn();
  }

  const mockJobOffer = {
    id: 1,
    provider_name: 'Provider 1',
    job_id: 'job_1',
    title: 'job 1',
    location: '',
    remote: true,
    employment_type: EmploymentType.FULL_TIME,
    min_salary: 10000,
    max_salary: 500000,
    currency: CurrencyType.USD,
    company_name: '',
    company_website: '',
    industry: '',
    skills: [],
    experience: 5,
    posted_date: new Date(),
    raw_data: {},
  };

  const mockOrderPagination: Paginated<JobOffer> = {
    data: [mockJobOffer],
    meta: {
      itemsPerPage: 10,
      totalItems: 100,
      currentPage: 1,
      totalPages: 10,
      sortBy: [['id', 'DESC']],
      searchBy: [],
      search: '',
      select: [],
    },
    links: {
      current: '',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobOffersController],
      providers: [
        {
          provide: JobOffersService,
          useClass: MockJobOffersService,
        },
      ],
    }).compile();

    jobOffersController = module.get<JobOffersController>(JobOffersController);
    jobOffersService = module.get<JobOffersService>(JobOffersService);
  });

  it('should be defined', () => {
    expect(jobOffersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all job-offers', async () => {
      const findAllSpy = jest
        .spyOn(jobOffersService, 'findAll')
        .mockResolvedValue(mockOrderPagination);

      const result = await jobOffersController.findAll({ path: '' });

      expect(result).toMatchObject(mockOrderPagination);
      expect(findAllSpy).toHaveBeenCalledWith({ path: '' });
    });
  });
});

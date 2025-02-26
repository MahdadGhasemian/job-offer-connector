import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyType, EmploymentType } from '@app/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { JobOffersService } from './job-offers.service';
import { JobOffersRepository } from './job-offers.repository';
import { JobOffer } from '@app/app';

describe('JobOffersService', () => {
  let jobOffersService: JobOffersService;
  let jobOffersRepository: JobOffersRepository;

  class MockRepositoryClass {
    create = jest.fn();
    findOneNoCheck = jest.fn();
    findOne = jest.fn();
    findOneAndUpdate = jest.fn();
    find = jest.fn();
    findBy = jest.fn();
    findOneAndDelete = jest.fn();
  }

  jest.mock('nestjs-paginate', () => ({
    paginate: jest.fn().mockResolvedValue({
      data: [mockJobOffer],
      meta: { total: 1, currentPage: 1, perPage: 10 },
    }),
  }));

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

  const createJobOfferDto: CreateJobOfferDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobOffersService,
        {
          provide: JobOffersRepository,
          useClass: MockRepositoryClass,
        },
      ],
    }).compile();

    jobOffersService = module.get<JobOffersService>(JobOffersService);
    jobOffersRepository = module.get<JobOffersRepository>(JobOffersRepository);
  });

  it('should be defined', () => {
    expect(jobOffersService).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a job offer', async () => {
      jest.spyOn(jobOffersRepository, 'create').mockResolvedValue(mockJobOffer);
      jest
        .spyOn(jobOffersRepository, 'findOne')
        .mockResolvedValue(mockJobOffer);

      const result = await jobOffersService.create(createJobOfferDto);

      expect(result).toEqual(mockJobOffer);
      expect(jobOffersRepository.create).toHaveBeenCalledWith(
        expect.any(JobOffer),
      );
      expect(jobOffersRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single job offer', async () => {
      jest
        .spyOn(jobOffersRepository, 'findOne')
        .mockResolvedValue(mockJobOffer);

      const result = await jobOffersService.findOne({ id: 1 });

      expect(result).toEqual(mockJobOffer);
      expect(jobOffersRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });
});

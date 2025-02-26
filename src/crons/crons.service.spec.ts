import { Test, TestingModule } from '@nestjs/testing';
import { JobTransformer } from '@app/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { CronsService } from './crons.service';
import { ConfigService } from '@nestjs/config';
import { JobOffersService } from '../job-offers/job-offers.service';

describe('CronsService', () => {
  let cronsService: CronsService;
  let jobTransformer: JobTransformer;
  let jobOffersService: JobOffersService;
  let schedulerRegistry: SchedulerRegistry;

  const mockJob = {
    job_id: 'job_1',
    title: 'Software Engineer',
    provider_name: 'Provider 1',
    location: '',
    remote: true,
    employment_type: 'FULL_TIME',
    min_salary: 10000,
    max_salary: 500000,
    currency: 'USD',
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
        CronsService,
        {
          provide: JobTransformer,
          useValue: { fetchProviders: jest.fn().mockResolvedValue([mockJob]) },
        },
        {
          provide: JobOffersService,
          useValue: { create: jest.fn().mockResolvedValue({ id: 1 }) },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('*/10 * * * * *') },
        },
        {
          provide: SchedulerRegistry,
          useValue: { addCronJob: jest.fn() },
        },
      ],
    }).compile();

    cronsService = module.get<CronsService>(CronsService);
    jobTransformer = module.get<JobTransformer>(JobTransformer);
    jobOffersService = module.get<JobOffersService>(JobOffersService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);

    jest.spyOn(cronsService['logger'], 'debug').mockImplementation(() => {});
    jest.spyOn(cronsService['logger'], 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    cronsService['cronJob']?.stop();
  });

  it('should be defined', () => {
    expect(cronsService).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize and start the cron job', () => {
      const addCronJobSpy = jest.spyOn(schedulerRegistry, 'addCronJob');

      cronsService.onModuleInit();

      expect(addCronJobSpy).toHaveBeenCalled();
      expect(addCronJobSpy).toHaveBeenCalledWith(
        'job-fetcher',
        expect.any(CronJob),
      );
    });
  });

  describe('fetchJob', () => {
    it('should fetch and create job offers', async () => {
      await cronsService['fetchJob']();

      expect(jobTransformer.fetchProviders).toHaveBeenCalledTimes(1);
      expect(jobOffersService.create).toHaveBeenCalledWith(mockJob);
      expect(jobOffersService.create).toHaveBeenCalledTimes(1);
    });

    it('should log an error if fetchProviders fails', async () => {
      jest
        .spyOn(jobTransformer, 'fetchProviders')
        .mockRejectedValue(new Error('Fetch error'));

      await cronsService['fetchJob']();

      expect(cronsService['logger'].error).toHaveBeenCalledWith(
        'Error fetching jobs Fetch error',
      );
    });
  });
});

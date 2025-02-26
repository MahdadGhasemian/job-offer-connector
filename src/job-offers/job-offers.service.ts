import { Injectable, Logger } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { JobOffersRepository } from './job-offers.repository';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { JOB_OFFER_PAGINATION_CONFIG } from './pagination-config';
import { GetJobOfferDto } from './dto/get-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOffer } from '@app/app';

@Injectable()
export class JobOffersService {
  protected readonly logger = new Logger(JobOffersService.name);

  constructor(private readonly jobOffersRepository: JobOffersRepository) {}

  async create(createJobOfferDto: CreateJobOfferDto) {
    // Check if a job offer with the same provider_name and job_id already exists
    const existingJobOffer = await this.jobOffersRepository.findOneNoCheck({
      provider_name: createJobOfferDto.provider_name,
      job_id: createJobOfferDto.job_id,
    });

    if (existingJobOffer) {
      // If the job offer already exists, return the existing one
      this.logger.debug(
        `Job offer with provider_name: ${createJobOfferDto.provider_name} and job_id: ${createJobOfferDto.job_id} already exists.`,
      );
      return existingJobOffer;
    }

    // If no existing job offer is found, create a new one
    const jobOffer = new JobOffer({
      ...createJobOfferDto,
    });

    const result = await this.jobOffersRepository.create(jobOffer);

    // Return the newly created job offer
    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.jobOffersRepository.entityRepository,
      JOB_OFFER_PAGINATION_CONFIG,
    );
  }

  async findOne(getJobOfferDto: Omit<GetJobOfferDto, 'skills'>) {
    return this.jobOffersRepository.findOne({
      ...getJobOfferDto,
    });
  }

  async update(id: number, updateJobOfferDto: UpdateJobOfferDto) {
    const updateData: Partial<JobOffer> = {
      ...updateJobOfferDto,
    };

    const result = await this.jobOffersRepository.findOneAndUpdate(
      { id },
      { ...updateData },
    );

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.jobOffersRepository.findOneAndDelete({ id });
  }
}

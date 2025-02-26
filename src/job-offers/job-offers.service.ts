import { Injectable } from '@nestjs/common';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { JobOffersRepository } from './job-offers.repository';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { JOB_OFFER_PAGINATION_CONFIG } from './pagination-config';
import { GetJobOfferDto } from './dto/get-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOffer } from '@app/app';

@Injectable()
export class JobOffersService {
  constructor(private readonly jobOffersRepository: JobOffersRepository) {}

  async create(createJobOfferDto: CreateJobOfferDto) {
    const jobOffer = new JobOffer({
      ...createJobOfferDto,
    });

    const result = await this.jobOffersRepository.create(jobOffer);

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

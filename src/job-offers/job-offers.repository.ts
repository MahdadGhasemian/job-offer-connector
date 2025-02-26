import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AbstractRepository } from '@app/common';
import { JobOffer } from '@app/app';

@Injectable()
export class JobOffersRepository extends AbstractRepository<JobOffer> {
  protected readonly logger = new Logger(JobOffersRepository.name);

  constructor(
    @InjectRepository(JobOffer) jobOffersRepository: Repository<JobOffer>,
    entityManager: EntityManager,
  ) {
    super(jobOffersRepository, entityManager);
  }
}

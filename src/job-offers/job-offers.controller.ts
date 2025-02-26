import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobOffersService } from './job-offers.service';

import { ListJobOfferDto } from './dto/list-job-offer.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { JOB_OFFER_PAGINATION_CONFIG } from './pagination-config';
import { Serialize } from '@app/common';

@ApiTags('Job Offers')
@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  @Get()
  @Serialize(ListJobOfferDto)
  @PaginatedSwaggerDocs(ListJobOfferDto, JOB_OFFER_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.jobOffersService.findAll(query);
  }
}

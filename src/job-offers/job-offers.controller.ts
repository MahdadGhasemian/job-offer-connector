import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JobOffersService } from './job-offers.service';
import { GetJobOfferDto } from './dto/get-job-offer.dto';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { ListJobOfferDto } from './dto/list-job-offer.dto';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { JOB_OFFER_PAGINATION_CONFIG } from './pagination-config';
import { Serialize } from '@app/common';

@ApiTags('Job Offers')
@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  @Post()
  @Serialize(GetJobOfferDto)
  @ApiOkResponse({
    type: GetJobOfferDto,
  })
  async create(@Body() createJobOfferDto: CreateJobOfferDto) {
    return this.jobOffersService.create(createJobOfferDto);
  }

  @Get()
  @Serialize(ListJobOfferDto)
  @PaginatedSwaggerDocs(ListJobOfferDto, JOB_OFFER_PAGINATION_CONFIG)
  async findAll(@Paginate() query: PaginateQuery) {
    return this.jobOffersService.findAll(query);
  }
}

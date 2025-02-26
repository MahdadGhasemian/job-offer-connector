import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetJobOfferDto } from './get-job-offer.dto';
import { ListDto } from '@app/common';

export class ListJobOfferDto extends ListDto<GetJobOfferDto> {
  @IsArray()
  @Type(() => GetJobOfferDto)
  @Expose()
  data: GetJobOfferDto[];
}

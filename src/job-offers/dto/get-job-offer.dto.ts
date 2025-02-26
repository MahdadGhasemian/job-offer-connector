import { AbstractGetDto } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetJobOfferDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'Job 1',
    required: true,
  })
  @IsString()
  @Expose()
  title?: string;
}

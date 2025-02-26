import { AbstractGetDto, CurrencyType, EmploymentType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
    example: 'Job ID 1',
    required: true,
  })
  @IsString()
  @Expose()
  job_id?: string;

  @ApiProperty({
    example: 'Job 1',
    required: true,
  })
  @IsString()
  @Expose()
  title?: string;

  @ApiProperty({
    example: 'New York',
    required: true,
  })
  @IsString()
  @Expose()
  location?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  remote?: boolean;

  @ApiProperty({
    example: EmploymentType.FULL_TIME,
    enum: EmploymentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  @Expose()
  employment_type?: EmploymentType;

  @ApiProperty({
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  min_salary?: number;

  @ApiProperty({
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  max_salary?: number;

  @ApiProperty({
    example: CurrencyType.USD,
    enum: CurrencyType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CurrencyType)
  @Expose()
  currency?: CurrencyType;

  @ApiProperty({
    example: 'Company A',
    required: true,
  })
  @IsString()
  @Expose()
  company_name?: string;

  @ApiProperty({
    example: 'https://company-a.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  company_website?: string;

  @ApiProperty({
    example: 'Technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  industry?: string;

  @ApiProperty({
    example: ['JavaScript', 'Node.js'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Expose()
  skills?: string[];

  @ApiProperty({
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  experience?: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsString()
  @IsDateString()
  @Expose()
  posted_date?: Date;
}

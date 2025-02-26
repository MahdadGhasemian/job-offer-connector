import { CurrencyType, EmploymentType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsArray,
  IsObject,
  IsDateString,
} from 'class-validator';

export class CreateJobOfferDto {
  @ApiProperty({
    example: 'Job ID 1',
    required: true,
  })
  @IsString()
  job_id?: string;

  @ApiProperty({
    example: 'Job 1',
    required: true,
  })
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'New York',
    required: true,
  })
  @IsString()
  location?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  remote?: boolean;

  @ApiProperty({
    example: EmploymentType.FULL_TIME,
    enum: EmploymentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(EmploymentType)
  employment_type?: EmploymentType;

  @ApiProperty({
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  min_salary?: number;

  @ApiProperty({
    example: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  max_salary?: number;

  @ApiProperty({
    example: CurrencyType.USD,
    enum: CurrencyType,
    required: false,
  })
  @IsOptional()
  @IsEnum(CurrencyType)
  currency?: CurrencyType;

  @ApiProperty({
    example: 'Company A',
    required: true,
  })
  @IsString()
  company_name: string;

  @ApiProperty({
    example: 'https://company-a.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_website?: string;

  @ApiProperty({
    example: 'Technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiProperty({
    example: ['JavaScript', 'Node.js'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  experience?: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsString()
  @IsDateString()
  posted_date?: Date;

  @ApiProperty({
    example: { key: 'value' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  raw_data?: object;
}

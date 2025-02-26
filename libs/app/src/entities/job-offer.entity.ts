import { AbstractEntity, CurrencyType, EmploymentType } from '@app/common';
import { Column, Entity, Index } from 'typeorm';

@Entity('job_offers')
export class JobOffer extends AbstractEntity<JobOffer> {
  @Column()
  job_id: string;

  @Column()
  @Index()
  title: string;

  @Column()
  @Index()
  location: string;

  @Column({ nullable: true, default: false })
  remote: boolean;

  @Column({
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  @Index()
  employment_type: EmploymentType;

  @Column({ type: 'decimal', nullable: true })
  min_salary: number;

  @Column({ type: 'decimal', nullable: true })
  max_salary: number;

  @Column({
    type: 'enum',
    enum: CurrencyType,
    default: CurrencyType.USD,
  })
  @Index()
  currency: CurrencyType;

  @Column()
  company_name: string;

  @Column({ nullable: true })
  company_website: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ type: 'jsonb', default: [] })
  skills: string[];

  @Column({ nullable: true })
  experience: number;

  @Column({ type: 'timestamp' })
  posted_date: Date;

  @Column({ type: 'jsonb' })
  raw_data: object;
}

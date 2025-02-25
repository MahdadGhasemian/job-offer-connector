import { AbstractEntity } from '@common/database';
import { Column, Entity } from 'typeorm';

@Entity()
export class JobOffer extends AbstractEntity<JobOffer> {
  @Column({ nullable: true })
  title: string;
}

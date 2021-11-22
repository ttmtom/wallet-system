import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn('uuid')
  id: string;

  @Column('float')
  amount: number;

  @Column('uuid')
  from: string;

  @Column('uuid')
  to: string;
}

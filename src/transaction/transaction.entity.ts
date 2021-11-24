import { TransactionStatus } from '@constants/transactionStatus';
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

  @Column('text')
  status: TransactionStatus;

  @Column('timestamp')
  createAr: Date;

  @Column('timestamp')
  lastUpdate: Date;
}

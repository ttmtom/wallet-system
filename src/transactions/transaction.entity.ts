import { TransactionStatus } from '@constants/transactionStatus';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryColumn('uuid')
  id: string;

  @Column('numeric')
  amount: number;

  @Column('uuid')
  from: string;

  @Column('uuid')
  to: string;

  @Column('text')
  status: TransactionStatus;

  @Column('text')
  remark = '';

  @Column('timestamp')
  createAt: Date;

  @Column('timestamp')
  updateAt: Date;

  constructor(id: string, amount: number, from: string, to: string) {
    this.id = id;
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.status = TransactionStatus.PENDING;
    this.createAt = this.updateAt = new Date();
  }
}

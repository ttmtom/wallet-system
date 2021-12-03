import { TransactionStatus } from '@constants/transactionStatus';
import { Wallet } from '@wallet/wallet.entity';
import { BaseDBObject } from 'src/db/baseBDObject';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Transactions extends BaseDBObject {
  @Column('numeric')
  amount: number;

  @ManyToOne(() => Wallet, (wallet: Wallet) => wallet.payRecords, {
    nullable: false,
    eager: true,
  })
  from: Wallet;

  @ManyToOne(() => Wallet, (wallet: Wallet) => wallet.chargeRecords, {
    nullable: false,
    eager: true,
  })
  to: Wallet;

  @Column('text')
  status: TransactionStatus;

  @Column('text')
  remark = '';

  constructor(id: string, amount: number, from: Wallet, to: Wallet) {
    super();
    this.id = id;
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.status = TransactionStatus.PENDING;
  }
}

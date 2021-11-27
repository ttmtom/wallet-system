import { TransactionStatus } from '@constants/transactionStatus';
import { Wallet } from '@wallet/wallet.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryColumn('uuid')
  id: string;

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

  @Column('timestamp')
  createAt: Date;

  @Column('timestamp')
  updateAt: Date;

  constructor(id: string, amount: number, from: Wallet, to: Wallet) {
    this.id = id;
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.status = TransactionStatus.PENDING;
    this.createAt = this.updateAt = new Date();
  }
}
